from django.test import TestCase
from .models import CustomUser

class UsersTestCase(TestCase):
    
    def setUp(self):
        super().setUp()
    
    def tearDown(self):
        super().tearDown()
    
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