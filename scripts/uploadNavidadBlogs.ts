import { createClient } from 'next-sanity'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity environment variables in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
})

// Helper to parse inline markdown (links [text](url) and bold **text**)
function parseInline(text: string, baseKey: string) {
  const markDefs: any[] = []
  const children: any[] = []
  let childIdx = 0

  const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*)/g
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const plain = text.slice(lastIndex, match.index)
      if (plain) {
        children.push({
          _key: `${baseKey}_c${childIdx++}`,
          _type: 'span',
          marks: [],
          text: plain,
        })
      }
    }

    if (match[2] && match[3]) {
      // Link [text](url)
      const linkKey = `link_${Math.random().toString(36).substring(2, 7)}`
      markDefs.push({
        _key: linkKey,
        _type: 'link',
        href: match[3],
      })
      children.push({
        _key: `${baseKey}_c${childIdx++}`,
        _type: 'span',
        marks: [linkKey],
        text: match[2],
      })
    } else if (match[4]) {
      // Bold **text**
      children.push({
        _key: `${baseKey}_c${childIdx++}`,
        _type: 'span',
        marks: ['strong'],
        text: match[4],
      })
    }

    lastIndex = regex.lastIndex
  }

  if (lastIndex < text.length) {
    const plain = text.slice(lastIndex)
    if (plain) {
      children.push({
        _key: `${baseKey}_c${childIdx++}`,
        _type: 'span',
        marks: [],
        text: plain,
      })
    }
  }

  if (children.length === 0) {
    children.push({
      _key: `${baseKey}_c0`,
      _type: 'span',
      marks: [],
      text: '',
    })
  }

  return { markDefs, children }
}

// Convert a markdown text chunk (between figures) into PortableText blocks
function processTextChunk(chunk: string) {
  const blocks: any[] = []
  const paragraphs = chunk.split(/\n\s*\n/)

  for (const para of paragraphs) {
    const trimmed = para.trim()
    if (!trimmed) continue

    const lines = trimmed.split('\n')
    const isOrderedList = lines.every((l) => /^\d+\.\s/.test(l.trim()))
    const isBulletList = lines.every((l) => /^[-*]\s/.test(l.trim()))

    if (isOrderedList) {
      for (const line of lines) {
        const text = line.replace(/^\d+\.\s*/, '').trim()
        const key = Math.random().toString(36).substring(2, 11)
        const { markDefs, children } = parseInline(text, key)
        blocks.push({
          _key: key,
          _type: 'block',
          style: 'normal',
          listItem: 'number',
          level: 1,
          markDefs,
          children,
        })
      }
    } else if (isBulletList) {
      for (const line of lines) {
        const text = line.replace(/^[-*]\s*/, '').trim()
        const key = Math.random().toString(36).substring(2, 11)
        const { markDefs, children } = parseInline(text, key)
        blocks.push({
          _key: key,
          _type: 'block',
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          markDefs,
          children,
        })
      }
    } else if (trimmed.startsWith('#### ')) {
      const text = trimmed.slice(5).trim()
      const key = Math.random().toString(36).substring(2, 11)
      const { markDefs, children } = parseInline(text, key)
      blocks.push({ _key: key, _type: 'block', style: 'h4', markDefs, children })
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4).trim()
      const key = Math.random().toString(36).substring(2, 11)
      const { markDefs, children } = parseInline(text, key)
      blocks.push({ _key: key, _type: 'block', style: 'h3', markDefs, children })
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3).trim()
      if (/cierre y cta/i.test(text)) {
        continue // Skip editorial heading
      }
      const key = Math.random().toString(36).substring(2, 11)
      const { markDefs, children } = parseInline(text, key)
      blocks.push({ _key: key, _type: 'block', style: 'h2', markDefs, children })
    } else {
      const cleanPara = trimmed.replace(/\n+/g, ' ')
      const key = Math.random().toString(36).substring(2, 11)
      const { markDefs, children } = parseInline(cleanPara, key)
      blocks.push({ _key: key, _type: 'block', style: 'normal', markDefs, children })
    }
  }

  return blocks
}

