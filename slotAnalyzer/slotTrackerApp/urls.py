from django.urls import path
from rest_framework import routers, urlpatterns
from . import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'slotAvailabilityEvent', views.SlotAvailabilityEventView, basename='SlotAvailabilityEventView')
router.register(r'district_data', views.DistrictWiseFilteredDataView, basename='DistrictWiseFilteredDataView')
router.register(r'pincode', views.PincodeWiseFilteredDataView, basename='PincodeWiseFilteredDataView')
router.register(r'center_name', views.CenterNameWiseFilteredDataView, basename='CenterNameWiseFilteredDataView')
router.register(r'date/range_filter', views.DateRangeWiseFilteredDataView, basename='DateRangeWiseFilteredDataView')
router.register(r'center/data', views.VaccinationCenterDataView, basename='VaccinationCenterDataView')
router.register(r'submit_job', views.PredictionRequestCreateView, basename='PredictionRequestCreateView')
router.register(r'predictions', views.PredictionsDetailView, basename='PredictionsDetailView')

urlpatterns = router.urls