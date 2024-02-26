import useBet from "@/hooks/useBet";
import { Button } from "../atoms/Button";
import { useCallback } from "react";

interface BetProps {
  betCount: number;
  currentRound: number;
  checkLimit: boolean;
  handleBet: (bet: number) => void;
}
export default function Bet({
  betCount,
  currentRound,
  checkLimit,
  handleBet,
}: BetProps) {
  const { bet, max, add, subtract } = useBet(
    betCount,
    currentRound,
    checkLimit
  );

  return (
    <>
      <div className="flex justify-center items-center mx-2">
        <Button onClick={subtract} disabled={bet === 0}>
          -
        </Button>
        <span className="m-2 font-semibold">{bet}</span>
        <Button onClick={add} disabled={bet === max}>
          +
        </Button>
      </div>
      <Button onClick={() => handleBet(bet)}>APOSTAR</Button>
    </>
  );
}
