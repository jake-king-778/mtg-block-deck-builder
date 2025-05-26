from datetime import datetime

from pydantic import BaseModel


class MtgSet(BaseModel):
    id: int
    name: str
    last_standard_date: datetime
    release_date: datetime
    code: str
