import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Aviso de Privacidad | Anbar Home',
  description: 'Conoce nuestro aviso de privacidad y las políticas de tratamiento de datos personales de ANBAR S.A.S.',
}

export default function AvisoPrivacidadPage() {
  return (
    <LegalLayout title="Aviso de privacidad" breadcrumb="Aviso de privacidad">
      <p className="lead text-base">
        En cumplimiento de lo dispuesto en la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y demás normas que las modifiquen, adicionen o sustituyan, <strong>ANBAR S.A.S.</strong>, informa a los titulares de los datos personales que sean recolectados y tratados por la compañía, las políticas aplicables al tratamiento de sus datos personales.
      </p>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">Responsable del Tratamiento de la Información</h2>
        <p>
          <strong>ANBAR S.A.S.</strong>, identificada con NIT 901.838.382-4, con domicilio en la Calle 62 # 30-99, Bucaramanga, será la responsable del tratamiento de los datos personales.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">Finalidad del Tratamiento</h2>
        <p className="mb-4">
          Los datos personales suministrados por los titulares serán recolectados, almacenados, usados, circulados y suprimidos para las siguientes finalidades:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Gestión administrativa y contable</li>
          <li>Gestión de clientes y proveedores</li>
          <li>Atención de peticiones, quejas y reclamos</li>
          <li>Prospección comercial</li>
          <li>Envío de información comercial, promocional y publicitaria</li>
          <li>Campañas de fidelización y marketing</li>
          <li>Cumplimiento de obligaciones legales y contractuales</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">Derechos del Titular de la Información</h2>
        <p className="mb-4">
          El titular de los datos personales tiene derecho a:
        </p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Conocer, actualizar y rectificar sus datos personales</li>
          <li>Solicitar prueba de la autorización otorgada</li>
          <li>Ser informado sobre el uso que se ha dado a sus datos</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio</li>
          <li>Revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios, derechos y garantías constitucionales y legales</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">Consulta de la Política de Tratamiento de Datos</h2>
        <p>
          La Política de Tratamiento de Datos Personales de ANBAR S.A.S., así como cualquier cambio sustancial en la misma, podrá ser solicitada o consultada a través del siguiente correo electrónico: <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a>
        </p>
      </section>

      <section className="mt-10 border-t border-border/40 pt-10">
        <h2 className="mb-4 text-lg md:text-xl">Ejercicio de Derechos</h2>
        <p>
          Para ejercer sus derechos de acceso, corrección, actualización, supresión o revocatoria de la autorización, el titular podrá enviar una solicitud escrita al correo electrónico <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a>, indicando en el asunto el derecho que desea ejercer, o mediante comunicación escrita enviada a la dirección Calle 62 # 30-99, Bucaramanga.
        </p>
      </section>
    </LegalLayout>
  )
}

