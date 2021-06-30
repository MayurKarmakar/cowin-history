from logging import error
from typing import Final
from django.core.management.base import BaseCommand, CommandError
from telethon.tl.types import PeerUser
from slotTrackerApp.models import RawMessages, SlotAvailabilityEvent
import re
from telethon import TelegramClient, events, sync
from datetime import  datetime
import pytz
import json
import sys

without_timezone = datetime(2021, 6, 17, 21, 27, 00)
indian_timezone = pytz.timezone('Asia/Kolkata')

with_timezone = indian_timezone.localize(without_timezone)
# x = datetime(2021, 6, 17, 21, 27, 00, indian_timezone)
datetime.now()
print("Year is: ", datetime.now().year)
print("Year type is: ", type(datetime.now().year))
print("Timestamp value: ",with_timezone.timestamp())
print("NOW time: ",int(with_timezone.timestamp()))
print("TimeZOne info: ",with_timezone.tzinfo)

entity_object = {
    '1458101449': {'state_id': 26, 'district_id': 446},
    '1174734037': {'state_id': 26, 'district_id': 457},
    '1234268776': {'state_id': 26, 'district_id': 458},
    '1335172164': {'state_id': 26, 'district_id': 459},
    '1327841172': {'state_id': 26, 'district_id': 471},
    '1491978120': {'state_id': 26, 'district_id': 452},
    '1150676780': {'state_id': 26, 'district_id': 474},
    '1287143551': {'state_id': 26, 'district_id': 456},
    '1223213833': {'state_id': 26, 'district_id': 460},
    '1225302829': {'state_id': 26, 'district_id': 462},
    '1302631546': {'state_id': 26, 'district_id': 454},
    '1483515512': {'state_id': 26, 'district_id': 453},
    '1491748967': {'state_id': 26, 'district_id': 450},
    '1482449374': {'state_id': 26, 'district_id': 461},
    '1205688992': {'state_id': 26, 'district_id': 449},
    '1407203820': {'state_id': 26, 'district_id': 473},
    '1161389537': {'state_id': 26, 'district_id': 463},
    '1437371935': {'state_id': 26, 'district_id': 455},
    '1160146914': {'state_id': 26, 'district_id': 464},
    '1143077056': {'state_id': 26, 'district_id': 466},
    '1300724017': {'state_id': 26, 'district_id': 465},
    '1195547279': {'state_id': 26, 'district_id': 467},
    '1223432483': {'state_id': 26, 'district_id': 451},
    '1259182036': {'state_id': 26, 'district_id': 472},
    '1385443444': {'state_id': 26, 'district_id': 445},
    '1340261201': {'state_id': 26, 'district_id': 447},
    '1282437886': {'state_id': 26, 'district_id': 473},

    # Jharkhand Districts

    '1373832298': {"state_id": 15, "district_id": 248},
    '1436135357': {'state_id': 15, 'district_id': 255},
    '1490575529': {'state_id': 15, 'district_id': 240},
    '1485724325': {'state_id': 15, 'district_id': 257},
    '1342637587': {'state_id': 15, 'district_id': 252},
    '1381069302': {'state_id': 15, 'district_id': 258},
    '1350006700': {'state_id': 15, 'district_id': 259},
    '1349221944': {'state_id': 15, 'district_id': 251},
    '1414064507': {'state_id': 15, 'district_id': 263},
    '1314539510': {'state_id': 15, 'district_id': 242},
    '1477196992': {'state_id': 15, 'district_id': 254},
    '1205302785': {'state_id': 15, 'district_id': 260},
    '1218881293': {'state_id': 15, 'district_id': 244},
    '1335478405': {'state_id': 15, 'district_id': 245},
    '1316326585': {'state_id': 15, 'district_id': 250},
    '1192503055': {'state_id': 15, 'district_id': 256},
    '1210771070': {'state_id': 15, 'district_id': 243},
    '1404119583': {'state_id': 15, 'district_id': 247},
    '1345841740': {'state_id': 15, 'district_id': 241},
    '1405922529': {'state_id': 15, 'district_id': 246},
    '1282437886': {'state_id': 15, 'district_id': 253},

    #Karnataka Districts

    # '1243933312': {"district_id":294,"district_name":"Bengaluru BBMP"},
    '1142602708': {"district_id":268,"state_id":16},
    '1230461833': {"district_id":289,"state_id":16},
    '1194665890': {"district_id":264,"state_id":16},
    '1400831953': {"district_id":273,"state_id":16},
    '1471693088': {"district_id":274,"state_id":16},
    '1379459105': {"district_id":276,"state_id":16},
    '1346379632': {"district_id":270,"state_id":16},
    '1481737560': {"district_id":269,"state_id":16},
    '1168911208': {"district_id":281,"state_id":16},
    '1165622289': {"district_id":266,"state_id":16},
    '1431477469': {"district_id":286,"state_id":16},
    '1265609608': {"district_id":293,"state_id":16},
    '1421132026': {"district_id":282,"state_id":16},
    '1365373461': {"district_id":275,"state_id":16},
    '1265669375': {"district_id":287,"state_id":16},
    '1428885619': {"district_id":288,"state_id":16},
    '1227665370': {"district_id":265,"state_id":16},
    '1390374627': {"district_id":267,"state_id":16},
    '1266606644': {"district_id":272,"state_id":16},
    '1203776728': {"district_id":290,"state_id":16},
    '1283779031': {"district_id":283,"state_id":16},
    '1174895370': {"district_id":280,"state_id":16},
    '1210755328': {"district_id":284,"state_id":16},
    '1489132122': {"district_id":292,"state_id":16},
    '1213319051': {"district_id":279,"state_id":16},
    '1300650136': {"district_id":278,"state_id":16},
    '1275672800': {"district_id":271,"state_id":16},
}

