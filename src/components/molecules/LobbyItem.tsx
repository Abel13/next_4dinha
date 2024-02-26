import { MatchUser } from "@/models/MatchUser";
import Image from "next/image";

export default function LobbyItem({
  user,
  ready,
}: {
  user: MatchUser;
  ready: boolean;
}) {
  return (
    <div className="flex justify-between items-center border rounded p-1 opacity-95 bg-slate-200">
      <Image
        alt="Avatar"
        src={`https://api.dicebear.com/7.x/bottts-neutral/png?seed=${user.user_id}&scale=90`}
        width={50}
        height={50}
        className="rounded"
      />

      <span className="text-xl">{ready ? "✅" : "⏳"}</span>
    </div>
  );
}
