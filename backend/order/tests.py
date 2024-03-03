from django.utils import timezone
import json
from users.models import CustomUser
from .models import Order, OrderProduct
from products.models import Product
from django.urls import reverse
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Order, OrderProduct
from products.models import Product
from django.contrib.auth.models import User
from uuid import UUID

class CreateOrderTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='password123', postal_code='12345')
        self.client.force_authenticate(user=self.user)

        self.custom_user = CustomUser.objects.create(
            username='test',
            password='test',
            address='test',
            postal_code=12345,
            city='Test City'
        )

        self.product = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.custom_user,
        )

        self.order = Order.objects.create(
            buyer=self.user,
            price=100,
            status='P',
            address='123 Test Street',
            city='Test City',
            postal_code='12345',
            payment='C',
            date=timezone.now(),
            payed=False
        )

        OrderProduct.objects.create(
            order=self.order,
            product=self.product,
            quantity=1
        )

        self.order_data = {
            'address': '123 Test Street',
            'city': 'Test City',
            'postal_code': '12345',
            'buyer_mail': 'testuser@example.com',
            'cart': json.dumps([{'id': self.product.id, 'quantity': 1}]),
        }

    def test_create_order_authenticated(self):
        response = self.client.post(reverse('create_order'), self.order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Order.objects.count(), 2)
        new_order = Order.objects.filter(buyer=self.user).last()
        self.assertEqual(new_order.buyer, self.user)
        self.assertEqual(OrderProduct.objects.count(), 2)
        new_order_product = OrderProduct.objects.filter(order=new_order).last()
        self.assertEqual(new_order_product.order, new_order)
        self.assertEqual(new_order_product.product, self.product)
        self.assertEqual(new_order_product.quantity, 1)

    def test_create_order_insufficient_stock(self):
        self.order_data['cart'] = json.dumps([{'id': self.product.id, 'quantity': 11}])
        response = self.client.post(reverse('create_order'), self.order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'No hay suficiente stock de Producto 1')

    def test_create_order_product_does_not_exist(self):
        self.order_data['cart'] = json.dumps([{'id': 9999, 'quantity': 1}])
        response = self.client.post(reverse('create_order'), self.order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'El producto con ID 9999 no existe')

class ConfirmOrderTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='password123', postal_code='12345')
        self.client.force_authenticate(user=self.user)

        self.custom_user = CustomUser.objects.create(
            username='test',
            password='test',
            address='test',
            postal_code=12345,
            city='Test City'
        )

        self.product = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.custom_user,
        )

        self.order = Order.objects.create(
            buyer=self.user,
            price=100,
            status='P',
            address='123 Test Street',
            city='Test City',
            postal_code='12345',
            payment='C',
            date=timezone.now(),
            payed=False
        )

        OrderProduct.objects.create(
            order=self.order,
            product=self.product,
            quantity=1
        )

        self.order_data = {
            'address': '123 Test Street',
            'city': 'Test City',
            'postal_code': '12345',
            'buyer_mail': 'testuser@example.com',
            'cart': json.dumps([{'id': self.product.id, 'quantity': 1}]),
        }
    def test_confirm_order(self):
        response = self.client.get(reverse('confirm_order', args=[self.order.id]))
        self.assertEqual(response.status_code, 302)
        self.order.refresh_from_db()
        self.assertTrue(self.order.payed)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 9)

class CancelOrderTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='password123', postal_code='12345')
        self.client.force_authenticate(user=self.user)

        self.custom_user = CustomUser.objects.create(
            username='test',
            password='test',
            address='test',
            postal_code=12345,
            city='Test City'
        )

        self.product = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.custom_user,
        )

        self.order = Order.objects.create(
            buyer=self.user,
            price=100,
            status='P',
            address='123 Test Street',
            city='Test City',
            postal_code='12345',
            payment='C',
            date=timezone.now(),
            payed=False
        )

        OrderProduct.objects.create(
            order=self.order,
            product=self.product,
            quantity=1
        )

        self.order_data = {
            'address': '123 Test Street',
            'city': 'Test City',
            'postal_code': '12345',
            'buyer_mail': 'testuser@example.com',
            'cart': json.dumps([{'id': self.product.id, 'quantity': 1}]),
        }

    def test_cancel_order(self):
        response = self.client.get(reverse('cancel_order', args=[self.order.id]))
        self.assertEqual(response.status_code, 302)
        with self.assertRaises(Order.DoesNotExist):
            Order.objects.get(id=self.order.id)


class OrderDetailsTestCase(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='testuser', email='test@example.com', password='password123', postal_code='12345')
        self.client.force_authenticate(user=self.user)

        self.custom_user = CustomUser.objects.create(
            username='test',
            password='test',
            address='test',
            postal_code=12345,
            city='Test City',
            email= 'test@example.com'
        )

        self.product = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.custom_user,
        )

        self.order = Order.objects.create(
            buyer=self.user,
            price=100,
            status='P',
            address='123 Test Street',
            city='Test City',
            postal_code='12345',
            payment='C',
            date=timezone.now(),
            payed=False
        )

        OrderProduct.objects.create(
            order=self.order,
            product=self.product,
            quantity=1
        )

        self.order_data = {
            'address': '123 Test Street',
            'city': 'Test City',
            'postal_code': '12345',
            'cart': json.dumps([{'id': self.product.id, 'quantity': 1}]),
        }

    def test_order_details(self):
        response = self.client.get(reverse('order_details', args=[self.order.id]))
        self.assertEqual(response.status_code, 200)
        order_details = response.json()
        self.assertIsInstance(UUID(order_details['id']), UUID)
        self.assertIsInstance(order_details['date'], str)
        self.assertEqual(order_details, {
            'id': str(self.order.id),
            'buyer': self.user.email,
            'buyer_mail': 'a@a.com',
            'price': '100.00',
            'status': 'P',
            'address': '123 Test Street',
            'city': 'Test City',
            'postal_code': '12345',
            'payment': 'C',
            'date': self.order.date.isoformat(),
            'payed': False,
        })

    def test_order_details_with_non_existing_order(self):
        non_existing_order_id = '00000000-0000-0000-0000-000000000000'
        response = self.client.get(reverse('order_details', args=[non_existing_order_id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'error': 'El pedido no existe'})

