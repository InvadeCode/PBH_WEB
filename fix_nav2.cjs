const fs = require('fs');
const path = require('path');

const dir = 'src/components/case-studies';
const files = ['GenericStorytellingExperience.jsx', 'BackToRootsExperience.jsx', 'ParamInnovationExperience.jsx', 'SnowLeopardExperience.jsx', 'LegacyExperience.jsx'];

const newNav = `      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex items-center gap-3 pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-sm md:text-base backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>`;

for (let file of files) {
  let p = path.join(dir, file);
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf8');

  // Find the string <div className="fixed top-0 left-0 w-full z-50 ... pointer-events-none">
  // Or just find the div that contains "Home" and "All Case Studies"
  
  // We can just find the <div className="fixed top-0 left-0 w-full z-50 ...
  // until the </div> right before the next section
  const regex = /<div className="fixed top-0 left-0 w-full z-50[^>]*>[\s\S]*?<button[^>]*>[\s\S]*?<ArrowLeft[^>]*> Home[\s\S]*?<\/button>[\s\S]*?<button[^>]*>[\s\S]*?<ArrowLeft[^>]*> All Case Studies[\s\S]*?<\/button>[\s\S]*?<\/div>/;
  
  if (regex.test(content)) {
    content = content.replace(regex, newNav.trim());
    fs.writeFileSync(p, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Regex did not match ${file}`);
  }
}
