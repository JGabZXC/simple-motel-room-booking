from django.contrib import admin
from .models import Room

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('code', 'capacity', 'isAirConditioned', 'status', 'createdAt')
    list_filter = ('status', 'isAirConditioned')
    search_fields = ('code',)
