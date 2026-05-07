from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class AuthApiTests(APITestCase):
    def test_register_user(self):
        payload = {
            "username": "roman",
            "email": "roman@example.com",
            "password": "strongPass123",
            "company_name": "Roman LLC",
        }
        response = self.client.post(reverse("auth_register"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="roman").exists())

    def test_login_and_get_profile(self):
        user = User.objects.create_user(
            username="roman",
            email="roman@example.com",
            password="strongPass123",
        )
        token_response = self.client.post(
            reverse("token_obtain_pair"),
            {"username": user.username, "password": "strongPass123"},
            format="json",
        )
        self.assertEqual(token_response.status_code, status.HTTP_200_OK)
        access = token_response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        me_response = self.client.get(reverse("auth_me"))
        self.assertEqual(me_response.status_code, status.HTTP_200_OK)
        self.assertEqual(me_response.data["username"], user.username)
