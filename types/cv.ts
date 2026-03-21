export type SectionKey = 'summary' | 'experiences' | 'projects' | 'education' | 'certifications' | 'skills' | 'languages' | 'interests'

export interface TemplateSettings {
  layout: 'single' | 'sidebar'
  accentColor: string
  font: 'Helvetica' | 'Times-Roman' | 'Roboto' | 'Lato' | 'Montserrat' | 'Raleway' | 'Playfair Display' | 'Merriweather'
  density: 'compact' | 'normal' | 'airy'
  hiddenSections: SectionKey[]
}

export interface CVData {
  template: TemplateSettings
  photo: string | null
  personal: {
    firstName: string
    lastName: string
    email: string
    phone: string
    street: string
    city: string
    postalCode: string
    country: string
    jobTitle: string
    summary: string
    linkedin: string
    github: string
    portfolio: string
  }
  experiences: {
    id: string
    company: string
    role: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }[]
  education: {
    id: string
    school: string
    degree: string
    field: string
    year: string
  }[]
  skills: { name: string; level: number }[]
  languages: { id: string; name: string; level: string }[]
  projects: {
    id: string
    name: string
    description: string
    url: string
    year: string
  }[]
  certifications: {
    id: string
    name: string
    issuer: string
    year: string
  }[]
  interests: string[]
}

export interface CVRecord {
  id: string
  name: string
  data: CVData
  created_at: string
  updated_at: string
}
