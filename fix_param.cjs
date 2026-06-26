const fs = require('fs');
const content = fs.readFileSync('src/components/case-studies/AriseVenturesExperience.jsx', 'utf8');
const newContent = content.replace(/AriseVenturesExperience/g, 'ParamInnovationExperience');
fs.writeFileSync('src/components/case-studies/ParamInnovationExperience.jsx', newContent);
console.log('Replaced ParamInnovationExperience with Arise template');