months_integer_values_dict = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12
}

# print("CUrrent entity: ", entity_object['1458101449']['state_id'])
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
def parse_data_from_message_object(message_object, entity_id):

    parsed_data = {
        'event_details_json': {
            'session': []
        }
    }

    # parsed_data['state_id'] = entity_object[entity_id]['state_id']
    # parsed_data['district_id'] = entity_object[entity_id]['district_id']

    print('Error Message: ', message_object)
    parsed_data['timestamp'] = datetime.fromtimestamp(message_object.date.timestamp())
    splited_message_list = message_object.message.split('\n')
    
    if not re.match('^Vaccination+\s', splited_message_list[0]):
        return
    print("splited_message_list: ",splited_message_list)

    # if entity_id == '1243933312':
    #     for item in splited_message_list:
    #         print("Item: ",item)
    #         if re.search(r'\d{6}', item):
    #             parsed_data['pincode'] = item
    #         if ('COVISHIELD' in item) or ('Covishield' in item) or ('covishield' in item):
    #             parsed_data['vaccine'] = 'COVISHIELD'
    #             splitted_item_list = item.split(' ')
    #             if (splitted_item_list[1] == '1st') or (splitted_item_list[1] == '1ST'):
    #                 parsed_data['available_capacity_dose1'] = 0
    #                 parsed_data['available_capacity_dose2'] = -1
    #             if (splitted_item_list[1] == '2nd') or (splitted_item_list[1] == '2ND'):
    #                 parsed_data['available_capacity_dose1'] = -1
    #                 parsed_data['available_capacity_dose2'] = 0
    #         elif ('COVAXIN' in item) or ('Covaxin' in item) or ('covaxin' in item):
    #             parsed_data['vaccine'] = 'COVAXIN'
    #             splitted_item_list = item.split(' ')
    #             if (splitted_item_list[1] == '1st') or (splitted_item_list[1] == '1ST'):
    #                 parsed_data['available_capacity_dose1'] = 0
    #                 parsed_data['available_capacity_dose2'] = -1
    #             if (splitted_item_list[1] == '2nd') or (splitted_item_list[1] == '2ND'):
    #                 parsed_data['available_capacity_dose1'] = -1
    #                 parsed_data['available_capacity_dose2'] = 0
            # if ('Dose' or 'dose' in item):
            #     dose_number_start_idx = re.search(r'[1-9]+[a-zA-Z]', item).start()
            #     parsed_data['vaccine'] = item[:dose_number_start_idx].strip()

    #         if ('SLOTS' in item) or ('slots' in item) or ('Slots' in item):
    #             itemIdx = splited_message_list.index(item)
    #             slots_quantity_message_list = item.split(' ')
    #             if (slots_quantity_message_list[0] != 'SLOTS') or (slots_quantity_message_list[0] != 'slots') or (slots_quantity_message_list[0] != 'Slots'):
    #                 if parsed_data['available_capacity_dose1'] == 0:
    #                     parsed_data['available_capacity_dose1'] = slots_quantity_message_list[0]
    #                 if parsed_data['available_capacity_dose2'] == 0:
    #                     parsed_data['available_capacity_dose2'] = slots_quantity_message_list[0]
    #             elif (slots_quantity_message_list[0] == 'SLOTS') or (slots_quantity_message_list[0] == 'slots') or (slots_quantity_message_list[0] == 'Slots'):
    #                 if parsed_data['available_capacity_dose1'] == 0:
    #                     parsed_data['available_capacity_dose1'] = slots_quantity_message_list[1]
    #                 if parsed_data['available_capacity_dose2'] == 0:
    #                     parsed_data['available_capacity_dose2'] = slots_quantity_message_list[1]
    #             parsed_data['center_name'] = splited_message_list[itemIdx+1]
        
                
            
    #         print("Printing Extracted data: ")
        
    # for item in parsed_data:
    #     print('{}: {}'.format(item, parsed_data[item]))

    
    print("Message object: ",message_object)
    message_obj_id = message_object.id
    print("message_obj_id: ",message_obj_id)
    print("message_obj_id type: ", type(str(message_obj_id)))
    vaccine_name = None
    isDataExtracted = False
    parsed_data = {
        'event_details_json': {
            'session': []
        }
    }
    
    parsed_data['state_id'] = entity_object[entity_id]['state_id']
    parsed_data['district_id'] = entity_object[entity_id]['district_id']

    parsed_data['timestamp'] = datetime.fromtimestamp(message_object.date.timestamp())
    splited_message_list = message_object.message.split('\n')

        
    for item in splited_message_list:

        if re.match(r'[1-9]+\.', item):
            item.strip()
            centre_name_start_idx = re.match(r'[1-9]+\.',item).start()
            centre_name_end_idx = re.search(r'\(',item).end()
            centre_name = item[centre_name_start_idx + 2: centre_name_end_idx - 1]
            print("CEnte Name: ",centre_name)
            print("CEnte Name length: ",len(centre_name))
            print("CEnte Name type: ",type(centre_name))
            centre_name.strip()
            print("After strip")
            print("CEnte Name list: ",list(centre_name[1: -1]))
            print("CEnte Name length: ",len(centre_name))
            print("CEnte Name type: ",type(centre_name))
            parsed_data['center_name'] = centre_name[1: -1]
            data_dict['centre_name'].append(centre_name)
            pincode_start_idx = re.search(r'\d{6}', item).start()
            pincode_end_idx = (re.search(r'\d{6}', item).end())
            parsed_data['pincode'] = item[pincode_start_idx: pincode_end_idx]
            data_dict['pincode'].append(item[pincode_start_idx: pincode_end_idx])
            if re.search('Vaccine:', item):
                vaccine_name = item.split('Vaccine:')
                parsed_data['vaccine'] = vaccine_name
                data_dict['vaccine'].append(vaccine_name)
        
        if re.search('Vaccine:', item):
            vaccine_name = item.split('Vaccine:')[-1]
            if vaccine_name == ' COVISHIELD. ':
                vaccine_name = 'COVISHIELD'
            if vaccine_name == ' COVAXIN. ':
                vaccine_name = 'COVAXIN'
            if vaccine_name == ' COVISHIELD ':
                vaccine_name = 'COVISHIELD'
            if vaccine_name == ' COVAXIN ':
                vaccine_name = 'COVAXIN'

            parsed_data['vaccine'] = vaccine_name
            data_dict['vaccine'].append(vaccine_name)

        if re.search('Cost:', item):
            print(item)
            parsed_data['cost'] = item.split(' ')[1]
            print(parsed_data['cost'])

        if re.search(r'slots', item):
            # re.compile(" +")
            splited_slot_detail_message = item.split(' ')
            if splited_slot_detail_message[-1] == '':
                del splited_slot_detail_message[-1]
            print("splited_slot_detail_message: ", splited_slot_detail_message)
            idx_of_slots_string = splited_slot_detail_message.index('slots')
            print("idx_of_slots_string: ",idx_of_slots_string)
            slot_availability_month = splited_slot_detail_message[-2]
            slot_availability_date = int(splited_slot_detail_message[-1])

            print("Parsed Month value: ", months_integer_values_dict[slot_availability_month])
            print("Parsed Date value: ", int(slot_availability_date))

            event_timestamp = datetime(datetime.now().year, months_integer_values_dict[slot_availability_month], int(slot_availability_date), 00, 00, 00).timestamp()
            # timestamp = indian_timezone.localize(generate_timestamp)
            print("Vaccine name: ",vaccine_name)
            print("Vaccine name length: ",len(vaccine_name))
            print("Vaccine name type: ",type(vaccine_name))
            available_capacity_dose1 = 0
            available_capacity_dose2 = 0
            vaccine_name = vaccine_name.strip()
            if vaccine_name == ' COVISHIELD. ' or ' COVISHIELD ':
                available_capacity_dose1 = int(splited_slot_detail_message[(idx_of_slots_string) - 1])

            elif vaccine_name == ' COVAXIN. ' or ' COVAXIN ':
                available_capacity_dose2 = int(splited_slot_detail_message[(idx_of_slots_string) - 1])

            parsed_data['available_capacity_dose1'] = available_capacity_dose1
            parsed_data['available_capacity_dose2'] = available_capacity_dose2

            print("Error Item: ", message_object)
            
            if "cost" in parsed_data:
                parsed_data['event_details_json']['session'].append({'timestamp': int(event_timestamp), 'available_capacity_dose1': parsed_data['available_capacity_dose1'], 
                                                    'available_capacity_dose2': parsed_data['available_capacity_dose2'], 'available_capacity': (parsed_data['available_capacity_dose1'] + parsed_data['available_capacity_dose2']), 'cost': parsed_data['cost'], 
                                                    'vaccine': parsed_data['vaccine']})
            else:
                parsed_data['event_details_json']['session'].append({'timestamp': int(event_timestamp), 'available_capacity_dose1': parsed_data['available_capacity_dose1'], 
                                                    'available_capacity_dose2': parsed_data['available_capacity_dose2'], 'available_capacity': (parsed_data['available_capacity_dose1'] + parsed_data['available_capacity_dose2']), 'cost': 'No information', 
                                                    'vaccine': parsed_data['vaccine']})
            
    if 'pincode' in parsed_data:
        event_details_json_data = json.dumps(parsed_data['event_details_json'])
        print("json_string_from_dict", event_details_json_data)
        print("json_string_from_dict type", type(event_details_json_data))

        for item in parsed_data:
            print(item + ': {}'.format(parsed_data[item]))
            print("\n")

        try:
            # print("Error Item: ", message_object)
            if "center_name" in parsed_data:
                slot_event_record = SlotAvailabilityEvent(state_id = parsed_data['state_id'],
                                                            timestamp = parsed_data['timestamp'],
                                                            district_id = parsed_data['district_id'],
                                                            center_name = str(parsed_data['center_name']),
                                                            pincode = str(parsed_data['pincode']),
                                                            event_details_json = event_details_json_data)
            else:
                slot_event_record = SlotAvailabilityEvent(state_id = parsed_data['state_id'],
                                                            timestamp = parsed_data['timestamp'],
                                                            district_id = parsed_data['district_id'],
                                                            center_name = 'No information',
                                                            pincode = str(parsed_data['pincode']),
                                                            event_details_json = event_details_json_data)

            # slot_event_record.id = str(message_obj_id)
            event_id = str(parsed_data['timestamp'])+ str(parsed_data['district_id'])
            event_id.replace(' ', '_')
            slot_event_record.id = event_id
            slot_event_record.save()
            print("slot_event_record id: ",slot_event_record.id)
            print("Record Inserted")
            del slot_event_record
        except ValueError:
            print("Error Item: ", item)
            print(error)
        

