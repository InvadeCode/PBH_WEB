const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:5173/assessment');
  // Wait for the form to load
  await page.waitForTimeout(2000);
  
  // Try to just take a PDF of the first step to see if body color is applied in print
  await page.emulateMedia({ media: 'print' });
  await page.pdf({ path: 'test_print.pdf', format: 'A4', printBackground: true });
  await browser.close();
  console.log("PDF generated at test_print.pdf");
})();
