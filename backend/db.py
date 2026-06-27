import mysql.connector
from mysql.connector import Error

def get_connection():
    return mysql.connector.connect(
        host="reseau.proxy.rlwy.net",
        port=53223,
        user="root",
        password="PxYCXIfgoduTMtiSAqfpnQBcSmomQILa",
        database="railway"
    )