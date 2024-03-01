"use client";
import Image from "next/image";
import { Button } from "../atoms/Button";
import { MatchUser } from "@/models/MatchUser";
import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";
import CardItem from "../atoms/Card";
import useCard from "@/hooks/useCard";
import { Card } from "@/models/Card";
import { useEngineStore } from "@/hooks/useEngineStore";
import { useRoundStore } from "@/hooks/useRoundStore";
import Bet from "./Bet";
import { RoundUser } from "@/models/RoundUser";

interface MeProps {
  me?: MatchUser;
}

export default function Me({ me }: MeProps) {
  const {
    getMyCards,
    handleBet,
    state: { matchUsers },
    fillSits,
    fetchMatchUsers,
  } = useEngineStore((store) => store);
  const {
    state: { currentRound, currentPlayer, betCount },
    handleDeal,
    setCurrentPlayer,
    getBetCount,
  } = useRoundStore((store) => store);
  const { getCard } = useCard();
  const [dealer, setDealer] = useState(!!me?.dealer);
  const [live, setLive] = useState(me?.lives || 0);
  const [myCards, setMyCards] = useState<Card[]>([]);
  const [bet, setBet] = useState(0);

  const disabledStyle = (disabled: boolean) =>
    disabled
      ? "flex flex-1 flex-col text-xs items-center"
      : "flex flex-1 flex-col text-xs items-center opacity-20";

  useEffect(() => {
    const channel = supabase
      .channel("me_channel")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "match_users",
          event: "UPDATE",
          filter: `match_id=eq.${me?.match_id}`,
        },
        (payload) => {
          if (me?.user_id === payload.new.user_id) {
            setDealer(payload.new.dealer);
            setLive(payload.new.lives);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "round_users",
          event: "UPDATE",
          filter: `round_id=eq.${currentRound?.id}`,
        },
        (payload) => {
          setCurrentPlayer(payload.new as RoundUser);
          getBetCount(currentRound!);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [
    currentRound,
    currentRound?.id,
    getBetCount,
    getCard,
    me?.match_id,
    me?.user_id,
    myCards,
    setCurrentPlayer,
  ]);

  useEffect(() => {
    if (me && matchUsers.length > 0) {
      fillSits(me);
    }
  }, [matchUsers]); // only match users should call it

  useEffect(() => {
    if (me) {
      fetchMatchUsers(me.match_id);
    }
  }, []);

  if (!me) {
    return (
      <div className="flex rounded">
        <div className="flex w-full flex-col border-t-2 rounded-md items-center p-1">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col border-t-2 rounded-md items-center justify-end p-1">
      <div className="flex h-20 gap-1 justify-around">
        {Array.from(Array(currentRound || 1)).map((_, index) => {
          return <CardItem key={index} card={myCards[index]} />;
        })}
      </div>
      <div className="flex w-full justify-between items-center">
        <div className="flex">
          <div className="flex flex-1 flex-col items-center">
            <Image
              alt="Avatar"
              src={`https://api.dicebear.com/7.x/bottts-neutral/png?seed=${me.user_id}&scale=90`}
              width={50}
              height={50}
              className="rounded border-2"
            />
            {live > 0 && (
              <div className="text-xs">{`${Array.from(Array(live))
                .fill("❤️")
                .join("")}${Array.from(Array(5 - live))
                .fill("🤍")
                .join("")}`}</div>
            )}
          </div>

          <div className="flex w-5 h-5 border rounded bg-green-700 justify-center items-center text-xs">
            <span>{bet}</span>
          </div>
        </div>
        <div className={disabledStyle(dealer)}>
          <span className="text-4xl">💼</span>
          <span>dealer</span>
        </div>
        <div className={disabledStyle(currentPlayer?.user_id === me.user_id)}>
          <div className="text-4xl">🎲</div>
          <span>sua vez</span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          {me?.dealer && !currentRound && (
            <div className="flex flex-1 justify-center items-center">
              <Button
                onClick={async () => {
                  await handleDeal(me);
                }}
              >
                Distribuir Cartas
              </Button>
            </div>
          )}
          {currentPlayer?.user_id === me.user_id && (
            <Bet
              betCount={betCount}
              currentRound={currentRound?.number!}
              checkLimit={me.dealer!}
              handleBet={(bet) => {
                handleBet(currentRound?.id!, me, bet);
                setBet(bet);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
