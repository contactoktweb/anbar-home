# Instrucciones de implementación para Keiner

## Orden de carga

1. `como-decorar-con-esculturas-sala.webp` — **imagen destacada** del artículo.
2. `tamanos-esculturas-decorativas.webp` — imagen de apoyo sobre escala y proporción.
3. `combinar-esculturas-jarrones.webp` — imagen de apoyo sobre composición y diferencias de altura.
4. `errores-al-decorar-con-esculturas.webp` — imagen de apoyo sobre saturación y equilibrio.

## Ubicación dentro del artículo

La imagen destacada debe aparecer al inicio del contenido editorial, después del párrafo introductorio que termina en “Una pieza bien proporcionada puede ordenar visualmente una sala, un recibidor o una oficina” y antes del subtítulo “Cómo decorar con esculturas sin perder la proporción”.

La segunda imagen debe insertarse después del párrafo de “Esculturas de gran formato” y antes del subtítulo “Dónde colocar esculturas decorativas”. La tercera debe insertarse después del primer párrafo de “Cómo combinar esculturas con otros objetos” y antes del párrafo que comienza “Repite un color o un material”. La cuarta debe insertarse después de la lista de “Errores al decorar con esculturas” y antes del subtítulo “Preguntas frecuentes sobre cómo decorar con esculturas”.

## Texto ALT y pies de foto

| Archivo | Texto ALT | Pie de foto |
|---|---|---|
| `como-decorar-con-esculturas-sala.webp` | Escultura de torso color marfil sobre consola negra en un recibidor contemporáneo. | Una pieza escultórica de gran presencia puede convertirse en el punto focal cuando la escala del mueble y el espacio libre la acompañan. |
| `tamanos-esculturas-decorativas.webp` | Comparación de esculturas decorativas de distintas escalas sobre libros, consola y mueble de recibidor. | La escala se entiende al comparar la pieza con su soporte, la altura disponible y el espacio de circulación que la rodea. |
| `combinar-esculturas-jarrones.webp` | Busto escultórico junto a jarrones blancos de distintas alturas sobre una consola de madera. | Una escultura protagonista, un jarrón más bajo y materiales repetidos crean jerarquía sin competir por la atención. |
| `errores-al-decorar-con-esculturas.webp` | Consola recargada frente a una composición equilibrada con escultura y accesorios decorativos. | Reducir los puntos focales y dejar espacio vacío ayuda a que la escultura se entienda y el conjunto conserve orden. |

## Recomendaciones técnicas

Usar las versiones WebP para la publicación web y conservar las versiones PNG de alta calidad como respaldo editorial. La portada está preparada en 1600 × 900 píxeles y las imágenes internas en 1200 × 800 píxeles. Todas las versiones WebP pesan menos de 300 KB.

Activar carga diferida para las tres imágenes internas. La imagen destacada debe priorizarse y no debe cargarse con lazy loading si el tema o el plugin la utiliza como elemento principal visible al inicio. Mantener una relación de aspecto estable para evitar saltos de diseño y comprobar que cada imagen se adapte al ancho del contenedor sin recortar los artículos principales.

Revisar la visualización en computador y celular, especialmente la legibilidad de la comparación de dos paneles en la cuarta imagen y de los tres paneles en la segunda. Confirmar que el pie de foto quede inmediatamente debajo de su imagen y que ninguna imagen interrumpa una lista numerada, un subtítulo separado de su primer párrafo o una pregunta frecuente de su respuesta.

Las imágenes fueron compuestas a partir de las fotografías suministradas. No deben presentarse como fotografías independientes de cada producto ni modificarse nuevamente sin validar la fidelidad de los artículos.
