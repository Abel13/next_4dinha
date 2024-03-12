import Table from "@/components/molecules/Table";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Me from "@/components/molecules/Me";
import { MatchUser } from "@/models/MatchUser";
import TableSit from "@/components/molecules/TableSit";
import Image from "next/image";
import logo from "@/assets/logo.png";

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
    return (
      <main className="flex min-h-screen flex-col items-center p-4">
        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
          <Image
            className="relative"
            src={logo}
            alt="4dinha Logo"
            width={180}
            height={180}
            priority
          />
        </div>
        <h1 className="text-xs font-bold text-center">
          Falha ao carregar a partida.
        </h1>
      </main>
    );
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
