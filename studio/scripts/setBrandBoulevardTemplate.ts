import {getCliClient} from 'sanity/cli'

// Assign the Arise ("Brand Boulevard") interface to every case study whose
// route is "Brand Boulevard" (published + drafts), so they all share the
// fixed gallery. Fully reversible by clearing the `template` field in Studio.
const client = getCliClient()

async function run() {
  const ids: string[] = await client.fetch('*[_type == "caseStudy" && route == "Brand Boulevard"]._id')
  if (!ids.length) {
    console.log('No Brand Boulevard case studies found.')
    return
  }
  console.log(`Found ${ids.length} Brand Boulevard documents (incl. drafts).`)
  let tx = client.transaction()
  for (const id of ids) {
    tx = tx.patch(id, (p) => p.set({template: 'arise'}))
  }
  await tx.commit()
  console.log(`✅ Set template = 'arise' on ${ids.length} documents.`)
}

run().catch((err) => {
  console.error('❌ Failed:', err.message)
  process.exit(1)
})
