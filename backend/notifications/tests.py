from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from notifications.models import Notification

User = get_user_model()


class NotificationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='notify_user', email='n@test.com', password='password123')
        self.notification = Notification.objects.create(
            user=self.user,
            type='booking_confirmed',
            message='Your booking at Oakville Lodge has been confirmed!'
        )

    def test_list_notifications(self):
        res = self.client.get('/api/v1/notifications/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res.data) >= 1)

    def test_mark_as_read(self):
        res = self.client.post(f'/api/v1/notifications/{self.notification.id}/mark_read/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.notification.refresh_from_db()
        self.assertTrue(self.notification.read_status)
