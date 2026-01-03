from django.db import models

from time_extension.models import TimeExtension


class Room(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('maintenance', 'Maintenance'),
    ]
    code = models.CharField(max_length=100) # R101, R102
    capacity = models.PositiveIntegerField()
    is_airConditioned = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code

class RoomBooking(models.Model):
    ROOM_BOOKING_STATUS_CHOICES = [
        ('booked', 'Booked'),
        ('checked_in', 'Checked In'),
        ('checked_out', 'Checked Out'),
        ('cancelled', 'Cancelled'),
    ]

    room_code = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, related_name='bookings')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=ROOM_BOOKING_STATUS_CHOICES, default='booked')
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    booked_at = models.DateTimeField(auto_now_add=True)
    checked_in_at = models.DateTimeField(null=True, blank=True)
    checked_out_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Booking {self.room_code.code} ({self.id}) - {self.status}"