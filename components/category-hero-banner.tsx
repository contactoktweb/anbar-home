import Image from 'next/image'

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

  const src = categoryBanner?.src || fallbackBanner?.src
  const srcMobile = categoryBanner?.srcMobile || fallbackBanner?.srcMobile
  const alt = categoryName || fallbackBanner?.alt || 'Anbar Home'

  if (!src) return null

  return (
    <section className="w-full">
      {/* Desktop Image: 100% full width and 100% natural uncropped height */}
      <Image
        src={src}
        alt={alt}
        width={2880}
        height={1620}
        className={`w-full h-auto block object-contain ${srcMobile ? 'hidden md:block' : ''}`}
        priority
        quality={95}
        sizes="100vw"
      />
      {/* Mobile Image: 100% full width and 100% natural uncropped height */}
      {srcMobile && (
        <Image
          src={srcMobile}
          alt={alt}
          width={1890}
          height={3360}
          className="w-full h-auto block object-contain md:hidden"
          priority
          quality={95}
          sizes="100vw"
        />
      )}
    </section>
  )
}
