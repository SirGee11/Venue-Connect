from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Booking
from .serializers import BookingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filter by client instead of user
        return Booking.objects.filter(client=self.request.user)

    def perform_create(self, serializer):
        # Attach client user
        serializer.save(client=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status in ['cancelled', 'completed']:
            return Response(
                {'detail': f'Cannot cancel a booking that is {booking.status}.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        booking.status = 'cancelled'
        booking.save()
        return Response({'status': 'Booking cancelled successfully'}, status=status.HTTP_200_OK)