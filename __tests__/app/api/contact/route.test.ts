import { POST } from '@/app/api/contact/route'

// Mock Supabase server client
const mockInsert = vi.fn()
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: () => ({ insert: mockInsert }),
  }),
}))

// Mock Resend
const mockSend = vi.fn()
vi.mock('resend', () => ({
  Resend: class {
    emails = { send: mockSend }
  },
}))

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  const validBody = { name: 'Jean', email: 'jean@test.com', message: 'Bonjour' }

  beforeEach(() => {
    vi.clearAllMocks()
    mockInsert.mockResolvedValue({ error: null })
    mockSend.mockResolvedValue({ error: null })
  })

  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ email: 'a@b.com', message: 'hi' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when email is missing', async () => {
    const res = await POST(makeRequest({ name: 'Jean', message: 'hi' }))
    expect(res.status).toBe(400)
  })

  it('returns 400 when message is missing', async () => {
    const res = await POST(makeRequest({ name: 'Jean', email: 'a@b.com' }))
    expect(res.status).toBe(400)
  })

  it('returns 500 when Supabase insert fails', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'DB fail' } })
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(500)
  })

  it('returns 200 and inserts into DB on valid input', async () => {
    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json).toEqual({ ok: true })
    expect(mockInsert).toHaveBeenCalledWith(validBody)
  })

  it('sends email via Resend when env vars are set', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    process.env.CONTACT_EMAIL = 'admin@test.com'

    await POST(makeRequest(validBody))

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'admin@test.com',
        replyTo: 'jean@test.com',
      })
    )

    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_EMAIL
  })

  it('skips email when env vars are missing', async () => {
    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_EMAIL

    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('returns 200 even when Resend throws', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    process.env.CONTACT_EMAIL = 'admin@test.com'
    mockSend.mockRejectedValue(new Error('Resend down'))

    const res = await POST(makeRequest(validBody))
    expect(res.status).toBe(200)

    delete process.env.RESEND_API_KEY
    delete process.env.CONTACT_EMAIL
  })
})
