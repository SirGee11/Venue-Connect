from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().select_related('venue', 'user')
    serializer_class = ReviewSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['venue', 'rating']
