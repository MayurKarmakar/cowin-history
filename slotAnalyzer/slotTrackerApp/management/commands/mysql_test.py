from logging import error
from django.core.management.base import BaseCommand, CommandError
from slotTrackerApp.models import RawMessages
from datetime import datetime, timedelta
import re, threading, time
entity_object = {
    '1458101449': {'state_id': 26, 'district_id': 446},
    '1174734037': {'state_id': 26, 'district_id': 457},
    '1234268776': {'state_id': 26, 'district_id': 458},
    '1335172164': {'state_id': 26, 'district_id': 459},
    '1327841172': {'state_id': 26, 'district_id': 471},
    '1491978120': {'state_id': 26, 'district_id': 452},
    '1150676780': {'state_id': 26, 'district_id': 474},
    '1287143551': {'state_id': 26, 'district_id': 456},
    '1540220438': {'state_id': 26, 'district_id': 460},
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
    ## '1471693088': {"district_id":274,"state_id":16},
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
    ## '1489132122': {"district_id":292,"state_id":16},
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
    'Dec': 12,
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12,
}

def get_all_channel_ids():
    channel_id_list = [channel_id for channel_id in entity_object]
    return channel_id_list

def get_district_id_list_from_channel_id_list(channel_id_list):
    district_id_list = [entity_object[channel_id]['district_id'] for channel_id in channel_id_list]

    return district_id_list
failed = 0
def pasing_logic_for_new_message(message_string, district_id):
    
    # if ('Center Name' not in message_string) or ('Centre Name' not in message_string):
    #     return 

    parsed_data = {
        'available_capacity_dose1': 0,
        'available_capacity_dose2': 0,
        'available_capacity': 0,
    }

    splitted_raw_message = message_string.split("\n")
    print("Splitted message: ", splitted_raw_message)

    for item in splitted_raw_message:
        if item == "":
            continue
        if re.search(r'Vaccine:', item):
            parsed_data['unique_key'] = True
            vaccine_name_start_pos = re.search(r'[:]', item).start() + 2
            parsed_data['vaccine'] = item[vaccine_name_start_pos:]
            if re.search(r'\(', item):
                content_inside_parenthesis = re.search(r'\((.*?)\)',item).group(1)

                if content_inside_parenthesis == '1st Dose':
                    parsed_data['available_capacity_dose1'] = 1

                if content_inside_parenthesis == '2nd Dose':
                    parsed_data['available_capacity_dose2'] = 1

        if re.search(r'Pincode', item):
            parsed_data['unique_key'] = True
            pincode_start_pos = re.search(r'[:]', item).start() + 2
            parsed_data["pincode"] = item[pincode_start_pos:] 


        if re.search(r'(Center Name|Centre Name)',item):
            parsed_data['unique_key'] = True
            center_name_start_pos = re.search(r'[:]', item).start() + 2
            parsed_data['center_name'] = item[center_name_start_pos:]
            print("Parsed Center name: ", parsed_data['center_name'])
        
        if re.search(r"Date", item):
            parsed_data['unique_key'] = True
            date_start_pos = re.search(r'[:]', item).start() + 2
            date = item[date_start_pos:]
            splitted_date = date.split(" ")
            if len(splitted_date) == 3:
                date = int(splitted_date[0])
                month = months_integer_values_dict[splitted_date[1]]
                year = int(splitted_date[-1])
                parsed_data['event_timestamp'] = int(datetime(year, month, date, 00, 00, 00).timestamp()*1000)
            else:
                date_string = re.search(r'^[a-zA-Z]+\s\d+', date)
                # date = int(splitted_date[-1])
                date_start_pos = date_string.start()
                date_end_pos = date_string.end()
                splitted_date_string = date[date_start_pos: date_end_pos].split(" ")
                print("splitted_date_string: ", splitted_date_string)
                month = months_integer_values_dict[splitted_date_string[0]]
                date = splitted_date_string[-1]
                print("MOnth parsed: ", month)
                print("Date parsed: ", date)
                parsed_data['event_timestamp'] = int(datetime(datetime.now().year, month, int(date), 00, 00, 00).timestamp()*1000)

        
        if re.search(r'Available slots' , item):
            parsed_data['unique_key'] = True
            slots_quantity = int(item[re.search(r'[:]', item).start() + 2:])
            
            if parsed_data['available_capacity_dose1'] == 1:
                parsed_data['available_capacity_dose1'] = slots_quantity
            
            if parsed_data['available_capacity_dose2'] == 1:
                parsed_data['available_capacity_dose2'] = slots_quantity
        
        if re.search(r'Dose 1 slots:' , item):
            parsed_data['unique_key'] = True
            dose_quantity_start_pos = re.search(r'[:]', item).start() + 2
            parsed_data['available_capacity_dose1'] = int(item[dose_quantity_start_pos:])

        
        if re.search(r'Dose 2 slots:' , item):
            parsed_data['unique_key'] = True
            dose_quantity_start_pos = re.search(r'[:]', item).start() + 2
            parsed_data['available_capacity_dose2'] = int(item[dose_quantity_start_pos:])


        if re.search(r'Cost' , item):
            parsed_data['unique_key'] = True
            if 'Free' in item:
                parsed_data['cost'] = 'Free'
            else:
                cost_detail_pos = re.search(r'[0-9]+', item)
                print("cost_detail_pos: ", cost_detail_pos.start())
                cost_detail = item[cost_detail_pos.start(): cost_detail_pos.end()]
                print("Cost_detail: ", cost_detail)
                splitted_cost_detail = cost_detail.split(" ")
                parsed_data['cost'] = int(cost_detail)


        parsed_data['available_capacity'] = parsed_data['available_capacity_dose1'] + parsed_data['available_capacity_dose2']

    print("Print parsed data:")
    for key in parsed_data:
        print('{}: {}'.format(key, parsed_data[key]))


