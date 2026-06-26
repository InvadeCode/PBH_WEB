const fs = require('fs');
const path = require('path');
const dir = '/Users/shravanikhurpe/.gemini/antigravity/brain/86955b79-eb96-45a1-8982-5148708bba21/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
const latest = files.map(f => ({ name: f, time: fs.statSync(path.join(dir, f)).mtime.getTime() })).sort((a, b) => b.time - a.time)[0];

const imgData = fs.readFileSync(path.join(dir, latest.name));
// Just reading some bytes from the middle of the PNG file assuming it's uncompressed or we can find the palette/RGB
// PNG parsing in raw JS is hard, let's just use sharp or canvas if installed in this project
