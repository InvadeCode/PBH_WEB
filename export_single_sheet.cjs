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

const sectionMap = {
  aboutPage: "ABOUT PAGE",
  storyPage: "OUR STORY PAGE",
  methodPage: "METHOD PAGE",
  teamPage: "TEAM PAGE",
  serviceFaqs: "SERVICES PAGE FAQS"
};

async function exportToExcel() {
  console.log("Fetching all data from Sanity for single-sheet export...");
  
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
    faqs
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
    client.fetch(`*[_type == "faq"] | order(order asc)`)
  ]);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('All Website Content');
  
  sheet.columns = [
    { header: 'Page / Section', key: 'section', width: 25 },
    { header: 'Field', key: 'field', width: 35 },
    { header: 'Content', key: 'content', width: 120 }
  ];
  
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

  function addRow(section, field, content) {
    if (content === null || content === undefined) return;
    let displayContent = content;
    
    // Format complex objects/arrays
    if (Array.isArray(content)) {
      if (content.length > 0 && typeof content[0] === 'object') {
        displayContent = content.map((item, i) => {
          let str = `Item ${i+1}:\n`;
          for(let k in item) {
            if(!k.startsWith('_') && k !== 'id') {
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

  function addHeaderRow(sectionName) {
    const row = sheet.addRow({ section: `--- ${sectionName} ---`, field: '', content: '' });
    row.font = { bold: true };
    row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE5E7EB' } };
  }

  // 1. Site Settings
  Object.entries(siteSettings).forEach(([key, val]) => {
    if (key.startsWith('_')) return;
    
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      const section = sectionMap[key] || formatKey(key).toUpperCase();
      addHeaderRow(section);
      Object.entries(val).forEach(([subKey, subVal]) => {
        if (!subKey.startsWith('_')) addRow(section, formatKey(subKey), subVal);
      });
    } else {
      addRow('GLOBAL SETTINGS', formatKey(key), val);
    }
  });

  // 2. Team Members
  addHeaderRow('TEAM MEMBERS');
  teamMembers.forEach((member, i) => {
    addRow('TEAM MEMBERS', `Member ${i+1} Name`, member.name);
    addRow('TEAM MEMBERS', `Member ${i+1} Role`, member.role);
    addRow('TEAM MEMBERS', `Member ${i+1} Bio`, member.bio);
  });

  // 3. Timeline
  addHeaderRow('TIMELINE (OUR STORY)');
  timelineEvents.forEach((event, i) => {
    addRow('TIMELINE (OUR STORY)', `Event ${event.year || i+1} Title`, event.title);
    addRow('TIMELINE (OUR STORY)', `Event ${event.year || i+1} Description`, event.description);
  });

  // 4. Core Values
  addHeaderRow('CORE VALUES');
  coreValues.forEach((val, i) => {
    addRow('CORE VALUES', `Value ${i+1} Title`, val.title);
    addRow('CORE VALUES', `Value ${i+1} Description`, val.description);
  });

  // 5. Framework
  addHeaderRow('METHOD FRAMEWORK');
  frameworkSteps.forEach((step, i) => {
    addRow('METHOD FRAMEWORK', `Step ${step.stepNumber || i+1} Title`, step.title);
    addRow('METHOD FRAMEWORK', `Step ${step.stepNumber || i+1} Description`, step.description);
    addRow('METHOD FRAMEWORK', `Step ${step.stepNumber || i+1} Key Outputs`, step.outputs);
  });

  // 6. Routes
  addHeaderRow('SERVICE ROUTES (E.G. SCIART SAGA)');
  routes.forEach((route) => {
    const routeName = route.title || route.id;
    addRow('SERVICE ROUTES', `${routeName} - Title`, route.title);
    addRow('SERVICE ROUTES', `${routeName} - Description`, route.desc);
    addRow('SERVICE ROUTES', `${routeName} - Best For`, route.bestFor);
    
    if (route.lineItems && route.lineItems.length > 0) {
      const items = route.lineItems.map(li => li.name).join(', ');
      addRow('SERVICE ROUTES', `${routeName} - Core Line Items`, items);
    }
  });

  // 7. Deliverables
  addHeaderRow('ALL DELIVERABLES');
  deliverables.forEach((del) => {
    addRow('ALL DELIVERABLES', `Deliverable under ${del.lineItem}`, del.name);
  });

  // 8. Case Studies
  addHeaderRow('CASE STUDIES');
  caseStudies.forEach((cs) => {
    addRow('CASE STUDIES', `${cs.client} - Title`, cs.title);
    addRow('CASE STUDIES', `${cs.client} - Description`, cs.description);
    addRow('CASE STUDIES', `${cs.client} - Tags`, cs.tags);
  });

  // 9. Journal
  addHeaderRow('JOURNAL ARTICLES');
  journalArticles.forEach((article) => {
    addRow('JOURNAL ARTICLES', `${article.title} - Excerpt`, article.excerpt);
    addRow('JOURNAL ARTICLES', `${article.title} - Category`, article.category);
  });

  // 10. Quiz Questions
  addHeaderRow('ASSESSMENT QUIZ QUESTIONS');
  quizQuestions.forEach((q) => {
    addRow('ASSESSMENT QUIZ', `Question ${q.step}`, q.question);
    if(q.options) {
      addRow('ASSESSMENT QUIZ', `Question ${q.step} Options`, q.options.map(o => o.text).join(' | '));
    }
  });

  // 11. General FAQs
  addHeaderRow('GENERAL FAQS');
  faqs.forEach((faq, i) => {
    addRow('GENERAL FAQS', `FAQ ${i+1} Question`, faq.question);
    addRow('GENERAL FAQS', `FAQ ${i+1} Answer`, faq.answer);
  });

  const filename = 'PBH_Single_Sheet_All_Content.xlsx';
  await workbook.xlsx.writeFile(filename);
  console.log(`\n✅ Successfully created ${filename}!`);
}

exportToExcel().catch(console.error);
