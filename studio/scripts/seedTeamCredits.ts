import {getCliClient} from 'sanity/cli'

// Seed placeholder Team Credits onto EVERY case study (published + drafts).
// Uses setIfMissing so any credits already entered in the Studio are preserved.
// All values remain fully editable in Sanity.
const client = getCliClient()

const people: [string, string][] = [
  ['Prerita Chauthaiwale', 'Brand Strategy'],
  ['Jigya Joshi', 'Creative Direction'],
  ['Deependra Sharma', 'Visual Design'],
  ['Dhruv Bhardwaj', 'Design'],
  ['Harsh Sodi', 'Motion & 3D'],
  ['Ayush Arora', 'Web Development'],
  ['Anannya Anwesa', 'Copy & Narrative'],
  ['Riya Dhawan', 'Project Management'],
]

const members = people.map(([name, title], i) => ({
  _key: `fx${i}`,
  _type: 'member',
  name,
  title,
}))

const teamCredits = {heading: 'The Team Behind It', members}

async function run() {
  const ids: string[] = await client.fetch('*[_type == "caseStudy"]._id')
  if (!ids.length) {
    console.log('No case study documents found.')
    return
  }
  console.log(`Found ${ids.length} case study documents (incl. drafts).`)

  let tx = client.transaction()
  for (const id of ids) {
    tx = tx.patch(id, (p) => p.setIfMissing({teamCredits}))
  }
  await tx.commit()
  console.log(`✅ Team credits ensured on ${ids.length} documents.`)
}

run().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
