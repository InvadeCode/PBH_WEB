import {getCliClient} from 'sanity/cli'

// One-off: seed dummy Team Credits onto the Firefox Bikes case study so the
// new credits section can be previewed. All values are editable in the Studio.
const client = getCliClient()

const DOC_ID = '8be27bc7-2257-433a-bb3b-71c9a113b3be' // Firefox Bikes

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

client
  .patch(DOC_ID)
  .set({teamCredits: {heading: 'The Team Behind It', members}})
  .commit()
  .then(() => console.log(`✅ Patched ${DOC_ID} (Firefox Bikes) with ${members.length} team members`))
  .catch((err) => {
    console.error('❌ Failed:', err.message)
    process.exit(1)
  })
