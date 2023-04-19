import psycopg2
from os import getenv

conn = psycopg2.connect(
    user=getenv("POSTGRES_USER", "postgres"),
    password=getenv("POSTGRES_PASSWORD", "postgres"),
    host=getenv("POSTGRES_HOST", "localhost"),
    database=getenv("POSTGRES_DBNAME", "postgres"),
)
