from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView

from room.models import Room
from room.serializers import RoomSerializer


# Create your views here.
class RoomListCreate(ListCreateAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()

class RoomDetailView(RetrieveUpdateAPIView):
    serializer_class = RoomSerializer
    queryset = Room.objects.all()
    lookup_field = 'code'
