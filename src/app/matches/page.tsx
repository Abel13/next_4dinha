import Matches from "@/components/templates/Matches";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Match } from "@/models/Match";
import CreateMatch from "@/components/molecules/CreateMatch";

export default async function ServerMatches() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data } = await supabase
    .from("matches")
    .select("*")
    .eq("status", "created")
    .returns<Match[]>();

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

      <div className="flex flex-col w-full md:w-80">
        <div className="flex items-end mb-3">
          <Image
            alt="Avatar"
            src={`https://api.dicebear.com/7.x/bottts-neutral/png?seed=${user?.id}&scale=90`}
            width={50}
            height={50}
            className="rounded mr-2"
          />
          <span className="text-gray-400 text-sm">{user?.email}</span>
        </div>
        <CreateMatch />
        <Matches matchList={data || []} />
      </div>
    </main>
  );
}
