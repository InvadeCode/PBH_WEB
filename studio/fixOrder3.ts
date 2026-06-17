import {getCliClient} from 'sanity/cli'
import {LexoRank} from 'lexorank'

const client = getCliClient()

async function main() {
  const query = '*[_type == "caseStudy"]'
  const docs = await client.fetch(query)

  console.log(`Found ${docs.length} documents. Setting fresh valid LexoRanks.`)

  const transaction = client.transaction()

  // Generate valid lexo ranks
  let currentRank = LexoRank.middle()
  
  docs.forEach((doc) => {
    transaction.patch(doc._id, (p) => p.set({ orderRank: currentRank.toString() }))
    currentRank = currentRank.genNext()
  })

  await transaction.commit()
  console.log('Successfully assigned valid LexoRank to all case studies!')
}

main().catch(console.error)
