'use client'

import { Document, Page, Text, View, Image, Font, StyleSheet, Link, Svg, Path } from '@react-pdf/renderer'
import type { CVData, SectionKey } from '@/types/cv'

// ─── Zone 2: Font Registration ────────────────────────────────────────────────

const CUSTOM_FONTS = [
  { family: 'Roboto', regular: '/fonts/Roboto-Regular.ttf', bold: '/fonts/Roboto-Bold.ttf' },
  { family: 'Lato', regular: '/fonts/Lato-Regular.ttf', bold: '/fonts/Lato-Bold.ttf' },
  { family: 'Montserrat', regular: '/fonts/Montserrat-Regular.ttf', bold: '/fonts/Montserrat-Bold.ttf' },
  { family: 'Raleway', regular: '/fonts/Raleway-Regular.ttf', bold: '/fonts/Raleway-Bold.ttf' },
  { family: 'Playfair Display', regular: '/fonts/PlayfairDisplay-Regular.ttf', bold: '/fonts/PlayfairDisplay-Bold.ttf' },
  { family: 'Merriweather', regular: '/fonts/Merriweather-Regular.ttf', bold: '/fonts/Merriweather-Bold.ttf' },
]

CUSTOM_FONTS.forEach(({ family, regular, bold }) => {
  Font.register({
    family,
    fonts: [
      { src: regular, fontWeight: 'normal' },
      { src: bold, fontWeight: 'bold' },
    ],
  })
})

// ─── Zone 3: Spacing Token System ─────────────────────────────────────────────

interface SpacingTokens {
  pagePaddingH: number
  pagePaddingV: number
  sectionGap: number
  itemGap: number
  headerToContent: number
  lineGap: number
  dividerTitleGap: number
}

const DENSITY_TOKENS: Record<'compact' | 'normal' | 'airy', SpacingTokens> = {
  compact: {
    pagePaddingH: 28,
    pagePaddingV: 24,
    sectionGap: 13,
    itemGap: 8,
    headerToContent: 6,
    lineGap: 2,
    dividerTitleGap: 1,
  },
  normal: {
    pagePaddingH: 32,
    pagePaddingV: 28,
    sectionGap: 18,
    itemGap: 11,
    headerToContent: 8,
    lineGap: 3,
    dividerTitleGap: 1,
  },
  airy: {
    pagePaddingH: 36,
    pagePaddingV: 34,
    sectionGap: 24,
    itemGap: 15,
    headerToContent: 11,
    lineGap: 4,
    dividerTitleGap: 2,
  },
}

// ─── Zone 4: Helper Functions ──────────────────────────────────────────────────

function cleanUrl(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

function darkenColor(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const dr = Math.round(r * factor)
    .toString(16)
    .padStart(2, '0')
  const dg = Math.round(g * factor)
    .toString(16)
    .padStart(2, '0')
  const db = Math.round(b * factor)
    .toString(16)
    .padStart(2, '0')
  return `#${dr}${dg}${db}`
}

function parseDateValue(dateStr: string): number {
  if (!dateStr) return 0
  const parts = dateStr.trim().split(' ')
  const year = parseInt(parts[parts.length - 1], 10) || 0
  return year
}

function sortByDateDesc<T extends { startDate?: string; year?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const dateA = parseDateValue(a.startDate || a.year || '')
    const dateB = parseDateValue(b.startDate || b.year || '')
    return dateB - dateA
  })
}

// ─── Zone 5: StyleSheet Factory ────────────────────────────────────────────────

function optionalOrFallback(template: CVData['template'], fallback: string): string {
  return template.useOptionalColor ? template.jobTitleColor : fallback
}

