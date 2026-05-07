from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class InvoiceApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="roman", password="strongPass123")
        token_response = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "roman", "password": "strongPass123"},
            format="json",
        )
        self.access = token_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def test_create_invoice(self):
        payload = {
            "number": "INV-1001",
            "customer_name": "Acme",
            "customer_email": "billing@acme.test",
            "issue_date": "2026-05-07",
            "due_date": "2026-05-14",
            "notes": "Test invoice",
            "items": [
                {
                    "description": "Development",
                    "quantity": "2.00",
                    "unit_price": "100.00",
                }
            ],
        }
        response = self.client.post(reverse("invoice-list"), payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["number"], "INV-1001")
        self.assertEqual(len(response.data["items"]), 1)

    def test_list_only_own_invoices(self):
        other = User.objects.create_user(username="other", password="strongPass123")
        other_token = self.client.post(
            reverse("token_obtain_pair"),
            {"username": "other", "password": "strongPass123"},
            format="json",
        ).data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {other_token}")
        self.client.post(
            reverse("invoice-list"),
            {
                "number": "INV-OTHER",
                "customer_name": "Other Corp",
                "customer_email": "other@example.com",
                "issue_date": "2026-05-07",
                "due_date": "2026-05-08",
                "notes": "",
                "items": [{"description": "Other", "quantity": "1.00", "unit_price": "10.00"}],
            },
            format="json",
        )

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")
        own_response = self.client.get(reverse("invoice-list"))
        self.assertEqual(own_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(own_response.data), 0)
