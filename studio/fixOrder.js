import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function main() {
  const query = '*[_type == "caseStudy" && !defined(orderRank)]'
  const docs = await client.fetch(query)

  console.log(`Found ${docs.length} documents without orderRank`)

  if (docs.length === 0) {
    console.log('No documents to fix.')
    return
  }

  const transaction = client.transaction()

  // Generate simple lexicographical strings: 'a|', 'b|', 'c|' ... 'z|', 'za|', etc.
  docs.forEach((doc, index) => {
    // simple string rank like '00010|', '00020|'
    const rank = String((index + 1) * 10).padStart(5, '0') + '|'
    transaction.patch(doc._id, (p) => p.set({ orderRank: rank }))
  })

  await transaction.commit()
  console.log('Successfully assigned orderRank to all case studies!')
}

main().catch(console.error)
