import { ICard, SUIT, FACE } from '@domains/interfaces/models';
import { Card } from '@entities/card';

export class Deck {
  private cards: ICard[] = [];

  constructor() {
    const faces = Object.values(FACE).filter((el) => !Number.isNaN(Number(el)));
    const suits = Object.keys(SUIT).filter((el) => !Number.isNaN(Number(el)));

    faces.forEach((face) => {
      suits.forEach((suit) => {
        this.cards.push(new Card(face, suit));
      });
    });
  }

  shuffle() {
    // Implement card shuffling logic
  }

  drawCard(): Card | undefined {
    // Implement logic to draw a card from the deck
  }
}
