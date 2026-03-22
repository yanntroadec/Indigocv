import { mockCVData, mockCVRecord, mockProfileRecord, mockTemplate, mockPersonal, createMockSupabaseClient, mockUser } from '../helpers/fixtures'

// Mock Supabase client
let mockClient = createMockSupabaseClient()
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockClient,
}))

// Must import after mock setup
const { useCVStore } = await import('@/store/cvStore')

function resetStore() {
  useCVStore.getState().reset()
}

describe('cvStore', () => {
  beforeEach(() => {
    resetStore()
    mockClient = createMockSupabaseClient()
    vi.clearAllMocks()
  })

  describe('setters', () => {
    it('setPersonal updates personal info', () => {
      const newPersonal = { ...mockPersonal, firstName: 'Marie' }
      useCVStore.getState().setPersonal(newPersonal)
      expect(useCVStore.getState().cv.personal.firstName).toBe('Marie')
    })

    it('setTemplate updates template', () => {
      const newTemplate = { ...mockTemplate, accentColor: '#ff0000' }
      useCVStore.getState().setTemplate(newTemplate)
      expect(useCVStore.getState().cv.template.accentColor).toBe('#ff0000')
    })

    it('setPhoto updates photo', () => {
      useCVStore.getState().setPhoto('data:image/png;base64,abc')
      expect(useCVStore.getState().cv.photo).toBe('data:image/png;base64,abc')

      useCVStore.getState().setPhoto(null)
      expect(useCVStore.getState().cv.photo).toBeNull()
    })

    it('setStep updates step', () => {
      useCVStore.getState().setStep(5)
      expect(useCVStore.getState().step).toBe(5)
    })

    it('setExperiences updates experiences', () => {
      useCVStore.getState().setExperiences(mockCVData.experiences)
      expect(useCVStore.getState().cv.experiences).toEqual(mockCVData.experiences)
    })

    it('setSkills updates skills', () => {
      const skills = [{ name: 'React', level: 5 }]
      useCVStore.getState().setSkills(skills)
      expect(useCVStore.getState().cv.skills).toEqual(skills)
    })
  })

  describe('reset', () => {
    it('restores default state', () => {
      useCVStore.getState().setPersonal(mockPersonal)
      useCVStore.getState().setStep(7)
      useCVStore.setState({ currentCvId: 'cv-1', currentCvName: 'Test' })

      useCVStore.getState().reset()

      const state = useCVStore.getState()
      expect(state.cv.personal.firstName).toBe('')
      expect(state.step).toBe(0)
      expect(state.currentCvId).toBeNull()
      expect(state.currentCvName).toBeNull()
      expect(state.currentProfileId).toBeNull()
    })
  })

  describe('loadCV', () => {
    it('hydrates from a CVRecord', () => {
      useCVStore.getState().loadCV(mockCVRecord)

      const state = useCVStore.getState()
      expect(state.cv).toEqual(mockCVRecord.data)
      expect(state.currentCvName).toBe('Mon CV')
      expect(state.currentProfileId).toBe('profile-456')
      expect(state.step).toBe(0)
    })

    it('sets currentCvId to null (snapshot, not linked)', () => {
      useCVStore.getState().loadCV(mockCVRecord)
      expect(useCVStore.getState().currentCvId).toBeNull()
    })
  })

  describe('loadProfile', () => {
    it('merges profile data while keeping template', () => {
      const customTemplate = { ...mockTemplate, accentColor: '#custom' }
      useCVStore.getState().setTemplate(customTemplate)

      useCVStore.getState().loadProfile(mockProfileRecord)

      const state = useCVStore.getState()
      expect(state.cv.template.accentColor).toBe('#custom')
      expect(state.cv.personal.firstName).toBe('Jean')
      expect(state.currentProfileId).toBe('profile-456')
      expect(state.currentProfileName).toBe('Mon Profil')
    })
  })

  describe('getProfileData', () => {
    it('returns CV data without template', () => {
      useCVStore.getState().setPersonal(mockPersonal)
      const profileData = useCVStore.getState().getProfileData()

      expect(profileData.personal).toEqual(mockPersonal)
      expect((profileData as Record<string, unknown>).template).toBeUndefined()
    })
  })

  describe('saveCVToSupabase', () => {
    it('fails when not authenticated', async () => {
      mockClient = createMockSupabaseClient({
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      })

      await useCVStore.getState().saveCVToSupabase()

      expect(useCVStore.getState().saveError).toBe('Not authenticated')
      expect(useCVStore.getState().isSaving).toBe(false)
    })

    it('inserts new CV when no currentCvId', async () => {
      mockClient = createMockSupabaseClient()

      await useCVStore.getState().saveCVToSupabase('New CV')

      expect(mockClient.from).toHaveBeenCalledWith('cvs')
      expect(useCVStore.getState().currentCvId).toBe('new-id')
      expect(useCVStore.getState().currentCvName).toBe('New CV')
      expect(useCVStore.getState().isSaving).toBe(false)
    })

    it('updates existing CV when currentCvId is set', async () => {
      mockClient = createMockSupabaseClient()
      useCVStore.setState({ currentCvId: 'existing-id' })

      await useCVStore.getState().saveCVToSupabase()

      const fromResult = mockClient.from('cvs')
      expect(fromResult.update).toHaveBeenCalled()
    })

    it('sets saveError on DB failure', async () => {
      const insertFn = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Insert failed' } }),
        }),
      })
      mockClient = createMockSupabaseClient({ insert: insertFn })

      await useCVStore.getState().saveCVToSupabase()

      expect(useCVStore.getState().saveError).toBe('Insert failed')
    })
  })

  describe('saveProfileToSupabase', () => {
    it('fails when not authenticated', async () => {
      mockClient = createMockSupabaseClient({
        getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
      })

      await useCVStore.getState().saveProfileToSupabase()

      expect(useCVStore.getState().saveError).toBe('Not authenticated')
      expect(useCVStore.getState().isSavingProfile).toBe(false)
    })

    it('inserts new profile when no currentProfileId', async () => {
      mockClient = createMockSupabaseClient()

      await useCVStore.getState().saveProfileToSupabase('Mon Profil')

      expect(mockClient.from).toHaveBeenCalledWith('profiles')
      expect(useCVStore.getState().currentProfileId).toBe('new-id')
      expect(useCVStore.getState().isSavingProfile).toBe(false)
    })
  })
})
