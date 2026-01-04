from django.urls import path

from room_booking.views import RoomBookingListCreate, RoomBookingDetailView

urlpatterns = [
    path('', RoomBookingListCreate.as_view(), name='room-booking-list-create'),
    path('<int:pk>/', RoomBookingDetailView.as_view(), name='room-booking-update-view'),
]