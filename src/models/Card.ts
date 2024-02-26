export enum SuitSymbol {
  Clubs = "♣️",
  Hearts = "♥️",
  Spades = "♠️",
  Diamonds = "♦️",
  Hide = "?",
}

export enum CardSuit {
  Clubs = 4,
  Hearts = 3,
  Spades = 2,
  Diamonds = 1,
  Hide = 0,
}

export enum CardPower {
  Hide = 0,
  Four = 1,
  Five = 2,
  Six = 3,
  Seven = 4,
  Eight = 5,
  Nine = 6,
  Ten = 7,
  Queen = 8,
  Jack = 9,
  King = 10,
  Ace = 11,
  Two = 12,
  Three = 13,
  Trump = 14,
}

export enum CardSymbol {
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Queen = "Q",
  Jack = "J",
  King = "K",
  Ace = "A",
  Two = "2",
  Three = "3",
  Hide = "?",
}

export type Card = {
  id: number;
  suit: CardSuit;
  symbol: CardSymbol;
  power: CardPower;
  isTrump: boolean;
};
