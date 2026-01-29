import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Verificar se o perfil existe, se não existir, criar
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        let { data: profile } = await supabase
          .from('profiles')
          .select('id, username')
          .eq('id', user.id)
          .single()

        if (!profile) {
          // Criar perfil básico SEM username (null) para evitar exposição de dados
          await supabase.from('profiles').insert({
            id: user.id,
            username: null,
          })
          // Buscar perfil recém-criado
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('id', user.id)
            .single()
          profile = newProfile
        }

        // Se o perfil não tem username, redirecionar para escolher nick
        if (!profile?.username) {
          return NextResponse.redirect(
            new URL('/choose-nickname', request.url)
          )
        }
      }

      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Se houver erro ou não houver code, redirecionar para login
  return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
}
