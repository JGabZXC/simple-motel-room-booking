from datetime import timedelta
from decimal import Decimal

from django.db import models
from django.db.models import JSONField, Sum
from rest_framework.exceptions import ValidationError


def bed_details_validator(value):
    allowed_types = ['single', 'double', 'queen', 'king']
    for bed_type in value.keys():
        if bed_type not in allowed_types:
            raise ValidationError(f"Invalid bed type: {bed_type}. Allowed types are: {', '.join(allowed_types)}")

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
    bed_details = JSONField(default=dict, blank=True, validators=[bed_details_validator])
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
        if self.room_code:
            return f"Booking {self.room_code.code} ({self.id}) - {self.status}"
        return f"Booking ({self.id}) - {self.status}"

    # HELPER METHODS
    def calculate_initial_price(self):
        if not self.room_code:
            raise ValidationError("Room code must be set to calculate price.")

        duration = self.end_time - self.start_time
        total_hours = Decimal(duration.total_seconds()) / Decimal(3600)

        hourly_rate = self.room_code.price_per_hour

        self.total_price = round(total_hours * hourly_rate, 2)
        self.save()

    def extend_booking(self, minutes):
        hours_added = Decimal(minutes) / Decimal(60)
        extension_cost = round(hours_added * self.room_code.price_per_hour, 2)

        from time_extension.models import TimeExtension # Avoid circular import
        time_extension = TimeExtension.objects.create(
            room_booking=self,
            duration=hours_added,
            additional_cost=extension_cost,
        )

        self.end_time += timedelta(minutes=minutes)
        self.total_price += extension_cost
        self.save()

        return time_extension

    def is_available(self, start_time, end_time):
        overlapping_bookings = RoomBooking.objects.filter(
            room_code=self.room_code,
            status__in=['booked', 'checked_in'],
            start_time__lt=end_time,
            end_time__gt=start_time
        )

        if self.id:
            overlapping_bookings = overlapping_bookings.exclude(id=self.id)

        return not overlapping_bookings.exists()

    def can_cancel(self):
        return self.status == 'booked'

    @property
    def original_end_time(self):
        total_extension_hours = self.time_extensions.aggregate(
            total=Sum('duration')
        )['total'] or 0

        return self.end_time - timedelta(hours=float(total_extension_hours))