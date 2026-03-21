import { type NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { updateSession } from '@/lib/supabase/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Auth callback is locale-independent — skip intl handling
  if (pathname === '/auth/callback') {
    return await updateSession(request)
  }

  // Step 1: next-intl — locale detection and URL prefixing
  const intlResponse = intlMiddleware(request)
  const isIntlRedirect = [301, 302, 307, 308].includes(intlResponse.status)
  if (isIntlRedirect) return intlResponse

  // Step 2: Supabase — session refresh and auth-based redirects
  const supabaseResponse = await updateSession(request)
  const isAuthRedirect = [301, 302, 307, 308].includes(supabaseResponse.status)
  if (isAuthRedirect) return supabaseResponse

  // Merge intl headers (locale rewrite etc.) into supabase response
  intlResponse.headers.forEach((value, key) => {
    supabaseResponse.headers.set(key, value)
  })

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ttf|woff|woff2)$).*)'],
}
