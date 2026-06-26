const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// For the Featured Case Study Hero in WorkContent:
// Replace label:
content = content.replace(
  /<span className="text-\[10px\] font-medium tracking-widest uppercase block mb-4 font-primary"/g,
  '<span className="t-label block mb-4"'
);
// Replace title:
content = content.replace(
  /<h3 className="text-4xl md:text-5xl font-light mb-6 font-primary">/g,
  '<h3 className="t-display mb-6">'
);
// Replace excerpt:
content = content.replace(
  /<p className="text-white\/50 font-light mb-10 text-lg leading-relaxed font-secondary max-w-lg">/g,
  '<p className="t-body text-white/50 mb-10 max-w-lg">'
);

// For the regular grid case studies in WorkContent:
// Replace label:
content = content.replace(
  /<span className="text-\[10px\] tracking-widest uppercase font-primary font-medium"/g,
  '<span className="t-label"'
);
// Replace title:
content = content.replace(
  /<h4 className="text-3xl font-light text-white mb-6 font-primary leading-tight group-hover:text-white\/80 transition-colors">/g,
  '<h4 className="t-display !text-3xl md:!text-4xl text-white mb-6 group-hover:text-white/80 transition-colors">'
);
// Replace excerpt:
content = content.replace(
  /<p className="text-white\/50 font-light font-secondary line-clamp-3 mb-8">/g,
  '<p className="t-body text-white/50 line-clamp-3 mb-8">'
);

fs.writeFileSync('src/App.jsx', content);
console.log('Cards modified');
