from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404

from room.models import RoomBooking
from time_extension.models import TimeExtension


class TimeExtensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeExtension
        fields = '__all__'
        read_only_fields = ('added_at', 'additional_cost')

    def create(self, validated_data):
        view = self.context.get('view')
        booking = get_object_or_404(RoomBooking, pk=view.kwargs.get('room_booking_pk'))
        duration = validated_data.pop('duration')
        if not duration:
            raise ValidationError("Minutes must be greater than zero.")

        minutes_to_add = duration * 60 # Convert hours to minutes
        new_extension = booking.extend_booking(minutes_to_add)

        return new_extension

