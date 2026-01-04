# Create your views here.
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView, ListCreateAPIView

from time_extension.models import TimeExtension
from time_extension.serializers import TimeExtensionSerializer


class TimeExtensionListCreate(ListCreateAPIView):
    queryset = TimeExtension.objects.all()
    serializer_class = TimeExtensionSerializer

class TimeExtensionDetailView(RetrieveUpdateAPIView):
    queryset = TimeExtension.objects.all()
    serializer_class = TimeExtensionSerializer
    lookup_field = 'roomBooking'