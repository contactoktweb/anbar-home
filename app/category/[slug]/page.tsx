import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { WhatsAppButton } from '@/components/whatsapp-button'
import { CategorySidebar } from '@/components/category-sidebar'
import { CategoryProductGrid } from '@/components/category-product-grid'
import { mockProducts } from '@/lib/mock-products'

// Map slugs to category names used in the data
const slugCategoryMap: Record<string, string> = {
  'linea-suprema': 'Línea Suprema',
  'esculturas': 'Esculturas',
  'summer-sale': 'Summer Sale',
  'accesorios-hogar': 'Accesorios Hogar',
  'jarrones-escultoricos': 'Jarrones Escultóricos',
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categoryName = slugCategoryMap[slug] ?? 'Categoría'

  // Filter: only show products that belong to this category
  const filteredProducts = mockProducts.filter(
    (p) => p.category === categoryName
  )

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory pt-32 pb-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Sidebar Column */}
            <div className="hidden md:block md:col-span-1">
              <CategorySidebar />
            </div>

            {/* Main Content Column */}
            <div className="col-span-1 md:col-span-3">
              <CategoryProductGrid products={filteredProducts} />
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  )
}

