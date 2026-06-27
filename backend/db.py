import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="root",
            database="car_rental"
        )
        return conn
    except Error as e:
        print(f"Database connection error: {e}")
        raise e
