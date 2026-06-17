import {getCliClient} from 'sanity/cli'

const client = getCliClient()

async function main() {
  const query = `*[_type == "caseStudy"] {
    "id": _id,
    client,
    challenge,
    deliverablesHeading,
    "strategy": fullStory.strategy
  }`
  const docs = await client.fetch(query)

  console.log(JSON.stringify(docs, null, 2))
}

main().catch(console.error)
