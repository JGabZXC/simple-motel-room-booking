from django.db import transaction
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from customer_detail.models import CustomerDetail
from customer_detail.serializers import CustomerDetailSerializer
from room.models import RoomBooking

class RoomBookingSerializer(serializers.ModelSerializer):
    customer_details = CustomerDetailSerializer(many=True)

    class Meta:
        model = RoomBooking
        fields = '__all__'
        read_only_fields = ('total_price', 'status', 'booked_at', 'checked_in_at', 'checked_out_at', 'cancelled_at')

    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     representation['room_code'] = instance.room_code.code if instance.room_code else None
    #     return representation

    @transaction.atomic
    def create(self, validated_data):
        customer_details = validated_data.pop('customer_details')

        if type(customer_details) is not list:
            raise ValidationError({'customer_details': 'This field must be a list.'})
        if not customer_details:
            raise ValidationError({'customer_details': 'This field must not be empty.'})

        booking = RoomBooking.objects.create(**validated_data)

        if not booking.is_available(validated_data['start_time'], validated_data['end_time']):
            raise ValidationError({'error': 'The room is not available for the selected time range.'})

        booking.calculate_initial_price()

        CustomerDetail.objects.bulk_create([
            CustomerDetail(room_booking=booking, **customer)
            for customer in customer_details
        ])

        return booking
