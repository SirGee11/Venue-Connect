from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        user = self.request.user
        if user and user.is_authenticated:
            return Notification.objects.filter(user=user)
        return Notification.objects.all()

    @action(detail=True, methods=['post', 'patch'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.read_status = True
        notification.save()
        return Response({'status': 'marked as read', 'notification': NotificationSerializer(notification).data})

    @action(detail=False, methods=['post', 'patch'])
    def mark_all_read(self, request):
        user = self.request.user
        if user and user.is_authenticated:
            Notification.objects.filter(user=user, read_status=False).update(read_status=True)
        else:
            Notification.objects.filter(read_status=False).update(read_status=True)
        return Response({'status': 'all notifications marked as read'})
