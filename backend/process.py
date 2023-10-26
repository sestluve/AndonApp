import sys

sys.path.append('c:\python311\lib\site-packages')

from flask import Flask, request, jsonify, Response
import string
import random
import json
import re
import math 
from flask import abort


from flask_cors import CORS
from flask import Flask, request, jsonify, abort

import requests
import pyodbc
import psycopg2
from flask_cors import CORS

from datetime import datetime, timedelta

import pandas as pd

app = Flask(__name__)
CORS(app)





'''
def connect_db_woodapp():
    server ="10.2.0.11"
    database ="postgres"
    username ="postgres"
    password ="Daisy#2022"

    conn = psycopg2.connect(host=server, database=database, user=username, password=password)

    return conn
'''

def connect_db_apps():
    server ="10.2.0.9"
    database ="postgres"
    username ="postgres"
    password ="Daisy#2022"

    conn = psycopg2.connect(host=server, database=database, user=username, password=password)

    return conn

def connect_db_rcp():
    server ="10.2.0.16"
    database ="rcp"
    username ="rcp"
    password ="rcp"
    driver= '{ODBC Driver 17 for SQL Server}'

    cnxn = pyodbc.connect('DRIVER=' + str(driver) + ';SERVER=' + str(server) + ';PORT=1433;DATABASE=' + str(database) + ';UID=' + str(username) + ';PWD=' + str(password))

    return cnxn




EXCLUSION_INTERVALS = [
        (10*3600 + 20*60, 10*3600 + 35*60),
        (12*3600 + 20*60, 12*3600 + 25*60),
        (18*3600 + 20*60, 18*3600 + 35*60),
        (20*3600 + 20*60, 20*3600 + 25*60),
        (2*3600 + 20*60, 2*3600 + 35*60),
        (4*3600 + 20*60, 4*3600 + 25*60)
    ]



from datetime import datetime, timedelta

def generate_sql_date_query():
    current_date = datetime.now()

    # Convert current date to seconds since midnight for easier comparisons
    hours, minutes, seconds = current_date.hour, current_date.minute, current_date.second
    current_time_in_seconds = hours * 3600 + minutes * 60 + seconds

    FIRST_SHIFT_START = 5 * 3600 + 45 * 60 + 1  # 05:45:01
    FIRST_SHIFT_END = 13 * 3600 + 45 * 60       # 13:45:00
    SECOND_SHIFT_START = FIRST_SHIFT_END + 1    # 13:45:01
    SECOND_SHIFT_END = 21 * 3600 + 45 * 60      # 21:45:00
    
    

    def is_within_exclusion(current_seconds):
        for start, end in EXCLUSION_INTERVALS:
            if start <= current_seconds <= end:
                return True
        return False
    
    

    # Detect current shift
    if FIRST_SHIFT_START <= current_time_in_seconds <= FIRST_SHIFT_END:
        shift = 1
    elif SECOND_SHIFT_START <= current_time_in_seconds <= SECOND_SHIFT_END:
        shift = 2
    else:
        shift = 3

    # Determine date range for the detected shift
    if shift == 1:
        shift_start_date = current_date.replace(hour=5, minute=45, second=1, microsecond=0)
        shift_end_date = current_date.replace(hour=13, minute=45, second=0, microsecond=0)
        if current_time_in_seconds < FIRST_SHIFT_START:
            shift_start_date -= timedelta(days=1)
            shift_end_date -= timedelta(days=1)
        elif current_time_in_seconds <= FIRST_SHIFT_END:
            shift_end_date = current_date

    elif shift == 2:
        shift_start_date = current_date.replace(hour=13, minute=45, second=1, microsecond=0)
        shift_end_date = current_date.replace(hour=21, minute=45, second=0, microsecond=0)
        if current_time_in_seconds < SECOND_SHIFT_START:
            shift_start_date -= timedelta(days=1)
            shift_end_date -= timedelta(days=1)
        elif current_time_in_seconds <= SECOND_SHIFT_END:
            shift_end_date = current_date

    elif shift == 3:
        shift_start_date = current_date.replace(hour=21, minute=45, second=1, microsecond=0)
        shift_end_date = current_date.replace(hour=5, minute=45, second=0, microsecond=0) + timedelta(days=1)
        if current_time_in_seconds < SECOND_SHIFT_END:
            shift_start_date -= timedelta(days=1)
        elif SECOND_SHIFT_END <= current_time_in_seconds < FIRST_SHIFT_START:
            shift_end_date -= timedelta(days=1)
        else:
            shift_end_date = current_date

    # Adjust for exclusion intervals
    if is_within_exclusion(current_time_in_seconds):
        for start, end in EXCLUSION_INTERVALS:
            if start <= current_time_in_seconds <= end:
                shift_start_date = datetime.fromtimestamp(start).replace(year=current_date.year, month=current_date.month, day=current_date.day)
                shift_end_date = datetime.fromtimestamp(end).replace(year=current_date.year, month=current_date.month, day=current_date.day)
                break

    # Convert to string format
    shift_start_date_str = shift_start_date.strftime("%Y-%m-%d %H:%M:%S")
    shift_end_date_str = shift_end_date.strftime("%Y-%m-%d %H:%M:%S")

      # Adjust for exclusion intervals
    total_excluded_seconds = 0
    for start, end in EXCLUSION_INTERVALS:
        if start <= current_time_in_seconds <= end:
            total_excluded_seconds += end - start
            shift_start_date += timedelta(seconds=(end - start))
        if start <= shift_end_date.second <= end:
            total_excluded_seconds += end - start
            shift_end_date -= timedelta(seconds=(end - start))

    # Convert to string format
    shift_start_date_str = shift_start_date.strftime("%Y-%m-%d %H:%M:%S")
    shift_end_date_str = shift_end_date.strftime("%Y-%m-%d %H:%M:%S")

    return shift_start_date_str, shift_end_date_str, total_excluded_seconds






