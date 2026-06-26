import { cn } from '@/lib/utils'

const categories = [
  'Todos los productos',
  'Accesorios decorativos',
  'Animales',
  'Bandeja',
  'Bandejas',
  'Candelabros',
  'Esculturas',
  'Eslabones',
  'Figuras de Personas',
  'Figuras Decorativas',
]

export function CategorySidebar() {
  return (
    <aside className="w-full flex-col pr-8 md:flex">
      <div className="mb-10">
        <h2 className="mb-6 font-serif text-2xl font-medium tracking-wide text-foreground">
          Categorías
        </h2>
        <ul className="flex flex-col space-y-2">
          {categories.map((category, index) => (
            <li key={category}>
              <a
                href={`#`}
                className={cn(
                  'text-[15px] font-light transition-colors hover:text-camel',
                  index === 1 ? 'text-foreground font-normal' : 'text-foreground/60',
                )}
              >
                {category}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6 h-px w-full bg-border/40" />

      {/* Price */}
      <div className="mb-6">
        <h2 className="mb-6 font-serif text-xl font-medium tracking-wide text-foreground">
          Precio
        </h2>
        
        {/* Mock Slider */}
        <div className="relative mb-6 mt-2 h-1 w-full rounded-full bg-camel/20">
          <div className="absolute left-0 right-0 h-full bg-camel" />
          <div className="absolute -left-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-camel bg-ivory" />
          <div className="absolute -right-2 top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-camel bg-ivory" />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[13px] font-light text-foreground/70">
            $ 0 - $ 6.900.000
          </span>
          <button className="bg-camel-dark px-5 py-2 text-[13px] text-white transition-colors hover:bg-camel">
            Aplicar
          </button>
        </div>
      </div>
    </aside>
  )
}
