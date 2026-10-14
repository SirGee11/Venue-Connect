from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAuthAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_and_login(self):
        reg_url = '/api/v1/auth/register/'
        reg_payload = {
            'name': 'Farai Moyo',
            'email': 'farai.moyo@connect.co.zw',
            'phone': '+263 77 999 8888',
            'password': 'password123',
            'role': 'owner'
        }
        reg_res = self.client.post(reg_url, reg_payload, format='json')
        self.assertEqual(reg_res.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', reg_res.data)
        self.assertEqual(reg_res.data['user']['role'], 'owner')

        login_url = '/api/v1/auth/login/'
        login_payload = {
            'email': 'farai.moyo@connect.co.zw',
            'password': 'password123'
        }
        login_res = self.client.post(login_url, login_payload, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', login_res.data['tokens'])

    def test_list_users_for_admin(self):
        User.objects.create_user(username='u1', email='u1@test.com', password='password123')
        url = '/api/v1/users/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(len(response.data) >= 1)
