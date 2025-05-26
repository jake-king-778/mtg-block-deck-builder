from typing import List

from pydantic import BaseModel

from app.api.types.Set import Set


class StandardBlock(BaseModel):
    last_standard_date: str
    sets: List[Set]

