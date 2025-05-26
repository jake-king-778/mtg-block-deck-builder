from typing import List

from fastapi import APIRouter, Query
from pydantic import BaseModel

from app.api.types.Card import Card, Rarity, CardType
from app.db import conn

router = APIRouter(prefix="/cards")


class CardFilter(BaseModel):
    set_codes: List[str]


@router.get("/", response_model=List[Card])
def get_standard_blocks(set_codes: List[str] = Query(None)) -> List[Card]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT  id, uuid, name, manacost, power, toughness, type, text, keywords, rarity, types
        FROM cards
        WHERE setcode=%s
        """
        + ("OR setcode=%s" * (len(set_codes) - 1)),
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
        )
        for r in cursor.fetchall()
    ]
