const fs = require('fs');
const path = require('path');

const dir = 'src/components/case-studies';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jsx'));

const singleButton = `<button onClick={() => navigate('work')} className="pointer-events-auto flex items-center gap-2 text-sm md:text-base backdrop-blur-md bg-white/5 px-4 py-2 rounded-full border border-white/10 transition-all hover:bg-white/10 font-secondary text-white/60 hover:text-white group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
        </button>`;

for (let file of files) {
  let p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');

  // Regex to match the Home button and All Case Studies button back-to-back
  const regex = /<button onClick=\{\(\) => navigate\('home'\)\}[^>]*>[\s\S]*?<ArrowLeft[^>]*>\s*Home\s*<\/button>\s*<button onClick=\{\(\) => navigate\('work'\)\}[^>]*>[\s\S]*?<ArrowLeft[^>]*>\s*All Case Studies\s*<\/button>/g;
  
  if (regex.test(content)) {
    content = content.replace(regex, singleButton);
    fs.writeFileSync(p, content);
    console.log(`Updated ${file}`);
  }
}
