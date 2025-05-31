from enum import Enum, auto
from typing import List, Optional
from uuid import UUID

from app.api.types.BaseSchema import BaseSchema


class Rarity(Enum):
    COMMON = "COMMON"
    UNCOMMON = "UNCOMMON"
    RARE = "RARE"
    MYTHIC = "MYTHIC"
    BONUS = "BONUS"
    SPECIAL = "SPECIAL"


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
    BATTLE = auto()


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
    price: Optional[float]
    color_identity: List[str]
    min_price: Optional[float]
    min_price_set_code: Optional[str]
    min_price_number: Optional[str]
