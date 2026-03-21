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

const DENSITY_CONFIG = {
  compact: { vPad: 28, hPad: 36, sectionMb: 10, itemMb: 6,  lh: 1.3 },
  normal:  { vPad: 36, hPad: 44, sectionMb: 14, itemMb: 10, lh: 1.5 },
  airy:    { vPad: 46, hPad: 52, sectionMb: 18, itemMb: 14, lh: 1.7 },
}

// ─── Single-column layout ────────────────────────────────────────────────────

function singleStyles(accent: string, d: typeof DENSITY_CONFIG['normal']) {
  return StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: DARK, paddingTop: d.vPad, paddingBottom: d.vPad, paddingHorizontal: d.hPad, lineHeight: d.lh },
    name: { fontSize: 26, fontWeight: 'bold', marginBottom: 3 },
    jobTitle: { fontSize: 13, color: accent, marginBottom: 8 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', color: GRAY, fontSize: 9, marginBottom: 4 },
    sep: { color: LIGHT_GRAY, marginHorizontal: 4 },
    section: { marginBottom: d.sectionMb },
    sectionTitle: { fontSize: 11, fontWeight: 'bold', color: accent, borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 7, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
    divider: { borderBottomWidth: 1, borderBottomColor: LIGHT_GRAY, marginBottom: 8 },
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
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    skillItem: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#EEF2FF', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 4 },
    skillName: { fontSize: 9, fontWeight: 'bold' },
    skillDots: { flexDirection: 'row', gap: 2, alignItems: 'center' },
    dot: { width: 4, height: 4, borderRadius: 2 },
    langRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    langItem: { flexDirection: 'row', gap: 4 },
    langName: { fontSize: 9.5, fontWeight: 'bold' },
    langLevel: { fontSize: 9.5, color: GRAY },
    interestTag: { fontSize: 9, color: GRAY, backgroundColor: '#F3F4F6', paddingVertical: 2, paddingHorizontal: 7, borderRadius: 4 },
    interestRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  })
}

