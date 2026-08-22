import Image from 'next/image'
import { optimizeImageUrl } from '@/lib/utils'

interface CategoryHeroBannerProps {
  data?: any
  currentSlug: string
  categoryName?: string
  categoryBanner?: {
    src?: string
    srcMobile?: string
  } | null
}

export function CategoryHeroBanner({
  data,
  currentSlug,
  categoryName,
  categoryBanner,
}: CategoryHeroBannerProps) {
  const allBanners = data?.heroBanners || []

  // 1. Prioritize image uploaded directly to this category in Sanity
  // 2. Otherwise find matching banner for this category slug in home heroBanners
  // 3. Otherwise fallback to the first home hero banner
  const fallbackBanner =
    allBanners.find((b: any) => b.categorySlug === currentSlug) || allBanners[0]

  const rawSrc = categoryBanner?.src || fallbackBanner?.src
  const rawSrcMobile = categoryBanner?.srcMobile || fallbackBanner?.srcMobile
  const alt = categoryName || fallbackBanner?.alt || 'Anbar Home'

  if (!rawSrc) return null

  const src = optimizeImageUrl(rawSrc, 1440, 75)
  const srcMobile = rawSrcMobile ? optimizeImageUrl(rawSrcMobile, 800, 75) : null

  return (
    <section className="w-full">
      {/* Desktop Image: 100% full width and 100% natural uncropped height */}
      <Image
        src={src}
        alt={alt}
        width={1440}
        height={810}
        className={`w-full h-auto block object-contain ${srcMobile ? 'hidden md:block' : ''}`}
        priority
        quality={75}
        sizes="100vw"
      />
      {/* Mobile Image: 100% full width and 100% natural uncropped height */}
      {srcMobile && (
        <Image
          src={srcMobile}
          alt={alt}
          width={800}
          height={1400}
          className="w-full h-auto block object-contain md:hidden"
          priority
          quality={75}
          sizes="100vw"
        />
      )}
    </section>
  )
}
