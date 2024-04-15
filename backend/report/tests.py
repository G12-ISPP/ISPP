from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from users.models import CustomUser
from .models import Report
from products.models import Product
from django.core.files.uploadedfile import SimpleUploadedFile
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
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'title': 'Test Report',
            'description': 'Test Report Description',
            'reason': 'P',
            'product': self.product.id,
            'user': "",
            'created_at':'2024-04-09T14:57:44.767Z',
            'file': image}
        response = self.client.post(reverse('add_report'), data, HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_add_report_product_without_title(self):
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'title': '',
            'description': 'Test Report Description',
            'reason': 'P',
            'product': self.product.id,
            'user': "",
            'created_at':'2024-04-09T14:57:44.767Z',
            'file': image}
        response = self.client.post(reverse('add_report'), data, HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
    
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_add_report_product_without_description(self):
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'title': 'Test Report',
            'description': '',
            'reason': 'P',
            'product': self.product.id,
            'user': "",
            'created_at':'2024-04-09T14:57:44.767Z',
            'file': image}
        response = self.client.post(reverse('add_report'), data, HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')        

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_add_report_product_without_reason(self):
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'title': 'Test Report',
            'description': 'Test Report Description',
            'reason': '',
            'product': self.product.id,
            'user': "",
            'created_at':'2024-04-09T14:57:44.767Z',
            'file': image}
        response = self.client.post(reverse('add_report'), data, HTTP_AUTHORIZATION=f'Bearer {self.jwt_token}')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)