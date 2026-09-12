# Instrucciones de implementación — Blog 7

## 1. Datos SEO

| Campo | Contenido |
|---|---|
| Keyword principal | cómo elegir jarrones decorativos |
| Keywords secundarias | jarrones para sala; jarrones escultóricos; jarrones para consola; cómo combinar jarrones; jarrones grandes para sala |
| Título SEO | Cómo elegir jarrones decorativos \| Anbar Home |
| Meta description | Aprende cómo elegir jarrones decorativos según el tamaño, acabado y espacio. Ideas para salas, comedores, recibidores, oficinas y más. |
| Slug | como-elegir-jarrones-decorativos |
| Canonical recomendada | https://www.anbarhome.co/blog/como-elegir-jarrones-decorativos |
| H1 | Cómo elegir jarrones decorativos según el espacio |
| Categoría sugerida | Jarrones escultóricos |

La canonical indicada es la ruta recomendada para la publicación. Debe confirmarse en el CMS después de crear la entrada y mantenerse igual al slug definitivo.

## 2. Orden de carga de imágenes

1. Cargar primero los cinco archivos de la carpeta `webp`.
2. Usar los nombres de archivo sin cambios.
3. Insertar cada imagen en la ubicación indicada en `tabla-implementacion-imagenes.xlsx`.
4. Copiar el ALT y el pie de foto exactamente desde la tabla.
5. Declarar `width` y `height` en el HTML o en el componente de imagen.
6. Aplicar `loading="lazy"` a las imágenes internas. La portada debe cargarse de forma prioritaria y no llevar lazy loading si es el elemento visual principal visible al abrir la página.

## 3. Enlaces internos verificados

- Categoría: https://www.anbarhome.co/category/jarrones-escultoricos
- Blog relacionado: https://www.anbarhome.co/blog/como-decorar-una-sala-sin-recargarla

No se incorporó el enlace propuesto para repisas porque no se verificó una URL activa en `anbarhome.co`.

## 4. Open Graph y Twitter Card

- `og:title`: Cómo elegir jarrones decorativos según el espacio | Anbar Home
- `og:description`: Aprende a elegir jarrones decorativos según el tamaño, el acabado y la ubicación, con ideas para hogares y proyectos profesionales.
- `og:type`: article
- `og:url`: https://www.anbarhome.co/blog/como-elegir-jarrones-decorativos
- `og:image`: usar la URL absoluta que genere el CMS para `como-elegir-jarrones-decorativos-portada.webp`.
- `twitter:card`: summary_large_image
- `twitter:title`: Cómo elegir jarrones decorativos según el espacio | Anbar Home
- `twitter:description`: usar la misma descripción de Open Graph.
- `twitter:image`: usar la misma URL absoluta de la portada.

## 5. Schema BlogPosting

Usar `schema-blogposting-ejemplo.json`. Después de publicar, añadir la URL absoluta de la imagen destacada si el CMS no la genera automáticamente. No añadir fecha ni autor hasta que Anbar Home defina esos campos.

## 6. Validaciones antes de publicar

- Confirmar que exista una sola etiqueta H1.
- Verificar que el slug y la canonical coincidan.
- Comprobar que los dos enlaces internos abran en `anbarhome.co`.
- Revisar el artículo en celular, tableta y escritorio.
- Confirmar que las imágenes no se deformen ni se recorten de forma distinta a los archivos entregados.
- Revisar que todos los ALT describan la imagen correspondiente.
- Confirmar que la página sea indexable.
- Revisar el resultado enriquecido del schema después de publicar.

## 7. Diseños editables en Canva

- Portada y encuadres: https://www.canva.com/d/quQCuD4B9qKTvEz
- Comparación de tamaños: https://www.canva.com/d/dHb5wn5J4Sm9O4x
- Acabados y texturas: https://www.canva.com/d/HaHmrrdabprkywW
- Jarrones con ramas: https://www.canva.com/d/P5zKicBI5EzPLDa
- Ubicación según el espacio: https://www.canva.com/d/b-2pfyLjXoyxigk

