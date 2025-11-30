"use client";

import { AndroidFilled, AppleFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface StoreButtonProps {
  url: string;
  platform: "android" | "ios";
  variant?: "large" | "small";
}

export function StoreButton({
  url,
  platform,
  variant = "large",
}: StoreButtonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Abre a Play Store/App Store em nova aba
    window.open(url, "_blank", "noopener,noreferrer");
    // Redireciona a página atual para how-to-play
    router.push("/how-to-play");
  };

  const Icon = platform === "android" ? AndroidFilled : AppleFilled;
  const platformLabel = platform === "android" ? "Google Play" : "App Store";
  const platformSubLabel = platform === "android" ? "Baixar no" : "Baixar na";
  const shortLabel = platform === "android" ? "Android" : "iOS";

  if (variant === "small") {
    return (
      <a
        href={url}
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg border border-[#A2A3AA] bg-[#021223] px-3 py-2 text-xs font-semibold text-[#2AFAFD] shadow-[0_0_14px_#2AFAFD22] transition hover:border-[#2AFAFD] hover:bg-[#070f2b88]"
      >
        <Icon /> {shortLabel}
      </a>
    );
  }

  return (
    <a
      href={url}
      onClick={handleClick}
      className="group inline-flex items-center gap-2 rounded-xl border border-[#A2A3AA] bg-[#021223] px-4 py-2 text-sm font-semibold text-[#2AFAFD] shadow-[0_0_18px_#2AFAFD22] transition hover:-translate-y-[1px] hover:border-[#2AFAFD] hover:bg-[#070f2b88]"
    >
      <span className="text-lg">
        <Icon />
      </span>
      <span className="flex flex-col text-left leading-tight">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#A2A3AA]">
          {platformSubLabel}
        </span>
        <span>{platformLabel}</span>
      </span>
    </a>
  );
}
