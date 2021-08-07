from django.contrib import admin
from . import models
# Register your models here.

class SlotAvailabilityEventAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
class RawMessagesAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

class PredicitonsAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    
admin.site.register(models.SlotAvailabilityEvent, SlotAvailabilityEventAdmin)
admin.site.register(models.RawMessages, RawMessagesAdmin)
admin.site.register(models.Predictions, PredicitonsAdmin)
