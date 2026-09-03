import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const BANNERS_DIR = path.resolve('public/banners')
const OUTPUT_DIR = path.resolve('.temp_banners')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const bannerDefs = [
  {
    id: 1,
    horizontalMov: path.join(BANNERS_DIR, 'Horizontal 1.mov'),
    verticalMov: path.join(BANNERS_DIR, 'Vertical 1.mov'),
    alt: 'Jarrones escultóricos y piezas de diseño - Anbar Home',
    categoryRef: 'cQJcoXEME16oYHzJObfMFZ', // Jarrones escultóricos
  },
  {
    id: 2,
    horizontalMov: path.join(BANNERS_DIR, 'Horizontal 2 .mov'),
    verticalMov: path.join(BANNERS_DIR, 'Vertical 2.mov'),
    alt: 'Colección de diseño interior y esculturas - Anbar Home',
    categoryRef: 'cQJcoXEME16oYHzJOcH09N', // Esculturas
  },
  {
    id: 3,
    horizontalMov: path.join(BANNERS_DIR, 'Horizontal 3.mov'),
    verticalMov: path.join(BANNERS_DIR, 'Vertical 3.mov'),
    alt: 'Todo para transformar tu hogar - Acentos decorativos Anbar Home',
    categoryRef: 'NzlknxdQKnm0MUtifpqa8A', // Acentos decorativos
  },
]

async function main() {
  console.log('--- Iniciando optimización y subida de banners a Sanity ---')

  const newHeroBanners = []

  for (const b of bannerDefs) {
    console.log(`\nProcesando Banner ${b.id}...`)

    const hMp4 = path.join(OUTPUT_DIR, `banner_h_${b.id}.mp4`)
    const vMp4 = path.join(OUTPUT_DIR, `banner_v_${b.id}.mp4`)
    const hPoster = path.join(OUTPUT_DIR, `poster_h_${b.id}.jpg`)
    const vPoster = path.join(OUTPUT_DIR, `poster_v_${b.id}.jpg`)

    // 1. Transcode horizontal video to web-ready MP4 (H.264)
    console.log(` Transcodificando horizontal ${b.horizontalMov} -> ${hMp4}`)
    execSync(
      `ffmpeg -y -i "${b.horizontalMov}" -c:v libx264 -pix_fmt yuv420p -crf 22 -preset medium -movflags +faststart -an "${hMp4}"`,
      { stdio: 'inherit' }
    )

    // 2. Transcode vertical video to web-ready MP4 (H.264)
    console.log(` Transcodificando vertical ${b.verticalMov} -> ${vMp4}`)
    execSync(
      `ffmpeg -y -i "${b.verticalMov}" -c:v libx264 -pix_fmt yuv420p -crf 22 -preset medium -movflags +faststart -an "${vMp4}"`,
      { stdio: 'inherit' }
    )

    // 3. Extract poster frames
    console.log(` Extrayendo posters...`)
    execSync(`ffmpeg -y -ss 00:00:01 -i "${hMp4}" -vframes 1 "${hPoster}"`, { stdio: 'inherit' })
    execSync(`ffmpeg -y -ss 00:00:01 -i "${vMp4}" -vframes 1 "${vPoster}"`, { stdio: 'inherit' })

    // 4. Upload to Sanity
    console.log(` Subiendo video horizontal a Sanity...`)
    const hVideoAsset = await client.assets.upload('file', fs.createReadStream(hMp4), {
      filename: `banner-horizontal-${b.id}.mp4`,
      contentType: 'video/mp4',
    })
    console.log(`   Video PC subido: ${hVideoAsset._id}`)

    console.log(` Subiendo video vertical a Sanity...`)
    const vVideoAsset = await client.assets.upload('file', fs.createReadStream(vMp4), {
      filename: `banner-vertical-${b.id}.mp4`,
      contentType: 'video/mp4',
    })
    console.log(`   Video Móvil subido: ${vVideoAsset._id}`)

    console.log(` Subiendo posters a Sanity...`)
    const hPosterAsset = await client.assets.upload('image', fs.createReadStream(hPoster), {
      filename: `poster-horizontal-${b.id}.jpg`,
      contentType: 'image/jpeg',
    })
    const vPosterAsset = await client.assets.upload('image', fs.createReadStream(vPoster), {
      filename: `poster-vertical-${b.id}.jpg`,
      contentType: 'image/jpeg',
    })
    console.log(`   Posters subidos: ${hPosterAsset._id}, ${vPosterAsset._id}`)

    newHeroBanners.push({
      _key: `hero-banner-${b.id}-${Date.now()}`,
      alt: b.alt,
      category: {
        _type: 'reference',
        _ref: b.categoryRef,
      },
      videoDesktop: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: hVideoAsset._id,
        },
      },
      videoMobile: {
        _type: 'file',
        asset: {
          _type: 'reference',
          _ref: vVideoAsset._id,
        },
      },
      imageDesktop: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: hPosterAsset._id,
        },
      },
      imageMobile: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: vPosterAsset._id,
        },
      },
    })
  }

  console.log('\n--- Actualizando documento homePage en Sanity ---')
  // Update homePage document
  await client
    .patch('homePage')
    .set({ heroBanners: newHeroBanners })
    .commit()

  console.log('✓ homePage actualizado exitosamente con los nuevos banners de video!')

  // If a draft exists, remove or update it so it does not override published
  try {
    const draft = await client.getDocument('drafts.homePage')
    if (draft) {
      console.log('Borrando borrador antiguo drafts.homePage para asegurar publicación directa...')
      await client.delete('drafts.homePage')
      console.log('✓ Borrador eliminado.')
    }
  } catch (err) {
    console.log('No draft to clean up.')
  }

  // Cleanup temp files
  console.log('\nLimpiando archivos temporales...')
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
  console.log('✓ Completado con éxito!')
}

main().catch((err) => {
  console.error('Error durante el proceso:', err)
  process.exit(1)
})