def compute_average_time_from_csv(sap_codes, csv_file):
    # Read the CSV file
    df = pd.read_csv(csv_file, sep=";")

    # Convert comma-separated decimal time to float
    df['time'] = df['time'].str.replace(',', '.').astype(float)
    df['code'] = df['code'].astype(str)

    total_seconds = 0
    print("codes in file", df['code'].values)

    for sap_code in sap_codes:
        if sap_code in df['code'].values:  # Check if SAP code exists in the CSV
            time_value = df[df['code'] == sap_code]['time'].values[0]  # retrieve time for the given SAP code
            print("Found time for SAP code " + sap_code + ": " + str(time_value))
            total_seconds += time_value  # assuming the value is in minutes
        else:
            total_seconds += 3.5
        

    if(len(sap_codes) != 0):
        average_seconds = total_seconds / len(sap_codes)
    else:
        average_seconds = 0
    return average_seconds











@app.route('/api/fetch_data', methods=['POST'])
def fetch_data():
    data = request.json
    machine = data['machine']

    if machine is None:
        abort(400)

    shift_start_date_str, shift_end_date_str, total_excluded_seconds = generate_sql_date_query()

    start_time = datetime.strptime(shift_start_date_str, "%Y-%m-%d %H:%M:%S")
    end_time = datetime.strptime(shift_end_date_str, "%Y-%m-%d %H:%M:%S")

    time_difference = end_time - start_time
    seconds_difference = time_difference.total_seconds() - total_excluded_seconds

    

    conn = connect_db_apps()
    cursor = conn.cursor()
    cursor.execute(f"select * from helium_new where machine_name = %s AND \"RESULT\" = 'Good' AND (length(\"SERIAL\") = 7 OR length(\"SERIAL\") = 8) AND \"DATE-TIME\"  BETWEEN '{shift_start_date_str}' AND '{shift_end_date_str}' order by \"DATE-TIME\" asc", (machine,))
    result = cursor.fetchall()

    result = [[x if i not in [14, 15] else str(x) for i, x in enumerate(row)] for row in result]   
    cursor.close()

    cursor2 = conn.cursor()
    cursor2.execute(f"select * from helium_new where machine_name = %s AND \"RESULT\" = 'Reject' AND (length(\"SERIAL\") = 7 OR length(\"SERIAL\") = 8) AND \"DATE-TIME\"  BETWEEN '{shift_start_date_str}' AND '{shift_end_date_str}' order by \"DATE-TIME\" asc", (machine,))
    result2 = cursor2.fetchall()

    result2 = [[x if i not in [14, 15] else str(x) for i, x in enumerate(row)] for row in result2]
    conn.close()

    
    

    sap_codes = [row[5] for row in result]
    print(sap_codes)
    needed = 0
    average_time = compute_average_time_from_csv(sap_codes, "T:\\codes.csv") * 60
    if(average_time > 0):
        needed = math.ceil(seconds_difference / average_time)
    return jsonify({"ok": result, "nok": result2, "needed": needed})





if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5002)

