from django.urls import path

from room.views import RoomDetailView
from room_booking.views import RoomBookingListCreate

urlpatterns = [
    path('', RoomBookingListCreate.as_view(), name='room-booking-list-create'),
    path('<int:pk>/', RoomDetailView.as_view(), name='room-booking-update-view'),
]