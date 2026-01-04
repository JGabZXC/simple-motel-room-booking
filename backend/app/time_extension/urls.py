from django.urls import path

from time_extension.views import TimeExtensionListCreate, TimeExtensionDetailView

urlpatterns = [
    path('<int:room_booking_pk>/extensions/', TimeExtensionListCreate.as_view(), name='time-extension-list-create'),
    path('<int:pk>/', TimeExtensionDetailView.as_view(), name='time-extension-detail'),
]