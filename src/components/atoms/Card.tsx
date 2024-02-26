import logo from "@/assets/icon.png";
import { Card, CardSuit, CardSymbol, SuitSymbol } from "@/models/Card";
import Image from "next/image";

interface CardProps {
  card?: Card;
  turnDown?: boolean;
}

export default function CardItem({ card, turnDown }: CardProps) {
  const symbol = (suit: CardSuit) => {
    return SuitSymbol[CardSuit[suit] as keyof typeof SuitSymbol];
  };
  const suitColor = (suit: CardSuit) => {
    switch (suit) {
      case CardSuit.Clubs:
      case CardSuit.Spades:
        return "text-black";
      case CardSuit.Hearts:
      case CardSuit.Diamonds:
        return "text-red-500";
    }
  };

  if (!card) return <div className=""></div>;

  if (turnDown)
    return (
      <div className="w-14 h-20 rounded-lg shadow-md flex flex-col justify-center border p-2 bg-white">
        <Image
          className="relative"
          src={logo}
          alt="card"
          width={100}
          height={100}
          priority
        />
      </div>
    );

  return (
    <div className="relative w-14 h-20 bg-zinc-100 rounded-lg shadow-md flex flex-col justify-between p-1 ">
      <div className="flex justify-between">
        <h1 className={`text-xs font-bold ${suitColor(card.suit)}`}>{`${
          card.symbol
        }${symbol(card.suit)}`}</h1>
        {card.isTrump && (
          <span aria-label="Trunfo" className="text-xs text-red-500">
            •
          </span>
        )}
      </div>
      <div
        className={`flex w-8 h-10 font-bold ${suitColor(
          card.suit
        )} self-center p-1 border rounded justify-center items-center`}
      >
        <span className="text-2xl">{symbol(card.suit)}</span>
      </div>
      <h1
        className={`text-xs font-bold ${suitColor(
          card.suit
        )} self-end rotate-180`}
      >
        {`${card.symbol}${symbol(card.suit)}`}
      </h1>
    </div>
  );
}