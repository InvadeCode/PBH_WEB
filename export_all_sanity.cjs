const { createClient } = require('@sanity/client');
const ExcelJS = require('exceljs');

const client = createClient({
  projectId: '5nzj8z3i',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function exportToExcel() {
  console.log("Fetching all data from Sanity...");
  
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
  workbook.creator = 'Antigravity AI';
  workbook.created = new Date();

  // Helper to add a sheet with simple key/value pairs (like Site Settings)
  function addKeyValueSheet(name, dataObj) {
    if (!dataObj) return;
    const sheet = workbook.addWorksheet(name);
    sheet.columns = [
      { header: 'Section / Field', key: 'key', width: 40 },
      { header: 'Value', key: 'value', width: 100 }
    ];
    
    // Style headers
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

    const processObject = (obj, prefix = '') => {
      for (const [key, val] of Object.entries(obj)) {
        if (key.startsWith('_')) continue; // Skip Sanity internal fields
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
          // It's a nested object (like aboutPage)
          sheet.addRow({ key: `--- ${fullKey.toUpperCase()} ---`, value: '' }).font = { bold: true };
          processObject(val, fullKey);
        } else if (Array.isArray(val)) {
          sheet.addRow({ key: fullKey, value: JSON.stringify(val) });
        } else {
          sheet.addRow({ key: fullKey, value: val });
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
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD3D3D3' } };

    dataArray.forEach(item => {
      const rowData = {};
      columnsDef.forEach(col => {
        let val = item[col.key];
        if (Array.isArray(val)) val = val.join(' | ');
        if (typeof val === 'object' && val !== null) val = JSON.stringify(val);
        rowData[col.key] = val || '';
      });
      sheet.addRow(rowData);
    });
  }

  // --- 1. Pages & Site Settings (Hero texts, labels, etc.) ---
  addKeyValueSheet('Page Content & Settings', siteSettings);

  // --- 2. Team Members ---
  addListSheet('Team Members', teamMembers, [
    { header: 'ID', key: 'id', width: 15 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Role', key: 'role', width: 25 },
    { header: 'Description / Bio', key: 'bio', width: 60 },
    { header: 'Order', key: 'order', width: 10 }
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
    { header: 'Order', key: 'order', width: 10 }
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
    { header: 'Route ID', key: 'id', width: 15 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Type', key: 'type', width: 15 },
    { header: 'Description', key: 'desc', width: 60 },
    { header: 'Best For', key: 'bestFor', width: 60 }
  ]);

  // --- 7. Deliverables ---
  addListSheet('Deliverables', deliverables, [
    { header: 'ID', key: 'id', width: 20 },
    { header: 'Line Item (Parent)', key: 'lineItem', width: 20 },
    { header: 'Name', key: 'name', width: 40 },
    { header: 'Order', key: 'order', width: 10 }
  ]);

  // --- 8. Case Studies ---
  addListSheet('Case Studies', caseStudies, [
    { header: 'ID', key: 'id', width: 20 },
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
    { header: 'Slug', key: 'slug', width: 30 },
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
    { header: 'Order', key: 'order', width: 10 }
  ]);

  // Save the workbook
  const filename = 'PBH_Complete_Website_Content.xlsx';
  await workbook.xlsx.writeFile(filename);
  console.log(`\n✅ Successfully created ${filename}!`);
}

exportToExcel().catch(console.error);
