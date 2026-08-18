import { HeroCarousel } from '@/components/hero-carousel'

export function HeroWow({ data }: { data?: any }) {
  const banners = data?.heroBanners?.length > 0
    ? data.heroBanners.map((banner: any) => ({
        src: banner.src,
        srcMobile: banner.srcMobile,
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
