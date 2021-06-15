from logging import error
from typing import Final
from django.core.management.base import BaseCommand, CommandError
from telethon.tl.types import PeerUser
from slotTrackerApp.models import SlotAvailabilityEvent
import re
from telethon import TelegramClient, events, sync

entity_list = {
    '1458101449': {'state_id': 26, 'district_id': 446},
    '1174734037': {'state_id': 26, 'district_id': 457},
    # 1871333361: {'state_id': 26, 'district_id': 458},
    # 1335172164: {'state_id': 26, 'district_id': 459},
    # 1327841172: {'state_id': 26, 'district_id': 471},
    # 1491978120: {'state_id': 26, 'district_id': 452},
    # 1150676780: {'state_id': 26, 'district_id': 474},
    # 1287143551: {'state_id': 26, 'district_id': 456},
    # 1223213833: {'state_id': 26, 'district_id': 460},
    # 1225302829: {'state_id': 26, 'district_id': 462},
    # 1302631546: {'state_id': 26, 'district_id': 454},
    # 1483515512: {'state_id': 26, 'district_id': 453},
    # 1491748967: {'state_id': 26, 'district_id': 450},
    # 1482449374: {'state_id': 26, 'district_id': 461},
    # 1205688992: {'state_id': 26, 'district_id': 449},
    # 1407203820: {'state_id': 26, 'district_id': 473},
    # 1161389537: {'state_id': 26, 'district_id': 463},
    # 1437371935: {'state_id': 26, 'district_id': 455},
    # 1160146914: {'state_id': 26, 'district_id': 464},
    # 1143077056: {'state_id': 26, 'district_id': 466},
    # 1300724017: {'state_id': 26, 'district_id': 465},
    # 1195547279: {'state_id': 26, 'district_id': 467},
    # 1223432483: {'state_id': 26, 'district_id': 451},
    # 1259182036: {'state_id': 26, 'district_id': 472},
    # 1385443444: {'state_id': 26, 'district_id': 445},
    # 1340261201: {'state_id': 26, 'district_id': 447},
    # 1282437886: {'state_id': 26, 'district_id': 473},
}
print("CUrrent entity: ", entity_list['1458101449']['state_id'])
data_dict = {
    'state_id': None,
    'vaccine': [],
    'timestamp': None,
    'district_id': None,
    'centre_name': [],
    'pincode': [],
    'available_capacity_dose1': [],
    'available_capacity_dose2': [],
}

api_id = 5446669
api_hash = '45a721b995318b63052fc3a1c578fbf8'

client = TelegramClient('slot_tracker', api_id, api_hash)

client.start()
client.get_dialogs()
def parse_data_from_message_list(message_list):
    
    vaccine_name = None

    for item in message_list:
        print("Item is: ", item)
        print("Vaccine Name: ", vaccine_name)
        if re.match(r'[1-9]+\.', item):
            item.strip()
            print("Item: ", item)
            centre_name_start_idx = re.match(r'[1-9]+\.',item).start()
            centre_name_end_idx = re.search(r'\(',item).end()
            print("Centre start idx: {}, end Idx: {}".format(centre_name_start_idx + 2, centre_name_end_idx - 1))
            centre_name = item[centre_name_start_idx + 2: centre_name_end_idx - 1]
            print("Centre name: ", centre_name)
            centre_name.strip()
            data_dict['centre_name'].append(centre_name)
            pincode_start_idx = re.search(r'\d{6}', item).start()
            pincode_end_idx = (re.search(r'\d{6}', item).end())
            print("Pincode: ",item[pincode_start_idx: pincode_end_idx])
            data_dict['pincode'].append(item[pincode_start_idx: pincode_end_idx])
            if re.search('Vaccine:', item):
                vaccine_name = item.split('Vaccine:')
                print("Vaccine Name: ",vaccine_name)
                print("Vaccine: ",vaccine_name)
                data_dict['vaccine'].append(vaccine_name)
        
        if re.search('Vaccine:', item):
            vaccine_name = item.split('Vaccine:')[-1]
            print("Vaccine Name: ",vaccine_name)
            print("Get Vaccine: ",vaccine_name)
            data_dict['vaccine'].append(vaccine_name)

        if re.search(r'slots', item):
            re.compile(" +")

            dose_quantity = item.split('slots')[0].rstrip()
            print("DOse available: ", dose_quantity)
            dose_quantity.rstrip()
            dose_start_idx = re.search(' +', dose_quantity).start()
            print("Dose Quantity: ", dose_quantity[dose_start_idx+1: ])
            if str(vaccine_name).strip() == 'COVISHIELD.':
                print("Yes covishield")
                data_dict['available_capacity_dose1'].append(int(dose_quantity[dose_start_idx+1: ]))

            if str(vaccine_name).strip() == 'COVAXIN.':
                print("Yes covaxin")
                data_dict['available_capacity_dose2'].append(int(dose_quantity[dose_start_idx+1: ]))

def identify_data_from_message_list(message_object, current_entity):
    entity = entity_list[current_entity]
    data_dict['state_id'] = entity['state_id']
    for msg in message_object:
        if msg.message is None:
            continue
        print("Printing message")
        print(msg.message)
        print("Message timestamp: ", msg.date)
        data_dict['timestamp'] = msg.date

        message_list = msg.message.split('\n')
        print("Splited msg: ",message_list)
        parse_data_from_message_list(message_list)
        

current_entitiy = client.get_entity(1174734037)
message_object = client.get_messages(current_entitiy, limit=5)
identify_data_from_message_list(message_object, '1174734037')
for entity in entity_list:
    pass


print(data_dict)

# for item in data_dict:
#     # print(item)
#     print(data_dict[item])
#     print(data_dict[item])
#     print(data_dict[item])
#     print(data_dict[item])
#     print(data_dict[item])
#     print(data_dict[item])
#     print(data_dict[item])
#     print(data_dict[item])

@client.on(events.NewMessage())
async def handler(event):
    event_str = str(event)


client.run_until_disconnected()

class Command(BaseCommand):
    help = "Fetches data from telegram App"

    def handle(self):
        pass