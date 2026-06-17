import { createClient } from '@sanity/client'
const client = createClient({
  projectId: '5nzj8z3i',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-05-03',
})
client.fetch('*[_type == "caseStudy"]{client, title, _id}').then(console.log)
