from datetime import datetime

from app.api.types.BaseSchema import BaseSchema


class MtgSet(BaseSchema):
    id: int
    name: str
    last_standard_date: datetime
    release_date: datetime
    code: str
