from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from .models import Opinion
from datetime import date
from users.models import CustomUser
from rest_framework.test import APITestCase
from .serializer import OpinionSerializer

User = get_user_model()

class OpinionModelTests(TestCase):
    @classmethod
    def setUpTestData(self):
        # Crea dos usuarios para usar en los tests
        self.author = User.objects.create_user(username='author', password='testpass123', postal_code='12323')
        self.target_user = User.objects.create_user(username='target_user', password='testpass456', postal_code='45600')
        
    def test_create_opinion(self):
        # Test para verificar la creación de una opinión
        opinion = Opinion.objects.create(
            author=self.author,
            target_user=self.target_user,
            score=5,
            description='Great cooperation!'
        )
        
        self.assertEqual(opinion.author, self.author)
        self.assertEqual(opinion.target_user, self.target_user)
        self.assertEqual(opinion.score, 5)
        self.assertEqual(opinion.description, 'Great cooperation!')
        self.assertEqual(opinion.date, date.today())
        
    def test_score_range_validation(self):
        # Test para verificar la validación del rango de score
        with self.assertRaises(IntegrityError):
            Opinion.objects.create(
                author=self.author,
                target_user=self.target_user,
                description='Invalid score test'
            )
            
    def test_description_required(self):
        # Test para verificar que la descripción es requerida
        with self.assertRaises(IntegrityError):
            Opinion.objects.create(
                author=self.author,
                target_user=self.target_user,
                description=''  # Descripción vacía no permitida
            )
            
    def test_relationships(self):
        # Test para verificar las relaciones de clave foránea
        opinion = Opinion.objects.create(
            author=self.author,
            target_user=self.target_user,
            description='Relationship test',
            score=5
        )
        
        self.assertEqual(opinion.author.username, 'author')
        self.assertEqual(opinion.target_user.username, 'target_user')




class OpinionSerializerTest(APITestCase):
    def test_validation(self):
        # Datos de entrada con un score inválido y una descripción vacía
        data = {
            'author': 1,
            'target_user': 2,
            'score': 6,
            'description': ''
        }
        serializer = OpinionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('score', serializer.errors)
        self.assertIn('description', serializer.errors)


class OpinionViewTestCase(TestCase):
    
    def setUp(self):

        author = CustomUser.objects.create_user(
            id=1,
            username='autor',
            password='autor',
            address='autor',
            postal_code=1234,
            city='autor',
            email_verified=True
        )
        target_user = CustomUser.objects.create_user(
            id=2,
            username='target_user',
            password='target_user',
            address='target_user',
            postal_code=12345,
            city='target_user',
            email_verified=True
        )

        Opinion.objects.create(
            id=1,
            author=author,
            target_user=target_user,
            date='2021-01-01',
            score=5,
            description='Test description',
        )

    def tearDown(self):
        super().tearDown()

    def test_get_all_opinions(self):
        response = self.client.get('/opinion/api/v1/opinion/')
        self.assertEqual(response.status_code, 200)
        
    def test_get_opinion_exists(self):
        response = self.client.get('/opinion/api/v1/opinion/1/get_opinion_data/')
        self.assertEqual(response.status_code, 200)

    def test_get_opinion_not_exists(self):
        response = self.client.get('/opinion/api/v1/opinion/10/get_opinion_data/')
        self.assertEqual(response.status_code, 404)

    def test_get_opinions_from_target_user(self):
        response = self.client.get('/opinion/api/v1/opinion/?target_user=2')
        self.assertEqual(response.status_code, 200)

        
    
