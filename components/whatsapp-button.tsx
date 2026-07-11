import { client } from '@/sanity/lib/client'
import { GLOBAL_SETTINGS_QUERY } from '@/sanity/lib/queries'
import { WhatsAppClientButton } from './whatsapp-client-button'

const WHATSAPP_MESSAGE = "Hola Anbar Home, me gustaría conocer más sobre sus piezas de decoración."

export async function WhatsAppButton() {
  const settings = await client.fetch(GLOBAL_SETTINGS_QUERY).catch(() => null)
  const WHATSAPP_NUMBER = settings?.whatsappNumber || "3000000000"
  
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

  return <WhatsAppClientButton href={href} />
}
