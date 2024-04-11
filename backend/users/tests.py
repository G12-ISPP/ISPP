import json

from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_encode
from rest_framework import status
from rest_framework.test import APIClient

from main import settings
from .models import CustomUser
from .utils import validate_email, get_user

ruta_backend = settings.RUTA_BACKEND


class LoginTestCase(TestCase):

    def setUp(self):
        CustomUser.objects.create_user(username='UserTest123', email='testemail@gmail.com', password='UserPass123', address='TestAddress', postal_code=12345, city='Sevilla', email_verified=True)
    
    def tearDown(self):
        super().tearDown()
        
    def test_login(self):
        data = {'username': 'UserTest123', 'password': 'UserPass123'}
        response = self.client.post('/users/login/', data, format='json')
        self.assertEqual(response.status_code, 200)
    
    def test_login_diff_password(self):
        data = {'username': 'UserTest123', 'password': 'UserPass12'}
        response = self.client.post('/users/login/', data, format='json')
        self.assertEqual(response.status_code, 400)
    
    def test_login_non_existent_user(self):
        data = {'username': 'UserTest', 'password': 'UserPass12'}
        response = self.client.post('/users/login/', data, format='json')
        self.assertEqual(response.status_code, 400)
        
class UsersTestCase(TestCase):
    
    def setUp(self):
        super().setUp()
    
    def test_register_no_password(self):
        data = {'username': 'UserTest123', 'name': 'NameTest', 'address': 'AddressTest', 'postal_code': '06228', 'city': 'Sevilla'}
        response = self.client.post('/users/api/v1/users/', data, format='json')
        self.assertEqual(response.status_code, 400)
        u = CustomUser.objects.filter(username='UserTest123').exists()
        self.assertFalse(u)

    def test_register_no_username(self):
        data = {'password': 'UserPass123', 'name': 'NameTest', 'address': 'AddressTest', 'postal_code': '06228', 'city': 'Sevilla'}
        response = self.client.post('/users/api/v1/users/', data, format='json')
        self.assertEqual(response.status_code, 400)
        u = CustomUser.objects.filter(username='UserTest123').exists()
        self.assertFalse(u)

    def test_register_no_address(self):
        data = {'username': 'UserTest123', 'password': 'UserPass123', 'name': 'NameTest', 'postal_code': '06228', 'city': 'Sevilla'}
        response = self.client.post('/users/api/v1/users/', data, format='json')
        self.assertEqual(response.status_code, 400)
        u = CustomUser.objects.filter(username='UserTest123').exists()
        self.assertFalse(u)
    
    def test_register_no_postal_code(self):
        data = {'username': 'UserTest123', 'password': 'UserPass123', 'name': 'NameTest', 'address': 'AdressTest', 'city': 'Sevilla'}
        response = self.client.post('/users/api/v1/users/', data, format='json')
        self.assertEqual(response.status_code, 400)
        u = CustomUser.objects.filter(username='UserTest123').exists()
        self.assertFalse(u)

    def test_register_no_city(self):
        data = {'username': 'UserTest123', 'password': 'UserPass123', 'name': 'NameTest', 'address': 'AdressTest'}
        response = self.client.post('/users/api/v1/users/', data, format='json')
        self.assertEqual(response.status_code, 400)
        u = CustomUser.objects.filter(username='UserTest123').exists()
        self.assertFalse(u)

    def test_validate_email(self):
        valid_emails = [
            'testemail@gmail.com',
            'user123@example.co.uk',
            'user.name@subdomain.example.com',
            'first.last@subdomain.example.com'
        ]
        for email in valid_emails:
            self.assertTrue(validate_email(email))

        invalid_emails = [
            'user@example_com',
            'user@.com',
            'user@example.',
            '@example.com'
        ]
        for email in invalid_emails:
            self.assertFalse(validate_email(email))

    def test_get_user(self):
        user = CustomUser.objects.create_user(username='TestUser', email='test@example.com', password='TestPassword', address='TestAddress', postal_code=12345, city='Sevilla')
        uidb64 = urlsafe_base64_encode(force_str(user.pk).encode())
        retrieved_user = get_user(uidb64)
        self.assertEqual(user, retrieved_user)

class FollowToggleTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='testpassword', address='TestAddress', postal_code=12345, city='Sevilla')
        self.client.force_authenticate(user=self.user)
        self.other_user = CustomUser.objects.create_user(username='otheruser', email='other@example.com', password='otherpassword', address='TestAddress', postal_code=12345, city='Sevilla')

    def test_follow_toggle(self):
        url = reverse('follow_toggle', kwargs={'user_id': self.other_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(self.user.followings.filter(id=self.other_user.id).exists())
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response.json(), {'success': 'Ahora sigues a otheruser'})

    def test_follow_toggle_unfollow(self):
        url = reverse('follow_toggle', kwargs={'user_id': self.other_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(self.user.followings.filter(id=self.other_user.id).exists())
        response_data = json.loads(response.content)
        self.assertEqual(response.json(), {'success': 'Ahora sigues a otheruser'})
    
        url = reverse('follow_toggle', kwargs={'user_id': self.other_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response.json(), {'success': 'Ya no sigues a otheruser'})

    def test_follow_status_follows(self):
        self.user.followings.add(self.other_user)
        url = reverse('follow_status', kwargs={'user_id': self.other_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['follows'])
        self.assertEqual(response.json(), {'follows': False})

        url = reverse('follow_toggle', kwargs={'user_id': self.other_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(self.user.followings.filter(id=self.other_user.id).exists())
        response_data = json.loads(response.content)
        self.assertTrue(response_data['success'])
        self.assertEqual(response.json(), {'success': 'Ahora sigues a otheruser'})

        url = reverse('follow_status', kwargs={'user_id': self.other_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.content)
        self.assertTrue(response_data['follows'])
        self.assertEqual(response.json(), {'follows': True})

    def test_follow_status_not_follows(self):
        url = reverse('follow_status', kwargs={'user_id': self.other_user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 201)
        response_data = json.loads(response.content)
        self.assertFalse(response_data['follows'])
        self.assertEqual(response.json(), {'follows': False})

    def test_get_followings(self):
        url = reverse('get_followings', kwargs={'user_id': self.user.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(len(response_data['followings']), 0)

        # Add followings for the user
        self.user.followings.add(self.other_user)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        response_data = json.loads(response.content)
        self.assertEqual(len(response_data['followings']), 1)
        self.assertEqual(response_data['followings'][0]['username'], 'otheruser')

class ProfileTestCase(TestCase):
    
    def setUp(self):
        CustomUser.objects.create_user(
            id=1, username='UserTest', password='UserPass123', address='TestAddress', postal_code=12345, city='Sevilla', email_verified=True)

    def tearDown(self):
        return super().tearDown()

    def test_get_profile(self):
        response = self.client.get('/users/api/v1/users/1/')
        self.assertEqual(response.status_code, 200)
    
    def test_get_profile_fail(self):
        response = self.client.get('/users/api/v1/users/2/')
        self.assertEqual(response.status_code, 404)

from rest_framework.test import APITestCase
from rest_framework.reverse import reverse

class ToggleActiveTestCase(APITestCase):
    def setUp(self):
        self.admin = CustomUser.objects.create_user(username='admin', email='admin@example.com', password='admin', address='TestAddress', postal_code=12345, city='Sevilla', email_verified=True, is_staff=True, is_superuser=True)
        self.admin_token = self.get_user_token('admin', 'admin')
        self.user = CustomUser.objects.create_user(username='testuser', email='test@example.com', password='testpassword', address='TestAddress', postal_code=12345, city='Sevilla')
        self.user_token = self.get_user_token('testuser', 'testpassword')

    def get_user_token(self, username, password):
        response_login = self.client.post('/users/login/', {'username': username, 'password': password}, format='json')
        return response_login.data.get('token', '')

    def test_toggle_active_as_admin(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('toggle_active', kwargs={'pk': self.user.pk})
        data = {'is_active': False}  # Change active status to False
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)

    def test_toggle_active_as_user(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('toggle_active', kwargs={'pk': self.user.pk})
        data = {'is_active': False}  # Change active status to False
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, 403)
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)

