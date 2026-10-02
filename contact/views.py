from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageCreateAPIView(generics.CreateAPIView):
    """
    Public API for submitting a contact request.

    Visitors can create a message.
    They cannot read, update, or delete messages through this endpoint.
    """

    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]