// Upload local image to Sanity asset store
async function uploadImage(filePath: string, filename: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const existingAsset = await client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]._id`,
    { filename }
  )
  if (existingAsset) {
    console.log(`  ✓ Reusing existing asset for ${filename} -> ${existingAsset}`)
    return { _id: existingAsset }
  }

  console.log(`  ⬆ Uploading image ${filename}...`)
  const stream = fs.createReadStream(filePath)
  const asset = await client.assets.upload('image', stream, {
    filename,
  })
  console.log(`  ✓ Uploaded ${filename} -> ${asset._id}`)
  return asset
}

// Helper to create an image block in PortableText
function imageBlock(assetId: string, alt: string, caption?: string) {
  return {
    _key: Math.random().toString(36).substring(2, 11),
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
    alt,
    caption: caption || undefined,
  }
}

interface BlogConfig {
  folder: string
  publishedAt: string
  categoryIds: string[]
}

const BLOGS_TO_UPLOAD: BlogConfig[] = [
  {
    folder: '01-decoracion-de-navidad',
    publishedAt: '2026-09-24T18:00:00.000Z',
    categoryIds: [
      '5de61517-6d06-476e-b529-75c817b5b745', // Navidad Premium
      '12d151f7-1ab5-4e2e-9aa2-c5b3a5e14f8c', // Villas navideñas
    ],
  },
  {
    folder: '02-decoracion-arbol-de-navidad',
    publishedAt: '2026-09-24T17:00:00.000Z',
    categoryIds: [
      '14560d1a-6f91-4f2f-bdcc-180912ba3601', // Arboles de Navidad
      '5de61517-6d06-476e-b529-75c817b5b745', // Navidad Premium
    ],
  },
  {
    folder: '03-navidad-espacios-pequenos',
    publishedAt: '2026-09-24T16:00:00.000Z',
    categoryIds: [
      '5de61517-6d06-476e-b529-75c817b5b745', // Navidad Premium
      '14560d1a-6f91-4f2f-bdcc-180912ba3601', // Arboles de Navidad
    ],
  },
  {
    folder: '04-como-decorar-mesa-navidena',
    publishedAt: '2026-09-24T15:00:00.000Z',
    categoryIds: [
      '60231535-4fb2-4d43-8e11-92d825376448', // Navidad en la mesa
      '5de61517-6d06-476e-b529-75c817b5b745', // Navidad Premium
    ],
  },
  {
    folder: '05-decoracion-navidena-espacios-profesionales',
    publishedAt: '2026-09-24T14:00:00.000Z',
    categoryIds: [
      '5de61517-6d06-476e-b529-75c817b5b745', // Navidad Premium
      '14560d1a-6f91-4f2f-bdcc-180912ba3601', // Arboles de Navidad
    ],
  },
]

async function main() {
  console.log('=== INICIANDO SUBIDA DE BLOGS DE NAVIDAD A SANITY CMS ===\n')

  // 1. Asegurar autor 'Anbar Home'
  console.log('Verificando autor "Anbar Home"...')
  await client.createOrReplace({
    _id: 'author-anbar-home',
    _type: 'author',
    name: 'Anbar Home',
    slug: { _type: 'slug', current: 'anbar-home' },
    bio: [
      {
        _key: 'bio1',
        _type: 'block',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _key: 'bio1_c0',
            _type: 'span',
            marks: [],
            text: 'Editorial de diseño interior, confort y piezas atemporales de Anbar Home.',
          },
        ],
      },
    ],
  })
  console.log('✓ Autor "Anbar Home" verificado.\n')

  const authorRef = { _type: 'reference', _ref: 'author-anbar-home' }

  for (const item of BLOGS_TO_UPLOAD) {
    const folderPath = path.join('public/NAVIDAD', item.folder)
    const mdPath = path.join(folderPath, 'articulo-para-publicar.md')

    console.log(`\n========================================================`)
    console.log(`Procesando carpeta: ${item.folder}`)
    console.log(`Archivo: ${mdPath}`)

    const content = fs.readFileSync(mdPath, 'utf-8')

    // Parse Frontmatter
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch) throw new Error(`No se encontró frontmatter en ${mdPath}`)
    const fmLines = fmMatch[1].split('\n')
    const fm: Record<string, string> = {}
    for (const line of fmLines) {
      const colon = line.indexOf(':')
      if (colon > -1) {
        const k = line.slice(0, colon).trim()
        let v = line.slice(colon + 1).trim()
        if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
        fm[k] = v
      }
    }

    const title = fm.title
    const seoTitle = fm.seo_title || title
    const metaDescription = fm.meta_description || ''
    const slug = fm.slug

    console.log(`Título: "${title}"`)
    console.log(`Slug: "${slug}"`)
    console.log(`Fecha de publicación: ${item.publishedAt}`)

    // Parse Hero Figure
    const heroMatch = content.match(
      /<figure class="hero">[\s\S]*?<img src="([^"]+)" alt="([^"]+)"[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/
    )
    if (!heroMatch) throw new Error(`No se encontró figura hero en ${mdPath}`)
    const heroImageRelPath = heroMatch[1].replace(/^images\//, '')
    const heroAlt = heroMatch[2]
    const heroCaption = heroMatch[3].trim()

    const heroDiskPath = path.join(folderPath, 'images', heroImageRelPath)
    console.log(`Subiendo imagen Hero: ${heroImageRelPath}`)
    const heroAsset = await uploadImage(heroDiskPath, heroImageRelPath)

    // Extract Body
    const bodyMatch = content.match(/<!-- INICIO CUERPO -->([\s\S]*?)<!-- FIN CUERPO -->/)
    if (!bodyMatch) throw new Error(`No se encontraron marcadores de cuerpo en ${mdPath}`)
    const rawBody = bodyMatch[1].trim()

    // Parse Body into PortableText blocks
    const figureRegex =
      /<figure class="article-image">[\s\S]*?<img src="([^"]+)" alt="([^"]+)"[^>]*>[\s\S]*?<figcaption>([\s\S]*?)<\/figcaption>[\s\S]*?<\/figure>/g

    let lastIdx = 0
    let figMatch: RegExpExecArray | null
    const bodyBlocks: any[] = []

    // Add hero image as the lead visual block of the body
    bodyBlocks.push(imageBlock(heroAsset._id, heroAlt, heroCaption))

    while ((figMatch = figureRegex.exec(rawBody)) !== null) {
      const textChunk = rawBody.slice(lastIdx, figMatch.index)
      if (textChunk.trim()) {
        bodyBlocks.push(...processTextChunk(textChunk))
      }

      const imgRelPath = figMatch[1].replace(/^images\//, '')
      const imgAlt = figMatch[2]
      const imgCaption = figMatch[3].trim()
      const imgDiskPath = path.join(folderPath, 'images', imgRelPath)

      console.log(`Subiendo imagen interna: ${imgRelPath}`)
      const internalAsset = await uploadImage(imgDiskPath, imgRelPath)
      bodyBlocks.push(imageBlock(internalAsset._id, imgAlt, imgCaption))

      lastIdx = figureRegex.lastIndex
    }

    const remainingText = rawBody.slice(lastIdx)
    if (remainingText.trim()) {
      bodyBlocks.push(...processTextChunk(remainingText))
    }

    console.log(`Total bloques generados para PortableText: ${bodyBlocks.length}`)

    // Document ID for Sanity
    const docId = `post-${slug}`

    const categoriesRefs = item.categoryIds.map((catId, idx) => ({
      _key: `cat_${idx}`,
      _type: 'reference',
      _ref: catId,
    }))

    const postDoc = {
      _id: docId,
      _type: 'post',
      title,
      seoTitle,
      metaDescription,
      slug: {
        _type: 'slug',
        current: slug,
      },
      author: authorRef,
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: heroAsset._id,
        },
        alt: heroAlt,
        caption: heroCaption,
      },
      categories: categoriesRefs,
      publishedAt: item.publishedAt,
      body: bodyBlocks,
    }

    console.log(`Guardando documento en Sanity (${docId})...`)
    const res = await client.createOrReplace(postDoc)
    console.log(`✓ Documento publicado con éxito: ${res._id} | slug: ${slug}`)
  }

  console.log('\n========================================================')
  console.log('=== TODOS LOS BLOGS DE NAVIDAD FUERON SUBIDOS CON ÉXITO ===')
}

main().catch((err) => {
  console.error('Error durante la subida:', err)
  process.exit(1)
})
