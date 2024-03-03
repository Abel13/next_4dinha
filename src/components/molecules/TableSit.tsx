"use client";
import { useEngineStore } from "@/hooks/useEngineStore";
import { useRoundStore } from "@/hooks/useRoundStore";
import { MatchUser } from "@/models/MatchUser";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function TableSit({ position }: { position: number }) {
  const {
    state: { tableSits },
  } = useEngineStore((store) => store);
  const {
    state: { currentPlayer, playerBets },
  } = useRoundStore((store) => store);
  const [player, setPlayer] = useState<MatchUser | null>(null);

  const disabledStyle = (disabled: boolean) =>
    disabled
      ? "flex flex-1 mr-2 text-sm items-center"
      : "flex flex-1 mr-2 text-sm items-center opacity-20";

  useEffect(() => {
    if (tableSits[position]) setPlayer(tableSits[position]);
  }, [position, tableSits]);

  if (!player)
    return (
      <div className="flex w-14 h-14 border-2 items-end justify-center rounded bg-slate-900"></div>
    );

  return (
    <div className="flex flex-1 flex-col items-center justify-between">
      <div className="flex mb-1">
        <div className={disabledStyle(player.dealer!)}>
          <span>💼</span>
        </div>
        <div
          className={disabledStyle(currentPlayer?.user_id === player.user_id)}
        >
          <div>🎲</div>
        </div>
        {true && (
          <div className="flex w-4 h-4 border rounded bg-green-700 justify-center items-center text-xs">
            <span>{playerBets[player.user_id]}</span>
          </div>
        )}
      </div>
      <Image
        alt="Avatar"
        src={`https://api.dicebear.com/7.x/bottts-neutral/png?seed=${player.user_id}&scale=90`}
        width={50}
        height={50}
        className="rounded border-2"
      />

      {player.lives > 0 && (
        <div className="text-xs">{`${Array.from(Array(player.lives))
          .fill("❤️")
          .join("")}${Array.from(Array(5 - player.lives))
          .fill("🤍")
          .join("")}`}</div>
      )}
    </div>
  );
}
