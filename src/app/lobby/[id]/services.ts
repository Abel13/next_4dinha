import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const handleUserInLobby = async ({ matchId }: { matchId: string }) => {
  const supabase = createServerComponentClient({ cookies });
  const { data: user } = await supabase.auth.getUser();

  //check if user is in lobby
  const userInLobby = await supabase
    .from("match_users")
    .select("*")
    .eq("match_id", matchId)
    .select();

  //if user is not in lobby, and lobby is not full, add user to lobby
  if (
    userInLobby.data &&
    userInLobby.data.length < 6 &&
    !userInLobby.data?.find((u) => u.user_id === user?.user?.id)
  ) {
    await supabase.from("match_users").insert([{ match_id: matchId }]);
  }

  return;
};
