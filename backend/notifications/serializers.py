from rest_framework import serializers
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Notification
        fields = [
            'id',
            'user',
            'username',
            'type',
            'message',
            'read_status',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']
