import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Política integral de retractos, cambios, devoluciones y garantía | Anbar Home',
  description: 'Conoce nuestras políticas de retractos, cambios, devoluciones y garantía.',
}

export default function PoliticasRetractosGarantiaPage() {
  return (
    <LegalLayout title="Política integral de retractos, cambios, devoluciones y garantía" breadcrumb="Política integral de retractos, cambios, devoluciones y garantía">
      
      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">IDENTIFICACIÓN DEL RESPONSABLE</h2>
        <ul className="list-none space-y-2">
          <li><strong>Razón social:</strong> ANBAR S.A.S.</li>
          <li><strong>NIT:</strong> 901.838.382-4</li>
          <li><strong>Dirección:</strong> Calle 62 #30-99, Bucaramanga, Colombia</li>
          <li><strong>Correo de contacto:</strong> <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a></li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">ALCANCE</h2>
        <p className="mb-4">Esta política aplica a:</p>
        <ul className="list-disc space-y-2 pl-6 mb-4">
          <li>Compras realizadas en tiendas físicas</li>
          <li>Compras realizadas a través de página web, redes sociales o canales no presenciales</li>
        </ul>
        <p className="mb-4 mt-6">Incluye:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Derecho de retracto (ventas online/no presenciales)</li>
          <li>Garantía legal por defectos</li>
          <li>Cambios voluntarios en tienda física, cuando el producto se encuentre en condiciones aptas</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">DERECHO DE RETRACTO</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Aplica solo a ventas no presenciales (online, redes sociales, teléfono, catálogos).</li>
          <li><strong>Plazo:</strong> 5 días hábiles desde la recepción del producto por el cliente.</li>
          <li>
            <strong>Condiciones del producto:</strong>
            <ul className="list-[circle] space-y-2 pl-6 mt-2">
              <li>Debe estar en perfecto estado, sin uso ni daños</li>
              <li>Empaque original, etiquetas y accesorios completos</li>
            </ul>
          </li>
          <li><strong>Excepciones:</strong> productos personalizados, adaptados o frágiles según su naturaleza</li>
          <li><strong>Costos de transporte:</strong> a cargo del cliente, salvo que ANBAR S.A.S. indique lo contrario</li>
          <li><strong>Devolución del dinero:</strong> mismo medio de pago, máximo 30 días calendario desde recepción del producto devuelto</li>
          <li>
            <strong>Procedimiento:</strong> enviar solicitud a <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a>, indicando:
            <ul className="list-[circle] space-y-2 pl-6 mt-2">
              <li>Nombre completo</li>
              <li>Número de pedido/factura</li>
              <li>Motivo del retracto</li>
              <li>Medio de contacto</li>
            </ul>
          </li>
          <li>ANBAR S.A.S. responderá en un plazo máximo de 10 días hábiles confirmando la recepción y los pasos a seguir</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">CAMBIOS VOLUNTARIOS EN TIENDA FÍSICA</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Plazo:</strong> 5 días hábiles desde la compra</li>
          <li><strong>Estado del producto:</strong> original, sin uso, armado ni daños, embalaje intacto</li>
          <li>Productos frágiles deben entregarse con embalaje seguro</li>
          <li><strong>Disponibilidad:</strong> sujeta a existencia de productos y confirmación de la tienda</li>
          <li>
            <strong>Opciones del cliente:</strong>
            <ul className="list-[circle] space-y-2 pl-6 mt-2">
              <li>Cambio por otro producto disponible</li>
              <li>Bono de tienda</li>
              <li>No se hace devolución de dinero</li>
            </ul>
          </li>
          <li><strong>Costos de traslado:</strong> a cargo del cliente, salvo que la empresa indique lo contrario</li>
          <li><strong>Procedimiento:</strong> presentar producto y factura, o coordinar por correo electrónico si aplica</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">GARANTÍA LEGAL POR DEFECTOS</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Aplica a todas las compras, físicas y no presenciales</li>
          <li>
            Productos defectuosos por fabricación, no por uso serán:
            <ul className="list-[circle] space-y-2 pl-6 mt-2">
              <li>Reparados en caso de no contar con mas existencias</li>
              <li>Cambiados</li>
            </ul>
          </li>
          <li><strong>Plazo máximo:</strong> 30 días calendario desde reporte</li>
          <li>
            <strong>Excepciones:</strong>
            <ul className="list-[circle] space-y-2 pl-6 mt-2">
              <li>productos personalizados o por apariencia estética (excepto defectos de fabricación)</li>
              <li>Productos entregados en buen estado por parte del equipo comercial/logistico al cliente</li>
              <li>Daños por mala manipulación</li>
            </ul>
          </li>
          <li><strong>Procedimiento:</strong> enviar evidencia (foto o video) al correo <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a></li>
          <li>ANBAR S.A.S. responderá en 10 días hábiles y coordinará la solución</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">CONDICIONES GENERALES</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Productos no armados/instalados</li>
          <li>Empaque original y accesorios completos</li>
          <li>Productos devueltos deben pasar inspección de recepción y estado</li>
          <li>Evidencia interna: fotos, fechas de recepción, reportes de estado</li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="mb-6 text-lg md:text-xl">PLAZOS DE RESPUESTA</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-border text-left text-sm md:text-base">
            <thead>
              <tr className="bg-camel/10">
                <th className="border border-border px-4 py-3 font-medium">Tipo de solicitud</th>
                <th className="border border-border px-4 py-3 font-medium">Plazo máximo de respuesta</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-3">Derecho de retracto</td>
                <td className="border border-border px-4 py-3 text-neutral-600">10 días hábiles para confirmar recepción y pasos</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-3">Cambios voluntarios</td>
                <td className="border border-border px-4 py-3 text-neutral-600">10 días hábiles para coordinar disponibilidad</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-3">Garantía legal</td>
                <td className="border border-border px-4 py-3 text-neutral-600">10 días hábiles para aceptar o rechazar solicitud</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-2xl">PROCEDIMIENTO DE DEVOLUCIÓN O CAMBIO</h2>
        <ul className="list-decimal space-y-3 pl-6">
          <li>Contactar a <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a> (correo principal) o teléfono de atención</li>
          <li>
            Indicar:
            <ul className="list-[circle] space-y-2 pl-6 mt-2">
              <li>Nombre completo</li>
              <li>Número de pedido/factura</li>
              <li>Motivo de la solicitud</li>
              <li>Medio de contacto</li>
              <li>Evidencia fotográfica si aplica (para defectos o daños)</li>
            </ul>
          </li>
          <li>Coordinar entrega del producto según canal de compra</li>
          <li>ANBAR S.A.S. evaluará estado del producto y procederá según política (reintegro, cambio, reparación)</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl">ACEPTACIÓN DE LA POLÍTICA</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Todas las compras, online o en tienda física, implican aceptación de esta política</li>
          <li>Política disponible en web, redes sociales y mostrador físico</li>
          <li>Recomendación SIC: conservar comprobante de aceptación o factura de compra</li>
        </ul>
      </section>

      <section className="mt-10 border-t border-border/40 pt-10">
        <h2 className="mb-4 text-2xl">VIGENCIA</h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Vigente desde publicación en la página web de ANBAR S.A.S.</li>
          <li>Aplicable mientras se mantengan operaciones de venta de productos de decoración</li>
        </ul>
      </section>
    </LegalLayout>
  )
}
