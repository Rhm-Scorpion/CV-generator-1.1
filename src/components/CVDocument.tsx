import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '../types';
import { TRANSLATIONS } from '../constants';

// Register fonts for Cyrillic support
// Note: In a real environment, you'd host these .ttf files. 
// For this demo, we assume standard fonts that might have issues, 
// but we'll try to use a reliable source if possible.
Font.register({
  family: 'Noto Serif',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSerif/NotoSerif-Regular.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSerif/NotoSerif-Bold.ttf', fontWeight: 700 },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSerif/NotoSerif-Italic.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSerif/NotoSerif-BoldItalic.ttf', fontWeight: 700, fontStyle: 'italic' },
  ]
});

Font.register({
  family: 'Noto Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSans/NotoSans-Regular.ttf', fontWeight: 400 },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSans/NotoSans-Bold.ttf', fontWeight: 700 },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSans/NotoSans-Italic.ttf', fontWeight: 400, fontStyle: 'italic' },
    { src: 'https://cdn.jsdelivr.net/gh/googlefonts/noto-fonts@master/hinted/ttf/NotoSans/NotoSans-BoldItalic.ttf', fontWeight: 700, fontStyle: 'italic' },
  ]
});

const getStyles = (template: 'modern' | 'classic' | 'minimalist') => {
  const baseStyles = {
    page: {
      padding: 40,
      fontFamily: 'Noto Sans',
      fontSize: 10,
      color: '#2c2c2c',
      lineHeight: 1.4,
    },
    section: {
      marginTop: 15,
    },
    header: {
      marginBottom: 20,
    },
    name: {
      fontSize: 24,
      fontWeight: 700,
      lineHeight: 1.2,
    },
    nameContainer: {
      marginBottom: 10,
    },
    contactRow: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      fontSize: 9,
      marginTop: 5,
      lineHeight: 1.4,
    },
    contactItem: {
      marginRight: 15,
    },
    contactLabel: {
      fontWeight: 700,
    },
    sectionTitle: {
      fontSize: 11,
      fontWeight: 700,
      textTransform: 'uppercase' as const,
      marginBottom: 8,
    },
    entry: {
      marginBottom: 10,
    },
    entryHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      marginBottom: 2,
    },
    entryTitle: {
      fontWeight: 700,
      fontSize: 10,
    },
    entrySubtitle: {
      fontSize: 9,
      fontStyle: 'italic' as const,
      color: '#4a4a4a',
    },
    entryDate: {
      fontSize: 9,
      color: '#6b6b6b',
    },
    description: {
      marginTop: 3,
      fontSize: 9,
      textAlign: 'justify' as const,
    },
    skillGroup: {
      marginBottom: 8,
    },
    skillList: {
      fontSize: 9,
      lineHeight: 1.4,
    },
    skillLabel: {
      fontSize: 9,
      fontWeight: 700,
      marginBottom: 2,
    },
    otherRow: {
      flexDirection: 'row' as const,
      marginBottom: 4,
    },
    otherLabel: {
      width: 150,
      fontWeight: 700,
      fontSize: 9,
    },
    otherValue: {
      flex: 1,
      fontSize: 9,
    },
    twoColumnRow: {},
    leftCol: {},
    rightCol: {},
    label: {},
    value: {},
    entryDescription: {},
    dateText: {},
  };

  if (template === 'classic') {
    return StyleSheet.create({
      ...baseStyles,
      header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#1a365d',
        paddingBottom: 10,
      },
      name: {
        fontSize: 24,
        fontWeight: 700,
        color: '#1a365d',
        lineHeight: 1.2,
      },
      nameContainer: {
        marginBottom: 10,
      },
      contactRow: {
        flexDirection: 'row' as const,
        flexWrap: 'wrap' as const,
        color: '#4a5568',
        fontSize: 9,
        marginTop: 5,
        lineHeight: 1.4,
      },
      contactItem: {
        marginRight: 15,
      },
      contactLabel: {
        fontWeight: 700,
      },
      sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: '#1a365d',
        textTransform: 'uppercase' as const,
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e0',
        paddingBottom: 2,
        marginBottom: 8,
      },
      skillLabel: {
        fontSize: 9,
        fontWeight: 700,
        marginBottom: 2,
        color: '#2d3748',
      },
    });
  }

  if (template === 'minimalist') {
    return StyleSheet.create({
      ...baseStyles,
      page: {
        ...baseStyles.page,
        padding: 50,
        color: '#000',
      },
      header: {
        marginBottom: 30,
      },
      name: {
        fontSize: 24,
        fontWeight: 700,
        color: '#000',
        letterSpacing: 1,
        textTransform: 'uppercase',
      },
      nameContainer: {
        marginBottom: 5,
      },
      sectionTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: '#000',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 15,
        marginTop: 20,
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        paddingBottom: 3,
      },
      twoColumnRow: {
        flexDirection: 'row' as const,
        marginBottom: 8,
      },
      leftCol: {
        width: '30%',
        paddingRight: 15,
      },
      rightCol: {
        width: '70%',
      },
      label: {
        fontSize: 8,
        color: '#666',
        fontWeight: 400,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      },
      value: {
        fontSize: 9,
        color: '#000',
        fontWeight: 400,
      },
      entryTitle: {
        fontSize: 10,
        fontWeight: 700,
        color: '#000',
        marginBottom: 2,
      },
      entrySubtitle: {
        fontSize: 9,
        color: '#444',
        marginBottom: 6,
      },
      entryDescription: {
        fontSize: 8.5,
        color: '#333',
        lineHeight: 1.5,
      },
      dateText: {
        fontSize: 8.5,
        color: '#666',
      },
    });
  }

  // Default: Modern
  return StyleSheet.create({
    ...baseStyles,
    header: {
      marginBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#e0d8cc',
      paddingBottom: 10,
      alignItems: 'center' as const,
    },
    name: {
      fontSize: 28,
      fontFamily: 'Noto Serif',
      fontWeight: 700,
      color: '#3d5a3e',
      lineHeight: 1.2,
    },
    nameContainer: {
      marginBottom: 10,
    },
    contactRow: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'center' as const,
      color: '#6b6b6b',
      fontSize: 9,
      marginTop: 4,
    },
    contactItem: {
      marginHorizontal: 8,
      marginBottom: 2,
    },
    contactLabel: {
      fontWeight: 700,
      color: '#8b7355',
    },
    sectionTitle: {
      fontSize: 12,
      fontFamily: 'Noto Serif',
      fontWeight: 700,
      color: '#8b7355',
      textTransform: 'uppercase' as const,
      borderBottomWidth: 1,
      borderBottomColor: '#8b7355',
      paddingBottom: 3,
      marginBottom: 8,
    },
    entryTitle: {
      fontFamily: 'Noto Serif',
      fontWeight: 700,
      fontSize: 10,
    },
    skillLabel: {
      fontSize: 9,
      fontFamily: 'Noto Serif',
      fontWeight: 700,
      marginBottom: 2,
      color: '#8b7355',
    },
    otherLabel: {
      width: 150,
      fontFamily: 'Noto Serif',
      fontWeight: 700,
      fontSize: 9,
    },
  });
};

