import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {fileURLToPath} from 'node:url'
import {parse} from '@babel/parser'
import traverseModule from '@babel/traverse'
import {getCliClient} from 'sanity/cli'

const traverse = (traverseModule as any).default || traverseModule
const client = getCliClient({apiVersion: '2024-05-27'})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../..')
const srcRoot = path.join(repoRoot, 'src')

const visibleAttributes = new Set(['placeholder', 'aria-label', 'title', 'alt'])
const visibleObjectKeys = new Set([
  'title',
  'desc',
  'description',
  'excerpt',
  'author',
  'date',
  'time',
  'tag',
  'label',
  'question',
  'answer',
  'category',
  'name',
  'role',
  'bio',
  'phase',
  'focus',
  'lineItem',
  'bestFor',
  'interdependence',
  'heading',
  'subtext',
  'client',
  'sector',
  'challenge',
  'overview',
  'solution',
  'homeHeroTitle',
  'homeHeroSubtitle',
  'servicesHeader',
  'servicesSubtext',
  'journalHeader',
  'journalSubtext',
  'footerCTA',
  'pageLabel',
  'heroTitle',
  'visionLabel',
  'visionText',
  'missionLabel',
  'missionText',
  'purposeLabel',
  'purposeText',
  'philosophyLabel',
  'philosophyTitle',
  'philosophyText',
  'globalTitle',
  'globalText',
  'ctaButton',
  'problemTitle',
  'problemTitleItalic',
  'problemBody',
  'modelTitle',
  'modelTitleItalic',
  'oldWayLabel',
  'pbhWayLabel',
  'exploreRouteLabel',
  'howItWorksTitle',
  'howItWorksTitleItalic',
  'selectedWorkTitle',
  'selectedWorkTitleItalic',
  'selectedWorkCta',
  'journalTitle',
  'journalTitleItalic',
  'journalCta',
  'finalCtaEyebrow',
  'finalCtaTitle',
  'finalCtaTitleItalic',
  'finalCtaButton',
  'csBackToWork',
  'csSeeMoreWork',
  'csAllProjects',
  'csScrollStory',
  'csTheApproach',
  'csCarouselFallbackTitle',
  'csCarouselFallbackSubtitle',
  'csOurRole',
  'csTheProcess',
  'csResults',
  'csAboutTheBrand',
  'csTheProblem',
  'csCreativeSolution',
  'csEcosystemHighlights',
  'navWork',
  'navServices',
  'navAbout',
  'navJournal',
  'navContact',
  'navCtaDesktop',
  'navCtaMobile',
  'careersModalTitle',
  'careersModalText',
  'namePlaceholder',
  'phonePlaceholder',
  'emailPlaceholder',
  'linkedinPlaceholder',
  'summaryPlaceholder',
  'sendingText',
  'sendProfileBtn',
])

const skippedExactValues = new Set([
  'auto',
  'async',
  'bold',
  'add',
  'remove',
  'string',
  'object',
  'image',
  'video',
  'file',
  'primary',
  'secondary',
  'accent',
  'blue',
  'purple',
  'green',
  'orange',
  'left',
  'right',
  'top',
  'bottom',
  'center',
  'none',
  'true',
  'false',
  'home',
  'work',
  'about',
  'services',
  'journal',
  'contact',
  'assessment',
  'admin',
  'latest',
  'article',
  'route',
  'production',
  'client',
  'Arial',
])

