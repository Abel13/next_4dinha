"use client";

import { supabase } from "@/config/supabase";
import { MatchUser } from "@/models/MatchUser";
import { useCallback, useEffect, useMemo, useState } from "react";
import LobbyItem from "../molecules/LobbyItem";
import { Button } from "../atoms/Button";
import { Match } from "@/models/Match";
import { useRouter } from "next/navigation";
import { useEngineStore } from "@/hooks/useEngineStore";

export default function Lobby({
  userId,
  users,
  match,
}: {
  userId: string;
  users: MatchUser[];
  match: Match;
}) {
  const router = useRouter();
  const [lobby, setLobby] = useState<MatchUser[]>(users);
  const [message, setMessage] = useState("");
  const isOwner = match.user_id === userId;

  const disableReady = useMemo(() => {
    if (lobby.length < 3) return true;
    else return false;
  }, [lobby]);

  const showStart = useMemo(() => {
    return lobby.every((user) => user.ready);
  }, [lobby]);

  const setNextPlayer = useCallback(async () => {
    const orderByCreatedAt = lobby.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
    const userIndex = orderByCreatedAt.findIndex(
      (user) => user.user_id === userId
    );
    const nextUser = orderByCreatedAt[userIndex + 1] || orderByCreatedAt[0];
    if (isOwner) {
      await supabase
        .from("match_users")
        .update({ dealer: true, next_user: nextUser.user_id })
        .eq("user_id", userId);
    } else {
      await supabase
        .from("match_users")
        .update({ next_user: nextUser.user_id })
        .eq("user_id", userId);
    }

    router.replace(`/matches/${match.id}`);
  }, [isOwner, lobby, match.id, router, userId]);

  const startMatch = useCallback(async () => {
    await supabase
      .from("matches")
      .update({ status: "started" })
      .eq("id", match.id);
  }, [match.id]);

  const handleReady = useCallback(async () => {
    await supabase
      .from("match_users")
      .update({ ready: true })
      .eq("match_id", match.id)
      .eq("user_id", userId)
      .select("ready")
      .single();
  }, [match.id, userId]);

  useEffect(() => {
    const channel = supabase
      .channel("lobby_channel")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "matches",
          event: "UPDATE",
          filter: `id=eq.${match.id}`,
        },
        (payload) => {
          if (payload.new.status === "started") {
            setNextPlayer();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "match_users",
          event: "INSERT",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          setLobby([...lobby, payload.new as MatchUser]);
        }
      )
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "match_users",
          event: "UPDATE",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          setLobby(
            lobby.map((user) => {
              if (user.user_id === payload.new.user_id) {
                return payload.new as MatchUser;
              }
              return user;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lobby, match.id, router, setNextPlayer, startMatch]);

  useEffect(() => {
    if (lobby.length >= 6) {
      setMessage("Lobby cheio");
    }
  }, []);

  if (message) {
    return (
      <div className="flex flex-col mt-4 h-full">
        <div>{message}</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col mt-4 h-full">
      {lobby.map((user) => {
        return (
          <div className="my-2" key={user.user_id}>
            <LobbyItem user={user} ready={user.ready} />
          </div>
        );
      })}
      <div className="absolute bottom-4 right-0 left-0 z-10">
        {isOwner && showStart ? (
          <div className="flex w-full p-2 justify-end">
            <Button onClick={startMatch} disabled={disableReady}>
              Iniciar Partida
            </Button>
          </div>
        ) : (
          <div className="flex w-full p-2 justify-end">
            <Button onClick={handleReady} disabled={disableReady}>
              Pronto
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
