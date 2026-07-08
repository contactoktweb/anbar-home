import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { Concept } from '@/components/concept'
import { client } from '@/sanity/lib/client'
import { POSTS_QUERY } from '@/sanity/lib/queries'
import Image from 'next/image'
import Link from 'next/link'

export const revalidate = 60 // revalidate every 60 seconds

export default async function BlogPage() {
  const posts = await client.fetch(POSTS_QUERY)

  return (
    <>
      <SiteHeader />
      <main>
        <article className="min-h-screen bg-[#fdfbf7] selection:bg-camel/20 pb-24">
          <header className="mx-auto max-w-5xl px-6 md:px-10 pt-16 md:pt-24 pb-16 text-center">
            <div className="mb-6 flex items-center justify-center gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-camel-dark font-medium">
              <span>Diseño Interior</span>
              <span className="h-px w-6 bg-neutral-300"></span>
              <span>Bienestar</span>
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-[3.25rem] font-light text-neutral-950 leading-[1.15] mb-8 tracking-tight mx-auto max-w-4xl">
              Nuestros <em className="italic">Blogs</em>
            </h1>
            
            <p className="text-[0.95rem] md:text-[1rem] leading-[2] text-neutral-600 font-light mx-auto max-w-2xl">
              Descubre ideas, tendencias y consejos sobre diseño de interiores, bienestar en el hogar y cómo crear espacios sensoriales únicos.
            </p>
          </header>

          <div className="mx-auto max-w-6xl px-6 md:px-8">
            {posts?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                {posts.map((post: any) => (
                  <Link href={`/blog/${post.slug}`} key={post._id} className="group flex flex-col space-y-6 cursor-pointer">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-neutral-100">
                      {post.imageUrl ? (
                        <Image
                          src={post.imageUrl}
                          alt={post.imageAlt || post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                          Sin imagen
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center gap-3 text-[0.75rem] text-neutral-500 font-light tracking-wide uppercase">
                        {post.categories?.[0] && <span>{post.categories[0]}</span>}
                        {post.categories?.[0] && <span>|</span>}
                        <span>
                          {post.publishedAt 
                            ? new Date(post.publishedAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                            : 'Sin fecha'
                          }
                        </span>
                      </div>
                      
                      <h4 className="font-serif text-xl md:text-2xl font-light text-neutral-900 leading-snug group-hover:text-camel-dark transition-colors">
                        {post.title}
                      </h4>
                      <div className="h-[1px] w-12 bg-camel-dark transition-all duration-300 group-hover:w-full"></div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-neutral-500 font-light">
                No hay blogs publicados aún.
              </div>
            )}
          </div>
        </article>
        <Concept />
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}

