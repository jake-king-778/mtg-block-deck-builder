from typing import List

from fastapi import APIRouter, Query

from app.api.types.BaseSchema import BaseSchema
from app.api.types.Card import Card, Rarity, CardType
from app.db import conn

router = APIRouter(prefix="/cards")


class CardFilter(BaseSchema):
    set_codes: List[str]


@router.get("/", response_model=List[Card])
def get_standard_blocks(set_codes: List[str] = Query(None)) -> List[Card]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT  id, uuid, name, manacost, power, toughness, type, text, keywords, rarity, types, setcode, price, 
        coloridentity, min_price, min_price_set_code, min_price_number
        FROM cards
        LEFT JOIN (
            SELECT * FROM (
                SELECT min_price, min_price_set_code, min_price_name, min_price_number FROM (
                SELECT price min_price, setcode min_price_set_code, name min_price_name, number min_price_number,
                rank() OVER (PARTITION BY name ORDER BY price, id ASC) rank
                FROM cards
                WHERE price is not null)
            WHERE rank = 1)
        ) ON name = min_price_name
        WHERE type NOT LIKE 'Basic Land%%'
        AND (setcode=%s
        """
        + (" OR setcode=%s" * (len(set_codes) - 1))
        + ")",
        set_codes,
    )
    return [
        Card(
            id=r[0],
            uuid=r[1],
            name=r[2],
            mana_cost=r[3],
            power=r[4],
            toughness=r[5],
            type=r[6],
            text=r[7],
            keywords=[] if not r[8] else r[8].replace(" ", "").split(","),
            rarity=Rarity[r[9].upper()],
            types=[CardType[t.upper()] for t in r[10].replace(" ", "").split(",")],
            is_legendary="legendary" in r[6].lower(),
            set_code=r[11],
            price=r[12],
            color_identity=r[13].split(",") if r[13] else [],
            min_price=r[14],
            min_price_set_code=r[15],
            min_price_number=r[16],
        )
        for r in cursor.fetchall()
    ]
