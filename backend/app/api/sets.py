from datetime import datetime, timedelta
from typing import List, Set

from fastapi import APIRouter

from app.api.types.MtgSet import MtgSet
from app.api.types.StandardBlock import StandardBlock
from app.db import conn

router = APIRouter(prefix="/sets")


@router.get("/standardBlocks", response_model=List[StandardBlock])
def get_standard_blocks() -> List[StandardBlock]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, name, releasedate::date, laststandarddate::date, code
        FROM sets 
        WHERE laststandarddate IS NOT NULL
        ORDER BY laststandarddate DESC, releasedate DESC
        """
    )
    results = cursor.fetchall()

    """
    sets can overlap the blocks because of how the rotation works, so every time there is a different
    last standard date, we should see what was all standard as of last standard date - 1 day
    """
    last_standard_date_set: Set[datetime] = set()
    output: List[StandardBlock] = []
    # iterate through the list but maintain order so we do the earliest first
    for result in results:
        last_standard_date = result[3]
        if last_standard_date not in last_standard_date_set:
            output.append(
                StandardBlock(
                    last_standard_date=last_standard_date,
                    sets=[
                        MtgSet(
                            id=r[0],
                            name=r[1],
                            release_date=r[2],
                            last_standard_date=r[3],
                            code=r[4],
                        )
                        for r in results
                        if r[2] <= last_standard_date <= r[3]
                    ],
                )
            )
            last_standard_date_set.add(last_standard_date)
    return output
