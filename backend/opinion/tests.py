from django.test import TestCase
from users.models import CustomUser
from opinion.models import Opinion


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

        
    
