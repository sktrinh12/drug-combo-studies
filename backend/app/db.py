import psycopg2

conn = psycopg2.connect(user="postgres",
                         password="postgres",
                         host="localhost",
                         database="postgres")
