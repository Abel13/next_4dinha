import { supabase } from "@/config/supabase";
import { MatchUser } from "@/models/MatchUser";
import { Round } from "@/models/Round";

import { RoundUser } from "@/models/RoundUser";
import { create } from "zustand";
import { useEngineStore } from "./useEngineStore";

interface IRoundStore {
  state: {
    currentRound: Round | null;
    currentPlayer: RoundUser | null;
    betCount: number;
  };
  createRoundUsers: (round: Round, referencePlayerId: string) => Promise<void>;
  handleDeal: (referencePlayer: MatchUser) => void;
  fetchCurrentRound: (matchId: string) => void;
  fetchCurrentPlayer: () => void;
  setCurrentPlayer: (currentPlayer: RoundUser) => void;
  setCurrentRound: (currentRound: Round | null) => void;
  getBetCount: (round: Round) => void;
}

export const useRoundStore = create<IRoundStore>((set, get) => ({
  state: {
    currentPlayer: null,
    currentRound: null,
    betCount: 0,
  },
  getBetCount: async (round: Round) => {
    const { data: roundUsers, error } = await supabase
      .from("round_users")
      .select("bet")
      .eq("round_id", round.id);

    if (roundUsers) {
      set(() => ({
        state: {
          ...get().state,
          betCount: roundUsers.reduce((acc, user) => acc + (user.bet || 0), 0),
        },
      }));
    }
  },
  createRoundUsers: async (round: Round, referencePlayerId: string) => {
    let roundUsers: {
      user_id: string;
      round_id: string;
      round_number: number;
    }[] = [];
    let nextPlayer = useEngineStore
      .getState()
      .getMatchUserByUserId(
        useEngineStore.getState().getMatchUserByUserId(referencePlayerId)
          .next_user!
      );

    await supabase.from("round_users").insert({
      round_id: round.id,
      user_id: referencePlayerId,
    });
    roundUsers.push({
      user_id: referencePlayerId,
      round_id: round.id,
      round_number: round.number,
    });

    while (nextPlayer?.user_id !== referencePlayerId) {
      await supabase.from("round_users").insert({
        round_id: round.id,
        user_id: nextPlayer?.user_id!,
      });
      roundUsers.push({
        user_id: nextPlayer?.user_id,
        round_id: round.id,
        round_number: round.number,
      });

      nextPlayer = useEngineStore
        .getState()
        .getMatchUserByUserId(nextPlayer?.next_user!);
    }

    // Call the server function to deal the cards
    try {
      const resposta = await fetch("/deal", {
        method: "POST",
        body: JSON.stringify(roundUsers),
      });
      const data = await resposta.json();
      get().fetchCurrentPlayer();
      get().fetchCurrentRound(round.match_id);
    } catch (error) {}
  },
  handleDeal: async (referencePlayer: MatchUser) => {
    // Get all rounds from the current match
    const { data: rounds } = await supabase
      .from("rounds")
      .select("*")
      .eq("match_id", referencePlayer.match_id)
      .order("created_at", { ascending: false });

    const roundNumber = (rounds?.length || 0) + 1;

    if (rounds?.every((round) => round.done)) {
      const { data } = await supabase
        .from("rounds")
        .insert({
          match_id: referencePlayer.match_id,
          number: roundNumber,
        })
        .select();

      if (data) {
        get().setCurrentRound(data[0]);
        get().createRoundUsers(data[0], referencePlayer.next_user!);
      }
    } else {
      const currentRound = rounds?.find((round) => !round.done) || null;
      get().setCurrentRound(currentRound);
    }
  },
  fetchCurrentRound: async (matchId: string) => {
    const { data: round, error } = await supabase
      .from("rounds")
      .select("*")
      .eq("match_id", matchId)
      .eq("done", false)
      .single();

    if (round) {
      get().setCurrentRound(round);
    }
  },
  fetchCurrentPlayer: async () => {
    const { data: roundUser } = await supabase
      .from("round_users")
      .select("*")
      .eq("current", true)
      .single();

    if (roundUser) {
      get().setCurrentPlayer(roundUser);
    }
  },
  setCurrentPlayer: (currentPlayer) => {
    set(() => ({
      state: {
        ...get().state,
        currentPlayer,
      },
    }));
  },
  setCurrentRound: (currentRound) => {
    set(() => ({
      state: {
        ...get().state,
        currentRound,
      },
    }));
  },
}));
