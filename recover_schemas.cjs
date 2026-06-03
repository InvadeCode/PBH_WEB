const fs = require('fs');

const docs = JSON.parse(fs.readFileSync('./all_docs.json')).result;
const types = [...new Set(docs.map(d => d._type))].filter(t => !t.startsWith('sanity.'));

const inferField = (key, value) => {
  if (value === null || value === undefined) {
    return { type: 'string' };
  }
  if (typeof value === 'string') {
    if (value.length > 200) return { type: 'text' };
    return { type: 'string' };
  }
  if (typeof value === 'number') return { type: 'number' };
  if (typeof value === 'boolean') return { type: 'boolean' };
  if (Array.isArray(value)) {
    if (value.length > 0 && value[0] && value[0]._type === 'block') {
      return { type: 'array', of: [{type: 'block'}] };
    }
    if (value.length > 0 && value[0] && value[0]._type === 'reference') {
      const refType = value[0]._ref ? 'unknown' : 'unknown';
      return { type: 'array', of: [{type: 'reference', to: [{type: refType}]}] };
    }
    if (value.length > 0 && typeof value[0] === 'string') {
      return { type: 'array', of: [{type: 'string'}] };
    }
    if (value.length > 0 && typeof value[0] === 'object' && value[0]._type === 'image') {
      return { type: 'array', of: [{type: 'image'}] };
    }
    return { type: 'array', of: [{type: 'string'}] };
  }
  if (value && typeof value === 'object') {
    if (value._type === 'image') return { type: 'image' };
    if (value._type === 'slug') return { type: 'slug' };
    if (value._type === 'reference') return { type: 'reference', to: [{type: 'unknown'}] };
    return { type: 'object', fields: [] }; // placeholder
  }
  return { type: 'string' };
};

const formatFieldDef = (fieldInfo) => {
  if (fieldInfo.type === 'array') {
    const ofItems = fieldInfo.of.map(item => {
      if (item.type === 'reference') {
        const toTypes = item.to.map(t => `{type: '${t.type}'}`).join(', ');
        return `{type: 'reference', to: [${toTypes}]}`;
      }
      return `{type: '${item.type}'}`;
    }).join(', ');
    return `type: 'array',\n      of: [${ofItems}]`;
  }
  if (fieldInfo.type === 'reference') {
    const toTypes = fieldInfo.to.map(t => `{type: '${t.type}'}`).join(', ');
    return `type: 'reference',\n      to: [${toTypes}]`;
  }
  if (fieldInfo.type === 'image') {
    return `type: 'image'`;
  }
  return `type: '${fieldInfo.type}'`;
};

const schemaFiles = [];

types.forEach(type => {
  const sampleDocs = docs.filter(d => d._type === type);
  const allKeys = new Set();
  sampleDocs.forEach(d => Object.keys(d).forEach(k => {
    if (!k.startsWith('_')) allKeys.add(k);
  }));

  const fields = [];
  allKeys.forEach(key => {
    let sampleVal = null;
    for (const d of sampleDocs) {
      if (d[key] !== undefined && d[key] !== null) {
        sampleVal = d[key];
        break;
      }
    }
    const fieldInfo = inferField(key, sampleVal);
    const titleCase = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
    fields.push(`    defineField({\n      name: '${key}',\n      title: '${titleCase}',\n      ${formatFieldDef(fieldInfo)},\n    })`);
  });

  const schemaContent = `import { defineField, defineType } from 'sanity'

export default defineType({
  name: '${type}',
  title: '${type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1')}',
  type: 'document',
  fields: [
${fields.join(',\n')}
  ],
})
`;

  fs.writeFileSync(`./studio/schemaTypes/${type}.ts`, schemaContent);
  schemaFiles.push(type);
  console.log(`  ✓ ${type}.ts`);
});

// Build index.ts with all types + lead
const imports = schemaFiles.map(t => `import ${t} from './${t}'`).join('\n');
const allTypes = [...schemaFiles, 'lead'];
const indexContent = `${imports}\nimport lead from './lead'\n\nexport const schemaTypes = [${allTypes.join(', ')}]\n`;
fs.writeFileSync('./studio/schemaTypes/index.ts', indexContent);

console.log(`\n✅ Generated ${schemaFiles.length} schemas + lead. Total: ${allTypes.length}`);
