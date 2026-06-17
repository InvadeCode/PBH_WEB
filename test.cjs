const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: '5nzj8z3i',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});
client.fetch(`*[_type == "teamMember"]{name, bio}`).then(console.log);
