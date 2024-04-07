import json

from django.test import TestCase
from django.urls import reverse
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_encode
from rest_framework.test import APIClient

from .models import CustomUser
from .utils import validate_email, get_user


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


