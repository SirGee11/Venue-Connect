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
    images = serializers.SerializerMethodField()
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    ownerId = serializers.SerializerMethodField()
    ownerEmail = serializers.ReadOnlyField(source='owner.email')
    ownerUsername = serializers.ReadOnlyField(source='owner.username')
    
    # Frontend aliases
    title = serializers.CharField(source="name", required=False)
    name = serializers.CharField(required=False)
    price = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    pricePerDay = serializers.DecimalField(source="price", max_digits=10, decimal_places=2, required=False)
    pricePerHour = serializers.DecimalField(source="price_per_hour", max_digits=10, decimal_places=2, required=False, allow_null=True)
    reviewCount = serializers.IntegerField(source="review_count", required=False)

    amenities = serializers.SerializerMethodField()
    amenity_names = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    event_types = EventTypeSerializer(many=True, read_only=True)
    event_type_names = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    new_images = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Venue
        fields = [
            "id", "owner", "ownerId", "ownerEmail", "ownerUsername", "name", "title", "category", "tagline",
            "description", "price", "pricePerDay", "price_per_hour", "pricePerHour",
            "capacity", "location", "suburb", "address", "rating", "review_count",
            "reviewCount", "featured", "status", "rules", "photos", "images",
            "amenities", "amenity_names", "event_types", "event_type_names",
            "new_images", "created_at", "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]

    def to_internal_value(self, data):
        data = data.copy()
        if 'title' in data and 'name' not in data:
            data['name'] = data['title']
        if 'pricePerDay' in data and 'price' not in data:
            data['price'] = data['pricePerDay']
        if 'pricePerHour' in data and 'price_per_hour' not in data:
            data['price_per_hour'] = data['pricePerHour']
        return super().to_internal_value(data)

    def get_images(self, obj):
        return [photo.url for photo in obj.photos.all()]

    def get_ownerId(self, obj):
        return f"u{obj.owner_id}" if obj.owner_id else "u2"

    def get_amenities(self, obj):
        return [a.name for a in obj.amenities.all()]

    def create(self, validated_data):
        amenity_names = validated_data.pop("amenity_names", [])
        event_type_names = validated_data.pop("event_type_names", [])
        new_images = validated_data.pop("new_images", [])

        # If name is missing but title was passed
        if "name" not in validated_data and "title" in self.initial_data:
            validated_data["name"] = self.initial_data["title"]
        if "price" not in validated_data and "pricePerDay" in self.initial_data:
            validated_data["price"] = self.initial_data["pricePerDay"]

        venue = Venue.objects.create(**validated_data)

        # Attach amenities
        for name in amenity_names:
            amenity, _ = Amenity.objects.get_or_create(name=name.strip())
            venue.amenities.add(amenity)

        # Attach event types
        for name in event_type_names:
            etype, _ = EventType.objects.get_or_create(name=name.strip())
            venue.event_types.add(etype)

        # Attach images
        for idx, img_url in enumerate(new_images):
            VenuePhoto.objects.create(
                venue=venue,
                url=img_url,
                is_cover=(idx == 0)
            )

        return venue

    def update(self, instance, validated_data):
        amenity_names = validated_data.pop("amenity_names", None)
        event_type_names = validated_data.pop("event_type_names", None)
        new_images = validated_data.pop("new_images", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if amenity_names is not None:
            instance.amenities.clear()
            for name in amenity_names:
                amenity, _ = Amenity.objects.get_or_create(name=name.strip())
                instance.amenities.add(amenity)

        if event_type_names is not None:
            instance.event_types.clear()
            for name in event_type_names:
                etype, _ = EventType.objects.get_or_create(name=name.strip())
                instance.event_types.add(etype)

        if new_images is not None:
            for idx, img_url in enumerate(new_images):
                VenuePhoto.objects.create(venue=instance, url=img_url, is_cover=(idx == 0 and instance.photos.count() == 0))

        return instance