from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from .models import Product
from .views import add_product
from users.models import CustomUser


# Create your tests here.
class ProductsViewTestClase(TestCase):
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
        