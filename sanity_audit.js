const sanityClient = require('@sanity/client');
const client = sanityClient.createClient({
  projectId: '5nzj8z3i',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2023-05-03',
});

async function run() {
  const docs = await client.fetch('*[!(_id in path("drafts.**"))]');
  console.log(JSON.stringify(docs, null, 2));
}

run().catch(console.error);
