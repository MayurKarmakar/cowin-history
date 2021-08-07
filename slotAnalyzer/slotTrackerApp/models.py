from django.db import models
# import uuid

# Create your models here.
class SlotAvailabilityEvent(models.Model):
    id = models.CharField(primary_key=True, max_length=200, editable=True)
    # unique_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    state_id = models.IntegerField(default=0)
    timestamp = models.DateTimeField()
    district_id = models.IntegerField()
    center_name = models.CharField(max_length=100)
    pincode = models.CharField(max_length=6)
    # available_capacity_dose1 = models.IntegerField()
    # available_capacity_dose2 = models.IntegerField()
    # vaccine = models.CharField(max_length=20)
    event_details_json = models.CharField(max_length=10000, default='')

    def __str__(self):
        return self.center_name

class RawMessages(models.Model):
    id = models.CharField(primary_key=True, max_length=200, editable=True)
    event_message = models.CharField(max_length=10000)
    timestamp = models.DateTimeField()
    district_id = models.IntegerField()
    def __str__(self):
        return self.event_message

class Predictions(models.Model):
    id = models.CharField(primary_key=True, editable=True, max_length=100)
    timestamp = models.DateTimeField(auto_now=True)
    district_id = models.IntegerField(blank=True, null=True)
    pincode = models.IntegerField(blank=True, null=True)
    center_name = models.CharField(max_length=100, blank=True, null=True)
    time_statistics_json = models.CharField(blank=True, max_length=1000, null=True)
    forecast_json = models.CharField(max_length=1000, blank=True, null=True)
    status = models.CharField(default='N/A', max_length=20)

    def __str__(self):

        content = '{0.district_id} {0.center_name} {0.pincode} {0.timestamp}'
        return content.format(self)

