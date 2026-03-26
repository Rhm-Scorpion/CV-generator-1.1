import { CVData } from '../types';
import { TRANSLATIONS } from '../constants';

export function generateCVHtml(data: CVData): string {
  const lang = data.meta.language;
  const t = TRANSLATIONS[lang];
  const isRtl = lang === 'ar' || lang === 'he';

  const hasContent = (arr: any[]) => arr.some(item => Object.values(item).some(v => typeof v === 'string' && v.trim() !== ''));

  const formatDate = (dateStr: string, lang: string, type: 'full' | 'monthYear' = 'monthYear') => {
    if (!dateStr) return '';
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

  const template = data.meta.template || 'modern';

  const getTemplateStyles = (template: string) => {
    if (template === 'classic') {
      return `
        :root {
            --accent: #1a365d;
            --sidebar-bg: #1a365d;
            --text: #2d3748;
            --muted: #4a5568;
            --border: #cbd5e0;
        }
        body {
            font-family: 'Noto Sans', sans-serif;
            color: var(--text);
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: #f7fafc;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            display: flex;
            min-height: 100vh;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .sidebar {
            width: 30%;
            background: var(--sidebar-bg);
            color: white;
            padding: 40px 30px;
        }
        .main-content {
            width: 70%;
            padding: 40px 50px;
        }
        .sidebar h1 {
            font-size: 24px;
            color: white;
            margin: 0 0 20px 0;
            font-weight: 800;
        }
        .sidebar-section-title {
            font-size: 12px;
            color: white;
            text-transform: uppercase;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            padding-bottom: 5px;
            margin-bottom: 15px;
            margin-top: 30px;
            font-weight: 700;
            letter-spacing: 1px;
        }
        .sidebar-item {
            margin-bottom: 15px;
            font-size: 13px;
        }
        .sidebar-label {
            font-weight: 700;
            display: block;
            font-size: 11px;
            margin-bottom: 3px;
            opacity: 0.8;
        }
        .section-title {
            font-size: 16px;
            color: var(--accent);
            text-transform: uppercase;
            border-bottom: 2px solid var(--accent);
            padding-bottom: 3px;
            margin-bottom: 15px;
            margin-top: 30px;
            font-weight: 700;
        }
        .skill-tag {
            display: inline-block;
            background: rgba(255,255,255,0.1);
            color: white;
            padding: 3px 8px;
            border-radius: 3px;
            margin-right: 5px;
            margin-bottom: 5px;
            font-size: 11px;
        }
      `;
    }
    if (template === 'minimalist') {
      return `
        :root {
            --accent: #000000;
            --text: #333333;
            --muted: #666666;
            --border: #eeeeee;
        }
        body {
            font-family: 'Noto Sans', sans-serif;
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 80px 40px;
            background: #ffffff;
        }
        .container {
            max-width: 700px;
            margin: 0 auto;
        }
        header {
            margin-bottom: 60px;
        }
        h1 {
            font-size: 24px;
            color: var(--accent);
            margin: 0 0 15px 0;
            font-weight: 400;
            text-transform: uppercase;
            letter-spacing: 4px;
        }
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            gap: 25px;
            font-size: 11px;
            color: var(--muted);
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .section-title {
            font-size: 12px;
            color: var(--accent);
            text-transform: uppercase;
            margin-bottom: 20px;
            margin-top: 40px;
            font-weight: 700;
            letter-spacing: 3px;
        }
        .entry-title { 
            font-size: 14px; 
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .skill-tag { 
            background: none; 
            border: 1px solid var(--border);
            padding: 4px 10px;
            font-size: 11px;
            letter-spacing: 1px;
        }
      `;
    }
    // Default: Modern
    return `
        :root {
            --accent: #3d5a3e;
            --accent-gold: #8b7355;
            --text: #2c2c2c;
            --muted: #6b6b6b;
            --border: #e0d8cc;
            --bg: #fdfcf8;
        }
        body {
            font-family: 'Noto Sans', sans-serif;
            color: var(--text);
            line-height: 1.6;
            margin: 0;
            padding: 60px 40px;
            background: var(--bg);
        }
        .container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            padding: 70px;
            box-shadow: 0 15px 40px rgba(0,0,0,0.05);
            border-radius: 4px;
        }
        header {
            border-bottom: 1px solid var(--border);
            padding-bottom: 30px;
            margin-bottom: 40px;
            text-align: center;
        }
        h1 {
            font-family: 'Noto Serif', serif;
            font-size: 36px;
            color: var(--accent);
            margin: 0 0 15px 0;
            line-height: 1.1;
        }
        .contact-info {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 20px;
            font-size: 14px;
            color: var(--muted);
        }
        .section-title {
            font-family: 'Noto Serif', serif;
            font-size: 20px;
            color: var(--accent-gold);
            text-transform: uppercase;
            border-bottom: 1px solid var(--accent-gold);
            padding-bottom: 6px;
            margin-bottom: 20px;
            margin-top: 30px;
            letter-spacing: 1px;
        }
        .entry-title {
            font-family: 'Noto Serif', serif;
            color: var(--accent);
            font-size: 16px;
        }
        .skill-tag {
            background: #f5f0e8;
            color: #5a5a40;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
        }
    `;
  };

  const educationHtml = hasContent(data.education) ? `
    <section class="section">
      <h2 class="section-title">${t.education}</h2>
      ${data.education.map(edu => (edu.institution || edu.field) ? `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title">${edu.institution}</span>
            <span class="entry-date">${formatDate(edu.from, lang)} — ${edu.toPresent ? t.present : formatDate(edu.to, lang)}</span>
          </div>
          <div class="entry-subtitle">${edu.field}</div>
        </div>
      ` : '').join('')}
    </section>
  ` : '';

  const workExperienceHtml = hasContent(data.workExperience) ? `
    <section class="section">
      <h2 class="section-title">${t.workExperience}</h2>
      ${data.workExperience.map(work => (work.employer || work.jobTitle) ? `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title">${work.employer}</span>
            <span class="entry-date">${formatDate(work.from, lang)} — ${work.toPresent ? t.present : formatDate(work.to, lang)}</span>
          </div>
          <div class="entry-subtitle">${work.jobTitle} | ${work.city}, ${work.country}</div>
          ${work.description ? `<div class="description">${work.description.split(/[.!?]\s+/).map((s, i, a) => {
            const text = s.trim();
            if (!text) return '';
            const suffix = i < a.length - 1 ? '.' : '';
            return `• ${text}${suffix}`;
          }).filter(Boolean).join('<br>')}</div>` : ''}
        </div>
      ` : '').join('')}
    </section>
  ` : '';

  const skillsHtml = (data.skills.it.some(s => s.value) || data.skills.additional.some(s => s.value)) ? `
    <section class="section">
      <h2 class="section-title">${t.skills}</h2>
      ${data.skills.it.some(s => s.value) ? `
        <div class="skill-group">
          <div class="skill-label">${t.itSkills}:</div>
          <div class="skill-tags">
            ${data.skills.it.filter(s => s.value).map(s => `<span class="skill-tag">${s.value}</span>`).join('')}
          </div>
        </div>
      ` : ''}
      ${data.skills.additional.some(s => s.value) ? `
        <div class="skill-group">
          <div class="skill-label">${t.additionalSkills}:</div>
          <div class="skill-tags">
            ${data.skills.additional.filter(s => s.value).map(s => `<span class="skill-tag">${s.value}</span>`).join('')}
          </div>
        </div>
      ` : ''}
    </section>
  ` : '';

  const languagesHtml = data.languages.some(l => l.language) ? `
    <section class="section">
      <h2 class="section-title">${t.languages}</h2>
      ${data.languages.map(l => l.language ? `
        <div class="other-row">
          <span class="other-label">${l.language}</span>
          <span class="other-value">${l.level}</span>
        </div>
      ` : '').join('')}
    </section>
  ` : '';

  const otherHtml = data.other.some(o => o.value) ? `
    <section class="section">
      <h2 class="section-title">${t.other}</h2>
      ${data.other.map(item => item.value ? `
        <div class="other-row">
          <span class="other-label">${t[item.label] || item.label}:</span>
          <span class="other-value">${item.value}</span>
        </div>
      ` : '').join('')}
    </section>
  ` : '';

  const htmlContent = template === 'classic' ? `
    <div class="container">
        <div class="sidebar">
            <h1>${data.personalInfo.firstName}<br>${data.personalInfo.lastName}</h1>
            
            <div class="sidebar-section-title">${t.personalInfo}</div>
            <div class="sidebar-item">
                <span class="sidebar-label">${t.email}</span>
                ${data.personalInfo.email}
            </div>
            ${data.personalInfo.phone ? `
            <div class="sidebar-item">
                <span class="sidebar-label">${t.phone}</span>
                ${data.personalInfo.phone}
            </div>` : ''}
            ${data.personalInfo.address ? `
            <div class="sidebar-item">
                <span class="sidebar-label">${t.address}</span>
                ${data.personalInfo.address}
            </div>` : ''}
            ${data.personalInfo.website ? `
            <div class="sidebar-item">
                <span class="sidebar-label">Website</span>
                ${data.personalInfo.website}
            </div>` : ''}

            ${data.skills.it.some(s => s.value) || data.skills.additional.some(s => s.value) ? `
            <div class="sidebar-section-title">${t.skills}</div>
            <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                ${data.skills.it.filter(s => s.value).map(s => `<span class="skill-tag">${s.value}</span>`).join('')}
                ${data.skills.additional.filter(s => s.value).map(s => `<span class="skill-tag">${s.value}</span>`).join('')}
            </div>` : ''}

            ${data.languages.some(l => l.language) ? `
            <div class="sidebar-section-title">${t.languages}</div>
            ${data.languages.map(l => l.language ? `
                <div class="sidebar-item">
                    <span class="sidebar-label">${l.language}</span>
                    ${l.level}
                </div>
            ` : '').join('')}` : ''}
        </div>
        
        <div class="main-content">
            ${educationHtml}
            ${workExperienceHtml}
            ${otherHtml}
        </div>
    </div>
  ` : `
    <div class="container">
        <header>
            <h1>${data.personalInfo.firstName} ${data.personalInfo.lastName}</h1>
            <div class="contact-info">
                ${data.personalInfo.email ? `<span>${data.personalInfo.email}</span>` : ''}
                ${data.personalInfo.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
                ${data.personalInfo.address ? `<span>${data.personalInfo.address}</span>` : ''}
                ${data.personalInfo.dateOfBirth ? `<span>${formatDate(data.personalInfo.dateOfBirth, lang, 'full')}</span>` : ''}
                ${data.personalInfo.linkedin ? `<span>LinkedIn: ${data.personalInfo.linkedin}</span>` : ''}
                ${data.personalInfo.github ? `<span>GitHub: ${data.personalInfo.github}</span>` : ''}
                ${data.personalInfo.website ? `<span>Website: ${data.personalInfo.website}</span>` : ''}
            </div>
        </header>

        ${educationHtml}
        ${workExperienceHtml}
        ${skillsHtml}
        ${languagesHtml}
        ${otherHtml}
    </div>
  `;

  return `
<!DOCTYPE html>
<html lang="${lang}" dir="${isRtl ? 'rtl' : 'ltr'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CV - ${data.personalInfo.firstName} ${data.personalInfo.lastName}</title>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;800&family=Noto+Serif:wght@700&display=swap" rel="stylesheet">
    <style>
        ${getTemplateStyles(template)}
        .section {
            margin-bottom: 30px;
        }
        .entry {
            margin-bottom: 20px;
            break-inside: avoid;
        }
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 5px;
        }
        .entry-title {
            font-weight: 700;
            font-size: 16px;
        }
        .entry-date {
            font-size: 14px;
            color: var(--muted);
        }
        .entry-subtitle {
            font-style: italic;
            color: #4a4a4a;
            font-size: 15px;
            margin-bottom: 8px;
        }
        .description {
            font-size: 14px;
            text-align: justify;
            margin: 0;
        }
        .skill-group {
            margin-bottom: 15px;
            break-inside: avoid;
        }
        .skill-label {
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 8px;
            color: var(--accent-gold, var(--accent));
        }
        .skill-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .skill-tag {
            background: #f0f0f0;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 13px;
            color: #4a4a4a;
        }
        .other-row {
            display: flex;
            margin-bottom: 8px;
            font-size: 14px;
            break-inside: avoid;
        }
        .other-label {
            width: 200px;
            font-weight: 700;
        }
        .other-value {
            flex: 1;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; padding: 0; }
        }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>
  `;
}