function SingleLayout({ cv }: { cv: CVData }) {
  const { personal, experiences, education, skills, languages, template, projects, certifications, interests } = cv
  const { accentColor, hiddenSections, density } = template
  const d = DENSITY_CONFIG[density ?? 'normal']
  const s = singleStyles(accentColor, d)
  const font = template.font
  const isHidden = (key: SectionKey) => hiddenSections?.includes(key)

  const addressParts = [
    personal.street,
    [personal.postalCode, personal.city].filter(Boolean).join(' '),
    personal.country,
  ].filter(Boolean)
  const address = addressParts.join(', ')
  const contact = [personal.email, personal.phone, address].filter(Boolean)
  const social = [
    personal.linkedin && `LinkedIn: ${personal.linkedin}`,
    personal.github && `GitHub: ${personal.github}`,
    personal.portfolio && personal.portfolio,
  ].filter(Boolean) as string[]

  return (
    <Page size="A4" style={[s.page, { fontFamily: font }]}>
      <Text style={s.name}>{personal.firstName} {personal.lastName}</Text>
      {personal.jobTitle ? <Text style={s.jobTitle}>{personal.jobTitle}</Text> : null}
      {contact.length > 0 && (
        <View style={s.contactRow}>
          {contact.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row' }}>
              {i > 0 && <Text style={s.sep}> | </Text>}
              <Text>{c}</Text>
            </View>
          ))}
        </View>
      )}
      {social.length > 0 && (
        <View style={[s.contactRow, { marginBottom: 14 }]}>
          {social.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row' }}>
              {i > 0 && <Text style={s.sep}> | </Text>}
              <Text>{c}</Text>
            </View>
          ))}
        </View>
      )}
      {contact.length > 0 && social.length === 0 && <View style={{ marginBottom: 14 }} />}

      {!isHidden('summary') && personal.summary ? (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Profil</Text>
          <View style={s.divider} />
          <Text style={s.summaryText}>{personal.summary}</Text>
        </View>
      ) : null}

      {!isHidden('experiences') && experiences.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Expériences professionnelles</Text>
          <View style={s.divider} />
          {experiences.map((exp) => (
            <View key={exp.id} style={s.expItem}>
              <View style={s.expHeader}>
                <Text style={s.expRole}>{exp.role}</Text>
                <Text style={s.expMeta}>{exp.company}{exp.company && exp.startDate ? '  ·  ' : ''}{exp.startDate}{exp.startDate && (exp.current || exp.endDate) ? ' – ' : ''}{exp.current ? 'Présent' : exp.endDate}</Text>
              </View>
              {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {!isHidden('projects') && projects.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Projets</Text>
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
          <Text style={s.sectionTitle}>Formation</Text>
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
          <Text style={s.sectionTitle}>Certifications</Text>
          <View style={s.divider} />
          {certifications.map((cert) => (
            <View key={cert.id} style={s.eduItem}>
              <View style={s.eduHeader}>
                <Text style={s.eduDegree}>{cert.name}</Text>
                {cert.year ? <Text style={s.eduYear}>{cert.year}</Text> : null}
              </View>
              {cert.issuer ? <Text style={s.eduSchool}>{cert.issuer}</Text> : null}
            </View>
          ))}
        </View>
      )}

      {!isHidden('skills') && skills.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Compétences</Text>
          <View style={s.divider} />
          <View style={s.skillsGrid}>
            {skills.map((skill, i) => (
              <View key={i} style={s.skillItem}>
                <Text style={[s.skillName, { color: accentColor }]}>{skill.name}</Text>
                {skill.level > 0 && (
                  <View style={s.skillDots}>
                    {[1, 2, 3, 4, 5].map((dd) => (
                      <View key={dd} style={[s.dot, { backgroundColor: dd <= skill.level ? accentColor : LIGHT_GRAY }]} />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {!isHidden('languages') && languages.length > 0 && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Langues</Text>
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
          <Text style={s.sectionTitle}>{"Centres d'intérêt"}</Text>
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

function sidebarStyles(accent: string, d: typeof DENSITY_CONFIG['normal']) {
  return StyleSheet.create({
    page: { fontFamily: 'Helvetica', fontSize: 10, color: DARK, flexDirection: 'row' },
    left: { width: '35%', backgroundColor: accent, paddingVertical: d.vPad, paddingHorizontal: 16, flexDirection: 'column', gap: 14 },
    right: { flex: 1, paddingVertical: d.vPad, paddingHorizontal: 20, flexDirection: 'column', gap: d.sectionMb },
    name: { fontSize: 18, fontWeight: 'bold', color: '#fff', lineHeight: 1.3 },
    photo: { width: 72, height: 72, borderRadius: 36, marginBottom: 8, alignSelf: 'center' },
    jobTitle: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
    contactItem: { fontSize: 8.5, color: 'rgba(255,255,255,0.85)', marginTop: 3 },
    leftSection: { marginTop: 4 },
    leftSectionTitle: { fontSize: 9, fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: '#ffffff', paddingBottom: 3, marginBottom: 6 },
    leftText: { fontSize: 9, color: 'rgba(255,255,255,0.85)', lineHeight: d.lh },
    skillRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    skillName: { fontSize: 9, color: '#fff' },
    skillDots: { flexDirection: 'row', gap: 2 },
    dot: { width: 4, height: 4, borderRadius: 2 },
    langRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 },
    langName: { fontSize: 9, fontWeight: 'bold', color: '#fff' },
    langLevel: { fontSize: 8.5, color: 'rgba(255,255,255,0.7)' },
    rightSectionTitle: { fontSize: 11, fontWeight: 'bold', color: accent, textTransform: 'uppercase', letterSpacing: 0.8, borderBottomWidth: 1, borderBottomColor: LIGHT_GRAY, paddingBottom: 3, marginBottom: 8 },
    summaryText: { fontSize: 9.5, color: GRAY, lineHeight: d.lh },
    expItem: { marginBottom: d.itemMb },
    expRole: { fontSize: 10.5, fontWeight: 'bold' },
    expMeta: { fontSize: 9, color: GRAY, marginTop: 1 },
    expDesc: { fontSize: 9.5, color: GRAY, marginTop: 3, lineHeight: d.lh },
    projLink: { fontSize: 8.5, color: accent, marginTop: 2 },
    eduDegree: { fontSize: 10.5, fontWeight: 'bold' },
    eduMeta: { fontSize: 9, color: GRAY, marginTop: 1 },
    interestText: { fontSize: 8.5, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 },
  })
}

function SidebarLayout({ cv }: { cv: CVData }) {
  const { personal, experiences, education, skills, languages, template, projects, certifications, interests } = cv
  const { accentColor, hiddenSections, density } = template
  const d = DENSITY_CONFIG[density ?? 'normal']
  const s = sidebarStyles(accentColor, d)
  const font = template.font
  const isHidden = (key: SectionKey) => hiddenSections?.includes(key)

  return (
    <Page size="A4" style={[s.page, { fontFamily: font }]}>
      {/* Left column */}
      <View style={s.left}>
        {cv.photo ? <Image src={cv.photo} style={s.photo} /> : null}
        <View>
          <Text style={s.name}>{personal.firstName}{'\n'}{personal.lastName}</Text>
          {personal.jobTitle ? <Text style={s.jobTitle}>{personal.jobTitle}</Text> : null}
        </View>
        {(personal.email || personal.phone || personal.street || personal.city || personal.country || personal.linkedin || personal.github || personal.portfolio) && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>Contact</Text>
            {personal.email ? <Text style={s.contactItem}>{personal.email}</Text> : null}
            {personal.phone ? <Text style={s.contactItem}>{personal.phone}</Text> : null}
            {personal.street ? <Text style={s.contactItem}>{personal.street}</Text> : null}
            {(personal.postalCode || personal.city) ? <Text style={s.contactItem}>{[personal.postalCode, personal.city].filter(Boolean).join(' ')}</Text> : null}
            {personal.country ? <Text style={s.contactItem}>{personal.country}</Text> : null}
            {personal.linkedin ? <Text style={s.contactItem}>in: {personal.linkedin}</Text> : null}
            {personal.github ? <Text style={s.contactItem}>gh: {personal.github}</Text> : null}
            {personal.portfolio ? <Text style={s.contactItem}>{personal.portfolio}</Text> : null}
          </View>
        )}
        {!isHidden('skills') && skills.length > 0 && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>Compétences</Text>
            {skills.map((skill, i) => (
              <View key={i} style={s.skillRow}>
                <Text style={s.skillName}>{skill.name}</Text>
                {skill.level > 0 && (
                  <View style={s.skillDots}>
                    {[1, 2, 3, 4, 5].map((dd) => (
                      <View key={dd} style={[s.dot, { backgroundColor: dd <= skill.level ? '#fff' : 'rgba(255,255,255,0.3)' }]} />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        {!isHidden('languages') && languages.length > 0 && (
          <View style={s.leftSection}>
            <Text style={s.leftSectionTitle}>Langues</Text>
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
            <Text style={s.leftSectionTitle}>{"Centres d'intérêt"}</Text>
            <Text style={s.interestText}>{interests.join('  ·  ')}</Text>
          </View>
        )}
      </View>

      {/* Right column */}
      <View style={s.right}>
        {!isHidden('summary') && personal.summary ? (
          <View>
            <Text style={s.rightSectionTitle}>Profil</Text>
            <Text style={s.summaryText}>{personal.summary}</Text>
          </View>
        ) : null}
        {!isHidden('experiences') && experiences.length > 0 && (
          <View>
            <Text style={s.rightSectionTitle}>Expériences professionnelles</Text>
            {experiences.map((exp) => (
              <View key={exp.id} style={s.expItem}>
                <Text style={s.expRole}>{exp.role}</Text>
                <Text style={s.expMeta}>{exp.company}{exp.company && exp.startDate ? '  ·  ' : ''}{exp.startDate}{exp.startDate && (exp.current || exp.endDate) ? ' – ' : ''}{exp.current ? 'Présent' : exp.endDate}</Text>
                {exp.description ? <Text style={s.expDesc}>{exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}
        {!isHidden('projects') && projects.length > 0 && (
          <View>
            <Text style={s.rightSectionTitle}>Projets</Text>
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
            <Text style={s.rightSectionTitle}>Formation</Text>
            {education.map((edu) => (
              <View key={edu.id} style={{ marginBottom: d.itemMb - 2 }}>
                <Text style={s.eduDegree}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</Text>
                <Text style={s.eduMeta}>{edu.school}{edu.school && edu.year ? '  ·  ' : ''}{edu.year}</Text>
              </View>
            ))}
          </View>
        )}
        {!isHidden('certifications') && certifications.length > 0 && (
          <View>
            <Text style={s.rightSectionTitle}>Certifications</Text>
            {certifications.map((cert) => (
              <View key={cert.id} style={{ marginBottom: d.itemMb - 2 }}>
                <Text style={s.eduDegree}>{cert.name}</Text>
                <Text style={s.eduMeta}>{cert.issuer}{cert.issuer && cert.year ? '  ·  ' : ''}{cert.year}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CVDocument({ cv }: { cv: CVData }) {
  return (
    <Document>
      {cv.template.layout === 'sidebar'
        ? <SidebarLayout cv={cv} />
        : <SingleLayout cv={cv} />
      }
    </Document>
  )
}
