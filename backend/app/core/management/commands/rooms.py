from django.core.management import BaseCommand
from django.db import transaction

from room.models import Room
import json

class Command(BaseCommand):
    help = 'Populate Initial Room Data'

    def handle(self, *args, **kwargs):
        rooms = open('core/management/json/room.json').read()
        json_rooms = json.loads(rooms)

        try:
            for room in json_rooms:
                with transaction.atomic():
                    Room.objects.bulk_create([
                        Room(**room)
                    ])
        except Exception as e:
            print(f'Error occurred: {e}')
