import { HeroCarousel } from '@/components/hero-carousel'
import { optimizeImageUrl } from '@/lib/utils'

export function HeroWow({ data }: { data?: any }) {
  const banners = data?.heroBanners?.length > 0
    ? data.heroBanners.map((banner: any) => ({
        src: optimizeImageUrl(banner.src, 1440, 75),
        srcMobile: optimizeImageUrl(banner.srcMobile || banner.src, 800, 75),
        videoDesktop: banner.videoDesktop,
        videoMobile: banner.videoMobile,
        alt: banner.alt || 'Anbar Home',
        label: banner.categoryTitle,
        href: banner.categorySlug ? `/category/${banner.categorySlug}` : undefined,
      }))
    : []

  if (banners.length === 0) return null

  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-neutral-950 aspect-[3/4] md:aspect-[1920/818]"
    >
      <HeroCarousel images={banners} />
    </section>
  )
}
