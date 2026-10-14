from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from venues.models import Venue, Amenity

User = get_user_model()


class VenueAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='owner_test',
            email='owner@test.com',
            password='password123'
        )
        self.amenity = Amenity.objects.create(name='Solar Power Backup')
        self.venue = Venue.objects.create(
            name='Test Venue Bulawayo',
            owner=self.user,
            location='Bulawayo',
            capacity=250,
            price=300.00,
            status='approved'
        )
        self.venue.amenities.add(self.amenity)

    def test_list_venues(self):
        url = '/api/v1/venues/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)

    def test_filter_venues_by_location(self):
        url = '/api/v1/venues/?location=Bulawayo'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['location'], 'Bulawayo')

    def test_create_venue(self):
        url = '/api/v1/venues/'
        payload = {
            'title': 'New Sunset Pavilion',
            'location': 'Harare',
            'capacity': 180,
            'pricePerDay': 420.00,
            'amenity_names': ['Generator Backup', 'Ample Parking'],
            'new_images': ['https://example.com/test.jpg']
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Sunset Pavilion')
        self.assertEqual(float(response.data['price']), 420.00)

    def test_ai_recommend_endpoint(self):
        url = '/api/v1/venues/recommend/'
        payload = {
            'location': 'Bulawayo',
            'guest_count': 200,
            'max_budget': 500,
            'facilities': ['Solar Power Backup']
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)
        self.assertIn('matchPercentage', response.data[0])
