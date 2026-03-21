import type { CVData, SectionKey } from '@/types/cv'

type Template = CVData['template']

export const COLOR_PALETTES: { key: 'soft' | 'deep' | 'earth' | 'nordic'; colors: { label: string; value: string }[] }[] = [
  {
    key: 'soft',
    colors: [
      { label: 'Slate',       value: '#5c6b7a' },
      { label: 'Steel',       value: '#5b7fa6' },
      { label: 'Sage',        value: '#7a9e7e' },
      { label: 'Teal',        value: '#4e8c8c' },
      { label: 'Dusty Rose',  value: '#b76e79' },
      { label: 'Soft Coral',  value: '#c4756a' },
      { label: 'Lavender',    value: '#9d8cb3' },
      { label: 'Taupe',       value: '#8b7355' },
    ],
  },
  {
    key: 'deep',
    colors: [
      { label: 'Sapphire',    value: '#1e4d8c' },
      { label: 'Emerald',     value: '#1a6b4a' },
      { label: 'Bordeaux',    value: '#722f37' },
      { label: 'Plum',        value: '#5c2d6e' },
      { label: 'Petrol',      value: '#1a5276' },
      { label: 'Brick',       value: '#8b3a2a' },
      { label: 'Forest',      value: '#2d5a27' },
      { label: 'Anthracite',  value: '#2c3e50' },
    ],
  },
  {
    key: 'earth',
    colors: [
      { label: 'Terracotta',  value: '#c4622d' },
      { label: 'Ochre',       value: '#c8923a' },
      { label: 'Golden Sand', value: '#b5956a' },
      { label: 'Cinnamon',    value: '#8b5e3c' },
      { label: 'Mustard',     value: '#b5952a' },
      { label: 'Rust',        value: '#9c4b2a' },
      { label: 'Bronze',      value: '#8c6d2f' },
      { label: 'Fawn',        value: '#c07850' },
    ],
  },
  {
    key: 'nordic',
    colors: [
      { label: 'Glacier',     value: '#6b9eb2' },
      { label: 'Mist',        value: '#7a9aaa' },
      { label: 'Azure',       value: '#4a84b0' },
      { label: 'Eucalyptus',  value: '#6a9e82' },
      { label: 'Slate Blue',  value: '#6a88a0' },
      { label: 'Sea Foam',    value: '#5a9090' },
      { label: 'Heather',     value: '#7a6fa0' },
      { label: 'Frost',       value: '#6a8c88' },
    ],
  },
]

export const FONTS: { label: string; value: Template['font']; family: string }[] = [
  { label: 'Helvetica',        value: 'Helvetica',        family: 'Arial, sans-serif' },
  { label: 'Times',            value: 'Times-Roman',      family: 'Georgia, serif' },
  { label: 'Roboto',           value: 'Roboto',           family: 'Roboto, Arial, sans-serif' },
  { label: 'Lato',             value: 'Lato',             family: 'Lato, Arial, sans-serif' },
  { label: 'Montserrat',       value: 'Montserrat',       family: 'Montserrat, Arial, sans-serif' },
  { label: 'Raleway',          value: 'Raleway',          family: 'Raleway, Arial, sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display', family: '"Playfair Display", Georgia, serif' },
  { label: 'Merriweather',     value: 'Merriweather',     family: 'Merriweather, Georgia, serif' },
]

export const SECTION_KEYS: SectionKey[] = ['summary', 'experiences', 'projects', 'education', 'certifications', 'skills', 'languages', 'interests']

export const DIVIDER_COLORS: { label: string; value: string }[] = [
  { label: 'Ghost',    value: '#F1F5F9' },
  { label: 'Pearl',    value: '#E2E8F0' },
  { label: 'Slate',    value: '#CBD5E1' },
  { label: 'Graphite', value: '#94A3B8' },
  { label: 'Lavender', value: '#DDD6FE' },
  { label: 'Sky',      value: '#BAE6FD' },
  { label: 'Mint',     value: '#BBF7D0' },
  { label: 'Sand',     value: '#FDE68A' },
]

export const MONTHS: Record<string, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  fr: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
}

export const LANGUAGE_LEVELS: Record<string, string[]> = {
  en: ['Beginner', 'Intermediate', 'Fluent', 'Bilingual', 'Native'],
  fr: ['Débutant', 'Intermédiaire', 'Courant', 'Bilingue', 'Maternelle'],
}

const CURRENT_YEAR = new Date().getFullYear()

export const YEARS = Array.from({ length: 60 }, (_, i) => CURRENT_YEAR - i)
