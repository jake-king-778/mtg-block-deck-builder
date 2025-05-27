from datetime import datetime
from typing import List

from app.api.types.BaseSchema import BaseSchema
from app.api.types.MtgSet import MtgSet


class StandardBlock(BaseSchema):
    last_standard_date: datetime
    sets: List[MtgSet]