const codeLikePattern =
  /[{}<>;=]|\$\{|rgba|rgb\(|translate|rotate|scale|skew|cubic-bezier|drop-shadow|blur\(|shadow-|border-|text-|bg-|grid-|flex-|items-|justify-|rounded-|px-|py-|mx-|my-|mt-|mb-|pt-|pb-|gap-|w-|h-|min-|max-|z-|opacity-|duration-|ease-|hover:|focus:|md:|lg:|sm:|xl:|2xl:|data:image|https?:\/\/|\/clients\/|\/api\/|\.png|\.jpe?g|\.gif|\.webp|\.svg|\.mp4|\.pdf|\.xlsx|^[.#]|^-?(left|right|top|bottom)-\d+|^-?\d+%\s+(center|left|right|top|bottom)|^\d+(px|vh|vw|rem|em|%)?$|^[A-Z]?\d{1,3}(:[A-Z]?\d{1,3})?$/i

const normalizeText = (value: unknown) =>
  typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''

const isHumanCopy = (value: string) => {
  const text = normalizeText(value)
  if (text.length < 2 || text.length > 280) return false
  if (skippedExactValues.has(text)) return false
  if (codeLikePattern.test(text)) return false
  if (!/[A-Za-z]/.test(text)) return false
  if (/^-?\d+%?\s+(center|left|right|top|bottom|auto)$/i.test(text)) return false
  if (/^[a-z][a-z0-9_-]*$/.test(text) && text.length > 10) return false
  if (/^[A-Z]{2,5}$/.test(text)) return false
  return true
}

const walk = (directory: string, files: string[] = []) => {
  for (const name of fs.readdirSync(directory)) {
    const fullPath = path.join(directory, name)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walk(fullPath, files)
    } else if (/\.(jsx|js|tsx|ts)$/.test(fullPath) && !fullPath.includes('sanityQueries')) {
      files.push(fullPath)
    }
  }
  return files
}

const objectKeyName = (key: any) => {
  if (!key) return null
  if (key.type === 'Identifier') return key.name
  if (key.type === 'StringLiteral') return key.value
  return null
}

const isInsideJsxExpression = (pathRef: any) =>
  Boolean(pathRef.findParent((ancestor: any) => ancestor.isJSXExpressionContainer?.()))

const copyKeyFor = (source: string) => {
  const hash = crypto.createHash('sha1').update(source).digest('hex').slice(0, 12)
  const slug =
    source
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 46) || 'copy'
  return `copy.${slug}.${hash}`
}

const arrayKeyFor = (source: string) =>
  crypto.createHash('sha1').update(source).digest('hex').slice(0, 12)

const collectCopy = () => {
  const collected = new Map<string, {source: string; location: string; kind: string}>()

  const add = (value: string, filePath: string, line: number, kind: string) => {
    const source = normalizeText(value)
    if (!isHumanCopy(source)) return
    if (collected.has(source)) return

    collected.set(source, {
      source,
      location: `${path.relative(repoRoot, filePath)}:${line}`,
      kind,
    })
  }

  for (const filePath of walk(srcRoot)) {
    const code = fs.readFileSync(filePath, 'utf8')
    let ast

    try {
      ast = parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      })
    } catch (error) {
      console.warn(`Skipping ${path.relative(repoRoot, filePath)}: ${(error as Error).message}`)
      continue
    }

    traverse(ast, {
      JSXText(pathRef: any) {
        add(pathRef.node.value, filePath, pathRef.node.loc?.start.line || 1, 'jsx text')
      },
      StringLiteral(pathRef: any) {
        const parent = pathRef.parent

        if (
          parent.type === 'ImportDeclaration' ||
          parent.type === 'ExportNamedDeclaration' ||
          parent.type === 'ExportAllDeclaration'
        ) {
          return
        }

        if (parent.type === 'JSXAttribute') {
          const name = parent.name?.name
          if (visibleAttributes.has(name)) {
            add(pathRef.node.value, filePath, pathRef.node.loc?.start.line || 1, `attribute:${name}`)
          }
          return
        }

        if (parent.type === 'ObjectProperty') {
          const key = objectKeyName(parent.key)
          if (parent.value === pathRef.node && visibleObjectKeys.has(key)) {
            add(pathRef.node.value, filePath, pathRef.node.loc?.start.line || 1, `object:${key}`)
          }
          return
        }

        if (
          isInsideJsxExpression(pathRef) &&
          ['LogicalExpression', 'ConditionalExpression', 'ArrayExpression'].includes(parent.type)
        ) {
          add(pathRef.node.value, filePath, pathRef.node.loc?.start.line || 1, 'jsx fallback')
        }
      },
    })
  }

  return Array.from(collected.values()).sort((a, b) => a.source.localeCompare(b.source))
}

async function run() {
  const settings = await client.fetch('*[_type == "siteSettings"][0]{_id, uiCopy}')
  const extracted = collectCopy()
  const existingEntries = Array.isArray(settings?.uiCopy) ? settings.uiCopy : []
  const existingBySource = new Map(existingEntries.map((entry: any) => [normalizeText(entry.source), entry]))

  const seededEntries = extracted.map((entry) => {
    const existing = existingBySource.get(entry.source)

    return {
      _key: existing?._key || arrayKeyFor(entry.source),
      _type: 'uiCopyEntry',
      key: existing?.key || copyKeyFor(entry.source),
      label: existing?.label || entry.source.slice(0, 80),
      source: entry.source,
      value: typeof existing?.value === 'string' ? existing.value : entry.source,
      location: existing?.location || entry.location,
    }
  })

  const extractedSources = new Set(extracted.map((entry) => entry.source))
  const manualEntries = existingEntries.filter((entry: any) => {
    const source = normalizeText(entry.source)
    const isPreviousGeneratedEntry =
      typeof entry.key === 'string' && entry.key.startsWith('copy.') && typeof entry.location === 'string'
    return source && !extractedSources.has(source) && !isPreviousGeneratedEntry
  })

  const uiCopy = [...seededEntries, ...manualEntries]

  if (!settings?._id) {
    await client.create({_type: 'siteSettings', uiCopy})
    console.log(`Created site settings and seeded ${uiCopy.length} UI copy entries.`)
    return
  }

  await client.patch(settings._id).set({uiCopy}).commit({autoGenerateArrayKeys: false})
  console.log(`Seeded ${seededEntries.length} UI copy entries. Preserved ${manualEntries.length} manual entries.`)
}

run().catch((error) => {
  console.error((error as Error).message)
  process.exit(1)
})
