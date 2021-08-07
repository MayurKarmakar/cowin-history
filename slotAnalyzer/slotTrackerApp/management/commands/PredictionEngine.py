import os
import pymysql
import pandas as pd
from pandas import read_csv, to_datetime, date_range
from django.core.management.base import BaseCommand, CommandError
from datetime import datetime
from datetime import date
import tensorflow as tf
from tensorflow import keras
from numpy import concatenate
from matplotlib import pyplot
from pandas import read_csv
from pandas import DataFrame
from pandas import concat
from sklearn.preprocessing import MinMaxScaler
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_squared_error
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM
from sklearn.preprocessing import MinMaxScaler
import numpy as np
import queue
from datetime import date, timedelta
from pandas import read_csv
from matplotlib import pyplot
import matplotlib.dates as mdates
import os
import json
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

def get_mysql_connection():
    conn = pymysql.connect(
    host='127.0.0.1',
    port=int(3306),
    user="mayur7",
    passwd='Mayur_1225',
    db="slotAvailabiltyRecords",
    charset='utf8mb4')
    return conn

def fetch_data_for_center(district_id, center_name):
    df = pd.read_sql_query(
        f"""SELECT * FROM slotTrackerApp_slotavailabilityevent where district_id = {district_id} and center_name = '{center_name}'
        """,
        get_mysql_connection())
    
    return df

def fetch_data_for_district(district_id):
    df = pd.read_sql_query(
        f"""SELECT * FROM slotTrackerApp_slotavailabilityevent where district_id = {district_id}
        """,
        get_mysql_connection())
    
    return df

def fetch_data_for_pincode(pincode):
    df = pd.read_sql_query(
        f"""SELECT * FROM slotTrackerApp_slotavailabilityevent where pincode = {pincode}
        """,
        get_mysql_connection())
    
    return df

def transform_dataset(dataset):
    dataset = dataset.set_index('timestamp')
    dataset = dataset.drop(['id', 'event_details_json', 'district_id', 'center_name', 'pincode', 'state_id'], axis = 1)  
    dataset['exists'] = 1
    
    dataset.index = dataset.index.astype('datetime64[ns]')
    dataset.index = dataset.index.floor('d')
    dataset = dataset[~dataset.index.duplicated(keep='first')]
    dataset['tmp'] = dataset.index

    dataset['weekday'] = dataset.index.map(lambda x: x.weekday())

    dataset['interval'] = dataset['tmp'] - dataset['tmp'].shift(periods=1)
    dataset['interval'] = dataset['interval'].map(lambda x: x.days)

    dataset = dataset

    start_date = dataset.head(1).index.date[0]
    idx = date_range(start_date, date.today(), freq = 'd')

    del dataset['tmp']
    dataset = dataset.reindex(idx, fill_value=0)

    dataset['next_event_mean_days'] = dataset['interval'].rolling(3, min_periods=1).mean()

    dataset['tmp'] = dataset.index
    dataset['tmp2'] = dataset.index

    next_event_mean_days = -1
    last_timestamp = -1
    for index, row in dataset.iterrows():
        if row.next_event_mean_days > 0:
            next_event_mean_days = row.next_event_mean_days

        if row.exists == 1:
            last_timestamp = row.tmp

        if row.next_event_mean_days == 0:
            if next_event_mean_days != -1:
                dataset.loc[index, 'next_event_mean_days'] = next_event_mean_days

        if row.exists == 0:
            if last_timestamp != -1:
                dataset.loc[index, 'tmp2'] = last_timestamp

    dataset['interval'] = dataset['tmp'] - dataset['tmp2'].shift(periods=1)
    dataset['interval'] = dataset['interval'].map(lambda x: x.days)
    del dataset['tmp']
    del dataset['tmp2']
    dataset[1:]

    dataset = dataset.query('next_event_mean_days > 0')
    return dataset

def train_model(dataset, epochs=100, batch_size=100, verbose=1):
    X = dataset.values[:,1:4]
    min_max_scaler = MinMaxScaler()
    X = min_max_scaler.fit_transform(X)
    y = dataset.values[:,0:1]

    model = Sequential()
    model.add(Dense(50, input_dim=3, activation='relu'))
    model.add(Dense(10, activation='relu'))
    model.add(Dense(1, activation='sigmoid'))
    model.compile(loss='binary_crossentropy', optimizer='adam')

    history = model.fit(X, y, epochs=epochs, batch_size=batch_size, verbose=verbose)

    pyplot.plot(history.history['loss'], label='train')

    pyplot.legend()
    # pyplot.show()
    
    return (model, min_max_scaler)

