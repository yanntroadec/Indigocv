'use client'

import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import type { CVData, SectionKey } from '@/types/cv'

Font.register({ family: 'Roboto', fonts: [
  { src: '/fonts/Roboto-Regular.ttf' },
  { src: '/fonts/Roboto-Bold.ttf', fontWeight: 700 },
]})
Font.register({ family: 'Lato', fonts: [
  { src: '/fonts/Lato-Regular.ttf' },
  { src: '/fonts/Lato-Bold.ttf', fontWeight: 700 },
]})
Font.register({ family: 'Montserrat', fonts: [
  { src: '/fonts/Montserrat-Regular.ttf' },
  { src: '/fonts/Montserrat-Bold.ttf', fontWeight: 700 },
]})
Font.register({ family: 'Raleway', fonts: [
  { src: '/fonts/Raleway-Regular.ttf' },
  { src: '/fonts/Raleway-Bold.ttf', fontWeight: 700 },
]})
Font.register({ family: 'Playfair Display', fonts: [
  { src: '/fonts/PlayfairDisplay-Regular.ttf' },
  { src: '/fonts/PlayfairDisplay-Bold.ttf', fontWeight: 700 },
]})
Font.register({ family: 'Merriweather', fonts: [
  { src: '/fonts/Merriweather-Regular.ttf' },
  { src: '/fonts/Merriweather-Bold.ttf', fontWeight: 700 },
]})

// Prevent react-pdf from hyphenating words at line breaks
Font.registerHyphenationCallback((word) => [word])

const DARK = '#111827'
const LIGHT_GRAY = '#E5E7EB'
const GRAY = '#6B7280'

/** Blend primaryColor at 12% opacity on white — always harmonious */
function mkSecondary(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const a = 0.12
  const nr = Math.round(r * a + 255 * (1 - a))
  const ng = Math.round(g * a + 255 * (1 - a))
  const nb = Math.round(b * a + 255 * (1 - a))
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

const DENSITY_CONFIG = {
  compact: { vPad: 20, hPad: 28, itemGap: 6,  sectionGap: 12, lh: 1.4 },
  normal:  { vPad: 26, hPad: 32, itemGap: 8,  sectionGap: 16, lh: 1.5 },
  airy:    { vPad: 32, hPad: 38, itemGap: 10, sectionGap: 20, lh: 1.6 },
}

export interface SectionTitles {
  profile: string
  experience: string
  projects: string
  education: string
  certifications: string
  skills: string
  languages: string
  interests: string
  contact: string
  present: string
}

// ─── Shared micro-components ──────────────────────────────────────────────────

function Pill({ name, bg, color }: { name: string; bg: string; color: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 3, paddingVertical: 3, paddingHorizontal: 8, marginBottom: 4, marginRight: 4 }}>
      <Text style={{ fontSize: 8, color, fontWeight: 'bold' }}>{name}</Text>
    </View>
  )
}

// ─── Single-column layout ────────────────────────────────────────────────────

