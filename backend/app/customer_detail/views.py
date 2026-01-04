from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView

from customer_detail.models import CustomerDetail
from customer_detail.serializers import CustomerDetailSerializer


# Create your views here.
class CustomerDetailListCreate(ListCreateAPIView):
    queryset = CustomerDetail.objects.all()
    serializer_class = CustomerDetailSerializer