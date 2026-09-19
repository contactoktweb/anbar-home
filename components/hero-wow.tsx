import { HeroCarousel } from '@/components/hero-carousel'
import { optimizeImageUrl } from '@/lib/utils'

export function HeroWow({ data }: { data?: any }) {
  const fallbackBanners = [
    {
      src: '/banner/horizontal.png',
      srcMobile: '/banner/vertical.png',
      alt: 'Anbar Home - Colección de Temporada Navideña',
      href: '/category/todos-los-productos',
    }
  ]

  const banners = data?.heroBanners?.length > 0
    ? data.heroBanners.map((banner: any) => ({
        src: banner.src ? optimizeImageUrl(banner.src, 1920, 85) : '/banner/horizontal.png',
        srcMobile: banner.srcMobile
          ? optimizeImageUrl(banner.srcMobile, 1080, 85)
          : (banner.src ? optimizeImageUrl(banner.src, 1080, 85) : '/banner/vertical.png'),
        videoDesktop: banner.videoDesktop,
        videoMobile: banner.videoMobile,
        alt: banner.alt || 'Anbar Home',
        label: banner.categoryTitle,
        href: banner.categorySlug ? `/category/${banner.categorySlug}` : '/category/todos-los-productos',
      }))
    : fallbackBanners

  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-neutral-950 md:max-h-[460px] lg:max-h-[500px] xl:max-h-[540px]"
    >
      <HeroCarousel images={banners} />
    </section>
  )
}

