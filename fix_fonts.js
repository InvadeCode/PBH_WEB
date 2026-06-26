const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf8');

// The 3 fonts:
// 1. Large Headers: font-primary text-5xl md:text-7xl lg:text-8xl
// 2. Sub Headers: font-primary text-xl md:text-2xl
// 3. Body: font-secondary text-[17px] md:text-[19px]

// We will replace existing sizes for h1, h2 with large headers
content = content.replace(/<h[12]([^>]*className="[^"]*)text-\d[a-z]+(\smd:text-\d[a-z]+)?(\slg:text-\d[a-z]+)?([^"]*)"/g, (match, p1, p2, p3, p4) => {
    // remove other font sizes
    let newClass = p1 + p4;
    return `<h2${newClass.replace(/text-\w+ /g, '')} font-primary text-5xl md:text-7xl lg:text-8xl"`;
});

// For h3, h4, we use the sub header size
content = content.replace(/<h[34]([^>]*className="[^"]*)text-\d[a-z]+(\smd:text-\d[a-z]+)?(\slg:text-\d[a-z]+)?([^"]*)"/g, (match, p1, p2, p3, p4) => {
    let newClass = p1 + p4;
    return `<h3${newClass.replace(/text-\w+ /g, '')} font-primary text-xl md:text-2xl"`;
});

// For paragraph text, replace with the body text font
content = content.replace(/<p([^>]*className="[^"]*)text-[a-z]+(\smd:text-[a-z]+)?([^"]*)"/g, (match, p1, p2, p3) => {
    let newClass = p1 + p3;
    return `<p${newClass.replace(/text-\w+ /g, '')} font-secondary text-[17px] md:text-[19px]"`;
});

// Fix t-display, t-body
content = content.replace(/t-display/g, "font-primary text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight");
content = content.replace(/t-body/g, "font-secondary text-[17px] md:text-[19px] leading-relaxed font-normal");
content = content.replace(/t-label/g, "font-primary text-sm md:text-base tracking-widest uppercase font-bold");

fs.writeFileSync('src/App.jsx.modified', content);
