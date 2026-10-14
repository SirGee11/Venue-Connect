from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q

from .models import Booking
from .serializers import BookingSerializer
from notifications.models import Notification


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'venue', 'client', 'event_date']
    search_fields = ['customer_name', 'customer_email', 'venue__name', 'event_type']
    ordering_fields = ['created_at', 'event_date', 'total_price']
    ordering = ['-created_at']

    def get_queryset(self):
        user = self.request.user
        qs = Booking.objects.all().select_related('venue', 'client', 'venue__owner')

        if user and user.is_authenticated:
            # Platform administrators see all bookings across Zimbabwe
            if user.is_staff or (getattr(user, 'profile', None) and user.profile.role == 'admin'):
                return qs

            # Venue owners see bookings for their listed venues OR bookings they made themselves
            if getattr(user, 'profile', None) and user.profile.role == 'owner':
                return qs.filter(
                    Q(venue__owner=user) | Q(client=user) | Q(customer_email__iexact=user.email)
                )

            # Customers see ONLY bookings they made themselves
            return qs.filter(
                Q(client=user) | Q(customer_email__iexact=user.email)
            )

        # For unauthenticated requests with email filter
        customer_email = self.request.query_params.get('customer_email') or self.request.query_params.get('customerEmail')
        if customer_email:
            return qs.filter(customer_email__iexact=customer_email)

        return qs

    def perform_create(self, serializer):
        user = self.request.user if (self.request.user and self.request.user.is_authenticated) else None
        booking = serializer.save(client=user)

        # Notify venue owner if owner exists
        if booking.venue and booking.venue.owner:
            Notification.objects.create(
                user=booking.venue.owner,
                type='booking_request',
                message=f"New booking request received for {booking.venue.name} on {booking.event_date} from {booking.customer_name or 'Guest'}."
            )

    @action(detail=True, methods=['post', 'patch'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'Cancelled'
        booking.save()

        # Notify owner and client
        recipients = [u for u in [booking.client, booking.venue.owner if booking.venue else None] if u]
        for recipient in set(recipients):
            Notification.objects.create(
                user=recipient,
                type='booking_cancelled',
                message=f"Reservation #{booking.id} for {booking.venue.name if booking.venue else 'Venue'} has been cancelled."
            )

        return Response({'status': 'Reservation cancelled successfully', 'booking': BookingSerializer(booking).data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'patch'])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'Confirmed'
        booking.save()

        if booking.client:
            Notification.objects.create(
                user=booking.client,
                type='booking_confirmed',
                message=f"Great news! Your booking at {booking.venue.name} for {booking.event_date} has been confirmed."
            )

        return Response({'status': 'Reservation confirmed successfully', 'booking': BookingSerializer(booking).data}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post', 'patch'])
    def decline(self, request, pk=None):
        booking = self.get_object()
        booking.status = 'Declined'
        booking.save()

        if booking.client:
            Notification.objects.create(
                user=booking.client,
                type='booking_declined',
                message=f"Your booking request at {booking.venue.name} for {booking.event_date} could not be accepted."
            )

        return Response({'status': 'Reservation declined successfully', 'booking': BookingSerializer(booking).data}, status=status.HTTP_200_OK)