def extrapolate_data(days, dataset, model, scaler):

    intervals_queue = queue.Queue(3)

    end_date = dataset[-1:].index.date[0]
    today = date.today()
    delta = today - end_date

    for index, row in dataset.iterrows():
        if row.exists == 1:
            if intervals_queue.full():
                intervals_queue.get()
            intervals_queue.put(row.interval, block=False)

    extrapolated_days = 10
    X = dataset.values[:,1:4].copy()
    y = dataset.values[:,0:1].copy()

    extrapolated_rows = X[-1:].copy()
    extrapolated_y = y[-1:].copy()

#     print('extrapolated_rows, extrapolated_y', extrapolated_rows, extrapolated_y)


    for i in range(0, extrapolated_days + delta.days):
        previous_row = extrapolated_rows[-1]
    #     print('previous_rows')
    #     print(previous_row)

        next_row = previous_row.copy()
        next_row[0] = (previous_row[0] + 1) % 7

        if extrapolated_y[-1][0] == 1:
            next_row[1] = 1
        else:
            next_row[1] = previous_row[1] + 1

        next_row[2] = np.mean(intervals_queue.queue)

    #     print('next_row_1', next_row, prediction_value)
        extrapolated_rows = np.concatenate((extrapolated_rows, np.array([next_row[:]])), axis = 0)

        scaled_validation_row = scaler.transform(extrapolated_rows[-1:])
    #     print('scaled_validation_row', scaled_validation_row, extrapolated_rows[-1:])
        prediction = model.predict(scaled_validation_row)
        prediction_value = prediction[0][0]

        if i < delta.days:
            prediction_value = 0
        else:
            pass

        if prediction_value > 0.5:
            scaled_prediction_value = 1
            if intervals_queue.full():
                intervals_queue.get()
            intervals_queue.put(next_row[1], block=False)
        else:
            scaled_prediction_value = 0

        extrapolated_y = np.concatenate((extrapolated_y, np.array([[scaled_prediction_value]])), axis=0)

    predictions = []
    x_values = []
    y_values = []

    existing_data = []

    for index, row in dataset.iterrows():
        x_value = index
        x_values.append(x_value)
        y_value = row.exists
        y_values.append(y_value)
        existing_data.append([x_value.strftime('%Y-%m-%d'), y_value])

    for i in range(0, len(extrapolated_y)):
        x_value = (end_date + timedelta(days=i))
        x_values.append(x_value)
        y_value = extrapolated_y[i][0]
        y_values.append(y_value)
        predictions.append([x_value.strftime('%Y-%m-%d'), y_value])
        
    predictions = predictions[1:]
    return (existing_data, predictions)

def plot_predictions(values):
    x_values = []
    y_values = []
    
    for value in values:
        x_values.append(value[0])
        y_values.append(value[1])
        
    pyplot.figure(figsize=(30,10))

    pyplot.scatter(x_values, y_values)
    pyplot.title('exists', y=0.5, loc='right')

    # pyplot.show()


def process_dataset(dataset, epochs=100, batch_size=100, verbose=1):   
    time_statistics_json = dataset['timestamp'].tail(10).astype('datetime64[ns]').map(lambda x: ((x.hour*60 + x.minute) + 5*60 + 30)%1440).describe().to_json()

    dataset = transform_dataset(dataset)

    (model, scaler) = train_model(dataset, epochs, batch_size, verbose)

    (existing_data, predictions) = extrapolate_data(10, dataset, model, scaler)

    plot_predictions(predictions)
    
    predictions_json = json.dumps(predictions)

    return (time_statistics_json, predictions_json)
    
# dataset = fetch_data_for_center(240, 'CHURI PANCHAYAT (Burmu)')
# dataset = fetch_data_for_pincode(560099)

# (time_statistics_json, predictions_json) = process_dataset(dataset, epochs=1000, verbose=1)

# print("time_statistics_json: ", time_statistics_json)
# print("predictions_json: ", predictions_json)

class Command(BaseCommand):
    help = "Predicts, the expected time when the slots might."

    def handle(self):
        pass