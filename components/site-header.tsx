'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Search, Heart, ShoppingBag, X, Trash2, Plus, Minus } from 'lucide-react'
import { useStore } from '@/components/store-provider'

const links = [
  { label: 'Línea Suprema', href: '/category/linea-suprema' },
  { label: 'Esculturas', href: '/category/esculturas' },
  { label: 'Summer Sale', href: '/category/summer-sale' },
  { label: 'Accesorios Hogar', href: '/category/accesorios-hogar' },
  { label: 'Jarrones Escultóricos', href: '/category/jarrones-escultoricos' },
  { label: 'Blog', href: '/blog' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  
  const { cart, favorites, removeFromCart, toggleFavorite, updateQuantity, clearCart, clearFavorites } = useStore()
  
  // Format prices in COP
  const formatCOP = (amount: number) =>
    new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount)

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Cerrar menús automáticamente al cambiar de ruta
  useEffect(() => {
    setIsCartOpen(false)
    setIsFavoritesOpen(false)
    setOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-200 ease-in-out',
          scrolled
            ? 'bg-ivory/85 backdrop-blur-md border-b border-border/60'
            : 'bg-transparent',
        )}
      >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
        <Link href="/" className="flex items-center" aria-label="Anbar Home">
          <Image
            src="/Anbar_Home_Logo_Black.png.webp"
            alt="Anbar Home"
            width={150}
            height={62}
            priority
            className="h-8 w-auto object-contain md:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-medium text-neutral-900 transition-colors duration-300 hover:text-camel"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={() => setIsSearchOpen(true)} className="transition-colors hover:text-camel" aria-label="Buscar">
            <Search className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
          </button>
          
          <button onClick={() => setIsFavoritesOpen(true)} className="flex items-center gap-1 transition-colors hover:text-camel" aria-label="Favoritos">
            <Heart className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
            <span className="text-sm font-medium text-camel-dark">{favorites.length}</span>
          </button>

          <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-1 transition-colors hover:text-camel" aria-label="Carrito">
            <ShoppingBag className="h-5 w-5 md:h-[22px] md:w-[22px]" strokeWidth={1.5} />
            <span className="text-sm font-medium text-camel-dark">{cart.length}</span>
          </button>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-2 md:hidden"
            aria-label="Abrir menú"
          aria-expanded={open}
        >
          <span
            className={cn(
              'h-px w-6 bg-camel-dark transition-transform duration-300',
              open && 'translate-y-[6px] rotate-45',
            )}
          />
          <span
            className={cn(
              'h-px w-6 bg-camel-dark transition-opacity duration-300',
              open && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'h-px w-6 bg-camel-dark transition-transform duration-300',
              open && '-translate-y-[6px] -rotate-45',
            )}
          />
        </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-border/60 bg-background/95 backdrop-blur-md transition-[max-height] duration-500 md:hidden',
          open ? 'max-h-72' : 'max-h-0 border-t-0',
        )}
      >
        <nav className="flex flex-col px-6 py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-b border-border/40 py-4 text-[15px] font-medium text-camel-dark last:border-b-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-ivory/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="mx-auto w-full max-w-7xl px-6 py-8 md:px-10">
            <div className="flex justify-end">
              <button onClick={() => setIsSearchOpen(false)} className="p-2 text-neutral-500 transition-transform hover:rotate-90 hover:text-camel">
                <X className="h-8 w-8" strokeWidth={1.5} />
              </button>
            </div>
            <div className="mx-auto mt-16 max-w-3xl px-4 md:mt-24">
              <h2 className="mb-8 font-serif text-3xl text-neutral-800 md:text-4xl">¿Qué estás buscando?</h2>
              <form onSubmit={handleSearch} className="relative border-b border-neutral-300 pb-3 transition-colors focus-within:border-camel">
                <input 
                  type="text" 
                  placeholder="Buscar producto..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent pr-12 text-xl outline-none placeholder:text-neutral-400 md:text-2xl"
                  autoFocus
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-camel">
                  <Search className="h-6 w-6 md:h-7 md:w-7" strokeWidth={1.5} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Sidebar Placeholder */}
      {isFavoritesOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsFavoritesOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-md border-l border-border/50 bg-ivory p-6 shadow-2xl animate-in slide-in-from-right-full duration-300 md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="font-serif text-2xl text-neutral-900">Mis Favoritos</h2>
              <button onClick={() => setIsFavoritesOpen(false)} className="text-neutral-500 hover:text-camel"><X className="h-6 w-6" strokeWidth={1.5} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {favorites.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Heart className="mb-4 h-12 w-12 text-neutral-200" strokeWidth={1} />
                  <p className="text-neutral-500">Tu lista de deseos está vacía.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4 pb-4">
                  <div className="flex justify-end pb-2">
                    <button 
                      onClick={clearFavorites} 
                      className="flex items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Eliminar todos</span>
                    </button>
                  </div>
                  {favorites.map((product) => (
                    <div key={product.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-white">
                        <Image src={product.image} alt={product.name} fill className="object-cover object-center mix-blend-multiply" />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h3 className="text-sm font-medium text-neutral-900">{product.name}</h3>
                        <p className="text-sm font-serif text-camel-dark">{formatCOP(product.price)}</p>
                      </div>
                      <button onClick={() => toggleFavorite(product)} className="text-neutral-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Cart Sidebar Placeholder */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 z-[110] w-full max-w-md border-l border-border/50 bg-ivory p-6 shadow-2xl animate-in slide-in-from-right-full duration-300 md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-border/50 pb-4">
              <h2 className="font-serif text-2xl text-neutral-900">Carrito de Compras</h2>
              <button onClick={() => setIsCartOpen(false)} className="text-neutral-500 hover:text-camel"><X className="h-6 w-6" strokeWidth={1.5} /></button>
            </div>
            <div className="flex flex-col h-[calc(100vh-140px)]">
              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <ShoppingBag className="mb-4 h-12 w-12 text-neutral-200" strokeWidth={1} />
                    <p className="text-neutral-500">Tu carrito está vacío por ahora.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pb-4">
                    <div className="flex justify-end pb-2">
                      <button 
                        onClick={clearCart} 
                        className="flex items-center gap-1.5 text-[13px] text-neutral-500 transition-colors hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Eliminar todos</span>
                      </button>
                    </div>
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-border/50 pb-4 last:border-0">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-white">
                          <Image src={item.image} alt={item.name} fill className="object-cover object-center mix-blend-multiply" />
                        </div>
                        <div className="flex flex-1 flex-col justify-center">
                          <h3 className="text-sm font-medium text-neutral-900">{item.name}</h3>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-sm font-serif text-camel-dark">{formatCOP(item.price)}</p>
                            <div className="flex items-center gap-2 rounded border border-neutral-200 px-2 py-1 bg-neutral-50/50">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-neutral-400 transition-colors hover:text-camel p-0.5"
                                aria-label="Disminuir cantidad"
                              >
                                <Minus className="h-3 w-3" strokeWidth={2} />
                              </button>
                              <span className="text-xs font-medium w-3 text-center text-neutral-700">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-neutral-400 transition-colors hover:text-camel p-0.5"
                                aria-label="Aumentar cantidad"
                              >
                                <Plus className="h-3 w-3" strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-red-500 self-start mt-1">
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {cart.length > 0 && (
                <div className="mt-auto pt-6 border-t border-border/50 bg-ivory">
                  <div className="mb-4 flex justify-between text-lg font-medium text-neutral-900">
                    <span>Subtotal</span>
                    <span className="font-serif text-camel-dark">{formatCOP(cartTotal)}</span>
                  </div>
                  <Link 
                    href="/checkout"
                    className="flex w-full items-center justify-center bg-camel-dark px-6 py-4 text-sm font-medium text-white transition-colors hover:bg-neutral-900"
                  >
                    Ir al pago
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
