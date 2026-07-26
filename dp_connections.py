import mysql.connector
from mysql.connector import Error

# MySQL Database Configuration
# Modify these details to match your local MySQL configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'your_mysql_password_here',  # Update with your MySQL root password
    'database': 'emotiondb',
    'use_pure': True         # Fallback to pure python implementation if C extension is missing
}

def get_connection():
    """
    Establish and return a MySQL connection.
    Returns:
        mysql.connector.connection.MySQLConnection or None: The database connection object.
    """
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Database Connection Error: {e}")
        return None
