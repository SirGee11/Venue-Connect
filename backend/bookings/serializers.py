from rest_framework import serializers
from .models import Booking

class BookingSerializer(serializers.ModelSerializer):
    client_email = serializers.ReadOnlyField(source='client.email')
    venue_name = serializers.ReadOnlyField(source='venue.name')

    class Meta:
        model = Booking
        fields = [
            'id',
            'client',
            'client_email',
            'venue',
            'venue_name',
            'start_time',
            'end_time',
            'event_type',
            'guest_count',
            'status',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'client', 'created_at', 'updated_at']

    def validate(self, attrs):
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({
                'end_time': 'end_time must be after start_time.'
            })
        return attrs