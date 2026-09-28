from django.db import models
from django.conf import settings


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('declined', 'Declined'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]

    # Foreign Keys matching schema (client_id, venue_id)
    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        db_column='client_id'
    )
    venue = models.ForeignKey(
        'venues.Venue',
        on_delete=models.CASCADE,
        related_name='bookings',
        db_column='venue_id'
    )

    # Date, Time & Details
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    event_type = models.CharField(max_length=100, blank=True, null=True)
    guest_count = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    # Status & Timestamps
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'
        ordering = ['-start_time']

    def __str__(self):
        return f"Booking {self.id} - {self.event_type} (Client: {self.client_id})"