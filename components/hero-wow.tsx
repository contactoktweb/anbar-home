import { HeroCarousel } from '@/components/hero-carousel'

export function HeroWow({ data }: { data?: any }) {
  const banners = data?.heroBanners?.length > 0 ? data.heroBanners : []

  if (banners.length === 0) return null


  return (
    <section
      id="inicio"
      className="relative w-full h-[calc(100dvh-76px)] min-h-[600px] bg-neutral-100 overflow-hidden"
    >
      <HeroCarousel images={banners} />
    </section>
  )
}
