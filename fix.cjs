const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// We want to replace standard text sizes with the Arise Case Study 3 fonts.
// Large: font-primary text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight
// Medium: font-primary text-xl md:text-2xl font-medium tracking-tight
// Small/Body: font-secondary text-[17px] md:text-[19px] leading-relaxed font-normal

// A helper to strip existing font/size classes
function stripClasses(cls) {
  // Remove text-3xl, md:text-4xl, lg:text-5xl, text-lg, text-base, text-[20px], etc.
  cls = cls.replace(/text-\w+(-\w+)?/g, '');
  cls = cls.replace(/md:text-\w+(-\w+)?/g, '');
  cls = cls.replace(/lg:text-\w+(-\w+)?/g, '');
  cls = cls.replace(/text-\[[^\]]+\]/g, '');
  cls = cls.replace(/md:text-\[[^\]]+\]/g, '');
  cls = cls.replace(/lg:text-\[[^\]]+\]/g, '');
  
  // Remove existing font families/weights
  cls = cls.replace(/font-light/g, '');
  cls = cls.replace(/font-medium/g, '');
  cls = cls.replace(/font-normal/g, '');
  cls = cls.replace(/font-primary/g, '');
  cls = cls.replace(/font-secondary/g, '');
  cls = cls.replace(/tracking-tight/g, '');
  cls = cls.replace(/leading-relaxed/g, '');
  cls = cls.replace(/leading-tight/g, '');
  
  // Clean up extra spaces
  return cls.replace(/\s+/g, ' ').trim();
}

// 1. Process all <h1 and <h2 to be LARGE
content = content.replace(/(<h[12][^>]*className=")([^"]*)(")/g, (match, start, cls, end) => {
  let cleaned = stripClasses(cls);
  return start + cleaned + " font-primary text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight" + end;
});

// 2. Process all <h3 and <h4 to be MEDIUM or LABELS
content = content.replace(/(<h[34][^>]*className=")([^"]*)(")/g, (match, start, cls, end) => {
  let isLabel = cls.includes('uppercase') && (cls.includes('tracking-widest') || cls.includes('tracking-wider'));
  let cleaned = stripClasses(cls);
  if (isLabel) {
    return start + cleaned + " font-primary text-sm md:text-base tracking-widest uppercase font-bold" + end;
  } else {
    return start + cleaned + " font-primary text-xl md:text-2xl font-medium tracking-tight" + end;
  }
});

// 3. Process all <p to be SMALL/BODY, EXCEPT if they are tiny text (like notes)
content = content.replace(/(<p[^>]*className=")([^"]*)(")/g, (match, start, cls, end) => {
  if (cls.includes('text-xs') || cls.includes('text-[10px]') || cls.includes('text-[12px]')) {
    return match; // Leave tiny text alone
  }
  let cleaned = stripClasses(cls);
  return start + cleaned + " font-secondary text-[17px] md:text-[19px] leading-relaxed font-normal" + end;
});

// Also replace t-display, t-body, t-label usage
content = content.replace(/t-display/g, "font-primary text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight");
content = content.replace(/t-body/g, "font-secondary text-[17px] md:text-[19px] leading-relaxed font-normal");
content = content.replace(/t-label/g, "font-primary text-sm md:text-base tracking-widest uppercase font-bold");

fs.writeFileSync('src/App.jsx', content);
console.log('App.jsx modified');
