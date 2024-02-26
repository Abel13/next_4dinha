import Lobby from "@/components/templates/Lobby";
import { handleUserInLobby } from "./services";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { MatchUser } from "@/models/MatchUser";
import { cookies } from "next/headers";
import { Match } from "@/models/Match";

export default async function Page({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  await handleUserInLobby({ matchId: params.id });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("match_users")
    .select("*")
    .eq("match_id", params.id)
    .returns<MatchUser[]>();

  const { data: match } = await supabase
    .from("matches")
    .select("*")
    .eq("id", params.id)
    .single<Match>();

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="flex flex-col h-full w-full">
        <h1>{`Lobby ${match?.name}`}</h1>
        <Lobby users={data || []} match={match!} userId={user!.id} />
      </div>
    </main>
  );
}
