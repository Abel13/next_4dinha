import { supabase } from "@/config/supabase";
import { RoundUserCard } from "@/models/RoundUserCard";
import { useEngineStore } from "./useEngineStore";
import { Card } from "@/models/Card";
import { Round } from "@/models/Round";
import useCard from "./useCard";

export default function useRoundNumberOne() {
  const {
    state: { tableSits },
    getMatchUserByUserId,
    setTableCards,
  } = useEngineStore((store) => store);
  const { getCard } = useCard();

  const getRoundCard = async (
    userId: string,
    roundId: string
  ): Promise<RoundUserCard | null> => {
    const { data: card, error } = await supabase
      .from("round_user_cards")
      .select("*")
      .eq("user_id", userId)
      .eq("round_id", roundId)
      .single();

    return card;
  };

  const fillFirstRoundCards = async (round: Round) => {
    if (tableSits.length === 0) return;
    let cards: { [playerId: string]: Card };
    cards = {
      [tableSits[0].user_id]: getCard(0, round.trump)!,
    };

    let currentPlayer = getMatchUserByUserId(tableSits[0].next_user!);
    while (currentPlayer.user_id !== tableSits[0].user_id) {
      const roundCard = await getRoundCard(currentPlayer.user_id, round.id);
      cards = {
        ...cards,
        [currentPlayer.user_id]: getCard(roundCard?.card!, round.trump)!,
      };
      currentPlayer = getMatchUserByUserId(currentPlayer.next_user!);
    }

    setTableCards(cards);
  };

  return {
    fillFirstRoundCards,
  };
}
