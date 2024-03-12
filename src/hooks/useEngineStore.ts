import { supabase } from "@/config/supabase";
import { MatchUser } from "@/models/MatchUser";
import { Round } from "@/models/Round";
import { UserTurn } from "@/models/UserTurn";
import { create } from "zustand";
import { useRoundStore } from "./useRoundStore";
import { Card } from "@/models/Card";
import useCard from "@/hooks/useCard";
import { Turn } from "@/models/Turn";

export interface IEngineStore {
  state: {
    tableSits: MatchUser[];
    tableCards: { [key: string]: Card };
    matchUsers: MatchUser[];
  };
  fetchMatchUsers: (matchId: string) => void;
  fetchTableCards: (round: Round) => Promise<void>;
  getMatchUserByUserId: (id: string) => MatchUser;
  fillSits: (me: MatchUser) => void;
  handleBet: (round: Round, me: MatchUser, bet: number) => void;
  setTableCards: (cards: { [playerId: string]: Card }) => void;
  playCard: (me: MatchUser, card: Card) => void;
  finishTurn: (me: MatchUser, turn: Turn, lastTurn: boolean) => void;
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
  playCard: (me, card) => {
    const cards = {
      ...get().state.tableCards,
      [me.user_id]: card,
    };

    set({
      state: {
        ...get().state,
        tableCards: cards,
      },
    });
  },
  fetchTableCards: async (round) => {
    const currentTurn = await useRoundStore
      .getState()
      .fetchCurrentTurn(round.id)!;
    if (!currentTurn) {
      return;
    }
    const { data: tableCards } = await supabase
      .from("user_turn")
      .select("*")
      .eq("turn_id", currentTurn.id!);

    if (tableCards) {
      let cards = get().state.tableCards;
      tableCards.forEach((element: UserTurn) => {
        cards[element.user_id] = useCard().getCard(element.card, round.trump)!;
      });

      set({
        state: {
          ...get().state,
          tableCards: cards,
        },
      });
    }
  },
  finishTurn: async (me, turn, lastTurn) => {
    const matchUsers = get().state.matchUsers;
    const tableCards = get().state.tableCards;

    console.log(tableCards);

    const winner = Object.keys(tableCards).reduce((a, b) =>
      tableCards[a].power > tableCards[b].power ? a : b
    );

    console.log("winner", winner);
    await supabase.from("turns").update({ winner }).eq("id", turn.id);

    const { data: winnerScore } = await supabase
      .from("round_users")
      .select("round_score")
      .eq("user_id", winner)
      .eq("round_id", turn.round_id)
      .single();

    await supabase
      .from("round_users")
      .update({ round_score: winnerScore!.round_score + 1 })
      .eq("user_id", winner)
      .eq("round_id", turn.round_id);

    if (lastTurn) {
      const { data } = await supabase
        .from("round_users")
        .select("user_id, round_score, bet")
        .eq("round_id", turn.round_id);

      const score = data?.map((user) => {
        return {
          user_id: user.user_id,
          score: Math.abs(user.round_score - user.bet!),
        };
      });

      console.log("SCORE", score);

      let calls: PromiseLike<any>[] =
        score?.map((user) => {
          const matchUser = matchUsers.find((u) => u.user_id === user.user_id);

          const lives = matchUser!.lives - user.score;
          return supabase
            .from("match_users")
            .update({ lives, dealer: me.next_user === user.user_id })
            .eq("user_id", user.user_id)
            .eq("match_id", me.match_id)
            .then((data) => {
              console.log("data", data);
            });
        }) || [];

      console.log("start calls");
      await Promise.all(calls);
      console.log("response from all calls");

      await supabase
        .from("rounds")
        .update({ status: "finished" })
        .eq("id", turn.round_id);
    }
  },
}));
