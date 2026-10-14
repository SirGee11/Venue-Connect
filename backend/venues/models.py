from django.db import models
from django.conf import settings

# Create your models here.

class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name


class EventType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Venue(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending Approval"
        APPROVED = "approved", "Approved"
        SUSPENDED = "suspended", "Suspended"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="venues",
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, default="gardens", blank=True)
    tagline = models.CharField(max_length=255, blank=True, default="")
    description = models.TextField(blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2)  # price per day
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    capacity = models.PositiveIntegerField()
    location = models.CharField(max_length=255)  # City e.g. Bulawayo, Harare
    suburb = models.CharField(max_length=100, blank=True, default="")
    address = models.CharField(max_length=255, blank=True, default="")
    rating = models.FloatField(default=5.0)
    review_count = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    rules = models.JSONField(default=list, blank=True)
    amenities = models.ManyToManyField(Amenity, blank=True, related_name="venues")
    event_types = models.ManyToManyField(EventType, blank=True, related_name="venues")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class VenuePhoto(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name="photos"
    )
    url = models.URLField(max_length=500)
    is_cover = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_cover", "uploaded_at"]

    def __str__(self):
        return f"Photo for {self.venue.name} ({self.id})"


class VenueAvailability(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name="availability"
    )
    date = models.DateField()
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ("venue", "date")
        verbose_name_plural = "Availabilities"

    def __str__(self):
        return f"{self.venue.name} - {self.date}: {'Available' if self.is_available else 'Booked'}"
