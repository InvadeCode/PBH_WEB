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

  // 1. Remove arbitrary font family classes
  content = content.replace(/(?<=className="[^"]*?)\bfont-(serif|sans|primary|secondary|header|body)\b(?=[^"]*?")/g, '');

  // 2. Replace size classes with semantic classes
  // Large text -> t-heading
  content = content.replace(/(?<=className="[^"]*?)\btext-(4xl|5xl|6xl|7xl|8xl|9xl)\b(?=[^"]*?")/g, 't-heading');
  content = content.replace(/(?<=className="[^"]*?)\btext-\[(?:4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|[1-9][0-9]{2,})px\]\b(?=[^"]*?")/g, 't-heading');
  content = content.replace(/(?<=className="[^"]*?)\btext-\[(?:[3-9]|[1-9][0-9]+)(\.[0-9]+)?rem\]\b(?=[^"]*?")/g, 't-heading');

  // Medium text -> t-subheading
  content = content.replace(/(?<=className="[^"]*?)\btext-(xl|2xl|3xl)\b(?=[^"]*?")/g, 't-subheading');
  content = content.replace(/(?<=className="[^"]*?)\btext-\[(?:2[0-9]|3[0-9])px\]\b(?=[^"]*?")/g, 't-subheading');
  content = content.replace(/(?<=className="[^"]*?)\btext-\[(?:1\.[5-9]|2\.[0-9])rem\]\b(?=[^"]*?")/g, 't-subheading');

  // Small text -> t-body
  content = content.replace(/(?<=className="[^"]*?)\btext-(xs|sm|base|lg)\b(?=[^"]*?")/g, 't-body');
  content = content.replace(/(?<=className="[^"]*?)\btext-\[(?:[0-9]|1[0-9])px\]\b(?=[^"]*?")/g, 't-body');
  content = content.replace(/(?<=className="[^"]*?)\btext-\[(?:0\.[0-9]+|1\.[0-4])rem\]\b(?=[^"]*?")/g, 't-body');

  // Also catch generic md:text-*
  content = content.replace(/(?<=className="[^"]*?)\bmd:text-(4xl|5xl|6xl|7xl|8xl|9xl)\b(?=[^"]*?")/g, 'md:t-heading');
  content = content.replace(/(?<=className="[^"]*?)\bmd:text-(xl|2xl|3xl)\b(?=[^"]*?")/g, 'md:t-subheading');
  content = content.replace(/(?<=className="[^"]*?)\bmd:text-(xs|sm|base|lg)\b(?=[^"]*?")/g, 'md:t-body');

  // Clean up multiple spaces inside className ONLY
  content = content.replace(/className=" +/g, 'className="');
  content = content.replace(/ +"/g, '"');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
