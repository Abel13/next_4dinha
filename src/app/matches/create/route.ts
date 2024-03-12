import { cookies } from "next/headers";
import { format } from "date-fns";
import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export async function POST(req: NextRequest, res: NextResponse) {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("matches")
    .insert({
      name: `Partida de ${user?.email} - ${format(
        new Date(),
        "dd/MM/yyyy HH:mm"
      )}`,
    })
    .select("id")
    .maybeSingle();

  if (error) {
    return Response.json({ result: "ERROR", error });
  }

  return Response.json({ result: "OK", data });
}