def identify_data_from_message_object(message_object, entity_id):
    total = 0
    failed_count = 0

    # print("Message Object: ", message_object)
    # for item in message_object:
        # print("Item: ", item)
    #     try:
    #         event_message = RawMessages(event_message=item.message.encode().decode('unicode_escape'), timestamp = item.date, district_id='16')
    #         event_message.id = str(item.date)+'_'+'16'
    #         event_message.save()
    #     except:
    #         failed_count += 1

    #     total += 1

    #     if total % 1000 == 0:
    #         print(total, " messages processed", "failed", failed_count)

    # print(total, " messages processed", "failed", failed_count)

        # parse_data_from_message_object(item, entity_id)
    # for item in message_object:
    #     print(item.message)
    #     print()
    for item in message_object:
        if item.message is None:
            continue

        parse_data_from_message_object(item, entity_id)

# current_entitiy = client.get_entity(int('1243933312'))
# message_object = client.get_messages(current_entitiy, limit=None)
# identify_data_from_message_object(message_object, '1243933312')

for entity in entity_object:
    current_entitiy = client.get_entity(int(entity))
    message_object = client.get_messages(current_entitiy, limit=None)
    identify_data_from_message_object(message_object, entity)



@client.on(events.NewMessage())
async def handler(event):
    event_str = str(event)
    # print(event_str.Event)


client.run_until_disconnected()

class Command(BaseCommand):
    help = "Fetches data from telegram App"

    def handle(self):
        pass