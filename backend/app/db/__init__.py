import psycopg2

conn = psycopg2.connect(database="postgres",
                        host="localhost",
                        user="postgres",
                        password="db_pass",
                        port="5432")
