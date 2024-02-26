import { useCallback, useEffect, useState } from "react";

export default function useBet(
  currentCount: number,
  currentRound: number,
  checkLimit: boolean = false
) {
  const max = currentRound % 6 || 6;
  const [bet, setBet] = useState(0);

  const add = useCallback(() => {
    let newBet = bet + 1;
    if (newBet + currentCount === currentRound && checkLimit) {
      newBet += 1;
    }
    if (newBet <= max) {
      setBet(newBet);
    }
  }, [bet, checkLimit, currentCount, currentRound, max]);

  const subtract = useCallback(() => {
    let newBet = bet - 1;
    if (newBet + currentCount === currentRound && checkLimit) {
      newBet -= 1;
    }
    if (newBet >= 0) {
      setBet(newBet);
    }
  }, [bet, checkLimit, currentCount, currentRound]);

  useEffect(() => {
    if (checkLimit) {
      if (currentCount === currentRound) {
        setBet(1);
      }
    }
  }, [checkLimit, currentCount, currentRound]);

  return { bet, max, add, subtract };
}
