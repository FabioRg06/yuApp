from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse

class UserRegistrationTestCase(APITestCase):
    def test_user_registration(self):
        url = reverse('register')  # Nombre definido en urls.py
        data = {
            "username": "testuser",
            "email": "testusear@exmple.com",
            "password": "securepassword123"
        }
        response = self.client.post(url, data)

        # Verificar que el registro es exitoso
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verificar que los tokens están presentes en la respuesta
        self.assertIn('refresh', response.data)
        self.assertIn('access', response.data)

