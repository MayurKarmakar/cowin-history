from datetime import date, datetime, timedelta
from dateutil import tz
from time import strftime
from django.db.models import query
from django.db.models.query import QuerySet
from django.http import request
from django.shortcuts import render
from django.views import generic
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, ListModelMixin, RetrieveModelMixin, UpdateModelMixin
from . import models
from rest_framework import status
from rest_framework.decorators import action
from . import serializers
from rest_framework import permissions, viewsets
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from . import models



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
    serializer_class = serializers.SlotAvailabilityEventSerializer
    parser_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = None
        if self.request.method == 'GET':
            district_id = self.request.GET.get('district_id', None)

            start_date_string = self.request.GET.get('start_date', None)
            # print('start_date: ', start_date_timstamp)
            # print('start_date: ', type(start_date_timstamp))
            end_date_string = self.request.GET.get('end_date', None)
            start_date_string += ' 00:00:00'
            end_date_string += ' 23:59:59'

            if district_id is not None:
                # print(queryset.filter(district_id=int(district_id_value)))
                # return queryset.filter(district_id=int(district_id_value))
                queryset = models.SlotAvailabilityEvent.objects.all().raw("SELECT * FROM slotTrackerApp_slotavailabilityevent WHERE district_id=%s AND timestamp between CONVERT_TZ(%s, '+05:30', '+00:00') and CONVERT_TZ(%s, '+05:30', '+00:00') order by timestamp desc limit 500", [district_id, start_date_string, end_date_string])


        return self.none() if queryset is None else queryset

class PincodeWiseFilteredDataView(viewsets.ModelViewSet):
    serializer_class = serializers.SlotAvailabilityEventSerializer
    parser_classes = [
        permissions.AllowAny
    ]


    def get_queryset(self):

        queryset = models.SlotAvailabilityEvent.objects.all()
        if self.request.method == 'GET':
            pincode = self.request.GET.get('pincode', None)

            start_date_string = self.request.GET.get('start_date', None)
            # print('start_date: ', start_date_timstamp)
            # print('start_date: ', type(start_date_timstamp))
            end_date_string = self.request.GET.get('end_date', None)
            start_date_string += ' 00:00:00'
            end_date_string += ' 23:59:59'
            
            if pincode is not None:
                # return queryset.filter(pincode=str(pincode_value))
                return queryset.raw("SELECT * FROM slotTrackerApp_slotavailabilityevent WHERE pincode=%s AND timestamp between CONVERT_TZ(%s, '+05:30', '+00:00') and CONVERT_TZ(%s, '+05:30', '+00:00') order by timestamp desc limit 500", [pincode, start_date_string, end_date_string])
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
            start_date_string = self.request.GET.get('start_date', None)
            # print('start_date: ', start_date_timstamp)
            # print('start_date: ', type(start_date_timstamp))
            end_date_string = self.request.GET.get('end_date', None)
            # start_date_string += ' 00:00:00'
            # end_date_string += ' 23:59:59'

            if (input_center_name is not None):
                return queryset.raw('SELECT * FROM slotTrackerApp_slotavailabilityevent WHERE state_id=%s AND center_name LIKE %s group by center_name', [state_id_value, '%'+input_center_name+'%'])

                # print(queryset.filter(state_id=int(state_id_value)))
                # return queryset.filter(state_id=int(state_id_value))
            return queryset

class DateRangeWiseFilteredDataView(viewsets.ModelViewSet):
    serializer_class = serializers.SlotAvailabilityEventSerializer
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

            start_date_string += ' 00:00:00'
            end_date_string += ' 23:59:59'

            if (start_date_string is not None) and (end_date_string is not None):
                return queryset.raw("SELECT * FROM slotTrackerApp_slotavailabilityevent WHERE DATE(timestamp)>=%s AND DATE(timestamp)<=%s", [end_date_string ,start_date_string])
                # print(queryset)
                # return queryset
            
            return queryset

class VaccinationCenterDataView(viewsets.ModelViewSet):
    serializer_class = serializers.SlotAvailabilityEventSerializer
    parser_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        queryset = models.SlotAvailabilityEvent.objects.all()

        if self.request.method == 'GET':
            district_id = self.request.GET.get('district_id', None)
            district_id = int(district_id)
            center_name = self.request.GET.get('center_name', None)

            center_name.replace('%20', ' ')

            start_date_string = self.request.GET.get('start_date', None)
            # print('start_date: ', start_date_timstamp)
            # print('start_date: ', type(start_date_timstamp))
            end_date_string = self.request.GET.get('end_date', None)

            start_date_string += ' 00:00:00'
            end_date_string += ' 23:59:59'


            if (district_id is not None) and (center_name is not None):
                return queryset.raw("SELECT * FROM slotTrackerApp_slotavailabilityevent WHERE district_id=%s AND center_name=%s AND timestamp between CONVERT_TZ(%s, '+05:30', '+00:00') and CONVERT_TZ(%s, '+05:30', '+00:00') order by timestamp desc limit 500", [district_id, center_name, start_date_string, end_date_string])
            
            return queryset

class PredictionRequestCreateView(viewsets.GenericViewSet, CreateModelMixin, UpdateModelMixin):
    queryset = models.Predictions.objects.all()
    serializer_class = serializers.PredictionCreateSerializer
    permission_classes = [permissions.AllowAny]

    def check_if_record_exists_past_one_hour_from_now(self, request):

        queryset = models.Predictions.objects.all()
        current_time = datetime.now()
        time_past_an_hour = (current_time - timedelta(hours = 1)).time()
        current_day = current_time.day
        
        

        id = self.request.data["id"].strip()
        record = queryset.filter(id = id)

        if record.exists():

            time_value_in_record = record[0].timestamp
            day_value_in_record = time_value_in_record.day
            time_value_in_current_tz = (time_value_in_record + timedelta(hours=5, minutes=30)).time()
            if current_day == day_value_in_record:
                if (current_time.time() >= time_value_in_current_tz and time_value_in_current_tz >= time_past_an_hour):
                    return True
                else:
                    return False
            else:
                return False

    

    def create(self, request, *args, **kwargs):

        if not self.check_if_record_exists_past_one_hour_from_now(request):
            id = request.data['id']

            try:
                record= self.queryset.filter(id = id)
                record.delete()
            except Exception as e:
                print("Exception: ", e)
        
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_201_CREATED,
                                headers=headers)

        return Response({'Failed':'A request record with same details already exists'}, status=status.HTTP_400_BAD_REQUEST)


class PredictionsDetailView(viewsets.GenericViewSet, RetrieveModelMixin):
    serializer_class = serializers.RetrievePredictionsSerializer
    queryset = models.Predictions.objects.all()

    # def get_queryset(self):

    #     print("PredictionsDetailView: ", self.request.data)

    #     id = self.request.GET.get('id', None)

    #     return self.queryset.filter(id = id)

    # def retrieve(self, request, *args, **kwargs):

    #     print("PredictionsDetailView: ", self.request.data)
    #     id = self.request.GET.get('id', None)
    #     print("PredictionsDetailView id received: ", id)


    #     return 

    def get(self, request, *args, **kwargs):

        print("PredictionsDetailView: ", self.request.data)

        id = self.request.GET.get('id', None)

        print("Id received PredictionsDetailView: ", id)

        return self.queryset.filter(id = id)

        # return self.retrieve(request, *args, **kwargs)