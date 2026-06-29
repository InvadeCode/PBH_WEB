import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-05-27'})

const defaultStoryChapters = [
  {
    _key: 'seed',
    _type: 'object',
    title: 'The Seed',
    description: 'Every brand begins as a single idea, planted deep.',
  },
  {
    _key: 'soil',
    _type: 'object',
    title: 'The Soil',
    description: 'Nurtured by heritage, grounded in meaning.',
  },
  {
    _key: 'first-light',
    _type: 'object',
    title: 'First Light',
    description: 'A visual language breaks through the surface.',
  },
  {
    _key: 'taking-root',
    _type: 'object',
    title: 'Taking Root',
    description: 'Identity spreads, steady and deliberate.',
  },
  {
    _key: 'bloom',
    _type: 'object',
    title: 'The Bloom',
    description: 'Form and feeling flourish into one.',
  },
  {
    _key: 'harvest',
    _type: 'object',
    title: 'The Harvest',
    description: 'A story ready to be shared with the world.',
  },
  {
    _key: 'full-circle',
    _type: 'object',
    title: 'Full Circle',
    description: 'Rooted in the past, reaching for tomorrow.',
  },
]

async function run() {
  const settings = await client.fetch('*[_type == "siteSettings"][0]{_id, defaultStoryChapters}')

  if (!settings?._id) {
    await client.create({_type: 'siteSettings', defaultStoryChapters})
    console.log('Created site settings with default story chapters.')
    return
  }

  if ((settings.defaultStoryChapters || []).length > 0) {
    console.log('Default story chapters already exist. No changes made.')
    return
  }

  await client.patch(settings._id).set({defaultStoryChapters}).commit()
  console.log('Seeded default story chapters into site settings.')
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
