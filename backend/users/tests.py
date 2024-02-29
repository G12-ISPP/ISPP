from django.test import TestCase
from .models import CustomUser

class LoginTestCase(TestCase):

    def setUp(self):
        CustomUser.objects.create_user(username='UserTest123', email='testemail@gmail.com', password='UserPass123', address='TestAddress', postal_code=12345, city='Sevilla')
        super().setUp()
    
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