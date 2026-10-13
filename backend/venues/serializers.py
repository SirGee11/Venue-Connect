from rest_framework import serializers
from .models import Venue, VenuePhoto, Amenity, EventType

class VenuePhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = VenuePhoto
        fields = ["id", "url", "is_cover", "uploaded_at"]

class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ["id", "name"]


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ["id", "name"]


class VenueSerializer(serializers.ModelSerializer):
    photos = VenuePhotoSerializer(many=True, read_only=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    event_types = EventTypeSerializer(many=True, read_only=True)
    amenity_ids = serializers.PrimaryKeyRelatedField(
        source="amenities", queryset=Amenity.objects.all(),
        many=True, write_only=True, required=False,
    )
    event_type_ids = serializers.PrimaryKeyRelatedField(
        source="event_types", queryset=EventType.objects.all(),
        many=True, write_only=True, required=False,
    )

    class Meta:
        model = Venue
        fields = [
            "id", "owner", "name", "description", "price", "capacity",
            "location", "amenities", "amenity_ids", "event_types",
            "event_type_ids", "status", "photos", "created_at", "updated_at",
        ]
        read_only_fields = ["status", "created_at", "updated_at"]