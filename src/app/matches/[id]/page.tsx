import Table from "@/components/molecules/Table";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { cookies } from "next/headers";
import Me from "@/components/molecules/Me";
import { MatchUser } from "@/models/MatchUser";
import TableSit from "@/components/molecules/TableSit";

export default async function GamePage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: me, error } = await supabase
    .from("match_users")
    .select("*")
    .eq("match_id", params.id)
    .eq("user_id", user?.id)
    .maybeSingle<MatchUser>();

  if (!me) {
    return <div>Usuário não encontrado</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex my-2 items-end justify-center">
        <TableSit position={3} />
      </div>
      <div className="flex flex-1 ">
        <div className="grid grid-cols-5 grid-rows-3">
          <div className="flex-col m-2 z-10">
            <div className="flex h-full items-end justify-end">
              <TableSit position={2} />
            </div>
          </div>
          <Table me={me} />
          <div className="flex-col m-2 z-10">
            <div className="flex h-full items-end justify-start">
              <TableSit position={4} />
            </div>
          </div>
          <div />
          <div />
          <div className="flex-col m-2 z-10">
            <div className="flex justify-end">
              <TableSit position={1} />
            </div>
          </div>
          <div className="flex-col m-2 z-10">
            <div className="flex justify-start">
              <TableSit position={5} />
            </div>
          </div>
        </div>
      </div>
      <Me me={me!} />
    </main>
  );
}
