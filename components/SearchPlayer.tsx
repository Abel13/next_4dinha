'use client'

import { searchPlayerByNick } from '@/app/dashboard/actions'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface SearchPlayerProps {
  currentUserId?: string
}

export function SearchPlayer({ currentUserId }: SearchPlayerProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<
    Array<{ id: string; username: string | null }>
  >([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setError(null)

    if (value.trim().length === 0) {
      setResults([])
      return
    }

    startTransition(async () => {
      const { data, error: searchError } = await searchPlayerByNick(value)

      if (searchError) {
        setError(searchError)
        setResults([])
      } else {
        setResults(data || [])
      }
    })
  }

  const handlePlayerClick = (userId: string) => {
    router.push(`/dashboard?playerId=${userId}`)
    setSearchTerm('')
    setResults([])
  }

  return (
    <div className="relative">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar por nick..."
          className="flex-1 rounded-lg border border-[#2AFAFD44] bg-[#070f2b88] px-4 py-2 text-sm text-white placeholder-[#A2A3AA] focus:border-[#2AFAFD] focus:outline-none focus:ring-1 focus:ring-[#2AFAFD]"
        />
        {isPending && (
          <div className="flex items-center px-4">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2AFAFD] border-t-transparent"></div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 rounded-lg border border-[#ef5350] bg-[#1a4e89EE]/10 px-3 py-2 text-xs text-[#ef5350]">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-[#2AFAFD44] bg-[#070f2b88] shadow-lg">
          {results.map((player) => (
            <button
              key={player.id}
              onClick={() => handlePlayerClick(player.id)}
              disabled={player.id === currentUserId}
              className="w-full px-4 py-2 text-left text-sm text-[#2AFAFD] transition hover:bg-[#070f2b] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            >
              {player.username || 'Sem nick'}
              {player.id === currentUserId && (
                <span className="ml-2 text-xs text-[#A2A3AA]">(Você)</span>
              )}
            </button>
          ))}
        </div>
      )}

      {searchTerm.length > 0 && results.length === 0 && !isPending && !error && (
        <div className="mt-2 rounded-lg border border-[#2AFAFD22] bg-[#070f2b88] px-3 py-2 text-xs text-[#A2A3AA]">
          Nenhum jogador encontrado
        </div>
      )}
    </div>
  )
}
