const { createClient } = require('next-sanity');

const client = createClient({
  projectId: '7zsgx3as',
  dataset: 'production',
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const pages = [
  {
    _type: 'legalPage',
    title: 'Aviso de privacidad',
    slug: { current: 'aviso-de-privacidad' },
    content: `En cumplimiento de lo dispuesto en la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y demás normas que las modifiquen, adicionen o sustituyan, ANBAR S.A.S., informa a los titulares de los datos personales que sean recolectados y tratados por la compañía, las políticas aplicables al tratamiento de sus datos personales.

Responsable del Tratamiento de la Información
ANBAR S.A.S., identificada con NIT 901.838.382-4, con domicilio en la Calle 62 # 30-99, Bucaramanga, será la responsable del tratamiento de los datos personales.

Finalidad del Tratamiento
Los datos personales suministrados por los titulares serán recolectados, almacenados, usados, circulados y suprimidos para las siguientes finalidades:
- Gestión administrativa y contable
- Gestión de clientes y proveedores
- Atención de peticiones, quejas y reclamos
- Prospección comercial
- Envío de información comercial, promocional y publicitaria
- Campañas de fidelización y marketing
- Cumplimiento de obligaciones legales y contractuales

Derechos del Titular de la Información
El titular de los datos personales tiene derecho a:
- Conocer, actualizar y rectificar sus datos personales
- Solicitar prueba de la autorización otorgada
- Ser informado sobre el uso que se ha dado a sus datos
- Presentar quejas ante la Superintendencia de Industria y Comercio
- Revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías constitucionales y legales

Consulta de la Política de Tratamiento de Datos
La Política de Tratamiento de Datos Personales de ANBAR S.A.S., así como cualquier cambio sustancial en la misma, podrá ser solicitada o consultada a través del siguiente correo electrónico: anbarhomesas@gmail.com

Ejercicio de Derechos
Para ejercer sus derechos de acceso, corrección, actualización, supresión o revocatoria de la autorización, el titular podrá enviar una solicitud escrita al correo electrónico anbarhomesas@gmail.com, indicando en el asunto el derecho que desea ejercer, o mediante comunicación escrita enviada a la dirección Calle 62 # 30-99, Bucaramanga.`
  },
  {
    _type: 'legalPage',
    title: 'Políticas de tratamiento de datos',
    slug: { current: 'politicas-de-tratamiento-de-datos' },
    content: `En cumplimiento de lo dispuesto en el artículo 15 de la Constitución Política de Colombia, la Ley 1581 de 2012, el Decreto 1377 de 2013, el Decreto 1074 de 2015 y demás normas que regulen la protección de datos personales, ANBAR S.A.S. adopta la presente Política de Tratamiento de Datos Personales.

IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO
- Razón social: ANBAR S.A.S.
- NIT: 901.838.382-4
- Domicilio: Bucaramanga, Colombia
- Dirección: Calle 62 #30-99
- Correo electrónico: anbarhomesas@gmail.com

ANBAR S.A.S. será el responsable del tratamiento de los datos personales recolectados a través de sus tiendas físicas, página web, redes sociales, canales digitales, formularios, contratos y demás medios utilizados en el desarrollo de su actividad comercial.

MARCO LEGAL
La presente política se rige por las siguientes disposiciones legales:
- Constitución Política de Colombia – Artículo 15
- Ley Estatutaria 1581 de 2012
- Decreto 1377 de 2013
- Decreto 1074 de 2015
- Circulares, guías y lineamientos de la Superintendencia de Industria y Comercio (SIC)

DEFINICIONES
Para efectos de esta política se aplicarán las definiciones establecidas en la Ley 1581 de 2012, entre ellas:
- Dato personal: Información vinculada o que pueda asociarse a una persona natural.
- Titular: Persona natural cuyos datos personales sean objeto de tratamiento.
- Tratamiento: Cualquier operación sobre datos personales, como recolección, almacenamiento, uso, circulación o supresión.
- Responsable del Tratamiento: Persona jurídica que decide sobre el tratamiento de los datos personales.

PRINCIPIOS APLICABLES AL TRATAMIENTO DE DATOS
ANBAR S.A.S. garantiza que el tratamiento de los datos personales se realizará conforme a los principios de legalidad, finalidad, libertad, veracidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.

DATOS PERSONALES OBJETO DE TRATAMIENTO
ANBAR S.A.S. podrá recolectar y tratar, entre otros, los siguientes datos personales:
- Nombre y apellidos
- Documento de identificación
- Dirección física y electrónica
- Número telefónico
- Información comercial necesaria para la venta de productos y prestación de servicios

FINALIDADES DEL TRATAMIENTO
Los datos personales serán tratados para las siguientes finalidades:
- Gestión administrativa y comercial
- Gestión de clientes, proveedores y aliados
- Atención de solicitudes, consultas, quejas y reclamos
- Envío de información comercial, promocional y publicitaria
- Campañas de fidelización y marketing
- Facturación, pagos y cumplimiento de obligaciones contractuales
- Cumplimiento de obligaciones legales y requerimientos de autoridades competentes

DATOS SENSIBLES Y DATOS DE MENORES DE EDAD
ANBAR S.A.S. no recolecta ni trata datos sensibles ni datos personales de menores de edad. En caso excepcional de requerirse, se solicitará autorización expresa conforme a la normatividad vigente.

DERECHOS DEL TITULAR DE LA INFORMACIÓN
El titular de los datos personales tiene derecho a:
- Conocer, actualizar y rectificar sus datos personales
- Solicitar prueba de la autorización otorgada
- Ser informado sobre el uso dado a sus datos
- Revocar la autorización y/o solicitar la supresión de los datos
- Acceder de forma gratuita a sus datos personales
- Presentar quejas ante la Superintendencia de Industria y Comercio (SIC)

AUTORIZACIÓN Y ACEPTACIÓN DE LA POLÍTICA
La recolección y tratamiento de los datos personales se realizará con la autorización previa, expresa e informada del titular.
Los clientes que realicen compras en las tiendas físicas de ANBAR S.A.S., así como aquellos que adquieran productos o servicios a través de la página web, redes sociales u otros canales digitales, declaran conocer y aceptar la presente Política de Tratamiento de Datos Personales.
En consecuencia, autorizan a ANBAR S.A.S. para recolectar, almacenar, usar, circular y suprimir sus datos personales conforme a las finalidades aquí descritas, de acuerdo con la Ley 1581 de 2012 y demás normas concordantes.

PROCEDIMIENTO PARA CONSULTAS Y RECLAMOS
El titular podrá ejercer sus derechos mediante solicitud escrita enviada al correo electrónico anbarhomesas@gmail.com, indicando:
- Nombre completo del titular
- Descripción clara de la consulta o reclamo
- Derecho que desea ejercer

Términos de respuesta:
- Consultas: máximo 10 días hábiles
- Reclamos: máximo 15 días hábiles

MEDIDAS DE SEGURIDAD
ANBAR S.A.S. adopta medidas técnicas, humanas y administrativas razonables para proteger los datos personales y evitar su pérdida, acceso no autorizado, uso indebido o divulgación.

VIGENCIA
La presente Política de Tratamiento de Datos Personales rige a partir de su publicación en la página web de ANBAR S.A.S. y permanecerá vigente mientras se desarrollen actividades que impliquen el tratamiento de datos personales.`
  },
  {
    _type: 'legalPage',
    title: 'Política integral de retractos, cambios, devoluciones y garantía',
    slug: { current: 'politicas-de-retractos-y-garantias' },
    content: `IDENTIFICACIÓN DEL RESPONSABLE
- Razón social: ANBAR S.A.S.
- NIT: 901.838.382-4
- Dirección: Calle 62 #30-99, Bucaramanga, Colombia
- Correo de contacto: anbarhomesas@gmail.com

ALCANCE
Esta política aplica a:
- Compras realizadas en tiendas físicas
- Compras realizadas a través de página web, redes sociales o canales no presenciales

Incluye:
- Derecho de retracto (ventas online/no presenciales)
- Garantía legal por defectos
- Cambios voluntarios en tienda física, cuando el producto se encuentre en condiciones aptas

DERECHO DE RETRACTO
- Aplica solo a ventas no presenciales (online, redes sociales, teléfono, catálogos).
- Plazo: 5 días hábiles desde la recepción del producto por el cliente.
- Condiciones del producto: Debe estar en perfecto estado, sin uso ni daños. Empaque original, etiquetas y accesorios completos.
- Excepciones: productos personalizados, adaptados o frágiles según su naturaleza.
- Costos de transporte: a cargo del cliente, salvo que ANBAR S.A.S. indique lo contrario.
- Devolución del dinero: mismo medio de pago, máximo 30 días calendario desde recepción del producto devuelto.
- Procedimiento: enviar solicitud a anbarhomesas@gmail.com, indicando: Nombre completo, Número de pedido/factura, Motivo del retracto, Medio de contacto.
- ANBAR S.A.S. responderá en un plazo máximo de 10 días hábiles confirmando la recepción y los pasos a seguir.

CAMBIOS VOLUNTARIOS EN TIENDA FÍSICA
- Plazo: 5 días hábiles desde la compra
- Estado del producto: original, sin uso, armado ni daños, embalaje intacto
- Productos frágiles deben entregarse con embalaje seguro
- Disponibilidad: sujeta a existencia de productos y confirmación de la tienda
- Opciones del cliente: Cambio por otro producto disponible, Bono de tienda. No se hace devolución de dinero.
- Costos de traslado: a cargo del cliente, salvo que la empresa indique lo contrario
- Procedimiento: presentar producto y factura, o coordinar por correo electrónico si aplica

GARANTÍA LEGAL POR DEFECTOS
- Aplica a todas las compras, físicas y no presenciales
- Productos defectuosos por fabricación, no por uso serán: Reparados en caso de no contar con mas existencias o Cambiados.
- Plazo máximo: 30 días calendario desde reporte
- Excepciones: productos personalizados o por apariencia estética, Productos entregados en buen estado, Daños por mala manipulación.
- Procedimiento: enviar evidencia (foto o video) al correo anbarhomesas@gmail.com
- ANBAR S.A.S. responderá en 10 días hábiles y coordinará la solución

CONDICIONES GENERALES
- Productos no armados/instalados
- Empaque original y accesorios completos
- Productos devueltos deben pasar inspección de recepción y estado
- Evidencia interna: fotos, fechas de recepción, reportes de estado

PLAZOS DE RESPUESTA
- Derecho de retracto: 10 días hábiles para confirmar recepción y pasos
- Cambios voluntarios: 10 días hábiles para coordinar disponibilidad
- Garantía legal: 10 días hábiles para aceptar o rechazar solicitud

PROCEDIMIENTO DE DEVOLUCIÓN O CAMBIO
- Contactar a anbarhomesas@gmail.com (correo principal) o teléfono de atención
- Indicar: Nombre completo, Número de pedido/factura, Motivo de la solicitud, Medio de contacto, Evidencia fotográfica si aplica (para defectos o daños)
- Coordinar entrega del producto según canal de compra
- ANBAR S.A.S. evaluará estado del producto y procederá según política (reintegro, cambio, reparación)

ACEPTACIÓN DE LA POLÍTICA
- Todas las compras, online o en tienda física, implican aceptación de esta política
- Política disponible en web, redes sociales y mostrador físico
- Recomendación SIC: conservar comprobante de aceptación o factura de compra

VIGENCIA
- Vigente desde publicación en la página web de ANBAR S.A.S.
- Aplicable mientras se mantengan operaciones de venta de productos de decoración`
  }
];

const faqs = [
  { _type: 'faq', question: '¿Dónde están ubicados?', answer: 'Contamos con tiendas en Bogotá y Bucaramanga, y también puedes comprar todos nuestros productos a través de nuestra tienda online.' },
  { _type: 'faq', question: '¿Los productos son nacionales o importados?', answer: 'Nuestra curaduría incluye piezas de lujo importadas desde países reconocidos por su excelencia en diseño, así como productos nacionales de alta gama.' },
  { _type: 'faq', question: '¿Puedo comprar desde cualquier ciudad de Colombia?', answer: 'Sí. Hacemos envíos a todo el país con transportadoras confiables, y el tiempo de entrega varía según tu ciudad.' },
  { _type: 'faq', question: '¿Tienen showroom físico o solo venden online?', answer: 'Tenemos tiendas físicas en Bogotá y Bucaramanga, y también una plataforma de e-commerce disponible 24/7.' },
  { _type: 'faq', question: '¿Qué métodos de pago aceptan?', answer: 'Aceptamos tarjetas de crédito, débito y transferencias bancarias a través de plataformas seguras.' },
  { _type: 'faq', question: '¿Qué hace especial su colección navideña?', answer: 'Nuestra colección navideña se distingue por su elegancia, detalles refinados y piezas exclusivas que elevan cualquier ambiente.' },
  { _type: 'faq', question: '¿Puedo hacer pedidos personalizados o por encargo?', answer: 'Sí, ofrecemos atención personalizada para ayudarte a encontrar o encargar piezas que se ajusten a tu estilo.' }
];

async function migrate() {
  for (const page of pages) {
    await client.createOrReplace({
      ...page,
      _id: `legalPage-${page.slug.current}`
    });
    console.log('Created legal page:', page.title);
  }
  
  // Clear old faqs to avoid duplicates
  await client.delete({query: '*[_type == "faq"]'});
  
  for (const faq of faqs) {
    await client.create(faq);
    console.log('Created FAQ:', faq.question);
  }
}

migrate().catch(console.error);
