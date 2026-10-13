from django.contrib import admin
from .models import Venue, VenuePhoto, VenueAvailability, Amenity, EventType

# Register your models here.

admin.site.register(Venue)
admin.site.register(VenuePhoto)
admin.site.register(VenueAvailability)
admin.site.register(Amenity)
admin.site.register(EventType)