from django.db import transaction
from django.db.transaction import atomic
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

    @transaction.atomic
    def create(self, validated_data):
        customer_details = validated_data.pop('customer_details')

        if type(customer_details) is not list:
            return ValidationError('customer_detail must be a list')
        if not customer_details:
            return ValidationError('customer_detail must not be empty')

        booking = RoomBooking.objects.create(**validated_data)
        booking.calculate_initial_price()

        CustomerDetail.objects.bulk_create([
            CustomerDetail(room_booking=booking, **customer)
            for customer in customer_details
        ])

        return booking
