from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView

from room.models import Room
from room.serializers import RoomSerializer


# Create your views here.
class RoomListCreate(ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class RoomDetailView(RetrieveUpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    lookup_field = 'code'
