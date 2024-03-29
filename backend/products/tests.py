from django.test import TestCase
from pathlib import Path
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Product
from .views import ProductsView, add_product
from users.models import CustomUser
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate

# Create your tests here.
class ProductsViewTestClase(TestCase):
    def setUp(self):
        self.test_image_path = (
            Path(__file__).resolve().parent.parent / "media/products/test1.jpg"
        )
        self.factory = APIRequestFactory()
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
        design3 = SimpleUploadedFile('test3.pdf', b'design_content', content_type='application/pdf')
        self.product3 = Product.objects.create(
            product_type='D',
            price=300,
            name='Producto 3',
            description='Descripción del producto 3',
            stock_quantity=1,
            seller=self.user1,
            design=design3,
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
        self.assertEqual(len(response.data), 3)  

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

    def test_edit_product_success(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        request = self.factory.put(url, {'price': 200, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'false', 'stock_quantity': 5}, format='json')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 200)
        self.product1.refresh_from_db()
        self.assertEqual(self.product1.price, 200)
        self.assertEqual(self.product1.name, 'Updated Product')
        self.assertEqual(self.product1.stock_quantity, 5)

    def test_edit_product_fail_permission(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        request = self.factory.put(url, {'price': 200, 'name': 'Updated Product', 'stock_quantity': 20}, format='json')
        other_user = CustomUser.objects.create(username='otheruser', password='otherpass', address='test', postal_code=1234, city='test')
        force_authenticate(request, user=other_user)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 403)

    def test_edit_product_not_all_validation(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        request = self.factory.put(url, {'price': 2000000, 'name': 'Updated Product', 'stock_quantity': 200}, format='json')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 400)
    
    def test_edit_product_negative_price_validation(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        request = self.factory.put(url, {'price': -1, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'true', 'stock_quantity': 20}, format='json')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 400)

    def test_edit_product_high_price_validation(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        request = self.factory.put(url, {'price': 9999999999999, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'true', 'stock_quantity': 20}, format='json')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 400)

    def test_edit_product_stock_quantity_design_validation(self):
        url = reverse('products-detail', kwargs={'pk': self.product3.pk})
        request = self.factory.put(url, {'price': 200, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'true', 'stock_quantity': 20}, format='json')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product3.pk)
        self.assertEqual(response.status_code, 200)
        self.product3.refresh_from_db()
        self.assertEqual(self.product3.product_type, 'D')
        self.assertEqual(self.product3.stock_quantity, 1)

    def test_edit_product_negative_stock_quantity_validation(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        request = self.factory.put(url, {'price': 200, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'true', 'stock_quantity': -1}, format='json')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 400)

    def test_edit_product_high_stock_quantity_validation(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        request = self.factory.put(url, {'price': 200, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'true', 'stock_quantity': 1000000}, format='json')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 400)

    def test_edit_product_image(self):
        url = reverse('products-detail', kwargs={'pk': self.product1.pk})
        image = SimpleUploadedFile('test.jpg', content=open(self.test_image_path, 'rb').read(), content_type='image/jpeg')
        request = self.factory.put(url, {'price': 200, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'true', 'stock_quantity': 20, 'image': image}, format='multipart')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product1.pk)
        self.assertEqual(response.status_code, 200)
        self.product1.refresh_from_db()
        self.assertIsNotNone(self.product1.image)


    def test_edit_product_design(self):
        url = reverse('products-detail', kwargs={'pk': self.product3.pk})
        design = SimpleUploadedFile('test.pdf', b'design_content', content_type='application/pdf')
        request = self.factory.put(url, {'price': 200, 'name': 'Updated Product', 'description': 'Updated Description', 'show': 'true', 'stock_quantity': 20, 'design': design}, format='multipart')
        force_authenticate(request, user=self.user1)
        response = ProductsView.as_view({'put': 'edit_product'})(request, pk=self.product3.pk)
        self.assertEqual(response.status_code, 200)
        self.product3.refresh_from_db()
        self.assertIsNotNone(self.product3.design)