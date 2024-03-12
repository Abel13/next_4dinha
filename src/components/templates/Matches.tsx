"use client";
import { supabase } from "@/config/supabase";
import { Match } from "@/models/Match";
import { useCallback, useEffect, useState } from "react";
import MatchItem from "../molecules/MatchItem";
import { useRouter } from "next/navigation";

export default function Matches({ matchList }: { matchList: Match[] }) {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>(matchList);
  useEffect(() => {
    const channel = supabase
      .channel("matches_channel")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "matches",
          event: "INSERT",
        },
        (payload) => {
          setMatches([...matches, payload.new as Match]);
        }
      )
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "matches",
          event: "UPDATE",
        },
        (payload) => {
          setMatches(
            matches.map((match) => {
              if (match.id === payload.new.id) {
                return payload.new as Match;
              }
              return match;
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matches]);

  const handleEnter = useCallback(
    (match: Match) => {
      router.replace(`/lobby/${match.id}`);
    },
    [router]
  );

  return (
    <div>
      {matches.map((match) => {
        return (
          <div key={match.id} className="mb-2">
            <MatchItem match={match} onClickEnter={() => handleEnter(match)} />
          </div>
        );
      })}
    </div>
  );
}