function _buildStyles(template: CVData['template']) {
  const sp = DENSITY_TOKENS[template.density]
  const sidebarBg = darkenColor(template.accentColor, 0.4)

  return StyleSheet.create({
    // Page
    page: {
      fontFamily: template.font,
      backgroundColor: '#FFFFFF',
      paddingHorizontal: sp.pagePaddingH,
      paddingTop: sp.pagePaddingV,
      paddingBottom: sp.pagePaddingV,
    },
    pageNopadding: {
      fontFamily: template.font,
      backgroundColor: '#FFFFFF',
      padding: 0,
    },

    // Typography — Header/Name
    name: {
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 3,
      color: '#000000',
    },
    jobTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#000000',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 4,
    },
    contactLine: {
      fontSize: 8,
      color: template.accentColor,
      textAlign: 'center',
    },
    socialLink: {
      fontSize: 8,
      color: template.accentColor,
      textDecoration: 'none',
    },

    // Typography — Sections
    sectionTitle: {
      fontSize: 9,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: '#1E293B',
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    accentBar: {
      width: 3,
      height: 13,
      backgroundColor: template.accentColor,
      borderRadius: 1.5,
      marginRight: 6,
    },
    dividerLine: {
      height: 0.75,
      backgroundColor: template.dividerColor,
      marginTop: sp.dividerTitleGap,
    },

    // Typography — Items
    itemTitle: {
      fontSize: 9.5,
      fontWeight: 'bold',
      color: '#1E293B',
    },
    itemSubtitle: {
      fontSize: 8.5,
      color: '#64748B',
    },
    bodyText: {
      fontSize: 8.5,
      color: '#374151',
      lineHeight: 1.5,
    },
    metaText: {
      fontSize: 8,
      color: '#94A3B8',
    },

    // Skills
    skillPill: {
      borderWidth: 1,
      borderColor: '#CBD5E1',
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginBottom: 3,
      marginRight: 3,
    },
    skillPillText: {
      fontSize: 7.5,
      color: '#374151',
    },

    // Sidebar layout
    sidebarContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    sidebarBg: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '30%',
      backgroundColor: sidebarBg,
    },
    sidebar: {
      width: '30%',
      paddingHorizontal: 18,
      paddingTop: sp.pagePaddingV + 16,
      paddingBottom: 18,
      color: '#FFFFFF',
    },
    mainColumn: {
      flex: 1,
      paddingLeft: sp.pagePaddingH * 0.75,
      paddingRight: sp.pagePaddingH,
      paddingTop: sp.pagePaddingV + 16,
    },
    photo: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignSelf: 'center',
    },
    sidebarName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginTop: 10,
      textAlign: 'center',
    },
    sidebarJobTitle: {
      fontSize: 8.5,
      color: 'rgba(255, 255, 255, 0.7)',
      marginTop: 2,
      textAlign: 'center',
    },
    sidebarSectionTitle: {
      fontSize: 8,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: 'rgba(255, 255, 255, 0.55)',
    },
    sidebarDivider: {
      height: 0.75,
      backgroundColor: template.dividerColor,
    },
    sidebarBodyText: {
      fontSize: 8,
      color: 'rgba(255, 255, 255, 0.85)',
      lineHeight: 1.4,
      textDecoration: 'none',
    },
    sidebarItemTitle: {
      fontSize: 8.5,
      fontWeight: 'bold',
      color: 'rgba(255, 255, 255, 0.7)',
    },
  })
}

type Styles = ReturnType<typeof _buildStyles>

let _lastTemplate: CVData['template'] | null = null
let _lastStyles: Styles | null = null

function makeStyles(template: CVData['template']): Styles {
  if (_lastTemplate === template) return _lastStyles!
  _lastTemplate = template
  _lastStyles = _buildStyles(template)
  return _lastStyles
}

// ─── Zone 6: Primitive Components ──────────────────────────────────────────────

function Dot({ styles }: { styles: Styles }) {
  return <Text style={[styles.contactLine, { marginHorizontal: 4 }]}>·</Text>
}

const SOCIAL_PATHS = {
  linkedin:
    'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z',
  github:
    'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z',
  globe:
    'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  phone:
    'M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z',
  email:
    'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  location:
    'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
} as const

type SocialIconType = keyof typeof SOCIAL_PATHS

