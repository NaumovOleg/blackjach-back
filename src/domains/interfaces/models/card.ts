export enum SUIT {
  HEARTS,
  DIAMONDS,
  CLUBS,
  SPADES
}

export enum FACE {
  TWO,
  THREE,
  FOUR,
  FIVE,
  SIX,
  SEVEN,
  EIGHT,
  NINE,
  TEN,
  JACK,
  QUEEN,
  KING,
  ACE
}

export interface ICard {
  face: FACE;
  suit: SUIT;
  value: number[];
  isShown: boolean;
}
