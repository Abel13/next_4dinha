"use client";
import { supabase } from "@/config/supabase";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [progress, setProgress] = useState("0%");

  const updateProgress = useCallback(async () => {
    const { data, error } = await supabase
      .from("match_users")
      .select("*")
      .eq("match_id", params.id);

    if (data) {
      console.log(data);
      const progress =
        (data?.filter((user) => user.next_user).length / data?.length) * 100;

      setProgress(`${progress.toFixed(0)}%`);
    }
  }, [params.id]);

  useEffect(() => {
    console.log(progress);
    if (progress === "100%") {
      router.replace(`/matches/${params.id}`);
    }
  }, [progress]);

  useEffect(() => {
    const channel = supabase
      .channel("lobby_channel")
      .on(
        "postgres_changes",
        {
          schema: "public",
          table: "match_users",
          event: "UPDATE",
          filter: `id=eq.${params.id}`,
        },
        (payload) => {
          updateProgress();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [params.id, updateProgress]);

  useEffect(() => {
    updateProgress();
  }, []);

  return (
    <div className="w-full h-full justify-center items-center">
      <span>{progress}</span>
    </div>
  );
}
