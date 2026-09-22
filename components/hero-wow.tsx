import { HeroCarousel } from '@/components/hero-carousel'
import { optimizeImageUrl } from '@/lib/utils'

export function HeroWow({ data }: { data?: any }) {
  const fallbackBanners = [
    {
      src: 'https://cdn.sanity.io/images/7zsgx3as/production/f594f1a2ca3300b42901d86d586bc7c554b0f03f-1920x818.jpg',
      srcMobile: 'https://cdn.sanity.io/images/7zsgx3as/production/277322b2b3a94427e598fc7345d59e42485e241d-1080x1350.jpg',
      videoDesktop: 'https://cdn.sanity.io/files/7zsgx3as/production/b2512ee1e7726ccfaf67f1e27d9667ea65ed2ca7.mp4',
      videoMobile: 'https://cdn.sanity.io/files/7zsgx3as/production/58c6c6b6a0ddf0c688d696891552b4001e77c5f0.mp4',
      alt: 'Jarrones escultóricos y piezas de diseño - Anbar Home',
      label: 'Jarrones escultóricos',
      href: '/category/jarrones-escultoricos',
    },
    {
      src: 'https://cdn.sanity.io/images/7zsgx3as/production/f5196e38a86a2aa1d7ef3adc1d169b4eb2f776c0-1920x818.jpg',
      srcMobile: 'https://cdn.sanity.io/images/7zsgx3as/production/30fbaa94b3ac476c5496a32b940611cf44499665-1080x1440.jpg',
      videoDesktop: 'https://cdn.sanity.io/files/7zsgx3as/production/2d422755fd8b26ad2a4924a31f5efb0f7e7a5271.mp4',
      videoMobile: 'https://cdn.sanity.io/files/7zsgx3as/production/07c06c82e5a8fc6e210df2ef198227892ae02354.mp4',
      alt: 'Colección de diseño interior y esculturas - Anbar Home',
      label: 'Esculturas',
      href: '/category/esculturas',
    },
    {
      src: 'https://cdn.sanity.io/images/7zsgx3as/production/b29c9601f3d87f9c1b38529a126830513d06e7fb-1920x818.jpg',
      srcMobile: 'https://cdn.sanity.io/images/7zsgx3as/production/70acd4462b44aa4fec17631ac9d9d27c954109c4-1080x1440.jpg',
      videoDesktop: 'https://cdn.sanity.io/files/7zsgx3as/production/e12bdc67739323c0773b8137cbd84c02fbfe669f.mp4',
      videoMobile: 'https://cdn.sanity.io/files/7zsgx3as/production/d5f57d87d24b4a1222991720d82bebde6447dfc6.mp4',
      alt: 'Todo para transformar tu hogar - Acentos decorativos Anbar Home',
      label: 'Acentos decorativos',
      href: '/category/acentos-decorativos',
    },
  ]

  const banners = data?.heroBanners?.length > 0
    ? data.heroBanners.map((banner: any) => ({
        src: banner.src ? optimizeImageUrl(banner.src, 1920, 85) : undefined,
        srcMobile: banner.srcMobile
          ? optimizeImageUrl(banner.srcMobile, 1080, 85)
          : (banner.src ? optimizeImageUrl(banner.src, 1080, 85) : undefined),
        videoDesktop: banner.videoDesktop,
        videoMobile: banner.videoMobile,
        alt: banner.alt || 'Anbar Home',
        label: banner.categoryTitle,
        href: banner.categorySlug ? `/category/${banner.categorySlug}` : undefined,
      }))
    : fallbackBanners

  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-neutral-950 aspect-[4/5] sm:aspect-[3/2] md:aspect-[16/7] lg:aspect-[21/9] xl:aspect-[21/8]"
    >
      <div className="absolute inset-0">
        <HeroCarousel images={banners} />
      </div>
    </section>
  )
}

