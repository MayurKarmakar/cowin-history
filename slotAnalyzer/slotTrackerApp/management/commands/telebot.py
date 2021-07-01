from logging import error
from time import perf_counter
from typing import Final
from django.core.management.base import BaseCommand, CommandError
from django.db import reset_queries
from telethon.tl.functions import ReqDHParamsRequest
from telethon.tl.types import PeerUser
from slotTrackerApp.models import RawMessages, SlotAvailabilityEvent
import re
from telethon import TelegramClient, events, sync
from datetime import  datetime, timedelta
import pytz
import json
import sys
import os

os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"

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

    '1243933312': {"district_id":294,"state_id":16},
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
total = 0
failed_count = 0

def parse_message_for_bbmp_format1(message):
    parsed_data_list = []

    parsed_data = {
        'event_details_json': {
            'sessions': []
        }
    }

    session = {}

    # parsed_data['state_id'] = entity_object[channel_id]['state_id']
    # parsed_data['district_id'] = entity_object[channel_id]['district_id']

    splited_message_list = message.split('\n')
    # print("splited_message_list: ", splited_message_list)
    
    # if not re.search('^Vaccination centers', splited_message_list[0]):
    #     return
 
    vaccine_name = None
    
    # parsed_data['state_id'] = entity_object[str(channel_id)]['state_id']
    # parsed_data['district_id'] = entity_object[str(channel_id)]['district_id']

    # parsed_data['timestamp'] = datetime.fromtimestamp(message.timestamp.timestamp())


    dose = None

    center_candidates = set()
    for item in splited_message_list:
        center_candidates.add(item.strip())

    for item in splited_message_list:
        item = item.strip()
        if item == '':
            center_candidates.discard(item)
            continue

        if item == 'BBMP':
            center_candidates.discard(item)
            continue

        if item.find('CoWIN') != -1 or item.find('Twitter') != -1:
            center_candidates.discard(item)
            continue

        if re.match(r'^\d{6}$', item):
            parsed_data['pincode'] = item
            center_candidates.discard(item)
            
        if re.search('dose', item):
            vaccine_name = item.split(' ')[0].strip().upper()
            session['vaccine'] = vaccine_name

            if item.find('1st') != -1:
                dose = 1
            else:
                dose = 2

            center_candidates.discard(item)
            

        if re.search('^\d{2}-\d{2}-\d{4}$', item):
            day = int(item[0: 2])
            month = int(item[3: 5])
            year = int(item[6: 10])

            event_timestamp = int(datetime(year, month, day, 00, 00, 00).timestamp()*1000)
            session['timestamp'] = event_timestamp

            center_candidates.discard(item)

        if re.search(r'slots', item):
            slots = int(item.split(' ')[0].strip())

            session['available_capacity_dose1'] = 0
            session['available_capacity_dose2'] = 0

            if dose == 1:
                session['available_capacity_dose1'] = slots
            elif dose == 2:
                session['available_capacity_dose2'] = slots
            center_candidates.discard(item)

    parsed_data['center_name'] = list(center_candidates)[0]
    parsed_data['event_details_json']['sessions'].append(session)

    return [parsed_data]


