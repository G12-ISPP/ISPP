from django.test import TestCase, Client
from django.urls import reverse
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