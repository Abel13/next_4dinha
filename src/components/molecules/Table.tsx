"use client";
import { MatchUser } from "@/models/MatchUser";
import CardItem from "../atoms/Card";
import { useEffect } from "react";
import { supabase } from "@/config/supabase";
import { Round } from "@/models/Round";
import useCard from "@/hooks/useCard";
import { useRoundStore } from "@/hooks/useRoundStore";
import useRoundNumberOne from "@/hooks/useTurn";
import { useEngineStore } from "@/hooks/useEngineStore";

export default function Table({ me }: { me: MatchUser }) {
  const {
    setCurrentRound,
    setCurrentPlayer,
    getBetCount,
    fetchCurrentRound,
    fetchCurrentPlayer,
    state: { currentRound },
  } = useRoundStore((store) => store);

  const {
    state: { tableCards, tableSits },
    fetchTableCards,
  } = useEngineStore((store) => store);

  const { fillFirstRoundCards } = useRoundNumberOne();
  const { getCard } = useCard();

  useEffect(() => {
    if (currentRound?.number === 1 && currentRound.status === "bet") {
      fillFirstRoundCards(currentRound);
    } else if (currentRound?.status === "play") {
      fetchTableCards(currentRound);
    }

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
          if (payload.new.id === 1) {
            fillFirstRoundCards(payload.new as Round);
          }
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
        {tableCards[tableSits[3]?.user_id] ? (
          <CardItem card={tableCards[tableSits[3].user_id]} />
        ) : (
          <div className="flex border border-gray-700 w-14 h-20 rounded items-center justify-center" />
        )}
      </div>
      <div className="flex items-start justify-start">
        <div className="rotate-90 mx-1">
          {tableCards[tableSits[2]?.user_id] ? (
            <CardItem card={tableCards[tableSits[2].user_id]} />
          ) : (
            <div className="flex border border-gray-700 w-14 h-20 rounded items-center justify-center" />
          )}
        </div>
      </div>
      <div className="border rounded-lg flex bg-slate-800 border-slate-600 row-span-2">
        <div className="flex flex-1 items-center justify-center">
          {currentRound?.trump ? (
            <CardItem card={getCard(currentRound.trump)} />
          ) : (
            <div className="flex border border-gray-700 w-14 h-20 rounded items-center justify-center" />
          )}
        </div>
      </div>
      <div className="flex items-start justify-end">
        <div className="-rotate-90 mx-1">
          {tableCards[tableSits[4]?.user_id] ? (
            <CardItem card={tableCards[tableSits[4].user_id]} />
          ) : (
            <div className="flex border border-gray-700 w-14 h-20 rounded items-center justify-center" />
          )}
        </div>
      </div>
      <div className="flex items-end justify-start">
        <div className="rotate-90 mx-1">
          {tableCards[tableSits[1]?.user_id] ? (
            <CardItem card={tableCards[tableSits[1].user_id]} />
          ) : (
            <div className="flex border border-gray-700 w-14 h-20 rounded items-center justify-center" />
          )}
        </div>
      </div>

      <div className="flex items-end justify-end">
        <div className="-rotate-90 mx-1 ">
          {tableCards[tableSits[5]?.user_id] ? (
            <CardItem card={tableCards[tableSits[5].user_id]} />
          ) : (
            <div className="flex border border-gray-700 w-14 h-20 rounded items-center justify-center" />
          )}
        </div>
      </div>
      <div />
      <div className="flex items-end justify-center">
        {tableCards[tableSits[0]?.user_id]?.id !== 0 ? (
          <CardItem
            card={tableCards[tableSits[0]?.user_id]}
            highlight={
              currentRound?.number === 1 && currentRound.status === "play"
            }
          />
        ) : (
          <div className="flex border border-gray-700 w-14 h-20 rounded items-center justify-center" />
        )}
      </div>
      <div />
    </div>
  );
}
