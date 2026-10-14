from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from venues.models import Venue
from bookings.models import Booking

User = get_user_model()


class BookingAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='planner_test',
            email='planner@test.com',
            password='password123'
        )
        self.venue = Venue.objects.create(
            name='Harare Grand Pavilion',
            location='Harare',
            capacity=500,
            price=600.00
        )
        self.booking = Booking.objects.create(
            venue=self.venue,
            client=self.user,
            customer_name='Tendai Moyo',
            customer_email='tendai@test.com',
            event_date='2026-11-20',
            start_time='10:00',
            end_time='18:00',
            guest_count=200,
            total_price=600.00,
            status='Pending'
        )

    def test_list_bookings(self):
        url = '/api/v1/bookings/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_create_booking_camel_case(self):
        url = '/api/v1/bookings/'
        payload = {
            'venueId': f'v{self.venue.id}',
            'customerName': 'Chipo Ndlovu',
            'customerEmail': 'chipo@test.com',
            'customerPhone': '+263 77 111 2222',
            'eventDate': '2026-12-05',
            'startTime': '09:00',
            'endTime': '16:00',
            'guestCount': 100,
            'eventType': 'Birthday Celebration',
            'grandTotal': 600.00,
            'specialRequests': 'Early setup required'
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['customerName'], 'Chipo Ndlovu')
        self.assertEqual(float(response.data['totalPrice']), 600.00)

    def test_cancel_booking_action(self):
        url = f'/api/v1/bookings/{self.booking.id}/cancel/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, 'Cancelled')

    def test_confirm_booking_action(self):
        url = f'/api/v1/bookings/{self.booking.id}/confirm/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.booking.refresh_from_db()
        self.assertEqual(self.booking.status, 'Confirmed')

    def test_owner_only_sees_their_venue_bookings(self):
        owner_user = User.objects.create_user(username='farai_owner', email='farai@owner.zw', password='password123')
        if hasattr(owner_user, 'profile'):
            owner_user.profile.role = 'owner'
            owner_user.profile.save()
        self.venue.owner = owner_user
        self.venue.save()

        other_owner = User.objects.create_user(username='other_owner', email='other@owner.zw', password='password123')
        if hasattr(other_owner, 'profile'):
            other_owner.profile.role = 'owner'
            other_owner.profile.save()
        other_venue = Venue.objects.create(name='Other Venue', location='Bulawayo', capacity=300, price=400)
        other_venue.owner = other_owner
        other_venue.save()

        Booking.objects.create(venue=other_venue, customer_name='Other Person', customer_email='other@test.com', status='Pending')

        # When farai_owner signs in
        self.client.force_authenticate(user=owner_user)
        resp = self.client.get('/api/v1/bookings/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Should only see booking for self.venue, not other_venue
        venue_ids = [b['venueId'] for b in resp.data]
        self.assertIn(f'v{self.venue.id}', venue_ids)
        self.assertNotIn(f'v{other_venue.id}', venue_ids)

