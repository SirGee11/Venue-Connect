from django.db import models
from django.conf import settings


class Booking(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('Declined', 'Declined'),
        ('Cancelled', 'Cancelled'),
        ('Completed', 'Completed'),
    ]

    client = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='bookings',
    )
    venue = models.ForeignKey(
        'venues.Venue',
        on_delete=models.CASCADE,
        related_name='bookings',
    )

    customer_name = models.CharField(max_length=150, blank=True, default='')
    customer_email = models.EmailField(blank=True, default='')
    customer_phone = models.CharField(max_length=50, blank=True, default='')

    event_date = models.DateField(null=True, blank=True)
    start_time = models.CharField(max_length=50, blank=True, default='')
    end_time = models.CharField(max_length=50, blank=True, default='')
    event_type = models.CharField(max_length=100, blank=True, default='')
    guest_count = models.IntegerField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    notes = models.TextField(blank=True, default='')

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='Pending'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']

    def __str__(self):
        venue_name = self.venue.name if self.venue else "Unknown Venue"
        return f"Booking #{self.id} - {venue_name} ({self.customer_name or 'Guest'})"