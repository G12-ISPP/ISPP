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
from rest_framework.authtoken.admin import User
from django.core.files.uploadedfile import SimpleUploadedFile
from order.models import Order, OrderProduct
from django.utils import timezone
import json


# Create your tests here.
class ProductsViewTestClase(TestCase):
    def setUp(self):
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
        image = SimpleUploadedFile('test.jpg', b'content', content_type='image/jpeg')
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
        
class SellerPlanTestClase(TestCase):
    def setUp(self):
        # Creamos algunos usuarios y productos para usar en los tests
        self.user1 = User.objects.create_user(username='testuser1', email='test@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True, seller_plan= True)
        response = self.client.post(reverse('login'), {'username': 'testuser1', 'password': 'test'})
        self.token = response.json()["token"]

        self.user2 = User.objects.create_user(username='testuser2', email='test2@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True, seller_plan= False)
        response = self.client.post(reverse('login'), {'username': 'testuser2', 'password': 'test'})
        self.token2 = response.json()["token"]

        self.product0 = Product.objects.create(
            product_type='P',
            price=100,
            name='Producto 0',
            description='Descripción del producto 0',
            stock_quantity=10,
            show=False,
            seller=self.user2,
        )

        # Creamos algunos productos
        self.product1 = Product.objects.create(
            product_type='P',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            show=True,
            seller=self.user1,
        )
        self.product2 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 2',
            description='Descripción del producto 2',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        self.product3 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 3',
            description='Descripción del producto 3',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        self.product4 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 4',
            description='Descripción del producto 4',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )

        self.product5 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 5',
            description='Descripción del producto 5',
            show=False,
            stock_quantity=5,
            seller=self.user1,
        )
        
    def test_ok_add_product(self):
        image_content = b'contenido_de_imagen' 
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.assertEqual(response.status_code, 201)
        response = self.client.get(reverse('products-list') + '?product_type=P')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 7) 

    def test_wrong_add_product(self):
        self.product7 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 7',
            description='Descripción del producto 7',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.assertEqual(response.status_code, 400)
    
    def test_non_seller_add_product(self):
        self.product8 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 8',
            description='Descripción del producto 8',
            show=True,
            stock_quantity=5,
            seller=self.user2,
        )
        
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token2)
        self.assertEqual(response.status_code, 400)

class BuyerPlanTestClase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1', email='test@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True, buyer_plan= True)
        response = self.client.post(reverse('login'), {'username': 'testuser1', 'password': 'test'})
        self.token = response.json()["token"]

        self.user2 = User.objects.create_user(username='testuser2', email='test2@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True, buyer_plan= False)
        response2 = self.client.post(reverse('login'), {'username': 'testuser2', 'password': 'test'})
        self.token2 = response2.json()["token"]

        self.product = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.user2,
        )

        self.order_data = {
            'address': '123 Test Street',
            'city': 'Test City',
            'postal_code': '12345',
            'buyer_mail': 'test@example.com',
            'cart': json.dumps([{'id': self.product.id, 'quantity': 1}]),
        }

        self.product2 = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.user1,
        )

        self.order_data2 = {
            'address': '123 Test Street',
            'city': 'Test City',
            'postal_code': '12345',
            'buyer_mail': 'test2@example.com',
            'cart': json.dumps([{'id': self.product2.id, 'quantity': 1}]),
        }
    
    def test_buy_no_send_spends(self):
        response = self.client.post(reverse('create_order'), self.order_data, format='json', HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Order.objects.count(), 1)
        new_order = Order.objects.filter(buyer=self.user1).last()
        self.assertEqual(new_order.buyer, self.user1)
        self.assertEqual(OrderProduct.objects.count(), 1)
        self.assertEqual(new_order.price, 100)
        new_order_product = OrderProduct.objects.filter(order=new_order).last()
        self.assertEqual(new_order_product.order, new_order)
        self.assertEqual(new_order_product.product, self.product)
        self.assertEqual(new_order_product.quantity, 1)

    def test_buy_with_send_spends(self):
        response = self.client.post(reverse('create_order'), self.order_data2, format='json', HTTP_AUTHORIZATION='Bearer ' + self.token2)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Order.objects.count(), 1)
        new_order = Order.objects.filter(buyer=self.user2).last()
        self.assertEqual(new_order.buyer, self.user2)
        self.assertEqual(OrderProduct.objects.count(), 1)
        self.assertEqual(new_order.price, 105)
        new_order_product = OrderProduct.objects.filter(order=new_order).last()
        self.assertEqual(new_order_product.order, new_order)
        self.assertEqual(new_order_product.product, self.product2)
        self.assertEqual(new_order_product.quantity, 1)
        
