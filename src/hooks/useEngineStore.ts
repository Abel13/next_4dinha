import { supabase } from "@/config/supabase";
import { MatchUser } from "@/models/MatchUser";
import { Round } from "@/models/Round";
import { UserTurn } from "@/models/UserTurn";
import { create } from "zustand";
import { useRoundStore } from "./useRoundStore";

export interface IEngineStore {
  state: {
    tableSits: MatchUser[];
    tableCards: { [key: string]: number };
    matchUsers: MatchUser[];
  };
  fetchMatchUsers: (matchId: string) => void;
  fetchTableCards: (roundId: string) => Promise<void>;
  getMatchUserByUserId: (id: string) => MatchUser;
  fillSits: (me: MatchUser) => void;
  handleBet: (round: Round, me: MatchUser, bet: number) => void;
  setTableCards: (cards: { [playerId: string]: number }) => void;
  playCard: (me: MatchUser, cardId: number) => void;
}

export const useEngineStore = create<IEngineStore>((set, get) => ({
  state: {
    tableSits: [],
    matchUsers: [],
    tableCards: {},
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
  setTableCards: (cards) => {
    set({
      state: {
        ...get().state,
        tableCards: cards,
      },
    });
  },
  playCard: (me, cardId) => {
    const cards = {
      ...get().state.tableCards,
      [me.user_id]: cardId,
    };

    set({
      state: {
        ...get().state,
        tableCards: cards,
      },
    });
  },
  fetchTableCards: async (roundId) => {
    const currentTurn = await useRoundStore
      .getState()
      .fetchCurrentTurn(roundId)!;
    if (!currentTurn) {
      return;
    }
    const { data: tableCards } = await supabase
      .from("user_turn")
      .select("*")
      .eq("turn_id", currentTurn.id!);

    console.log("tableCards", tableCards);
    if (tableCards) {
      let cards = get().state.tableCards;
      tableCards.forEach((element: UserTurn) => {
        cards[element.user_id] = element.card;
      });

      set({
        state: {
          ...get().state,
          tableCards: cards,
        },
      });
    }
  },
}));
