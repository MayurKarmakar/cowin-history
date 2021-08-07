import threading
from typing import Type
from django.db.models.base import Model
from slotTrackerApp.models import Predictions
from slotTrackerApp.management.commands.PredictionEngine import *
import threading

def execute_after_n_seconds():
    try:
        (time_statistics_json, predictions_json, record_id) = perform_predictions()
        print("time_statistics_json: ", time_statistics_json)
        print("predictions_json: ", predictions_json)
        insert_output_of_prediction_engine_in_db_record(time_statistics_json, predictions_json, record_id)
        threading.Timer(5.0, execute_after_n_seconds).start()
    except TypeError as te:
        print(te)
        threading.Timer(5.0, execute_after_n_seconds).start()

def get_records_from_predictions_table():
    records = Predictions.objects.raw("SELECT * FROM slotTrackerApp_predictions WHERE status=%s", ['submitted', ])

    return records

def perform_predictions():
    records = get_records_from_predictions_table()
    
    for record in records:
        try:
            if record.district_id and record.center_name:
                

                dataset = fetch_data_for_center(record.district_id, record.center_name)
                (time_statistics_json, predictions_json) = process_dataset(dataset, epochs=1000)
                print("fetch_data_for_center", record)
                return (time_statistics_json, predictions_json, record.id)

            elif record.pincode:
                
                
                dataset =  fetch_data_for_pincode(record.pincode)
                (time_statistics_json, predictions_json) = process_dataset(dataset, epochs=1000)
                print("fetch_data_for_pincode", record)
                return (time_statistics_json, predictions_json, record.id)

            elif record.district_id and not record.center_name:
                
                dataset = fetch_data_for_district(record.district_id)
                (time_statistics_json, predictions_json) = process_dataset(dataset, epochs=1000)
                print("fetch_data_for_district", record)
                return (time_statistics_json, predictions_json, record.id)
        except:
            pass

def insert_output_of_prediction_engine_in_db_record(time_statistics_json, predictions_json, record_id):

    record = Predictions.objects.filter(id=record_id)
    record.update(time_statistics_json = time_statistics_json,
                    forecast_json = predictions_json,
                    status = 'completed')

execute_after_n_seconds()
# dataset = fetch_data_for_center(289, "Sparsh Private Booth")
# (time_statistics_json, predictions_json) = process_dataset(dataset, epochs=1000)
# print("time_statistics_json", time_statistics_json)
# print("predictions_json", predictions_json)

class Command(BaseCommand):
    help = "Script that looks for record with status ->submitted"

    def handle(self, *args, **options):
        pass