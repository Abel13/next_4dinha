'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function checkNicknameAvailability(
  nickname: string
): Promise<{
  available: boolean
  error: string | null
}> {
  try {
    if (!nickname || nickname.trim().length === 0) {
      return { available: false, error: 'Nick não pode estar vazio' }
    }

    const trimmedNick = nickname.trim()

    // Validações básicas
    if (trimmedNick.length < 3) {
      return { available: false, error: 'Nick deve ter no mínimo 3 caracteres' }
    }

    if (trimmedNick.length > 20) {
      return { available: false, error: 'Nick deve ter no máximo 20 caracteres' }
    }

    // Apenas alfanuméricos e underscore
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedNick)) {
      return {
        available: false,
        error: 'Nick pode conter apenas letras, números e underscore',
      }
    }

    const supabase = await createClient()

    // Verificar se já existe (case-insensitive)
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .ilike('username', trimmedNick)
      .limit(1)

    if (error) {
      return { available: false, error: 'Erro ao verificar disponibilidade' }
    }

    return { available: !data || data.length === 0, error: null }
  } catch (error) {
    console.error('Error checking nickname availability:', error)
    return { available: false, error: 'Erro inesperado ao verificar disponibilidade' }
  }
}

export async function saveNickname(nickname: string): Promise<{
  success: boolean
  error: string | null
}> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Usuário não autenticado' }
    }

    // Verificar disponibilidade novamente antes de salvar
    const availability = await checkNicknameAvailability(nickname)
    if (!availability.available) {
      return { success: false, error: availability.error || 'Nick não disponível' }
    }

    const trimmedNick = nickname.trim()

    // Atualizar perfil do usuário
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: trimmedNick })
      .eq('id', user.id)

    if (updateError) {
      return { success: false, error: 'Erro ao salvar nick' }
    }

    revalidatePath('/dashboard')
    revalidatePath('/choose-nickname')

    return { success: true, error: null }
  } catch (error) {
    console.error('Error saving nickname:', error)
    return { success: false, error: 'Erro inesperado ao salvar nick' }
  }
}
