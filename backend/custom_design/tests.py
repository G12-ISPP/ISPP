import json
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from .models import CustomDesign
from django.urls import reverse
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import CustomDesign
import os

class ListSearchingPrinterDesignsTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True,
            is_printer=True
        )
        self.client.force_authenticate(user=self.custom_user)

        self.design = CustomDesign.objects.create(
            custom_design_id = '123e4567-e89b-12d3-a456-426614174000',
            name='Test Design',
            quantity=1,
            quality='High',
            dimensions='10x10x10',
            area=100,
            volume=1000,
            weight=10,
            price=100,
            design_file='path/to/design/file',
            postal_code='12345',
            address='Test Address',
            city='Test City',
            buyer_mail='buyer@example.com',
            payed=True,
            status='searching',
            color='Red',
            buyer=self.custom_user
        )

    def test_list_searching_printer_designs_authenticated_printer(self):
        response = self.client.get(reverse('list_searching_printer_designs'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_searching_printer_designs_unauthenticated(self):
        self.client.logout()
        response = self.client.get(reverse('list_searching_printer_designs'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_searching_printer_designs_non_printer(self):
        self.custom_user.is_printer = False
        self.custom_user.save()
        response = self.client.get(reverse('list_searching_printer_designs'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

class CreateCustomDesignTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )
        self.client.force_authenticate(user=self.custom_user)

    def test_create_custom_design_authenticated_user(self):
        current_directory = os.path.dirname(os.path.abspath(__file__))

        file_path = os.path.join(current_directory, 'files', 'Dragon.stl')

        with open(file_path, 'rb') as file:
            file_content = file.read()
        valid_file = SimpleUploadedFile('Dragon.stl', file_content)

        data = {
            'data': json.dumps({
                'name': 'Test Design',
                'quantity': 1,
                'quality': 'High',
                'dimensions': '10x10x10',
                'area': 100,
                'volume': 1000,
                'weight': 10,
                'price': 100,
                'postal_code': '12345',
                'address': 'Test Address',
                'city': 'Test City',
                'buyer_mail': 'buyer@example.com',
                'color': 'Red',
            }),
            'file': valid_file,
        }
        response = self.client.post(reverse('create_custom_design'), data=data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(CustomDesign.objects.count(), 1)

    def test_create_custom_design_missing_file(self):
        data = {
            'data': json.dumps({
                'name': 'Test Design',
                'quantity': 1,
                'quality': 'High',
                'dimensions': '10x10x10',
                'area': 100,
                'volume': 1000,
                'weight': 10,
                'price': 100,
                'postal_code': '12345',
                'address': 'Test Address',
                'city': 'Test City',
                'buyer_mail': 'buyer@example.com',
                'color': 'Red',
            }),
        }
        response = self.client.post(reverse('create_custom_design'), data=data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ConfirmCancelTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )
        self.client.force_authenticate(user=self.custom_user)

        self.design = CustomDesign.objects.create(
            custom_design_id = '123e4567-e89b-12d3-a456-426614174000',
            name='Test Design',
            quantity=1,
            quality='High',
            dimensions='10x10x10',
            area=100,
            volume=1000,
            weight=10,
            price=100,
            postal_code='12345',
            address='Test Address',
            city='Test City',
            buyer_mail='buyer@example.com',
            payed=False,
            status='searching',
            color='Red',
            buyer=self.custom_user
        )

    def test_confirm_design(self):
        response = self.client.get(reverse('confirm', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, 302)
        self.design.refresh_from_db()
        self.assertTrue(self.design.payed)

    def test_cancel_design(self):
        response = self.client.get(reverse('cancel', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, 302)
        with self.assertRaises(CustomDesign.DoesNotExist):
            CustomDesign.objects.get(custom_design_id=self.design.custom_design_id)


class UpdateDesignStatusTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True,
            is_printer=True
        )
        self.client.force_authenticate(user=self.custom_user)

        current_directory = os.path.dirname(os.path.abspath(__file__))
        file_path = os.path.join(current_directory, 'files', 'Dragon.stl')

        with open(file_path, 'rb') as file:
            file_content = file.read()

        design_file = SimpleUploadedFile('Dragon.stl', file_content)

        self.design = CustomDesign.objects.create(
            custom_design_id = '123e4567-e89b-12d3-a456-426614174000',
            name='Test Design',
            quantity=1,
            quality='High',
            dimensions='10x10x10',
            area=100,
            volume=1000,
            weight=10,
            price=100,
            design_file=design_file,
            postal_code='12345',
            address='Test Address',
            city='Test City',
            buyer_mail='buyer@example.com',
            payed=False,
            status='searching',
            color='Red',
            buyer=self.custom_user 
        )

    def test_update_design_status(self):
        response = self.client.post(reverse('update_design_status', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.design.refresh_from_db()
        self.assertEqual(self.design.status, 'printing')

class DesignsAvailabilityTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True,
            is_printer=True
        )
        self.client.force_authenticate(user=self.custom_user)

    def test_no_designs_available(self):
        CustomDesign.objects.all().delete()

        response = self.client.get(reverse('list_searching_printer_designs'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['message'], 'No hay diseños disponibles')

class DesignDetailsTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )
        self.client.force_authenticate(user=self.custom_user)

        self.design = CustomDesign.objects.create(
            custom_design_id = '123e4567-e89b-12d3-a456-426614174000',
            name='Test Design',
            quantity=1,
            quality='High',
            dimensions='10x10x10',
            area=100,
            volume=1000,
            weight=10,
            price=100,
            postal_code='12345',
            address='Test Address',
            city='Test City',
            buyer_mail='buyer@example.com',
            payed=True,
            status='searching',
            color='Red',
            buyer=self.custom_user
        )

    def test_design_details(self):
        response = self.client.get(reverse('details', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Design')

class DesignDetailsToPrinterTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True,
            is_printer=True
        )
        self.client.force_authenticate(user=self.custom_user)

        self.design = CustomDesign.objects.create(
            custom_design_id = '123e4567-e89b-12d3-a456-426614174000',
            name='Test Design',
            quantity=1,
            quality='High',
            dimensions='10x10x10',
            area=100,
            volume=1000,
            weight=10,
            price=100,
            postal_code='12345',
            address='Test Address',
            city='Test City',
            buyer_mail='buyer@example.com',
            payed=True,
            status='searching',
            color='Red',
            buyer=self.custom_user
        )

    def test_design_details_to_printer(self):
        response = self.client.get(reverse('details_to_printer', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Design')
    
    def test_anotherprinter(self):
        user2 = get_user_model().objects.create_user(
            username='testuser2',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )

        self.design = CustomDesign.objects.create(
            custom_design_id = '123e4567-e89b-12d3-a456-426614174002',
            name='Test Design',
            quantity=1,
            quality='High',
            dimensions='10x10x10',
            area=100,
            volume=1000,
            weight=10,
            price=100,
            postal_code='12345',
            address='Test Address',
            city='Test City',
            buyer_mail='buyer@example.com',
            payed=True,
            status='searching',
            printer=user2,
            color='Red',
            buyer=self.custom_user,
        )
    
        response = self.client.get(reverse('details_to_printer', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_not_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('details_to_printer', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_not_printer(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser3',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )
        self.client.force_authenticate(user=self.custom_user)
    
        response = self.client.get(reverse('details_to_printer', args=[self.design.custom_design_id]))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class LoguedUserTestCase(APITestCase):
    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )
        self.client.force_authenticate(user=self.custom_user)

    def test_logued_user(self):
        response = self.client.get(reverse('loguedUser'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')

class SearchingPrinterDesign(APITestCase):
    def test_not_authenticated(self):
        self.client.force_authenticate(user=None)
        response = self.client.get(reverse('list_searching_printer_designs'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def setUp(self):
        self.custom_user = get_user_model().objects.create_user(
            username='testuser',
            email='test@example.com',
            postal_code='12345',
            email_verified=True
        )
        self.client.force_authenticate(user=self.custom_user)

    def test_not_printer(self):
        response = self.client.get(reverse('list_searching_printer_designs'))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_not_design(self):
        self.custom_user = get_user_model().objects.create_user(
            username='test-user',
            email='test@example.com',
            postal_code='12345',
            email_verified=True,
            is_printer = True
        )
        self.client.force_authenticate(user=self.custom_user)

        response = self.client.get(reverse('list_searching_printer_designs'))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)