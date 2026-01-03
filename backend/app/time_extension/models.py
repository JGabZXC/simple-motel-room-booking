from django.db import models


# Create your models here.
class TimeExtension(models.Model):
    room_booking = models.ForeignKey('room.RoomBooking', on_delete=models.SET_NULL, null=True, related_name='time_extensions')
    duration = models.PositiveIntegerField(help_text="Duration in minutes")
    additional_cost = models.DecimalField(max_digits=10, decimal_places=2)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Extension for Booking {self.room_booking.room_code.code}({self.room_booking.id}) - {self.duration} mins"