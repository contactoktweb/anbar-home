import { Suspense } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CategorySidebar } from '@/components/category-sidebar'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { mockProducts } from '@/lib/mock-products'
import { Search } from 'lucide-react'

// Client component that reads search params
import SearchResults from './search-results'

export default function SearchPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen pb-20">
        
        {/* Store Banner */}
        <div className="w-full bg-[#C19A6B] py-12 text-center mb-16 shadow-inner">
          <h1 className="text-3xl md:text-4xl font-serif text-white tracking-widest uppercase">
            Tienda
          </h1>
          <p className="text-white/80 mt-2 font-light tracking-wide">
            Encuentra la pieza perfecta para tu espacio
          </p>
        </div>

        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Sidebar Column */}
            <div className="hidden md:block md:col-span-1">
              <CategorySidebar />
            </div>

            {/* Main Content Column */}
            <div className="col-span-1 md:col-span-3">
              <Suspense fallback={
                <div className="flex h-64 items-center justify-center">
                  <div className="text-camel-dark font-medium">Buscando productos...</div>
                </div>
              }>
                <SearchResults />
              </Suspense>
            </div>
            
          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}
