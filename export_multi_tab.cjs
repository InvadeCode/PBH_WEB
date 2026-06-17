const { createClient } = require('@sanity/client');
const ExcelJS = require('exceljs');

const client = createClient({
  projectId: '5nzj8z3i',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

function formatKey(key) {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

function setupSheet(workbook, name) {
  const sheet = workbook.addWorksheet(name);
  sheet.columns = [
    { header: 'Section / Component', key: 'section', width: 35 },
    { header: 'Field / Property', key: 'field', width: 35 },
    { header: 'Current Content', key: 'content', width: 120 }
  ];
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  return sheet;
}

function addRow(sheet, section, field, content) {
  if (content === null || content === undefined || content === '') return;
  let displayContent = content;
  
  if (Array.isArray(content)) {
    if (content.length > 0 && typeof content[0] === 'object') {
      displayContent = content.map((item, i) => {
        let str = `Item ${i+1}:\n`;
        for(let k in item) {
          if(!k.startsWith('_') && k !== 'id' && k !== '_key' && k !== '_type') {
            str += `  - ${formatKey(k)}: ${item[k]}\n`;
          }
        }
        return str;
      }).join('\n');
    } else {
      displayContent = content.join(', ');
    }
  } else if (typeof content === 'object') {
    displayContent = JSON.stringify(content);
  }
  
  const row = sheet.addRow({ section, field, content: displayContent });
  row.getCell('content').alignment = { wrapText: true, vertical: 'top' };
  row.getCell('section').alignment = { vertical: 'top' };
  row.getCell('field').alignment = { vertical: 'top' };
}

function addHeaderRow(sheet, sectionName) {
  const row = sheet.addRow({ section: `--- ${sectionName} ---`, field: '', content: '' });
  row.font = { bold: true };
  row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
}

async function exportToMultiTabExcel() {
  console.log("Fetching exhaustive data from Sanity for precise multi-tab export...");
  
  const [
    siteSettings,
    teamMembers,
    timelineEvents,
    coreValues,
    frameworkSteps,
    routes,
    deliverables,
    caseStudies,
    journalArticles,
    quizQuestions,
    faqs,
    problemData
  ] = await Promise.all([
    client.fetch(`*[_type == "siteSettings"][0]`),
    client.fetch(`*[_type == "teamMember"] | order(order asc)`),
    client.fetch(`*[_type == "timelineEvent"] | order(year asc)`),
    client.fetch(`*[_type == "coreValue"] | order(order asc)`),
    client.fetch(`*[_type == "frameworkStep"] | order(stepNumber asc)`),
    client.fetch(`*[_type == "routeInfo"]`),
    client.fetch(`*[_type == "deliverable"] | order(order asc)`),
    client.fetch(`*[_type == "caseStudy"] | order(order asc)`),
    client.fetch(`*[_type == "journalArticle"] | order(publishedAt desc)`),
    client.fetch(`*[_type == "quizQuestion"] | order(step asc)`),
    client.fetch(`*[_type == "faq"] | order(order asc)`),
    client.fetch(`*[_type == "problemData"] | order(order asc)`)
  ]);

  const workbook = new ExcelJS.Workbook();
  
  // 1. HOME PAGE & GLOBALS
  const homeSheet = setupSheet(workbook, '1. Home Page & Globals');
  addHeaderRow(homeSheet, 'HOME PAGE HERO');
  addRow(homeSheet, 'Hero Section', 'Home Hero Title', siteSettings.homeHeroTitle);
  addRow(homeSheet, 'Hero Section', 'Home Hero Subtitle', siteSettings.homeHeroSubtitle);
  addRow(homeSheet, 'Hero Section', 'Home Explore Button', siteSettings.homeExploreButton);
  
  addHeaderRow(homeSheet, 'HOME PAGE PROBLEMS SECTION');
  addRow(homeSheet, 'Problems Section UI', 'Hardcoded Section Title', 'We solve problems like...');
  problemData.forEach((prob, i) => {
    addRow(homeSheet, `Problem ${i+1}`, 'Title', prob.title);
    addRow(homeSheet, `Problem ${i+1}`, 'Icon / Type', `${prob.iconName || 'N/A'} / ${prob.type}`);
  });

  addHeaderRow(homeSheet, 'GLOBAL NAVIGATION & BUTTONS');
  addRow(homeSheet, 'Navigation UI', 'Top Nav Button', 'Build My Brand Scope');
  addRow(homeSheet, 'Navigation Links', 'Global Nav Links', 'Work | Services | About Us | Journal | Contact Us');
  addRow(homeSheet, 'Buttons', 'Assessment Button', siteSettings.assessmentButton);
  addRow(homeSheet, 'Buttons', 'All Projects Button', siteSettings.allProjectsButton);
  addRow(homeSheet, 'Buttons', 'Join Us Button', 'Join the House');
  
  addHeaderRow(homeSheet, 'FOOTER');
  addRow(homeSheet, 'Footer', 'Footer CTA', siteSettings.footerCTA);
  addRow(homeSheet, 'Footer', 'Marquee Text', siteSettings.marqueeText);
  addRow(homeSheet, 'Footer', 'Footer Tagline', siteSettings.footerTagline);
  addRow(homeSheet, 'Footer', 'Footer Copyright', siteSettings.footerCopyright);
  addRow(homeSheet, 'Footer UI', 'Hardcoded Social Links Label', 'Follow Us');
  addRow(homeSheet, 'Footer UI', 'Hardcoded Legal Links Label', 'Legal');
  
  addHeaderRow(homeSheet, 'CONTACT INFO');
  addRow(homeSheet, 'Contact', 'Email', siteSettings.contactEmail);
  addRow(homeSheet, 'Contact', 'Phone', siteSettings.contactPhone);
  addRow(homeSheet, 'Contact', 'Address', siteSettings.contactAddress);

  // 2. ABOUT PAGE
  const aboutSheet = setupSheet(workbook, '2. About Page');
  if (siteSettings.aboutPage) {
    addHeaderRow(aboutSheet, 'ABOUT HERO');
    addRow(aboutSheet, 'Hero', 'Page Label', siteSettings.aboutPage.pageLabel);
    addRow(aboutSheet, 'Hero', 'Hero Title', siteSettings.aboutPage.heroTitle);
    
    addHeaderRow(aboutSheet, 'VISION & MISSION');
    addRow(aboutSheet, 'Vision', 'Vision Label', siteSettings.aboutPage.visionLabel);
    addRow(aboutSheet, 'Vision', 'Vision Text', siteSettings.aboutPage.visionText);
    addRow(aboutSheet, 'Mission', 'Mission Label', siteSettings.aboutPage.missionLabel);
    addRow(aboutSheet, 'Mission', 'Mission Text', siteSettings.aboutPage.missionText);
    
    addHeaderRow(aboutSheet, 'PURPOSE');
    addRow(aboutSheet, 'Purpose', 'Purpose Label', siteSettings.aboutPage.purposeLabel);
    addRow(aboutSheet, 'Purpose', 'Purpose Text', siteSettings.aboutPage.purposeText);
    
    addHeaderRow(aboutSheet, 'PHILOSOPHY');
    addRow(aboutSheet, 'Philosophy', 'Philosophy Label', siteSettings.aboutPage.philosophyLabel);
    addRow(aboutSheet, 'Philosophy', 'Philosophy Title', siteSettings.aboutPage.philosophyTitle);
    addRow(aboutSheet, 'Philosophy', 'Philosophy Text', siteSettings.aboutPage.philosophyText);
    
    addHeaderRow(aboutSheet, 'GLOBAL SECTION');
    addRow(aboutSheet, 'Global Stage', 'Global Title', siteSettings.aboutPage.globalTitle);
    addRow(aboutSheet, 'Global Stage', 'Global Text', siteSettings.aboutPage.globalText);
    addRow(aboutSheet, 'Global Stage', 'CTA Button', siteSettings.aboutPage.ctaButton);
  }
  
  addHeaderRow(aboutSheet, 'CORE VALUES SECTION');
  addRow(aboutSheet, 'Core Values Section', 'Header / Title', siteSettings.coreValuesHeader);
  coreValues.forEach((val, i) => {
    addRow(aboutSheet, `Value ${i+1}: ${val.title}`, 'Title', val.title);
    addRow(aboutSheet, `Value ${i+1}: ${val.title}`, 'Description', val.description);
  });

  // 3. OUR STORY PAGE
  const storySheet = setupSheet(workbook, '3. Our Story Page');
  if (siteSettings.storyPage) {
    addHeaderRow(storySheet, 'STORY HERO');
    addRow(storySheet, 'Hero', 'Page Label', siteSettings.storyPage.pageLabel);
    addRow(storySheet, 'Hero', 'Hero Title', siteSettings.storyPage.heroTitle);
    
    addHeaderRow(storySheet, 'THE SPARK');
    addRow(storySheet, 'Spark Section', 'Paragraph 1', siteSettings.storyPage.sparkPara1);
    addRow(storySheet, 'Spark Section', 'Paragraph 2', siteSettings.storyPage.sparkPara2);
    addRow(storySheet, 'Spark Section', 'Paragraph 3', siteSettings.storyPage.sparkPara3);
    addRow(storySheet, 'Spark Section', 'Paragraph 4', siteSettings.storyPage.sparkPara4);
    
    addHeaderRow(storySheet, 'WHY PURPLE & BLUE?');
    addRow(storySheet, 'Naming', 'Section Title', siteSettings.storyPage.nameSectionTitle);
    addRow(storySheet, 'Naming', 'Purple Description', siteSettings.storyPage.purpleDesc);
    addRow(storySheet, 'Naming', 'Blue Description', siteSettings.storyPage.blueDesc);
    addRow(storySheet, 'Naming', 'House Description', siteSettings.storyPage.houseDesc);
    
    addHeaderRow(storySheet, 'LOOKING AHEAD');
    addRow(storySheet, 'Future', 'Looking Ahead Title', siteSettings.storyPage.lookingAheadTitle);
    addRow(storySheet, 'Future', 'Looking Ahead Text', siteSettings.storyPage.lookingAheadText);
    addRow(storySheet, 'Future', 'CTA Button', siteSettings.storyPage.ctaButton);
  }
  
  addHeaderRow(storySheet, 'TIMELINE MILESTONES');
  addRow(storySheet, 'Timeline Section', 'Journey Header', siteSettings.ourJourneyHeader);
  addRow(storySheet, 'Timeline Section', 'Timeline Header', siteSettings.timelineHeader);
  timelineEvents.forEach((event, i) => {
    addRow(storySheet, `Year: ${event.year}`, 'Title', event.title);
    addRow(storySheet, `Year: ${event.year}`, 'Description', event.description);
  });

  // 4. METHOD PAGE
  const methodSheet = setupSheet(workbook, '4. Method Page');
  addHeaderRow(methodSheet, 'METHOD PAGE GLOBALS');
  addRow(methodSheet, 'Header', 'Method Page Header', siteSettings.methodPageHeader);
  addRow(methodSheet, 'Header', 'Method Page Subtext', siteSettings.methodPageSubtext);
  
  if (siteSettings.methodPage) {
    addHeaderRow(methodSheet, 'METHOD HERO');
    addRow(methodSheet, 'Hero', 'Page Label', siteSettings.methodPage.pageLabel);
    addRow(methodSheet, 'Hero', 'Hero Title', siteSettings.methodPage.heroTitle);
    
    addHeaderRow(methodSheet, 'TRADITIONAL VS PBH');
    addRow(methodSheet, 'Traditional Model', 'Title', siteSettings.methodPage.traditionalTitle);
    addRow(methodSheet, 'Traditional Model', 'Point 1', siteSettings.methodPage.traditional1);
    addRow(methodSheet, 'Traditional Model', 'Point 2', siteSettings.methodPage.traditional2);
    addRow(methodSheet, 'Traditional Model', 'Point 3', siteSettings.methodPage.traditional3);
    addRow(methodSheet, 'PBH Method', 'Title', siteSettings.methodPage.pbhMethodTitle);
    addRow(methodSheet, 'PBH Method', 'Point 1', siteSettings.methodPage.pbhMethod1);
    addRow(methodSheet, 'PBH Method', 'Point 2', siteSettings.methodPage.pbhMethod2);
    addRow(methodSheet, 'PBH Method', 'Point 3', siteSettings.methodPage.pbhMethod3);
    
    addHeaderRow(methodSheet, 'FRAMEWORK SECTION');
    addRow(methodSheet, 'Framework globals', 'Framework Global Header', siteSettings.frameworkHeader);
    addRow(methodSheet, 'Framework Section', 'Title', siteSettings.methodPage.frameworkTitle);
  }
  
  frameworkSteps.forEach((step, i) => {
    addRow(methodSheet, `Step ${step.stepNumber}: ${step.title}`, 'Description', step.description);
    addRow(methodSheet, `Step ${step.stepNumber}: ${step.title}`, 'Key Outputs', step.outputs);
  });
  
  if (siteSettings.methodPage) {
    addHeaderRow(methodSheet, 'SCIART APPLICATION');
    addRow(methodSheet, 'Applied SciArt', 'Title', siteSettings.methodPage.applicationTitle);
    addRow(methodSheet, 'Applied SciArt', 'Text', siteSettings.methodPage.applicationText);
    addRow(methodSheet, 'Timeline', 'Title', siteSettings.methodPage.timelineTitle);
    addRow(methodSheet, 'Footer CTA', 'CTA Title', siteSettings.methodPage.ctaTitle);
  }

  // 5. TEAM PAGE
  const teamSheet = setupSheet(workbook, '5. Team Page');
  addHeaderRow(teamSheet, 'TEAM PAGE GLOBALS');
  addRow(teamSheet, 'Header', 'Team Page Header', siteSettings.teamPageHeader);
  addRow(teamSheet, 'Header', 'Team Page Subtext', siteSettings.teamPageSubtext);
  
  if (siteSettings.teamPage) {
    addHeaderRow(teamSheet, 'TEAM HERO');
    addRow(teamSheet, 'Hero', 'Page Label', siteSettings.teamPage.pageLabel);
    addRow(teamSheet, 'Hero', 'Hero Title', siteSettings.teamPage.heroTitle);
    
    addHeaderRow(teamSheet, 'TEAM SECTIONS');
    addRow(teamSheet, 'Leadership', 'Title', siteSettings.teamPage.leadershipTitle);
    addRow(teamSheet, 'Core Team', 'Title', siteSettings.teamPage.coreTeamTitle);
    
    addHeaderRow(teamSheet, 'CULTURE');
    addRow(teamSheet, 'Culture Section', 'Culture Title', siteSettings.teamPage.cultureTitle);
    addRow(teamSheet, 'Culture Point 1', 'Title', siteSettings.teamPage.culture1Title);
    addRow(teamSheet, 'Culture Point 1', 'Text', siteSettings.teamPage.culture1Text);
    addRow(teamSheet, 'Culture Point 2', 'Title', siteSettings.teamPage.culture2Title);
    addRow(teamSheet, 'Culture Point 2', 'Text', siteSettings.teamPage.culture2Text);
    addRow(teamSheet, 'Culture Point 3', 'Title', siteSettings.teamPage.culture3Title);
    addRow(teamSheet, 'Culture Point 3', 'Text', siteSettings.teamPage.culture3Text);
    
    addHeaderRow(teamSheet, 'CTA');
    addRow(teamSheet, 'Join Us', 'Title', siteSettings.teamPage.ctaTitle);
    addRow(teamSheet, 'Join Us', 'Text', siteSettings.teamPage.ctaText);
  }
  
  addHeaderRow(teamSheet, 'ALL TEAM MEMBERS');
  teamMembers.forEach((member) => {
    addRow(teamSheet, member.name, 'Name', member.name);
    addRow(teamSheet, member.name, 'Role', member.role);
    addRow(teamSheet, member.name, 'Bio/Description', member.bio || member.desc);
  });

  // 6. SERVICES PAGE
  const servicesSheet = setupSheet(workbook, '6. Services Page & Deliverables');
  addHeaderRow(servicesSheet, 'SERVICES PAGE GLOBALS');
  addRow(servicesSheet, 'Header', 'Services Header', siteSettings.servicesHeader);
  addRow(servicesSheet, 'Header', 'Services Subtext', siteSettings.servicesSubtext);
  addRow(servicesSheet, 'Buttons', 'Services Explore Button', siteSettings.servicesExploreButton);
  
  addHeaderRow(servicesSheet, 'HARDCODED UI LABELS (SERVICES PAGE)');
  addRow(servicesSheet, 'Service Route Card UI', 'Core Line Items Label', 'CORE LINE ITEMS');
  addRow(servicesSheet, 'Service Route Card UI', 'Best For Label', 'BEST FOR');
  addRow(servicesSheet, 'Service Route Card UI', 'Explore Details Button', 'Explore Route Details ->');
  addRow(servicesSheet, 'Service Modal UI', 'Back Button', '<- Back to Services');

  addHeaderRow(servicesSheet, 'SERVICE ROUTES (ECOSYSTEMS)');
  routes.forEach((route) => {
    const routeName = route.title || route.id;
    addRow(servicesSheet, routeName, 'Route Title', route.title);
    addRow(servicesSheet, routeName, 'Icon Name', route.iconName);
    addRow(servicesSheet, routeName, 'Description', route.desc);
    addRow(servicesSheet, routeName, 'Best For Content', route.bestFor);
    if (route.lineItems && route.lineItems.length > 0) {
      const items = route.lineItems.map(li => li.name || li).join(', ');
      addRow(servicesSheet, routeName, 'Core Line Items Content', items);
    }
  });
  
  addHeaderRow(servicesSheet, 'INDIVIDUAL DELIVERABLES (ASSESSMENT)');
  deliverables.forEach((del) => {
    addRow(servicesSheet, `Category: ${del.lineItem}`, 'Deliverable Name', del.name);
    addRow(servicesSheet, `Category: ${del.lineItem}`, 'Interdependence', del.interdependence);
  });

  if (siteSettings.serviceFaqs) {
    addHeaderRow(servicesSheet, 'SERVICES FAQS');
    addRow(servicesSheet, 'Service FAQs', 'Title', siteSettings.serviceFaqs.title);
    addRow(servicesSheet, 'Service FAQs', 'FAQ 1 Question', siteSettings.serviceFaqs.faq1Question);
    addRow(servicesSheet, 'Service FAQs', 'FAQ 1 Answer', siteSettings.serviceFaqs.faq1Answer);
    addRow(servicesSheet, 'Service FAQs', 'FAQ 2 Question', siteSettings.serviceFaqs.faq2Question);
    addRow(servicesSheet, 'Service FAQs', 'FAQ 2 Answer', siteSettings.serviceFaqs.faq2Answer);
  }

  // 7. WORK PAGE
  const workSheet = setupSheet(workbook, '7. Work Page (Case Studies)');
  addHeaderRow(workSheet, 'WORK PAGE GLOBALS');
  addRow(workSheet, 'Header', 'Work Page Header', siteSettings.workPageHeader);
  addRow(workSheet, 'Header', 'Work Page Subtext', siteSettings.workPageSubtext);
  
  addHeaderRow(workSheet, 'HARDCODED UI LABELS (WORK PAGE)');
  addRow(workSheet, 'Case Study Grid UI', 'Read Case Study Button', 'Read Case Study');
  addRow(workSheet, 'Case Study Modal UI', 'Back Button', '<- Back to Selected Work');
  addRow(workSheet, 'Case Study Modal UI', 'Client Label', 'CLIENT');
  addRow(workSheet, 'Case Study Modal UI', 'Sector Label', 'SECTOR');
  addRow(workSheet, 'Case Study Modal UI', 'Core Route Label', 'CORE ROUTE');
  addRow(workSheet, 'Case Study Modal UI', 'Year Label', 'YEAR');
  addRow(workSheet, 'Case Study Modal UI', 'The Challenge Label', 'THE CHALLENGE');
  addRow(workSheet, 'Case Study Modal UI', 'The Solution Label', 'THE PBH SOLUTION');
  addRow(workSheet, 'Case Study Modal UI', 'The Strategy Label', 'THE STRATEGY');
  addRow(workSheet, 'Case Study Modal UI', 'The Execution Label', 'THE EXECUTION');
  addRow(workSheet, 'Case Study Modal UI', 'Project Impact Label', 'PROJECT IMPACT');
  addRow(workSheet, 'Case Study Modal UI', 'Core Deliverables Label', 'CORE DELIVERABLES');
  addRow(workSheet, 'Case Study Modal UI', 'Next Project Button', 'Next Project');

  caseStudies.forEach((cs) => {
    addHeaderRow(workSheet, cs.client || cs.title);
    addRow(workSheet, cs.client, 'Client Name', cs.client);
    addRow(workSheet, cs.client, 'Overview Title', cs.title);
    addRow(workSheet, cs.client, 'Sector', cs.sector);
    addRow(workSheet, cs.client, 'Route', cs.route);
    addRow(workSheet, cs.client, 'Tags', cs.tags ? cs.tags.join(', ') : '');
    addRow(workSheet, cs.client, 'Colors', cs.colors ? cs.colors.join(', ') : '');
    addRow(workSheet, cs.client, 'Challenge (Short Header)', cs.challenge);
    addRow(workSheet, cs.client, 'Overview (Full Paragraph)', cs.overview);
    addRow(workSheet, cs.client, 'PBH Solution', cs.solution);
    addRow(workSheet, cs.client, 'Roles', cs.roles ? cs.roles.join(', ') : '');
    
    if (cs.fullStory) {
      addRow(workSheet, cs.client, 'Full Story - Challenge', cs.fullStory.challenge);
      addRow(workSheet, cs.client, 'Full Story - Strategy', cs.fullStory.strategy);
      addRow(workSheet, cs.client, 'Full Story - Execution', cs.fullStory.execution);
      
      if (cs.fullStory.stats && cs.fullStory.stats.length > 0) {
        const statsFormatted = cs.fullStory.stats.map(s => `${s.label}: ${s.val}`).join(' | ');
        addRow(workSheet, cs.client, 'Full Story - Stats', statsFormatted);
      }
      
      if (cs.fullStory.images) {
        addRow(workSheet, cs.client, 'Full Story - Images', cs.fullStory.images.join('\\n'));
      }
    }
    
    if (cs.results) {
      addRow(workSheet, cs.client, 'Project Impact / Results', cs.results.join(' | '));
    }
  });

  // 8. JOURNAL PAGE
  const journalSheet = setupSheet(workbook, '8. Journal Page');
  addHeaderRow(journalSheet, 'JOURNAL PAGE GLOBALS');
  addRow(journalSheet, 'Header', 'Journal Page Header', siteSettings.journalHeader);
  addRow(journalSheet, 'Header', 'Journal Page Subtext', siteSettings.journalSubtext);

  addHeaderRow(journalSheet, 'HARDCODED UI LABELS (JOURNAL PAGE)');
  addRow(journalSheet, 'Journal UI', 'Read Article Button', 'Read Article');

  journalArticles.forEach((article) => {
    addHeaderRow(journalSheet, article.title);
    addRow(journalSheet, article.title, 'Article Title', article.title);
    addRow(journalSheet, article.title, 'Tag/Category', article.tag || article.category);
    addRow(journalSheet, article.title, 'Author', article.author);
    addRow(journalSheet, article.title, 'Date/Time', `${article.date} | ${article.time}`);
    addRow(journalSheet, article.title, 'Excerpt', article.excerpt);
    addRow(journalSheet, article.title, 'Content Block', 'Rich text content typically managed via Sanity Block Editor');
  });

  // 9. ASSESSMENT QUIZ
  const quizSheet = setupSheet(workbook, '9. Assessment Quiz');
  
  addHeaderRow(quizSheet, 'HARDCODED UI LABELS (ASSESSMENT / SCOPE BUILDER)');
  addRow(quizSheet, 'Assessment Intro', 'Main Title', 'Build your strategic brand scope.');
  addRow(quizSheet, 'Assessment Intro', 'Subtext', 'This is not a generic form. It is a guided discovery system. We’ll map your gaps, define service priorities, and generate a customized roadmap before our first conversation.');
  addRow(quizSheet, 'Assessment Intro', 'Begin Button', 'Begin Discovery');
  addRow(quizSheet, 'Assessment Steps', 'Phase 1 Tracker', 'Phase 1 / Discovery (Step X of Y)');
  addRow(quizSheet, 'Assessment Results', 'Result Title', 'Your brand opportunity areas.');
  addRow(quizSheet, 'Assessment Results', 'Result Subtext Prefix', 'Based on your answers, your communication is currently breaking due to...');
  addRow(quizSheet, 'Assessment Results', 'Result Subtext Suffix', 'We recommend structuring your project around these core ecosystems:');
  addRow(quizSheet, 'Assessment Results', 'Customize Button', 'Customize Scope');
  addRow(quizSheet, 'Assessment Routes', 'Phase 2 Tracker', 'Phase 2 / Architecture');
  addRow(quizSheet, 'Assessment Routes', 'Route Selection Title', 'Select your service routes.');
  addRow(quizSheet, 'Assessment Routes', 'Route Selection Subtext', 'We pre-selected routes based on your diagnosis. Add or remove routes to define your scope foundation.');
  addRow(quizSheet, 'Assessment Routes', 'Next Step Button', 'Select Deliverables');
  addRow(quizSheet, 'Assessment Review', 'Phase 3 Tracker', 'Phase 3 / Details');
  addRow(quizSheet, 'Assessment Review', 'Blueprint Title', 'Live Blueprint');
  addRow(quizSheet, 'Assessment Review', 'Brand Stage Label', 'Brand Stage');
  addRow(quizSheet, 'Assessment Review', 'Identified Gaps Label', 'Identified Gaps');
  addRow(quizSheet, 'Assessment Review', 'Scope Blueprint Label', 'Scope Blueprint');
  addRow(quizSheet, 'Assessment Review', 'Submit Button', 'Generate Scope Report');
  
  addHeaderRow(quizSheet, 'QUIZ DATA / QUESTIONS');
  quizQuestions.forEach((q) => {
    addHeaderRow(quizSheet, `Step ${q.step || q.id}: ${q.question || q.title}`);
    if (q.options) {
      q.options.forEach((opt, idx) => {
        addRow(quizSheet, `Step ${q.step || q.id} - Option ${idx + 1}`, 'Text', opt.text);
        if (opt.points) addRow(quizSheet, `Step ${q.step || q.id} - Option ${idx + 1}`, 'Points', opt.points);
        if (opt.route) addRow(quizSheet, `Step ${q.step || q.id} - Option ${idx + 1}`, 'Route', opt.route);
      });
    }
  });

  // 10. GENERAL FAQS
  const faqSheet = setupSheet(workbook, '10. General FAQs');
  faqs.forEach((faq, i) => {
    addRow(faqSheet, `FAQ ${i+1}`, 'Category', faq.category);
    addRow(faqSheet, `FAQ ${i+1}`, 'Question', faq.question);
    addRow(faqSheet, `FAQ ${i+1}`, 'Answer', faq.answer);
  });

  // PROTECT ALL SHEETS (READ-ONLY)
  const allSheets = [homeSheet, aboutSheet, storySheet, methodSheet, teamSheet, servicesSheet, workSheet, journalSheet, quizSheet, faqSheet];
  
  for (const s of allSheets) {
    await s.protect('pbh2026', {
      selectLockedCells: true,
      selectUnlockedCells: true,
      formatCells: false,
      formatColumns: false,
      formatRows: false,
      insertColumns: false,
      insertRows: false,
      insertHyperlinks: false,
      deleteColumns: false,
      deleteRows: false,
      sort: false,
      autoFilter: false,
      pivotTables: false
    });
  }

  const filename = 'PBH_Content_Export_Tabs.xlsx';
  await workbook.xlsx.writeFile(filename);
  console.log(`\n✅ Successfully created ${filename}! (Read-Only Mode applied)`);
}

exportToMultiTabExcel().catch(console.error);
