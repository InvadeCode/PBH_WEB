import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-05-27'})

const defaultStoryChapters = [
  {
    _key: 'seed',
    _type: 'storyChapter',
    title: 'The Seed',
    description: 'Every brand begins as a single idea, planted deep.',
  },
  {
    _key: 'soil',
    _type: 'storyChapter',
    title: 'The Soil',
    description: 'Nurtured by heritage, grounded in meaning.',
  },
  {
    _key: 'firstLight',
    _type: 'storyChapter',
    title: 'First Light',
    description: 'A visual language breaks through the surface.',
  },
  {
    _key: 'takingRoot',
    _type: 'storyChapter',
    title: 'Taking Root',
    description: 'Identity spreads, steady and deliberate.',
  },
  {
    _key: 'bloom',
    _type: 'storyChapter',
    title: 'The Bloom',
    description: 'Form and feeling flourish into one.',
  },
  {
    _key: 'harvest',
    _type: 'storyChapter',
    title: 'The Harvest',
    description: 'A story ready to be shared with the world.',
  },
  {
    _key: 'fullCircle',
    _type: 'storyChapter',
    title: 'Full Circle',
    description: 'Rooted in the past, reaching for tomorrow.',
  },
]

type StoryChapter = {
  _key?: string
  _type?: string
  chapterLabel?: string
  title?: string
  description?: string
  image?: unknown
  video?: unknown
}

type CaseStudyDoc = {
  _id: string
  client?: string
  fullStory?: {
    storyChapters?: StoryChapter[]
  }
}

const hasText = (value?: string) => typeof value === 'string' && value.trim().length > 0

const getUniqueKey = (preferredKey: string, usedKeys: Set<string>) => {
  if (!usedKeys.has(preferredKey)) {
    usedKeys.add(preferredKey)
    return preferredKey
  }

  let index = 1
  while (usedKeys.has(`${preferredKey}${index}`)) index += 1
  const key = `${preferredKey}${index}`
  usedKeys.add(key)
  return key
}

const buildStoryChapters = (existingChapters: StoryChapter[] = []) => {
  const usedKeys = new Set(existingChapters.map((chapter) => chapter._key).filter(Boolean) as string[])
  const nextChapters = [...existingChapters]

  while (nextChapters.length < defaultStoryChapters.length) {
    const fallback = defaultStoryChapters[nextChapters.length]
    nextChapters.push({
      _key: getUniqueKey(fallback._key, usedKeys),
      _type: 'storyChapter',
    })
  }

  return nextChapters.map((chapter, index) => {
    const fallback = defaultStoryChapters[index % defaultStoryChapters.length]
    return {
      ...chapter,
      _key: chapter._key || getUniqueKey(fallback._key, usedKeys),
      _type: 'storyChapter',
      title: hasText(chapter.title) ? chapter.title : fallback.title,
      description: hasText(chapter.description) ? chapter.description : fallback.description,
    }
  })
}

async function run() {
  const docs: CaseStudyDoc[] = await client.fetch(`
    *[_type == "caseStudy" && !(_id in path("versions.**"))]{
      _id,
      client,
      fullStory{storyChapters}
    }
  `)

  if (!docs.length) {
    console.log('No case study documents found.')
    return
  }

  let tx = client.transaction()
  let changedCount = 0

  for (const doc of docs) {
    const currentChapters = doc.fullStory?.storyChapters || []
    const nextChapters = buildStoryChapters(currentChapters)
    const changed = JSON.stringify(currentChapters) !== JSON.stringify(nextChapters)

    if (!changed) continue

    changedCount += 1
    tx = tx.patch(doc._id, (patch) =>
      patch.set({
        'fullStory.storyChapters': nextChapters,
      }),
    )
  }

  if (changedCount === 0) {
    console.log('All case studies already have visible story chapter text.')
    return
  }

  await tx.commit()
  console.log(`Seeded visible story chapter text into ${changedCount} case study document(s).`)
}

run().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
