import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET() {
  const globalSettings = {
    _type: 'globalSettings',
    _id: 'globalSettings',
    whatsappNumber: '3000000000',
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
    const backendClient = client.withConfig({
      token: process.env.SANITY_API_TOKEN,
      useCdn: false
    })
    
    await backendClient.createOrReplace(globalSettings)
    return NextResponse.json({ success: true, message: 'Settings seeded successfully' })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
