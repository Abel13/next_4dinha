'use client'

import { checkNicknameAvailability, saveNickname } from './actions'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function ChooseNicknamePage() {
  const router = useRouter()
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleNicknameChange = async (value: string) => {
    setNickname(value)
    setError(null)
    setAvailabilityError(null)

    if (value.trim().length === 0) {
      return
    }

    if (value.trim().length < 3) {
      setAvailabilityError('Nick deve ter no mínimo 3 caracteres')
      return
    }

    if (value.trim().length > 20) {
      setAvailabilityError('Nick deve ter no máximo 20 caracteres')
      return
    }

    if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
      setAvailabilityError('Apenas letras, números e underscore permitidos')
      return
    }

    setIsChecking(true)
    const { available, error: checkError } = await checkNicknameAvailability(
      value
    )
    setIsChecking(false)

    if (checkError) {
      setAvailabilityError(checkError)
    } else if (!available) {
      setAvailabilityError('Este nick já está em uso')
    } else {
      setAvailabilityError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim()) {
      setError('Por favor, escolha um nick')
      return
    }

    setError(null)
    setAvailabilityError(null)

    startTransition(async () => {
      const { success, error: saveError } = await saveNickname(nickname.trim())

      if (success) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setError(saveError || 'Erro ao salvar nick')
      }
    })
  }

  const isNicknameValid =
    nickname.trim().length >= 3 &&
    nickname.trim().length <= 20 &&
    /^[a-zA-Z0-9_]+$/.test(nickname.trim()) &&
    !availabilityError &&
    !isChecking

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
            <p className="text-xs text-[#A2A3AA]">Escolha seu nick</p>
          </div>
        </header>

        {/* FORM */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full rounded-2xl border border-[#2AFAFD33] bg-[#070f2b88] p-8 shadow-[0_0_32px_#000000CC]">
            <h1 className="text-2xl font-semibold text-white">
              Escolha seu nick
            </h1>
            <p className="mt-2 text-sm text-[#A2A3AA]">
              Escolha um nome único para aparecer nas partidas. Este nome será
              visível para outros jogadores.
            </p>

            <form onSubmit={handleSubmit} className="mt-6">
              <div>
                <label
                  htmlFor="nickname"
                  className="mb-2 block text-sm font-medium text-[#8AFFFF]"
                >
                  Nick
                </label>
                <div className="relative">
                  <input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => handleNicknameChange(e.target.value)}
                    placeholder="ex: jogador123"
                    disabled={isPending}
                    className="w-full rounded-lg border border-[#2AFAFD44] bg-[#070f2b88] px-4 py-2 text-sm text-white placeholder-[#A2A3AA] focus:border-[#2AFAFD] focus:outline-none focus:ring-1 focus:ring-[#2AFAFD] disabled:opacity-50"
                    maxLength={20}
                  />
                  {isChecking && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#2AFAFD] border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {availabilityError && (
                  <p className="mt-2 text-xs text-[#ef5350]">
                    {availabilityError}
                  </p>
                )}

                {!availabilityError && nickname.trim().length >= 3 && (
                  <p className="mt-2 text-xs text-[#4caf50]">
                    ✓ Nick disponível
                  </p>
                )}

                <p className="mt-2 text-xs text-[#A2A3AA]">
                  Mínimo 3 caracteres, máximo 20. Apenas letras, números e
                  underscore.
                </p>
              </div>

              {error && (
                <div className="mt-4 rounded-lg border border-[#ef5350] bg-[#1a4e89EE]/10 px-4 py-3 text-sm text-[#ef5350]">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={!isNicknameValid || isPending}
                className="mt-6 w-full rounded-xl border border-[#2AFAFD44] bg-[#070f2b88] px-4 py-3 text-sm font-semibold text-[#2AFAFD] shadow-[0_0_18px_#2AFAFD22] transition hover:-translate-y-px hover:border-[#2AFAFD] hover:bg-[#070f2b] disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {isPending ? 'Salvando...' : 'Continuar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
