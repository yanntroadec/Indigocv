import { COLOR_PALETTES, FONTS, SECTION_KEYS, MONTHS, LANGUAGE_LEVELS, DIVIDER_COLORS, OPTIONAL_COLORS } from '@/lib/constants'

describe('constants', () => {
  describe('COLOR_PALETTES', () => {
    it('has 4 palette groups with 8 colors each', () => {
      expect(COLOR_PALETTES).toHaveLength(4)
      const keys = COLOR_PALETTES.map((p) => p.key)
      expect(keys).toEqual(['soft', 'deep', 'earth', 'nordic'])
      for (const palette of COLOR_PALETTES) {
        expect(palette.colors).toHaveLength(8)
      }
    })

    it('all color values are valid hex strings', () => {
      const hexRegex = /^#[0-9a-fA-F]{6}$/
      for (const palette of COLOR_PALETTES) {
        for (const color of palette.colors) {
          expect(color.value).toMatch(hexRegex)
          expect(color.label).toBeTruthy()
        }
      }
    })
  })

  describe('DIVIDER_COLORS', () => {
    it('has 8 colors with valid hex values', () => {
      expect(DIVIDER_COLORS).toHaveLength(8)
      for (const color of DIVIDER_COLORS) {
        expect(color.value).toMatch(/^#[0-9a-fA-F]{6}$/)
      }
    })
  })

  describe('OPTIONAL_COLORS', () => {
    it('has 8 colors with valid hex values', () => {
      expect(OPTIONAL_COLORS).toHaveLength(8)
      for (const color of OPTIONAL_COLORS) {
        expect(color.value).toMatch(/^#[0-9a-fA-F]{6}$/)
      }
    })
  })

  describe('FONTS', () => {
    it('has 8 entries with non-empty label, value, family', () => {
      expect(FONTS).toHaveLength(8)
      for (const font of FONTS) {
        expect(font.label).toBeTruthy()
        expect(font.value).toBeTruthy()
        expect(font.family).toBeTruthy()
      }
    })
  })

  describe('SECTION_KEYS', () => {
    it('has exactly 8 keys', () => {
      expect(SECTION_KEYS).toHaveLength(8)
      expect(SECTION_KEYS).toEqual([
        'summary', 'experiences', 'projects', 'education',
        'certifications', 'skills', 'languages', 'interests',
      ])
    })
  })

  describe('MONTHS', () => {
    it('has 3 locales with 12 months each', () => {
      for (const locale of ['en', 'fr', 'es']) {
        expect(MONTHS[locale]).toHaveLength(12)
        for (const month of MONTHS[locale]) {
          expect(month).toBeTruthy()
        }
      }
    })
  })

  describe('LANGUAGE_LEVELS', () => {
    it('has 3 locales with 5 levels each', () => {
      for (const locale of ['en', 'fr', 'es']) {
        expect(LANGUAGE_LEVELS[locale]).toHaveLength(5)
        for (const level of LANGUAGE_LEVELS[locale]) {
          expect(level).toBeTruthy()
        }
      }
    })
  })
})
