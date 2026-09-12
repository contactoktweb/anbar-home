import { createClient } from 'next-sanity'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing Sanity environment variables in .env.local')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
})

// Helper to create PortableText block
function block(
  text: string,
  style: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote' = 'normal',
  marks: Array<{ text: string; strong?: boolean; em?: boolean; link?: string }> = []
) {
  const _key = Math.random().toString(36).substring(2, 11)

  if (marks.length > 0) {
    const markDefs: any[] = []
    const children: any[] = []

    marks.forEach((m, idx) => {
      const childKey = `${_key}_c${idx}`
      const markKeys: string[] = []
      if (m.strong) markKeys.push('strong')
      if (m.em) markKeys.push('em')
      if (m.link) {
        const linkKey = `link_${Math.random().toString(36).substring(2, 7)}`
        markDefs.push({
          _key: linkKey,
          _type: 'link',
          href: m.link,
        })
        markKeys.push(linkKey)
      }

      children.push({
        _key: childKey,
        _type: 'span',
        text: m.text,
        marks: markKeys,
      })
    })

    return {
      _key,
      _type: 'block',
      style,
      markDefs,
      children,
    }
  }

  return {
    _key,
    _type: 'block',
    style,
    markDefs: [],
    children: [
      {
        _key: `${_key}_c0`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
  }
}

// Helper to create list items
function listItem(text: string, level: number = 1, listItemType: 'bullet' | 'number' = 'bullet') {
  const _key = Math.random().toString(36).substring(2, 11)
  return {
    _key,
    _type: 'block',
    style: 'normal',
    listItem: listItemType,
    level,
    markDefs: [],
    children: [
      {
        _key: `${_key}_c0`,
        _type: 'span',
        text,
        marks: [],
      },
    ],
  }
}

// Upload local image to Sanity asset store
async function uploadImage(filePath: string, filename: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }
  console.log(`Uploading ${filename}...`)
  const stream = fs.createReadStream(filePath)
  const asset = await client.assets.upload('image', stream, {
    filename,
  })
  console.log(`✓ Uploaded ${filename} -> ${asset._id}`)
  return asset
}

// Helper for PortableText image block
function imageBlock(assetId: string, alt: string, caption?: string) {
  return {
    _key: Math.random().toString(36).substring(2, 11),
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
    alt,
    caption,
  }
}

async function main() {
  console.log('=== STARTING SANITY BLOG 7 UPLOAD ===')

  // Ensure author exists
  console.log('\n--- Ensuring Institutional Author "Anbar Home" ---')
  await client.createOrReplace({
    _id: 'author-anbar-home',
    _type: 'author',
    name: 'Anbar Home',
    slug: { _type: 'slug', current: 'anbar-home' },
    bio: [
      {
        _key: 'bio1',
        _type: 'block',
        style: 'normal',
        children: [
          {
            _key: 'bio1_c0',
            _type: 'span',
            text: 'Editorial de diseño interior, confort y piezas atemporales de Anbar Home.',
          },
        ],
      },
    ],
  })
  console.log('✓ Author "Anbar Home" created/verified')

  const authorRef = { _type: 'reference', _ref: 'author-anbar-home' }
  const catJarrones = { _type: 'reference', _ref: 'cQJcoXEME16oYHzJObfMFZ', _key: 'cat1' }

  // -------------------------------------------------------------
  // BLOG 7: CÓMO ELEGIR JARRONES DECORATIVOS SEGÚN EL ESPACIO
  // -------------------------------------------------------------
  console.log('\n--- Processing Blog 7: Cómo elegir jarrones decorativos según el espacio ---')
  const b7Path = 'public/blogs/blog7/webp'

  const b7Img1 = await uploadImage(
    path.join(b7Path, 'como-elegir-jarrones-decorativos-portada.webp'),
    'como-elegir-jarrones-decorativos-portada.webp'
  )
  const b7Img2 = await uploadImage(
    path.join(b7Path, 'jarrones-decorativos-segun-tamano.webp'),
    'jarrones-decorativos-segun-tamano.webp'
  )
  const b7Img3 = await uploadImage(
    path.join(b7Path, 'acabados-texturas-jarrones-decorativos.webp'),
    'acabados-texturas-jarrones-decorativos.webp'
  )
  const b7Img4 = await uploadImage(
    path.join(b7Path, 'jarron-con-ramas-decorativas.webp'),
    'jarron-con-ramas-decorativas.webp'
  )
  const b7Img5 = await uploadImage(
    path.join(b7Path, 'jarrones-para-sala-comedor-recibidor.webp'),
    'jarrones-para-sala-comedor-recibidor.webp'
  )

  const blog7Body = [
    block(
      'Saber cómo elegir jarrones decorativos ayuda a evitar dos problemas frecuentes: comprar una pieza que se ve pequeña frente al mueble o elegir una composición que ocupa demasiado espacio. Antes de decidir por el color o la forma, conviene revisar las medidas, la ubicación y el efecto visual que se busca.'
    ),
    block(
      'El criterio cambia según el ambiente. Una mesa auxiliar necesita una pieza distinta a la de una consola amplia, un recibidor, una oficina o un lobby. Esta guía reúne pautas prácticas para comparar tamaños, acabados y formas de uso sin depender de una tendencia específica.'
    ),

    imageBlock(
      b7Img1._id,
      'Jarrones decorativos claros de diferentes alturas sobre una consola.',
      'La escala del jarrón debe guardar relación con la superficie y el espacio disponible.'
    ),

    block('Cómo elegir jarrones decorativos por tamaño', 'h2'),
    block(
      'Mide el ancho, el fondo y la altura de la superficie donde irá el jarrón. La base debe quedar completamente apoyada y debe existir espacio libre alrededor. Si el jarrón llevará flores o ramas, calcula también la altura total de la composición para comprobar que no cubra un cuadro, un espejo, una ventana o una señal dentro de un espacio comercial.'
    ),
    block(
      'La vista frontal no es suficiente. Revisa el jarrón desde el recorrido habitual del ambiente y confirma que no interfiera con puertas, zonas de paso o elementos que se usan a diario.'
    ),

    block('Jarrones pequeños', 'h3'),
    block(
      'Funcionan bien en mesas auxiliares, mesas de noche, escritorios y repisas. Pueden acompañarse con libros o cajas decorativas, siempre que mantengan una diferencia visible de altura. En superficies estrechas es preferible una pieza estable y con una base que no quede al borde.'
    ),

    block('Jarrones medianos', 'h3'),
    block(
      'Son una opción útil para consolas, aparadores y mesas de centro amplias. Un diseño con suficiente presencia puede utilizarse sin flores. Si se combina con otros objetos, debe conservar un área libre que permita apreciar su silueta.'
    ),

    block('Jarrones grandes', 'h3'),
    block(
      'Pueden ubicarse sobre muebles profundos o directamente en el piso. Antes de instalarlos, verifica su estabilidad y el espacio de circulación. En recibidores, oficinas, hoteles y locales comerciales también conviene observar la pieza desde la entrada para revisar su proporción frente al muro y al mobiliario.'
    ),

    imageBlock(
      b7Img2._id,
      'Composición con jarrones decorativos pequeños, medianos y grandes en distintos ambientes.',
      'Comparar varias alturas ayuda a elegir una pieza proporcionada para mesas, consolas o el piso.'
    ),

    block('Cómo elegir el acabado y la textura', 'h2'),
    block(
      'El acabado modifica la forma en que el jarrón se relaciona con los materiales cercanos. Una pieza mate puede crear contraste sobre una superficie brillante. Un acabado reflectante recibe más atención y cambia según la iluminación. Los relieves proyectan pequeñas sombras y se perciben mejor cuando el fondo no compite con ellos.'
    ),
    block(
      'Antes de elegir, revisa la ficha del producto para conocer el material y los cuidados recomendados. No todas las piezas decorativas están diseñadas para contener agua. Si se van a utilizar flores naturales, debe confirmarse que el recipiente admita líquidos o que pueda incorporar un contenedor interno sin afectar su acabado.'
    ),
    block(
      'En proyectos residenciales o profesionales, compara el jarrón con muestras del entorno: madera, piedra, textiles, pintura y metales. La decisión será más precisa que elegirlo de manera aislada.'
    ),

    imageBlock(
      b7Img3._id,
      'Tres composiciones de jarrones con relieve, brillo y superficies texturizadas.',
      'El relieve, el brillo y el color cambian la manera en que el jarrón se integra con los materiales cercanos.'
    ),

    block('Jarrones con flores, ramas o sin contenido', 'h2'),
    block(
      'Un jarrón escultórico puede funcionar como objeto decorativo sin relleno. Esta opción permite apreciar la forma completa y resulta útil cuando el entorno ya tiene varios patrones o accesorios.'
    ),
    block(
      'Si se utilizan ramas, su altura debe mantener una relación visual con el recipiente y el techo. Distribúyelas sin ocultar por completo la silueta del jarrón. Frente a un espejo o una obra de arte, comprueba que el follaje no cubra el punto focal ni genere una masa visual difícil de leer.'
    ),
    block(
      'Para mesas de comedor, la altura total también debe permitir la conversación entre las personas sentadas. En consolas y aparadores, puede utilizarse una composición más alta si no interfiere con luminarias, cuadros o circulación.'
    ),

    imageBlock(
      b7Img4._id,
      'Dos jarrones negros de diferentes alturas con ramas, ubicados sobre un mueble.',
      'Las ramas acompañan la altura de los jarrones sin ocultar por completo la composición del fondo.'
    ),

    block('Cómo combinar varios jarrones', 'h2'),
    block(
      'Busca un vínculo claro entre las piezas: color, acabado, forma o lenguaje visual. No necesitan ser idénticas. Una combinación se entiende mejor cuando existe una pieza principal y las demás funcionan como apoyo.'
    ),
    block(
      'Usa alturas distintas y acerca las bases para que el conjunto se lea como una sola composición. Evita distribuir los jarrones a distancias iguales o formar una fila rígida. Adelantar ligeramente una pieza puede aportar profundidad sin ocupar más superficie.'
    ),
    block(
      'Si los jarrones tienen relieves marcados, reduce la cantidad de accesorios cercanos. Si son más sencillos, pueden acompañarse con una bandeja, libros u otro objeto de menor escala. La selección debe dejar zonas de descanso visual.'
    ),

    block('Qué jarrón elegir para cada espacio', 'h2'),
    block('Sala', 'h3'),
    block(
      'En una mesa de centro, el jarrón debe dejar una parte útil de la superficie. Sobre una consola o un mueble de televisión puede tener mayor altura, siempre que no cubra la pantalla, el arte o el espejo. Para ampliar este criterio, consulta la guía de Anbar Home sobre cómo decorar una sala sin recargarla.',
      'normal',
      [
        {
          text: 'En una mesa de centro, el jarrón debe dejar una parte útil de la superficie. Sobre una consola o un mueble de televisión puede tener mayor altura, siempre que no cubra la pantalla, el arte o el espejo. Para ampliar este criterio, consulta la guía de Anbar Home sobre ',
        },
        {
          text: 'cómo decorar una sala sin recargarla',
          link: 'https://www.anbarhome.co/blog/como-decorar-una-sala-sin-recargarla',
        },
        { text: '.' },
      ]
    ),

    block('Comedor', 'h3'),
    block(
      'Si el jarrón permanece en la mesa durante las comidas, revisa que no bloquee la conversación. Una pieza más alta puede funcionar en un aparador cercano, donde tenga suficiente fondo y no interfiera con el servicio.'
    ),

    block('Recibidor', 'h3'),
    block(
      'Elige una pieza visible desde la entrada y proporcionada con la consola. Revisa la apertura de la puerta, el paso de las personas y la distancia frente al espejo. Una composición alta puede dirigir la mirada, pero necesita aire alrededor.'
    ),

    block('Oficina, hotel o espacio comercial', 'h3'),
    block(
      'En proyectos profesionales, la escala debe evaluarse desde varios puntos de circulación. En una recepción o lobby, un jarrón puede ayudar a organizar el punto focal. En una sala de reuniones o un escritorio compartido, debe conservar la visibilidad y el área de trabajo.'
    ),

    block('Repisas y piso', 'h3'),
    block(
      'Para repisas, utiliza formatos que permitan dejar espacio libre en cada nivel. En el piso, escoge una base estable y ubica la pieza fuera de recorridos, puertas y zonas de limpieza frecuente.'
    ),

    imageBlock(
      b7Img5._id,
      'Jarrones decorativos ubicados en una mesa de sala, una consola y un aparador.',
      'La ubicación cambia la escala necesaria y la forma de combinar el jarrón con los objetos cercanos.'
    ),

    block('Errores frecuentes al elegir jarrones', 'h2'),
    listItem('Elegir solo por color sin revisar las medidas.'),
    listItem('Comprar un jarrón estrecho para un volumen de ramas que necesita mayor soporte.'),
    listItem('Usar varias piezas de la misma altura en una fila rígida.'),
    listItem('Colocar un jarrón grande sobre una superficie poco profunda.'),
    listItem('Añadir agua sin confirmar que el recipiente sea apto para líquidos.'),
    listItem('Ubicar una pieza de piso dentro de una ruta de circulación.'),
    listItem('Combinar demasiados acabados y accesorios en una sola superficie.'),

    block('Lista de verificación antes de comprar', 'h2'),
    listItem('Mide el ancho, el fondo y la altura disponibles.', 1, 'number'),
    listItem('Define si el jarrón irá solo, con flores o con ramas.', 1, 'number'),
    listItem('Revisa el material, el acabado y las instrucciones de cuidado.', 1, 'number'),
    listItem('Comprueba la estabilidad y el espacio de circulación.', 1, 'number'),
    listItem('Compara la pieza con los colores y materiales cercanos.', 1, 'number'),
    listItem('Decide qué objeto tendrá la mayor jerarquía visual.', 1, 'number'),
    listItem('Conserva las medidas del espacio durante la selección.', 1, 'number'),

    block('Preguntas frecuentes sobre cómo elegir jarrones decorativos', 'h2'),
    block('¿El jarrón debe combinar con el sofá?', 'h3'),
    block(
      'No necesita repetir exactamente su color. Puede relacionarse con cojines, cortinas, arte, mesas o acabados del ambiente. También puede crear contraste si ese tono aparece en otro punto de la composición.'
    ),

    block('¿Se pueden mezclar jarrones con acabados diferentes?', 'h3'),
    block(
      'Sí, cuando existe un vínculo visible entre las piezas. Puede ser la forma, la paleta o la proporción. Conviene elegir una pieza principal y limitar la cantidad de materiales que compiten en la misma superficie.'
    ),

    block('¿Cómo saber si un jarrón es demasiado grande?', 'h3'),
    block(
      'Observa si ocupa casi todo el fondo del mueble, cubre elementos importantes o dificulta el uso de la superficie. También debe verse completo desde la distancia habitual y conservar espacio libre a su alrededor.'
    ),

    block('¿Cuántos jarrones se pueden colocar juntos?', 'h3'),
    block(
      'Depende del tamaño de la superficie. Dos o tres piezas con alturas diferentes suelen permitir una composición clara, pero el criterio principal es que las bases estén seguras y que todavía exista espacio libre.'
    ),

    block('Elige con las medidas del espacio', 'h2'),
    block(
      'La decisión debe comenzar por el lugar donde irá la pieza. Conserva las medidas, define si utilizarás ramas o flores y compara la escala desde el recorrido habitual del ambiente. Puedes explorar la colección de jarrones escultóricos de Anbar Home para revisar opciones disponibles y contrastarlas con tu espacio.',
      'normal',
      [
        {
          text: 'La decisión debe comenzar por el lugar donde irá la pieza. Conserva las medidas, define si utilizarás ramas o flores y compara la escala desde el recorrido habitual del ambiente. Puedes explorar la colección de ',
        },
        {
          text: 'jarrones escultóricos de Anbar Home',
          link: 'https://www.anbarhome.co/category/jarrones-escultoricos',
        },
        { text: ' para revisar opciones disponibles y contrastarlas con tu espacio.' },
      ]
    ),
  ]

  await client.createOrReplace({
    _id: 'post-como-elegir-jarrones-decorativos',
    _type: 'post',
    title: 'Cómo elegir jarrones decorativos según el espacio',
    seoTitle: 'Cómo elegir jarrones decorativos | Anbar Home',
    metaDescription:
      'Aprende cómo elegir jarrones decorativos según el tamaño, acabado y espacio. Ideas para salas, comedores, recibidores, oficinas y más.',
    slug: { _type: 'slug', current: 'como-elegir-jarrones-decorativos' },
    publishedAt: '2026-08-29T10:00:00.000Z',
    author: authorRef,
    categories: [catJarrones],
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: b7Img1._id },
      alt: 'Jarrones decorativos claros de diferentes alturas sobre una consola.',
      caption: 'La escala del jarrón debe guardar relación con la superficie y el espacio disponible.',
    },
    body: blog7Body,
  })
  console.log('✓ Blog 7 Saved successfully to Sanity!')

  console.log('\n==========================================')
  console.log('BLOG 7 SUCCESSFULLY UPLOADED TO SANITY!')
  console.log('==========================================')
}

main().catch((err) => {
  console.error('Fatal error during Blog 7 upload:', err)
  process.exit(1)
})
