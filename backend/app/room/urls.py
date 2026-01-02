from django.urls import path

from room.views import RoomListCreate, RoomDetailView

urlpatterns = [
    path('', RoomListCreate.as_view(), name='room-list-create'),
    path('<str:code>', RoomDetailView.as_view(), name='room-get-update')
]