def parse_message_general_logic(message):

    parsed_data_list = []

    parsed_data = {
        'event_details_json': {
            'sessions': []
        }
    }

    # parsed_data['state_id'] = entity_object[channel_id]['state_id']
    # parsed_data['district_id'] = entity_object[channel_id]['district_id']

    splited_message_list = message.split('\n')
    print("splited_message_list: ", splited_message_list)
    
    # if not re.search('^Vaccination centers', splited_message_list[0]):
    #     return
 
    vaccine_name = None
    
    # parsed_data['state_id'] = entity_object[str(channel_id)]['state_id']
    # parsed_data['district_id'] = entity_object[str(channel_id)]['district_id']

    # parsed_data['timestamp'] = datetime.fromtimestamp(message.timestamp.timestamp())


        
    for item in splited_message_list:
        if item.strip() == '':
            continue

        if re.match(r'[1-9]+\.', item):
            if 'center_name' in parsed_data:
                parsed_data_list.append(parsed_data)

            parsed_data = {
                'event_details_json': {
                    'sessions': []
                }
            }

            item.strip()
            centre_name_start_idx = re.match(r'[1-9]+\.',item).end()
            centre_name_end_idx = re.search(r'Pin',item).start()
            centre_name = item[centre_name_start_idx + 1: centre_name_end_idx - 3].strip()
            # print("CEnte Name: ",centre_name)
            # print("CEnte Name length: ",len(centre_name))
            # print("CEnte Name type: ",type(centre_name))
            centre_name.strip()
            # print("After strip")
            # print("CEnte Name list: ",list(centre_name[1: -1]))
            # print("CEnte Name length: ",len(centre_name))
            # print("CEnte Name type: ",type(centre_name))
            parsed_data['center_name'] = centre_name
            data_dict['centre_name'].append(centre_name)
            pincode_start_idx = re.search(r'\d{6}', item).start()
            pincode_end_idx = (re.search(r'\d{6}', item).end())
            parsed_data['pincode'] = item[pincode_start_idx: pincode_end_idx]
            print("Extracted pincode: ", parsed_data['pincode'])
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
            # print(item)
            parsed_data['cost'] = item.split(' ')[1]
            # print(parsed_data['cost'])

        if re.search(r'slots', item):
            # re.compile(" +")
            splited_slot_detail_message = item.split(' ')
            if splited_slot_detail_message[-1] == '':
                del splited_slot_detail_message[-1]
            # print("splited_slot_detail_message: ", splited_slot_detail_message)
            idx_of_slots_string = splited_slot_detail_message.index('slots')
            # print("idx_of_slots_string: ",idx_of_slots_string)
            slot_availability_month = splited_slot_detail_message[-2]
            slot_availability_date = int(splited_slot_detail_message[-1])

            # print("Parsed Month value: ", months_integer_values_dict[slot_availability_month])
            # print("Parsed Date value: ", int(slot_availability_date))

            event_timestamp = int(datetime(datetime.now().year, months_integer_values_dict[slot_availability_month], int(slot_availability_date), 00, 00, 00).timestamp()*1000)
            # timestamp = indian_timezone.localize(generate_timestamp)
            # print("Vaccine name: ",vaccine_name)
            # print("Vaccine name length: ",len(vaccine_name))
            # print("Vaccine name type: ",type(vaccine_name))
            available_capacity_dose1 = 0
            available_capacity_dose2 = 0
            vaccine_name = vaccine_name.strip()
            if vaccine_name == ' COVISHIELD. ' or ' COVISHIELD ':
                available_capacity_dose1 = int(splited_slot_detail_message[(idx_of_slots_string) - 1])

            elif vaccine_name == ' COVAXIN. ' or ' COVAXIN ':
                available_capacity_dose2 = int(splited_slot_detail_message[(idx_of_slots_string) - 1])

            parsed_data['available_capacity_dose1'] = available_capacity_dose1
            parsed_data['available_capacity_dose2'] = available_capacity_dose2

            # print("Error Item: ", message)
            
            if "cost" not in parsed_data:
                parsed_data['cost'] = 'No Information'

            parsed_data['event_details_json']['sessions'].append({'timestamp': int(event_timestamp), 'available_capacity_dose1': parsed_data['available_capacity_dose1'], 
                                                'available_capacity_dose2': parsed_data['available_capacity_dose2'], 'available_capacity': (parsed_data['available_capacity_dose1'] + parsed_data['available_capacity_dose2']), 'cost': parsed_data['cost'], 
                                                'vaccine': parsed_data['vaccine']})

    

    parsed_data_list.append(parsed_data)
  
    
    return parsed_data_list



def parse_message_for_bbmp(message):
    if (message.find('1st dose') != -1) or (message.find('2nd dose') != -1):
        return parse_message_for_bbmp_format1(message)
    return []

def parse_message(message, district_id):
    if district_id == 294: # bbmp district id
        return parse_message_for_bbmp(message)
    else:
        return parse_message_general_logic(message)


# parse_message_from_db_records()
# total = 0
# failed_count = 0
def insert_into_raw_messages_table(message, district_id):
    if message.message is not None:
        raw_message = RawMessages(event_message=message.message.encode().decode('unicode_escape'), timestamp=datetime.fromtimestamp(message.date.timestamp()), 
                                    district_id=district_id)
        raw_message.id = str(datetime.fromtimestamp(message.date.timestamp()))+'_'+str(district_id)
        raw_message.save()
        return raw_message

def get_messages_for_district_id(district_id, limit=None):
    print("get_messages_for_district_id", district_id)
    channel_id   = [item for item in entity_object if entity_object[item]['district_id'] == district_id ][0]
    entity = client.get_entity(int(channel_id))
    messages = client.get_messages(entity, limit=limit)
    return messages

def insert_data_for_district_id(district_id, limit=None):
    print("insert_data_for_district_id", district_id)
    messages = get_messages_for_district_id(district_id, limit)

    total_messages = len(messages)
    print("insert_data_for_district_id message count = ", total_messages)

    total = 0
    failed = 0
    
    for message in messages:
        try:
            insert_into_raw_messages_table(message, district_id)
        except:
            print('insert_into_raw_messages_table failed for message', str(message))
            failed += 1

        total += 1

        if total % 1000 == 0:
            print("insert_data_for_district_id", district_id, "messages processed", total, " / ", total_messages, "failed ", failed)

        
    
    print("insert_data_for_district_id", district_id, "messages processed", total, " / ", total_messages)
    
def insert_data_for_all_districts(limit=None):
    print("insert_data_for_all_districts")
    total = 0
    for channel_id in entity_object:
        entity = entity_object[channel_id]
        district_id = entity['district_id']
        insert_data_for_district_id(district_id, limit)

        total += 1
        print("insert_data_for_all_districts", "districts processed", total)