const formatDate = (dateStr: string, lang: string, type: 'full' | 'monthYear' = 'monthYear') => {
  if (!dateStr) return '';
  // If it's already a year or manually typed string that doesn't match YYYY-MM-DD
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  try {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: '2-digit',
      day: type === 'full' ? '2-digit' : undefined,
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

export const CVDocument: React.FC<{ data: CVData }> = ({ data }) => {
  const lang = data.meta.language;
  const template: 'modern' | 'classic' | 'minimalist' = data.meta.template || 'modern';
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar' || lang === 'he';
  const styles = getStyles(template);

  const hasContent = (arr: any[]) => arr.some(item => Object.values(item).some(v => typeof v === 'string' && v.trim() !== ''));

  const rtlStyles = {
    textAlign: isRtl ? ('right' as const) : ('left' as const),
    flexDirection: isRtl ? ('row-reverse' as const) : ('row' as const),
  };

  return (
    <Document>
      <Page size="A4" style={[styles.page, { textAlign: rtlStyles.textAlign }]}>
        {/* Header */}
        {template === 'minimalist' ? (
          <View style={styles.header}>
            <Text style={styles.name}>{data.personalInfo.firstName} {data.personalInfo.lastName}</Text>
          </View>
        ) : (
          <View style={[styles.header, template !== 'modern' ? { textAlign: rtlStyles.textAlign, alignItems: isRtl ? ('flex-end' as const) : ('flex-start' as const) } : {}]}>
            <View style={styles.nameContainer}>
              <Text style={styles.name}>{data.personalInfo.firstName} {data.personalInfo.lastName}</Text>
            </View>
            
            {/* Main Contact Info */}
            <View style={[styles.contactRow, { flexDirection: rtlStyles.flexDirection }]}>
              {data.personalInfo.email && <Text style={styles.contactItem}>{data.personalInfo.email}</Text>}
              {data.personalInfo.phone && <Text style={styles.contactItem}>{data.personalInfo.phone}</Text>}
              {data.personalInfo.address && <Text style={styles.contactItem}>{data.personalInfo.address}</Text>}
              {data.personalInfo.dateOfBirth && <Text style={styles.contactItem}>{formatDate(data.personalInfo.dateOfBirth, lang, 'full')}</Text>}
            </View>

            {/* Social & Web */}
            {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
              <View style={[styles.contactRow, { flexDirection: rtlStyles.flexDirection }]}>
                {data.personalInfo.linkedin && (
                  <Text style={styles.contactItem}>
                    <Text style={styles.contactLabel}>LinkedIn: </Text>{data.personalInfo.linkedin}
                  </Text>
                )}
                {data.personalInfo.github && (
                  <Text style={styles.contactItem}>
                    <Text style={styles.contactLabel}>GitHub: </Text>{data.personalInfo.github}
                  </Text>
                )}
                {data.personalInfo.website && (
                  <Text style={styles.contactItem}>
                    <Text style={styles.contactLabel}>Website: </Text>{data.personalInfo.website}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Personal Info Section for Minimalist */}
        {template === 'minimalist' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.personalInfo}</Text>
            {data.personalInfo.dateOfBirth && (
              <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                <View style={styles.leftCol}>
                  <Text style={styles.label}>{t.dateOfBirth}</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={styles.value}>{formatDate(data.personalInfo.dateOfBirth, lang, 'full')}</Text>
                </View>
              </View>
            )}
            {data.personalInfo.address && (
              <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                <View style={styles.leftCol}>
                  <Text style={styles.label}>{t.address}</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={styles.value}>{data.personalInfo.address}</Text>
                </View>
              </View>
            )}
            {data.personalInfo.phone && (
              <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                <View style={styles.leftCol}>
                  <Text style={styles.label}>{t.phone}</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={styles.value}>{data.personalInfo.phone}</Text>
                </View>
              </View>
            )}
            {data.personalInfo.email && (
              <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                <View style={styles.leftCol}>
                  <Text style={styles.label}>{t.email}</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={styles.value}>{data.personalInfo.email}</Text>
                </View>
              </View>
            )}
            {data.personalInfo.linkedin && (
              <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                <View style={styles.leftCol}>
                  <Text style={styles.label}>LinkedIn</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={styles.value}>{data.personalInfo.linkedin}</Text>
                </View>
              </View>
            )}
            {data.personalInfo.github && (
              <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                <View style={styles.leftCol}>
                  <Text style={styles.label}>GitHub</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={styles.value}>{data.personalInfo.github}</Text>
                </View>
              </View>
            )}
            {data.personalInfo.website && (
              <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                <View style={styles.leftCol}>
                  <Text style={styles.label}>Website</Text>
                </View>
                <View style={styles.rightCol}>
                  <Text style={styles.value}>{data.personalInfo.website}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Education */}
        {hasContent(data.education) && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.education}</Text>
              {data.education.length > 0 && (edu => (
                (edu.institution || edu.field) && (
                  template === 'minimalist' ? (
                    <View key={edu.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection, marginBottom: 12 }]} wrap={false}>
                      <View style={styles.leftCol}>
                        <Text style={styles.dateText}>{formatDate(edu.from, lang)} — {edu.toPresent ? t.present : formatDate(edu.to, lang)}</Text>
                      </View>
                      <View style={styles.rightCol}>
                        <Text style={styles.entryTitle}>{edu.institution}</Text>
                        <Text style={styles.entrySubtitle}>{edu.field}</Text>
                      </View>
                    </View>
                  ) : (
                    <View key={edu.id} style={styles.entry} wrap={false}>
                      <View style={[styles.entryHeader, { flexDirection: rtlStyles.flexDirection }]}>
                        <Text style={styles.entryTitle}>{edu.institution}</Text>
                        <Text style={styles.entryDate}>{formatDate(edu.from, lang)} — {edu.toPresent ? t.present : formatDate(edu.to, lang)}</Text>
                      </View>
                      <Text style={styles.entrySubtitle}>{edu.field}</Text>
                    </View>
                  )
                )
              ))(data.education[0])}
            </View>
            {data.education.slice(1).map((edu) => (
              (edu.institution || edu.field) && (
                template === 'minimalist' ? (
                  <View key={edu.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection, marginBottom: 12 }]} wrap={false}>
                    <View style={styles.leftCol}>
                      <Text style={styles.dateText}>{formatDate(edu.from, lang)} — {edu.toPresent ? t.present : formatDate(edu.to, lang)}</Text>
                    </View>
                    <View style={styles.rightCol}>
                      <Text style={styles.entryTitle}>{edu.institution}</Text>
                      <Text style={styles.entrySubtitle}>{edu.field}</Text>
                    </View>
                  </View>
                ) : (
                  <View key={edu.id} style={styles.entry} wrap={false}>
                    <View style={[styles.entryHeader, { flexDirection: rtlStyles.flexDirection }]}>
                      <Text style={styles.entryTitle}>{edu.institution}</Text>
                      <Text style={styles.entryDate}>{formatDate(edu.from, lang)} — {edu.toPresent ? t.present : formatDate(edu.to, lang)}</Text>
                    </View>
                    <Text style={styles.entrySubtitle}>{edu.field}</Text>
                  </View>
                )
              )
            ))}
          </View>
        )}

        {/* Work Experience */}
        {hasContent(data.workExperience) && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.workExperience}</Text>
              {data.workExperience.length > 0 && (work => (
                (work.employer || work.jobTitle) && (
                  template === 'minimalist' ? (
                    <View key={work.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection, marginBottom: 12 }]} wrap={false}>
                      <View style={styles.leftCol}>
                        <Text style={styles.dateText}>{formatDate(work.from, lang)} — {work.toPresent ? t.present : formatDate(work.to, lang)}</Text>
                      </View>
                      <View style={styles.rightCol}>
                        <Text style={styles.entryTitle}>{work.employer}</Text>
                        <Text style={styles.entrySubtitle}>{work.jobTitle} | {work.city}, {work.country}</Text>
                        {work.description && (
                          <View style={template === 'modern' || template === 'classic' ? styles.description : styles.entryDescription}>
                            {work.description.split(/[.!?]\s+/).map((sentence, sIdx, arr) => {
                              const text = sentence.trim();
                              if (!text) return null;
                              const suffix = sIdx < arr.length - 1 ? '.' : '';
                              return (
                                <Text key={sIdx} style={{ marginBottom: 2 }}>
                                  • {text}{suffix}
                                </Text>
                              );
                            })}
                          </View>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View key={work.id} style={styles.entry} wrap={false}>
                      <View style={[styles.entryHeader, { flexDirection: rtlStyles.flexDirection }]}>
                        <Text style={styles.entryTitle}>{work.employer}</Text>
                        <Text style={styles.entryDate}>{formatDate(work.from, lang)} — {work.toPresent ? t.present : formatDate(work.to, lang)}</Text>
                      </View>
                      <Text style={styles.entrySubtitle}>{work.jobTitle} | {work.city}, {work.country}</Text>
                      {work.description && (
                        <View style={styles.description}>
                          {work.description.split(/[.!?]\s+/).map((sentence, sIdx, arr) => {
                            const text = sentence.trim();
                            if (!text) return null;
                            const suffix = sIdx < arr.length - 1 ? '.' : '';
                            return (
                              <Text key={sIdx} style={{ marginBottom: 2 }}>
                                • {text}{suffix}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  )
                )
              ))(data.workExperience[0])}
            </View>
            {data.workExperience.slice(1).map((work) => (
              (work.employer || work.jobTitle) && (
                template === 'minimalist' ? (
                  <View key={work.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection, marginBottom: 12 }]} wrap={false}>
                    <View style={styles.leftCol}>
                      <Text style={styles.dateText}>{formatDate(work.from, lang)} — {work.toPresent ? t.present : formatDate(work.to, lang)}</Text>
                    </View>
                    <View style={styles.rightCol}>
                      <Text style={styles.entryTitle}>{work.employer}</Text>
                      <Text style={styles.entrySubtitle}>{work.jobTitle} | {work.city}, {work.country}</Text>
                      {work.description && (
                        <View style={styles.description}>
                          {work.description.split(/[.!?]\s+/).map((sentence, sIdx, arr) => {
                            const text = sentence.trim();
                            if (!text) return null;
                            const suffix = sIdx < arr.length - 1 ? '.' : '';
                            return (
                              <Text key={sIdx} style={{ marginBottom: 2 }}>
                                • {text}{suffix}
                              </Text>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <View key={work.id} style={styles.entry} wrap={false}>
                    <View style={[styles.entryHeader, { flexDirection: rtlStyles.flexDirection }]}>
                      <Text style={styles.entryTitle}>{work.employer}</Text>
                      <Text style={styles.entryDate}>{formatDate(work.from, lang)} — {work.toPresent ? t.present : formatDate(work.to, lang)}</Text>
                    </View>
                    <Text style={styles.entrySubtitle}>{work.jobTitle} | {work.city}, {work.country}</Text>
                    {work.description && (
                      <View style={template === 'modern' || template === 'classic' ? styles.description : styles.entryDescription}>
                        {work.description.split(/[.!?]\s+/).map((sentence, sIdx, arr) => {
                          const text = sentence.trim();
                          if (!text) return null;
                          const suffix = sIdx < arr.length - 1 ? '.' : '';
                          return (
                            <Text key={sIdx} style={{ marginBottom: 2 }}>
                              • {text}{suffix}
                            </Text>
                          );
                        })}
                      </View>
                    )}
                  </View>
                )
              )
            ))}
          </View>
        )}

        {/* Skills */}
        {(data.skills.it.some(s => s.value) || data.skills.additional.some(s => s.value)) && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.skills}</Text>
              {data.skills.it.some(s => s.value) && (
                template === 'minimalist' ? (
                  <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]}>
                    <View style={styles.leftCol}>
                      <Text style={styles.label}>{t.itSkills}</Text>
                    </View>
                    <View style={styles.rightCol}>
                      <Text style={styles.value}>
                        {data.skills.it.filter(s => s.value).map(s => s.value).join(', ')}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.skillGroup}>
                    <Text style={styles.skillLabel}>{t.itSkills}:</Text>
                    <View style={{ flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 5 }}>
                      {data.skills.it.filter(s => s.value).map((s, idx) => (
                        <Text key={s.id} style={{ 
                          fontSize: 8, 
                          backgroundColor: '#f0f0f0', 
                          padding: '2 6', 
                          borderRadius: 4,
                          color: '#4a4a4a'
                        }}>
                          {s.value}
                        </Text>
                      ))}
                    </View>
                  </View>
                )
              )}
            </View>
            {data.skills.additional.some(s => s.value) && (
              template === 'minimalist' ? (
                <View style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection, marginTop: 5 }]}>
                  <View style={styles.leftCol}>
                    <Text style={styles.label}>{t.additionalSkills}</Text>
                  </View>
                  <View style={styles.rightCol}>
                    <Text style={styles.value}>
                      {data.skills.additional.filter(s => s.value).map(s => s.value).join(', ')}
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.skillGroup} wrap={false}>
                  <Text style={styles.skillLabel}>{t.additionalSkills}:</Text>
                  <View style={{ flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: 5 }}>
                    {data.skills.additional.filter(s => s.value).map((s, idx) => (
                      <Text key={s.id} style={{ 
                        fontSize: 8, 
                        backgroundColor: '#f0f0f0', 
                        padding: '2 6', 
                        borderRadius: 4,
                        color: '#4a4a4a'
                      }}>
                        {s.value}
                      </Text>
                    ))}
                  </View>
                </View>
              )
            )}
          </View>
        )}

        {/* Languages */}
        {data.languages.some(l => l.language) && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.languages}</Text>
              {data.languages.length > 0 && (l => (
                l.language && (
                  template === 'minimalist' ? (
                    <View key={l.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                      <View style={styles.leftCol}>
                        <Text style={styles.label}>{l.language}</Text>
                      </View>
                      <View style={styles.rightCol}>
                        <Text style={styles.value}>{l.level}</Text>
                      </View>
                    </View>
                  ) : (
                    <View key={l.id} style={[styles.otherRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                      <Text style={styles.otherLabel}>{l.language}</Text>
                      <Text style={styles.otherValue}>{l.level}</Text>
                    </View>
                  )
                )
              ))(data.languages[0])}
            </View>
            {data.languages.slice(1).map((l) => (
              l.language && (
                template === 'minimalist' ? (
                  <View key={l.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                    <View style={styles.leftCol}>
                      <Text style={styles.label}>{l.language}</Text>
                    </View>
                    <View style={styles.rightCol}>
                      <Text style={styles.value}>{l.level}</Text>
                    </View>
                  </View>
                ) : (
                  <View key={l.id} style={[styles.otherRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                    <Text style={styles.otherLabel}>{l.language}</Text>
                    <Text style={styles.otherValue}>{l.level}</Text>
                  </View>
                )
              )
            ))}
          </View>
        )}

        {/* Other */}
        {data.other.some(o => o.value) && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.other}</Text>
              {data.other.length > 0 && (item => (
                item.value && (
                  template === 'minimalist' ? (
                    <View key={item.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                      <View style={styles.leftCol}>
                        <Text style={styles.label}>{t[item.label] || item.label}</Text>
                      </View>
                      <View style={styles.rightCol}>
                        <Text style={styles.value}>{item.value}</Text>
                      </View>
                    </View>
                  ) : (
                    <View key={item.id} style={[styles.otherRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                      <Text style={styles.otherLabel}>{t[item.label] || item.label}:</Text>
                      <Text style={styles.otherValue}>{item.value}</Text>
                    </View>
                  )
                )
              ))(data.other[0])}
            </View>
            {data.other.slice(1).map((item) => (
              item.value && (
                template === 'minimalist' ? (
                  <View key={item.id} style={[styles.twoColumnRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                    <View style={styles.leftCol}>
                      <Text style={styles.label}>{t[item.label] || item.label}</Text>
                    </View>
                    <View style={styles.rightCol}>
                      <Text style={styles.value}>{item.value}</Text>
                    </View>
                  </View>
                ) : (
                  <View key={item.id} style={[styles.otherRow, { flexDirection: rtlStyles.flexDirection }]} wrap={false}>
                    <Text style={styles.otherLabel}>{t[item.label] || item.label}:</Text>
                    <Text style={styles.otherValue}>{item.value}</Text>
                  </View>
                )
              )
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};
