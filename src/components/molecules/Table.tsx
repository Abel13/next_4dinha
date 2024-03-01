"use client";
import { MatchUser } from "@/models/MatchUser";
import CardItem from "../atoms/Card";
import { useEffect } from "react";
import { supabase } from "@/config/supabase";
import { Round } from "@/models/Round";
import useCard from "@/hooks/useCard";
import { useRoundStore } from "@/hooks/useRoundStore";
import useTurn from "@/hooks/useTurn";

export default function Table({ me }: { me: MatchUser }) {
  const {
    setCurrentRound,
    setCurrentPlayer,
    getBetCount,
    fetchCurrentRound,
    fetchCurrentPlayer,
    state: { currentRound },
  } = useRoundStore((store) => store);

  const { fillFirstRoundCards, tableCards } = useTurn();
  const { getCard } = useCard();

  useEffect(() => {
    if (currentRound?.number === 1) fillFirstRoundCards(currentRound.id);
    fetchCurrentPlayer();
    getBetCount(currentRound!);
  }, [currentRound]);

  useEffect(() => {
    const channel = supabase
      .channel("round_channel")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "rounds",
          event: "UPDATE",
          filter: `match_id=eq.${me.match_id}`,
        },
        (payload) => {
          setCurrentRound(payload.new as Round);
          if (payload.new.id === 1) fillFirstRoundCards(payload.new.id);
          fetchCurrentPlayer();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    fetchCurrentPlayer,
    fillFirstRoundCards,
    getCard,
    me.match_id,
    setCurrentRound,
  ]);

  useEffect(() => {
    fetchCurrentRound(me.match_id);
    fetchCurrentPlayer();
  }, []);

  return (
    <div className="col-span-3 grid grid-cols-3 grid-rows-4 w-full h-full row-span-3 bg-stone-800 rounded-full border-2 border-stone-500">
      <div className="flex flex-1 rotate-180 justify-center items-end col-span-3">
        <CardItem card={tableCards[3] && getCard(tableCards[3].card)} />
      </div>
      <div className="flex items-start justify-start">
        <div className="rotate-90 mx-1">
          <CardItem card={tableCards[2] && getCard(tableCards[2]?.card)} />
        </div>
      </div>
      <div className="border rounded-lg flex bg-slate-800 border-slate-600 row-span-2">
        <div className="flex flex-1 items-center justify-center">
          <CardItem
            card={currentRound?.trump ? getCard(currentRound.trump) : undefined}
          />
        </div>
      </div>
      <div className="flex items-start justify-end">
        <div className="-rotate-90 mx-1">
          <CardItem card={tableCards[4] && getCard(tableCards[4]?.card)} />
        </div>
      </div>
      <div className="flex items-end justify-start">
        <div className="rotate-90 mx-1">
          <CardItem card={tableCards[1] && getCard(tableCards[1]?.card)} />
        </div>
      </div>

      <div className="flex items-end justify-end">
        <div className="-rotate-90 mx-1">
          <CardItem card={tableCards[5] && getCard(tableCards[5]?.card)} />
        </div>
      </div>
      <div />
      <div className="flex items-end justify-center">
        <div className="">
          <CardItem
            card={tableCards[0] && getCard(tableCards[0]?.card)}
            turnDown={currentRound?.number === 1}
          />
        </div>
      </div>
      <div />
    </div>
  );
}
