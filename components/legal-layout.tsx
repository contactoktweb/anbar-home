import Link from 'next/link'
import { Home } from 'lucide-react'
import { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'

export function LegalLayout({ title, breadcrumb, children }: { title: string, breadcrumb: string, children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory">
        {/* Banner */}
        <div className="bg-camel py-10 text-white">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-6 text-center">
            <h1 className="font-serif text-2xl font-medium tracking-wide md:text-3xl">{title}</h1>
            <div className="mt-2 flex items-center justify-center gap-2 font-serif text-xs tracking-wide md:text-sm">
              <Link href="/" className="hover:text-black/60 transition-colors" aria-label="Ir al inicio">
                <Home className="h-4 w-4" />
              </Link>
              <span>&gt;</span>
              <span>{breadcrumb}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <article className="mx-auto max-w-4xl px-6 py-12 md:px-10 md:py-16">
          <div className="prose prose-sm md:prose-base prose-neutral max-w-none text-neutral-700 prose-headings:font-serif prose-headings:font-medium prose-headings:text-neutral-900 prose-a:text-camel-dark prose-a:underline-offset-4 hover:prose-a:text-camel prose-ul:font-light prose-p:font-light prose-p:leading-relaxed">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
