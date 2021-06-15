from django.db import models
import uuid

# Create your models here.
class SlotAvailabilityEvent(models.Model):
    id = models.CharField(primary_key=True, max_length=40, editable=False, default=uuid.uuid4)
    state_id = models.IntegerField(default=0)
    timestamp = models.DateTimeField()
    district_id = models.IntegerField()
    center_name = models.CharField(max_length=30)
    pincode = models.CharField(max_length=6)
    available_capacity_dose1 = models.IntegerField()
    available_capacity_dose2 = models.IntegerField()
    vaccine = models.CharField(max_length=20)

    def __str__(self):
        return self.center_name