from datetime import timedelta
from decimal import Decimal

from django.db import models

class Room(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('maintenance', 'Maintenance'),
    ]
    code = models.CharField(max_length=100) # R101, R102
    capacity = models.PositiveIntegerField()
    is_air_conditioned = models.BooleanField(default=False)
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

    # HELPER METHODS
    def calculate_initial_price(self):
        duration = self.end_time - self.start_time
        total_hours = Decimal(duration.total_seconds()) / Decimal(3600)

        hourly_rate = self.room_code.price_per_hour

        self.total_price = round(total_hours * hourly_rate, 2)
        self.save()

    def extend_booking(self, minutes):
        hours_added = Decimal(minutes) / Decimal(60)
        extension_cost = round(hours_added * self.room_code.price_per_hour, 2)

        from time_extension.models import TimeExtension
        TimeExtension.objects.create(
            room_booking=self,
            duration=hours_added,
            additional_cost=extension_cost,
        )

        self.end_time += timedelta(minutes=minutes)
        self.total_price += extension_cost
        self.save()