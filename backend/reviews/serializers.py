from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = [
            'id', 'venue', 'booking', 'user', 'author_name',
            'rating', 'comment', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data['user'] = request.user
            if not validated_data.get('author_name'):
                validated_data['author_name'] = request.user.get_full_name() or request.user.username
        return super().create(validated_data)
