from datetime import date, datetime
from time import strftime
from django.db.models import query
from django.db.models.query import QuerySet
from django.http import request
from django.shortcuts import render
from django.views import generic
from . import models
from . import serializers
from rest_framework import permissions, viewsets
from rest_framework.parsers import JSONParser
from rest_framework.response import Response



# Create your views here.

class SlotAvailabilityEventView(viewsets.ModelViewSet):
    queryset = models.SlotAvailabilityEvent.objects.all()
    # queryset_2 = models.SlotAvailabilityEvent.objects.all().filter(datetime.fromtimestamp(timestamp).month__lte)
    serializer_class = serializers.SlotAvailabilityEventSerializer
    parser_classes = [JSONParser]
    permission_classes = [
        permissions.AllowAny
    ]
    
class DistrictWiseFilteredDataView(viewsets.ModelViewSet):
    # queryset = models.SlotAvailabilityEvent.objects.all()
    serializer_class = serializers.DistrictWiseFilteredDataSerializer
    parser_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = models.SlotAvailabilityEvent.objects.all()
        if self.request.method == 'GET':
            district_id_value = self.request.GET.get('district_id', None)
            print("got district_id: ",district_id_value)
            print("got district_id type: ",type(district_id_value))

            if district_id_value is not None:
                print(queryset.filter(district_id=int(district_id_value)))
                return queryset.filter(district_id=int(district_id_value))

            return queryset

class PincodeWiseFilteredDataView(viewsets.ModelViewSet):
    serializer_class = serializers.PincodeWiseFilteredDataSerializer
    parser_classes = [
        permissions.AllowAny
    ]


    def get_queryset(self):

        queryset = models.SlotAvailabilityEvent.objects.all()
        if self.request.method == 'GET':
            pincode_value = self.request.GET.get('pincode', None)
            print("Picode Value: ", pincode_value)
            print("Picode Value type: ", type(pincode_value))
            
            if pincode_value is not None:
                return queryset.filter(pincode=str(pincode_value))
                # return models.SlotAvailabilityEvent.objects.filter(pincode=pincode_value)
            return queryset



    
    # def retrieve(self, request, *args, **kwargs):
    #     params = kwargs
    #     print(params)
    #     return Response({})

        


class CenterNameWiseFilteredDataView(viewsets.ModelViewSet):
    serializer_class = serializers.SlotAvailabilityEventSerializer
    parser_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = models.SlotAvailabilityEvent.objects.all()

        if self.request.method == 'GET':
            input_center_name = self.request.GET.get('center_name_like', None)
            state_id_value = self.request.GET.get('state_id', None)

            if (input_center_name is not None):
                return queryset.raw('SELECT * FROM slotTrackerApp_slotavailabilityevent WHERE state_id=%s AND center_name LIKE %s group by center_name', [state_id_value, '%'+input_center_name+'%'])

                # print(queryset.filter(state_id=int(state_id_value)))
                # return queryset.filter(state_id=int(state_id_value))
            return queryset

class DateRangeWiseFilteredDataView(viewsets.ModelViewSet):
    serializer_class = serializers.PincodeWiseFilteredDataSerializer
    parser_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = models.SlotAvailabilityEvent.objects.all()

        if self.request.method == 'GET':
            start_date_string = self.request.GET.get('start_date', None)
            # print('start_date: ', start_date_timstamp)
            # print('start_date: ', type(start_date_timstamp))
            end_date_string = self.request.GET.get('end_date', None)

            if (start_date_string is not None) and (end_date_string is not None):
                return queryset.raw("SELECT * FROM slotTrackerApp_slotavailabilityevent WHERE DATE(timestamp)<=%s AND DATE(timestamp)>=%s", [end_date_string ,start_date_string])
                # print(queryset)
                # return queryset
            
            return queryset