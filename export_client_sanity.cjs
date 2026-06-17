const { createClient } = require('@sanity/client');
const ExcelJS = require('exceljs');

const client = createClient({
  projectId: '5nzj8z3i',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

// Helper to turn camelCase into Title Case
function formatKey(key) {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}

// Custom mapping for parent sections
const sectionNames = {
  aboutPage: "ABOUT PAGE",
  storyPage: "OUR STORY PAGE",
  methodPage: "METHOD PAGE",
  teamPage: "TEAM PAGE",
  serviceFaqs: "SERVICES PAGE FAQS"
};

async function exportToExcel() {
  console.log("Fetching all data from Sanity for Client Review...");
  
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
    problemData,
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
    client.fetch(`*[_type == "problemData"]`),
    client.fetch(`*[_type == "faq"] | order(order asc)`)
  ]);

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'PurpleBlue House';
  workbook.created = new Date();

  // Helper to add a sheet with simple key/value pairs (like Site Settings)
  function addKeyValueSheet(name, dataObj) {
    if (!dataObj) return;
    const sheet = workbook.addWorksheet(name);
    sheet.columns = [
      { header: 'Page / Section', key: 'section', width: 25 },
      { header: 'Field Name', key: 'key', width: 35 },
      { header: 'Current Content (From Sanity)', key: 'value', width: 120 }
    ];
    
    // Style headers
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } }; // Dark blue header

    const processObject = (obj, parentSection = 'GLOBAL / MISC') => {
      // Group keys to make them look nice
      const entries = Object.entries(obj).filter(([k]) => !k.startsWith('_'));
      
      for (const [key, val] of entries) {
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          // Nested object (e.g., aboutPage)
          const sectionName = sectionNames[key] || formatKey(key).toUpperCase();
          processObject(val, sectionName);
        } else {
          // Format arrays if they are complex objects
          let displayVal = val;
          if (Array.isArray(val)) {
            if (val.length > 0 && typeof val[0] === 'object') {
               // Complex array (e.g., methodPage.timelinePhases)
               displayVal = val.map((item, idx) => {
                 let str = `Item ${idx + 1}:\n`;
                 for(let k in item) {
                   if(!k.startsWith('_')) str += `  - ${formatKey(k)}: ${item[k]}\n`;
                 }
                 return str;
               }).join('\n');
            } else {
               displayVal = val.join(', ');
            }
          }
          
          const row = sheet.addRow({ 
            section: parentSection, 
            key: formatKey(key), 
            value: displayVal 
          });
          row.getCell('value').alignment = { wrapText: true, vertical: 'top' };
          row.getCell('section').alignment = { vertical: 'top' };
          row.getCell('key').alignment = { vertical: 'top' };
        }
      }
    };
    
    processObject(dataObj);
  }

  // Helper to add a sheet with a list of records
  function addListSheet(name, dataArray, columnsDef) {
    if (!dataArray || dataArray.length === 0) return;
    const sheet = workbook.addWorksheet(name);
    sheet.columns = columnsDef;
    
    // Style headers
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };

    dataArray.forEach(item => {
      const rowData = {};
      columnsDef.forEach(col => {
        let val = item[col.key];
        if (Array.isArray(val)) val = val.join(' | ');
        if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
        rowData[col.key] = val || '';
      });
      const row = sheet.addRow(rowData);
      
      // Enable text wrapping for all cells in lists
      row.eachCell((cell) => {
        cell.alignment = { wrapText: true, vertical: 'top' };
      });
    });
  }

  // --- 1. Pages & Site Settings ---
  addKeyValueSheet('Page Content & Settings', siteSettings);

  // --- 2. Team Members ---
  addListSheet('Team Members', teamMembers, [
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Role', key: 'role', width: 25 },
    { header: 'Bio', key: 'bio', width: 80 },
  ]);

  // --- 3. Timeline Events (Our Story) ---
  addListSheet('Timeline (Our Story)', timelineEvents, [
    { header: 'Year', key: 'year', width: 15 },
    { header: 'Title', key: 'title', width: 40 },
    { header: 'Description', key: 'description', width: 80 }
  ]);

  // --- 4. Core Values ---
  addListSheet('Core Values', coreValues, [
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Description', key: 'description', width: 80 },
  ]);

  // --- 5. Framework (The Method) ---
  addListSheet('Method Framework', frameworkSteps, [
    { header: 'Step Number', key: 'stepNumber', width: 15 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Description', key: 'description', width: 80 },
    { header: 'Key Outputs', key: 'outputs', width: 60 }
  ]);

  // --- 6. Services Routes ---
  addListSheet('Service Routes', routes, [
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Icon Name', key: 'iconName', width: 15 },
    { header: 'Description', key: 'desc', width: 80 },
    { header: 'Best For', key: 'bestFor', width: 80 },
    { header: 'Core Line Items', key: 'lineItems', width: 60 }
  ]);

  // --- 7. Deliverables ---
  addListSheet('Deliverables', deliverables, [
    { header: 'Line Item (Parent)', key: 'lineItem', width: 30 },
    { header: 'Name', key: 'name', width: 50 },
  ]);

  // --- 8. Case Studies ---
  addListSheet('Case Studies', caseStudies, [
    { header: 'Client', key: 'client', width: 30 },
    { header: 'Title', key: 'title', width: 40 },
    { header: 'Tags', key: 'tags', width: 40 },
    { header: 'Sector', key: 'sector', width: 30 },
    { header: 'Description', key: 'description', width: 80 },
    { header: 'Route Type', key: 'route', width: 15 }
  ]);

  // --- 9. Journal Articles ---
  addListSheet('Journal Articles', journalArticles, [
    { header: 'Title', key: 'title', width: 40 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Excerpt', key: 'excerpt', width: 80 },
    { header: 'Published At', key: 'publishedAt', width: 20 }
  ]);

  // --- 10. Quiz / Assessment Questions ---
  addListSheet('Assessment Questions', quizQuestions, [
    { header: 'Step', key: 'step', width: 10 },
    { header: 'Question', key: 'question', width: 60 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Options', key: 'options', width: 80 }
  ]);

  // --- 11. FAQs ---
  addListSheet('General FAQs', faqs, [
    { header: 'Question', key: 'question', width: 50 },
    { header: 'Answer', key: 'answer', width: 100 },
  ]);

  // Save the workbook
  const filename = 'PBH_Client_Review_Content.xlsx';
  await workbook.xlsx.writeFile(filename);
  console.log(`\n✅ Successfully created ${filename}!`);
}

exportToExcel().catch(console.error);
