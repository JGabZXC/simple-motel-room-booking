from rest_framework import serializers

from customer_detail.models import CustomerDetail


class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerDetail
        fields = '__all__'
