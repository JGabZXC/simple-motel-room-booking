from django.db import models

from room.models import RoomBooking


# Create your models here.
class CustomerDetail(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ]

    room_booking = models.ForeignKey(RoomBooking, on_delete=models.SET_NULL, null=True, related_name='customer_details')
    name = models.CharField(max_length=200)
    age = models.PositiveIntegerField()
    email = models.EmailField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)

    def __str__(self):
        return f"Customer {self.name} for Booking {self.room_booking.room_code.code}({self.room_booking.id})"