# pasing_logic_for_new_message()           





def insert_slot_availability_events_for_district(district_id, minimum_timestamp):
    
    print("insert_slot_availability_events_for_district", district_id)
    # threading.Timer(10.0, insert_slot_availability_events_for_district(district_id, minimum_timestamp)).start()
    # raw_messages = RawMessages.objects.raw("SELECT * FROM slotTrackerApp_rawmessages  where DATE(timestamp)>=%s;", [minimum_timestamp])
    raw_messages = RawMessages.objects.filter(district_id = district_id, timestamp__gte=minimum_timestamp)

    # print("raw messages fetched: ", raw_messages)

    total = 0
    

    total_messages = len(raw_messages)

    for raw_message in raw_messages:

        print("Raw message: ", raw_message)
        message_string = raw_message.event_message
        # message_string = 'Vaccination centers for 18-44 group:\n'+ '1. AIIMS BHUBANESWAR (Age 18-44) (AIIMS Urban) - Pin: 751019. Vaccine: COVAXIN.\n' + '217 slots are available on May 10\n' +'357 slots are available on May 11\n' +'\n' +'2. dummy center - Pin: 751019. Vaccine: COVAXIN.\n' + '23123 slots are available on May 10\n' +'34564364 slots are available on May 11\n';

        try:
            pasing_logic_for_new_message(message_string, district_id)
        except Exception as e:
            print('insert_slot_availability_events_for_district failed for message string')
            print(message_string)
            time.sleep(2)
            x = input()
            raise e

        total += 1

        if total % 100 == 0:
            print('insert_slot_availability_events_for_district message processed', total, ' / ', total_messages, 'failed', failed)
        

    print("District Id: ", district_id)
    print('insert_slot_availability_events_for_district message processed', total, ' / ', total_messages, 'failed', failed)
    time.sleep(3)
    

def insert_slot_availability_events_for_all_districts(minimum_timestamp):
    channel_id_list = get_all_channel_ids()

    district_id_list = get_district_id_list_from_channel_id_list(channel_id_list)
    
    for district_id in district_id_list:
        print("Processing District id: ", district_id)
        insert_slot_availability_events_for_district(district_id, minimum_timestamp)

# insert_slot_availability_events_for_all_districts()

def fetch_data_for_n_days(start_day, end_day):

    print("Start day: ",start_day)
    print("End day: ",end_day)

    raw_messages = RawMessages.objects.raw("SELECT * FROM slotTrackerApp_rawmessages  where DATE(timestamp)>=%s AND DATE(timestamp)<=%s;", [start_day, ])

    print("Total messages: ", len(raw_messages))


def update_for_last_n_days(start_day):
    tod = datetime.now()
    start_day = timedelta(days = start_day)
    # end_day = timedelta(days = end_day)
    start = tod - start_day
    # end = tod - end_day

    print("start date: ",start)
    c = input()
    # print("start date: ",end.date())
    time.sleep(1)
    
    insert_slot_availability_events_for_all_districts(start)

update_for_last_n_days(40)

class Command(BaseCommand):
    help = "Fetches data from telegram App"

    def handle(self, *args, **options):
        pass