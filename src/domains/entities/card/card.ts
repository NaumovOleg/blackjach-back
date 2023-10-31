import { FACE, SUIT, ICard } from '@domains/interfaces/models';

export class Card implements ICard {
  isShown: false;

  constructor(public face: FACE, public suit: SUIT) {}

  get value() {
    if (this.face <= FACE.TEN) {
      return [this.face + 2];
    }
    if (this.face !== FACE.ACE) {
      return [10];
    }

    return [11, 1];
  }
}
