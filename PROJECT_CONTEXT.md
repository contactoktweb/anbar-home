# Contexto del Proyecto: Anbar Home

## Descripción
E-commerce y tienda online de Anbar Home, marca de decoración artesanal, estética serena y diseño atemporal (tonos camel, neutros y cálidos).

## Stack Tecnológico
- **Framework:** Next.js 16 (App Router)
- **CMS:** Sanity Studio v5
- **Estilos:** Tailwind CSS v4 + Tailwind Merge
- **Tipografía:** Tipografías serif y sans elegantes
- **Seguimiento:** Meta Pixel Ads, Klaviyo

## Arquitectura y Componentes Clave
- `app/product/[slug]/page.tsx`: Vista detallada de producto, breadcrumbs, badges y recomendaciones.
- `components/product-card.tsx`: Tarjeta de producto para listas y carruseles con badges dinámicos.
- `components/product-image-zoom.tsx`: Visor con zoom interactivo y badges flotantes.
- `sanity/schemaTypes/product.ts`: Esquema de producto en Sanity con campos para stock, `isLastUnits`, `isBestSeller`, precios y categorías.
