export default interface MtgCard {
  id: number;
  name: string;
  manaCost: string;
  power: string;
  toughness: string;
  strength: string;
  text: string;
  type: string;
  rarity: string;
  price: number;
  colorIdentity: string[];
  minPrice: number;
  minPriceSetCode: string;
  minPriceNumber: string;
}
