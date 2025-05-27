export default interface MtgSet {
  name: string;
  releaseDate: Date;
  code: String;
}

export default interface StandardBlocks {
  lastStandardDate: Date;
  sets: Array<MtgSet>;
}
