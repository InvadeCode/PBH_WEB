dconst ExcelJS = require('exceljs');

const API = 'https://5nzj8z3i.api.sanity.io/v2024-05-27/data/query/production';
async function q(groq) {
  const r = await fetch(`${API}?query=${encodeURIComponent(groq)}`);
  return (await r.json()).result || [];
}

function sheet(wb, name, cols, rows) {
  const ws = wb.addWorksheet(name);
  ws.columns = cols.map(c => ({ header: c.h, key: c.k, width: c.w || 25 }));
  ws.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  ws.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6865FA' } };
  rows.forEach(r => { const row = ws.addRow(r); row.alignment = { vertical: 'top', wrapText: true }; });
}

(async () => {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'PBH Full Content Export';

  // ── 1. SITE SETTINGS (all page titles, subtitles, buttons, contact info) ──
  const ss = await q('*[_type=="siteSettings"][0]');
  const settingsRows = [
    { section: 'HOME PAGE', field: 'Hero Title', value: ss?.homeHeroTitle || 'Breakthroughs happen when strategy and execution move as one.' },
    { section: 'HOME PAGE', field: 'Hero Subtitle', value: ss?.homeHeroSubtitle || 'PurpleBlue House partners with visionary teams...' },
    { section: 'HOME PAGE', field: 'Explore Button', value: ss?.homeExploreButton || 'Explore Our Work' },
    { section: 'HOME PAGE', field: 'Marquee Text', value: ss?.marqueeText || '3 Ecosystems. 1 Connected System. Infinite Breakthroughs.' },
    { section: 'SERVICES PAGE', field: 'Header', value: ss?.servicesHeader || 'Three strategic routes. One connected brand system.' },
    { section: 'SERVICES PAGE', field: 'Subtext', value: ss?.servicesSubtext || 'PBH services are not isolated offerings...' },
    { section: 'SERVICES PAGE', field: 'Explore Button', value: ss?.servicesExploreButton || 'Explore Our Services' },
    { section: 'WORK PAGE', field: 'Header', value: ss?.workPageHeader || 'Our Work.' },
    { section: 'WORK PAGE', field: 'Subtext', value: ss?.workPageSubtext || 'Case studies and full visual archive...' },
    { section: 'WORK PAGE', field: 'All Projects Button', value: ss?.allProjectsButton || 'All Projects' },
    { section: 'METHOD PAGE', field: 'Header', value: ss?.methodPageHeader || 'The Method.' },
    { section: 'METHOD PAGE', field: 'Subtext', value: ss?.methodPageSubtext || 'Where engineering precision meets artistic intuition.' },
    { section: 'METHOD PAGE', field: 'Core Values Header', value: ss?.coreValuesHeader || 'Our Core Values' },
    { section: 'METHOD PAGE', field: 'Framework Header', value: ss?.frameworkHeader || 'Our 4-Step Framework' },
    { section: 'METHOD PAGE', field: 'Timeline Header', value: ss?.timelineHeader || 'Typical Engagement Timeline' },
    { section: 'METHOD PAGE', field: 'Our Journey Header', value: ss?.ourJourneyHeader || 'Our Journey' },
    { section: 'TEAM PAGE', field: 'Header', value: ss?.teamPageHeader || 'The Architects.' },
    { section: 'TEAM PAGE', field: 'Subtext', value: ss?.teamPageSubtext || 'A collective of strategists, designers, and visionaries.' },
    { section: 'JOURNAL PAGE', field: 'Header', value: ss?.journalHeader || 'Thoughts, theories, and unpolished truths.' },
    { section: 'JOURNAL PAGE', field: 'Subtext', value: ss?.journalSubtext || 'Explore our latest essays on brand building...' },
    { section: 'QUIZ / CTA', field: 'Assessment Button', value: ss?.assessmentButton || 'Build My Brand Scope' },
    { section: 'FOOTER', field: 'Footer CTA', value: ss?.footerCTA || 'Experience the method yourself.' },
    { section: 'CONTACT', field: 'Email', value: ss?.contactEmail || 'hello@purplebluehouse.com' },
    { section: 'CONTACT', field: 'Phone', value: ss?.contactPhone || '+91 90000 00000' },
    { section: 'CONTACT', field: 'Address', value: ss?.contactAddress || 'Goa, India' },
  ];
  sheet(wb, 'Site Settings & Page Content', [
    { h: 'Page / Section', k: 'section', w: 20 }, { h: 'Field', k: 'field', w: 25 }, { h: 'Content', k: 'value', w: 80 }
  ], settingsRows);

  // ── 2. CASE STUDIES (full story content) ──
  const cs = await q('*[_type=="caseStudy"] | order(order asc) { _id, id, client, sector, challenge, overview, solution, route, type, tags, roles, results, colors, order, "fullStory": { "challenge": fullStory.challenge, "strategy": fullStory.strategy, "execution": fullStory.execution } }');
  sheet(wb, 'Case Studies', [
    { h: 'Order', k: 'order', w: 6 }, { h: 'Client', k: 'client', w: 20 }, { h: 'Sector', k: 'sector', w: 14 },
    { h: 'Challenge (Tagline)', k: 'challenge', w: 45 }, { h: 'Overview', k: 'overview', w: 60 },
    { h: 'Solution', k: 'solution', w: 60 }, { h: 'Route', k: 'route', w: 16 },
    { h: 'Tags', k: 'tags', w: 25 }, { h: 'Roles', k: 'roles', w: 35 }, { h: 'Results', k: 'results', w: 50 },
    { h: 'Colors', k: 'colors', w: 30 },
    { h: 'Full Story - Challenge', k: 'fChallenge', w: 60 },
    { h: 'Full Story - Strategy', k: 'fStrategy', w: 60 },
    { h: 'Full Story - Execution', k: 'fExecution', w: 60 },
  ], cs.map(d => ({
    ...d, tags: (d.tags || []).join(', '), roles: (d.roles || []).join(', '),
    results: (d.results || []).join(' | '), colors: (d.colors || []).join(', '),
    fChallenge: d.fullStory?.challenge || '', fStrategy: d.fullStory?.strategy || '', fExecution: d.fullStory?.execution || ''
  })));

  // ── 3. TEAM MEMBERS ──
  const tm = await q('*[_type=="teamMember"] | order(order asc) { name, role, bio, order }');
  sheet(wb, 'Team Members', [
    { h: 'Order', k: 'order', w: 6 }, { h: 'Name', k: 'name', w: 25 }, { h: 'Role', k: 'role', w: 25 }, { h: 'Bio', k: 'bio', w: 70 }
  ], tm);

  // ── 4. JOURNAL ARTICLES ──
  const ja = await q('*[_type=="journalArticle"] | order(date desc) { id, tag, title, time, type, excerpt, author, date }');
  sheet(wb, 'Journal Articles', [
    { h: 'ID', k: 'id', w: 6 }, { h: 'Title', k: 'title', w: 45 }, { h: 'Tag', k: 'tag', w: 14 },
    { h: 'Author', k: 'author', w: 18 }, { h: 'Date', k: 'date', w: 14 }, { h: 'Read Time', k: 'time', w: 10 },
    { h: 'Excerpt', k: 'excerpt', w: 60 }
  ], ja);

  // ── 5. SERVICES / ROUTES ──
  const ri = await q('*[_type=="routeInfo"] { id, title, desc, iconName, type, bestFor, lineItems }');
  sheet(wb, 'Services (Routes)', [
    { h: 'ID', k: 'id', w: 6 }, { h: 'Service Name', k: 'title', w: 22 }, { h: 'Description', k: 'desc', w: 55 },
    { h: 'Best For', k: 'bestFor', w: 70 }, { h: 'Icon', k: 'iconName', w: 14 },
    { h: 'Line Items', k: 'lineItems', w: 50 }
  ], ri.map(d => ({ ...d, lineItems: (d.lineItems || []).map(l => `${l.id}: ${l.name}`).join(' | ') })));

  // ── 6. DELIVERABLES (full catalog) ──
  const del = await q('*[_type=="deliverable"] | order(id asc) { id, lineItem, name, interdependence }');
  sheet(wb, 'Deliverables', [
    { h: 'ID', k: 'id', w: 8 }, { h: 'Line Item', k: 'lineItem', w: 10 }, { h: 'Deliverable Name', k: 'name', w: 35 }, { h: 'Dependencies', k: 'interdependence', w: 25 }
  ], del);

  // ── 7. QUIZ QUESTIONS (with all options) ──
  const qq = await q('*[_type=="quizQuestion"] | order(id asc) { id, title, options }');
  const quizRows = [];
  qq.forEach(question => {
    (question.options || []).forEach((opt, i) => {
      quizRows.push({ qId: question.id, question: i === 0 ? question.title : '', optionId: opt.id || opt._key, label: opt.label, cluster: opt.cluster || '', weight: opt.weight || '' });
    });
  });
  sheet(wb, 'Quiz Questions', [
    { h: 'Q ID', k: 'qId', w: 8 }, { h: 'Question', k: 'question', w: 50 },
    { h: 'Option ID', k: 'optionId', w: 10 }, { h: 'Option Label', k: 'label', w: 50 },
    { h: 'Cluster', k: 'cluster', w: 22 }, { h: 'Weight', k: 'weight', w: 8 }
  ], quizRows);

  // ── 8. CORE VALUES ──
  const cv = await q('*[_type=="coreValue"] | order(order asc) { title, description, order }');
  sheet(wb, 'Core Values', [
    { h: 'Order', k: 'order', w: 6 }, { h: 'Title', k: 'title', w: 25 }, { h: 'Description', k: 'description', w: 60 }
  ], cv);

  // ── 9. TIMELINE ──
  const tl = await q('*[_type=="timelineEvent"] | order(order asc) { year, title, description, order }');
  sheet(wb, 'Timeline', [
    { h: 'Order', k: 'order', w: 6 }, { h: 'Phase', k: 'year', w: 18 }, { h: 'Title', k: 'title', w: 30 }, { h: 'Description', k: 'description', w: 70 }
  ], tl);

  // ── 10. FRAMEWORK STEPS ──
  const fw = await q('*[_type=="frameworkStep"] | order(order asc) { stepNumber, title, description, outputs, order }');
  sheet(wb, 'Framework Steps', [
    { h: 'Step', k: 'stepNumber', w: 6 }, { h: 'Title', k: 'title', w: 25 }, { h: 'Description', k: 'description', w: 70 },
    { h: 'Outputs', k: 'outputs', w: 45 }
  ], fw.map(d => ({ ...d, outputs: (d.outputs || []).join(', ') })));

  // ── 11. FAQs ──
  const fq = await q('*[_type=="faq"] | order(order asc) { question, answer, category, order }');
  sheet(wb, 'FAQs', [
    { h: 'Order', k: 'order', w: 6 }, { h: 'Question', k: 'question', w: 45 }, { h: 'Answer', k: 'answer', w: 80 }, { h: 'Category', k: 'category', w: 14 }
  ], fq);

  // ── 12. PROBLEM DATA ──
  const pd = await q('*[_type=="problemData"] | order(order asc) { title, type, iconName, order }');
  sheet(wb, 'Problem Data', [
    { h: 'Order', k: 'order', w: 6 }, { h: 'Problem Title', k: 'title', w: 35 }, { h: 'Type', k: 'type', w: 14 }, { h: 'Icon', k: 'iconName', w: 18 }
  ], pd);

  // ── 13. BRAND PALETTE ──
  sheet(wb, 'Brand Palette', [
    { h: 'Name', k: 'name', w: 20 }, { h: 'Hex', k: 'hex', w: 12 }, { h: 'Usage', k: 'usage', w: 40 }
  ], [
    { name: 'Navy (Background)', hex: '#010D54', usage: 'Main background color' },
    { name: 'Deep Navy', hex: '#010836', usage: 'Darker depth sections' },
    { name: 'Panel Navy', hex: '#0C185C', usage: 'Elevated panels & cards' },
    { name: 'Primary Purple', hex: '#6865FA', usage: 'Primary brand accent' },
    { name: 'Light Purple', hex: '#D4CEFC', usage: 'Secondary / light text' },
    { name: 'Blue', hex: '#2A97D9', usage: 'SciArt Saga route color' },
    { name: 'Yellow', hex: '#FFCD00', usage: 'High-contrast CTA / accents' },
    { name: 'Purple', hex: '#AF73DD', usage: 'Storytelling Corner route' },
    { name: 'Green', hex: '#93D435', usage: 'Sustainability / success' },
    { name: 'Orange', hex: '#ED7E18', usage: 'Warning / highlight' },
    { name: 'Text White', hex: '#F4F4F5', usage: 'Primary text color' },
    { name: 'Font Primary', hex: 'N/A', usage: 'Space Grotesk (headings)' },
    { name: 'Font Secondary', hex: 'N/A', usage: 'Karla (body text)' },
  ]);

  const outPath = '/Users/shravanikhurpe/Desktop/PBH_Sanity_Full_Export.xlsx';
  await wb.xlsx.writeFile(outPath);
  console.log('✅ Export saved to:', outPath);
  console.log('   13 sheets: Site Settings, Case Studies, Team, Journal, Services, Deliverables, Quiz, Core Values, Timeline, Framework, FAQs, Problems, Brand Palette');
})();
