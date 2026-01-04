from django.urls import path

from customer_detail.views import CustomerDetailListCreate

urlpatterns = [
    path('', CustomerDetailListCreate.as_view(), name='customer-detail-list-create'),
]