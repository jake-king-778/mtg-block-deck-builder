import statistics

import psycopg2
import json

conn = psycopg2.connect(
    database="postgres",
    host="localhost",
    user="postgres",
    password="db_pass",
    port="5432",
)

cursor = conn.cursor()

cursor.execute(
    """
    ALTER TABLE cards ADD COLUMN IF NOT EXISTS price decimal;
    """
)

with open("AllPrices.json") as prices_file:
    prices_json = json.load(prices_file)

for uuid, complicated_dictionary in prices_json["data"].items():
    if "paper" in complicated_dictionary:
        if "tcgplayer" in complicated_dictionary["paper"]:
            if "retail" in complicated_dictionary["paper"]["tcgplayer"]:
                if "normal" in complicated_dictionary["paper"]["tcgplayer"]["retail"]:
                    price = complicated_dictionary["paper"]["tcgplayer"]["retail"]["normal"].values()[-1]
                    print(
                        cursor.execute(
                            f"""
                        UPDATE cards SET price = %s WHERE uuid = %s;
                        """,
                            [price, uuid],
                        )
                    )
                    conn.commit()
