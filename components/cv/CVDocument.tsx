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
  compact: { vPad: 28, hPad: 36, sectionMb: 14, itemMb: 6,  lh: 1.3 },
  normal:  { vPad: 36, hPad: 44, sectionMb: 18, itemMb: 10, lh: 1.5 },
  airy:    { vPad: 46, hPad: 52, sectionMb: 24, itemMb: 14, lh: 1.7 },
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

function InBadge({ light }: { light?: boolean }) {
  return (
    <View style={{ backgroundColor: light ? 'rgba(255,255,255,0.22)' : LIGHT_GRAY, borderRadius: 2, paddingHorizontal: 3, paddingVertical: 1.5 }}>
      <Text style={{ fontSize: 7, fontWeight: 'bold', color: light ? '#fff' : GRAY }}>in</Text>
    </View>
  )
}

function GhBadge({ light }: { light?: boolean }) {
  return (
    <View style={{ backgroundColor: light ? 'rgba(255,255,255,0.22)' : LIGHT_GRAY, borderRadius: 7, paddingHorizontal: 3, paddingVertical: 1.5 }}>
      <Text style={{ fontSize: 6.5, fontWeight: 'bold', color: light ? '#fff' : GRAY }}>gh</Text>
    </View>
  )
}

function Pill({ name, bg, color }: { name: string; bg: string; color: string }) {
  return (
    <View style={{ backgroundColor: bg, borderRadius: 4, paddingVertical: 2.5, paddingHorizontal: 8, margin: 2 }}>
      <Text style={{ fontSize: 8.5, color, fontWeight: 'bold' }}>{name}</Text>
    </View>
  )
}

// ─── Single-column layout ────────────────────────────────────────────────────

function singleStyles(accent: string, secondary: string, divider: string, d: typeof DENSITY_CONFIG['normal']) {
  return StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: DARK, paddingTop: d.vPad, paddingBottom: d.vPad, paddingHorizontal: d.hPad, lineHeight: d.lh },
    name: { fontSize: 23, fontWeight: 'bold', marginBottom: 3 },
    jobTitle: { fontSize: 11, color: GRAY, marginBottom: 10 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', color: GRAY, fontSize: 9, marginBottom: 4 },
    sep: { color: LIGHT_GRAY, marginHorizontal: 4 },
    socialRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 },
    socialItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
    socialText: { fontSize: 9, color: GRAY },
    section: { marginBottom: d.sectionMb },
    sectionTitle: { fontSize: 10, fontWeight: 'bold', color: accent, borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 7, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1.5 },
    divider: { borderBottomWidth: 1, borderBottomColor: divider, marginBottom: 8 },
    summaryText: { color: GRAY, fontSize: 9.5, lineHeight: d.lh },
    expItem: { marginBottom: d.itemMb },
    expHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
    expRole: { fontSize: 10.5, fontWeight: 'bold' },
    expMeta: { color: GRAY, fontSize: 9, textAlign: 'right' },
    expDesc: { color: GRAY, fontSize: 9.5, marginTop: 3, lineHeight: d.lh },
    projLink: { color: accent, fontSize: 8.5, marginTop: 2 },
    eduItem: { marginBottom: d.itemMb - 2 },
    eduHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    eduDegree: { fontSize: 10.5, fontWeight: 'bold' },
    eduYear: { color: GRAY, fontSize: 9 },
    eduSchool: { color: GRAY, fontSize: 9.5 },
    certName: { fontSize: 10.5, fontWeight: 'bold' },
    certMeta: { color: GRAY, fontSize: 9, marginTop: 1.5 },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -2 },
    langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    langItem: { flexDirection: 'row', gap: 4 },
    langName: { fontSize: 9.5, fontWeight: 'bold' },
    langLevel: { fontSize: 9.5, color: GRAY },
    interestTag: { fontSize: 9, color: GRAY, backgroundColor: secondary, paddingVertical: 2.5, paddingHorizontal: 7, borderRadius: 4 },
    interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  })
}

