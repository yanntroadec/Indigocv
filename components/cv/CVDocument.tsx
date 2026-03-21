'use client'

import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path } from '@react-pdf/renderer'
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
  compact: { vPad: 24, hPad: 30, itemGap: 8,  sectionGap: 18, lh: 1.4 },
  normal:  { vPad: 30, hPad: 36, itemGap: 10, sectionGap: 22, lh: 1.55 },
  airy:    { vPad: 36, hPad: 42, itemGap: 14, sectionGap: 28, lh: 1.65 },
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

// ─── Contact icons (SVG for reliable PDF rendering) ─────────────────────────

function IconPhone({ size = 9, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </Svg>
  )
}

function IconMail({ size = 9, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </Svg>
  )
}

function IconHome({ size = 9, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </Svg>
  )
}

function IconLinkedIn({ size = 9, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </Svg>
  )
}

function IconGitHub({ size = 9, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5A10.003 10.003 0 0022 12 10 10 0 0012 2z" />
    </Svg>
  )
}

function IconGlobe({ size = 9, color = '#000' }: { size?: number; color?: string }) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </Svg>
  )
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
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' } as const,
    name: { fontSize: 25, fontWeight: 'bold', lineHeight: 1.0, color: accent, textAlign: 'center', flex: 1, paddingBottom: 0, marginBottom: 0 },
    jobTitleSection: { marginTop: d.sectionGap },
    jobTitle: { fontSize: 9, fontWeight: 'bold', color: '#666666', borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 6, paddingBottom: 3, marginBottom: 0, textTransform: 'uppercase' } as const,
    jobTitleDivider: { borderBottomWidth: 1, borderBottomColor: divider, marginBottom: 8 },
    photo: { width: 72, height: 72, borderRadius: 4, objectFit: 'cover' } as const,
    contactLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', fontSize: 8.5, marginBottom: 4 },
    contactItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    contactIcon: { marginTop: -1 },
    contactText: { fontSize: 8.5, color: DARK },
    contactDot: { fontSize: 14, color: divider, marginHorizontal: 6, marginTop: -2 },
    section: { marginTop: d.sectionGap },
    sectionTitle: { fontSize: 9, fontWeight: 'bold', color: accent, borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 6, paddingBottom: 3, marginBottom: 0, textTransform: 'uppercase' },
    divider: { borderBottomWidth: 1, borderBottomColor: divider, marginBottom: 8 },
    summaryText: { color: GRAY, fontSize: 9, lineHeight: d.lh },
    expItem: { },
    expItemGap: { marginTop: d.itemGap },
    expRole: { fontSize: 9.5, fontWeight: 'bold' },
    expMeta: { color: '#888888', fontSize: 8, marginTop: 4 },
    expDesc: { color: GRAY, fontSize: 8.5, marginTop: 4, lineHeight: d.lh },
    projLink: { color: accent, fontSize: 8.5, marginTop: 3 },
    eduItem: { },
    eduItemGap: { marginTop: d.itemGap },
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
        <View style={s.headerRow}>
          {cv.photo ? <View style={{ width: 72 }} /> : null}
          <Text style={s.name}>{personal.firstName} {personal.lastName}</Text>
          {cv.photo ? <Image src={cv.photo} style={s.photo} /> : null}
        </View>

        {/* Contact info under name: phone · city · email */}
        {(personal.phone || personal.email || personal.city || personal.country) && (
          <View style={s.contactLine}>
            {(() => {
              const items: React.ReactNode[] = []
              if (personal.phone) {
                items.push(
                  <View key="phone" style={s.contactItem}>
                    <View style={s.contactIcon}><IconPhone size={8} color={accentColor} /></View>
                    <Text style={s.contactText}>{personal.phone}</Text>
                  </View>
                )
              }
              if (personal.city || personal.country) {
                if (items.length > 0) items.push(<Text key="d1" style={s.contactDot}>·</Text>)
                items.push(
                  <View key="loc" style={s.contactItem}>
                    <View style={s.contactIcon}><IconHome size={8} color={accentColor} /></View>
                    <Text style={s.contactText}>{[personal.city, personal.country].filter(Boolean).join(', ')}</Text>
                  </View>
                )
              }
              if (personal.email) {
                if (items.length > 0) items.push(<Text key="d2" style={s.contactDot}>·</Text>)
                items.push(
                  <View key="email" style={s.contactItem}>
                    <View style={s.contactIcon}><IconMail size={8} color={accentColor} /></View>
                    <Text style={s.contactText}>{personal.email}</Text>
                  </View>
                )
              }
              return items
            })()}
          </View>
        )}
      </View>

      {/* Job title section */}
      {personal.jobTitle ? (
        <View style={s.jobTitleSection}>
          <Text style={s.jobTitle}>{personal.jobTitle}</Text>
          <View style={s.jobTitleDivider} />
          {/* Social links under job title divider */}
          {hasSocial && (
            <View style={s.contactLine}>
              {personal.linkedin && (
                <View style={s.contactItem}>
                  <View style={s.contactIcon}><IconLinkedIn size={8} color={accentColor} /></View>
                  <Text style={s.contactText}>{personal.linkedin}</Text>
                </View>
              )}
              {personal.github && (
                <View style={s.contactItem}>
                  <View style={s.contactIcon}><IconGitHub size={8} color={accentColor} /></View>
                  <Text style={s.contactText}>{personal.github}</Text>
                </View>
              )}
              {personal.portfolio && (
                <View style={s.contactItem}>
                  <View style={s.contactIcon}><IconGlobe size={8} color={accentColor} /></View>
                  <Text style={s.contactText}>{personal.portfolio}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      ) : null}

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
          {experiences.map((exp, i) => {
            const datePart = [exp.startDate, exp.current ? titles.present : exp.endDate].filter(Boolean).join(' – ')
            const meta = [exp.company, datePart].filter(Boolean).join('  ·  ')
            return (
              <View key={exp.id} style={[s.expItem, i > 0 && s.expItemGap]}>
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
          {projects.map((proj, i) => (
            <View key={proj.id} style={[s.expItem, i > 0 && s.expItemGap]}>
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
        <View style={s.section} wrap={false}>
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
        <View style={s.section} wrap={false}>
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
        <View style={s.section} wrap={false}>
          <Text style={s.sectionTitle}>{titles.education}</Text>
          <View style={s.divider} />
          {education.map((edu, i) => (
            <View key={edu.id} style={[s.eduItem, i > 0 && s.eduItemGap]}>
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
        <View style={s.section} wrap={false}>
          <Text style={s.sectionTitle}>{titles.certifications}</Text>
          <View style={s.divider} />
          {certifications.map((cert, i) => (
            <View key={cert.id} style={[s.eduItem, i > 0 && s.eduItemGap]}>
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
        <View style={s.section} wrap={false}>
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
    left: { width: '32%', backgroundColor: accent, paddingVertical: d.vPad, paddingHorizontal: 18, flexDirection: 'column' },
    right: { flex: 1, paddingVertical: d.vPad, paddingHorizontal: 22, flexDirection: 'column' },
    nameBlock: { marginBottom: 10 },
    name: { fontSize: 18, fontWeight: 'bold', color: '#fff', lineHeight: 1.2, width: '100%' },
    photo: { width: 76, height: 76, borderRadius: 4, marginBottom: 10, alignSelf: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.75)', objectFit: 'cover' } as const,
    jobTitle: { fontSize: 7.5, fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', marginTop: 4, borderBottomWidth: 1, borderBottomColor: divider, paddingBottom: 3, marginBottom: 0 } as const,
    leftNameSep: { borderBottomWidth: 1, borderBottomColor: divider, marginTop: 3, marginBottom: 8 },
    leftSection: { marginTop: 14 },
    leftSectionTitle: { fontSize: 7.5, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: divider, paddingBottom: 3, marginBottom: 8 },
    sidebarContactRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 },
    sidebarContactItem: { fontSize: 8, color: 'rgba(255,255,255,0.85)', marginTop: -0.5 },
    skillPillRow: { flexDirection: 'row', flexWrap: 'wrap' },
    langRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    langName: { fontSize: 8.5, fontWeight: 'bold', color: '#fff' },
    langLevel: { fontSize: 8, color: 'rgba(255,255,255,0.7)' },
    interestText: { fontSize: 8, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 },
    rightSection: { marginTop: 0 },
    rightSectionTitle: { fontSize: 9.5, fontWeight: 'bold', color: accent, textTransform: 'uppercase', borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 8, paddingBottom: 3, marginBottom: 0 },
    rightDivider: { borderBottomWidth: 1, borderBottomColor: divider, marginBottom: 8 },
    summaryText: { fontSize: 9, color: GRAY, lineHeight: d.lh },
    expItem: { },
    expItemGap: { marginTop: d.itemGap },
    expRole: { fontSize: 10, fontWeight: 'bold' },
    expMeta: { fontSize: 8.5, color: GRAY, marginTop: 4 },
    expDesc: { fontSize: 9, color: GRAY, marginTop: 4, lineHeight: d.lh },
    projLink: { fontSize: 8.5, color: accent, marginTop: 3 },
    eduItem: { },
    eduItemGap: { marginTop: d.itemGap },
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
        <View style={s.nameBlock}>
          <Text style={s.name}>{personal.firstName}</Text>
          <Text style={s.name}>{personal.lastName}</Text>
        </View>

        {cv.photo ? <Image src={cv.photo} style={s.photo} /> : null}

        {personal.jobTitle ? (
          <Text style={s.jobTitle}>{personal.jobTitle}</Text>
        ) : (personal.email || personal.phone || personal.city || personal.country || personal.linkedin || personal.github || personal.portfolio) ? (
          <View style={s.leftNameSep} />
        ) : null}

        {(personal.email || personal.phone || personal.city || personal.country || personal.linkedin || personal.github || personal.portfolio) && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>{titles.contact}</Text>
            {personal.phone ? (
              <View style={s.sidebarContactRow}>
                <IconPhone size={8} color="rgba(255,255,255,0.85)" />
                <Text style={s.sidebarContactItem}>{personal.phone}</Text>
              </View>
            ) : null}
            {personal.email ? (
              <View style={s.sidebarContactRow}>
                <IconMail size={8} color="rgba(255,255,255,0.85)" />
                <Text style={s.sidebarContactItem}>{personal.email}</Text>
              </View>
            ) : null}
            {(personal.city || personal.country) ? (
              <View style={s.sidebarContactRow}>
                <IconHome size={8} color="rgba(255,255,255,0.85)" />
                <Text style={s.sidebarContactItem}>{[personal.city, personal.country].filter(Boolean).join(', ')}</Text>
              </View>
            ) : null}
            {personal.linkedin ? (
              <View style={s.sidebarContactRow}>
                <IconLinkedIn size={8} color="rgba(255,255,255,0.85)" />
                <Text style={s.sidebarContactItem}>{personal.linkedin}</Text>
              </View>
            ) : null}
            {personal.github ? (
              <View style={s.sidebarContactRow}>
                <IconGitHub size={8} color="rgba(255,255,255,0.85)" />
                <Text style={s.sidebarContactItem}>{personal.github}</Text>
              </View>
            ) : null}
            {personal.portfolio ? (
              <View style={s.sidebarContactRow}>
                <IconGlobe size={8} color="rgba(255,255,255,0.85)" />
                <Text style={s.sidebarContactItem}>{personal.portfolio}</Text>
              </View>
            ) : null}
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
            {experiences.map((exp, i) => {
              const datePart = [exp.startDate, exp.current ? titles.present : exp.endDate].filter(Boolean).join(' – ')
              const meta = [exp.company, datePart].filter(Boolean).join('  ·  ')
              return (
                <View key={exp.id} style={[s.expItem, i > 0 && s.expItemGap]}>
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
            {projects.map((proj, i) => (
              <View key={proj.id} style={[s.expItem, i > 0 && s.expItemGap]}>
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
            {education.map((edu, i) => (
              <View key={edu.id} style={[s.eduItem, i > 0 && s.eduItemGap]}>
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
            {certifications.map((cert, i) => (
              <View key={cert.id} style={[s.eduItem, i > 0 && s.eduItemGap]}>
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
