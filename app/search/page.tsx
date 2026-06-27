import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { mockProducts } from '@/lib/mock-products'
import { Search } from 'lucide-react'

// Client component that reads search params
import SearchResults from './search-results'

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Suspense fallback={
            <div className="flex h-64 items-center justify-center">
              <div className="text-camel-dark font-medium">Buscando productos...</div>
            </div>
          }>
            <SearchResults />
          </Suspense>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
