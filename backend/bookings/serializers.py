from rest_framework import serializers
from .models import Booking
from venues.models import Venue


class BookingSerializer(serializers.ModelSerializer):
    client_email = serializers.ReadOnlyField(source='client.email')
    venue_name = serializers.ReadOnlyField(source='venue.name')

    # Frontend camelCase aliases
    venueId = serializers.SerializerMethodField()
    venueTitle = serializers.ReadOnlyField(source='venue.name')
    venueImage = serializers.SerializerMethodField()
    location = serializers.ReadOnlyField(source='venue.location')
    customerId = serializers.SerializerMethodField()
    customerName = serializers.CharField(source='customer_name', required=False, allow_blank=True)
    customerEmail = serializers.EmailField(source='customer_email', required=False, allow_blank=True)
    customerPhone = serializers.CharField(source='customer_phone', required=False, allow_blank=True)
    eventDate = serializers.DateField(source='event_date', required=False, allow_null=True)
    startTime = serializers.CharField(source='start_time', required=False, allow_blank=True)
    endTime = serializers.CharField(source='end_time', required=False, allow_blank=True)
    guestCount = serializers.IntegerField(source='guest_count', required=False, allow_null=True)
    eventType = serializers.CharField(source='event_type', required=False, allow_blank=True)
    totalPrice = serializers.DecimalField(source='total_price', max_digits=10, decimal_places=2, required=False)
    specialRequests = serializers.CharField(source='notes', required=False, allow_blank=True)
    venueOwnerId = serializers.SerializerMethodField()
    venueOwnerEmail = serializers.ReadOnlyField(source='venue.owner.email')
    venueOwnerUsername = serializers.ReadOnlyField(source='venue.owner.username')
    clientId = serializers.ReadOnlyField(source='client.id')
    createdAt = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id',
            'client',
            'client_email',
            'customerId',
            'venue',
            'venueId',
            'venue_name',
            'venueTitle',
            'venueImage',
            'location',
            'customer_name',
            'customerName',
            'customer_email',
            'customerEmail',
            'customer_phone',
            'customerPhone',
            'event_date',
            'eventDate',
            'start_time',
            'startTime',
            'end_time',
            'endTime',
            'event_type',
            'eventType',
            'guest_count',
            'guestCount',
            'total_price',
            'totalPrice',
            'status',
            'notes',
            'specialRequests',
            'venueOwnerId',
            'venueOwnerEmail',
            'venueOwnerUsername',
            'clientId',
            'createdAt',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']

    def get_venueId(self, obj):
        return f"v{obj.venue_id}" if obj.venue_id else None

    def get_customerId(self, obj):
        return f"u{obj.client_id}" if obj.client_id else "u1"

    def get_venueOwnerId(self, obj):
        return f"u{obj.venue.owner_id}" if (obj.venue and obj.venue.owner_id) else None

    def get_venueImage(self, obj):
        if obj.venue:
            photo = obj.venue.photos.first()
            if photo:
                return photo.url
        return 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'

    def get_createdAt(self, obj):
        return str(obj.created_at.date()) if obj.created_at else None

    def to_internal_value(self, data):
        # Support incoming camelCase or frontend formatted venueId
        data = data.copy()
        raw_venue = data.get('venue') or data.get('venueId')
        if isinstance(raw_venue, dict):
            raw_venue = raw_venue.get('id')
        if isinstance(raw_venue, str) and raw_venue.startswith('v'):
            raw_venue = raw_venue[1:]
        if raw_venue:
            data['venue'] = raw_venue

        if 'grandTotal' in data and 'total_price' not in data:
            data['total_price'] = data['grandTotal']

        return super().to_internal_value(data)

    def create(self, validated_data):
        # Normalize status to Title Case
        if 'status' in validated_data:
            validated_data['status'] = validated_data['status'].capitalize()
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'status' in validated_data:
            validated_data['status'] = validated_data['status'].capitalize()
        return super().update(instance, validated_data)