import {getCliClient} from 'sanity/cli'

// Rename the default credits heading on every case study that still uses the
// old placeholder. Custom headings are left untouched.
const client = getCliClient()

const OLD = 'The Team Behind It'
const NEW = 'The Minds Behind the Magic'

async function run() {
  const ids: string[] = await client.fetch('*[_type == "caseStudy" && teamCredits.heading == $old]._id', {old: OLD})
  if (!ids.length) {
    console.log('No documents with the old heading found.')
    return
  }
  let tx = client.transaction()
  for (const id of ids) {
    tx = tx.patch(id, (p) => p.set({'teamCredits.heading': NEW}))
  }
  await tx.commit()
  console.log(`✅ Renamed heading on ${ids.length} documents → "${NEW}"`)
}

run().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
