from pydantic import BaseModel


class Set(BaseModel):
    id: int
    name: str
    last_standard_date: str
    release_date: str
