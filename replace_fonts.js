const fs = require('fs');
const path = require('path');

const files = [
  'src/components/case-studies/SnowLeopardExperience.jsx',
  'src/components/case-studies/ParamInnovationExperience.jsx',
  'src/components/case-studies/LegacyExperience.jsx',
  'src/components/case-studies/BackToRootsExperience.jsx',
  'src/components/case-studies/AriseVenturesExperience.jsx'
];

const replacements = [
  // Anything smaller than Body -> Body
  { regex: /text-xs(?:\s+md:text-sm)?/g, replace: 'text-[17px] md:text-[19px]' },
  { regex: /text-sm(?:\s+md:text-base)?/g, replace: 'text-[17px] md:text-[19px]' },
  { regex: /text-base/g, replace: 'text-[17px] md:text-[19px]' },
  
  // Anything between Body and Medium -> Medium
  { regex: /text-lg(?:\s+md:text-xl)?/g, replace: 'text-xl md:text-2xl' },
  { regex: /text-2xl(?:\s+md:text-3xl|\s+md:text-4xl)?/g, replace: 'text-xl md:text-2xl' },
  { regex: /text-3xl(?:\s+md:text-4xl)?/g, replace: 'text-xl md:text-2xl' },
  { regex: /text-4xl/g, replace: 'text-xl md:text-2xl' },

  // Anything between Medium and Title -> Title
  { regex: /text-6xl/g, replace: 'text-5xl md:text-7xl lg:text-8xl' },
  
  // The big numbers in SnowLeopard which are explicitly responsive
  { regex: /text-\[28vw\](?:\s+md:text-\[15rem\])?/g, replace: 'text-5xl md:text-7xl lg:text-8xl' },
  { regex: /text-\[20vw\](?:\s+lg:text-\[7vw\]\s+xl:text-\[8vw\])?/g, replace: 'text-5xl md:text-7xl lg:text-8xl' },
  { regex: /text-\[15vw\](?:\s+lg:text-\[6vw\]\s+xl:text-\[7vw\])?/g, replace: 'text-5xl md:text-7xl lg:text-8xl' },
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // First, preserve the exact approved sizes by temporarily marking them
    content = content.replace(/text-5xl md:text-7xl lg:text-8xl/g, '__TITLE__');
    content = content.replace(/text-xl md:text-2xl/g, '__SUBTITLE__');
    content = content.replace(/text-\[17px\] md:text-\[19px\]/g, '__BODY__');

    // Run replacements
    replacements.forEach(({ regex, replace }) => {
      content = content.replace(regex, replace);
    });

    // We might have created some duplicates like `text-xl md:text-2xl text-xl md:text-2xl`, let's clean them up later if needed.
    
    // Restore the exact approved sizes
    content = content.replace(/__TITLE__/g, 'text-5xl md:text-7xl lg:text-8xl');
    content = content.replace(/__SUBTITLE__/g, 'text-xl md:text-2xl');
    content = content.replace(/__BODY__/g, 'text-[17px] md:text-[19px]');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
