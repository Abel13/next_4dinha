import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MatchHistory } from '@/components/MatchHistory'
import { SearchPlayer } from '@/components/SearchPlayer'
import {
  getMatchHistory,
  getCurrentUserProfile,
  type MatchHistoryItem,
} from './actions'
import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Dashboard – 4dinha',
  description: 'Histórico de partidas do 4dinha',
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ playerId?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await getCurrentUserProfile()

  // Se o usuário não tem username, redirecionar para escolher nick
  if (!profile?.username) {
    redirect('/choose-nickname')
  }

  const currentUserId = user.id

  // Se houver playerId nos searchParams, buscar histórico desse jogador
  // Caso contrário, buscar histórico do usuário logado
  const params = await searchParams
  const targetUserId = params.playerId || currentUserId
  const { data: matches, error } = await getMatchHistory(targetUserId)

  return (
    <main className="min-h-screen bg-[#021223] text-[#2AFAFD]">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-4 py-10 sm:px-6 lg:px-10">
        {/* HEADER */}
        <header className="flex items-center justify-between gap-4 pb-8">
          <div className="flex items-center gap-3">
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
              <p className="text-xs text-[#A2A3AA]">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {profile?.username || 'Sem nick'}
              </p>
              <p className="text-xs text-[#A2A3AA]">{user.email}</p>
            </div>
            <form
              action={async () => {
                'use server'
                const supabase = await createClient()
                await supabase.auth.signOut()
                redirect('/login')
              }}
            >
              <button
                type="submit"
                className="rounded-full border border-[#2AFAFD44] bg-[#070f2b88] px-3 py-1 text-xs text-[#A2A3AA] transition hover:border-[#2AFAFD] hover:text-[#2AFAFD]"
              >
                Sair
              </button>
            </form>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">
              Histórico de Partidas
            </h1>
            <p className="mt-2 text-sm text-[#A2A3AA]">
              {targetUserId === currentUserId
                ? 'Suas partidas recentes'
                : 'Partidas do jogador selecionado'}
            </p>
          </div>

          {/* SEARCH */}
          <div className="mb-6">
            <label
              htmlFor="player-search"
              className="mb-2 block text-sm font-medium text-[#8AFFFF]"
            >
              Buscar jogador por nick
            </label>
            <SearchPlayer currentUserId={currentUserId} />
            {targetUserId !== currentUserId && (
              <form
                action={async () => {
                  'use server'
                  redirect('/dashboard')
                }}
                className="mt-2"
              >
                <button
                  type="submit"
                  className="text-xs text-[#2AFAFD] transition hover:underline"
                >
                  ← Ver meu histórico
                </button>
              </form>
            )}
          </div>

          {/* MATCH HISTORY */}
          {error ? (
            <div className="rounded-lg border border-[#ef5350] bg-[#1a4e89EE]/10 px-4 py-3 text-sm text-[#ef5350]">
              {error}
            </div>
          ) : (
            <MatchHistory matches={matches || []} />
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-[#2AFAFD22] pt-4 text-[10px] text-[#9BA1A6] sm:text-xs">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} 4dinha. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="hover:text-[#2AFAFD] hover:underline hover:underline-offset-2"
              >
                Página Inicial
              </Link>
              <span className="text-[#4c4b6e]">•</span>
              <Link
                href="/how-to-play"
                className="hover:text-[#2AFAFD] hover:underline hover:underline-offset-2"
              >
                Como Jogar
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}
