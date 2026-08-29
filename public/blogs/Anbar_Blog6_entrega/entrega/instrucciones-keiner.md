# Instrucciones de implementación para Keiner

## Orden de carga

1. `como-decorar-una-sala-sin-recargarla.webp` — **imagen destacada** del artículo.
2. `punto-focal-decoracion-sala.webp` — imagen de apoyo sobre el punto focal.
3. `objetos-para-mesa-de-centro.webp` — imagen de apoyo sobre la mesa de centro.
4. `sala-recargada-vs-equilibrada.webp` — imagen de apoyo sobre edición y equilibrio visual.

## Ubicación dentro del artículo

La imagen destacada debe aparecer después del párrafo introductorio que termina en “cuando existe jerarquía, la sala se siente ordenada” y antes del subtítulo “Cómo decorar una sala a partir de un punto focal”.

La segunda imagen debe insertarse después del primer párrafo de “Cómo decorar una sala a partir de un punto focal” y antes del párrafo que comienza “Si el muro principal tiene un cuadro grande”. La tercera debe insertarse después del primer párrafo de “Cómo decorar la mesa de centro” y antes del párrafo que comienza “Combina una pieza alta, otra media y una baja”. La cuarta debe insertarse después de la lista de “Errores al decorar una sala” y antes del subtítulo “Preguntas frecuentes sobre cómo decorar una sala”.

## Texto ALT y pies de foto

| Archivo | Texto ALT | Pie de foto |
|---|---|---|
| `como-decorar-una-sala-sin-recargarla.webp` | Sala decorada con pocos objetos, mesa de centro de madera y tonos neutros. | Concentrar los accesorios en una composición central permite que el sofá, la mesa y la luz natural mantengan una lectura ordenada. |
| `punto-focal-decoracion-sala.webp` | Punto focal en una sala creado con espejo, consola, escultura y jarrón. | Un espejo y una pieza escultórica pueden concentrar la atención cuando los objetos de apoyo mantienen una escala secundaria. |
| `objetos-para-mesa-de-centro.webp` | Mesa de centro equilibrada con bandeja café, libro, recipiente bajo y jarrón pequeño. | Una bandeja reúne los objetos y deja una zona libre para que la mesa de centro siga siendo práctica en el uso diario. |
| `sala-recargada-vs-equilibrada.webp` | Comparación entre una sala recargada y una sala visualmente equilibrada. | Retirar piezas secundarias permite que el punto focal respire y que la sala conserve espacio visual y físico. |

## Recomendaciones técnicas

Utilizar las versiones WebP para la publicación web y conservar las PNG de alta calidad como respaldo editorial. La portada está preparada en 1600 × 900 píxeles y las tres imágenes internas en 1200 × 800 píxeles. Todas las versiones WebP pesan menos de 300 KB.

Activar carga diferida para las tres imágenes internas. La imagen destacada debe priorizarse y no debe cargarse con lazy loading si el tema o el plugin la utiliza como elemento principal visible al inicio. Mantener una relación de aspecto estable para evitar saltos de diseño y comprobar que la mesa de centro y la composición principal no se recorten en celular.

Revisar la visualización en computador y celular, especialmente la lectura de la comparación de dos paneles en la cuarta imagen y el equilibrio de la composición en la tercera. Confirmar que cada pie de foto quede inmediatamente debajo de su imagen y que ninguna imagen se coloque entre una pregunta frecuente y su respuesta.

Las imágenes fueron creadas a partir de fotografías suministradas por Anbar Home y adaptadas a composiciones editoriales. No deben presentarse como fichas de producto individuales ni como fotografías documentales de un proyecto específico.
