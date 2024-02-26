import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/config/providers";
import { supabase } from "@/config/supabase";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "4dinha",
  description: "Jogo fodinha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt_br">
      <body className={inter.className}>
        {<Providers>{children}</Providers>}
      </body>
    </html>
  );
}
