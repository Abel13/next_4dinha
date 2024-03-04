import { supabase } from "@/config/supabase";
import { RoundUserCard } from "@/models/RoundUserCard";
import { useEngineStore } from "./useEngineStore";

export default function useRoundNumberOne() {
  const {
    state: { tableSits },
    getMatchUserByUserId,
    setTableCards,
  } = useEngineStore((store) => store);

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

  const fillFirstRoundCards = async (roundId: string) => {
    if (tableSits.length === 0) return;
    let cards: { [playerId: string]: number };
    cards = {
      [tableSits[0].user_id]: 0,
    };

    let currentPlayer = getMatchUserByUserId(tableSits[0].next_user!);
    while (currentPlayer.user_id !== tableSits[0].user_id) {
      const card = await getRoundCard(currentPlayer.user_id, roundId);
      cards = {
        ...cards,
        [currentPlayer.user_id]: card?.card!,
      };
      currentPlayer = getMatchUserByUserId(currentPlayer.next_user!);
    }

    setTableCards(cards);
  };

  return {
    fillFirstRoundCards,
  };
}
