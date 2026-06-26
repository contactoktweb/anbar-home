import { GridViewToggle } from '@/components/grid-view-toggle'

export function CategoryToolbar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-6">
        <GridViewToggle />
      </div>

      <div className="flex flex-col-reverse items-end md:flex-row md:items-center gap-6">
        <span className="text-sm font-serif italic text-foreground/70">
          Showing 1 - 20 of 75 products in this category
        </span>
        
        <div className="relative border border-border/60 bg-white">
          <select className="appearance-none bg-transparent pl-4 pr-10 py-2.5 text-[14px] text-foreground/80 outline-none w-64 cursor-pointer">
            <option>Orden por defecto</option>
            <option>Ordenar por popularidad</option>
            <option>Ordenar por calificación media</option>
            <option>Ordenar por las últimas</option>
            <option>Ordenar por precio: bajo a alto</option>
            <option>Ordenar por precio: alto a bajo</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1L5 5L9 1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
