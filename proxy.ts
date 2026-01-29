import { createClient } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const supabase = createClient(request)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = request.nextUrl

  // Proteger rotas do dashboard
  if (pathname.startsWith('/dashboard')) {
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Proteger rota de escolha de nick
  if (pathname.startsWith('/choose-nickname')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Verificar se o usuário já tem username
    // Se tiver, redirecionar para dashboard
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        if (profile?.username) {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }
    } catch {
      // Se houver erro ao verificar perfil, permitir acesso à página
      // A página irá lidar com a verificação
    }
  }

  // Permitir acesso a /login mesmo com sessão ativa para permitir logout
  // Não redirecionar automaticamente para /dashboard

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
