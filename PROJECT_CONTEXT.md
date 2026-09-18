# Contexto del Proyecto: Anbar Home

## Descripción
E-commerce y tienda online de Anbar Home, marca de decoración artesanal, estética serena y diseño atemporal (con resaltes y acentos de temporada en color borgoña `#7A1A28`, neutros y cálidos).

## Stack Tecnológico
- **Framework:** Next.js 16 (App Router)
- **CMS:** Sanity Studio v5
- **Estilos:** Tailwind CSS v4 + Tailwind Merge
- **Tipografía:** Tipografías serif y sans elegantes
- **Seguimiento:** Meta Pixel Ads, Klaviyo

## Arquitectura y Componentes Clave
- `app/product/[slug]/page.tsx`: Vista detallada de producto con ambientación de temporada navideña (insignias festivas, listón hero y llamado a la acción en borgoña).
- `components/christmas-ribbon.tsx`: Listón diagonal artesanal 3D en terciopelo borgoña noble, moño volumétrico con caídas en V y broche de estrella navideña de 8 puntas con halo luminoso.
- `components/product-card.tsx`: Tarjeta de producto para catálogos y carruseles con listón artesanal navideño, acentos borgoña, oro champán, badges festivos, swipe mobile y vista rápida.
- `components/product-image-zoom.tsx`: Visor con zoom interactivo, listón navideño en tamaño hero (`size="lg"`) y reubicación inteligente de badges.
- `components/sticky-mobile-cta.tsx`: Barra de compra flotante móvil adaptativa con temática y botones festivos en productos de Navidad.
- `components/site-header.tsx`: Cabecera principal y barra de navegación responsive con categorías navideñas de temporada y desplegable/acordeón de "Hogar" para colecciones permanentes.
- `lib/utils.ts`: Utilidades del sistema, incluyendo `isChristmasProduct` para detección centralizada de productos de la temporada navideña.
- `sanity/schemaTypes/product.ts`: Esquema de producto en Sanity con campos para stock, `isLastUnits`, `isBestSeller`, precios y categorías.
