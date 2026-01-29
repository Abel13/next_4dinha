'use server'

import { createClient } from '@/lib/supabase/server'

export type MatchHistoryItem = {
  id: string
  name: string
  status: string | null
  created_at: string | null
  round_number: number
  players: Array<{
    user_id: string
    username: string | null
    lives: number
    dealer: boolean
  }>
}

export async function getMatchHistory(userId: string): Promise<{
  data: MatchHistoryItem[] | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    // Buscar partidas onde o usuário participou
    const { data: matchUsers, error: matchUsersError } = await supabase
      .from('match_users')
      .select('match_id')
      .eq('user_id', userId)

    if (matchUsersError) {
      return { data: null, error: 'Erro ao buscar partidas' }
    }

    if (!matchUsers || matchUsers.length === 0) {
      return { data: [], error: null }
    }

    const matchIds = matchUsers.map((mu) => mu.match_id)

    // Buscar detalhes das partidas finalizadas
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .in('id', matchIds)
      .eq('status', 'end')
      .order('created_at', { ascending: false })

    if (matchesError) {
      return { data: null, error: 'Erro ao buscar detalhes das partidas' }
    }

    if (!matches || matches.length === 0) {
      return { data: [], error: null }
    }

    // Para cada partida, buscar os jogadores
    const matchesWithPlayers: MatchHistoryItem[] = await Promise.all(
      matches.map(async (match) => {
        const { data: players } = await supabase
          .from('match_users')
          .select('user_id, lives, dealer')
          .eq('match_id', match.id)

        const playerIds = players?.map((p) => p.user_id) || []

        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', playerIds)

        const playersWithUsernames =
          players?.map((player) => {
            const profile = profiles?.find((p) => p.id === player.user_id)
            return {
              user_id: player.user_id,
              username: profile?.username || null,
              lives: player.lives,
              dealer: player.dealer,
            }
          }) || []

        return {
          id: match.id,
          name: match.name,
          status: match.status,
          created_at: match.created_at,
          round_number: match.round_number,
          players: playersWithUsernames,
        }
      })
    )

    return { data: matchesWithPlayers, error: null }
  } catch (error) {
    console.error('Error fetching match history:', error)
    return { data: null, error: 'Erro inesperado ao buscar histórico' }
  }
}

export async function searchPlayerByNick(
  nick: string
): Promise<{
  data: Array<{ id: string; username: string | null }> | null
  error: string | null
}> {
  try {
    if (!nick || nick.trim().length === 0) {
      return { data: [], error: null }
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .ilike('username', `%${nick.trim()}%`)
      .limit(10)

    if (error) {
      return { data: null, error: 'Erro ao buscar jogador' }
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('Error searching player:', error)
    return { data: null, error: 'Erro inesperado ao buscar jogador' }
  }
}

export async function getCurrentUserProfile(): Promise<{
  data: { id: string; username: string | null } | null
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { data: null, error: 'Usuário não autenticado' }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { data: null, error: 'Erro ao buscar perfil' }
    }

    return { data: profile, error: null }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return { data: null, error: 'Erro inesperado ao buscar perfil' }
  }
}

