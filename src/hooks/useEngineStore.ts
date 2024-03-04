import { supabase } from "@/config/supabase";
import { MatchUser } from "@/models/MatchUser";
import { Round } from "@/models/Round";
import { create } from "zustand";
import { useRoundStore } from "./useRoundStore";
import { Card } from "@/models/Card";

export interface IEngineStore {
  state: {
    tableSits: MatchUser[];
    matchUsers: MatchUser[];
  };
  fetchMatchUsers: (matchId: string) => void;
  getMatchUserByUserId: (id: string) => MatchUser;
  fillSits: (me: MatchUser) => void;
  handleBet: (round: Round, me: MatchUser, bet: number) => void;
}

export const useEngineStore = create<IEngineStore>((set, get) => ({
  state: {
    tableSits: [],
    matchUsers: [],
  },
  fetchMatchUsers: async (matchId) => {
    const { data: matchUsers, error } = await supabase
      .from("match_users")
      .select("*")
      .eq("match_id", matchId);

    if (error) {
      console.error("Error getting match users", error);
      return;
    }

    if (matchUsers) {
      set({
        state: {
          ...get().state,
          matchUsers,
        },
      });
    }
  },
  getMatchUserByUserId: (id) => {
    const matchUser = get().state.matchUsers.find(
      (matchUser) => matchUser.user_id === id
    )!;

    return matchUser;
  },
  fillSits: (me: MatchUser) => {
    if (get().state.matchUsers.length > 0) {
      let tableSits = [];

      tableSits.push(me);

      if (me.next_user) {
        let nextPlayer = get().getMatchUserByUserId(me.next_user);

        while (nextPlayer.user_id !== me.user_id) {
          tableSits.push(nextPlayer);
          nextPlayer = get().getMatchUserByUserId(nextPlayer.next_user!);
        }

        set({
          state: {
            ...get().state,
            tableSits,
          },
        });
      }
    }
  },
  handleBet: async (round, me, bet) => {
    const nextPlayer = get().getMatchUserByUserId(me.next_user!);

    await supabase
      .from("round_users")
      .update({ current: true })
      .eq("round_id", round.id)
      .eq("user_id", nextPlayer.user_id);

    await supabase
      .from("round_users")
      .update({ bet, current: false })
      .eq("round_id", round.id)
      .eq("user_id", me.user_id);

    if (me.dealer) {
      useRoundStore.getState().createTurn();
    }

    useRoundStore.getState().fetchCurrentPlayer();
  },
}));
