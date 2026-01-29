"use client";

import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [hasSession, setHasSession] = useState(false);
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_failed"
      ? "Falha na autenticação. Tente novamente."
      : null,
  );

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasSession(!!session);
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      setLoading("logout");
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
      setError("Erro ao fazer logout. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "apple") => {
    try {
      setLoading(provider);
      setError(null);

      const supabase = createClient();
      // Fazer logout completo antes de tentar login para garantir nova conta
      await supabase.auth.signOut();
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${baseUrl}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      if (signInError) {
        setError("Erro ao iniciar autenticação. Tente novamente.");
        setLoading(null);
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#021223] text-[#2AFAFD]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-10 sm:px-6">
        {/* HEADER */}
        <header className="flex items-center justify-center gap-3 pb-8">
          <div
            className="rounded-xl border border-[#2AFAFD44] bg-[#070f2b88] shadow-[0_0_18px_#2AFAFD44]"
            aria-label="Logo 4dinha"
          >
            <Image src="/logo.png" alt="logo" width={60} height={60} />
          </div>
          <div>
            <div className="flex gap-0.5">
              <span className="flex -rotate-45 text-xl">4</span>dinha
            </div>
            <p className="text-xs text-[#A2A3AA]">Card game competitivo</p>
          </div>
        </header>

        {/* LOGIN FORM */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full rounded-2xl border border-[#2AFAFD33] bg-[#070f2b88] p-8 shadow-[0_0_32px_#000000CC]">
            <h1 className="text-2xl font-semibold text-white">
              Entrar na sua conta
            </h1>
            <p className="mt-2 text-sm text-[#A2A3AA]">
              Escolha uma forma de autenticação para continuar
            </p>

            {error && (
              <div className="mt-4 rounded-lg border border-[#ef5350] bg-[#1a4e89EE]/10 px-4 py-3 text-sm text-[#ef5350]">
                {error}
              </div>
            )}

            <div className="mt-6 space-y-3">
              <button
                onClick={() => handleOAuthLogin("google")}
                disabled={loading !== null}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#2AFAFD44] bg-[#070f2b88] px-4 py-3 text-sm font-semibold text-[#2AFAFD] shadow-[0_0_18px_#2AFAFD22] transition hover:-translate-y-px hover:border-[#2AFAFD] hover:bg-[#070f2b] disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading === "google" ? (
                  <span className="text-[#A2A3AA]">Carregando...</span>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continuar com Google
                  </>
                )}
              </button>

              <button
                onClick={() => handleOAuthLogin("apple")}
                disabled={loading !== null}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#2AFAFD44] bg-[#070f2b88] px-4 py-3 text-sm font-semibold text-[#2AFAFD] shadow-[0_0_18px_#2AFAFD22] transition hover:-translate-y-px hover:border-[#2AFAFD] hover:bg-[#070f2b] disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading === "apple" ? (
                  <span className="text-[#A2A3AA]">Carregando...</span>
                ) : (
                  <>
                    <svg
                      className="h-5 w-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Continuar com Apple
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 border-t border-[#2AFAFD22] pt-6 space-y-3">
              {hasSession && (
                <button
                  onClick={handleLogout}
                  disabled={loading === "logout"}
                  className="w-full text-center text-sm text-[#A2A3AA] transition hover:text-[#2AFAFD] disabled:opacity-50"
                >
                  {loading === "logout"
                    ? "Saindo..."
                    : "Limpar sessão e criar nova conta"}
                </button>
              )}
              <Link
                href="/"
                className="block text-center text-sm text-[#A2A3AA] transition hover:text-[#2AFAFD]"
              >
                ← Voltar para a página inicial
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#021223] text-[#2AFAFD] flex items-center justify-center">
          <div className="text-center">
            <div className="text-xl text-[#2AFAFD]">Carregando...</div>
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
