import type { CVData, CVRecord, ProfileData, ProfileRecord } from '@/types/cv'

export const mockPersonal: CVData['personal'] = {
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean@example.com',
  phone: '+33612345678',
  city: 'Paris',
  country: 'France',
  jobTitle: 'Développeur',
  summary: 'Développeur fullstack passionné.',
  linkedin: 'https://linkedin.com/in/jean',
  github: 'https://github.com/jean',
  portfolio: '',
}

export const mockTemplate: CVData['template'] = {
  layout: 'single',
  accentColor: '#5b7fa6',
  dividerColor: '#E2E8F0',
  jobTitleColor: '#94A3B8',
  useOptionalColor: true,
  font: 'Helvetica',
  density: 'normal',
  hiddenSections: [],
}

export const mockCVData: CVData = {
  template: mockTemplate,
  photo: null,
  personal: mockPersonal,
  experiences: [
    { id: 'exp-1', company: 'Acme', role: 'Dev', startDate: '2023-01', endDate: '2024-01', current: false, description: 'Built stuff' },
  ],
  education: [
    { id: 'edu-1', school: 'Université Paris', degree: 'Master', field: 'Informatique', year: '2022' },
  ],
  skills: [{ name: 'TypeScript', level: 4 }],
  languages: [{ id: 'lang-1', name: 'Français', level: 'Native' }],
  projects: [{ id: 'proj-1', name: 'IndigoCV', description: 'CV builder', url: 'https://indigocv.app', year: '2026' }],
  certifications: [{ id: 'cert-1', name: 'AWS', issuer: 'Amazon', year: '2025' }],
  interests: ['Musique', 'Randonnée'],
}

export const mockProfileData: ProfileData = {
  photo: mockCVData.photo,
  personal: mockCVData.personal,
  experiences: mockCVData.experiences,
  education: mockCVData.education,
  skills: mockCVData.skills,
  languages: mockCVData.languages,
  projects: mockCVData.projects,
  certifications: mockCVData.certifications,
  interests: mockCVData.interests,
}

export const mockCVRecord: CVRecord = {
  id: 'cv-123',
  name: 'Mon CV',
  data: mockCVData,
  profile_id: 'profile-456',
  created_at: '2026-03-22T10:00:00Z',
  updated_at: '2026-03-22T12:00:00Z',
}

export const mockProfileRecord: ProfileRecord = {
  id: 'profile-456',
  name: 'Mon Profil',
  data: mockProfileData,
  created_at: '2026-03-22T10:00:00Z',
  updated_at: '2026-03-22T12:00:00Z',
}

export const mockUser = { id: 'user-789', email: 'jean@example.com' }

export function createMockSupabaseClient(overrides: {
  getUser?: () => Promise<{ data: { user: typeof mockUser | null } }>
  insert?: ReturnType<typeof vi.fn>
  update?: ReturnType<typeof vi.fn>
  select?: ReturnType<typeof vi.fn>
  upload?: ReturnType<typeof vi.fn>
  getPublicUrl?: ReturnType<typeof vi.fn>
} = {}) {
  const insertFn = overrides.insert ?? vi.fn().mockReturnValue({
    select: vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({ data: { id: 'new-id' }, error: null }),
    }),
    then: undefined,
  })

  const updateFn = overrides.update ?? vi.fn().mockReturnValue({
    eq: vi.fn().mockReturnValue({
      eq: vi.fn().mockResolvedValue({ error: null }),
    }),
  })

  const fromFn = vi.fn().mockReturnValue({
    insert: insertFn,
    update: updateFn,
    select: overrides.select ?? vi.fn(),
  })

  const getPublicUrlFn = overrides.getPublicUrl ?? vi.fn().mockReturnValue({
    data: { publicUrl: 'https://storage.example.com/photo.jpg' },
  })

  return {
    auth: {
      getUser: overrides.getUser ?? vi.fn().mockResolvedValue({ data: { user: mockUser } }),
    },
    from: fromFn,
    storage: {
      from: vi.fn().mockReturnValue({
        upload: overrides.upload ?? vi.fn().mockResolvedValue({ data: { path: 'photo.jpg' }, error: null }),
        getPublicUrl: getPublicUrlFn,
      }),
    },
  }
}
