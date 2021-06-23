from django.core.management.base import BaseCommand, CommandError
from telethon import TelegramClient, events, sync
from slotTrackerApp.models import SlotAvailabilityEvent

import datetime


api_id = 5446669
api_hash = '45a721b995318b63052fc3a1c578fbf8'

client = TelegramClient('slot_tracker', api_id, api_hash)

client.start()
client.get_dialogs()

current_entitiy = client.get_entity(1174734037)
message_object = client.get_messages(current_entitiy, limit=None)

for item in message_object:
    # print(item.message)
    if ((item.date).day == datetime.datetime(2021, 5, 15, 11, 24, 13).day):
        print(item.message)
        print("\n")

@client.on(events.NewMessage())
async def handler(event):
    event_str = str(event)

client.run_until_disconnected()


class Command(BaseCommand):
    help = "Tests the telebot.py script"

    def handle(self, *args, **options):
        pass