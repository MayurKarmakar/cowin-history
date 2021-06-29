from django.contrib import admin
from . import models
# Register your models here.

class SlotAvailabilityEventAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
class BBMP_DIST_MESSAGESAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)
    
admin.site.register(models.SlotAvailabilityEvent, SlotAvailabilityEventAdmin)
admin.site.register(models.BBMP_DIST_MESSAGES, BBMP_DIST_MESSAGESAdmin)