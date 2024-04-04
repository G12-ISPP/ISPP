from django.test import TestCase
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from .models import Opinion
from datetime import date

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