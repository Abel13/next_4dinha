import { supabase } from "@/config/supabase";
import { MatchUser } from "@/models/MatchUser";
import { Round } from "@/models/Round";

import { RoundUser } from "@/models/RoundUser";
import { create } from "zustand";
import { useEngineStore } from "./useEngineStore";
import { RoundUserCard } from "@/models/RoundUserCard";
import { Turn } from "@/models/Turn";
import { UserTurn } from "@/models/UserTurn";
import { Card } from "@/models/Card";

interface IRoundStore {
  state: {
    currentRound: Round | null;
    currentPlayer: RoundUser | null;
    currentTurn: Turn | null;
    playerBets: { [key: string]: number };
    betCount: number;
    myCards: RoundUserCard[];
  };
  createRoundUsers: (round: Round, referencePlayerId: string) => Promise<void>;
  getMyCards: (currentRound: Round, me: MatchUser) => Promise<void>;
  handleDeal: (referencePlayer: MatchUser) => void;
  handlePlay: (me: MatchUser, card: Card) => Promise<void>;
  fetchCurrentRound: (matchId: string) => void;
  fetchCurrentPlayer: () => void;
  fetchCurrentTurn: (roundId: string) => Promise<void>;
  setCurrentPlayer: (currentPlayer: RoundUser) => void;
  setCurrentRound: (currentRound: Round | null) => void;
  getBetCount: (round: Round) => void;
  createTurn: () => Promise<void>;
}

export const useRoundStore = create<IRoundStore>((set, get) => ({
  state: {
    currentPlayer: null,
    currentRound: null,
    currentTurn: null,
    betCount: 0,
    playerBets: {},
    myCards: [],
  },

  getMyCards: async (currentRound, me) => {
    let cards: RoundUserCard[];
    if (currentRound.number === 1) {
      cards = [
        {
          card: 0,
          id: "",
          created_at: "",
          round_id: currentRound.id,
          user_id: me.user_id,
        },
      ];
    } else {
      const { data, error } = await supabase
        .from("round_user_cards")
        .select("*")
        .eq("round_id", currentRound.id)
        .eq("user_id", me.user_id);

      if (data) {
        cards = data;
      }
    }

    set(() => ({
      state: {
        ...get().state,
        myCards: cards,
      },
    }));
  },
  getBetCount: async (round: Round) => {
    if (round) {
      const { data: roundUsers, error } = await supabase
        .from("round_users")
        .select("*")
        .eq("round_id", round.id);

      if (roundUsers) {
        set(() => ({
          state: {
            ...get().state,
            betCount: roundUsers.reduce(
              (acc, user) => acc + (user.bet || 0),
              0
            ),
            playerBets: roundUsers.reduce(
              (acc, user) => ({
                ...acc,
                [user.user_id]: user.bet,
              }),
              {}
            ),
          },
        }));
      }
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

    try {
      const resposta = await fetch("/deal", {
        method: "POST",
        body: JSON.stringify(roundUsers),
      });
      const data = await resposta.json();
      get().fetchCurrentRound(round.match_id);
    } catch (error) {}
  },
  handleDeal: async (referencePlayer: MatchUser) => {
    const { data: rounds } = await supabase
      .from("rounds")
      .select("*")
      .eq("match_id", referencePlayer.match_id)
      .order("created_at", { ascending: false });

    const roundNumber = (rounds?.length || 0) + 1;

    if (rounds?.every((round) => round.status === "finished")) {
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
      const currentRound =
        rounds?.find((round) => round.status !== "finished") || null;
      get().setCurrentRound(currentRound);
    }
  },
  fetchCurrentRound: async (matchId: string) => {
    const { data: round, error } = await supabase
      .from("rounds")
      .select("*")
      .eq("match_id", matchId)
      .neq("status", "finished")
      .single();

    if (round) {
      get().setCurrentRound(round);
      get().fetchCurrentPlayer();
    }
  },
  fetchCurrentPlayer: async () => {
    const roundId = get().state.currentRound?.id;
    if (roundId) {
      const { data: roundUser } = await supabase
        .from("round_users")
        .select("*")
        .eq("current", true)
        .eq("round_id", roundId)
        .single();

      if (roundUser) {
        get().setCurrentPlayer(roundUser);
      }
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
  createTurn: async () => {
    const round = get().state.currentRound;

    if (round) {
      const { data: currentNumber } = await supabase
        .from("turns")
        .select("number")
        .eq("round_id", round.id)
        .order("number", { ascending: false })
        .limit(1)
        .maybeSingle();

      const number: number = (currentNumber && currentNumber?.number + 1) || 1;

      await supabase
        .from("rounds")
        .update({ status: "play" })
        .eq("id", round.id);
      get().fetchCurrentRound(round.match_id);

      const { data: turn } = await supabase
        .from("turns")
        .insert({
          round_id: round.id,
          number,
        })
        .select("id")
        .maybeSingle();

      if (turn) {
        const currentTurn = {
          id: turn.id,
          number,
          round_id: round.id,
        } as Turn;

        console.log(currentTurn);
        set(() => ({
          state: {
            ...get().state,
            currentTurn,
          },
        }));
      }
    }
  },
  fetchCurrentTurn: async (roundId) => {
    const { data: turn } = await supabase
      .from("turns")
      .select("*")
      .eq("round_id", roundId)
      .order("number", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (turn) {
      set(() => ({
        state: {
          ...get().state,
          currentTurn: turn,
        },
      }));
    }
  },
  handlePlay: async (me, card) => {
    let cardId = card.id;
    console.log(cardId);

    if (cardId === 0) {
      const { data: firstCard } = await supabase
        .from("round_user_cards")
        .select("card")
        .eq("round_id", get().state.currentRound?.id!)
        .eq("user_id", me.user_id)
        .single();

      console.log(firstCard);
      if (firstCard) cardId = firstCard?.card;
    }

    const userTurn: UserTurn = {
      card: cardId,
      turn_id: get().state.currentTurn?.id!,
      user_id: me.user_id,
    } as UserTurn;
    console.log(userTurn);
    // await supabase.from("user_turn").insert(userTurn);

    // const nextPlayer = useEngineStore
    //   .getState()
    //   .getMatchUserByUserId(me.next_user!);

    // await supabase
    //   .from("round_users")
    //   .update({
    //     current: true,
    //   })
    //   .eq("round_id", round.id)
    //   .eq("user_id", nextPlayer.user_id);

    // await supabase
    //   .from("round_users")
    //   .update({
    //     current: false,
    //   })
    //   .eq("round_id", round.id)
    //   .eq("user_id", me.user_id);

    useRoundStore.getState().fetchCurrentPlayer();
  },
}));
