from django.core.management.base import BaseCommand, CommandError
from telethon import TelegramClient, events, sync
from slotTrackerApp.models import Predictions
from datetime import date, datetime, tzinfo, timedelta
from dateutil import tz


from_zone = tz.tzutc()
to_zone = tz.tzlocal()

records = Predictions.objects.all()

crt = datetime.now()
crt_date = crt.day
print("Current Day: ", crt_date)

if crt_date > 30:
    print("Yes day greater")
# time_past_an_hour = crt - timedelta(hours = 1)
print("CUrrent time: ",crt)
print("Time past 1 hrs: ", (crt - timedelta(hours = 1)).time())
print("Time past 1 hrs: ", type((crt - timedelta(hours = 1)).time()))
print("Records fetched: ", records[0])
for record in records:
    print("Record at idx 0: ", record)
    print("TIme in record",record.timestamp)
    print("Record TIme: ", record.timestamp.time())
    print("Record TIme in IND timezone: ", ((record.timestamp) + timedelta(hours=5, minutes=30)).time())
    print()

    # utc = datetime.strptime(datetime.isoformat(record.timestamp).replace('T', ' ').split('.')[0], '%Y-%m-%d %H:%M:%S')
    # # utc = datetime(record.timestamp).time(tzinfo=from_zone)
    # utc = utc.replace(tzinfo=from_zone)
    # central = utc.astimezone(to_zone).time()
    # print("Centeral time type: ", type(central))
    # if crt > central:
    #     print("Yes")
    # print(central)

class Command(BaseCommand):
    help = "Fetches data from telegram App"

    def handle(self, *args, **options):
        pass

