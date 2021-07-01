from django.db.models import fields
from rest_framework import serializers
from . import models
import datetime
import os, time
import json

os.environ['TZ'] = 'Asia/Kolkata'
time.tzset()

class SlotAvailabilityEventSerializer(serializers.ModelSerializer):

    timestamp = serializers.SerializerMethodField() 

    day = serializers.SerializerMethodField() 

    time = serializers.SerializerMethodField() 
    
    day_timestamp = serializers.SerializerMethodField() 

    time_timestamp = serializers.SerializerMethodField() 

    class Meta:
        model = models.SlotAvailabilityEvent
        fields = '__all__'

    def get_start_of_day(self, x):
        start = datetime.datetime(x.year, x.month, x.day)
        return int(start.timestamp()*1000)

    def get_timestamp(self, obj):
        return int(obj.timestamp.timestamp()*1000)

    def get_day(self, obj):
        return obj.timestamp.strftime('%d %B %y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%I:%M %P')


    def get_day_timestamp(self, obj):
        return self.get_start_of_day(obj.timestamp)
    
    def get_time_timestamp(self, obj):
        return (obj.timestamp.hour * 60 + obj.timestamp.minute + 330)


class DistrictWiseFilteredDataSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField() 

    day = serializers.SerializerMethodField() 

    time = serializers.SerializerMethodField() 
    
    day_timestamp = serializers.SerializerMethodField() 

    time_timestamp = serializers.SerializerMethodField() 

    class Meta:
        model = models.SlotAvailabilityEvent
        fields = '__all__'

    def get_start_of_day(self, x):
        start = datetime.datetime(x.year, x.month, x.day)
        return int(start.timestamp()*1000)

    def get_timestamp(self, obj):
        return int(obj.timestamp.timestamp()*1000)

    def get_day(self, obj):
        return obj.timestamp.strftime('%d %B %y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%I:%M %P')


    def get_day_timestamp(self, obj):
        return self.get_start_of_day(obj.timestamp)
    
    def get_time_timestamp(self, obj):
        return (obj.timestamp.hour * 60 + obj.timestamp.minute + 330)


class PincodeWiseFilteredDataSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField() 

    day = serializers.SerializerMethodField() 

    time = serializers.SerializerMethodField() 
    
    day_timestamp = serializers.SerializerMethodField() 

    time_timestamp = serializers.SerializerMethodField() 

    class Meta:
        model = models.SlotAvailabilityEvent
        fields = '__all__'
    
    def get_start_of_day(self, x):
        start = datetime.datetime(x.year, x.month, x.day)
        return int(start.timestamp()*1000)

    def get_timestamp(self, obj):
        return int(obj.timestamp.timestamp()*1000)

    def get_day(self, obj):
        return obj.timestamp.strftime('%d %B %y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%I:%M %P')


    def get_day_timestamp(self, obj):
        return self.get_start_of_day(obj.timestamp)
    
    def get_time_timestamp(self, obj):
        return (obj.timestamp.hour * 60 + obj.timestamp.minute + 330)


class CenterNameWiseFilteredDataSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField() 

    day = serializers.SerializerMethodField() 

    time = serializers.SerializerMethodField() 
    
    day_timestamp = serializers.SerializerMethodField() 

    time_timestamp = serializers.SerializerMethodField() 
    
    class Meta:
        model = models.SlotAvailabilityEvent
        fields = '__all__'
    
    def get_start_of_day(self, x):
        start = datetime.datetime(x.year, x.month, x.day)
        return int(start.timestamp()*1000)

    def get_timestamp(self, obj):
        return int(obj.timestamp.timestamp()*1000)

    def get_day(self, obj):
        return obj.timestamp.strftime('%d %B %y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%I:%M %P')


    def get_day_timestamp(self, obj):
        return self.get_start_of_day(obj.timestamp)
    
    def get_time_timestamp(self, obj):
        return (obj.timestamp.hour * 60 + obj.timestamp.minute + 330)

class SlotAvailabilityEventSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField() 

    day = serializers.SerializerMethodField() 

    time = serializers.SerializerMethodField() 
    
    day_timestamp = serializers.SerializerMethodField() 

    time_timestamp = serializers.SerializerMethodField() 

    event_details_json = serializers.SerializerMethodField()
    
    class Meta:
        model = models.SlotAvailabilityEvent
        fields = '__all__'
    
    def get_start_of_day(self, x):
        start = datetime.datetime(x.year, x.month, x.day)
        return int(start.timestamp()*1000)

    def get_timestamp(self, obj):
        return int(obj.timestamp.timestamp()*1000)

    def get_day(self, obj):
        return obj.timestamp.strftime('%d %B %y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%I:%M %P')


    def get_day_timestamp(self, obj):
        return self.get_start_of_day(obj.timestamp)
    
    def get_time_timestamp(self, obj):
        return (obj.timestamp.hour * 60 + obj.timestamp.minute +330)

    def get_event_details_json(self, obj):
        return json.loads(obj.event_details_json)

    



class DateRangeWiseFilteredDataSerializer(serializers.ModelSerializer):
    timestamp = serializers.SerializerMethodField() 

    day = serializers.SerializerMethodField() 

    time = serializers.SerializerMethodField() 
    
    day_timestamp = serializers.SerializerMethodField() 

    time_timestamp = serializers.SerializerMethodField() 
    
    class Meta:
        model = models.SlotAvailabilityEvent
        fields = '__all__'
    
    def get_start_of_day(self, x):
        start = datetime.datetime(x.year, x.month, x.day)
        return int(start.timestamp()*1000)

    def get_timestamp(self, obj):
        return int(obj.timestamp.timestamp()*1000)

    def get_day(self, obj):
        return obj.timestamp.strftime('%d %B %y')
    
    def get_time(self, obj):
        return obj.timestamp.strftime('%I:%M %P')


    def get_day_timestamp(self, obj):
        return self.get_start_of_day(obj.timestamp)
    
    def get_time_timestamp(self, obj):
        return (obj.timestamp.hour * 60 + obj.timestamp.minute + 330)


class GeneralSerializer(serializers.ModelSerializer):

    class Meta:
        model = None
