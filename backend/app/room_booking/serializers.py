from django.db import transaction
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from customer_detail.models import CustomerDetail
from customer_detail.serializers import CustomerDetailSerializer
from room.models import RoomBooking

class RoomBookingSerializer(serializers.ModelSerializer):
    customer_details = CustomerDetailSerializer(many=True, read_only=True)
    original_end_time = serializers.DateTimeField(read_only=True)

    class Meta:
        model = RoomBooking
        fields = '__all__'
        read_only_fields = ('total_price', 'booked_at', 'checked_in_at', 'checked_out_at', 'cancelled_at')

class RoomBookingCreateSerializer(serializers.ModelSerializer):
    customer_details = CustomerDetailSerializer(many=True)
    
    class Meta:
        model = RoomBooking
        fields = '__all__'
        read_only_fields = ('total_price', 'status', 'booked_at', 'checked_in_at', 'checked_out_at', 'cancelled_at')

    def validate(self, data):
        room = data.get('room_code')
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        if room.status != 'open':
            raise ValidationError({'room_code': 'The selected room is not available for booking.', 'status': room.status})

        current_time = timezone.now()
        if start_time <= current_time:
            raise ValidationError({'start_time': 'The start time is invalid.'})
        if end_time <= start_time:
            raise ValidationError({'end_time': 'The end time must be after the start time.'})

        return data


    @transaction.atomic
    def create(self, validated_data):
        customer_details = validated_data.pop('customer_details')

        if type(customer_details) is not list:
            raise ValidationError({'customer_details': 'This field must be a list.'})
        if not customer_details:
            raise ValidationError({'customer_details': 'This field must not be empty.'})

        booking = RoomBooking.objects.create(**validated_data)

        if not booking.is_available(validated_data['start_time'], validated_data['end_time']):
            booking.delete() # Clean up if not available
            raise ValidationError({'error': 'The room is not available for the selected time range.'})

        booking.calculate_initial_price()

        CustomerDetail.objects.bulk_create([
            CustomerDetail(room_booking=booking, **customer)
            for customer in customer_details
        ])

        return booking

class RoomBookingUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomBooking
        fields = ['status']

    def validate(self, data):
        room = data.get('room_code')
        if room is not None and room.status != 'open':
            raise ValidationError({'room_code': 'The selected room is not available for booking.', 'status': room.status})

        return data

    def update(self, instance, validated_data):
        new_status = validated_data.get('status')

        if new_status == 'cancelled' and not instance.can_cancel():
            raise ValidationError({'status': 'Only bookings with status "booked" can be cancelled.'})

        if new_status and new_status != instance.status:
            if new_status == 'checked_in':
                instance.checked_in_at = timezone.now()
            elif new_status == 'checked_out':
                instance.checked_out_at = timezone.now()
            elif new_status == 'cancelled':
                instance.cancelled_at = timezone.now()
            instance.status = new_status
            instance.save()
        return instance

