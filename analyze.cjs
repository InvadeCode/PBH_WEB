const fs = require('fs');
const { PNG } = require('pngjs');

function analyze(file) {
  if (!fs.existsSync(file)) return;
  const data = fs.readFileSync(file);
  const png = PNG.sync.read(data);
  const colors = {};
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      const r = png.data[idx];
      const g = png.data[idx+1];
      const b = png.data[idx+2];
      const a = png.data[idx+3];
      if (a > 100) {
        const key = `${r},${g},${b}`;
        colors[key] = (colors[key] || 0) + 1;
      }
    }
  }
  const sorted = Object.entries(colors).sort((a,b) => b[1] - a[1]).slice(0, 5);
  console.log(`Top colors for ${file}:`);
  sorted.forEach(([k, v]) => console.log(`  rgb(${k}): ${v} pixels`));
}

analyze('public/pbh-logos/firefox.png');
analyze('public/pbh-logos/NSE.png');
analyze('public/pbh-logos/Arise Ventures.png');
