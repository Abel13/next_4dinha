import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Como Jogar — 4dinha",
  description:
    "Aprenda as regras do 4dinha: baralho truco mineiro, rodadas, vidas e fase Índiozinho.",
};

export default function HowToPlayPage() {
  return (
    <main className="min-h-screen bg-[#021223] text-[#2AFAFD]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-8 sm:px-6 lg:px-10">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 pb-6">
          <Link
            href="/"
            className="flex items-center gap-3 transition hover:opacity-80"
          >
            <div
              className="rounded-xl border border-[#2AFAFD44] bg-[#070f2b88] shadow-[0_0_18px_#2AFAFD44]"
              aria-label="Logo 4dinha"
            >
              <Image src={"/logo.png"} alt="logo" width={60} height={60} />
            </div>
            <div>
              <div className="flex gap-0.5">
                <span className="flex -rotate-45 text-xl">4</span>dinha
              </div>
              <p className="text-xs text-[#A2A3AA]">Card game competitivo</p>
            </div>
          </Link>
        </header>

        {/* CONTENT */}
        <div className="flex-1">
          <h1 className="text-3xl font-semibold text-white sm:text-4xl">
            📜 Como Jogar
          </h1>
          <p className="mt-2 text-sm text-[#A2A3AA]">Regras do jogo 4dinha</p>

          <div className="mt-8 space-y-8">
            {/* ESTRUTURA GERAL */}
            <section className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-5">
              <h2 className="text-xl font-semibold text-[#8AFFFF]">
                Estrutura Geral
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A2A3AA]">
                <li>
                  <strong className="text-[#2AFAFD]">Baralho:</strong> truco
                  mineiro, sem 8, 9 e 10.
                </li>
                <li>
                  <strong className="text-[#2AFAFD]">Jogadores:</strong> 6 no
                  modo ranked; em amistoso pode variar.
                </li>
                <li>
                  <strong className="text-[#2AFAFD]">Vidas:</strong> 5 vidas por
                  jogador no início.
                </li>
                <li>
                  <strong className="text-[#2AFAFD]">Dealer:</strong> definido
                  no início e rota em sentido horário a cada rodada.
                </li>
                <li>
                  <strong className="text-[#2AFAFD]">Rodadas:</strong> o número
                  da rodada = número de cartas distribuídas. Exemplo: rodada 1 →
                  1 carta; rodada 2 → 2 cartas; … até o máximo permitido (6 em
                  mesa cheia). Depois o número de cartas diminui novamente até
                  voltar a 1.
                </li>
                <li>
                  <strong className="text-[#2AFAFD]">Ciclo:</strong> continua
                  até restarem apenas 2 jogadores, quando inicia a fase
                  Índiozinho.
                </li>
              </ul>
            </section>

            {/* FASE 1 - RODADAS NORMAIS */}
            <section className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-5">
              <h2 className="text-xl font-semibold text-[#8AFFFF]">
                Fase 1 — Rodadas Normais
              </h2>

              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Rodada 1 (aposta às cegas)
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-[#A2A3AA]">
                    <li>
                      • Cada jogador recebe 1 carta, mas só os oponentes veem
                      sua carta.
                    </li>
                    <li>
                      • Em ordem horária, cada jogador aposta se vai ganhar ou
                      perder a rodada, sem ver a própria carta.
                    </li>
                    <li>
                      • O dealer aposta por último e deve escolher um número que
                      torne impossível a soma das apostas ser igual ao número da
                      rodada.
                    </li>
                    <li>
                      • <strong className="text-[#2AFAFD]">Resolução:</strong> O
                      vencedor da rodada é definido pela hierarquia do truco
                      mineiro. Em caso de cartas iguais, a última carta igual
                      jogada vence.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    Rodadas 2 em diante
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm text-[#A2A3AA]">
                    <li>
                      • Cada jogador recebe cartas iguais ao número da rodada.
                    </li>
                    <li>• Cada um vê suas próprias cartas antes de apostar.</li>
                    <li>
                      • Apostam em quantas vazas (rodadas internas de cartas)
                      irão ganhar.
                    </li>
                    <li>
                      • <strong className="text-[#2AFAFD]">Jogada:</strong>{" "}
                      Primeira vaza inicia o jogador à esquerda do dealer.
                      Vazador seguinte: quem venceu a última vaza. Jogadores
                      escolhem qual carta jogar livremente; não há ordem fixa de
                      descarte das próprias cartas.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PERDA DE VIDAS */}
            <section className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-5">
              <h2 className="text-xl font-semibold text-[#8AFFFF]">
                Perda de Vidas
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A2A3AA]">
                <li>
                  • Após cada rodada, verifica-se o resultado real vs aposta.
                </li>
                <li>
                  •{" "}
                  <strong className="text-[#2AFAFD]">
                    Perda de vidas = diferença entre aposta e resultado.
                  </strong>
                </li>
                <li>• Rodada 1 tem exceção: quem erra perde 1 vida fixa.</li>
              </ul>
            </section>

            {/* FASE 2 - ÍNDIOZINHO */}
            <section className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-5">
              <h2 className="text-xl font-semibold text-[#8AFFFF]">
                Fase 2 — Índiozinho (quando restam 2 jogadores)
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A2A3AA]">
                <li>
                  • Cada rodada do índiozinho distribui 3 cartas por jogador:
                </li>
                <li className="ml-4">- 1 visível para o próprio jogador</li>
                <li className="ml-4">
                  - 1 virada para a mesa (oculta para ambos)
                </li>
                <li className="ml-4">- 1 visível apenas para o oponente</li>
                <li>
                  • Jogadores escolhem qual carta jogar em cada vaza, sem ordem
                  fixa.
                </li>
                <li>
                  • A perda de vidas continua seguindo a diferença entre aposta
                  e resultado.
                </li>
                <li>• O ciclo segue até restar apenas 1 jogador vivo.</li>
              </ul>
            </section>

            {/* HIERARQUIA DE CARTAS */}
            <section className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-5">
              <h2 className="text-xl font-semibold text-[#8AFFFF]">
                Hierarquia de Cartas
              </h2>
              <p className="mt-3 text-sm text-[#A2A3AA]">
                Ordem do truco mineiro sem 8, 9 e 10. Critério de desempate:
                última carta igual jogada vence.
              </p>
            </section>

            {/* CONDIÇÕES ESPECIAIS */}
            <section className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-5">
              <h2 className="text-xl font-semibold text-[#8AFFFF]">
                Condições Especiais
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-[#A2A3AA]">
                <li>• Não existe empate em rodadas completas.</li>
                <li>
                  • O dealer é sempre obrigado a apostar de forma que a soma
                  total de apostas seja diferente do número da rodada.
                </li>
                <li>
                  • Sempre há pelo menos um jogador perdendo vida em cada
                  rodada.
                </li>
              </ul>
            </section>

            {/* VITÓRIA FINAL */}
            <section className="rounded-lg border-2 border-[#2AFAFD44] bg-[#070f2b88] p-5 shadow-[0_0_18px_#2AFAFD22]">
              <h2 className="text-xl font-semibold text-[#8AFFFF]">
                ⚔️ Vitória Final
              </h2>
              <p className="mt-3 text-sm text-[#A2A3AA]">
                Último jogador com vidas restantes vence a partida.
              </p>
            </section>
          </div>
        </div>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-[#2AFAFD22] pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#2AFAFD44] bg-[#070f2b88] px-4 py-2 text-sm font-semibold text-[#2AFAFD] transition hover:bg-[#070f2b]"
          >
            ← Voltar para a página inicial
          </Link>
        </footer>
      </div>
    </main>
  );
}
