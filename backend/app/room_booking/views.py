# Create your views here.
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView
from django.utils.dateparse import parse_datetime
from django.utils import timezone

from room.models import RoomBooking
from room_booking.serializers import RoomBookingCreateSerializer, RoomBookingUpdateSerializer, RoomBookingSerializer


class RoomBookingListCreate(ListCreateAPIView):
    queryset = RoomBooking.objects.all()
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return RoomBookingCreateSerializer
        return RoomBookingSerializer

    def get_queryset(self):
        queryset = RoomBooking.objects.all().order_by('-created_at') if hasattr(RoomBooking, 'created_at') else RoomBooking.objects.all().order_by('-booked_at')
        
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)

        start_time_str = self.request.query_params.get('start_time')
        end_time_str = self.request.query_params.get('end_time')

        if start_time_str:
            start_time = parse_datetime(start_time_str)
            if start_time:
                if timezone.is_naive(start_time):
                    start_time = timezone.make_aware(start_time)
                queryset = queryset.filter(start_time__gte=start_time)

        if end_time_str:
            end_time = parse_datetime(end_time_str)
            if end_time:
                if timezone.is_naive(end_time):
                    end_time = timezone.make_aware(end_time)
                queryset = queryset.filter(end_time__lte=end_time)

        guest_name = self.request.query_params.get('guest_name')
        if guest_name:
            queryset = queryset.filter(customer_details__name__icontains=guest_name).distinct()

        return queryset

class RoomBookingDetailView(RetrieveUpdateAPIView):
    queryset = RoomBooking.objects.all()
    lookup_field = 'pk'

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return RoomBookingUpdateSerializer
        return RoomBookingSerializer
