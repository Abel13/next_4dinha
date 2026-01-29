import type { MatchHistoryItem } from '@/app/dashboard/actions'

interface MatchHistoryProps {
  matches: MatchHistoryItem[]
  isLoading?: boolean
}

export function MatchHistory({ matches, isLoading }: MatchHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-4"
          >
            <div className="h-4 w-32 bg-[#2AFAFD22] rounded"></div>
            <div className="mt-2 h-3 w-48 bg-[#2AFAFD22] rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  if (matches.length === 0) {
    return (
      <div className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-8 text-center">
        <p className="text-[#A2A3AA]">Nenhuma partida encontrada</p>
      </div>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'started':
        return 'Em andamento'
      case 'ended':
        return 'Finalizada'
      case 'waiting':
        return 'Aguardando'
      default:
        return 'Desconhecido'
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'started':
        return 'text-[#8AFFFF]'
      case 'ended':
        return 'text-[#4caf50]'
      case 'waiting':
        return 'text-[#ffa726]'
      default:
        return 'text-[#A2A3AA]'
    }
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] p-4 transition hover:border-[#2AFAFD44]"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{match.name}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#A2A3AA]">
                <span>{formatDate(match.created_at)}</span>
                <span className={`font-medium ${getStatusColor(match.status)}`}>
                  {getStatusLabel(match.status)}
                </span>
                <span>Rodada {match.round_number}</span>
              </div>
            </div>
          </div>

          {match.players.length > 0 && (
            <div className="mt-4 border-t border-[#2AFAFD22] pt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#8AFFFF]">
                Jogadores ({match.players.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {match.players.map((player) => (
                  <div
                    key={player.user_id}
                    className="flex items-center gap-2 rounded border border-[#2AFAFD22] bg-[#070f2b88] px-2 py-1 text-xs"
                  >
                    <span className="text-[#2AFAFD]">
                      {player.username || 'Sem nick'}
                    </span>
                    {player.dealer && (
                      <span className="text-[10px] text-[#8AFFFF]">(D)</span>
                    )}
                    <span className="text-[#A2A3AA]">
                      {player.lives} vida{player.lives !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
