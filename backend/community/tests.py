from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db import IntegrityError
from django.test import TestCase, Client
from django.urls import reverse

from .models import Post, Like


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


class LikeTestCase(TestCase):
    def get_user_token(self, username, password):
        response_login = self.client.post('/users/login/', {'username': username, 'password': password},
                                          format='json')
        print(response_login.data)
        return response_login.data.get('token', '')

    def setUp(self):
        self.client = Client()
        self.user = get_user_model().objects.create_user(username='testuser', password='12345', postal_code='12345', email_verified=True, email='test@example.com')
        self.user_token = self.get_user_token(username='testuser', password='12345')
        self.friend = get_user_model().objects.create_user(username='testuser2', password='12345', email_verified=True, postal_code='12345', email='test2@example.com')
        self.friend_token = self.get_user_token(username='testuser2', password='12345')
        self.post = Post.objects.create(name='Test Post', description='A test post description.', users=self.user)

    """Test Like"""
    def test_like_post(self):
        response = self.client.post(reverse('like', args=[self.post.id]), HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Like creado exitosamente!')
        self.assertTrue(Like.objects.filter(user=self.user, post=self.post).exists())

    def test_like_post_unauthenticated(self):
        response = self.client.post(reverse('like', args=[self.post.id]))
        self.assertEqual(response.status_code, 302)
        self.assertFalse(Like.objects.filter(user=self.user, post=self.post).exists())

    def test_like_post_twice(self):
        response = self.client.post(reverse('like', args=[self.post.id]), HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 200)
        response = self.client.post(reverse('like', args=[self.post.id]), HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['error'], 'Ya existe un like para este usuario y post.')
        self.assertEqual(len(Like.objects.filter(user=self.user, post=self.post)), 1)

    """Test DisLike"""
    def test_delete_like(self):
        response = self.client.post(reverse('like', args=[self.post.id]),
                                    HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(reverse('delete_like', args=[self.post.id]), HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Like eliminado exitosamente!')
        self.assertFalse(Like.objects.filter(user=self.user, post=self.post).exists())

    def test_delete_like_unauthenticated(self):
        response = self.client.post(reverse('like', args=[self.post.id]),
                                    HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 200)
        response = self.client.delete(reverse('delete_like', args=[self.post.id]))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Like.objects.filter(user=self.user, post=self.post).exists())

    def test_delete_like_not_found(self):
        response = self.client.delete(reverse('delete_like', args=[self.post.id]), HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['error'], 'No existe un like para este usuario y post.')
        self.assertTrue(not Like.objects.filter(user=self.user, post=self.post).exists())



