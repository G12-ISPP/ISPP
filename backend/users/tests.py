from django.test import TestCase
from .models import CustomUser


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
        self.assertEqual(response.status_code, 500) 
    
    def test_login_non_existent_user(self):
        data = {'username': 'UserTest', 'password': 'UserPass12'}
        response = self.client.post('/users/login/', data, format='json')
        self.assertEqual(response.status_code, 500)
        
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
