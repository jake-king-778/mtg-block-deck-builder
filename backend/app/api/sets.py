from typing import List

from fastapi import APIRouter

from app.api.types.Set import Set
from app.api.types.StandardBlock import StandardBlock
from app.db import conn

router = APIRouter(prefix="/sets")


@router.get("/standardBlocks", response_model=List[StandardBlock])
def get_standard_blocks() -> List[StandardBlock]:
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT id, name, releasedate, laststandarddate, code
        FROM sets 
        WHERE laststandarddate IS NOT NULL
        ORDER BY laststandarddate DESC, releasedate DESC
        """
    )
    results = cursor.fetchall()
    current_block_date = results[0][3]
    output: List[StandardBlock] = []
    set_context: List[Set] = []
    for result in results:
        if result[3] == current_block_date:
            set_context.append(
                Set(
                    id=result[0],
                    name=result[1],
                    last_standard_date=result[2],
                    release_date=result[3],
                    code=result[4],
                )
            )
        else:
            output.append(StandardBlock(last_standard_date=current_block_date, sets=set_context))
            current_block_date = result[3]
            set_context = [
                Set(
                    id=result[0],
                    name=result[1],
                    last_standard_date=result[2],
                    release_date=result[3],
                    code=result[4],
                )
            ]
    output.append(StandardBlock(last_standard_date=current_block_date, sets=set_context))
    return output
