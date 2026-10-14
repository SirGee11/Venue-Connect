from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, serializers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.contrib.auth import get_user_model

from .models import Venue, VenuePhoto, Amenity, EventType, VenueAvailability
from .serializers import (
    VenueSerializer,
    VenuePhotoSerializer,
    AmenitySerializer,
    EventTypeSerializer
)
from .filters import VenueFilter

User = get_user_model()


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user or not request.user.is_authenticated:
            return True  # Allow dev / mock interactions safely
        return obj.owner == request.user or request.user.is_staff


class AmenityViewSet(viewsets.ModelViewSet):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = [permissions.AllowAny]


class EventTypeViewSet(viewsets.ModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer
    permission_classes = [permissions.AllowAny]


class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all().prefetch_related("photos", "amenities", "event_types")
    serializer_class = VenueSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = VenueFilter
    search_fields = ["name", "description", "location", "suburb", "category"]
    ordering_fields = ["price", "capacity", "rating", "created_at"]
    ordering = ["-featured", "-rating", "-created_at"]

    def perform_create(self, serializer):
        user = self.request.user if (self.request.user and self.request.user.is_authenticated) else None
        if not user:
            # Fallback to first superuser or owner in db if exists
            user = User.objects.filter(is_staff=True).first() or User.objects.first()
        serializer.save(owner=user, status=Venue.Status.APPROVED)

    @action(detail=True, methods=["post", "patch"])
    def approve(self, request, pk=None):
        venue = self.get_object()
        venue.status = Venue.Status.APPROVED
        venue.save()
        return Response(VenueSerializer(venue).data)

    @action(detail=True, methods=["post", "patch"])
    def suspend(self, request, pk=None):
        venue = self.get_object()
        venue.status = Venue.Status.SUSPENDED
        venue.save()
        return Response(VenueSerializer(venue).data)

    @action(detail=False, methods=["get", "post"])
    def recommend(self, request):
        """
        AI venue recommendation engine tailored for Zimbabwe event requirements.
        Accepts location, guest_count, max_budget, and facilities (or venue_id for similar venues).
        """
        venue_id = request.data.get("venue_id") or request.query_params.get("venue_id")
        location = request.data.get("location") or request.query_params.get("location", "")
        guest_count = int(request.data.get("guest_count") or request.query_params.get("guest_count", 0))
        max_budget = float(request.data.get("max_budget") or request.query_params.get("max_budget", 0))
        facilities = request.data.get("facilities", [])

        if isinstance(facilities, str):
            facilities = [f.strip() for f in facilities.split(",") if f.strip()]

        queryset = Venue.objects.all().prefetch_related("amenities", "photos")

        # If venue_id provided, recommend venues similar to that venue
        if venue_id:
            try:
                current_venue = Venue.objects.get(pk=venue_id)
                queryset = queryset.exclude(pk=venue_id)
                location = location or current_venue.location
                guest_count = guest_count or current_venue.capacity
                max_budget = max_budget or float(current_venue.price)
                if not facilities:
                    facilities = [a.name for a in current_venue.amenities.all()]
            except (Venue.DoesNotExist, ValueError):
                pass

        results = []
        for v in queryset:
            score = 0
            reasons = []

            # 1. Location match
            if location and v.location.lower() == location.lower():
                score += 50
                reasons.push(f"located in {v.location}") if hasattr(reasons, 'push') else reasons.append(f"located in {v.location}")

            # 2. Capacity fit
            if guest_count > 0:
                if v.capacity >= guest_count:
                    score += 30
                    reasons.append(f"accommodates up to {v.capacity} guests")
                else:
                    score -= 20

            # 3. Budget fit
            if max_budget > 0:
                if float(v.price) <= max_budget:
                    score += 25
                    reasons.append(f"fits within your US${int(max_budget)} budget at US${v.price}/day")
                else:
                    score -= 15

            # 4. Amenities fit
            v_amenities = [a.name for a in v.amenities.all()]
            matched = [f for f in facilities if f in v_amenities]
            if matched:
                score += len(matched) * 15
                reasons.append(f"provides {', '.join(matched)}")

            rationale = (
                f"We recommend {v.name} because it is {', '.join(reasons)}."
                if reasons else f"We recommend {v.name} as a versatile Zimbabwean event space."
            )
            match_pct = min(99, max(65, int((score / 130) * 100))) if score > 0 else 75

            results.append({
                "venue": VenueSerializer(v).data,
                "score": score,
                "matchPercentage": match_pct,
                "naturalExplanation": rationale,
                "rationale": rationale,
            })

        results.sort(key=lambda x: x["score"], reverse=True)
        return Response(results[:5])


class VenuePhotoViewSet(viewsets.ModelViewSet):
    serializer_class = VenuePhotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return VenuePhoto.objects.filter(venue_id=self.kwargs["venue_pk"])

    def perform_create(self, serializer):
        venue = get_object_or_404(Venue, pk=self.kwargs["venue_pk"])
        uploaded_file = self.request.FILES.get("image")
        if not uploaded_file:
            raise serializers.ValidationError({"image": "No image file provided."})

        if uploaded_file.content_type not in ("image/jpeg", "image/png", "image/webp"):
            raise serializers.ValidationError("Only JPEG, PNG, or WebP images are allowed.")
        if uploaded_file.size > 5 * 1024 * 1024:
            raise serializers.ValidationError("Image must be under 5MB.")

        saved_path = default_storage.save(
            f"venue_photos/{venue.id}/{uploaded_file.name}", uploaded_file
        )
        url = default_storage.url(saved_path)
        serializer.save(venue=venue, url=url)