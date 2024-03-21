from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
import os
from django.core.files.base import ContentFile


class BaseTestCase(TestCase):

    def setUp(self):
        super().setUp()    

    def tearDown(self):
        super().tearDown()
    
    def test_conversion_no_file(self):
        response = self.client.post('/conversion/api/v1/convert_to_stl')
        self.assertEqual(response.status_code, 400)
    
    def test_conversion_file_empty(self):
        file = SimpleUploadedFile("file.txt", b"content")
        data = {'file': file}

        with self.assertRaises(ValueError) as error:
            self.client.post('/conversion/api/v1/convert_to_stl', data, format='json')
        self.assertEqual(str(error.exception), 'Unsupported file format: txt')
    
    def test_conversion_big_file(self):

        large_file = ContentFile(b'a' * (30 * 1024 * 1024 + 1), name='large_file.obj')

        response = self.client.post('/conversion/api/v1/convert_to_stl', {'file': large_file}, format='multipart')
        self.assertEqual(response.status_code, 400)
    
    def test_conversion_file_correct(self):
        current_directory = os.path.dirname(os.path.abspath(__file__))

        file_path = os.path.join(current_directory, 'files', 'FinalBaseMesh.obj')

        with open(file_path, 'rb') as file:
            file_content = file.read()

        valid_file = SimpleUploadedFile('FinalBaseMesh.obj', file_content)

        response = self.client.post('/conversion/api/v1/convert_to_stl', {'file': valid_file}, format='multipart')
        self.assertEqual(response.status_code, 200)