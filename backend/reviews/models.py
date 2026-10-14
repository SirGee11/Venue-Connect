from django.db import models
from django.conf import settings


class Review(models.Model):
    venue = models.ForeignKey(
        'venues.Venue',
        on_delete=models.CASCADE,
        related_name='reviews',
        null=True,
        blank=True
    )
    booking = models.OneToOneField(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='review',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='reviews'
    )
    author_name = models.CharField(max_length=150, blank=True, default='')
    rating = models.PositiveSmallIntegerField(default=5)
    comment = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Review ({self.rating}/5) for {self.venue.name if self.venue else 'Venue'}"
