from django.db import IntegrityError
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from .models import Post

class PostModelTests(TestCase):

    @classmethod
    def setUpTestData(self):

        # Crear un usuario de prueba
        self.user = get_user_model().objects.create_user(username='testuser', password='12345', postal_code='12345')
        # Crear un post de prueba
        self.image = SimpleUploadedFile(name='test_image.jpg', content=b'some dummy content', content_type='image/jpeg')
        self.post = Post.objects.create(
            name='Test Post',
            description='A test post description.',
            image=self.image,
            users=self.user
        )

    def test_post_creation(self):
        self.assertTrue(isinstance(self.post, Post))
        

    def test_post_update(self):
        self.post.name = 'Nombre actualizado'
        self.post.save()
        self.assertEqual(self.post.name, 'Nombre actualizado')

    def test_post_deletion(self):
        post_id = self.post.id
        self.post.delete()
        with self.assertRaises(Post.DoesNotExist):
            Post.objects.get(id=post_id)

    def test_model_str(self):
        self.assertEqual(str(self.post), 'Test Post')

    def test_required_fields(self):
        with self.assertRaises(IntegrityError):  # Usar IntegrityError para pruebas de DB
            Post.objects.create(
                name=None,  # Suponiendo que 'name' es obligatorio
                description='Missing name field',
                image=self.image,
                users=self.user
            )