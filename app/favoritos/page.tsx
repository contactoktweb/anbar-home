import type { Metadata } from 'next'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { FavoritesClientView } from '@/components/favorites-client-view'

export const metadata: Metadata = {
  title: 'Mis Favoritos | Anbar Home',
  description: 'Tus piezas de decoración favoritas guardadas en Anbar Home Colombia. Descubre y organiza tu selección exclusiva de piezas artesanales.',
  openGraph: {
    title: 'Mis Favoritos | Anbar Home',
    description: 'Tus piezas de decoración favoritas guardadas en Anbar Home.',
    url: 'https://anbarhome.com/favoritos',
  },
}

export default function FavoritosPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pb-20 bg-[#FAFAF8]">
        {/* Banner de Cabecera */}
        <div className="w-full bg-[#C19A6B] py-12 md:py-16 text-center shadow-inner">
          <div className="mx-auto max-w-4xl px-6">
            <h1 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase font-normal">
              Favoritos
            </h1>
            <p className="text-white/85 mt-2.5 font-light tracking-wide text-sm sm:text-base">
              Tus piezas guardadas
            </p>
          </div>
        </div>

        {/* Vista interactiva de la lista de favoritos */}
        <FavoritesClientView />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
