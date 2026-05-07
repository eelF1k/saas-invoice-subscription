from rest_framework import permissions, viewsets

from apps.invoices.models import Invoice
from apps.invoices.serializers import InvoiceSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Invoice.objects.filter(owner=self.request.user).prefetch_related("items").order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