class DesignerPlanTestClase(TestCase):
    def setUp(self):
        # Creamos algunos usuarios y productos para usar en los tests
        self.user1 = User.objects.create_user(username='testuser1', email='test@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True, designer_plan= True)
        response = self.client.post(reverse('login'), {'username': 'testuser1', 'password': 'test'})
        self.token = response.json()["token"]

        self.user2 = User.objects.create_user(username='testuser2', email='test2@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True, designer_plan= False)
        response = self.client.post(reverse('login'), {'username': 'testuser2', 'password': 'test'})
        self.token2 = response.json()["token"]

        self.product0 = Product.objects.create(
            product_type='P',
            price=100,
            name='Producto 0',
            description='Descripción del producto 0',
            stock_quantity=10,
            show=False,
            seller=self.user2,
        )

        # Creamos algunos productos
        self.product1 = Product.objects.create(
            product_type='P',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            show=True,
            seller=self.user1,
        )
        self.product2 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 2',
            description='Descripción del producto 2',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )

        self.product3 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 5',
            description='Descripción del producto 5',
            show=False,
            stock_quantity=5,
            seller=self.user1,
        )
        
    def test_ok_add_product(self):
        image_content = b'contenido_de_imagen' 
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.assertEqual(response.status_code, 201)
        response = self.client.get(reverse('products-list') + '?product_type=P')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5) 

    def test_wrong_add_product(self):
        self.product7 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 7',
            description='Descripción del producto 7',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.assertEqual(response.status_code, 400)
    
    def test_non_seller_add_product(self):
        self.product8 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 8',
            description='Descripción del producto 8',
            show=True,
            stock_quantity=5,
            seller=self.user2,
        )
        
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token2)
        self.assertEqual(response.status_code, 400)


class BothSellerAndDesignerPlanTestClase(TestCase):
    def setUp(self):
        # Creamos algunos usuarios y productos para usar en los tests
        self.user1 = User.objects.create_user(username='testuser1', email='test@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True, seller_plan= True, designer_plan=True)
        response = self.client.post(reverse('login'), {'username': 'testuser1', 'password': 'test'})
        self.token = response.json()["token"]

        # Creamos algunos productos
        self.product1 = Product.objects.create(
            product_type='P',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            show=True,
            seller=self.user1,
        )
        self.product2 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 2',
            description='Descripción del producto 2',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        self.product3 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 3',
            description='Descripción del producto 3',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        self.product4 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 4',
            description='Descripción del producto 4',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )

        self.product5 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 5',
            description='Descripción del producto 5',
            show=False,
            stock_quantity=5,
            seller=self.user1,
        )

        self.product6 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 6',
            description='Descripción del producto 6',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )

        self.product7 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 7',
            description='Descripción del producto 7',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )

        self.product8 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 8',
            description='Descripción del producto 8',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        
    def test_ok_add_product(self):
        image_content = b'contenido_de_imagen' 
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.assertEqual(response.status_code, 201)
        response = self.client.get(reverse('products-list') + '?product_type=P')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 9) 

    def test_wrong_add_product(self):
        self.product7 = Product.objects.create(
            product_type='P',
            price=200,
            name='Producto 7',
            description='Descripción del producto 7',
            show=True,
            stock_quantity=5,
            seller=self.user1,
        )
        
        image_content = b'contenido_de_imagen'
        image = SimpleUploadedFile("image.jpg", image_content, content_type="image/jpeg")
        data = {
            'product_type':'P',
            'price':200,
            'name':'Producto 6',
            'description':'Descripción del producto 6',
            'show':'true',
            'stock_quantity':5,
            'seller':self.user1,
            'file': image}
        response = self.client.post(reverse('add_product'), data, HTTP_AUTHORIZATION='Bearer ' + self.token)
        self.assertEqual(response.status_code, 400)
    