function SingleLayout({ cv, titles }: { cv: CVData; titles: SectionTitles }) {
  const { personal, experiences, education, skills, languages, template, projects, certifications, interests } = cv
  const { accentColor, dividerColor, hiddenSections, density } = template
  const d = DENSITY_CONFIG[density ?? 'normal']
  const secondary = mkSecondary(accentColor)
  const s = singleStyles(accentColor, secondary, dividerColor ?? LIGHT_GRAY, d)
  const font = template.font
  const isHidden = (key: SectionKey) => hiddenSections?.includes(key)

  const addressParts = [
    personal.street,
    [personal.postalCode, personal.city].filter(Boolean).join(' '),
    personal.country,
  ].filter(Boolean)
  const address = addressParts.join(', ')
  const contact = [personal.email, personal.phone, address].filter(Boolean)
  const hasSocial = personal.linkedin || personal.github || personal.portfolio

  return (
    <Page size="A4" style={[s.page, { fontFamily: font }]}>
      <Text style={s.name}>{personal.firstName} {personal.lastName}</Text>
      {personal.jobTitle ? <Text style={s.jobTitle}>{personal.jobTitle}</Text> : null}

      {contact.length > 0 && (
        <View style={s.contactRow}>
          {contact.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 && <Text style={s.sep}> | </Text>}
              <Text>{c}</Text>
            </View>
          ))}
        </View>
      )}

      {hasSocial && (
        <View style={s.socialRow}>
          {personal.linkedin && (
            <View style={s.socialItem}>
              <InBadge />
              <Text style={s.socialText}>LinkedIn</Text>
            </View>
          )}
          {personal.github && (
            <View style={s.socialItem}>
              <GhBadge />
              <Text style={s.socialText}>GitHub</Text>
            </View>
          )}
          {personal.portfolio && (
            <Text style={s.socialText}>{personal.portfolio}</Text>
          )}
        </View>
      )}
      {contact.length > 0 && !hasSocial && <View style={{ marginBottom: 14 }} />}

      {!isHidden('summary') && personal.summary ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.profile}</Text>
          <View style={s.divider} />
          <Text style={s.summaryText}>{personal.summary}</Text>
        </View>
      ) : null}

      {!isHidden('experiences') && experiences.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.experience}</Text>
          <View style={s.divider} />
          {experiences.map((exp) => (
            <View key={exp.id} style={s.expItem}>
              <View style={s.expHeader}>
                <Text style={s.expRole}>{exp.role}</Text>
                <Text style={s.expMeta}>{exp.company}{exp.company && exp.startDate ? '  ·  ' : ''}{exp.startDate}{exp.startDate && (exp.current || exp.endDate) ? ' – ' : ''}{exp.current ? titles.present : exp.endDate}</Text>
              </View>
              {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {!isHidden('projects') && projects.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.projects}</Text>
          <View style={s.divider} />
          {projects.map((proj) => (
            <View key={proj.id} style={s.expItem}>
              <View style={s.expHeader}>
                <Text style={s.expRole}>{proj.name}</Text>
                {proj.year ? <Text style={s.expMeta}>{proj.year}</Text> : null}
              </View>
              {proj.description ? <Text style={s.expDesc}>{proj.description}</Text> : null}
              {proj.url ? <Text style={s.projLink}>{proj.url}</Text> : null}
            </View>
          ))}
        </View>
      )}

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

      {!isHidden('interests') && interests.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>{titles.interests}</Text>
          <View style={s.divider} />
          <View style={s.interestRow}>
            {interests.map((interest, i) => (
              <Text key={i} style={s.interestTag}>{interest}</Text>
            ))}
          </View>
        </View>
      )}
    </Page>
  )
}

// ─── Sidebar layout ───────────────────────────────────────────────────────────

