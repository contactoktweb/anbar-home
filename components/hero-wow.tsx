import { HeroCarousel } from '@/components/hero-carousel'

export function HeroWow() {
  const banners = [
    { src: '/lux_banner_living.png', alt: 'Lujo Silencioso - Anbar Home' },
    { src: '/lux_banner_vase.png', alt: 'Detalles que inspiran - Anbar Home' },
    { src: '/lux_banner_dining.png', alt: 'Espacios únicos - Anbar Home' }
  ]

  return (
    <section
      id="inicio"
      className="relative w-full h-[calc(100dvh-76px)] min-h-[600px] bg-neutral-100 overflow-hidden"
    >
      <HeroCarousel images={banners} />
    </section>
  )
}
