import { stripLocale } from '@/lib/supabase/middleware'

// Mock Supabase SSR
const mockGetUser = vi.fn()
vi.mock('@supabase/ssr', () => ({
  createServerClient: () => ({
    auth: { getUser: mockGetUser },
  }),
}))

// Must import after mocks
const { updateSession } = await import('@/lib/supabase/middleware')

// Minimal NextRequest-like object
function makeRequest(pathname: string) {
  const url = new URL(`http://localhost${pathname}`)
  return {
    nextUrl: Object.assign(url, { clone: () => new URL(url.toString()) }),
    cookies: {
      getAll: () => [],
      set: vi.fn(),
    },
  } as unknown as Parameters<typeof updateSession>[0]
}

describe('stripLocale', () => {
  it('strips /en/dashboard to /dashboard with locale en', () => {
    const result = stripLocale('/en/dashboard')
    expect(result).toEqual({ strippedPath: '/dashboard', locale: 'en' })
  })

  it('strips /fr/login to /login with locale fr', () => {
    const result = stripLocale('/fr/login')
    expect(result).toEqual({ strippedPath: '/login', locale: 'fr' })
  })

  it('strips /es/ to / with locale es', () => {
    const result = stripLocale('/es/')
    expect(result).toEqual({ strippedPath: '/', locale: 'es' })
  })

  it('returns original path with default locale en when no locale prefix', () => {
    const result = stripLocale('/dashboard')
    expect(result).toEqual({ strippedPath: '/dashboard', locale: 'en' })
  })

  it('handles root path /', () => {
    const result = stripLocale('/')
    expect(result).toEqual({ strippedPath: '/', locale: 'en' })
  })
})

describe('updateSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Set required env vars
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  it('redirects unauthenticated user from /en/dashboard to /en/login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const response = await updateSession(makeRequest('/en/dashboard'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/en/login')
  })

  it('redirects unauthenticated user from /fr/dashboard to /fr/login', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const response = await updateSession(makeRequest('/fr/dashboard'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/fr/login')
  })

  it('redirects authenticated user from /en/login to /en/dashboard', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const response = await updateSession(makeRequest('/en/login'))

    expect(response.status).toBe(307)
    expect(new URL(response.headers.get('location')!).pathname).toBe('/en/dashboard')
  })

  it('does not redirect authenticated user on /en/dashboard', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })

    const response = await updateSession(makeRequest('/en/dashboard'))

    expect(response.status).toBe(200)
  })

  it('does not redirect unauthenticated user on public page', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })

    const response = await updateSession(makeRequest('/en/faq'))

    expect(response.status).toBe(200)
  })
})
