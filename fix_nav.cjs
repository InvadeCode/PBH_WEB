const fs = require('fs');
const path = require('path');

const dir = 'src/components/case-studies';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const newNav = `      {/* Navigation */}
      <div className="fixed top-0 left-0 w-full z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex items-center gap-3 pointer-events-none">
        <button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-sm md:text-base backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>
      </div>`;

for (let file of files) {
  let p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');

  // Search for the navigation block
  // It usually starts with <div className="fixed top-0 ... pointer-events-none">
  // and ends with </div> right before {/* ── 1. CINEMATIC HERO (Boxed) ── */} or similar section.
  
  const navRegex = /<div className="fixed top-0 left-0 w-full z-50 px-6 pt-28 pb-6 md:px-12 md:pt-32 md:pb-8 flex items-center gap-3 pointer-events-none">[\s\S]*?<\/div>/;
  
  if (navRegex.test(content)) {
    content = content.replace(navRegex, newNav.trim());
    fs.writeFileSync(p, content);
    console.log(`Updated ${file}`);
  }
}
