import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { client } from '@/sanity/lib/client'
import { POST_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { slugify } from '@/sanity/lib/slugify'
import { optimizeImageUrl } from '@/lib/utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { Metadata } from 'next'

export const revalidate = 60

function getSlugVariations(rawSlug: string) {
  let decoded = rawSlug || ''
  try {
    decoded = decodeURIComponent(rawSlug)
  } catch {}
  return {
    slug: rawSlug,
    cleanSlug: slugify(decoded),
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const { slug, cleanSlug } = getSlugVariations(resolvedParams.slug)
  const post = await client.fetch(POST_BY_SLUG_QUERY, { slug, cleanSlug })
  
  if (!post) {
    return {
      title: 'Blog no encontrado | Anbar Home',
    }
  }

  const title = post.seoTitle || `${post.title} | Anbar Home`
  const description = post.metaDescription || post.title
  const canonicalUrl = `https://www.anbarhome.co/blog/${post.slug}`
  const ogImageUrl = post.imageUrl ? optimizeImageUrl(post.imageUrl, 1200, 85) : 'https://www.anbarhome.co/anbar-logo.png'
  
  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Anbar Home',
      locale: 'es_CO',
      type: 'article',
      publishedTime: post.publishedAt,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: post.imageAlt || post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <figure className="my-10 md:my-14">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-100 shadow-sm">
            <Image
              src={optimizeImageUrl(urlFor(value).url(), 1200, 80)}
              alt={value.alt || 'Detalle del blog Anbar Home'}
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              quality={80}
              className="object-cover"
              loading="lazy"
            />
          </div>
          {value.caption && (
            <figcaption className="mt-3.5 px-2 text-center font-sans text-[0.82rem] md:text-[0.88rem] leading-relaxed text-neutral-500 font-light italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h2 className="font-serif text-2xl md:text-[2rem] font-light text-neutral-950 leading-[1.25] mb-6 mt-12 tracking-tight">
        {children}
      </h2>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-serif text-2xl md:text-[1.85rem] font-light text-neutral-950 leading-[1.25] mt-14 mb-6 tracking-tight">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-serif text-xl md:text-[1.4rem] font-light text-neutral-900 leading-[1.3] mt-10 mb-4 tracking-tight">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="font-serif text-lg md:text-xl font-normal text-neutral-900 mt-8 mb-3">
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p className="text-[0.95rem] md:text-[1.05rem] leading-[2.1] text-neutral-700 font-light mb-7">
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-[2px] border-camel pl-6 sm:pl-8 my-10 py-3 italic bg-stone-50/80 rounded-r-sm">
        <p className="font-serif text-xl md:text-2xl font-light text-neutral-900 leading-snug mb-0">
          {children}
        </p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc pl-6 space-y-3.5 pt-2 mb-8 text-[0.95rem] md:text-[1.02rem] leading-[2] text-neutral-700 font-light">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal pl-6 space-y-3.5 pt-2 mb-8 text-[0.95rem] md:text-[1.02rem] leading-[2] text-neutral-700 font-light">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="pl-2 marker:text-camel">
        <span>{children}</span>
      </li>
    ),
    number: ({ children }: any) => (
      <li className="pl-2 marker:text-camel">
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-medium text-neutral-950">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-neutral-800">{children}</em>,
    link: ({ children, value }: any) => {
      const isExternal = value.href && !value.href.startsWith('/') && !value.href.includes('anbarhome')
      return (
        <a
          href={value.href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer noopener' : undefined}
          className="text-camel-dark font-normal underline decoration-camel/40 underline-offset-4 hover:decoration-camel-dark transition-colors"
        >
          {children}
        </a>
      )
    },
  },
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const { slug, cleanSlug } = getSlugVariations(resolvedParams.slug)
  const post = await client.fetch(POST_BY_SLUG_QUERY, { slug, cleanSlug })

  if (!post) {
    notFound()
  }

  const canonicalUrl = `https://www.anbarhome.co/blog/${post.slug}`
  const ogImageUrl = post.imageUrl ? optimizeImageUrl(post.imageUrl, 1200, 85) : 'https://www.anbarhome.co/anbar-logo.png'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription || post.title,
    image: [ogImageUrl],
    datePublished: post.publishedAt || '2026-08-26T00:00:00.000Z',
    dateModified: post.publishedAt || '2026-08-26T00:00:00.000Z',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Anbar Home',
      url: 'https://www.anbarhome.co',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.anbarhome.co/anbar-logo.png',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main>
        <article className="min-h-screen bg-[#fdfbf7] selection:bg-camel/20 pb-24">
          <header className="mx-auto max-w-5xl px-6 md:px-10 pt-16 md:pt-24 pb-12 text-center">
            {post.categories && post.categories.length > 0 && (
              <div className="mb-6 flex items-center justify-center gap-3 text-[0.68rem] uppercase tracking-[0.25em] text-camel-dark font-medium">
                <span>{post.categories[0]}</span>
                {post.categories.length > 1 && (
                  <>
                    <span className="h-px w-6 bg-neutral-300"></span>
                    <span>{post.categories[1]}</span>
                  </>
                )}
              </div>
            )}
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-light text-neutral-950 leading-[1.18] mb-8 tracking-tight mx-auto max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.75rem] text-neutral-500 font-light tracking-wide uppercase">
              <span>Por {post.authorName || 'Anbar Home'}</span>
              {post.publishedAt && <span>|</span>}
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </header>

          {post.imageUrl && (
            <figure className="mx-auto max-w-6xl px-4 md:px-8 mb-14 md:mb-20">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-100 shadow-sm">
                <Image
                  src={optimizeImageUrl(post.imageUrl, 1600, 85)}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  quality={85}
                  className="object-cover object-center"
                  priority
                />
              </div>
              {post.imageCaption && (
                <figcaption className="mt-3.5 px-2 text-center font-sans text-[0.82rem] md:text-[0.88rem] leading-relaxed text-neutral-500 font-light italic">
                  {post.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          <div className="mx-auto max-w-2xl px-6 md:px-0 blog-content">
            {post.body ? (
              <PortableText value={post.body} components={portableTextComponents} />
            ) : (
              <div className="text-center py-20 text-neutral-500 font-light">
                Este artículo no tiene contenido.
              </div>
            )}
          </div>
        </article>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
