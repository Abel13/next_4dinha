import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { format } from "date-fns";

export async function POST(req: Request, res: Response) {
  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("matches")
    .insert({
      name: `Nova Partida - ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
      user_id: user?.aud,
    })
    .select("id")
    .maybeSingle();

  return Response.json({ result: "OK", data });
}
