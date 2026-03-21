import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const LOCALES = ['en', 'fr']

function stripLocale(pathname: string): { strippedPath: string; locale: string } {
  const segments = pathname.split('/')
  const locale = LOCALES.includes(segments[1]) ? segments[1] : 'en'
  const strippedPath = LOCALES.includes(segments[1])
    ? '/' + segments.slice(2).join('/') || '/'
    : pathname
  return { strippedPath, locale }
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do not remove this call
  const { data: { user } } = await supabase.auth.getUser()

  const { strippedPath, locale } = stripLocale(request.nextUrl.pathname)

  // Protect /dashboard
  if (!user && strippedPath.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/login`
    return NextResponse.redirect(url)
  }

  // Redirect logged-in users away from /login
  if (user && (strippedPath === '/login' || strippedPath === '/login/')) {
    const url = request.nextUrl.clone()
    url.pathname = `/${locale}/dashboard`
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
