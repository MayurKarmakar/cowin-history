from django.shortcuts import render
from . import models
from . import serializers
from rest_framework import viewsets, permissions
from rest_framework.parsers import JSONParser
# Create your views here.

class SlotAvailabilityEventView(viewsets.ModelViewSet):
    queryset = models.SlotAvailabilityEvent.objects.all()
    serializer_class = serializers.SlotAvailabilityEventSerializer
    parser_classes = [JSONParser]
    permission_classes = [
        permissions.AllowAny
    ]