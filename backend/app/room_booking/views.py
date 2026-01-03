# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView

from room.models import RoomBooking
from room_booking.serializers import RoomBookingSerializer


class RoomBookingListCreate(ListCreateAPIView):
    queryset = RoomBooking.objects.all()
    serializer_class = RoomBookingSerializer

class RoomBookingDetailView(RetrieveUpdateAPIView):
    queryset = RoomBooking.objects.all()
    serializer_class = RoomBookingSerializer
    lookup_field = 'id'