def insert_slot_availability_event_from_parsed_data(parsed_data, state_id, district_id, timestamp):
    event_details_json_data = json.dumps(parsed_data['event_details_json'])

    slot_event_record = SlotAvailabilityEvent(state_id = state_id,
                                                timestamp = timestamp,
                                                district_id = district_id,
                                                center_name = str(parsed_data['center_name']),
                                                pincode = str(parsed_data['pincode']),
                                                event_details_json = event_details_json_data)

    event_id = str(timestamp)+'_'+str(district_id) + '_' + parsed_data['center_name']

    slot_event_record.id = event_id
    slot_event_record.save()


def get_state_id_for_district_id(district_id):
    channel_id = [channel_id for channel_id in entity_object if entity_object[channel_id]['district_id'] == district_id ][0]
    return entity_object[channel_id]['state_id']

def insert_raw_message_to_slot_availability_event(raw_message, district_id):
    message_string = raw_message.event_message
    parsed_data_list = parse_message(message_string, district_id)


    for parsed_data in parsed_data_list:
        # print('insert_slot_availability_events_for_district', parsed_data)

        state_id = get_state_id_for_district_id(district_id)

        insert_slot_availability_event_from_parsed_data(parsed_data, state_id, district_id, raw_message.timestamp)



def insert_slot_availability_events_for_district(district_id, minimum_timestamp):
    print("insert_slot_availability_events_for_district", district_id)

    raw_messages = RawMessages.objects.filter(district_id=district_id, timestamp__gte=minimum_timestamp)

    total = 0
    failed = 0

    total_messages = len(raw_messages)

    for raw_message in raw_messages:
        message_string = raw_message.event_message
        # message_string = 'Vaccination centers for 18-44 group:\n'+ '1. AIIMS BHUBANESWAR (Age 18-44) (AIIMS Urban) - Pin: 751019. Vaccine: COVAXIN.\n' + '217 slots are available on May 10\n' +'357 slots are available on May 11\n' +'\n' +'2. dummy center - Pin: 751019. Vaccine: COVAXIN.\n' + '23123 slots are available on May 10\n' +'34564364 slots are available on May 11\n';

        try:
            insert_raw_message_to_slot_availability_event(raw_message, district_id)
        except Exception as e:
            failed += 1
            print('insert_slot_availability_events_for_district failed for message string')
            print(message_string)
            raise e

        total += 1

        if total % 1000 == 0:
            print('insert_slot_availability_events_for_district message processed', total, ' / ', total_messages, 'failed', failed)
        

    print('insert_slot_availability_events_for_district message processed', total, ' / ', total_messages, 'failed', failed)

def get_district_id_list_from_channel_id_list(channel_id_list):
    district_id_list = [entity_object[channel_id]['district_id'] for channel_id in channel_id_list]

    return district_id_list

def get_all_channel_ids():
    channel_id_list = [channel_id for channel_id in entity_object]
    return channel_id_list

def insert_slot_availability_events_for_all_districts(minimum_timestamp):
    channel_id_list = get_all_channel_ids()

    district_id_list = get_district_id_list_from_channel_id_list(channel_id_list)

    for district_id in district_id_list:
        insert_slot_availability_events_for_district(district_id, minimum_timestamp)

# get_messages_of_one_district('1458101449')
# insert_data_for_district_id(294)
# insert_slot_availability_events_for_district(294)

# insert_slot_availability_events_for_all_districts()

def update_for_last_n_days(days):
    tod = datetime.now()
    d = timedelta(days = days)
    a = tod - d

    insert_data_for_all_districts(500*days)
    insert_slot_availability_events_for_all_districts(a)



            
            

def test_bbmp_parsing():
    raw_messages = RawMessages.objects.filter(district_id=294)

    format1 = 0
    format2 = 0
    for raw_message in raw_messages:
        message_string = raw_message.event_message
        # print('message string')
        # print(message_string)

        if (message_string.find('All slots booked in') != -1):
            continue

        if (message_string.find('1st dose') != -1) or (message_string.find('2nd dose') != -1):
            format1 += 1
            # print('message string')
            # print(message_string)
            # try:
            parsed_data_list = parse_message_for_bbmp(message_string)
            # except:
            #     print('message string')
            #     print(message_string)
            #     break


            # print('parsed data list', parsed_data_list)
        else:
            # print(message_string)
            format2 += 1



    print('format1', format1, 'format2', format2)

# test_bbmp_parsing()
update_for_last_n_days(2)


def process_message_of_live_event_and_insert_into_raw_messages_table(message):
    peer_id = message.peer_id
    channel_id = peer_id.channel_id
    district_id = entity_object[str(channel_id)]['district_id']
    raw_message = insert_into_raw_messages_table(message, district_id)

    if raw_message is not None:
        insert_raw_message_to_slot_availability_event(raw_message, district_id)


@client.on(events.NewMessage())
async def handler(event):
    event_str = str(event)
    peer_id = event.message.peer_id
    print("Event message: ", event.message)
    # process_message_of_live_event_and_insert_into_raw_messages_table(event.message)


client.run_until_disconnected()

class Command(BaseCommand):
    help = "Fetches data from telegram App"

    def handle(self):
        pass