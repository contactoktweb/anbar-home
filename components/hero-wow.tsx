import { HeroCarousel } from '@/components/hero-carousel'
import { optimizeImageUrl } from '@/lib/utils'

export function HeroWow({ data }: { data?: any }) {
  const banners = data?.heroBanners?.length > 0
    ? data.heroBanners.map((banner: any) => ({
        src: optimizeImageUrl(banner.src, 1440, 75),
        srcMobile: optimizeImageUrl(banner.srcMobile || banner.src, 800, 75),
        alt: banner.alt || 'Anbar Home',
        label: banner.categoryTitle,
        href: banner.categorySlug ? `/category/${banner.categorySlug}` : undefined,
      }))
    : []

  if (banners.length === 0) return null


  return (
    <section
      id="inicio"
      className="relative w-full aspect-[9/16] md:aspect-[16/9] md:max-h-[85vh] lg:max-h-[900px] overflow-hidden bg-neutral-900"
    >
      <HeroCarousel images={banners} />
    </section>
  )
}
