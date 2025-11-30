// app/page.tsx (ou app/landing/page.tsx)

import { DevicePreview } from "@/components/DevicePreview";
import { StoreButton } from "@/components/StoreButton";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const PLAY_STORE_URL = process.env.NEXT_PUBLIC_4DINHA_PLAY_STORE_URL ?? "#";
const APP_STORE_URL = process.env.NEXT_PUBLIC_4DINHA_APP_STORE_URL ?? "#";
const HAS_PLAY_STORE = PLAY_STORE_URL !== "#";
const HAS_APP_STORE = APP_STORE_URL !== "#";

export const metadata: Metadata = {
  title: "4dinha – Card game ranqueado para mobile",
  description:
    "4dinha é um jogo de cartas competitivo, com sistema de ranking, ligas e partidas não ranqueadas. Jogue no seu dispositivo móvel.",
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#021223] text-[#2AFAFD]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-10 sm:px-6 lg:px-10">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3">
            <div
              className="rounded-xl border border-[#2AFAFD44] bg-[#070f2b88] shadow-[0_0_18px_#2AFAFD44]"
              aria-label="Logo 4dinha"
            >
              <span className="text-lg font-bold tracking-tight">
                <Image src={"/logo.png"} alt="logo" width={100} height={100} />
              </span>
            </div>
            <div>
              <div className="flex gap-0.5">
                <span className="flex -rotate-45 text-2xl">4</span>dinha
                <p className="text-lg font-medium uppercase tracking-[0.3em] text-[#8AFFFF]"></p>
              </div>
              <p className="text-xs text-[#A2A3AA]">Card game competitivo</p>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/how-to-play"
              className="rounded-full border border-[#2AFAFD44] bg-[#070f2b88] px-3 py-1 text-xs text-[#A2A3AA] transition hover:border-[#2AFAFD] hover:text-[#2AFAFD]"
            >
              Como Jogar
            </Link>
            <span className="rounded-full border border-[#2AFAFD44] bg-[#070f2b88] px-3 py-1 text-xs text-[#A2A3AA]">
              Mobile only
            </span>
          </div>
        </header>

        {/* HERO */}
        <section className="grid flex-1 gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-center">
          {/* HERO TEXT */}
          <div>
            <div className="inline-block rounded-full border border-[#2AFAFD44] bg-[#070f2b88] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8AFFFF]">
              Jogo de cartas
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#2AFAFD] sm:text-5xl lg:text-6xl">
              F*dinha:
              <span className="block text-[1.05em] text-white">
                nostalgia e muita treta.
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#A2A3AA] sm:text-base">
              Diretamente das trincheiras das universidades e rodas de amigos, o
              f*dinha também conhecido como f*lho da p*ta, é um jogo de blefe e
              estratégia onde os jogadores precisam acertar quantas rodadas cada
              um vai ganhar, quem errar perde vida.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-3">
                {HAS_PLAY_STORE && (
                  <StoreButton
                    url={PLAY_STORE_URL}
                    platform="android"
                    variant="large"
                  />
                )}

                {HAS_APP_STORE && (
                  <StoreButton
                    url={APP_STORE_URL}
                    platform="ios"
                    variant="large"
                  />
                )}

                <Link
                  href="/how-to-play"
                  className="inline-flex items-center justify-center rounded-xl border border-[#2AFAFD44] bg-[#070f2b88] px-4 py-2 text-sm font-semibold text-[#2AFAFD] shadow-[0_0_18px_#2AFAFD22] transition hover:-translate-y-px hover:border-[#2AFAFD] hover:bg-[#070f2b]"
                >
                  Como Jogar
                </Link>
              </div>

              <p className="text-xs text-[#9BA1A6] sm:ml-3">
                Disponível apenas em dispositivos móveis.
              </p>
            </div>

            {/* HIGHLIGHTS */}
            <div className="mt-8 grid gap-4 text-xs text-[#A2A3AA] sm:grid-cols-3">
              <div className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8AFFFF]">
                  Partidas normais
                </p>
                <p className="mt-1">
                  Entre em uma partida aberta ou crie uma nova. Ideal para jogar
                  no intervalo ou no busão.
                </p>
              </div>
              <div className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8AFFFF]">
                  Sistema ranqueado
                </p>
                <p className="mt-1">
                  Ligas, tiers e pontuação inspirados em jogos competitivos
                  modernos. Só sobe quem joga bem.
                </p>
              </div>
              <div className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] px-3 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8AFFFF]">
                  Indiozinho
                </p>
                <p className="mt-1">
                  partida 1x1 de 3 cartas onde você vê uma carta sua, uma do seu
                  oponente e uma virada para a mesa.
                </p>
              </div>
            </div>
          </div>
          <DevicePreview />
        </section>

        {/* FEATURES / RANQUEADO */}
        <section className="mt-12 border-t border-[#2AFAFD22] pt-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:items-start">
            <div>
              <h2 className="text-xl font-semibold text-white sm:text-2xl">
                Sistema ranqueado pensado para competição.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#A2A3AA]">
                Toda partida em 4dinha importa. O sistema de ranking é inspirado
                em jogos competitivos modernos: tiers, ligas, pontuação e reset
                de temporada para todo mundo começar do mesmo ponto.
              </p>

              <div className="mt-6 grid gap-4 text-sm text-[#A2A3AA] sm:grid-cols-2">
                <div className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8AFFFF]">
                    Tiers & Ligas
                  </p>
                  <p className="mt-2">
                    Progresso baseado em desempenho: suba de liga vencendo
                    partidas, caia se perder muitas seguidas.
                  </p>
                </div>
                <div className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8AFFFF]">
                    Temporadas
                  </p>
                  <p className="mt-2">
                    Temporadas com reset de ranking, recompensas visuais e novas
                    metas para perseguir.
                  </p>
                </div>
                <div className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8AFFFF]">
                    Foco em fair play
                  </p>
                  <p className="mt-2">
                    Mecânicas pensadas para reduzir trapaças e incentivar o jogo
                    limpo entre amigos ou desconhecidos.
                  </p>
                </div>
              </div>
            </div>

            {/* INFO MOBILE ONLY / BAIXAR */}
            <div className="rounded-2xl border border-[#2AFAFD33] bg-[#070f2b88] p-5 shadow-[0_0_32px_#000000CC]">
              <h3 className="text-sm font-semibold text-white">
                Como começar a jogar?
              </h3>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs text-[#A2A3AA] sm:text-sm">
                <li>Abra esta página pelo seu celular, ou escaneie o QR.</li>
                <li>Toque no botão da loja (Android ou iOS).</li>
                <li>Instale o 4dinha e crie sua conta.</li>
                <li>Entre na mesa, desafie seus amigos e suba no ranking.</li>
              </ol>

              <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {HAS_PLAY_STORE && (
                    <StoreButton
                      url={PLAY_STORE_URL}
                      platform="android"
                      variant="small"
                    />
                  )}
                  {HAS_APP_STORE && (
                    <StoreButton
                      url={APP_STORE_URL}
                      platform="ios"
                      variant="small"
                    />
                  )}
                </div>

                <div className="text-[10px] text-[#9BA1A6]">
                  <p>Disponível apenas em dispositivos móveis.</p>
                </div>
              </div>

              {!HAS_PLAY_STORE && !HAS_APP_STORE && (
                <p className="mt-4 rounded-md border border-[#ef5350] bg-[#1a4e89EE]/10 px-3 py-2 text-xs text-[#ef5350]">
                  Configure as variáveis{" "}
                  <code className="font-mono">
                    NEXT_PUBLIC_4DINHA_PLAY_STORE_URL
                  </code>{" "}
                  e{" "}
                  <code className="font-mono">
                    NEXT_PUBLIC_4DINHA_APP_STORE_URL
                  </code>{" "}
                  para ativar os botões de download.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-[#2AFAFD22] pt-4 text-[10px] text-[#9BA1A6] sm:text-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} 4dinha. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/how-to-play"
                className="hover:text-[#2AFAFD] hover:underline hover:underline-offset-2"
              >
                Como Jogar
              </Link>
              <span className="text-[#4c4b6e]">•</span>
              <a
                href="/privacy-policy"
                className="hover:text-[#2AFAFD] hover:underline hover:underline-offset-2"
              >
                Política de Privacidade
              </a>
              <span className="text-[#4c4b6e]">•</span>
              <span className="text-[#9BA1A6]">
                Feito para quem leva o baralho a sério.
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