function sidebarStyles(accent: string, divider: string, d: typeof DENSITY_CONFIG['normal']) {
  return StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: DARK, flexDirection: 'row' },
    left: { width: '28%', backgroundColor: accent, paddingVertical: d.vPad, paddingHorizontal: 20, flexDirection: 'column', gap: 12 },
    right: { flex: 1, paddingVertical: d.vPad, paddingHorizontal: 22, flexDirection: 'column', gap: d.sectionMb },
    name: { fontSize: 22, fontWeight: 'bold', color: '#fff', lineHeight: 1.2, marginBottom: 2 },
    photo: { width: 68, height: 68, borderRadius: 34, marginBottom: 6, alignSelf: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.75)' },
    jobTitle: { fontSize: 9.5, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    leftSection: { marginTop: 2 },
    leftSectionTitle: { fontSize: 8, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1.5, borderBottomWidth: 1, borderBottomColor: divider, paddingBottom: 3, marginBottom: 6 },
    contactItem: { fontSize: 8.5, color: 'rgba(255,255,255,0.85)', marginTop: 3 },
    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
    contactRowText: { fontSize: 8.5, color: 'rgba(255,255,255,0.85)' },
    skillPillRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -2 },
    langRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    langName: { fontSize: 9, fontWeight: 'bold', color: '#fff' },
    langLevel: { fontSize: 8.5, color: 'rgba(255,255,255,0.7)' },
    interestText: { fontSize: 8.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 },
    rightSectionTitle: { fontSize: 10, fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: 1.5, borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 7, marginBottom: 5 },
    rightDivider: { borderBottomWidth: 1, borderBottomColor: divider, marginBottom: 8 },
    summaryText: { fontSize: 9.5, color: GRAY, lineHeight: d.lh },
    expItem: { marginBottom: d.itemMb },
    expRole: { fontSize: 10.5, fontWeight: 'bold' },
    expMeta: { fontSize: 9, color: GRAY, marginTop: 1 },
    expDesc: { fontSize: 9.5, color: GRAY, marginTop: 3, lineHeight: d.lh },
    projLink: { fontSize: 8.5, color: accent, marginTop: 2 },
    eduItem: { marginBottom: d.itemMb - 2 },
    eduDegree: { fontSize: 10.5, fontWeight: 'bold' },
    eduMeta: { fontSize: 9, color: GRAY, marginTop: 1 },
    certName: { fontSize: 10.5, fontWeight: 'bold' },
    certMeta: { fontSize: 9, color: GRAY, marginTop: 1.5 },
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
      {/* Left column */}
      <View style={s.left}>
        {cv.photo ? <Image src={cv.photo} style={s.photo} /> : null}
        <View>
          <Text style={s.name}>{personal.firstName} {personal.lastName}</Text>
          {personal.jobTitle ? <Text style={s.jobTitle}>{personal.jobTitle}</Text> : null}
        </View>

        {(personal.email || personal.phone || personal.street || personal.city || personal.country || personal.linkedin || personal.github || personal.portfolio) && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.contact}</Text>
            {personal.email ? <Text style={s.contactItem}>{personal.email}</Text> : null}
            {personal.phone ? <Text style={s.contactItem}>{personal.phone}</Text> : null}
            {personal.street ? <Text style={s.contactItem}>{personal.street}</Text> : null}
            {(personal.postalCode || personal.city) ? <Text style={s.contactItem}>{[personal.postalCode, personal.city].filter(Boolean).join(' ')}</Text> : null}
            {personal.country ? <Text style={s.contactItem}>{personal.country}</Text> : null}
            {personal.linkedin && (
              <View style={s.contactRow}>
                <InBadge light />
                <Text style={s.contactRowText}>{personal.linkedin}</Text>
              </View>
            )}
            {personal.github && (
              <View style={s.contactRow}>
                <GhBadge light />
                <Text style={s.contactRowText}>{personal.github}</Text>
              </View>
            )}
            {personal.portfolio ? <Text style={s.contactItem}>{personal.portfolio}</Text> : null}
          </View>
        )}

        {!isHidden('skills') && skills.length > 0 && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.skills}</Text>
            <View style={s.skillPillRow}>
              {skills.map((skill, i) => (
                <View key={i} style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 4, paddingVertical: 2.5, paddingHorizontal: 7, margin: 2 }}>
                  <Text style={{ fontSize: 8, color: '#fff' }}>{skill.name}</Text>
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

        {!isHidden('interests') && interests.length > 0 && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.interests}</Text>
            <Text style={s.interestText}>{interests.join('  ·  ')}</Text>
          </View>
        )}
      </View>

      {/* Right column */}
      <View style={s.right}>
        {!isHidden('summary') && personal.summary ? (
          <View>
            <Text style={s.rightSectionTitle}>{titles.profile}</Text>
            <View style={s.rightDivider} />
            <Text style={s.summaryText}>{personal.summary}</Text>
          </View>
        ) : null}

        {!isHidden('experiences') && experiences.length > 0 && (
          <View>
            <Text style={s.rightSectionTitle}>{titles.experience}</Text>
            <View style={s.rightDivider} />
            {experiences.map((exp) => (
              <View key={exp.id} style={s.expItem}>
                <Text style={s.expRole}>{exp.role}</Text>
                <Text style={s.expMeta}>{exp.company}{exp.company && exp.startDate ? '  ·  ' : ''}{exp.startDate}{exp.startDate && (exp.current || exp.endDate) ? ' – ' : ''}{exp.current ? titles.present : exp.endDate}</Text>
                {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {!isHidden('projects') && projects.length > 0 && (
          <View>
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
          <View>
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
          <View>
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

        {/* Skills in right column when sidebar layout — hidden since sidebar has them */}
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