function SocialIcon({ type, size = 8, color }: { type: SocialIconType; size?: number; color: string }) {
  return (
    <Svg viewBox="0 0 24 24" style={{ width: size, height: size, marginRight: 3 }}>
      <Path fill={color} d={SOCIAL_PATHS[type]} />
    </Svg>
  )
}

function SectionHeader({ title, styles }: { title: string; styles: Styles }) {
  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.accentBar} />
        <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
      </View>
      <View style={styles.dividerLine} />
    </View>
  )
}

function SidebarSectionHeader({ title, styles, sp }: { title: string; styles: Styles; sp: SpacingTokens }) {
  return (
    <View style={{ marginTop: sp.sectionGap }}>
      <Text style={styles.sidebarSectionTitle}>{title.toUpperCase()}</Text>
      <View style={[styles.sidebarDivider, { marginTop: sp.dividerTitleGap, marginBottom: sp.lineGap }]} />
    </View>
  )
}

function LevelDots({ level, accentColor }: { level: number; accentColor: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <View
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: i <= level ? accentColor : '#E2E8F0',
          }}
        />
      ))}
    </View>
  )
}

// ─── Zone 7: Section Item Components ───────────────────────────────────────────

function ExperienceItem({
  exp,
  styles,
  sp,
  presentLabel,
  isFirst,
}: {
  exp: CVData['experiences'][number]
  styles: Styles
  sp: SpacingTokens
  presentLabel: string
  isFirst: boolean
}) {
  const dateRange = [exp.startDate, exp.current ? presentLabel : exp.endDate].filter(Boolean).join(' – ')
  return (
    <View style={isFirst ? undefined : { marginTop: sp.itemGap }} wrap={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={styles.itemTitle}>{exp.role}</Text>
      </View>
      <Text style={[styles.itemSubtitle, { marginTop: 1 }]}>{[exp.company, dateRange].filter(Boolean).join('  ·  ')}</Text>
      {exp.description ? <Text style={[styles.bodyText, { marginTop: sp.lineGap + 2 }]}>{exp.description}</Text> : null}
    </View>
  )
}

function EducationItem({
  edu,
  styles,
  sp,
  isFirst,
}: {
  edu: CVData['education'][number]
  styles: Styles
  sp: SpacingTokens
  isFirst: boolean
}) {
  const degreeField = [edu.degree, edu.field].filter(Boolean).join(' — ')
  return (
    <View style={isFirst ? undefined : { marginTop: sp.itemGap }} wrap={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={styles.itemTitle}>{degreeField}</Text>
        {edu.year ? <Text style={styles.metaText}>{edu.year}</Text> : null}
      </View>
      {edu.school ? <Text style={styles.itemSubtitle}>{edu.school}</Text> : null}
    </View>
  )
}

function ProjectItem({
  project,
  styles,
  sp,
  isFirst,
}: {
  project: CVData['projects'][number]
  styles: Styles
  sp: SpacingTokens
  isFirst: boolean
}) {
  return (
    <View style={isFirst ? undefined : { marginTop: sp.itemGap }} wrap={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        {project.url ? (
          <Link src={project.url} style={[styles.itemTitle, { textDecoration: 'none' }]}>
            {project.name}
          </Link>
        ) : (
          <Text style={styles.itemTitle}>{project.name}</Text>
        )}
        {project.year ? <Text style={styles.metaText}>{project.year}</Text> : null}
      </View>
      {project.description ? <Text style={[styles.bodyText, { marginTop: sp.lineGap }]}>{project.description}</Text> : null}
    </View>
  )
}

function CertificationItem({
  cert,
  styles,
  sp,
  isFirst,
}: {
  cert: CVData['certifications'][number]
  styles: Styles
  sp: SpacingTokens
  isFirst: boolean
}) {
  return (
    <View style={isFirst ? undefined : { marginTop: sp.itemGap }} wrap={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={styles.itemTitle}>{cert.name}</Text>
        {cert.year ? <Text style={styles.metaText}>{cert.year}</Text> : null}
      </View>
      {cert.issuer ? <Text style={styles.itemSubtitle}>{cert.issuer}</Text> : null}
    </View>
  )
}

function SkillsPills({ skills, styles }: { skills: CVData['skills']; styles: Styles }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {skills.map((skill, i) => (
        <View key={i} style={styles.skillPill}>
          <Text style={styles.skillPillText}>{skill.name}</Text>
        </View>
      ))}
    </View>
  )
}

function LanguageItems({ languages, styles, sp }: { languages: CVData['languages']; styles: Styles; sp: SpacingTokens }) {
  return (
    <View>
      {languages.map((lang, i) => (
        <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', ...(i > 0 && { marginTop: sp.lineGap }) }}>
          <Text style={styles.itemTitle}>{lang.name}</Text>
          <Text style={styles.itemSubtitle}>{lang.level}</Text>
        </View>
      ))}
    </View>
  )
}

function InterestsLine({ interests, styles }: { interests: string[]; styles: Styles }) {
  const filtered = interests.filter(Boolean)
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {filtered.map((item, i) => (
        <View key={i} wrap={false} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {i > 0 && <Dot styles={styles} />}
          <Text style={styles.bodyText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function Header({ personal, styles, sp, secondaryColor }: { personal: CVData['personal']; styles: Styles; sp: SpacingTokens; secondaryColor: string }) {
  const locationValue = [personal.city, personal.country].filter(Boolean).join(', ')
  const contactItems = [
    personal.phone && { value: personal.phone, icon: 'phone' as SocialIconType },
    locationValue && { value: locationValue, icon: 'location' as SocialIconType },
    personal.email && { value: personal.email, icon: 'email' as SocialIconType },
  ].filter(Boolean) as { value: string; icon: SocialIconType }[]
  const socialLinks = [
    personal.linkedin && { label: cleanUrl(personal.linkedin), url: personal.linkedin, icon: 'linkedin' as SocialIconType },
    personal.github && { label: cleanUrl(personal.github), url: personal.github, icon: 'github' as SocialIconType },
    personal.portfolio && { label: cleanUrl(personal.portfolio), url: personal.portfolio, icon: 'globe' as SocialIconType },
  ].filter(Boolean) as { label: string; url: string; icon: SocialIconType }[]

  return (
    <View style={{ marginTop: 16, marginBottom: sp.sectionGap }}>
      <Text style={styles.name}>
        {personal.firstName} {personal.lastName}
      </Text>
      {contactItems.length > 0 && (
        <>
          <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            {contactItems.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                {i > 0 && <Dot styles={styles} />}
                <SocialIcon type={item.icon} size={8} color={secondaryColor} />
                <Text style={styles.contactLine}>{item.value}</Text>
              </View>
            ))}
          </View>
          <View style={{ height: 0.5, backgroundColor: '#000000', width: '8%', alignSelf: 'center', marginTop: 5 }} />
        </>
      )}
      {personal.jobTitle && <Text style={styles.jobTitle}>{personal.jobTitle}</Text>}
      {socialLinks.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
          {socialLinks.map(({ label, url, icon }, i) => (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 && <Dot styles={styles} />}
              <SocialIcon type={icon} size={8} color={secondaryColor} />
              <Link src={url} style={styles.socialLink}>
                {label}
              </Link>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

// ─── Zone 9: SingleLayout ─────────────────────────────────────────────────────

interface LayoutProps {
  cv: CVData
  sectionTitles: Record<string, string>
  styles: Styles
  sp: SpacingTokens
}

function SingleLayout({ cv, sectionTitles, styles, sp }: LayoutProps) {
  const { personal, skills, languages, interests, template } = cv
  const experiences = sortByDateDesc(cv.experiences)
  const projects = sortByDateDesc(cv.projects)
  const education = sortByDateDesc(cv.education)
  const certifications = sortByDateDesc(cv.certifications)
  const { hiddenSections } = template

  const summaryVisible = !hiddenSections.includes('summary') && !!personal.summary.trim()
  const isVisible = (key: SectionKey, items: unknown[]): boolean => !hiddenSections.includes(key) && items.length > 0

  return (
    <Page size="A4" style={styles.page}>
      <Header personal={personal} styles={styles} sp={sp} secondaryColor={template.accentColor} />

      {summaryVisible && (
        <View wrap={false} style={{ marginBottom: sp.sectionGap }}>
          <SectionHeader title={sectionTitles.profile} styles={styles} />
          <Text style={[styles.bodyText, { marginTop: sp.headerToContent }]}>{personal.summary}</Text>
        </View>
      )}

      {isVisible('experiences', experiences) && (
        <View style={{ marginBottom: sp.sectionGap }}>
          {experiences.map((exp, i) =>
            i === 0 ? (
              <View key={exp.id} wrap={false}>
                <SectionHeader title={sectionTitles.experience} styles={styles} />
                <View style={{ marginTop: sp.headerToContent }}>
                  <ExperienceItem exp={exp} styles={styles} sp={sp} presentLabel={sectionTitles.present} isFirst />
                </View>
              </View>
            ) : (
              <ExperienceItem key={exp.id} exp={exp} styles={styles} sp={sp} presentLabel={sectionTitles.present} isFirst={false} />
            ),
          )}
        </View>
      )}

      {isVisible('projects', projects) && (
        <View style={{ marginBottom: sp.sectionGap }}>
          {projects.map((proj, i) =>
            i === 0 ? (
              <View key={proj.id} wrap={false}>
                <SectionHeader title={sectionTitles.projects} styles={styles} />
                <View style={{ marginTop: sp.headerToContent }}>
                  <ProjectItem project={proj} styles={styles} sp={sp} isFirst />
                </View>
              </View>
            ) : (
              <ProjectItem key={proj.id} project={proj} styles={styles} sp={sp} isFirst={false} />
            ),
          )}
        </View>
      )}

      {isVisible('education', education) && (
        <View style={{ marginBottom: sp.sectionGap }}>
          {education.map((edu, i) =>
            i === 0 ? (
              <View key={edu.id} wrap={false}>
                <SectionHeader title={sectionTitles.education} styles={styles} />
                <View style={{ marginTop: sp.headerToContent }}>
                  <EducationItem edu={edu} styles={styles} sp={sp} isFirst />
                </View>
              </View>
            ) : (
              <EducationItem key={edu.id} edu={edu} styles={styles} sp={sp} isFirst={false} />
            ),
          )}
        </View>
      )}

      {isVisible('certifications', certifications) && (
        <View style={{ marginBottom: sp.sectionGap }}>
          {certifications.map((cert, i) =>
            i === 0 ? (
              <View key={cert.id} wrap={false}>
                <SectionHeader title={sectionTitles.certifications} styles={styles} />
                <View style={{ marginTop: sp.headerToContent }}>
                  <CertificationItem cert={cert} styles={styles} sp={sp} isFirst />
                </View>
              </View>
            ) : (
              <CertificationItem key={cert.id} cert={cert} styles={styles} sp={sp} isFirst={false} />
            ),
          )}
        </View>
      )}

      {isVisible('skills', skills) && (
        <View wrap={false} style={{ marginBottom: sp.sectionGap }}>
          <SectionHeader title={sectionTitles.skills} styles={styles} />
          <View style={{ marginTop: sp.headerToContent }}>
            <SkillsPills skills={skills} styles={styles} />
          </View>
        </View>
      )}

      {isVisible('languages', languages) && (
        <View wrap={false} style={{ marginBottom: sp.sectionGap }}>
          <SectionHeader title={sectionTitles.languages} styles={styles} />
          <View style={{ marginTop: sp.headerToContent }}>
            <LanguageItems languages={languages} styles={styles} sp={sp} />
          </View>
        </View>
      )}

      {isVisible('interests', interests) && (
        <View wrap={false} style={{ marginBottom: sp.sectionGap }}>
          <SectionHeader title={sectionTitles.interests} styles={styles} />
          <View style={{ marginTop: sp.headerToContent }}>
            <InterestsLine interests={interests} styles={styles} />
          </View>
        </View>
      )}
    </Page>
  )
}

// ─── Zone 10: SidebarLayout ───────────────────────────────────────────────────

function SidebarLayout({ cv, sectionTitles, styles, sp }: LayoutProps) {
  const { personal, skills, languages, interests, photo, template } = cv
  const experiences = sortByDateDesc(cv.experiences)
  const projects = sortByDateDesc(cv.projects)
  const education = sortByDateDesc(cv.education)
  const certifications = sortByDateDesc(cv.certifications)
  const { hiddenSections } = template

  const summaryVisible = !hiddenSections.includes('summary') && !!personal.summary.trim()
  const isVisible = (key: SectionKey, items: unknown[]): boolean => !hiddenSections.includes(key) && items.length > 0

  const contactItems = [
    personal.phone && { value: personal.phone, icon: 'phone' as SocialIconType },
    personal.email && { value: personal.email, icon: 'email' as SocialIconType },
    (personal.city || personal.country) && { value: [personal.city, personal.country].filter(Boolean).join(', '), icon: 'location' as SocialIconType },
    personal.linkedin && { url: personal.linkedin, value: cleanUrl(personal.linkedin), icon: 'linkedin' as SocialIconType },
    personal.github && { url: personal.github, value: cleanUrl(personal.github), icon: 'github' as SocialIconType },
    personal.portfolio && { url: personal.portfolio, value: cleanUrl(personal.portfolio), icon: 'globe' as SocialIconType },
  ].filter(Boolean) as { url?: string; value: string; icon?: SocialIconType }[]

  return (
    <Page size="A4" style={styles.pageNopadding}>
      <View style={styles.sidebarBg} fixed />
      <View style={styles.sidebarContainer}>
        {/* LEFT SIDEBAR */}
        <View style={styles.sidebar}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {photo && <Image src={photo} style={styles.photo} />}
          <Text style={styles.sidebarName}>{personal.firstName}</Text>
          <Text style={[styles.sidebarName, { marginTop: 2 }]}>{personal.lastName}</Text>
          <View style={{ height: 0.75, backgroundColor: template.dividerColor, width: '18%', alignSelf: 'center', marginTop: 6 }} />
          {personal.jobTitle && <Text style={[styles.sidebarJobTitle, { marginTop: 6 }]}>{personal.jobTitle}</Text>}

          {/* Contact block */}
          {contactItems.length > 0 && (
            <>
              <SidebarSectionHeader title={sectionTitles.contact} styles={styles} sp={sp} />
              {contactItems.map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', ...(i > 0 && { marginTop: sp.lineGap }) }}>
                  {item.icon && <SocialIcon type={item.icon} size={7} color="#FFFFFF" />}
                  {item.url ? (
                    <Link src={item.url} style={styles.sidebarBodyText}>
                      {item.value}
                    </Link>
                  ) : (
                    <Text style={styles.sidebarBodyText}>{item.value}</Text>
                  )}
                </View>
              ))}
            </>
          )}

          {/* Skills */}
          {isVisible('skills', skills) && (
            <>
              <SidebarSectionHeader title={sectionTitles.skills} styles={styles} sp={sp} />
              {skills.map((skill, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...(i > 0 && { marginTop: sp.lineGap }) }}>
                  <Text style={styles.sidebarBodyText}>{skill.name}</Text>
                  <LevelDots level={skill.level} accentColor={optionalOrFallback(template, '#FFFFFF')} />
                </View>
              ))}
            </>
          )}

          {/* Languages */}
          {isVisible('languages', languages) && (
            <>
              <SidebarSectionHeader title={sectionTitles.languages} styles={styles} sp={sp} />
              {languages.map((lang, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...(i > 0 && { marginTop: sp.lineGap }) }}>
                  <Text style={styles.sidebarItemTitle}>{lang.name}</Text>
                  <Text style={styles.sidebarBodyText}>{lang.level}</Text>
                </View>
              ))}
            </>
          )}

          {/* Interests */}
          {isVisible('interests', interests) && (
            <>
              <SidebarSectionHeader title={sectionTitles.interests} styles={styles} sp={sp} />
              <Text style={styles.sidebarBodyText}>{interests.filter(Boolean).join('  ·  ')}</Text>
            </>
          )}
        </View>

        {/* RIGHT MAIN COLUMN */}
        <View style={styles.mainColumn}>
          {summaryVisible && (
            <View wrap={false} style={{ marginBottom: sp.sectionGap }}>
              <SectionHeader title={sectionTitles.profile} styles={styles} />
              <Text style={[styles.bodyText, { marginTop: sp.headerToContent }]}>{personal.summary}</Text>
            </View>
          )}

          {isVisible('experiences', experiences) && (
            <View style={{ marginBottom: sp.sectionGap }}>
              {experiences.map((exp, i) =>
                i === 0 ? (
                  <View key={exp.id} wrap={false}>
                    <SectionHeader title={sectionTitles.experience} styles={styles} />
                    <View style={{ marginTop: sp.headerToContent }}>
                      <ExperienceItem exp={exp} styles={styles} sp={sp} presentLabel={sectionTitles.present} isFirst />
                    </View>
                  </View>
                ) : (
                  <ExperienceItem key={exp.id} exp={exp} styles={styles} sp={sp} presentLabel={sectionTitles.present} isFirst={false} />
                ),
              )}
            </View>
          )}

          {isVisible('projects', projects) && (
            <View style={{ marginBottom: sp.sectionGap }}>
              {projects.map((proj, i) =>
                i === 0 ? (
                  <View key={proj.id} wrap={false}>
                    <SectionHeader title={sectionTitles.projects} styles={styles} />
                    <View style={{ marginTop: sp.headerToContent }}>
                      <ProjectItem project={proj} styles={styles} sp={sp} isFirst />
                    </View>
                  </View>
                ) : (
                  <ProjectItem key={proj.id} project={proj} styles={styles} sp={sp} isFirst={false} />
                ),
              )}
            </View>
          )}

          {isVisible('education', education) && (
            <View style={{ marginBottom: sp.sectionGap }}>
              {education.map((edu, i) =>
                i === 0 ? (
                  <View key={edu.id} wrap={false}>
                    <SectionHeader title={sectionTitles.education} styles={styles} />
                    <View style={{ marginTop: sp.headerToContent }}>
                      <EducationItem edu={edu} styles={styles} sp={sp} isFirst />
                    </View>
                  </View>
                ) : (
                  <EducationItem key={edu.id} edu={edu} styles={styles} sp={sp} isFirst={false} />
                ),
              )}
            </View>
          )}

          {isVisible('certifications', certifications) && (
            <View style={{ marginBottom: sp.sectionGap }}>
              {certifications.map((cert, i) =>
                i === 0 ? (
                  <View key={cert.id} wrap={false}>
                    <SectionHeader title={sectionTitles.certifications} styles={styles} />
                    <View style={{ marginTop: sp.headerToContent }}>
                      <CertificationItem cert={cert} styles={styles} sp={sp} isFirst />
                    </View>
                  </View>
                ) : (
                  <CertificationItem key={cert.id} cert={cert} styles={styles} sp={sp} isFirst={false} />
                ),
              )}
            </View>
          )}
        </View>
      </View>
    </Page>
  )
}

// ─── Zone 11: Default Export ───────────────────────────────────────────────────

interface CVDocumentProps {
  cv: CVData
  sectionTitles: Record<string, string>
}

export default function CVDocument({ cv, sectionTitles }: CVDocumentProps) {
  const styles = makeStyles(cv.template)
  const sp = DENSITY_TOKENS[cv.template.density]
  const layoutProps = { cv, sectionTitles, styles, sp }

  return (
    <Document>
      {cv.template.layout === 'sidebar' ? (
        <SidebarLayout {...layoutProps} />
      ) : (
        <SingleLayout {...layoutProps} />
      )}
    </Document>
  )
}
