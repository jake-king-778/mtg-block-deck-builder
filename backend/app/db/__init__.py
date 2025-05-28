import os

import psycopg2

# TODO: need app config
host = "database" if os.getenv("ENV") == "test" else "localhost"
conn = psycopg2.connect(
    database="postgres",
    host=host,
    user="postgres",
    password="db_pass",
    port="5432",
)
