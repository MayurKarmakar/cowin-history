from django.core.management.base import BaseCommand, CommandError
from telethon import TelegramClient, events, sync
from slotTrackerApp.models import Predictions
from datetime import date, datetime, tzinfo, timedelta
from dateutil import tz
import re

item = 'Cost: Rs.'
parsed_data = dict()
if re.search(r'Cost' , item):
            if 'Free' in item:
                parsed_data['cost'] = 'Free'
            elif 'Paid' in item:
                parsed_data['cost'] = 'No information'
            elif not re.search(r'\d', item):
                print("No number")
            else:
                cost_detail_pos = re.search(r'[0-9]+', item)
                print("cost_detail_pos: ", cost_detail_pos.start())
                cost_detail = item[cost_detail_pos.start(): cost_detail_pos.end()]
                print("Cost_detail: ", cost_detail)
                splitted_cost_detail = cost_detail.split(" ")
                parsed_data['cost'] = int(cost_detail)

class Command(BaseCommand):
    help = "Fetches data from telegram App"

    def handle(self, *args, **options):
        pass

