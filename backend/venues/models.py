from django.db import models
from django.conf import settings

# Create your models here.

class Amenity(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name


class EventType(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Venue(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending Approval"
        APPROVED = "approved", "Approved"
        SUSPENDED = "suspended", "Suspended"

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="venues"
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.PositiveIntegerField()
    location = models.CharField(max_length=255)
    amenities = models.ManyToManyField(Amenity, blank=True)
    event_types = models.ManyToManyField(EventType, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class VenuePhoto(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name="photos"
    )
    url = models.URLField()
    is_cover = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-is_cover", "uploaded_at"]

class VenueAvailability(models.Model):
    venue = models.ForeignKey(
        Venue, on_delete=models.CASCADE, related_name="availability"
    )
    date = models.DateField()
    is_available = models.BooleanField(default=True)

    class Meta:
        unique_together = ("venue", "date")
        verbose_name_plural = "Availabilities"

