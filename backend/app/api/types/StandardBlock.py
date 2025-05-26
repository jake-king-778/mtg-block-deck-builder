from datetime import datetime
from typing import List

from pydantic import BaseModel

from app.api.types.MtgSet import MtgSet


class StandardBlock(BaseModel):
    last_standard_date: datetime
    sets: List[MtgSet]
