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
    
    // Filter out old font classes ONLY if it's accompanied by a large size 
    // Wait, no, just map the font sizes. If it's t-title/heading/body it will have !important font.
    // Map text sizes exactly:
    classes = classes.map(c => {
      // Titles (Huge text)
      if (/^(md:|lg:|sm:)?text-(5xl|6xl|7xl|8xl|9xl)$/.test(c)) return c.replace(/text-.*/, 't-title');
      if (/^(md:|lg:|sm:)?text-\[(?:4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|[1-9][0-9]{2,})px\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-title');
      if (/^(md:|lg:|sm:)?text-\[(?:3\.[0-9]|[4-9]\.[0-9]+|[1-9][0-9]+(\.[0-9]+)?)rem\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-title');

      // Headings (Medium text)
      if (/^(md:|lg:|sm:)?text-(xl|2xl|3xl|4xl)$/.test(c)) return c.replace(/text-.*/, 't-heading');
      if (/^(md:|lg:|sm:)?text-\[(?:2[0-9]|3[0-9])px\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-heading');
      if (/^(md:|lg:|sm:)?text-\[(?:1\.[5-9]|2\.[0-9])rem\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-heading');

      // Body (Base text) - we leave xs, sm alone completely!
      if (/^(md:|lg:|sm:)?text-(base|lg)$/.test(c)) return c.replace(/text-.*/, 't-body');
      if (/^(md:|lg:|sm:)?text-\[(?:1[6-9])px\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-body'); // 16px to 19px
      if (/^(md:|lg:|sm:)?text-\[(?:1\.[0-4])rem\]$/.test(c)) return c.replace(/text-\[.*\]/, 't-body');
      
      return c;
    });

    return `className="${classes.join(' ').trim()}"`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
