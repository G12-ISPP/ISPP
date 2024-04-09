from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser
from .models import Report
from products.models import Product
from rest_framework_simplejwt.tokens import RefreshToken


class ReportTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(
            username='testUser',
            password='test_password',
            email='test999@gmail.com',
            email_verified=True,
            postal_code='39388'
        )
        self.client.force_authenticate(user=self.user)

        # Crear un producto de ejemplo
        self.product = Product.objects.create(
            product_type='P',
            price=100,
            name='Test Product',
            description='Description of the test product',
            stock_quantity=10,
            seller=self.user,
        )

        # Obtener un token JWT válido para el usuario autenticado
        refresh = RefreshToken.for_user(self.user)
        self.jwt_token = str(refresh.access_token)

    def test_add_report_product_OK(self):
        url = reverse('add_report')
        data = {
            'title': 'Test Report',
            'description': 'Test Report Description',
            'reason': 'P',
            'product': self.product.id,
            'user': None,
            'created_at':'2024-04-09T14:57:44.767Z'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        response = self.client.post(url, data, format='json')
        

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_report_product_without_title(self):
        url = reverse('add_report')
        data = {
            'title': '',
            'description': 'Test Report Description',
            'reason': 'P',
            'product': self.product.id,
            'user': None,
            'created_at':'2024-04-09T14:57:44.767Z'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        response = self.client.post(url, data, format='json')
    
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_add_report_product_without_description(self):
        url = reverse('add_report')
        data = {
            'title': 'Hola Que tal',
            'description': '',
            'reason': 'P',
            'product': self.product.id,
            'user': None,
            'created_at':'2024-04-09T14:57:44.767Z'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        response = self.client.post(url, data, format='json')
        

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_add_report_product_without_reason(self):
        url = reverse('add_report')
        data = {
            'title': 'Hola Que tal',
            'description': 'Test Report Description',
            'reason': '',
            'product': self.product.id,
            'user': None,
            'created_at':'2024-04-09T14:57:44.767Z'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_add_report_product_reason_D(self):
        url = reverse('add_report')
        data = {
            'title': 'Hola Que tal',
            'description': 'Test Report Description',
            'reason': 'D',
            'product': self.product.id,
            'user': None,
            'created_at':'2024-04-09T14:57:44.767Z'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_add_report_product_reason_E(self):
        url = reverse('add_report')
        data = {
            'title': 'Hola Que tal',
            'description': 'Test Report Description',
            'reason': 'E',
            'product': self.product.id,
            'user': None,
            'created_at':'2024-04-09T14:57:44.767Z'
        }
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)