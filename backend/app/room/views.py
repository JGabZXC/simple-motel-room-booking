from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from django.db.models import Q
from django.utils.dateparse import parse_datetime
from django.utils import timezone

from room.models import Room, RoomBooking
from room.serializers import RoomSerializer


# Create your views here.
class RoomListCreate(ListCreateAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        queryset = Room.objects.all()
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        start_time_str = self.request.query_params.get('start_time')
        end_time_str = self.request.query_params.get('end_time')

        if start_time_str and end_time_str:
            start_time = parse_datetime(start_time_str)
            end_time = parse_datetime(end_time_str)

            if start_time and end_time:
                if timezone.is_naive(start_time):
                    start_time = timezone.make_aware(start_time)
                if timezone.is_naive(end_time):
                    end_time = timezone.make_aware(end_time)

                # Find rooms that have overlapping bookings
                # Overlap: booking_start < request_end AND booking_end > request_start
                overlapping_bookings = RoomBooking.objects.filter(
                    Q(status='booked') | Q(status='checked_in'),
                    start_time__lt=end_time,
                    end_time__gt=start_time
                ).values_list('room_code', flat=True)

                queryset = queryset.exclude(id__in=overlapping_bookings)

        return queryset

class RoomDetailView(RetrieveUpdateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    lookup_field = 'code'
