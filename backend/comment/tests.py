from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from .models import Comment, Post
from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.utils import IntegrityError
from .models import CustomUser, Post, Comment
import json


class CommentViewsTestCase(TestCase):

    def get_user_token(self, username, password):
        response_login = self.client.post('/users/login/', {'username': username, 'password': password},
                                          format='json')
        return response_login.data.get('token', '')

    def setUp(self):
        self.client = Client()
        self.user1 = CustomUser.objects.create_user(
            id=1,
            username='test1',
            password='test1',
            address='test1',
            postal_code=1234,
            city='test1',
            email='test1@example.com',
            email_verified=True
        )
        self.user2 = CustomUser.objects.create_user(
            id=2,
            username='test2',
            password='test2',
            address='test1',
            postal_code=1234,
            city='test1',
            email='test2@example.com',
            email_verified=True
        )
        self.user_token = self.get_user_token(username='test2', password='test2')
        self.post = Post.objects.create(
            name='Test Post',
            description='A test post description.',
            users=self.user1,
        )
        self.comment = Comment.objects.create(user=self.user1, post=self.post, content='Test comment')

    def test_add_comment(self):
        url = reverse('add_comment')
        data = {
            'post_id': self.post.id,
            'comment': 'New comment',
            'user_id': self.user2.id,
        }
        response = self.client.post(url, data, content_type='application/json', HTTP_AUTHORIZATION= 'Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 201)

    def test_add_comment_yet_comment(self):
        url = reverse('add_comment')
        data = {
            'post_id': self.post.id,
            'comment': 'New comment',
            'user_id': self.user1.id,
        }
        response = self.client.post(url, data, content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_add_comment_not_exists_user(self):
        url = reverse('add_comment')
        data = {
            'post_id': self.post.id,
            'comment': 'New comment',
            'user_id': 99999,
        }
        response = self.client.post(url, data, content_type='application/json', HTTP_AUTHORIZATION= 'Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 404)

    def test_add_comment_not_exists_post(self):
        url = reverse('add_comment')
        data = {
            'post_id': 99999,
            'comment': 'New comment',
            'user_id': self.user2.id,
        }
        response = self.client.post(url, data, content_type='application/json', HTTP_AUTHORIZATION= 'Bearer ' + self.user_token)
        self.assertEqual(response.status_code, 404)

    def test_update_comment(self):
        url = reverse('update_comment', args=[self.comment.id])
        data = {
            'comment': 'Updated comment'
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_delete_comment(self):
        url = reverse('delete_comment', args=[self.comment.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 200)

    def test_get_comments(self):
        url = reverse('get_comments', args=[self.post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test comment')

    def test_update_comment_not_exists(self):
        url = reverse('update_comment', args=[99999])  # Un ID de comentario que no existe
        data = {
            'comment': 'Updated comment'
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_update_comment_exceed_length(self):
        url = reverse('update_comment', args=[self.comment.id])
        data = {
            'comment': 'a' * 201  # Un comentario que excede el límite de caracteres
        }
        response = self.client.put(url, json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_delete_comment_not_exists(self):
        url = reverse('delete_comment', args=[99999])  # Un ID de comentario que no existe
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)

    def test_get_comments_not_exists_post(self):
        url = reverse('get_comments', args=[99999])  # Un ID de post que no existe
        response = self.client.get(url)
        self.assertEqual(response.status_code, 404)

    def test_get_comments_empty_post(self):
        post = Post.objects.create(name='Empty Post', description='A post with no comments', users=self.user1)
        url = reverse('get_comments', args=[post.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertJSONEqual(response.content, [])

class CommentViewSetTests2(TestCase):

    def setUp(self):
        # Crear un usuario de prueba
        self.user = get_user_model().objects.create_user(username='testuser', password='12345', postal_code='12345', email_verified=True, email='test@example.com')
        # Crear un post de prueba
        self.image = SimpleUploadedFile(name='test_image.jpg', content=b'some dummy content', content_type='image/jpeg')
        self.post = Post.objects.create(
            name='Test Post',
            description='A test post description.',
            image=self.image,
            users=self.user
        )
        # Configurar el cliente
        self.client = Client()
        # Obtener el token de usuario
        self.user_token = self.get_user_token()

    def get_user_token(self):
        response_login = self.client.post('/users/login/', {'username': 'testuser', 'password': '12345'}, format='json')
        return response_login.data.get('token', '')

    def test_add_comment(self):
        url = reverse('add_comment')
        data = {
            'post_id': self.post.id,
            'comment': 'New Comment',
            'user_id': self.user.id
        }
        response = self.client.post(url, data, HTTP_AUTHORIZATION='Bearer ' + self.user_token, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_comments(self):
        url = reverse('get_comments', kwargs={'postid': self.post.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = Comment.objects.filter(post=self.post)
        self.assertEqual(len(response.json()), expected_data.count())

    def test_update_comment(self):
        comment = Comment.objects.create(user=self.user, post=self.post, content='Test Comment')
        url = reverse('update_comment', kwargs={'pk': comment.id})
        data = {
            'comment': 'Updated Comment'
        }
        response = self.client.put(url, data, HTTP_AUTHORIZATION='Bearer ' + self.user_token, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        comment.refresh_from_db()
        self.assertEqual(comment.content, 'Updated Comment')

    def test_delete_comment(self):
        comment = Comment.objects.create(user=self.user, post=self.post, content='Test Comment')
        url = reverse('delete_comment', kwargs={'pk': comment.id})
        response = self.client.delete(url, HTTP_AUTHORIZATION='Bearer ' + self.user_token)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        with self.assertRaises(Comment.DoesNotExist):
            Comment.objects.get(id=comment.id)

    def test_add_comment_invalid_user(self):
        url = reverse('add_comment')
        data = {
            'post_id': self.post.id,
            'comment': 'New Comment',
            'user_id': 9999  # ID de un usuario que no existe
        }
        response = self.client.post(url, data, HTTP_AUTHORIZATION='Bearer ' + self.user_token, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {'error': 'El usuario o el post no existe'})

    def test_add_comment_invalid_post(self):
        url = reverse('add_comment')
        data = {
            'post_id': 9999,  # ID de un post que no existe
            'comment': 'New Comment',
            'user_id': self.user.id
        }
        response = self.client.post(url, data, HTTP_AUTHORIZATION='Bearer ' + self.user_token, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.json(), {'error': 'El usuario o el post no existe'})

    def test_add_comment_invalid_content_length(self):
        url = reverse('add_comment')
        data = {
            'post_id': self.post.id,
            'comment': 'a' * 201,  # Comentario con más de 200 caracteres
            'user_id': self.user.id
        }
        response = self.client.post(url, data, HTTP_AUTHORIZATION='Bearer ' + self.user_token, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json(), {'error': 'El comentario no puede tener más de 200 caracteres'})

    def test_add_comment_duplicate_comment(self):
        # Crear un comentario duplicado
        Comment.objects.create(user=self.user, post=self.post, content='New Comment')
        url = reverse('add_comment')
        data = {
            'post_id': self.post.id,
            'comment': 'New Comment',
            'user_id': self.user.id
        }
        response = self.client.post(url, data, HTTP_AUTHORIZATION='Bearer ' + self.user_token, content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(response.json(), {'error': 'Ya has comentado este post'})