function singleStyles(accent: string, divider: string, d: typeof DENSITY_CONFIG['normal']) {
  return StyleSheet.create({
    page: { fontFamily: 'Roboto', fontSize: 9, color: DARK, paddingTop: d.vPad, paddingBottom: d.vPad, paddingHorizontal: d.hPad, lineHeight: d.lh },
    header: { marginBottom: 0 },
    name: { fontSize: 25, fontWeight: 'bold', lineHeight: 1.1, marginBottom: 2, color: accent },
    jobTitle: { fontSize: 12, color: '#666666', fontWeight: 'bold', marginBottom: 0 },
    headerSep: { borderBottomWidth: 1, borderBottomColor: divider, marginTop: 8, marginBottom: 8 },
    contactLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', fontSize: 8.5, marginBottom: 2 },
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: 3, marginRight: 12 },
    contactIcon: { fontSize: 7, color: accent, marginRight: 2, fontWeight: 'bold' },
    contactText: { fontSize: 8.5, color: DARK },
    socialLine: { flexDirection: 'column', alignItems: 'flex-start', gap: 3, marginBottom: 0, marginTop: 6 },
    socialItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    socialIcon: { fontSize: 7, color: accent, fontWeight: 'bold', width: 10 },
    socialText: { fontSize: 8.5, color: GRAY },
    headerSpacing: { marginBottom: 16 },
    section: { marginTop: d.sectionGap },
    sectionTitle: { fontSize: 9, fontWeight: 'bold', color: accent, borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 6, paddingBottom: 4, marginBottom: 0, textTransform: 'uppercase' },
    divider: { borderBottomWidth: 1, borderBottomColor: divider, marginBottom: 6 },
    summaryText: { color: GRAY, fontSize: 9, lineHeight: d.lh },
    expItem: { marginBottom: d.itemGap },
    expRole: { fontSize: 9.5, fontWeight: 'bold' },
    expMeta: { color: '#888888', fontSize: 8, marginTop: 3 },
    expDesc: { color: GRAY, fontSize: 8.5, marginTop: 5, lineHeight: d.lh },
    projLink: { color: accent, fontSize: 8.5, marginTop: 3 },
    eduItem: { marginBottom: d.itemGap },
    eduHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    eduDegree: { fontSize: 9.5, fontWeight: 'bold' },
    eduYear: { color: GRAY, fontSize: 8.5 },
    eduSchool: { color: GRAY, fontSize: 8.5, marginTop: 2 },
    certName: { fontSize: 9.5, fontWeight: 'bold' },
    certMeta: { color: GRAY, fontSize: 8.5, marginTop: 2 },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
    langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    langItem: { flexDirection: 'row', gap: 4 },
    langName: { fontSize: 8.5, fontWeight: 'bold' },
    langLevel: { fontSize: 8.5, color: GRAY },
    interestText: { fontSize: 8.5, color: GRAY, lineHeight: d.lh },
  })
}

