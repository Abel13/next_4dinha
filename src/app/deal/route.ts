import Cards from "@/hooks/useCard";
import { Card, CardSymbol } from "@/models/Card";
import { RoundUserCard } from "@/models/RoundUserCard";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const roundUsers = await request.json();

  try {
    let shuffledCards = getShuffledCards();

    ({ shuffledCards } = await setTrump(roundUsers, shuffledCards));

    await dealCards(roundUsers, shuffledCards);

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

async function dealCards(roundUsers: any, shuffledCards: Card[]) {
  const supabase = createServerComponentClient({ cookies });

  let userRoundCards: RoundUserCard[] = [];
  roundUsers.forEach(
    (element: { user_id: string; round_id: string; round_number: number }) => {
      // Entregar as cartas para o jogador baseado no numero da rodada
      const cardCount = element.round_number % 6;

      for (let count = 0; count < cardCount; count++) {
        userRoundCards.push({
          card: shuffledCards.shift()!.id,
          round_id: element.round_id,
          user_id: element.user_id,
        } as RoundUserCard);
      }
    }
  );

  await supabase.from("round_user_cards").insert(userRoundCards);
}

async function setTrump(roundUsers: any, shuffledCards: Card[]) {
  const supabase = createServerComponentClient({ cookies });
  const trump = shuffledCards.shift();

  await supabase
    .from("rounds")
    .update({ trump: trump!.id })
    .eq("id", roundUsers[0].round_id);

  return { shuffledCards };
}

function getShuffledCards() {
  return Cards()
    .shuffledCards()
    .filter((card) => card.symbol !== CardSymbol.Eight)
    .filter((card) => card.symbol !== CardSymbol.Nine)
    .filter((card) => card.symbol !== CardSymbol.Ten);
}
