const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = walkSync(dir + '/' + file, filelist);
    }
    else {
      if (file.endsWith('.jsx')) {
        filelist.push(dir + '/' + file);
      }
    }
  });
  return filelist;
};

const files = walkSync('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // We find all className="<stuff>" and replace inside
  content = content.replace(/className="([^"]*)"/g, (match, classString) => {
    let classes = classString.split(/\s+/);
    
    // Filter out old font classes
    classes = classes.filter(c => !['font-serif', 'font-sans', 'font-primary', 'font-secondary', 'font-header', 'font-body'].includes(c));
    
    // Map text sizes
    classes = classes.map(c => {
      if (/^(md:)?text-(4xl|5xl|6xl|7xl|8xl|9xl)$/.test(c)) return c.replace(/text-.*/, 't-heading');
      if (/^(md:)?text-\[(?:4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|[1-9][0-9]{2,})px\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-heading');
      if (/^(md:)?text-\[(?:[3-9]|[1-9][0-9]+)(\.[0-9]+)?rem\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-heading');

      if (/^(md:)?text-(xl|2xl|3xl)$/.test(c)) return c.replace(/text-.*/, 't-subheading');
      if (/^(md:)?text-\[(?:2[0-9]|3[0-9])px\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-subheading');
      if (/^(md:)?text-\[(?:1\.[5-9]|2\.[0-9])rem\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-subheading');

      if (/^(md:)?text-(xs|sm|base|lg)$/.test(c)) return c.replace(/text-.*/, 't-body');
      if (/^(md:)?text-\[(?:[0-9]|1[0-9])px\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-body');
      if (/^(md:)?text-\[(?:0\.[0-9]+|1\.[0-4])rem\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-body');
      
      return c;
    });

    return `className="${classes.join(' ').trim()}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
