from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Product
from .views import add_product
from users.models import CustomUser
from rest_framework.test import APIClient

# Create your tests here.
class ProductsViewTestClase(TestCase):
    def setUp(self):
        # Creamos algunos usuarios y productos para usar en los tests
        self.user1 = CustomUser.objects.create(
            username='user1',
            password='test',
            address='test',
            postal_code=1234,
            city='test',
            email_verified=True
        )
        self.user2 = CustomUser.objects.create(
            username='user2',
            password='test',
            address='test',
            postal_code=1234,
            city='test',
            email_verified=True
        )

        # Creamos algunos productos
        self.product1 = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.user1,
        )
        self.product2 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 2',
            description='Descripción del producto 2',
            stock_quantity=5,
            seller=self.user2,
        )
        
    def test_get_product_data(self):
        customUser = CustomUser.objects.create(
            username='test',
            password='test',
            address='test',
            postal_code=1234,
            city='test'
        )
        
        product = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=customUser,
        )

        response = self.client.get('/products/api/v1/products/' + str(product.id) + '/get_product_data/')
        self.assertEqual(response.status_code, 200)

    def test_get_products(self):
        response = self.client.get('/products/api/v1/products/')
        self.assertEqual(response.status_code, 200)

    def test_get_products_filtered(self):
        response = self.client.get('/products/api/v1/products/?product_type=I')
        self.assertEqual(response.status_code, 200)
        
    def test_get_all_products(self):
        client = APIClient()
        response = client.get(reverse('products-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  

    def test_filter_by_product_type(self):
        client = APIClient()
        response = client.get(reverse('products-list') + '?product_type=I')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 
        self.assertEqual(response.data[0]['id'], self.product1.id)

    def test_filter_by_seller(self):
        client = APIClient()
        response = client.get(reverse('products-list') + f'?seller={self.user2.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  
        self.assertEqual(response.data[0]['id'], self.product2.id)

    def test_search_by_name_or_description(self):
        client = APIClient()
        response = client.get(reverse('products-list') + '?search=Producto 1')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 
        self.assertEqual(response.data[0]['id'], self.product1.id)

    def test_combined_filters(self):
        # Probamos combinar múltiples filtros
        client = APIClient()
        response = client.get(reverse('products-list') + '?product_type=P&search=Producto 2')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 
        self.assertEqual(response.data[0]['id'], self.product2.id)