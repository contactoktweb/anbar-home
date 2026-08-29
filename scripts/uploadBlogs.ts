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
function block(text: string, style: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote' = 'normal', marks: Array<{ text: string, strong?: boolean, em?: boolean, link?: string }> = []) {
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
          href: m.link
        })
        markKeys.push(linkKey)
      }

      children.push({
        _key: childKey,
        _type: 'span',
        text: m.text,
        marks: markKeys
      })
    })

    return {
      _key,
      _type: 'block',
      style,
      markDefs,
      children
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
        marks: []
      }
    ]
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
        marks: []
      }
    ]
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
    filename
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
      _ref: assetId
    },
    alt,
    caption
  }
}

async function main() {
  console.log('=== STARTING SANITY BLOGS UPLOAD ===')

  // Create or ensure institutional author exists
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
        children: [{ _key: 'bio1_c0', _type: 'span', text: 'Editorial de diseño interior, confort y piezas atemporales de Anbar Home.' }]
      }
    ]
  })
  console.log('✓ Author "Anbar Home" created/verified')

  console.log('\n--- Cleaning old posts to avoid duplicates ---')
  await client.delete({ query: '*[_type == "post"]' })
  console.log('✓ Old posts cleared')

  const authorRef = { _type: 'reference', _ref: 'author-anbar-home' }
  const catJarrones = { _type: 'reference', _ref: 'cQJcoXEME16oYHzJObfMFZ', _key: 'cat1' }
  const catEsculturas = { _type: 'reference', _ref: 'cQJcoXEME16oYHzJOcH09N', _key: 'cat2' }
  const catAcentos = { _type: 'reference', _ref: 'NzlknxdQKnm0MUtifpqa8A', _key: 'cat3' }
  const catSuprema = { _type: 'reference', _ref: 'cQJcoXEME16oYHzJOcJFnJ', _key: 'cat4' }
  const catCandelabros = { _type: 'reference', _ref: 'gYzrCGZlVaWviUgg1DionK', _key: 'cat5' }

  // -------------------------------------------------------------
  // BLOG 1: ESPACIOS SENSORIALES
  // -------------------------------------------------------------
  console.log('\n--- Processing Blog 1: Espacios Sensoriales ---')
  const b1Path = 'public/blogs/Anbar_Blog_1_Espacios_Sensoriales_entrega/webp'
  const b1Img1 = await uploadImage(path.join(b1Path, 'espacios-sensoriales-interiorismo.webp'), 'espacios-sensoriales-interiorismo.webp')
  const b1Img2 = await uploadImage(path.join(b1Path, 'interior-sensorial-sala-calida.webp'), 'interior-sensorial-sala-calida.webp')
  const b1Img3 = await uploadImage(path.join(b1Path, 'iluminacion-calida-espacios-sensoriales.webp'), 'iluminacion-calida-espacios-sensoriales.webp')
  const b1Img4 = await uploadImage(path.join(b1Path, 'materiales-naturales-texturas-interiorismo.webp'), 'materiales-naturales-texturas-interiorismo.webp')
  const b1Img5 = await uploadImage(path.join(b1Path, 'ambiente-sensorial-completo.webp'), 'ambiente-sensorial-completo.webp')

  const blog1Body = [
    block('El diseño interior no consiste únicamente en elegir colores o llenar una habitación de objetos atractivos. Un espacio también se percibe por la manera en que recibe la luz, por las texturas que invita a tocar, por la relación entre sus materiales y por la sensación que produce al recorrerlo. De esa idea nacen los espacios sensoriales: ambientes pensados para verse bien, sentirse cómodos y acompañar la vida cotidiana.', 'normal', [
      { text: 'El diseño interior no consiste únicamente en elegir colores o llenar una habitación de objetos atractivos. Un espacio también se percibe por la manera en que recibe la luz, por las texturas que invita a tocar, por la relación entre sus materiales y por la sensación que produce al recorrerlo. De esa idea nacen los ' },
      { text: 'espacios sensoriales', strong: true },
      { text: ': ambientes pensados para verse bien, sentirse cómodos y acompañar la vida cotidiana.' }
    ]),
    block('Crear un interior sensorial no exige renovar todos los muebles. Muchas veces basta con ordenar la composición, mejorar la iluminación, incorporar materiales naturales y seleccionar objetos decorativos con una intención clara. La clave está en construir una experiencia coherente, sin saturar las superficies ni hacer que cada pieza compita por llamar la atención.'),

    imageBlock(
      b1Img1._id,
      'Interior cálido con aparador de madera, jarrones, planta y luz natural.',
      'Un ambiente sensorial comienza con la relación entre luz, materiales naturales y una composición decorativa que deja espacio para respirar.'
    ),

    block('¿Qué son los espacios sensoriales?', 'h2'),
    block('Los espacios sensoriales integran estímulos visuales, táctiles y ambientales dentro de una misma composición. La luz puede destacar una textura; la madera puede aportar calidez; la cerámica puede introducir relieve; y una escultura puede convertirse en un punto focal. Cuando estos elementos se relacionan, el ambiente adquiere profundidad sin depender de una decoración excesiva.'),
    block('La propuesta funciona mejor cuando parte de las condiciones reales del lugar. Observa el tamaño de la habitación, la entrada de luz, los recorridos y los elementos que no cambiarán, como el piso, las ventanas o la carpintería. A partir de allí, define una paleta de dos o tres tonos, elige una textura dominante y reserva los contrastes para algunos acentos.'),

    imageBlock(
      b1Img2._id,
      'Sala cálida con sofá neutro, espejo, planta y jarrones decorativos.',
      'La experiencia del espacio se construye al conectar el mobiliario, la luz, las plantas y los objetos sin llenar cada superficie.'
    ),

    block('Cinco recursos para crear un diseño interior sensorial', 'h2'),

    block('1. Utiliza iluminación cálida y por capas', 'h3'),
    block('La luz general permite usar el espacio, pero no siempre crea atmósfera. Complementa la iluminación principal con lámparas de mesa, luminarias de piso o puntos indirectos que destaquen una obra, una textura o una zona de lectura. Evita que la luz produzca reflejos directos en espejos, pantallas o superficies brillantes.'),

    imageBlock(
      b1Img3._id,
      'Mesa de centro con jarrones, velas y luz cálida en una sala.',
      'La luz general y los puntos cálidos de apoyo crean capas que destacan las texturas sin convertir la sala en un escenario recargado.'
    ),

    block('2. Combina materiales naturales', 'h3'),
    block('La madera, la piedra, la cerámica, el vidrio y los textiles aportan diferencias visibles y táctiles. No es necesario utilizar todos los materiales en una misma habitación. Una consola de madera con un jarrón cerámico, una escultura de acabado mate y un detalle metálico puede ser suficiente para crear una composición rica y equilibrada.'),

    block('3. Trabaja con texturas reconocibles', 'h3'),
    block('Las texturas hacen que un interior se sienta más cercano. Puedes incorporarlas en cojines, alfombras, cerámicas, bandejas, superficies minerales o fibras naturales. Para mantener el orden visual, repite una textura en dos puntos y deja que el resto de los objetos tenga acabados más discretos.'),

    imageBlock(
      b1Img4._id,
      'Jarrones cerámicos texturizados sobre madera y pared de acabado mineral.',
      'La cerámica con relieve, la madera y una superficie mineral aportan profundidad táctil a una composición sencilla.'
    ),

    block('4. Controla el color', 'h3'),
    block('Una paleta sensorial no tiene que ser completamente beige. Los tonos tierra, blancos cálidos, negros, verdes profundos, borgoñas y dorados pueden convivir si uno domina y los demás aparecen como acentos. El color se percibe con mayor intención cuando no está repetido en todas las superficies.'),

    block('5. Elige objetos con una función visual', 'h3'),
    block('Un jarrón escultórico puede introducir altura o movimiento; una escultura decorativa puede establecer un punto focal; y un acento decorativo puede completar una repisa o una consola. Antes de añadir una pieza, decide qué aportará: volumen, contraste, textura, repetición o equilibrio.', 'normal', [
      { text: 'Un ' },
      { text: 'jarrón escultórico', link: 'https://www.anbarhome.co/category/jarrones-escultoricos' },
      { text: ' puede introducir altura o movimiento; una ' },
      { text: 'escultura decorativa', link: 'https://www.anbarhome.co/category/esculturas' },
      { text: ' puede establecer un punto focal; y un ' },
      { text: 'acento decorativo', link: 'https://www.anbarhome.co/category/acentos-decorativos' },
      { text: ' puede completar una repisa o una consola. Antes de añadir una pieza, decide qué aportará: volumen, contraste, textura, repetición o equilibrio.' }
    ]),

    block('Cómo aplicar esta idea en una sala, recibidor o dormitorio', 'h2'),
    block('En la sala, comienza por el sofá, la mesa de centro y la fuente principal de luz. Deja parte de la mesa libre y agrupa los objetos en una composición compacta. Una bandeja puede reunir un libro, un recipiente bajo y un jarrón pequeño, mientras una escultura en la consola dirige la mirada hacia un único punto.'),
    block('En el recibidor, un espejo puede ampliar visualmente la entrada y reflejar una vista agradable. Acompáñalo con una consola, una pieza de altura media y un objeto bajo. En un dormitorio o rincón de lectura, prioriza textiles suaves, iluminación cálida y objetos que no interfieran con el descanso ni con el uso cotidiano del mueble.'),
    block('Para proyectos de mayor escala, la Línea Suprema de Anbar Home permite explorar piezas con presencia escultórica y acabados adecuados para construir una composición más definida. La selección debe responder siempre a las dimensiones reales del ambiente y a la distancia desde la que se observará.', 'normal', [
      { text: 'Para proyectos de mayor escala, la ' },
      { text: 'Línea Suprema de Anbar Home', link: 'https://www.anbarhome.co/category/linea-suprema' },
      { text: ' permite explorar piezas con presencia escultórica y acabados adecuados para construir una composición más definida. La selección debe responder siempre a las dimensiones reales del ambiente y a la distancia desde la que se observará.' }
    ]),

    block('Cómo elegir piezas decorativas sin recargar el ambiente', 'h2'),
    block('Antes de comprar, mide el ancho, alto y profundidad de la superficie disponible. Define una pieza principal y deja espacio libre alrededor para que su silueta pueda leerse. Después incorpora uno o dos apoyos con menor altura o contraste. La decoración se percibe más sofisticada cuando existe una jerarquía clara entre los objetos.'),
    block('También conviene fotografiar el lugar desde la entrada. Esa imagen permite revisar si la composición bloquea una circulación, compite con una ventana o repite demasiados puntos focales. Si el ambiente ya tiene arte, textiles estampados o un mueble protagonista, selecciona objetos más silenciosos y con una paleta relacionada.'),

    block('Errores que debilitan un espacio sensorial', 'h2'),
    block('El exceso de accesorios no crea necesariamente una experiencia más rica. Llenar cada repisa, mezclar demasiados brillos, usar una luz fría en todo el ambiente, repetir la misma altura o colocar objetos sin medir puede hacer que la habitación pierda calma y legibilidad. También es un error elegir cada pieza como si fuera el centro de la composición.'),
    block('La mejor edición suele consistir en retirar antes de agregar. Conserva los objetos que aportan textura, escala o significado, y cambia de ubicación los que bloquean la circulación o repiten una función. Un ambiente sensorial necesita pausas visuales tanto como piezas atractivas.'),

    block('Preguntas frecuentes sobre espacios sensoriales', 'h2'),
    block('¿Los espacios sensoriales deben ser neutros?', 'h3'),
    block('No. Los tonos neutros facilitan una base tranquila, pero también puedes incorporar verde profundo, borgoña, azul, negro o dorado. Lo importante es controlar la cantidad, el contraste y la repetición de cada color.'),

    block('¿Es necesario cambiar todos los muebles?', 'h3'),
    block('No. Puedes comenzar con la iluminación, los textiles y la organización de una superficie. Un espejo, un jarrón, una escultura o una bandeja bien ubicados pueden cambiar la lectura de una sala sin sustituir el mobiliario principal.'),

    block('¿Cómo empiezo a crear un espacio sensorial?', 'h3'),
    block('Observa el ambiente desde la entrada, retira objetos innecesarios, define una paleta y elige una textura para repetir. Después incorpora una pieza focal y revisa que los recorridos, la luz y las superficies sigan siendo funcionales.'),

    block('Un interior sensorial se construye por capas', 'h2'),
    block('Los espacios sensoriales se crean mediante decisiones acumulativas: una luz que acompaña, una textura que aporta profundidad, una paleta que conecta las habitaciones y objetos que tienen una función dentro de la composición. No se trata de decorar más, sino de elegir mejor.'),

    imageBlock(
      b1Img5._id,
      'Consola decorada con jarrones, flores, candelabros y arte en un ambiente cálido.',
      'El resultado final reúne luz, textura, escala y objetos con intención dentro de una composición habitable y equilibrada.'
    ),

    block('Explora la colección de objetos para decoración e interiorismo de Anbar Home, descubre jarrones escultóricos, esculturas y acentos decorativos para completar tus espacios con textura, calidez y personalidad. También puedes consultar nuestras ideas sobre cómo decorar con esculturas y cómo decorar una sala sin recargarla.', 'normal', [
      { text: 'Explora la colección de ' },
      { text: 'objetos para decoración e interiorismo de Anbar Home', link: 'https://www.anbarhome.co/' },
      { text: ', descubre ' },
      { text: 'jarrones escultóricos', link: 'https://www.anbarhome.co/category/jarrones-escultoricos' },
      { text: ', ' },
      { text: 'esculturas', link: 'https://www.anbarhome.co/category/esculturas' },
      { text: ' y ' },
      { text: 'acentos decorativos', link: 'https://www.anbarhome.co/category/acentos-decorativos' },
      { text: ' para completar tus espacios con textura, calidez y personalidad. También puedes consultar nuestras ideas sobre ' },
      { text: 'cómo decorar con esculturas', link: 'https://www.anbarhome.co/blog/como-decorar-con-esculturas' },
      { text: ' y ' },
      { text: 'cómo decorar una sala sin recargarla', link: 'https://www.anbarhome.co/blog/como-decorar-una-sala-sin-recargarla' },
      { text: '.' }
    ])
  ]

  await client.createOrReplace({
    _id: 'post-el-regreso-de-los-espacios-sensoriales',
    _type: 'post',
    title: 'Espacios sensoriales: cómo crear interiores que se sienten bien',
    seoTitle: 'Espacios sensoriales: cómo crear interiores que se sienten bien | Anbar Home',
    metaDescription: 'Descubre cómo crear espacios sensoriales con luz cálida, materiales naturales y objetos decorativos de Anbar Home que aportan textura, calma y personalidad.',
    slug: { _type: 'slug', current: 'el-regreso-de-los-espacios-sensoriales' },
    publishedAt: '2026-08-26T10:00:00.000Z',
    author: authorRef,
    categories: [catJarrones, catAcentos],
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: b1Img1._id },
      alt: 'Interior cálido con aparador de madera, jarrones, planta y luz natural.',
      caption: 'Un ambiente sensorial comienza con la relación entre luz, materiales naturales y una composición decorativa que deja espacio para respirar.'
    },
    body: blog1Body
  })
  console.log('✓ Blog 1 Saved successfully')

  // -------------------------------------------------------------
  // BLOG 2: CASA BIEN DISEÑADA Y ESTRÉS
  // -------------------------------------------------------------
  console.log('\n--- Processing Blog 2: Casa Bien Diseñada y Estrés ---')
  const b2Path = 'public/blogs/Anbar_Blog_2_casa_bien_disenada_entrega (1)/webp'
  const b2Img1 = await uploadImage(path.join(b2Path, 'casa-bien-disenada-reduce-estres.webp'), 'casa-bien-disenada-reduce-estres.webp')
  const b2Img2 = await uploadImage(path.join(b2Path, 'interior-que-favorece-la-calma.webp'), 'interior-que-favorece-la-calma.webp')
  const b2Img3 = await uploadImage(path.join(b2Path, 'iluminacion-calida-hogar-bienestar.webp'), 'iluminacion-calida-hogar-bienestar.webp')
  const b2Img4 = await uploadImage(path.join(b2Path, 'materiales-naturales-casa-acogedora.webp'), 'materiales-naturales-casa-acogedora.webp')
  const b2Img5 = await uploadImage(path.join(b2Path, 'casa-equilibrada-para-vivir-mejor.webp'), 'casa-equilibrada-para-vivir-mejor.webp')

  const blog2Body = [
    block('Hace un tiempo una clienta me dijo algo que todavía recuerdo: "Andrés, mi casa es muy linda... pero casi no me gusta estar aquí." Al principio pensé que se refería a un problema con los muebles o con algún detalle de la decoración, pero no era eso. Su apartamento tenía buenos acabados, una distribución correcta y todo se veía muy bien. De hecho, cualquiera diría que era una casa espectacular. Sin embargo, había algo que no terminaba de hacer clic. No disfrutaba estar allí.'),
    block('Esa conversación se me quedó dando vueltas porque, con los años, me he encontrado con muchas personas que sienten exactamente lo mismo. Invierten tiempo y dinero en tener una casa bonita, pero pocas veces se detienen a pensar en cómo quieren sentirse cuando llegan a ella. Y para mí, ahí está la diferencia entre una casa que simplemente se ve bien y un hogar que realmente mejora tu día.'),
    block('Hoy hablamos mucho de bienestar, de salud mental y de encontrar espacios donde podamos desconectarnos del ritmo acelerado que llevamos. Pero pocas veces pensamos que nuestra casa puede ser una gran aliada en ese proceso. O, por el contrario, un factor silencioso que aumenta el cansancio y el estrés.'),

    imageBlock(
      b2Img2._id,
      'Interior cálido con consola, planta, jarrones y circulación despejada.',
      'La relación entre un ambiente, sus recorridos y sus objetos influye en la manera en que se vive cada día.'
    ),

    block('Tu casa habla con tus emociones, aunque no te des cuenta', 'h2'),
    block('Seguro te ha pasado alguna vez. Entras a un hotel y, apenas cruzas la puerta, sientes tranquilidad. O visitas la casa de un amigo y hay algo en ese espacio que te invita a quedarte, a relajarte, a respirar más despacio. En cambio, en otros lugares ocurre exactamente lo contrario: te sientes inquieto, abrumado o con ganas de salir rápido.'),
    block('No siempre tiene que ver con el tamaño de la casa o con muebles costosos. Es una suma de pequeños detalles que trabajan juntos: la forma en que entra la luz, los colores que predominan, los materiales que tocas todos los días, el nivel de ruido visual que hay en cada habitación e incluso los olores que te reciben.'),
    block('Nuestro cerebro está recibiendo esa información todo el tiempo. Por eso, cada vez hay más investigaciones que estudian cómo los espacios influyen en nuestras emociones, en los niveles de cortisol y en la capacidad de concentración.'),

    block('El error más común: diseñar la casa para las visitas', 'h2'),
    block('Hay algo que veo con frecuencia cuando acompaño a una familia a renovar su hogar. Muchas decisiones se toman pensando en lo que dirán los demás. Se eligen muebles más formales que cómodos, se llenan repisas de adornos solo para que no se vean vacías o se compran cosas simplemente porque están de moda.'),
    block('Pero las visitas están en tu casa un par de horas al mes. Tú y tu familia la viven todos los días.'),
    block('Cuando una casa se diseña para impresionar, termina sintiéndose fría. Cuando se diseña pensando en la vida real, en tus hábitos y en tus momentos de descanso, el resultado es completamente diferente.'),

    block('La luz puede cambiar por completo la forma en que vives un espacio', 'h2'),
    block('Si hay un elemento que tiene un impacto inmediato en el estado de ánimo, es la iluminación.'),
    block('He visto apartamentos increíbles que se sienten fríos y poco acogedores simplemente porque tienen una sola luz blanca y potente en el techo. En cambio, cuando distribuyes la luz en diferentes puntos —una lámpara de mesa, una luz indirecta, velas o luminarias cálidas— el espacio se transforma por completo.'),
    block('La luz natural durante el día nos llena de energía; la luz cálida y tenue al final de la tarde le avisa a nuestro cuerpo que es momento de bajar el ritmo. Si aprendes a jugar con la luz, tu casa empezará a sentirse mucho más acogedora sin necesidad de cambiar todo lo demás.'),

    imageBlock(
      b2Img3._id,
      'Mesa de centro con escultura, vela y luz cálida en una sala.',
      'La iluminación cálida y distribuida por capas puede hacer que una sala se sienta más acogedora al final del día.'
    ),

    block('A veces el mejor cambio no es comprar más cosas, sino quitar las que sobran', 'h2'),
    block('Vivimos acumulando: papeles en la entrada, objetos decorativos que ya no nos gustan, cosas que compramos por impulso y muebles que terminan estorbando el paso.'),
    block('El desorden visual genera cansancio mental. Cada objeto fuera de lugar es un pequeño estímulo que tu cerebro procesa, aunque no lo notes conscientemente.'),
    block('Uno de los ejercicios más liberadores al decorar no es buscar qué agregar, sino qué retirar. Dejar superficies limpias, permitir que el aire circule y darle protagonismo a pocas piezas que realmente te gusten cambia de inmediato la energía de cualquier habitación.'),

    block('Los materiales hacen más de lo que imaginamos', 'h2'),
    block('Tocar madera natural, sentir la textura de un jarrón de cerámica hecho a mano o pisar una alfombra suave produce una sensación muy distinta a estar rodeado de plástico o materiales sintéticos fríos.'),
    block('Los materiales naturales nos conectan con la calma. Tienen textura, tienen imperfecciones hermosas y aportan una calidez que ningún material artificial logra imitar.'),
    block('No se trata de llenar la casa de objetos, sino de elegir piezas con intención: una escultura que te inspire, una bandeja de madera que organice la mesa de centro, o un jarrón con ramas secas que traiga un toque de naturaleza al interior.'),

    imageBlock(
      b2Img4._id,
      'Jarrones blancos con relieve sobre una consola de madera en un interior cálido.',
      'Las texturas de cerámica y madera aportan profundidad y calidez sin necesidad de llenar la habitación.'
    ),

    block('Una casa bien diseñada es un refugio para el alma', 'h2'),
    block('Al final del día, una casa bonita es agradable a la vista, pero una casa bien pensada cuida a quienes viven en ella.'),
    block('No necesitas una mansión ni un presupuesto infinito para lograrlo. Empieza por pequeños pasos: ordena un rincón, cambia una bombilla por una de luz cálida, retira lo que ya no usas y rodéate de piezas que realmente tengan significado para ti.'),
    block('Porque cuando tu casa se convierte en un lugar donde puedes respirar, descansar y desconectarte del mundo, tu vida entera cambia.'),

    imageBlock(
      b2Img5._id,
      'Consola con jarrones, escultura y arte en una sala cálida y equilibrada.',
      'Una composición equilibrada deja espacio para circular, descansar y disfrutar de la casa.'
    ),

    block('En Anbar Home creemos que la decoración no se trata de llenar espacios, sino de crear ambientes que transmitan paz, belleza y calidez. Te invitamos a descubrir nuestra selección de jarrones, esculturas y acentos decorativos pensados para transformar tu casa en el hogar que siempre soñaste.', 'normal', [
      { text: 'En Anbar Home creemos que la decoración no se trata de llenar espacios, sino de crear ambientes que transmitan paz, belleza y calidez. Te invitamos a descubrir nuestra selección de ' },
      { text: 'jarrones', link: 'https://www.anbarhome.co/category/jarrones-escultoricos' },
      { text: ', ' },
      { text: 'esculturas', link: 'https://www.anbarhome.co/category/esculturas' },
      { text: ' y ' },
      { text: 'acentos decorativos', link: 'https://www.anbarhome.co/category/acentos-decorativos' },
      { text: ' pensados para transformar tu casa en el hogar que siempre soñaste.' }
    ])
  ]

  await client.createOrReplace({
    _id: 'post-puede-una-casa-bien-disenada-reducir-el-estres',
    _type: 'post',
    title: '¿Puede una casa bien diseñada reducir el estrés? Esto es lo que he aprendido después de recorrer cientos de hogares',
    seoTitle: '¿Puede una casa bien diseñada reducir el estrés? | Anbar Home',
    metaDescription: 'Descubre cómo una casa bien diseñada, organizada con luz cálida, materiales naturales y equilibrio visual, puede mejorar tu bienestar y reducir el estrés cotidiano.',
    slug: { _type: 'slug', current: 'puede-una-casa-bien-disenada-reducir-el-estres' },
    publishedAt: '2026-07-08T20:37:22.000Z',
    author: authorRef,
    categories: [catAcentos, catJarrones],
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: b2Img1._id },
      alt: 'Casa cálida con aparador de madera, jarrones, planta y luz suave.',
      caption: 'Una casa bien diseñada no solo se ve bien: organiza la luz, los materiales y los objetos para acompañar la vida cotidiana.'
    },
    body: blog2Body
  })
  console.log('✓ Blog 2 Saved successfully')

  // -------------------------------------------------------------
  // BLOG 3: QUIET LUXURY HOME 2027
  // -------------------------------------------------------------
  console.log('\n--- Processing Blog 3: Quiet Luxury Home ---')
  const b3Path = 'public/blogs/Anbar_Blog_3_Quiet_Luxury_Home_entrega/webp'
  const b3Img1 = await uploadImage(path.join(b3Path, 'quiet-luxury-home-2027.webp'), 'quiet-luxury-home-2027.webp')
  const b3Img2 = await uploadImage(path.join(b3Path, 'quiet-luxury-casa-acogedora.webp'), 'quiet-luxury-casa-acogedora.webp')
  const b3Img3 = await uploadImage(path.join(b3Path, 'quiet-luxury-materiales-que-perduran.webp'), 'quiet-luxury-materiales-que-perduran.webp')
  const b3Img4 = await uploadImage(path.join(b3Path, 'quiet-luxury-menos-objetos.webp'), 'quiet-luxury-menos-objetos.webp')
  const b3Img5 = await uploadImage(path.join(b3Path, 'quiet-luxury-interior-humano.webp'), 'quiet-luxury-interior-humano.webp')

  const blog3Body = [
    block('Durante años, muchos hogares estuvieron enfocados en sorprender. Espacios llenos de color, muebles protagonistas, objetos decorativos que buscaban destacar y ambientes pensados para verse perfectos en una fotografía. Pero poco a poco la conversación alrededor del diseño interior empezó a cambiar. Las personas dejaron de preguntarse únicamente cómo hacer que su casa se viera más bonita y comenzaron a preguntarse algo mucho más importante: ¿cómo quiero sentirme cuando estoy en ella?'),
    block('Esa pregunta es precisamente la esencia del Quiet Luxury, o lujo silencioso. Más que una tendencia estética, representa una nueva forma de entender el hogar. Es volver a valorar los materiales nobles, las piezas que tienen una historia, los espacios que transmiten calma y aquellas decisiones de diseño que no buscan impresionar a los demás, sino mejorar la experiencia de quienes viven allí.'),
    block('Porque el verdadero lujo ya no está en mostrar cuánto cuesta algo. Está en la sensación que produce.'),

    imageBlock(
      b3Img2._id,
      'Interior de tonos neutros con lámpara colgante, mesa de centro y sofá amplio.',
      'Una casa silenciosa no es una casa vacía: es un espacio donde cada elemento tiene una razón para estar.'
    ),

    block('El verdadero lujo ya no hace ruido', 'h2'),
    block('Durante mucho tiempo asociamos el lujo con lo evidente: grandes espacios, muebles exclusivos, acabados llamativos y elementos que inmediatamente capturan la atención. Sin embargo, el lujo contemporáneo se está construyendo desde otro lugar.'),
    block('Hoy el lujo está en abrir una puerta que se siente sólida, en caminar descalzo sobre un piso cálido, en una iluminación que transforma la atmósfera de una habitación cuando llega la tarde o en sentarse en un sofá donde realmente apetece quedarse.'),
    block('Son detalles que quizá no siempre se explican con palabras, pero que se perciben apenas entramos a un espacio. Una casa puede tener piezas costosas y aun así sentirse distante. También puede tener elementos sencillos, cuidadosamente seleccionados, y transmitir una sensación profunda de equilibrio y bienestar. Esa es una de las grandes diferencias del lujo silencioso: no busca llamar la atención, busca crear una experiencia.'),

    block('Diseñar con intención: menos objetos, mejores decisiones', 'h2'),
    block('Uno de los grandes aprendizajes del Quiet Luxury es entender que una casa no se construye acumulando cosas, sino tomando mejores decisiones. No significa vivir en espacios vacíos o sin personalidad. Significa que cada elemento tenga un propósito y que cada pieza aporte algo a la historia del hogar.'),
    block('Un comedor no es solamente una mesa y unas sillas; es el lugar donde una familia conversa, celebra y comparte momentos que permanecen en el tiempo. Una lámpara no es únicamente un objeto decorativo; puede cambiar por completo la forma en que se siente una habitación. Un sofá no es solo un mueble; puede convertirse en ese lugar donde termina el día y comienza el descanso.'),
    block('Cuando cada elección tiene sentido, la casa empieza a sentirse más equilibrada. El espacio deja de ser una colección de objetos y se convierte en un lugar pensado para vivir.'),

    imageBlock(
      b3Img3._id,
      'Detalle de jarrones cerámicos y consola de madera con acabado natural.',
      'Los materiales con peso y textura envejecen mejor que los acabados de moda.'
    ),

    block('Los materiales que perduran vuelven a ser protagonistas', 'h2'),
    block('Una de las razones por las que esta tendencia seguirá creciendo en los próximos años es porque recupera algo esencial: el valor de los buenos materiales. La madera natural, la piedra, los textiles como el lino y el algodón, las cerámicas artesanales y los metales con acabados más suaves están ganando protagonismo porque tienen una característica que pocas tendencias tienen: envejecen bien.'),
    block('Un buen material no pierde valor con el tiempo. Una madera adquiere carácter, una piedra se vuelve única y una textura natural hace que un espacio se sienta más cercano y auténtico.'),
    block('El lujo actual está precisamente ahí: en elegir piezas que puedan acompañar diferentes etapas de la vida, que no dependan de una moda pasajera y que sigan teniendo sentido muchos años después.'),

    imageBlock(
      b3Img4._id,
      'Consola de madera clara con jarrón blanco y espejo en un espacio luminoso.',
      'Reducir la cantidad de piezas permite que la arquitectura, la luz y las siluetas principales respiren.'
    ),

    block('Una casa elegante es una casa donde quieres estar', 'h2'),
    block('Existe una diferencia enorme entre una casa que se ve bien y una casa que se siente bien. Durante mucho tiempo el diseño estuvo muy ligado a la imagen. A cómo se veía un espacio en una fotografía, a la primera impresión que generaba cuando alguien entraba o a la posibilidad de compartirlo en redes sociales.'),
    block('Pero una casa no debería diseñarse únicamente para ser observada. Debería diseñarse para ser vivida. La pregunta más importante no debería ser qué pensará alguien cuando llegue de visita, sino cómo queremos sentirnos después de un día largo cuando abrimos la puerta de nuestro hogar.'),
    block('La mayoría de las personas no busca impresionar. Busca tranquilidad, comodidad, descanso y un espacio donde pueda sentirse en equilibrio.'),

    block('El orden, la calma y la permanencia', 'h2'),
    block('Hay un aspecto del diseño que muchas veces pasa desapercibido: el orden. Una casa sofisticada no necesariamente es la que tiene más muebles o más decoración. Muchas veces es la que está mejor pensada. Cuando cada elemento encuentra su lugar y los espacios funcionan de acuerdo con la manera en que vivimos, todo se siente más ligero.'),
    block('El orden no significa eliminar la personalidad de una casa. Significa darle espacio a lo importante. También representa una manera más consciente de comprar. En lugar de llenar habitaciones con piezas que rápidamente pierden sentido, el Quiet Luxury propone elegir menos elementos, pero con mayor calidad y significado.'),

    block('Hacia un interiorismo más humano y duradero', 'h2'),
    block('El crecimiento del Quiet Luxury no responde únicamente a una tendencia visual. Responde a una transformación en nuestra forma de entender el hogar. Vivimos en un mundo donde todo ocurre más rápido, donde estamos constantemente rodeados de información y estímulos. Por eso nuestros espacios personales empiezan a tener un papel diferente: convertirse en lugares donde podamos encontrar calma, conexión y bienestar.'),
    block('El futuro del diseño no estará en crear hogares que griten más fuerte, sino en crear hogares que nos hagan sentir mejor.'),

    imageBlock(
      b3Img5._id,
      'Sala cálida con luz suave, textiles naturales y objetos decorativos en equilibrio.',
      'El lujo silencioso sitúa el bienestar y la calma en el centro del diseño del hogar.'
    ),

    block('En Anbar Home creemos que el verdadero lujo no está en llenar un espacio de objetos, sino en crear ambientes con intención, con materiales que perduran y con piezas que acompañan la historia de quienes los habitan. Explora nuestras colecciones de jarrones escultóricos, esculturas, candelabros y piezas de la Línea Suprema para construir un hogar atemporal.', 'normal', [
      { text: 'En Anbar Home creemos que el verdadero lujo no está en llenar un espacio de objetos, sino en crear ambientes con intención, con materiales que perduran y con piezas que acompañan la historia de quienes los habitan. Explora nuestras colecciones de ' },
      { text: 'jarrones escultóricos', link: 'https://www.anbarhome.co/category/jarrones-escultoricos' },
      { text: ', ' },
      { text: 'esculturas', link: 'https://www.anbarhome.co/category/esculturas' },
      { text: ', ' },
      { text: 'candelabros', link: 'https://www.anbarhome.co/category/candelabros' },
      { text: ' y piezas de la ' },
      { text: 'Línea Suprema', link: 'https://www.anbarhome.co/category/linea-suprema' },
      { text: ' para construir un hogar atemporal.' }
    ])
  ]

  await client.createOrReplace({
    _id: 'post-quiet-luxury-home-tendencia-2027',
    _type: 'post',
    title: 'Quiet Luxury Home: la tendencia que dominará los interiores en 2027',
    seoTitle: 'Quiet Luxury Home: cómo aplicarlo en 2027 | Anbar Home',
    metaDescription: 'Descubre cómo aplicar el Quiet Luxury Home en 2027 con materiales duraderos, pocos objetos y ambientes cálidos pensados para vivir mejor.',
    slug: { _type: 'slug', current: 'quiet-luxury-home-tendencia-2027' },
    publishedAt: '2026-07-08T20:39:25.000Z',
    author: authorRef,
    categories: [catSuprema, catJarrones],
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: b3Img1._id },
      alt: 'Aparador de madera oscura con jarrones blancos y candelabros en un interior cálido.',
      caption: 'El Quiet Luxury Home se expresa en materiales que perduran, piezas con presencia y una composición que no necesita exceso.'
    },
    body: blog3Body
  })
  console.log('✓ Blog 3 Saved successfully')

  // -------------------------------------------------------------
  // BLOG 4: CÓMO DECORAR CON ESCULTURAS
  // -------------------------------------------------------------
  console.log('\n--- Processing Blog 4: Cómo decorar con esculturas ---')
  const b4Path = 'public/blogs/Anbar_Blog4_entrega/webp'
  const b4Img1 = await uploadImage(path.join(b4Path, 'como-decorar-con-esculturas-sala.webp'), 'como-decorar-con-esculturas-sala.webp')
  const b4Img2 = await uploadImage(path.join(b4Path, 'tamanos-esculturas-decorativas.webp'), 'tamanos-esculturas-decorativas.webp')
  const b4Img3 = await uploadImage(path.join(b4Path, 'combinar-esculturas-jarrones.webp'), 'combinar-esculturas-jarrones.webp')
  const b4Img4 = await uploadImage(path.join(b4Path, 'errores-al-decorar-con-esculturas.webp'), 'errores-al-decorar-con-esculturas.webp')

  const blog4Body = [
    block('Aprender cómo decorar con esculturas permite crear puntos focales sin llenar cada superficie. La elección depende de tres factores observables: el tamaño del mueble, la altura disponible y la cantidad de objetos que ya comparten el ambiente. Una pieza bien proporcionada puede ordenar visualmente una sala, un recibidor o una oficina.'),

    imageBlock(
      b4Img1._id,
      'Escultura de gran formato en una sala cálida sobre consola de madera.',
      'Una pieza escultórica de gran presencia puede convertirse en el punto focal cuando la escala del mueble y el espacio libre la acompañan.'
    ),

    block('Cómo decorar con esculturas sin perder la proporción', 'h2'),
    block('Antes de elegir una pieza, mide la superficie donde irá ubicada. En consolas, mesas auxiliares y repisas, la escultura debe dejar espacio libre alrededor. Ese vacío ayuda a que la silueta se entienda y evita que el conjunto parezca accidental.'),
    block('En una consola amplia puede funcionar una pieza alta acompañada por un objeto de menor escala. En una mesa pequeña conviene usar una sola escultura compacta. Para el piso, elige una pieza con altura suficiente para verse desde la entrada del ambiente y asegúrate de que no interrumpa el paso.'),

    block('Qué tamaño de escultura elegir', 'h2'),
    block('Esculturas pequeñas', 'h3'),
    block('Funcionan en mesas auxiliares, escritorios, bibliotecas y repisas. Para que no se pierdan, colócalas sobre uno o dos libros decorativos o junto a un elemento más bajo. La base debe quedar completamente apoyada y lejos del borde.'),

    block('Esculturas medianas', 'h3'),
    block('Son adecuadas para consolas, aparadores y muebles de televisión. Pueden actuar como pieza principal sin cubrir el espejo, el cuadro o la pantalla que esté detrás. Si la escultura tiene una forma compleja, deja más espacio libre a sus lados.'),

    block('Esculturas de gran formato', 'h3'),
    block('Se usan en recibidores amplios, esquinas libres o junto a una ventana. Una escultura de piso necesita una base estable y una ubicación donde pueda observarse desde varios ángulos. Evita situarla detrás de una puerta o en una circulación estrecha.'),

    imageBlock(
      b4Img2._id,
      'Tres tamaños de esculturas decorativas: pequeña en mesa auxiliar, mediana en repisa y grande junto a ventana.',
      'La escala se entiende al comparar la pieza con su soporte, la altura disponible y el espacio de circulación que la rodea.'
    ),

    block('Dónde colocar esculturas decorativas', 'h2'),
    listItem('En la sala: sobre una consola, mesa lateral o pedestal cercano al punto focal.'),
    listItem('En el recibidor: junto a un espejo, una lámpara o un jarrón de menor altura.'),
    listItem('En la biblioteca: alternada con libros y espacios vacíos, sin ocupar todos los compartimentos.'),
    listItem('En la oficina: sobre un mueble auxiliar o una repisa que no interfiera con el trabajo.'),
    listItem('En el comedor: sobre un aparador, donde no compita con el centro de mesa.'),

    block('Cómo combinar esculturas con otros objetos', 'h2'),
    block('Para saber cómo decorar con esculturas dentro de una composición, trabaja con diferencias de altura. Una pieza vertical puede acompañarse con un jarrón bajo o una caja decorativa. Si todos los objetos tienen la misma altura, la superficie se verá plana; si todos son protagonistas, faltará jerarquía.'),

    imageBlock(
      b4Img3._id,
      'Composición sobre consola con escultura negra de formas orgánicas y jarrón cerámico bajo.',
      'Una escultura protagonista, un jarrón más bajo y materiales repetidos crean jerarquía sin competir por la atención.'
    ),

    block('Repite un color o un material que ya exista en el ambiente. Una escultura negra puede conectarse con una lámpara, un marco o una mesa del mismo tono. Una pieza marfil puede relacionarse con textiles claros o cerámica. La repetición debe ser puntual, no idéntica en todos los objetos.'),

    block('Cómo usar pares y conjuntos de esculturas', 'h2'),
    block('Los pares funcionan cuando las piezas comparten diseño, color o material. Pueden ubicarse juntas, con una diferencia leve de altura, o separarse en dos puntos del mismo mueble. En repisas, un par pequeño se entiende mejor si tiene un fondo despejado.'),
    block('Si el conjunto incluye tres piezas, evita alinearlas como una fila. Organízalas en un grupo compacto y deja que una quede un poco más adelante. Esta distribución permite ver cada silueta y crea profundidad.'),

    block('Iluminación para destacar una escultura', 'h2'),
    block('La luz lateral ayuda a mostrar relieves y texturas. Una lámpara de mesa, un aplique orientado o la luz natural indirecta pueden marcar el volumen sin producir reflejos intensos. En piezas brillantes, evita una fuente frontal muy cercana; en acabados mate, una luz suave suele revelar mejor la forma.'),

    block('Errores al decorar con esculturas', 'h2'),
    listItem('Elegir una pieza demasiado pequeña para un mueble largo y dejarla aislada.'),
    listItem('Ubicar varias esculturas de estilos distintos sin un color o material que las relacione.'),
    listItem('Cubrir la pieza con follajes, marcos u objetos colocados delante.'),
    listItem('Poner una escultura inestable cerca del borde o en una zona de paso.'),
    listItem('Repetir demasiados puntos focales en una misma superficie.'),

    imageBlock(
      b4Img4._id,
      'Ejemplo de una consola recargada y otra equilibrada con una escultura.',
      'Reducir los puntos focales y dejar espacio vacío ayuda a que la escultura se entienda y el conjunto conserve orden.'
    ),

    block('Preguntas frecuentes sobre cómo decorar con esculturas', 'h2'),
    block('¿Cuántas esculturas se pueden usar en una sala?', 'h3'),
    block('No existe una cantidad universal. Empieza con una pieza principal y revisa si el ambiente necesita otro punto de interés. Dos o tres esculturas pueden convivir si están distribuidas en superficies distintas y no compiten por atención.'),

    block('¿Una escultura debe combinar con el color del mueble?', 'h3'),
    block('No tiene que ser del mismo color. Puede contrastar, siempre que exista relación con otro elemento del ambiente. Sobre un mueble oscuro, una pieza clara gana visibilidad; sobre una consola neutra, una escultura negra crea un acento definido.'),

    block('¿Se pueden mezclar esculturas clásicas y contemporáneas?', 'h3'),
    block('Sí. La mezcla funciona mejor cuando se repite un acabado, una paleta o una proporción. Mantén una pieza como protagonista y usa la otra como apoyo para que el conjunto conserve orden.'),

    block('Encuentra la pieza adecuada para tu espacio', 'h2'),
    block('Ahora que sabes cómo decorar con esculturas, revisa primero las medidas del lugar y toma una fotografía frontal del mueble. Esto facilita comparar alturas y acabados antes de comprar. Explora la colección de esculturas y acentos decorativos de Anbar Home para seleccionar una pieza que responda a la escala real de tu ambiente.', 'normal', [
      { text: 'Ahora que sabes cómo decorar con esculturas, revisa primero las medidas del lugar y toma una fotografía frontal del mueble. Esto facilita comparar alturas y acabados antes de comprar. Explora la colección de ' },
      { text: 'esculturas', link: 'https://www.anbarhome.co/category/esculturas' },
      { text: ' y ' },
      { text: 'acentos decorativos', link: 'https://www.anbarhome.co/category/acentos-decorativos' },
      { text: ' de Anbar Home para seleccionar una pieza que responda a la escala real de tu ambiente.' }
    ])
  ]

  await client.createOrReplace({
    _id: 'post-como-decorar-con-esculturas',
    _type: 'post',
    title: 'Cómo decorar con esculturas según el tamaño y el espacio',
    seoTitle: 'Cómo decorar con esculturas | Anbar Home',
    metaDescription: 'Aprende cómo decorar con esculturas, elegir su tamaño y ubicarlas en salas, consolas, repisas y recibidores sin recargar el espacio.',
    slug: { _type: 'slug', current: 'como-decorar-con-esculturas' },
    publishedAt: '2026-08-24T10:00:00.000Z',
    author: authorRef,
    categories: [catEsculturas, catAcentos],
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: b4Img1._id },
      alt: 'Escultura de gran formato en una sala cálida sobre consola de madera.',
      caption: 'Una pieza escultórica de gran presencia puede convertirse en el punto focal cuando la escala del mueble y el espacio libre la acompañan.'
    },
    body: blog4Body
  })
  console.log('✓ Blog 4 Saved successfully')

  // -------------------------------------------------------------
  // BLOG 5: QUIET LUXURY EN INTERIORES CORPORATIVOS
  // -------------------------------------------------------------
  console.log('\n--- Processing Blog 5: Quiet Luxury Corporativo ---')
  const b5Path = 'public/blogs/Anbar_Blog5_entrega/webp'
  const b5Img1 = await uploadImage(path.join(b5Path, 'quiet-luxury-interiores-corporativos.webp'), 'quiet-luxury-interiores-corporativos.webp')
  const b5Img2 = await uploadImage(path.join(b5Path, 'materiales-lujo-silencioso-oficina.webp'), 'materiales-lujo-silencioso-oficina.webp')
  const b5Img3 = await uploadImage(path.join(b5Path, 'decoracion-recepcion-corporativa.webp'), 'decoracion-recepcion-corporativa.webp')
  const b5Img4 = await uploadImage(path.join(b5Path, 'quiet-luxury-hotel.webp'), 'quiet-luxury-hotel.webp')

  const blog5Body = [
    block('El diseño de oficinas de alta dirección, consultorías, firmas jurídicas y hoteles boutique ha experimentado un cambio profundo. Lejos de las exhibiciones opulentas o las recepciones sobrecargadas, los espacios contemporáneos buscan transmitir solidez, serenidad y sofisticación a través de decisiones comedidas: una paleta refinada, iluminación cálida por capas y piezas escultóricas seleccionadas con precisión, sin depender de logotipos repetidos ni superficies recargadas.'),

    imageBlock(
      b5Img1._id,
      'Quiet Luxury en interiores corporativos con escultura de acero negro, madera y piedra clara.',
      'Una pieza escultórica de gran presencia, madera cálida y piedra clara pueden construir una recepción sobria sin recargar el espacio.'
    ),

    block('Qué significa Quiet Luxury en interiores corporativos', 'h2'),
    block('En el ámbito corporativo y comercial, el lujo silencioso se define por la calidad intangible de la experiencia. La arquitectura no compite por deslumbrar, sino que crea un marco de serenidad que genera confianza inmediata en clientes y colaboradores.'),
    block('Este enfoque prioriza la acústica controlada, la fluidez de las circulaciones, la calidez táctil de los acabados y el uso de mobiliario ergonómico de líneas limpias. La decoración pasa de ser un adorno accesorio a convertirse en un lenguaje de prestigio discreto.'),

    block('Materiales y texturas para un entorno profesional sobrio', 'h2'),
    block('La materialidad es el pilar central del diseño corporativo de alta gama. La combinación de maderas nobles en tonos nogal o roble natural, superficies de piedra sinterizada o mármol mate, cueros de tono cognac y acentos metálicos en latón satinado o acero negro estructura una atmósfera acogedora y formal a la vez.'),
    block('Para proyectos comerciales y de hospitalidad, es fundamental seleccionar piezas con acabados de alta resistencia al tránsito y fácil mantenimiento. Las muestras físicas ayudan a revisar color, textura y reflejo antes de aprobar una compra amplia.'),

    imageBlock(
      b5Img2._id,
      'Materiales y texturas para una oficina elegante con cerámica, latón, madera y bandeja café.',
      'La combinación de cerámica, metal de brillo moderado, madera, superficie tipo cuero y textil neutro permite construir una paleta silenciosa y táctil.'
    ),

    block('Cómo decorar una recepción o un lobby corporativo', 'h2'),
    block('La recepción es el primer punto de contacto con la identidad de la empresa. Para lograr una primera impresión memorable, elija una única pieza focal de gran escala sobre el mostrador o una consola contigua: una escultura contemporánea o un jarrón de geometría pura.'),

    imageBlock(
      b5Img3._id,
      'Recepción corporativa con escultura dorada, jarrones cerámicos, consola de madera y luz cálida.',
      'Una pieza focal, dos alturas y una superficie de atención despejada comunican elegancia sin interferir con la operación de la recepción.'
    ),

    block('En una consola secundaria o mesa auxiliar del área de espera, trabaje con composiciones en tríada que combinen diferentes alturas: un libro monográfico de arquitectura, un recipiente bajo de cerámica y una lámpara con luz difusa. Mantenga libres las áreas operativas para garantizar agilidad y orden en la atención.'),

    block('Quiet Luxury en hoteles y espacios hospitality', 'h2'),
    block('En hoteles boutique, spas y restaurantes de autor, los huéspedes valoran la calidez residencial sobre la frialdad corporativa tradicional. Los lobbies se conciben como salas de estar amplias, donde las zonas de descanso invitan a la pausa y a la conversación.'),

    imageBlock(
      b5Img4._id,
      'Zona de espera de hotel con esculturas abstractas negras y circulación despejada.',
      'En un ambiente hospitality, la escala de las piezas, la estabilidad de sus bases y el recorrido libre deben resolverse al mismo tiempo.'
    ),

    block('Las composiciones pueden cambiar según la zona: piezas más imponentes y estables en accesos principales y detalles más íntimos en pasillos y suites. La integración de vegetación sutil, luz cálida indirecta y textiles nobles transforma cualquier estancia en una experiencia de bienestar duradero.'),

    block('Puntos clave para especificar decoración en proyectos B2B', 'h2'),
    listItem('Establecer una jerarquía visual: un solo punto protagonista por zona visual.'),
    listItem('Verificar la estabilidad y seguridad de las bases en áreas de alto tráfico.'),
    listItem('Controlar los reflejos: preferir acabados mate o satinados frente a brillos intensos.'),
    listItem('Garantizar una iluminación rasante o indirecta que valorice el relieve de cada pieza.'),
    listItem('Optar por piezas atemporales que preserven su vigencia estética en el tiempo.'),

    block('Eleva tus proyectos con la curaduría de Anbar Home', 'h2'),
    block('En Anbar Home colaboramos con estudios de arquitectura, interioristas y directores de proyectos para equipar espacios corporativos y hoteleros con piezas de alta presencia estética. Conoce nuestras colecciones de esculturas, jarrones escultóricos y piezas de la Línea Suprema para dar vida a proyectos con distinción y carácter propio.', 'normal', [
      { text: 'En Anbar Home colaboramos con estudios de arquitectura, interioristas y directores de proyectos para equipar espacios corporativos y hoteleros con piezas de alta presencia estética. Conoce nuestras colecciones de ' },
      { text: 'esculturas', link: 'https://www.anbarhome.co/category/esculturas' },
      { text: ', ' },
      { text: 'jarrones escultóricos', link: 'https://www.anbarhome.co/category/jarrones-escultoricos' },
      { text: ' y piezas de la ' },
      { text: 'Línea Suprema', link: 'https://www.anbarhome.co/category/linea-suprema' },
      { text: ' para dar vida a proyectos con distinción y carácter propio.' }
    ])
  ]

  await client.createOrReplace({
    _id: 'post-quiet-luxury-en-interiores-corporativos',
    _type: 'post',
    title: 'Quiet Luxury en interiores corporativos: elegancia y sobriedad para oficinas y hoteles',
    seoTitle: 'Quiet Luxury en interiores corporativos | Anbar Home',
    metaDescription: 'Conoce cómo aplicar el Quiet Luxury en interiores corporativos, hoteles y oficinas mediante materiales, iluminación y objetos bien seleccionados.',
    slug: { _type: 'slug', current: 'quiet-luxury-en-interiores-corporativos' },
    publishedAt: '2026-08-27T10:00:00.000Z',
    author: authorRef,
    categories: [catSuprema, catEsculturas],
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: b5Img1._id },
      alt: 'Quiet Luxury en interiores corporativos con escultura de acero negro, madera y piedra clara.',
      caption: 'Una pieza escultórica de gran presencia, madera cálida y piedra clara pueden construir una recepción sobria sin recargar el espacio.'
    },
    body: blog5Body
  })
  console.log('✓ Blog 5 Saved successfully')

  // -------------------------------------------------------------
  // BLOG 6: CÓMO DECORAR UNA SALA SIN RECARGARLA
  // -------------------------------------------------------------
  console.log('\n--- Processing Blog 6: Cómo decorar una sala sin recargarla ---')
  const b6Path = 'public/blogs/Anbar_Blog6_entrega/webp'
  const b6Img1 = await uploadImage(path.join(b6Path, 'como-decorar-una-sala-sin-recargarla.webp'), 'como-decorar-una-sala-sin-recargarla.webp')
  const b6Img2 = await uploadImage(path.join(b6Path, 'punto-focal-decoracion-sala.webp'), 'punto-focal-decoracion-sala.webp')
  const b6Img3 = await uploadImage(path.join(b6Path, 'objetos-para-mesa-de-centro.webp'), 'objetos-para-mesa-de-centro.webp')
  const b6Img4 = await uploadImage(path.join(b6Path, 'sala-recargada-vs-equilibrada.webp'), 'sala-recargada-vs-equilibrada.webp')

  const blog6Body = [
    block('Decorar una sala no consiste en llenar cada superficie disponible con adornos, sino en encontrar la armonía entre el espacio libre, la luz natural y los objetos con intención. Cuando todos los elementos compiten por llamar la atención, el ambiente se siente saturado; cuando existe jerarquía, la sala se siente ordenada.'),

    imageBlock(
      b6Img1._id,
      'Sala decorada con pocos objetos, mesa de centro de madera y tonos neutros.',
      'Concentrar los accesorios en una composición central permite que el sofá, la mesa y la luz natural mantengan una lectura ordenada.'
    ),

    block('Cómo decorar una sala a partir de un punto focal', 'h2'),
    block('El punto focal es el elemento principal hacia donde se dirige la mirada de forma natural al ingresar a la habitación. Puede ser un ventanal luminoso, una chimenea, un cuadro de gran formato o una consola con un espejo imponente y una pieza escultórica destacada.'),

    imageBlock(
      b6Img2._id,
      'Punto focal en una sala creado con espejo, consola, escultura y jarrón.',
      'Un espejo y una pieza escultórica pueden concentrar la atención cuando los objetos de apoyo mantienen una escala secundaria.'
    ),

    block('Si el muro principal tiene un cuadro grande o un espejo circular, elija una escultura o un jarrón alto en un extremo de la consola y complemente con un accesorio bajo en el opuesto. Evite colocar objetos idénticos simétricamente en ambos lados: la asimetría controlada aporta dinamismo visual y elegancia contemporánea.'),

    block('Cómo decorar la mesa de centro con equilibrio', 'h2'),
    block('La mesa de centro es el corazón funcional de la sala. Debe verse atractiva pero permanecer práctica para el uso diario de la familia y las visitas. La mejor estrategia es delimitar los objetos utilizando una bandeja decorativa redonda o rectangular.'),

    imageBlock(
      b6Img3._id,
      'Mesa de centro equilibrada con bandeja café, libro, recipiente bajo y jarrón pequeño.',
      'Una bandeja reúne los objetos y deja una zona libre para que la mesa de centro siga siendo práctica en el uso diario.'
    ),

    block('Combina una pieza alta, otra media y una baja: por ejemplo, un jarrón estilizado con flores o ramas secas, un libro de diseño sobre el cual apoyar una vela o recipiente bajo, y un detalle escultórico pequeño. Deje al menos el 50% de la superficie de la mesa completamente libre para apoyar tazas, copas o controles.'),

    block('La regla de los tercios y las alturas en decoración', 'h2'),
    block('El ojo humano busca naturalmente relaciones de escala y ritmo. Para evitar que una superficie se vea plana y monótona, agrupe los objetos en conjuntos de tres elementos con alturas escalonadas:'),
    listItem('Pieza protagonista: la más alta, que marca la verticalidad (jarrón o escultura).'),
    listItem('Pieza intermedia: que conecta las proporciones (candelabro, libro o recipiente).'),
    listItem('Pieza de apoyo: la más baja, que ancla la composición (bandeja, caja o accesorio bajo).'),

    block('Errores habituales al decorar una sala', 'h2'),
    listItem('Saturar cada mesa lateral, repisa y consola con recuerdos o figuras inconexas.'),
    listItem('Elegir alfombras demasiado pequeñas que hacen que la sala luzca comprimida.'),
    listItem('Usar una única fuente de luz fría cenital que aplana el volumen del espacio.'),
    listItem('Pegar todos los muebles contra la pared en lugar de crear una isla de conversación acogedora.'),
    listItem('Comprar accesorios sin medir previamente el ancho y alto del mueble soporte.'),

    imageBlock(
      b6Img4._id,
      'Comparación entre una sala recargada y una sala visualmente equilibrada.',
      'Retirar piezas secundarias permite que el punto focal respire y que la sala conserve espacio visual y físico.'
    ),

    block('Preguntas frecuentes sobre cómo decorar una sala', 'h2'),
    block('¿Qué colores ayudan a que una sala se sienta más amplia y luminosa?', 'h3'),
    block('Las bases en blanco roto, arena, marfil y beige cálido reflejan la luz y expanden visualmente el espacio. Introduzca contraste con acentos en tonos tierra, negro mate o latón dorado en piezas decorativas puntuales.'),

    block('¿Cómo decorar una sala pequeña sin abarrotarla?', 'h3'),
    block('Priorice muebles con patas vistas que dejen pasar la luz por debajo, utilice espejos para duplicar la profundidad visual y elija una o dos piezas decorativas de calidad en lugar de múltiples adornos pequeños dispersos.'),

    block('Crea una sala armónica y acogedora con Anbar Home', 'h2'),
    block('En Anbar Home te ayudamos a crear espacios que inspiran bienestar y distinción. Descubre nuestra curaduría exclusiva de jarrones, esculturas, candelabros y acentos decorativos para transformar tu sala en un ambiente equilibrado y lleno de personalidad.', 'normal', [
      { text: 'En Anbar Home te ayudamos a crear espacios que inspiran bienestar y distinción. Descubre nuestra curaduría exclusiva de ' },
      { text: 'jarrones', link: 'https://www.anbarhome.co/category/jarrones-escultoricos' },
      { text: ', ' },
      { text: 'esculturas', link: 'https://www.anbarhome.co/category/esculturas' },
      { text: ', ' },
      { text: 'candelabros', link: 'https://www.anbarhome.co/category/candelabros' },
      { text: ' y ' },
      { text: 'acentos decorativos', link: 'https://www.anbarhome.co/category/acentos-decorativos' },
      { text: ' para transformar tu sala en un ambiente equilibrado y lleno de personalidad.' }
    ])
  ]

  await client.createOrReplace({
    _id: 'post-como-decorar-una-sala-sin-recargarla',
    _type: 'post',
    title: 'Cómo decorar una sala sin recargarla: guía de equilibrio, proporción y color',
    seoTitle: 'Cómo decorar una sala sin recargarla | Anbar Home',
    metaDescription: 'Descubre cómo decorar una sala con proporción, color y objetos bien ubicados. Incluye ideas para mesas, consolas, paredes y espacios pequeños.',
    slug: { _type: 'slug', current: 'como-decorar-una-sala-sin-recargarla' },
    publishedAt: '2026-08-28T10:00:00.000Z',
    author: authorRef,
    categories: [catAcentos, catJarrones],
    mainImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: b6Img1._id },
      alt: 'Sala decorada con pocos objetos, mesa de centro de madera y tonos neutros.',
      caption: 'Concentrar los accesorios en una composición central permite que el sofá, la mesa y la luz natural mantengan una lectura ordenada.'
    },
    body: blog6Body
  })
  console.log('✓ Blog 6 Saved successfully')

  console.log('\n==========================================')
  console.log('ALL 6 BLOGS SUCCESSFULLY UPLOADED TO SANITY!')
  console.log('==========================================')
}

main().catch(err => {
  console.error('Fatal error during migration:', err)
  process.exit(1)
})
