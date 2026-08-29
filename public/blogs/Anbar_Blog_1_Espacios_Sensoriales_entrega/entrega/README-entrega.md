# Entrega — Optimización del blog de espacios sensoriales

## Objetivo

Este paquete contiene una versión editorial y SEO optimizada del artículo publicado en `https://www.anbarhome.co/blog/el-regreso-de-los-espacios-sensoriales`. El contenido se orienta a mostrar productos de Anbar Home dentro de espacios de decoración e interiorismo, sin convertir el artículo en una ficha de catálogo.

## Archivos principales

- `Blog_espacios_sensoriales_optimizado.docx`: documento Word con la versión editorial corregida, ficha SEO, enlaces directos e imágenes insertadas.
- `keywords_anbar_blogs.md`: mapa independiente de palabras clave de los Blogs 4, 5, 6 y del artículo actual.
- `blog_sensoriales_diagnostico.md`: diagnóstico de la página publicada antes de la optimización.
- `instrucciones-keiner.md`: guía para implementar contenido, imágenes, metadatos, canonical, Open Graph, schema y rendimiento.
- `schema-blogposting-ejemplo.json`: ejemplo institucional de JSON-LD BlogPosting sin autor personal.
- `metricas-seguimiento-blog.xlsx`: plantilla editable para línea base, KPIs y eventos de medición.
- `metricas-seguimiento-blog.csv`: versión CSV de la hoja de KPIs.

## Carpetas de imágenes

- `../alta/`: cinco imágenes PNG de alta calidad.
- `../webp/`: cinco imágenes WebP preparadas para publicación web.

## Estrategia SEO

La palabra clave principal propuesta para el artículo es `espacios sensoriales`. El Blog 4 conserva el enfoque `cómo decorar con esculturas`; el Blog 5, `quiet luxury en interiores corporativos`; el Blog 6, `cómo decorar una sala`; y este artículo, la relación entre luz, textura, materiales y experiencia interior. Esta separación reduce el riesgo de canibalización temática.

El slug actual se conserva para evitar una migración innecesaria. La canonical, Open Graph y los enlaces deben utilizar el dominio final `.co`: `https://www.anbarhome.co/blog/el-regreso-de-los-espacios-sensoriales`.

La autoría visible se eliminó según la instrucción de la marca. El contenido se presenta como publicación institucional de Anbar Home y no se atribuye a una persona concreta.

## Imágenes

Las cinco imágenes fueron creadas a partir de fotografías proporcionadas por Anbar Home. Se conservaron los productos visibles y se adaptaron los ambientes, encuadres, iluminación y composición para reforzar la lectura del artículo. Se retiraron únicamente precios, etiquetas, marcas de libros y textos comerciales visibles.

## Métricas

Antes de publicar, completar la hoja `Línea base` con los datos de Search Console y Analytics de los últimos 28 y 90 días. Después de publicar, completar las filas posteriores en las mismas ventanas de tiempo. Separar consultas de marca y no marca, país, dispositivo y página de destino.

Las métricas principales son impresiones, clics orgánicos, CTR, posición media, consultas no marca, usuarios orgánicos, sesiones comprometidas, tiempo de interacción, profundidad de lectura, clics a categorías y clics a WhatsApp. Estas métricas permiten evaluar visibilidad, utilidad del contenido y salida comercial sin prometer una posición concreta en Google.

Registrar los eventos de scroll al 90%, clic en categorías, clic en artículos relacionados, clic en WhatsApp y clic en producto. Si el CMS no permite implementar eventos directamente, solicitar al responsable técnico que configure los disparadores descritos en la hoja `Eventos GA4`.

## Validaciones pendientes

La fecha `datePublished` del ejemplo de schema corresponde a la fecha actualmente visible en la página auditada, `2026-06-01`. Sustituir `dateModified` por la fecha real en que se publique la actualización. Reemplazar los marcadores de URL CDN del ejemplo JSON-LD por las URL finales de las imágenes después de subirlas al CMS.

Validar la canonical y los metadatos sociales en el HTML final. Ejecutar Rich Results Test, inspeccionar la URL en Search Console y comprobar que los enlaces a categorías y blogs respondan con la URL canónica activa. Mantener la imagen destacada con prioridad y las cuatro imágenes internas con carga diferida.
