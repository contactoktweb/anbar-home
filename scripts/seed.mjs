import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function seed() {
  const globalSettings = {
    _type: 'globalSettings',
    _id: 'globalSettings',
    whatsappNumber: '573001234567', // Placeholder
    physicalStores: [
      {
        _key: 'store-1',
        city: 'Bogotá',
        address: 'Calle 109 #18B-52, Local 101',
      },
      {
        _key: 'store-2',
        city: 'Bucaramanga',
        address: 'Calle 62 #30-99',
      },
      {
        _key: 'store-3',
        city: 'Cabecera del Llano',
        address: 'Cra 36 #48-141 Local 5',
      },
    ],
  }

  try {
    console.log('Seeding globalSettings...')
    await client.createOrReplace(globalSettings)
    console.log('Successfully seeded globalSettings!')
  } catch (error) {
    console.error('Error seeding data:', error)
  }
}

seed()
