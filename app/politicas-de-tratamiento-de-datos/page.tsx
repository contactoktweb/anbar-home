import { Metadata } from 'next'
import { LegalLayout } from '@/components/legal-layout'

export const metadata: Metadata = {
  title: 'Políticas de tratamiento de datos | Anbar Home',
  description: 'Conoce nuestras políticas de tratamiento de datos personales.',
}

export default function PoliticasDatosPage() {
  return (
    <LegalLayout title="Políticas de tratamiento de datos" breadcrumb="Políticas de tratamiento de datos">
      <p className="lead text-base">
        En cumplimiento de lo dispuesto en el artículo 15 de la Constitución Política de Colombia, la Ley 1581 de 2012, el Decreto 1377 de 2013, el Decreto 1074 de 2015 y demás normas que regulen la protección de datos personales, <strong>ANBAR S.A.S.</strong> adopta la presente Política de Tratamiento de Datos Personales.
      </p>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">IDENTIFICACIÓN DEL RESPONSABLE DEL TRATAMIENTO</h2>
        <ul className="list-none space-y-2">
          <li><strong>Razón social:</strong> ANBAR S.A.S.</li>
          <li><strong>NIT:</strong> 901.838.382-4</li>
          <li><strong>Domicilio:</strong> Bucaramanga, Colombia</li>
          <li><strong>Dirección:</strong> Calle 62 #30-99</li>
          <li><strong>Correo electrónico:</strong> <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a></li>
        </ul>
        <p className="mt-4">
          ANBAR S.A.S. será el responsable del tratamiento de los datos personales recolectados a través de sus tiendas físicas, página web, redes sociales, canales digitales, formularios, contratos y demás medios utilizados en el desarrollo de su actividad comercial.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">MARCO LEGAL</h2>
        <p className="mb-4">La presente política se rige por las siguientes disposiciones legales:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Constitución Política de Colombia – Artículo 15</li>
          <li>Ley Estatutaria 1581 de 2012</li>
          <li>Decreto 1377 de 2013</li>
          <li>Decreto 1074 de 2015</li>
          <li>Circulares, guías y lineamientos de la Superintendencia de Industria y Comercio (SIC)</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">DEFINICIONES</h2>
        <p className="mb-4">Para efectos de esta política se aplicarán las definiciones establecidas en la Ley 1581 de 2012, entre ellas:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li><strong>Dato personal:</strong> Información vinculada o que pueda asociarse a una persona natural.</li>
          <li><strong>Titular:</strong> Persona natural cuyos datos personales sean objeto de tratamiento.</li>
          <li><strong>Tratamiento:</strong> Cualquier operación sobre datos personales, como recolección, almacenamiento, uso, circulación o supresión.</li>
          <li><strong>Responsable del Tratamiento:</strong> Persona jurídica que decide sobre el tratamiento de los datos personales.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">PRINCIPIOS APLICABLES AL TRATAMIENTO DE DATOS</h2>
        <p>
          ANBAR S.A.S. garantiza que el tratamiento de los datos personales se realizará conforme a los principios de legalidad, finalidad, libertad, veracidad, transparencia, acceso y circulación restringida, seguridad y confidencialidad.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">DATOS PERSONALES OBJETO DE TRATAMIENTO</h2>
        <p className="mb-4">ANBAR S.A.S. podrá recolectar y tratar, entre otros, los siguientes datos personales:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Nombre y apellidos</li>
          <li>Documento de identificación</li>
          <li>Dirección física y electrónica</li>
          <li>Número telefónico</li>
          <li>Información comercial necesaria para la venta de productos y prestación de servicios</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">FINALIDADES DEL TRATAMIENTO</h2>
        <p className="mb-4">Los datos personales serán tratados para las siguientes finalidades:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Gestión administrativa y comercial</li>
          <li>Gestión de clientes, proveedores y aliados</li>
          <li>Atención de solicitudes, consultas, quejas y reclamos</li>
          <li>Envío de información comercial, promocional y publicitaria</li>
          <li>Campañas de fidelización y marketing</li>
          <li>Facturación, pagos y cumplimiento de obligaciones contractuales</li>
          <li>Cumplimiento de obligaciones legales y requerimientos de autoridades competentes</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">DATOS SENSIBLES Y DATOS DE MENORES DE EDAD</h2>
        <p>
          ANBAR S.A.S. no recolecta ni trata datos sensibles ni datos personales de menores de edad. En caso excepcional de requerirse, se solicitará autorización expresa conforme a la normatividad vigente.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">DERECHOS DEL TITULAR DE LA INFORMACIÓN</h2>
        <p className="mb-4">El titular de los datos personales tiene derecho a:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Conocer, actualizar y rectificar sus datos personales</li>
          <li>Solicitar prueba de la autorización otorgada</li>
          <li>Ser informado sobre el uso dado a sus datos</li>
          <li>Revocar la autorización y/o solicitar la supresión de los datos</li>
          <li>Acceder de forma gratuita a sus datos personales</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC)</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-lg md:text-xl">AUTORIZACIÓN Y ACEPTACIÓN DE LA POLÍTICA</h2>
        <p className="mb-4">
          La recolección y tratamiento de los datos personales se realizará con la autorización previa, expresa e informada del titular.
        </p>
        <p className="mb-4">
          Los clientes que realicen compras en las tiendas físicas de ANBAR S.A.S., así como aquellos que adquieran productos o servicios a través de la página web, redes sociales u otros canales digitales, declaran conocer y aceptar la presente Política de Tratamiento de Datos Personales.
        </p>
        <p>
          En consecuencia, autorizan a ANBAR S.A.S. para recolectar, almacenar, usar, circular y suprimir sus datos personales conforme a las finalidades aquí descritas, de acuerdo con la Ley 1581 de 2012 y demás normas concordantes.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl">PROCEDIMIENTO PARA CONSULTAS Y RECLAMOS</h2>
        <p className="mb-4">
          El titular podrá ejercer sus derechos mediante solicitud escrita enviada al correo electrónico <a href="mailto:anbarhomesas@gmail.com">anbarhomesas@gmail.com</a>, indicando:
        </p>
        <ul className="list-disc space-y-2 pl-6 mb-4">
          <li>Nombre completo del titular</li>
          <li>Descripción clara de la consulta o reclamo</li>
          <li>Derecho que desea ejercer</li>
        </ul>
        <p className="font-medium mt-4">Términos de respuesta:</p>
        <ul className="list-disc space-y-2 pl-6">
          <li>Consultas: máximo 10 días hábiles</li>
          <li>Reclamos: máximo 15 días hábiles</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl">MEDIDAS DE SEGURIDAD</h2>
        <p>
          ANBAR S.A.S. adopta medidas técnicas, humanas y administrativas razonables para proteger los datos personales y evitar su pérdida, acceso no autorizado, uso indebido o divulgación.
        </p>
      </section>

      <section className="mt-10 border-t border-border/40 pt-10">
        <h2 className="mb-4 text-2xl">VIGENCIA</h2>
        <p>
          La presente Política de Tratamiento de Datos Personales rige a partir de su publicación en la página web de ANBAR S.A.S. y permanecerá vigente mientras se desarrollen actividades que impliquen el tratamiento de datos personales.
        </p>
      </section>
    </LegalLayout>
  )
}
