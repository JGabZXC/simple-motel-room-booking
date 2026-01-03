from django.contrib import admin

from customer_detail.models import CustomerDetail
from room.models import Room, RoomBooking
from time_extension.models import TimeExtension


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('code', 'capacity', 'is_air_conditioned', 'status', 'created_at')
    list_filter = ('status', 'is_air_conditioned')
    search_fields = ('code',)

@admin.register(RoomBooking)
class RoomBookingAdmin(admin.ModelAdmin):
    list_display = ('room_code', 'start_time', 'end_time', 'status', 'total_price', 'booked_at')
    list_filter = ('status', 'room_code')
    search_fields = ('room_code__code',)

@admin.register(CustomerDetail)
class CustomerDetailAdmin(admin.ModelAdmin):
    list_display = ('room_booking','name', 'age', 'email', 'phone_number', 'gender',)
    list_filter = ('room_booking', 'name')
    search_fields = ('room_booking__room_code__code', 'name', 'email', 'phone_number',)

@admin.register(TimeExtension)
class TimeExtensionAdmin(admin.ModelAdmin):
    list_display = ('room_booking', 'duration', 'added_at')
    list_filter = ('room_booking',)
    search_fields = ('room_booking__room_code__code',)