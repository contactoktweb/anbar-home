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
      title: 'Blog no encontrado',
    }
  }
  
  return {
    title: `${post.title} | Anbar Home`,
    description: post.title,
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className="relative aspect-[16/9] w-full my-12 overflow-hidden rounded-sm bg-neutral-100">
          <Image
            src={optimizeImageUrl(urlFor(value).url(), 1200, 75)}
            alt={value.alt || 'Imagen del blog'}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            quality={75}
            className="object-cover"
          />
        </div>
      )
    },
  },
  block: {
    h1: ({ children }: any) => <h1 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-light text-neutral-950 leading-[1.15] mb-8 mt-12">{children}</h1>,
    h2: ({ children }: any) => <h2 className="font-serif text-2xl md:text-[1.75rem] font-light text-neutral-950 mt-16 mb-6">{children}</h2>,
    h3: ({ children }: any) => <h3 className="font-serif text-xl md:text-2xl font-light text-neutral-950 mt-12 mb-4">{children}</h3>,
    normal: ({ children }: any) => <p className="text-[0.95rem] md:text-[1.05rem] leading-[2.1] text-neutral-600 font-light mb-8">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-[1.5px] border-camel pl-6 sm:pl-8 my-10 py-2 italic bg-neutral-50/50 rounded-r-sm">
        <p className="font-serif text-2xl md:text-3xl font-light text-neutral-950 leading-snug mb-2">{children}</p>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc pl-6 space-y-4 pt-2 mb-8 text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal pl-6 space-y-4 pt-2 mb-8 text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li className="pl-2">
        <span className="text-neutral-600">{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-medium text-neutral-900">{children}</strong>,
    em: ({ children }: any) => <em className="italic text-neutral-800">{children}</em>,
    link: ({ children, value }: any) => {
      const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined
      return (
        <a href={value.href} rel={rel} className="text-camel-dark underline decoration-camel-dark/30 hover:decoration-camel-dark transition-colors">
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

  return (
    <>
      <SiteHeader />
      <main>
        <article className="min-h-screen bg-[#fdfbf7] selection:bg-camel/20 pb-24">
          <header className="mx-auto max-w-5xl px-6 md:px-10 pt-16 md:pt-24 pb-12 text-center">
            {post.categories && post.categories.length > 0 && (
              <div className="mb-6 flex items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-camel-dark font-medium">
                <span>{post.categories[0]}</span>
                {post.categories.length > 1 && (
                  <>
                    <span className="h-px w-6 bg-neutral-300"></span>
                    <span>{post.categories[1]}</span>
                  </>
                )}
              </div>
            )}
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-light text-neutral-950 leading-[1.15] mb-8 tracking-tight mx-auto max-w-4xl">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-3 text-[0.75rem] text-neutral-500 font-light tracking-wide uppercase">
              {post.authorName && <span>Por {post.authorName}</span>}
              {post.authorName && post.publishedAt && <span>|</span>}
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </header>

          {post.imageUrl && (
            <div className="mx-auto max-w-6xl px-4 md:px-8 mb-16 md:mb-24">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm bg-neutral-100">
                <Image
                  src={optimizeImageUrl(post.imageUrl, 1440, 75)}
                  alt={post.imageAlt || post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 1200px"
                  quality={75}
                  className="object-cover object-center"
                  priority
                />
              </div>
            </div>
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
