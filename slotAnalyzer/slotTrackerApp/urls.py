from django.urls import path
from rest_framework import routers, urlpatterns
from . import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'slotAvailabilityEvent', views.SlotAvailabilityEventView, basename='SlotAvailabilityEventView')

urlpatterns = router.urls