function SingleLayout({ cv, titles }: { cv: CVData; titles: SectionTitles }) {
  const { personal, experiences, education, skills, languages, template, projects, certifications, interests } = cv
  const { accentColor, dividerColor, hiddenSections, density } = template
  const d = DENSITY_CONFIG[density ?? 'normal']
  const secondary = mkSecondary(accentColor)
  const s = singleStyles(accentColor, dividerColor ?? LIGHT_GRAY, d)
  const font = template.font
  const isHidden = (key: SectionKey) => hiddenSections?.includes(key)

  const hasSocial = personal.linkedin || personal.github || personal.portfolio

  return (
    <Page size="A4" style={[s.page, { fontFamily: font }]}>
      {/* Header Block */}
      <View style={s.header}>
        <Text style={s.name}>{personal.firstName} {personal.lastName}</Text>
        {personal.jobTitle ? <Text style={s.jobTitle}>{personal.jobTitle}</Text> : null}
        <View style={s.headerSep} />

        {(personal.phone || personal.email || personal.city || personal.country) && (
          <View style={s.contactLine}>
            {personal.phone && (
              <View style={s.contactItem}>
                <Text style={s.contactIcon}>📞</Text>
                <Text style={s.contactText}>{personal.phone}</Text>
              </View>
            )}
            {personal.email && (
              <View style={s.contactItem}>
                <Text style={s.contactIcon}>✉</Text>
                <Text style={s.contactText}>{personal.email}</Text>
              </View>
            )}
            {(personal.city || personal.country) && (
              <View style={s.contactItem}>
                <Text style={s.contactIcon}>📍</Text>
                <Text style={s.contactText}>{[personal.city, personal.country].filter(Boolean).join(', ')}</Text>
              </View>
            )}
          </View>
        )}

        {hasSocial && (
          <View style={s.socialLine}>
            {personal.linkedin && (
              <View style={s.socialItem}>
                <Text style={s.socialIcon}>🔗</Text>
                <Text style={s.socialText}>LinkedIn</Text>
              </View>
            )}
            {personal.github && (
              <View style={s.socialItem}>
                <Text style={s.socialIcon}>🔗</Text>
                <Text style={s.socialText}>GitHub</Text>
              </View>
            )}
            {personal.portfolio && (
              <View style={s.socialItem}>
                <Text style={s.socialIcon}>🔗</Text>
                <Text style={s.socialText}>{personal.portfolio}</Text>
              </View>
            )}
          </View>
        )}
      </View>

      <View style={s.headerSpacing} />

      {/* Profile / Summary */}
      {!isHidden('summary') && personal.summary ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.profile}</Text>
          <View style={s.divider} />
          <Text style={s.summaryText}>{personal.summary}</Text>
        </View>
      ) : null}

      {/* Experience — role bold on line 1, company · dates on line 2 */}
      {!isHidden('experiences') && experiences.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.experience}</Text>
          <View style={s.divider} />
          {experiences.map((exp) => {
            const datePart = [exp.startDate, exp.current ? titles.present : exp.endDate].filter(Boolean).join(' – ')
            const meta = [exp.company, datePart].filter(Boolean).join('  ·  ')
            return (
              <View key={exp.id} style={s.expItem}>
                <Text style={s.expRole}>{exp.role}</Text>
                {meta ? <Text style={s.expMeta}>{meta}</Text> : null}
                {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
              </View>
            )
          })}
        </View>
      )}

      {/* Projects */}
      {!isHidden('projects') && projects.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.projects}</Text>
          <View style={s.divider} />
          {projects.map((proj) => (
            <View key={proj.id} style={s.expItem}>
              <Text style={s.expRole}>{proj.name}</Text>
              {proj.year ? <Text style={s.expMeta}>{proj.year}</Text> : null}
              {proj.description ? <Text style={s.expDesc}>{proj.description}</Text> : null}
              {proj.url ? <Text style={s.projLink}>{proj.url}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {!isHidden('skills') && skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.skills}</Text>
          <View style={s.divider} />
          <View style={s.skillsGrid}>
            {skills.map((skill, i) => (
              <Pill key={i} name={skill.name} bg={secondary} color={accentColor} />
            ))}
          </View>
        </View>
      )}

      {/* Languages */}
      {!isHidden('languages') && languages.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.languages}</Text>
          <View style={s.divider} />
          <View style={s.langRow}>
            {languages.map((lang) => (
              <View key={lang.id} style={s.langItem}>
                <Text style={s.langName}>{lang.name}</Text>
                {lang.level ? <Text style={s.langLevel}>({lang.level})</Text> : null}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Education */}
      {!isHidden('education') && education.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.education}</Text>
          <View style={s.divider} />
          {education.map((edu) => (
            <View key={edu.id} style={s.eduItem}>
              <View style={s.eduHeader}>
                <Text style={s.eduDegree}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</Text>
                {edu.year ? <Text style={s.eduYear}>{edu.year}</Text> : null}
              </View>
              {edu.school ? <Text style={s.eduSchool}>{edu.school}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {!isHidden('certifications') && certifications.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.certifications}</Text>
          <View style={s.divider} />
          {certifications.map((cert) => (
            <View key={cert.id} style={s.eduItem}>
              <Text style={s.certName}>{cert.name}</Text>
              {(cert.issuer || cert.year) ? (
                <Text style={s.certMeta}>{[cert.issuer, cert.year].filter(Boolean).join('  ·  ')}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}

      {/* Interests */}
      {!isHidden('interests') && interests.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.interests}</Text>
          <View style={s.divider} />
          <Text style={s.interestText}>{interests.join('  ·  ')}</Text>
        </View>
      )}
    </Page>
  )
}

// ─── Sidebar layout ───────────────────────────────────────────────────────────

function sidebarStyles(accent: string, divider: string, d: typeof DENSITY_CONFIG['normal']) {
  return StyleSheet.create({
    page: { fontFamily: 'Roboto', fontSize: 9, color: DARK, flexDirection: 'row' },
    left: { width: '30%', backgroundColor: accent, paddingVertical: d.vPad, paddingHorizontal: 16, flexDirection: 'column' },
    right: { flex: 1, paddingVertical: d.vPad, paddingHorizontal: 18, paddingTop: 20, flexDirection: 'column' },
    nameBlock: { marginBottom: 6 },
    name: { fontSize: 18, fontWeight: 'bold', color: '#fff', lineHeight: 1.2, width: '100%' },
    photo: { width: 64, height: 64, borderRadius: 32, marginBottom: 8, alignSelf: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.75)' },
    jobTitle: { fontSize: 9, color: 'rgba(255,255,255,0.8)', marginTop: 3, marginBottom: 2 },
    leftNameSep: { borderBottomWidth: 1, borderBottomColor: divider, marginTop: 4, marginBottom: 0 },
    leftSection: { marginTop: 10 },
    leftSectionTitle: { fontSize: 7.5, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: divider, paddingBottom: 4, marginBottom: 3 },
    sidebarContactItem: { fontSize: 8, color: 'rgba(255,255,255,0.85)', marginBottom: 3 },
    skillPillRow: { flexDirection: 'row', flexWrap: 'wrap' },
    langRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    langName: { fontSize: 8.5, fontWeight: 'bold', color: '#fff' },
    langLevel: { fontSize: 8, color: 'rgba(255,255,255,0.7)' },
    interestText: { fontSize: 8, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 },
    rightSection: { marginTop: 0 },
    rightSectionTitle: { fontSize: 9.5, fontWeight: 'bold', color: accent, textTransform: 'uppercase', borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 7, marginBottom: 3 },
    rightDivider: { borderBottomWidth: 1, borderBottomColor: divider, marginBottom: d.itemGap },
    summaryText: { fontSize: 9, color: GRAY, lineHeight: d.lh },
    expItem: { marginBottom: d.itemGap },
    expRole: { fontSize: 10, fontWeight: 'bold' },
    expMeta: { fontSize: 8.5, color: GRAY, marginTop: 4 },
    expDesc: { fontSize: 9, color: GRAY, marginTop: 5, lineHeight: d.lh },
    projLink: { fontSize: 8.5, color: accent, marginTop: 3 },
    eduItem: { marginBottom: d.itemGap },
    eduDegree: { fontSize: 10, fontWeight: 'bold' },
    eduMeta: { fontSize: 8.5, color: GRAY, marginTop: 3 },
    certName: { fontSize: 10, fontWeight: 'bold' },
    certMeta: { fontSize: 8.5, color: GRAY, marginTop: 3 },
  })
}

function SidebarLayout({ cv, titles }: { cv: CVData; titles: SectionTitles }) {
  const { personal, experiences, education, skills, languages, template, projects, certifications, interests } = cv
  const { accentColor, dividerColor, hiddenSections, density } = template
  const d = DENSITY_CONFIG[density ?? 'normal']
  const s = sidebarStyles(accentColor, dividerColor ?? LIGHT_GRAY, d)
  const font = template.font
  const isHidden = (key: SectionKey) => hiddenSections?.includes(key)

  return (
    <Page size="A4" style={[s.page, { fontFamily: font }]}>
      {/* Left column — always fills full page height via flex stretch */}
      <View style={s.left}>
        {cv.photo ? <Image src={cv.photo} style={s.photo} /> : null}

        <View style={s.nameBlock}>
          <View style={{ flexDirection: 'column' }}>
            <Text style={s.name}>{personal.firstName}</Text>
            <Text style={s.name}>{personal.lastName}</Text>
          </View>
          {personal.jobTitle ? <Text style={s.jobTitle}>{personal.jobTitle}</Text> : null}
        </View>

        {(personal.email || personal.phone || personal.city || personal.country || personal.linkedin || personal.github || personal.portfolio) ? (
          <View style={s.leftNameSep} />
        ) : null}

        {(personal.email || personal.phone || personal.city || personal.country || personal.linkedin || personal.github || personal.portfolio) && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.contact}</Text>
            {personal.phone ? <Text style={s.sidebarContactItem}>{personal.phone}</Text> : null}
            {personal.email ? <Text style={s.sidebarContactItem}>{personal.email}</Text> : null}
            {(personal.city || personal.country) ? (
              <Text style={s.sidebarContactItem}>{[personal.city, personal.country].filter(Boolean).join(', ')}</Text>
            ) : null}
            {personal.linkedin && <Text style={s.sidebarContactItem}>LinkedIn</Text>}
            {personal.github && <Text style={s.sidebarContactItem}>GitHub</Text>}
            {personal.portfolio ? <Text style={s.sidebarContactItem}>{personal.portfolio}</Text> : null}
          </View>
        )}

        {!isHidden('skills') && skills.length > 0 && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.skills}</Text>
            <View style={s.skillPillRow}>
              {skills.map((skill, i) => (
                <View key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, paddingVertical: 2, paddingHorizontal: 6, marginRight: 4, marginBottom: 4 }}>
                  <Text style={{ fontSize: 7.5, color: '#fff' }}>{skill.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {!isHidden('languages') && languages.length > 0 && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.languages}</Text>
            {languages.map((lang) => (
              <View key={lang.id} style={s.langRow}>
                <Text style={s.langName}>{lang.name}</Text>
                {lang.level ? <Text style={s.langLevel}>{lang.level}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* Interests — each item as separate Text element to prevent line break hyphens */}
        {!isHidden('interests') && interests.length > 0 && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.interests}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {interests.map((interest, i) => (
                <Text key={i} style={s.interestText}>{interest}{i < interests.length - 1 ? ' · ' : ''}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Right column */}
      <View style={s.right}>
        {!isHidden('summary') && personal.summary ? (
          <View style={[s.rightSection, { marginTop: 0 }]}>
            <Text style={s.rightSectionTitle}>{titles.profile}</Text>
            <View style={s.rightDivider} />
            <Text style={s.summaryText}>{personal.summary}</Text>
          </View>
        ) : null}

        {!isHidden('experiences') && experiences.length > 0 && (
          <View style={[s.rightSection, { marginTop: d.sectionGap }]}>
            <Text style={s.rightSectionTitle}>{titles.experience}</Text>
            <View style={s.rightDivider} />
            {experiences.map((exp) => {
              const datePart = [exp.startDate, exp.current ? titles.present : exp.endDate].filter(Boolean).join(' – ')
              const meta = [exp.company, datePart].filter(Boolean).join('  ·  ')
              return (
                <View key={exp.id} style={s.expItem}>
                  <Text style={s.expRole}>{exp.role}</Text>
                  {meta ? <Text style={s.expMeta}>{meta}</Text> : null}
                  {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
                </View>
              )
            })}
          </View>
        )}

        {!isHidden('projects') && projects.length > 0 && (
          <View style={[s.rightSection, { marginTop: d.sectionGap }]}>
            <Text style={s.rightSectionTitle}>{titles.projects}</Text>
            <View style={s.rightDivider} />
            {projects.map((proj) => (
              <View key={proj.id} style={s.expItem}>
                <Text style={s.expRole}>{proj.name}</Text>
                {proj.year ? <Text style={s.expMeta}>{proj.year}</Text> : null}
                {proj.description ? <Text style={s.expDesc}>{proj.description}</Text> : null}
                {proj.url ? <Text style={s.projLink}>{proj.url}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {!isHidden('education') && education.length > 0 && (
          <View style={[s.rightSection, { marginTop: d.sectionGap }]}>
            <Text style={s.rightSectionTitle}>{titles.education}</Text>
            <View style={s.rightDivider} />
            {education.map((edu) => (
              <View key={edu.id} style={s.eduItem}>
                <Text style={s.eduDegree}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</Text>
                <Text style={s.eduMeta}>{edu.school}{edu.school && edu.year ? '  ·  ' : ''}{edu.year}</Text>
              </View>
            ))}
          </View>
        )}

        {!isHidden('certifications') && certifications.length > 0 && (
          <View style={[s.rightSection, { marginTop: d.sectionGap }]}>
            <Text style={s.rightSectionTitle}>{titles.certifications}</Text>
            <View style={s.rightDivider} />
            {certifications.map((cert) => (
              <View key={cert.id} style={s.eduItem}>
                <Text style={s.certName}>{cert.name}</Text>
                {(cert.issuer || cert.year) ? (
                  <Text style={s.certMeta}>{[cert.issuer, cert.year].filter(Boolean).join('  ·  ')}</Text>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CVDocument({ cv, sectionTitles }: { cv: CVData; sectionTitles: SectionTitles }) {
  return (
    <Document>
      {cv.template.layout === 'sidebar'
        ? <SidebarLayout cv={cv} titles={sectionTitles} />
        : <SingleLayout cv={cv} titles={sectionTitles} />
      }
    </Document>
  )
}
