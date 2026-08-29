import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'
import { client } from '@/sanity/lib/client'
import { Building2, Mail, Phone, MapPin, Globe, ShieldCheck, Clock, FileText, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Política de Tratamiento y Protección de Datos Personales | Anbar Home',
  description: 'Conoce la Política de Tratamiento y Protección de Datos Personales de ANBAR S.A.S. (ANBAR HOME) conforme a la Ley Estatutaria 1581 de 2012 y normatividad vigente en Colombia.',
}

export default async function PoliticasDatosPage() {
  const pageData = await client
    .fetch(`*[_type == "legalPage" && (slug.current == "politica-de-tratamiento-de-datos" || slug.current == "politicas-de-tratamiento-de-datos")][0]`)
    .catch(() => null)

  return (
    <LegalLayout 
      title="Política de Tratamiento y Protección de Datos Personales" 
      breadcrumb="Tratamiento de Datos"
    >
      {pageData?.content ? (
        <div className="whitespace-pre-line text-base font-light leading-relaxed text-neutral-700">
          {pageData.content}
        </div>
      ) : (
        <div className="space-y-10 text-neutral-700 leading-relaxed font-light">
          {/* Header Card / Meta info */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-6 md:p-8 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 pb-4">
              <div>
                <span className="inline-block px-3 py-1 bg-camel/10 text-camel-dark rounded-full text-xs font-medium tracking-wide uppercase">
                  Documento Oficial
                </span>
                <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 mt-2">
                  ANBAR S.A.S. – ANBAR HOME
                </h2>
                <p className="text-sm text-neutral-600 font-normal">NIT: 901.838.382-4</p>
              </div>
              <div className="text-xs text-neutral-500 space-y-1">
                <p><span className="font-semibold text-neutral-700">Versión:</span> 1.0</p>
                <p><span className="font-semibold text-neutral-700">Entrada en vigencia:</span> 26 de agosto de 2026</p>
                <p><span className="font-semibold text-neutral-700">Última actualización:</span> 26 de agosto de 2026</p>
              </div>
            </div>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed">
              En cumplimiento del artículo 15 de la Constitución Política de Colombia, la Ley Estatutaria 1581 de 2012 y sus normas reglamentarias, ANBAR S.A.S. adopta la presente Política de Tratamiento y Protección de Datos Personales.
            </p>
          </div>

          {/* 1. Identificación del Responsable */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              1. Identificación del Responsable del Tratamiento
            </h2>
            <p>
              ANBAR S.A.S., sociedad comercial que opera bajo la marca <strong>ANBAR HOME</strong>, en cumplimiento del artículo 15 de la Constitución Política de Colombia, la Ley Estatutaria 1581 de 2012 y sus normas reglamentarias, adopta la presente Política de Tratamiento y Protección de Datos Personales.
            </p>
            <p>
              Para efectos de esta política, ANBAR S.A.S. es el <strong>Responsable del Tratamiento</strong> de los datos personales respecto de los cuales determine las finalidades y medios de recolección, almacenamiento, uso, circulación, consulta, actualización, transmisión, transferencia o supresión.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-neutral-200 rounded-lg p-5 not-prose my-4">
              <div className="flex items-start gap-3">
                <Building2 className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block uppercase font-medium">Razón Social y Comercial</span>
                  <span className="text-sm font-medium text-neutral-900">ANBAR S.A.S. (ANBAR HOME)</span>
                  <span className="text-xs text-neutral-600 block">NIT: 901.838.382-4</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block uppercase font-medium">Domicilio y Dirección Principal</span>
                  <span className="text-sm font-medium text-neutral-900">Calle 62 #30-99, Bucaramanga</span>
                  <span className="text-xs text-neutral-600 block">Santander, Colombia</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block uppercase font-medium">Correo para Protección de Datos</span>
                  <a href="mailto:anbarhomesas@gmail.com" className="text-sm font-medium text-camel-dark hover:underline">
                    anbarhomesas@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block uppercase font-medium">Teléfono / WhatsApp</span>
                  <a href="https://wa.me/573123087918" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-camel-dark hover:underline">
                    +57 312 308 7918
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3 md:col-span-2 border-t border-neutral-100 pt-3">
                <Globe className="w-5 h-5 text-camel shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-neutral-500 block uppercase font-medium">Sitio Web</span>
                  <a href="https://anbarhome.co/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-camel-dark hover:underline">
                    https://anbarhome.co/
                  </a>
                </div>
              </div>
            </div>

            <p className="text-sm text-neutral-600 bg-neutral-50 p-4 rounded-lg border-l-4 border-camel">
              El correo <strong>anbarhomesas@gmail.com</strong> constituye el canal institucional centralizado de ANBAR S.A.S. para consultas, reclamos, actualizaciones, rectificaciones, solicitudes de supresión, revocatorias de autorización y demás asuntos relacionados con protección de datos personales.
            </p>
          </section>

          {/* 2. Tiendas físicas */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              2. Tiendas Físicas y Canales de Contacto
            </h2>
            <p>
              ANBAR S.A.S. desarrolla actividades comerciales a través de las siguientes sedes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
              <div className="p-4 bg-white border border-neutral-200 rounded-lg">
                <h3 className="font-semibold text-neutral-900 text-sm mb-1">Bogotá</h3>
                <p className="text-xs text-neutral-600 mb-2">Calle 109 #18B-52, Local 101, Bogotá D.C.</p>
                <p className="text-xs text-neutral-500">Correo: anbarhomesas@gmail.com</p>
                <p className="text-xs text-neutral-500">WhatsApp: +57 312 308 7918</p>
              </div>
              <div className="p-4 bg-white border border-neutral-200 rounded-lg">
                <h3 className="font-semibold text-neutral-900 text-sm mb-1">Bucaramanga – Conucos (Domicilio Principal)</h3>
                <p className="text-xs text-neutral-600 mb-2">Calle 62 #30-99, Bucaramanga, Santander.</p>
                <p className="text-xs text-neutral-500">Correo: anbarhomesas@gmail.com</p>
                <p className="text-xs text-neutral-500">WhatsApp: +57 312 308 7918</p>
              </div>
              <div className="p-4 bg-white border border-neutral-200 rounded-lg">
                <h3 className="font-semibold text-neutral-900 text-sm mb-1">Bucaramanga – Cabecera del Llano</h3>
                <p className="text-xs text-neutral-600 mb-2">Carrera 36 #48-141, Local 5, Bucaramanga, Santander.</p>
                <p className="text-xs text-neutral-500">Correo: anbarhomesas@gmail.com</p>
                <p className="text-xs text-neutral-500">WhatsApp: +57 312 308 7918</p>
              </div>
              <div className="p-4 bg-white border border-neutral-200 rounded-lg">
                <h3 className="font-semibold text-neutral-900 text-sm mb-1">Barranquilla</h3>
                <p className="text-xs text-neutral-600 mb-2">Carrera 51B #79-285, Norte-Centro Histórico, Barranquilla, Atlántico.</p>
                <p className="text-xs text-neutral-500">Correo: anbarhomesas@gmail.com</p>
                <p className="text-xs text-neutral-500">WhatsApp: +57 312 308 7918</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600">
              La gestión de protección de datos personales se realizará de manera centralizada por ANBAR S.A.S., independientemente de la sede en la que los datos hayan sido recolectados.
            </p>
          </section>

          {/* 3. Marco normativo */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              3. Marco Normativo
            </h2>
            <p>La presente política se adopta principalmente con fundamento en:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
              <li>El artículo 15 de la Constitución Política de Colombia, que reconoce los derechos a la intimidad, al buen nombre y al Hábeas Data.</li>
              <li>El artículo 20 de la Constitución Política de Colombia.</li>
              <li>La Ley Estatutaria 1581 de 2012.</li>
              <li>El Decreto 1377 de 2013, cuyas disposiciones aplicables fueron incorporadas al Decreto 1074 de 2015.</li>
              <li>El Decreto Único Reglamentario 1074 de 2015 y sus modificaciones.</li>
              <li>El Decreto 90 de 2018, en lo relativo al Registro Nacional de Bases de Datos.</li>
              <li>El Decreto 255 de 2022, cuando resulte aplicable a transferencias internacionales y normas corporativas vinculantes.</li>
              <li>La Ley 1266 de 2008 y sus modificaciones, exclusivamente cuando resulte aplicable el régimen especial de información financiera, crediticia, comercial o de servicios.</li>
              <li>La Ley 2157 de 2021, cuando resulte aplicable.</li>
              <li>La Ley 2300 de 2023, respecto de los canales, horarios y condiciones aplicables a determinados contactos comerciales, publicitarios y de cobranza.</li>
              <li>Las instrucciones, circulares y disposiciones emitidas por la Superintendencia de Industria y Comercio en su condición de Autoridad Nacional de Protección de Datos Personales.</li>
              <li>Las demás normas que modifiquen, adicionen, sustituyan o reglamenten las anteriores.</li>
            </ul>
          </section>

          {/* 4. Objeto de la política */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              4. Objeto de la Política
            </h2>
            <p>Esta política tiene como finalidad informar de manera clara a los titulares sobre:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
              <li>Qué información personal puede recolectar ANBAR S.A.S.</li>
              <li>Para qué será utilizada.</li>
              <li>Qué operaciones podrán realizarse sobre los datos.</li>
              <li>Con quiénes podrán compartirse cuando resulte necesario.</li>
              <li>Cuáles son los derechos de los titulares.</li>
              <li>Cómo pueden ejercer dichos derechos.</li>
              <li>Cuáles son las responsabilidades de ANBAR S.A.S.</li>
              <li>Qué medidas generales se adoptan para proteger la información.</li>
              <li>Durante cuánto tiempo podrá conservarse.</li>
              <li>Cuáles son los canales para presentar consultas o reclamos.</li>
            </ul>
          </section>

          {/* 5. Ámbito de aplicación */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              5. Ámbito de Aplicación
            </h2>
            <p>
              Esta política aplica a todas las bases de datos y archivos que contengan información de personas naturales respecto de los cuales ANBAR S.A.S. actúe como Responsable o, cuando corresponda, Encargado del Tratamiento.
            </p>
            <p>
              Comprende datos recolectados por medios físicos, electrónicos, digitales, telefónicos o presenciales, incluyendo: tiendas físicas, sitio web, tienda virtual, checkout o proceso de compra, formularios web y físicos, WhatsApp, correo electrónico, llamadas telefónicas, redes sociales, mensajes directos, campañas publicitarias, eventos, cotizaciones, facturación, servicio al cliente, servicio posventa, concursos y promociones, sistemas CRM, sistemas de videovigilancia, plataformas de comercio electrónico, herramientas de analítica, plataformas de publicidad digital, procesos laborales y de contratación, y relaciones con proveedores, contratistas y aliados.
            </p>
          </section>

          {/* 6. Definiciones */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              6. Definiciones
            </h2>
            <p>Para esta política se utilizarán las definiciones previstas en la Ley 1581 de 2012 y sus normas reglamentarias:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Autorización:</strong> Consentimiento previo, expreso e informado otorgado por el Titular para el Tratamiento de sus datos personales.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Base de datos:</strong> Conjunto organizado de datos personales objeto de Tratamiento.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Dato personal:</strong> Cualquier información vinculada o que pueda asociarse a una persona natural determinada o determinable.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Dato público:</strong> Información que no tiene naturaleza privada, semiprivada o sensible y cuya consulta puede realizarse dentro de los límites legales.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Dato privado:</strong> Información que por su naturaleza íntima o reservada interesa únicamente a su Titular.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Dato semiprivado:</strong> Información que no tiene carácter íntimo, reservado ni público y cuyo conocimiento puede interesar al Titular y a determinadas personas o sectores.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Dato sensible:</strong> Información que afecta la intimidad del Titular o cuyo uso indebido puede generar discriminación.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Titular:</strong> Persona natural cuyos datos personales son objeto de Tratamiento.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Responsable del Tratamiento:</strong> Persona natural o jurídica que decide sobre la base de datos o el Tratamiento.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Encargado del Tratamiento:</strong> Persona natural o jurídica que realiza Tratamiento por cuenta del Responsable.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Tratamiento:</strong> Cualquier operación realizada sobre datos personales, incluyendo recolección, almacenamiento, uso, consulta, circulación, actualización, transmisión, transferencia o supresión.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Transferencia:</strong> Envío de información personal a otro Responsable del Tratamiento ubicado dentro o fuera de Colombia.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Transmisión:</strong> Comunicación de datos personales a un Encargado para que los trate por cuenta del Responsable.
              </div>
              <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
                <strong>Aviso de privacidad:</strong> Comunicación mediante la cual se informa al Titular sobre la existencia de esta política y la forma de consultarla.
              </div>
            </div>
          </section>

          {/* 7. Principios aplicables */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              7. Principios Aplicables
            </h2>
            <p>ANBAR S.A.S. aplicará los siguientes principios en el tratamiento de datos:</p>
            <div className="space-y-2 text-sm md:text-base">
              <p><strong>Legalidad:</strong> El Tratamiento es una actividad reglada y deberá sujetarse a la Constitución y a la legislación aplicable.</p>
              <p><strong>Finalidad:</strong> Todo Tratamiento deberá obedecer a una finalidad legítima que haya sido informada al Titular.</p>
              <p><strong>Libertad:</strong> Salvo las excepciones legales, los datos personales solo serán tratados con autorización previa, expresa e informada. El silencio del Titular no constituye autorización.</p>
              <p><strong>Veracidad o calidad:</strong> La información tratada deberá ser veraz, completa, exacta, actualizada, comprobable y comprensible.</p>
              <p><strong>Transparencia:</strong> El Titular podrá obtener información acerca de la existencia y utilización de sus datos.</p>
              <p><strong>Acceso y circulación restringida:</strong> Los datos solo podrán ser tratados por personas autorizadas o por quienes la legislación permita.</p>
              <p><strong>Seguridad:</strong> ANBAR S.A.S. implementará medidas razonables destinadas a evitar adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.</p>
              <p><strong>Confidencialidad:</strong> Las personas que tengan acceso a datos personales deberán conservar su confidencialidad incluso después de terminar su relación con ANBAR S.A.S.</p>
              <p><strong>Necesidad y proporcionalidad:</strong> ANBAR S.A.S. procurará recolectar únicamente los datos razonablemente necesarios para las finalidades informadas.</p>
              <p><strong>Temporalidad:</strong> Los datos no serán conservados indefinidamente sin una finalidad o fundamento que justifique su Tratamiento.</p>
            </div>
          </section>

          {/* 8. Titulares de la información */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              8. Titulares de la Información
            </h2>
            <p>ANBAR S.A.S. puede tratar información correspondiente a:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 list-none p-0 text-sm">
              {[
                'Clientes', 'Compradores', 'Consumidores', 'Usuarios del sitio web',
                'Personas interesadas en productos', 'Prospectos', 'Suscriptores',
                'Personas que contacten por WhatsApp', 'Seguidores en redes sociales',
                'Destinatarios de pedidos', 'Proveedores', 'Contratistas',
                'Representantes de proveedores', 'Aliados comerciales', 'Trabajadores',
                'Extrabajadores', 'Candidatos a procesos de selección', 'Visitantes',
                'Representantes legales', 'Personas vinculadas a relaciones contractuales'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 bg-neutral-50 px-3 py-2 rounded border border-neutral-200">
                  <CheckCircle2 className="w-4 h-4 text-camel shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 9. Categorías de datos tratados */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              9. Categorías de Datos Tratados
            </h2>
            <p>Según la relación con el Titular, ANBAR S.A.S. podrá recolectar las siguientes categorías:</p>
            
            <div className="space-y-4 text-sm md:text-base">
              <div>
                <h3 className="font-semibold text-neutral-900 text-base mb-1">9.1. Identificación</h3>
                <p>Nombre, Apellidos, Tipo de documento, Número de documento, Firma cuando resulte necesaria, e información necesaria para individualizar al Titular.</p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 text-base mb-1">9.2. Contacto</h3>
                <p>Teléfono, Número de WhatsApp, Correo electrónico, Dirección, Ciudad, Departamento y País.</p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 text-base mb-1">9.3. Información comercial y transaccional</h3>
                <p>Productos adquiridos, Pedidos, Cotizaciones, Historial comercial, Cambios, Devoluciones, Garantías, Solicitudes, Preferencias expresamente comunicadas, Interacciones con asesores y Estado de pedidos.</p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 text-base mb-1">9.4. Facturación y entrega</h3>
                <p>Nombre o razón social cuando corresponda, Documento o NIT, Dirección de facturación, Dirección de entrega, Datos tributarios exigidos legalmente, Identificación o datos de contacto del destinatario cuando sea diferente del comprador.</p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 text-base mb-1">9.5. Información relativa a pagos</h3>
                <p>Medio de pago seleccionado, Estado de la transacción, Valor, Número o referencia de la operación, Confirmación o rechazo de la transacción.</p>
                <p className="text-xs text-neutral-500 mt-1">
                  * Los datos financieros sensibles necesarios para procesar pagos son recolectados directamente por las entidades financieras o pasarelas de pago correspondientes. ANBAR S.A.S. no solicita ni almacena información financiera que no resulte estrictamente necesaria.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 text-base mb-1">9.6. Información tecnológica</h3>
                <p>Dirección IP, Tipo de navegador, Tipo de dispositivo, Identificadores electrónicos, Datos de navegación, Información recolectada mediante cookies, Interacciones con el sitio web, Fecha y hora de acceso, Productos o categorías consultadas.</p>
              </div>

              <div>
                <h3 className="font-semibold text-neutral-900 text-base mb-1">9.7. Imágenes y contenido audiovisual</h3>
                <p>Fotografías, Videos, Imágenes de cámaras de seguridad y Grabaciones de comunicaciones debidamente informadas.</p>
              </div>
            </div>
          </section>

          {/* 10. Finalidades generales */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              10. Finalidades Generales del Tratamiento
            </h2>
            <p>
              ANBAR S.A.S. tratará información exclusivamente para finalidades legítimas, determinadas e informadas, respetando los derechos de los titulares.
            </p>
          </section>

          {/* 11. Clientes y consumidores */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              11. Clientes y Consumidores
            </h2>
            <p>Los datos podrán utilizarse para:</p>
            <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
              <li>Identificar al cliente, gestionar compras, registrar pedidos, elaborar cotizaciones y procesar órdenes.</li>
              <li>Emitir facturas y confirmar pagos.</li>
              <li>Preparar productos, coordinar despachos y gestionar envíos.</li>
              <li>Compartir con transportadores exclusivamente los datos necesarios para entregar productos.</li>
              <li>Informar sobre el estado de un pedido.</li>
              <li>Atender cambios, devoluciones, garantías y gestionar retractos cuando procedan.</li>
              <li>Atender peticiones, quejas y reclamos (PQR).</li>
              <li>Contactar al cliente respecto de una compra y verificar información necesaria para prevenir fraude o suplantación.</li>
              <li>Gestionar cartera cuando resulte aplicable.</li>
              <li>Dar cumplimiento a obligaciones tributarias, comerciales, contables y legales.</li>
              <li>Mantener información necesaria para acreditar una relación comercial y atender requerimientos de autoridades competentes.</li>
              <li>Realizar análisis internos y estadísticos con datos anonimizados o agregados.</li>
            </ul>
          </section>

          {/* 12. Prospectos e interesados */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              12. Prospectos e Interesados
            </h2>
            <p>
              ANBAR S.A.S. podrá utilizar datos proporcionados voluntariamente por una persona para: responder solicitudes, dar información sobre productos, elaborar cotizaciones, brindar asesoría, atender conversaciones iniciadas por el Titular y dar seguimiento razonable a una solicitud comercial.
            </p>
            <p className="text-sm bg-neutral-50 p-3 rounded border-l-2 border-neutral-400">
              <em>Nota: El hecho de solicitar información sobre un producto no implica, por sí mismo, autorización ilimitada para enviar publicidad futura.</em>
            </p>
          </section>

          {/* 13. Mercadeo, publicidad y fidelización */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              13. Mercadeo, Publicidad y Fidelización
            </h2>
            <p>
              Cuando exista autorización o la legislación permita el Tratamiento, ANBAR S.A.S. podrá utilizar los datos para comunicar novedades, colecciones, promociones, descuentos, invitaciones, programas de fidelización, newsletters, encuestas, remarketing y comunicaciones personalizadas.
            </p>
            <p>
              Estos contactos podrán realizarse mediante correo electrónico, SMS, WhatsApp, aplicaciones de mensajería, llamadas telefónicas u otros canales previamente autorizados.
            </p>

            <div className="bg-amber-50/60 border border-amber-200/80 rounded-lg p-4 space-y-2 text-sm text-neutral-800">
              <h3 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                Reglas para Comunicaciones Comerciales (Ley 2300 de 2023)
              </h3>
              <p>• La aceptación de publicidad no es requisito para comprar en ANBAR HOME.</p>
              <p>• El Titular podrá revocar su autorización en cualquier momento mediante los enlaces en los mensajes o escribiendo a <strong>anbarhomesas@gmail.com</strong>.</p>
              <p>• <strong>Horarios autorizados de contacto:</strong></p>
              <ul className="list-disc pl-5 font-normal">
                <li>Lunes a viernes: 7:00 a. m. a 7:00 p. m.</li>
                <li>Sábados: 8:00 a. m. a 3:00 p. m.</li>
                <li>Domingos y festivos: No se realizarán comunicaciones comerciales, salvo excepciones de ley.</li>
              </ul>
            </div>
          </section>

          {/* 14. Tienda virtual y comercio electrónico */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              14. Tienda Virtual y Comercio Electrónico
            </h2>
            <p>
              Los datos recolectados en <a href="https://anbarhome.co/" target="_blank" rel="noopener noreferrer" className="text-camel-dark font-medium underline">https://anbarhome.co/</a> podrán tratarse para gestionar cuentas de usuario, procesar órdenes, gestionar el carrito de compras, validar información de entrega, tramitar pagos seguros mediante pasarelas autorizadas, detectar operaciones irregulares, enviar confirmaciones transaccionales, emitir facturas, coordinar envíos y atender solicitudes de posventa.
            </p>
          </section>

          {/* 15. Proveedores, contratistas y aliados */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              15. Proveedores, Contratistas y Aliados
            </h2>
            <p>
              Los datos correspondientes a personas naturales vinculadas a proveedores, contratistas o aliados podrán tratarse para evaluar propuestas, gestionar relaciones contractuales, elaborar contratos, procesar pagos, gestionar facturación, administrar proveedores, realizar auditorías y dar cumplimiento a deberes legales.
            </p>
          </section>

          {/* 16. Trabajadores, extrabajadores y candidatos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              16. Trabajadores, Extrabajadores y Candidatos
            </h2>
            <p>
              Los datos se tratarán para procesos de selección, contratación, nómina, seguridad social, prestaciones, seguridad y salud en el trabajo (SST), capacitación, evaluación de desempeño, control de seguridad en instalaciones y conservación documental obligatoria.
            </p>
          </section>

          {/* 17. Tratamiento de datos sensibles */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              17. Tratamiento de Datos Sensibles
            </h2>
            <p>
              ANBAR S.A.S. evitará recolectar datos sensibles salvo que resulten estrictamente necesarios. Cuando se soliciten, se informará al Titular que responder es facultativo, se detallará la finalidad y se solicitará autorización explícita con medidas de seguridad reforzadas. La adquisición de productos nunca se condicionará a la entrega de datos sensibles innecesarios.
            </p>
          </section>

          {/* 18. Datos de niños, niñas y adolescentes */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              18. Datos de Niños, Niñas y Adolescentes
            </h2>
            <p>
              ANBAR S.A.S. reconoce la protección prevalente de los derechos de los menores de edad. Como regla general, evitará recolectar sus datos. Si excepcionalmente se requiere, responderá al interés superior del menor, asegurará sus derechos fundamentales y contará con la autorización de su representante legal.
            </p>
          </section>

          {/* 19 & 20. Autorización */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              19. Autorización para el Tratamiento
            </h2>
            <p>
              Salvo las excepciones legales, ANBAR S.A.S. obtendrá autorización previa, expresa e informada mediante documento escrito, formulario electrónico, casillas de aceptación, WhatsApp, correo electrónico, grabación o conductas inequívocas. <strong>El silencio no constituye autorización.</strong>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              20. La Política no Reemplaza la Autorización
            </h2>
            <p>
              La publicación o aceptación de esta política no reemplaza la autorización individual para el Tratamiento de datos personales cuando esta sea legalmente exigible. ANBAR S.A.S. conserva prueba de las autorizaciones obtenidas en formularios web, checkout, suscripciones y eventos.
            </p>
          </section>

          {/* 21 a 24 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              21. Información Suministrada al Obtener Autorización
            </h2>
            <p>
              Al solicitar autorización, ANBAR S.A.S. informará de manera clara: qué datos serán tratados, el Tratamiento, las finalidades, los derechos del Titular, la identificación del Responsable, canales de contacto y el carácter facultativo de responder sobre datos sensibles o de menores.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              22. Casos en los que no se Requiere Autorización
            </h2>
            <p>
              No se requerirá autorización en los casos establecidos por ley (artículo 10 de la Ley 1581 de 2012): requerimiento de entidad pública en ejercicio de sus funciones, orden judicial, datos de naturaleza pública, urgencia médica/sanitaria, fines históricos/estadísticos autorizados por ley, o datos de Registro Civil.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              23. Datos Suministrados sobre Terceros
            </h2>
            <p>
              Cuando un cliente suministre datos de otra persona (por ejemplo, para entregas a un destinatario diferente), deberá contar con legitimación suficiente. ANBAR S.A.S. utilizará esos datos exclusivamente para ejecutar la entrega correspondiente.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              24. Redes Sociales
            </h2>
            <p>
              La interacción en perfiles sociales de ANBAR HOME no autoriza automáticamente a incorporar datos públicos a bases comerciales independientes sin autorización previa para finalidades específicas.
            </p>
          </section>

          {/* 25. Cookies */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              25. Cookies y Tecnologías de Seguimiento
            </h2>
            <p>
              ANBAR HOME podrá utilizar cookies necesarias (para navegación y carrito), funcionales, de analítica y de marketing. El usuario puede configurar o rechazar cookies no esenciales sin que ello impida el funcionamiento básico de la tienda en línea.
            </p>
          </section>

          {/* 26. Videovigilancia */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              26. Videovigilancia
            </h2>
            <p>
              Las tiendas e instalaciones de ANBAR S.A.S. cuentan con sistemas de videovigilancia para la seguridad de personas, bienes e instalaciones, debidamente anunciados con avisos en accesos. Las grabaciones son de acceso restringido y se conservan temporalmente.
            </p>
          </section>

          {/* 27 & 28. Encargados y Transferencias */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              27. Encargados del Tratamiento
            </h2>
            <p>
              ANBAR S.A.S. podrá contratar proveedores tecnológicos, logísticos, pasarelas de pago, alojamiento en la nube y CRM, quienes actuarán como Encargados bajo estrictos acuerdos de confidencialidad y protección de datos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              28. Transferencia y Transmisión Nacional e Internacional
            </h2>
            <p>
              La transmisión o transferencia internacional de datos se realizará en estricto cumplimiento de los estándares de la Ley 1581 de 2012 y el Decreto 255 de 2022, garantizando niveles adecuados de seguridad.
            </p>
          </section>

          {/* 29. Derechos de los Titulares */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              29. Derechos de los Titulares
            </h2>
            <p>Conforme a la ley, los Titulares de los datos tienen derecho a:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {[
                '1. Conocer sus datos personales almacenados.',
                '2. Actualizar sus datos en cualquier momento.',
                '3. Rectificar datos parciales, inexactos o incompletos.',
                '4. Solicitar prueba de la autorización otorgada.',
                '5. Ser informados sobre el uso dado a sus datos.',
                '6. Acceder gratuitamente a la información objeto de Tratamiento.',
                '7. Presentar consultas ante ANBAR S.A.S.',
                '8. Presentar reclamos ante ANBAR S.A.S.',
                '9. Solicitar la supresión de datos cuando proceda.',
                '10. Revocar la autorización otorgada.',
                '11. Presentar quejas ante la Superintendencia de Industria y Comercio.',
                '12. Abstenerse de responder preguntas sobre datos sensibles o de menores.'
              ].map((derecho, idx) => (
                <div key={idx} className="p-2.5 bg-neutral-50 rounded border border-neutral-200 font-medium text-neutral-800">
                  {derecho}
                </div>
              ))}
            </div>
          </section>

          {/* 30 & 31. Área responsable y Legitimación */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              30. Área Responsable de la Atención de Consultas y Reclamos
            </h2>
            <p>
              La Administración de ANBAR S.A.S. gestionará todas las solicitudes a través de los canales institucionales:
            </p>
            <div className="bg-white border border-neutral-200 p-4 rounded-lg space-y-2 text-sm">
              <p><strong>Correo oficial:</strong> <a href="mailto:anbarhomesas@gmail.com" className="text-camel-dark underline">anbarhomesas@gmail.com</a></p>
              <p><strong>Dirección física:</strong> Calle 62 #30-99, Bucaramanga, Santander, Colombia</p>
              <p><strong>WhatsApp corporativo:</strong> +57 312 308 7918</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              31. Identificación del Solicitante
            </h2>
            <p>
              Para prevenir fraudes, podrán presentar solicitudes el Titular, sus causahabientes, apoderados o representantes acreditados. ANBAR S.A.S. verificará la identidad y legitimación antes de suministrar o modificar cualquier información.
            </p>
          </section>

          {/* 32 & 33. Procedimientos de consultas y reclamos */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              32. Procedimiento para Consultas
            </h2>
            <p>
              Las consultas serán atendidas en un término máximo de <strong>diez (10) días hábiles</strong> contados a partir de su recepción. Si no fuese posible atenderla dentro de dicho término, se informará al interesado y se responderá dentro de los <strong>cinco (5) días hábiles siguientes</strong> al vencimiento del plazo inicial.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              33. Procedimiento para Reclamos
            </h2>
            <p>
              El Titular que considere que sus datos deben corregirse, actualizarse o suprimirse, podrá presentar reclamo indicando: identificación, hechos, pretensión y documentos de soporte.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-sm md:text-base">
              <li>Si el reclamo está incompleto, se requerirá al interesado dentro de los cinco (5) días siguientes para subsanar. Si transcurren dos (2) meses sin subsanar, se entenderá desistido.</li>
              <li>El término máximo para atender el reclamo será de <strong>quince (15) días hábiles</strong> a partir del día siguiente a su recepción completa. Si se requiere prórroga, se informará al interesado antes de su vencimiento y no superará <strong>ocho (8) días hábiles adicionales</strong>.</li>
            </ul>
          </section>

          {/* 34 a 37 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              34. Actualización y Rectificación
            </h2>
            <p>
              El Titular podrá solicitar la corrección de datos inexactos o incompletos aportando la información y soportes necesarios para su modificación.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              35. Supresión de Datos
            </h2>
            <p>
              El Titular podrá solicitar la supresión de sus datos personales cuando considere que no están siendo tratados conforme a la ley. La supresión no procederá cuando exista un deber legal o contractual de conservar los datos (ej. facturación tributaria, contabilidad, garantías, defensa judicial).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              36. Revocatoria de Autorización
            </h2>
            <p>
              La revocatoria podrá ser <strong>Total</strong> (detener todo tratamiento no obligado por ley) o <strong>Parcial</strong> (ej. revocar únicamente el envío de mercadeo sin afectar el registro histórico de compras o garantías).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              37. Retiro de Comunicaciones Publicitarias
            </h2>
            <p>
              Al solicitar no recibir publicidad, el usuario será excluido de campañas comerciales sin perjuicio del envío de notificaciones indispensables de facturación, estado de pedidos o seguridad.
            </p>
          </section>

          {/* 38 a 43 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              38. Seguridad de la Información
            </h2>
            <p>
              ANBAR S.A.S. adopta medidas técnicas, operativas y administrativas para evitar pérdida, adulteración, uso fraudulento o acceso no autorizado a los datos personales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              39. Incidentes de Seguridad
            </h2>
            <p>
              Se cuenta con protocolos internos para la detección, mitigación y reporte ante la Superintendencia de Industria y Comercio (SIC) en los eventos legalmente requeridos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              40. Responsabilidad Demostrada (Accountability)
            </h2>
            <p>
              ANBAR S.A.S. implementa inventarios de bases de datos, controles de acceso, contratos de confidencialidad y capacitaciones periódicas para evidenciar el cumplimiento efectivo del régimen legal de Hábeas Data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              41. Conservación de Autorizaciones y Evidencias
            </h2>
            <p>
              Se mantendrán registros físicos y digitales que acrediten el consentimiento otorgado por los Titulares y las solicitudes tramitadas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              42. Conservación de los Datos Personales
            </h2>
            <p>
              Los datos se conservarán durante el tiempo necesario para cumplir las finalidades autorizadas y las exigencias de ley (comerciales, contables, fiscales y probatorias), tras lo cual serán eliminados o anonimizados.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              43. Registro Nacional de Bases de Datos (RNBD)
            </h2>
            <p>
              ANBAR S.A.S. verificará periódicamente el cumplimiento de los umbrales legales para la inscripción y actualización de sus bases de datos ante la SIC conforme al Decreto 90 de 2018.
            </p>
          </section>

          {/* 44 a 50 */}
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              44. Aviso de Privacidad
            </h2>
            <p>
              En aquellos casos en los que no sea posible disponer de la política completa en el punto de captura de datos, se dispondrá de un Aviso de Privacidad resumido con enlace de acceso directo al texto completo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              45. Deberes de ANBAR S.A.S.
            </h2>
            <p>
              ANBAR S.A.S. actuará como custodio diligente garantizando el Hábeas Data, tramitando oportunamente las consultas y reclamos, y acatando los lineamientos de la autoridad de protección de datos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              46. Modificación de Finalidades
            </h2>
            <p>
              Cualquier uso sustancialmente diferente de la información requerirá una nueva autorización previa del Titular.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              47. Cambios a la Política
            </h2>
            <p>
              Cualquier modificación será publicada oportunamente en nuestro sitio web oficial:{' '}
              <a href="https://anbarhome.co/politicas-de-tratamiento-de-datos" className="text-camel-dark font-medium underline">
                https://anbarhome.co/politicas-de-tratamiento-de-datos
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              48. Autoridad de Protección de Datos
            </h2>
            <p>
              La autoridad competente en Colombia es la <strong>Superintendencia de Industria y Comercio – SIC (Delegatura para la Protección de Datos Personales)</strong>. El Titular podrá acudir ante ella tras agotar el trámite correspondiente ante ANBAR S.A.S.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              49. Vigencia de las Bases de Datos
            </h2>
            <p>
              Las bases de datos se mantendrán activas durante el tiempo necesario para el desarrollo de las finalidades legítimas y las obligaciones legales aplicables.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-serif font-medium text-neutral-900 border-b border-neutral-200 pb-2">
              50. Vigencia de la Política
            </h2>
            <p>
              La presente Política de Tratamiento y Protección de Datos Personales entra en vigencia a partir del <strong>26 de agosto de 2026</strong>.
            </p>

            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-200 mt-6 not-prose space-y-3">
              <div className="flex items-center gap-2 text-camel-dark font-serif font-medium text-lg">
                <ShieldCheck className="w-5 h-5" />
                <span>ANBAR S.A.S. – ANBAR HOME</span>
              </div>
              <p className="text-sm text-neutral-600"><strong>NIT:</strong> 901.838.382-4</p>
              <p className="text-sm text-neutral-600"><strong>Domicilio principal:</strong> Calle 62 #30-99, Bucaramanga, Santander, Colombia</p>
              <p className="text-sm text-neutral-600"><strong>Correo para protección de datos:</strong> anbarhomesas@gmail.com</p>
              <p className="text-sm text-neutral-600"><strong>Teléfono / WhatsApp:</strong> +57 312 308 7918</p>
              <p className="text-sm text-neutral-600"><strong>Sitio web oficial:</strong> https://anbarhome.co/</p>
              <p className="text-sm text-neutral-600"><strong>Enlace de la política:</strong> https://anbarhome.co/politicas-de-tratamiento-de-datos</p>
            </div>
          </section>
        </div>
      )}
    </LegalLayout>
  )
}
