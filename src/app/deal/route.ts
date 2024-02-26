import Cards from "@/hooks/useCard";
import { CardPower, CardSymbol } from "@/models/Card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const roundUsers = await request.json();

  try {
    let shuffledCards = Cards()
      .shuffledCards()
      .filter((card) => card.symbol !== CardSymbol.Eight)
      .filter((card) => card.symbol !== CardSymbol.Nine)
      .filter((card) => card.symbol !== CardSymbol.Ten);

    const trump = shuffledCards.shift();

    const trumpSymbol = trump!.symbol;
    const sequenceSymbol = getSequenceSymbol(trumpSymbol);
    shuffledCards = shuffledCards.map((card) => {
      if (card.symbol === sequenceSymbol) {
        return { ...card, isTrump: true, power: CardPower.Trump };
      }
      return card;
    });

    let userRoundCards: { round_id: string; user_id: string; card: number }[] =
      [];
    roundUsers.forEach(
      (element: {
        user_id: string;
        round_id: string;
        round_number: number;
      }) => {
        // Entregar as cartas para o jogador baseado no numero da rodada
        const cardCount = element.round_number % 6;

        for (let count = 0; count < cardCount; count++) {
          userRoundCards.push({
            card: shuffledCards.shift()!.id,
            round_id: element.round_id,
            user_id: element.user_id,
          });
        }
      }
    );

    await supabase.from("round_user_cards").insert(userRoundCards);

    await supabase
      .from("rounds")
      .update({ trump: trump!.id })
      .eq("id", roundUsers[0].round_id);

    await supabase
      .from("round_users")
      .update({ current: true })
      .eq("round_id", roundUsers[0].round_id)
      .eq("user_id", roundUsers[0].user_id);

    return Response.json({ result: "OK" });
  } catch (error: any) {
    // Return an error response if something goes wrong
    return Response.json({ error: error.message }, { status: 500 });
  }
}
function getSequenceSymbol(trumpSymbol: CardSymbol) {
  const keys = Object.keys(CardSymbol) as (keyof typeof CardSymbol)[];
  const values = keys.map((key) => CardSymbol[key]);
  const currentIndex = values.indexOf(trumpSymbol);
  const proximoIndex = (currentIndex + 1) % values.length;
  const sequenceSymbol = values[proximoIndex];
  return sequenceSymbol;
}
