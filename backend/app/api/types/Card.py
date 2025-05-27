from enum import Enum, auto
from typing import List, Optional
from uuid import UUID

from app.api.types.BaseSchema import BaseSchema


class Rarity(Enum):
    COMMON = 1
    UNCOMMON = 2
    RARE = 3
    MYTHIC = 4


class CardType(Enum):
    ARTIFACT = auto()
    ENCHANTMENT = auto()
    LAND = auto()
    INSTANT = auto()
    SORCERY = auto()
    CREATURE = auto()
    SUMMON = auto()
    WOLF = auto()
    KINDRED = auto()
    GOBLIN = auto()
    PHENOMENON = auto()
    CONSPIRACY = auto()
    ELEMENTAL = auto()
    VANGUARD = auto()
    TRIBAL = auto()
    HERO = auto()
    PLANE = auto()
    POLY = auto()
    KNIGHTS = auto()
    STICKERS = auto()
    SCHEME = auto()
    PLANESWALKER = auto()
    TOKEN = auto()
    DRAGON = auto()


class Card(BaseSchema):
    id: int
    uuid: UUID
    name: str
    mana_cost: Optional[str]
    power: Optional[str]
    toughness: Optional[str]
    type: str
    text: Optional[str]
    keywords: List[str]
    rarity: Rarity
    types: List[CardType]
    is_legendary: bool
    set_code: str
