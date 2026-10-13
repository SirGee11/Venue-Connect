from django.shortcuts import render
from rest_framework import viewsets, permissions,serializers
from .models import Venue,VenuePhoto
from .serializers import VenueSerializer,VenuePhotoSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import VenueFilter
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.files.storage import default_storage


# Create your views here.

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user


class VenueViewSet(viewsets.ModelViewSet):
    queryset = Venue.objects.all()
    serializer_class = VenueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_class = VenueFilter

    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, status=Venue.Status.PENDING)

class VenuePhotoViewSet(viewsets.ModelViewSet):
    serializer_class = VenuePhotoSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return VenuePhoto.objects.filter(venue_id=self.kwargs["venue_pk"])

    def perform_create(self, serializer):
        venue = Venue.objects.get(pk=self.kwargs["venue_pk"])
        uploaded_file = self.request.FILES["image"]

        # basic validation before it ever reaches S3 bucket
        if uploaded_file.content_type not in ("image/jpeg", "image/png", "image/webp"):
            raise serializers.ValidationError("Only JPEG, PNG, or WebP images are allowed.")
        if uploaded_file.size > 5 * 1024 * 1024:  # 5MB
            raise serializers.ValidationError("Image must be under 5MB.")

        saved_path = default_storage.save(
            f"venue_photos/{venue.id}/{uploaded_file.name}", uploaded_file
        )
        url = default_storage.url(saved_path)

        serializer.save(venue=venue, url=url)



    