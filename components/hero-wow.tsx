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
      className="relative w-full aspect-[9/16] sm:aspect-[3/4] md:aspect-[16/9] lg:aspect-[2.35/1] lg:max-h-[880px] overflow-hidden bg-neutral-100"
    >
      <HeroCarousel images={banners} />
    </section>
  )
}
