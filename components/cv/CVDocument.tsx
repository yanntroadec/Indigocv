'use client'

import { Document, Page, Text, View, Image, Font, StyleSheet, Link } from '@react-pdf/renderer'
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
      color: template.accentColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginTop: 4,
    },
    contactLine: {
      fontSize: 8,
      color: '#64748B',
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
      borderColor: template.dividerColor,
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
      height: 0.5,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    sidebarBodyText: {
      fontSize: 8,
      color: 'rgba(255, 255, 255, 0.85)',
      lineHeight: 1.4,
    },
    sidebarItemTitle: {
      fontSize: 8.5,
      fontWeight: 'bold',
      color: '#FFFFFF',
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
      <View style={[styles.sidebarDivider, { marginTop: sp.dividerTitleGap }]} />
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
          <Link src={project.url} style={styles.itemTitle}>
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
      <Text style={styles.itemTitle}>{cert.name}</Text>
      <Text style={styles.itemSubtitle}>{[cert.issuer, cert.year].filter(Boolean).join('  ·  ')}</Text>
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
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {languages.map((lang, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 4, alignItems: 'center', marginRight: sp.itemGap }}>
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
        <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
          {i > 0 && <Dot styles={styles} />}
          <Text style={styles.bodyText}>{item}</Text>
        </View>
      ))}
    </View>
  )
}

function Header({ personal, styles, sp }: { personal: CVData['personal']; styles: Styles; sp: SpacingTokens }) {
  const contactItems = [personal.phone, personal.city, personal.email].filter(Boolean)
  const socialLinks = [
    personal.linkedin && { label: 'LinkedIn', url: personal.linkedin },
    personal.github && { label: 'GitHub', url: personal.github },
    personal.portfolio && { label: 'Portfolio', url: personal.portfolio },
  ].filter(Boolean) as { label: string; url: string }[]

  return (
    <View style={{ marginTop: 16, marginBottom: sp.sectionGap }}>
      <Text style={styles.name}>
        {personal.firstName} {personal.lastName}
      </Text>
      {contactItems.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
          {contactItems.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 && <Dot styles={styles} />}
              <Text style={styles.contactLine}>{item}</Text>
            </View>
          ))}
        </View>
      )}
      {personal.jobTitle && <Text style={styles.jobTitle}>{personal.jobTitle}</Text>}
      {socialLinks.length > 0 && (
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 4 }}>
          {socialLinks.map(({ label, url }) => (
            <Link key={label} src={url} style={styles.socialLink}>
              {label}
            </Link>
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
      <Header personal={personal} styles={styles} sp={sp} />

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
    personal.phone && { label: sectionTitles.contact, value: personal.phone },
    personal.email && { value: personal.email },
    (personal.city || personal.country) && { value: [personal.city, personal.country].filter(Boolean).join(', ') },
    personal.linkedin && { url: personal.linkedin, value: 'LinkedIn' },
    personal.github && { url: personal.github, value: 'GitHub' },
    personal.portfolio && { url: personal.portfolio, value: 'Portfolio' },
  ].filter(Boolean) as { url?: string; value: string }[]

  return (
    <Page size="A4" style={styles.pageNopadding}>
      <View style={styles.sidebarBg} fixed />
      <View style={styles.sidebarContainer}>
        {/* LEFT SIDEBAR */}
        <View style={styles.sidebar}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {photo && <Image src={photo} style={styles.photo} />}
          <Text style={styles.sidebarName}>
            {personal.firstName} {personal.lastName}
          </Text>
          {personal.jobTitle && <Text style={styles.sidebarJobTitle}>{personal.jobTitle}</Text>}

          {/* Contact block */}
          {contactItems.length > 0 && (
            <>
              <SidebarSectionHeader title={sectionTitles.contact} styles={styles} sp={sp} />
              {contactItems.map((item, i) => (
                <View key={i} style={i === 0 ? undefined : { marginTop: sp.lineGap }}>
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
                  <LevelDots level={skill.level} accentColor="#FFFFFF" />
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
