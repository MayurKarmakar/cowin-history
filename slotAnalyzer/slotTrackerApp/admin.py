from django.contrib import admin
from . import models
# Register your models here.

class SlotAvailabilityEventAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    
admin.site.register(models.SlotAvailabilityEvent, SlotAvailabilityEventAdmin)