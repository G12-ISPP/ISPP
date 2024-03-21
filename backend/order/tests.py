from django.urls import reverse
from rest_framework import status
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.authtoken.admin import User
from rest_framework.test import APITestCase
from .models import Order, OrderProduct
from products.models import Product
from .views import send_order_confirmation_email
from django.core import mail
import json
import uuid

class BaseTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )
        self.client.force_authenticate(user=self.custom_user)

        self.product = Product.objects.create(
            product_type='I',
            price=100,
            name='Producto 1',
            description='Descripción del producto 1',
            stock_quantity=10,
            seller=self.custom_user,
        )

        self.order = Order.objects.create(
            buyer=self.custom_user,
            price=100,
            buyer_mail = 'test@example.com',
            status='P',
            address='123 Test Street',
            city='Test City',
            postal_code='12345',
            payment='C',
            date=timezone.now(),
            payed=True
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

class CreateOrderTestCase(BaseTestCase):
    def test_create_order_authenticated(self):
        response = self.client.post(reverse('create_order'), self.order_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Order.objects.count(), 2)
        new_order = Order.objects.filter(buyer=self.custom_user).last()
        self.assertEqual(new_order.buyer, self.custom_user)
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

class ConfirmOrderTestCase(BaseTestCase):
    def test_confirm_order(self):
        response = self.client.get(reverse('confirm_order', args=[self.order.id]))
        self.assertEqual(response.status_code, 302)
        self.order.refresh_from_db()
        self.assertTrue(self.order.payed)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock_quantity, 9)        
    def test_send_order_confirmation_email(self):

        op = OrderProduct.objects.filter(order=self.order)
                
        send_order_confirmation_email(self.order, op)

        email = mail.outbox[0]
        
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(email.subject, 'Confirmación de tu pedido en Shar3d')
        self.assertEqual(email.to, ['test@example.com'])
        
        html_content = None
        for content, content_type in email.alternatives:
            if content_type == 'text/html':
                html_content = content
                break

        self.assertIsNotNone(html_content)  # Verificar que hay contenido HTML
        
        # Verificar si las cadenas está presente en el contenido HTML
        self.assertIn('Buenas testuser,', html_content) 
        self.assertIn('ID de pedido: ' + str(self.order.id), html_content)
        self.assertIn('Precio total: ' + str(self.order.price), html_content)
        self.assertIn('Estado: ' + self.order.get_status_display(), html_content)
        self.assertIn('Dirección: ' + self.order.address, html_content)
        self.assertIn('CP: ' + self.order.postal_code, html_content)
        self.assertIn('Ciudad: ' + self.order.city, html_content)
        
        mail.outbox.clear()

class CancelOrderTestCase(BaseTestCase):
    def test_cancel_order(self):
        response = self.client.get(reverse('cancel_order', args=[self.order.id]))
        self.assertEqual(response.status_code, 302)
        with self.assertRaises(Order.DoesNotExist):
            Order.objects.get(id=self.order.id)

class OrderDetailsTestCase(BaseTestCase):
    def test_order_details(self):
        User.objects.create_user(username='testuser1', email='test@example.com', password='test', is_staff=True, postal_code='12345', email_verified=True)
        response = self.client.post(reverse('login'), {'username': 'testuser1', 'password': 'test'})
        token = response.json()["token"]

        response = self.client.get(reverse('order_details', args=[self.order.id]), HTTP_AUTHORIZATION='Bearer ' + token)
        self.assertEqual(response.status_code, 200)
        order_details = response.json()
        self.assertIsInstance(uuid.UUID(order_details['id']), uuid.UUID)
        self.assertIsInstance(order_details['date'], str)
        self.assertEqual(order_details["price"], '100.00')

    def test_order_details_with_non_existing_order(self):
        non_existing_order_id = str(uuid.uuid4())
        response = self.client.get(reverse('order_details', args=[non_existing_order_id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'error': 'El pedido no existe'})
