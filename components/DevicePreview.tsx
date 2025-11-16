// components/DevicePreview.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Screenshot = {
  src: string;
  alt: string;
  label?: string;
};

const SCREENSHOTS: Screenshot[] = [
  {
    src: "/screenshots/4dinha-1.png",
    alt: "Tela de partida ranqueada do 4dinha",
    label: "Partida ranqueada",
  },
  {
    src: "/screenshots/4dinha-2.png",
    alt: "Tela de seleção de mesa no 4dinha",
    label: "Salas e mesas",
  },
  {
    src: "/screenshots/4dinha-3.png",
    alt: "Tela de ranking e ligas do 4dinha",
    label: "Ranking e ligas",
  },
];

const AUTOPLAY_INTERVAL_MS = 7000;

export function DevicePreview() {
  const [activeIndex, setActiveIndex] = useState(0);

  const hasMultiple = SCREENSHOTS.length > 1;
  const current = SCREENSHOTS[activeIndex];

  function goTo(index: number) {
    if (!hasMultiple) return;
    setActiveIndex((index + SCREENSHOTS.length) % SCREENSHOTS.length);
  }

  function next() {
    goTo(activeIndex + 1);
  }

  function previous() {
    goTo(activeIndex - 1);
  }

  useEffect(() => {
    if (!hasMultiple) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SCREENSHOTS.length);
    }, AUTOPLAY_INTERVAL_MS);

    return () => clearInterval(id);
  }, [hasMultiple]);

  return (
    <div className="relative mt-6 md:mt-0">
      {/* Glow de fundo */}
      <div className="pointer-events-none absolute -inset-10 -z-10 opacity-70 blur-3xl">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_#2AFAFD44,_transparent_60%),radial-gradient(circle_at_bottom,_#FF4C4C33,_transparent_60%)]" />
      </div>

      <div className="mx-auto flex max-w-md flex-col items-center md:max-w-lg">
        {/* Moldura tipo “device” em horizontal */}
        <div className="relative aspect-[18/10] w-full rounded-[2rem] border border-[#A2A3AA] bg-[#070f2b88] p-2 shadow-[0_0_40px_#000000CC]">
          {/* “Notch” / detalhe lateral */}
          {/* <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 rounded-full bg-[#A2A3AA33] px-8 py-1 text-[9px] text-[#A2A3AA]">
            Landscape • Mobile
          </div> */}

          <div className="mt-3 flex h-[calc(100%-16px)] flex-row overflow-hidden rounded-[1.6rem] border border-[#2AFAFD22] bg-[#021223]">
            {/* HUD lateral (esquerda) */}
            {/* <div className="flex w-24 flex-col justify-between border-r border-[#2AFAFD22] bg-[#070f2b88] px-3 py-3 text-[10px] text-[#A2A3AA]">
              <div className="space-y-2">
                <span className="inline-block rounded-full bg-[#021223] px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-[#8AFFFF]">
                  Liga: Ouro II
                </span>
                <div className="space-y-1">
                  <p className="font-mono text-[#2AFAFD]">+24 PDL</p>
                  <p className="text-[9px] text-[#A2A3AA]">
                    Temporada 01 • Beta
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-[9px]">
                <p className="font-semibold text-[#8AFFFF]">Status</p>
                <p>Rodada 3 / 8</p>
                <p className="font-mono text-[#2AFAFD]">Jogando...</p>
              </div>
            </div> */}

            {/* ÁREA PRINCIPAL: CARROSSEL */}
            {/* <div className="relative flex flex-1 flex-col px-3 py-3"> */}
            <div className="relative flex-1 overflow-hidden rounded-2xl border border-[#2AFAFD33] bg-black">
              {/* Screenshot atual (ideal: prints em 16:9) */}
              <div className="relative h-full w-full">
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="(max-width: 768px) 320px, 480px"
                  className="object-center"
                  priority
                />
              </div>

              {/* Overlay sutil */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#2AFAFD11,_transparent_60%),linear-gradient(to_top,_rgba(0,0,0,0.5)_0%,transparent_40%)]" />

              {/* Controles do carrossel */}
              {hasMultiple && (
                <>
                  <button
                    type="button"
                    onClick={previous}
                    className="group absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#2AFAFD55] bg-[#021223DD] text-sm text-[#2AFAFD] shadow-[0_0_12px_#000000EE] transition hover:scale-105 hover:bg-[#2AFAFD22]"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="group absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#2AFAFD55] bg-[#021223DD] text-sm text-[#2AFAFD] shadow-[0_0_12px_#000000EE] transition hover:scale-105 hover:bg-[#2AFAFD22]"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Dots */}
              {hasMultiple && (
                <div className="absolute bottom-2 left-0 right-0 z-10 flex items-center justify-center gap-2">
                  {SCREENSHOTS.map((_, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => goTo(index)}
                        className={`h-2 w-2 rounded-full transition ${
                          isActive
                            ? "w-4 bg-[#2AFAFD] shadow-[0_0_10px_#2AFAFD88]"
                            : "bg-[#A2A3AA55] hover:bg-[#2AFAFD88]"
                        }`}
                        aria-label={`Ir para screenshot ${index + 1}`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
            {/* </div> */}
          </div>
          {/* Label da tela atual */}
        </div>
        {current.label && (
          <p className="mt-2 text-center text-[11px] text-[#A2A3AA]">
            {current.label}
          </p>
        )}
      </div>
    </div>
  );
}
