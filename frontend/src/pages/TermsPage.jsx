import React from 'react';
import PageTitle from '../components/PageTitle/PageTitle';
import Text, { TEXT_TYPES } from "../components/Text/Text";

export function TermsPage() {
  return (
    <>
      <style>
        {`
          .text-container {
            margin: 4em;
            margin-top:0px;
          }
          .plan {
            margin-bottom: 20px;
          }
          .plan-title {
            font-weight: bold;
            margin-left: 20px;
          }
          .plan-description {
            margin-top: 5px;
          }
          .fecha {
            margin-top: 20px;
            text-align: right;
          }
        `}
      </style>
      <div className="section-title-container">
        <Text type={TEXT_TYPES.TITLE_BOLD} text='Términos y condiciones' />
        <PageTitle title="Términos y condiciones" />
      </div>
      <div className='text-container'>
        <h3>¡Bienvenido a Shar3d!</h3>
        <p>Antes de comprar o registrarte es de obligatorio cumplimiento leer y aceptar los términos y condiciones del Acuerdo de Shar3d ("Servicio"), quedando sujeto así a estos. Por otra parte, si no se acepta no se podrá usar el Servicio. Por favor, léelos detenidamente.</p>
        <h3>Aceptación de los Términos</h3>
        <p>Este Acuerdo establece los términos bajo los cuales se proporciona el Servicio a ti ("Cliente"). Al leer y aceptar antes de la compra o registro el Acuerdo, debes cumplir y quedas sujeto a este Acuerdo. Si no estás de acuerdo con estos términos, por favor, no utilices el Servicio. Debes marcar la casilla para aceptar el Acuerdo del Cliente antes de proceder.</p>
        <h3>Descripción del Servicio</h3>
        <p>Shar3d es una plataforma dedicada a facilitar la compra y venta de una amplia variedad de artículos en formato 3D. Nuestro servicio proporciona a los usuarios la oportunidad de dar vida a sus diseños personalizados, así como ofrecer las herramientas necesarias para que otros puedan materializar sus proyectos. Eliminando intermediarios, permitimos que proveedores y consumidores interactúen directamente, negociando precios de manera conveniente y eficiente. Nos enorgullece fomentar una comunidad inclusiva donde los miembros pueden compartir sus creaciones, colaborar en proyectos conjuntos y brindar apoyo mutuo en el proceso creativo.</p>
        <h3>Uso del Servicio</h3>
        <p>Tras la aceptación del Acuerdo del Servicio tras su lectura y entendimiento, aceptas comprometerte exclusivamente a propósitos legítimos y en pleno cumplimiento de los términos estipulados en este Acuerdo. Reconoces y aceptas ser responsable de todas las acciones llevadas a cabo bajo tu cuenta, asumiendo plena responsabilidad por cualquier actividad realizada en relación con la misma.</p>
        <p>Si algún usuario sube un diseño o pieza que sea propiedad intelectual de un tercero, dentro de la aplicación otros usuarios podrán reportar este tipo de productos y nosotros revisaremos los reportes para eliminar este tipo de productos en un plazo de máximo dos días.</p>
        <p>Si un usuario sube un producto que use propiedad intelectual de tercero y dicho producto es denunciado por los propietarios, siempre y cuando la denuncia se haya realizado antes del plazo de dos días desde que se subió el producto, la responsabilidad será de quien subió el producto, ya que desde SHAR3D, nos encargamos de proteger la propiedad intelectual de terceros y actuaremos rápidamente para eliminar productos que no deban estar en nuestra aplicación.</p>
        <h3>Cuentas de Usuario</h3>
        <p>Al acceder a determinadas funciones del Servicio, es posible que te solicitemos crear una cuenta personalizada. Al hacerlo, aceptas proporcionar información veraz, completa y actualizada. Esta información es fundamental para garantizar una experiencia óptima en nuestra plataforma.</p>
        <p>Nuestra plataforma ofrece una variedad de planes de membresía diseñados para satisfacer tus necesidades específicas:</p>
        <div className="plan">
          <div className="plan-title">- Plan Comprador:</div>
          <div className="plan-description">
            Con una suscripción mensual de tan solo 10€, te beneficiarás de la ventaja de no tener que pagar gastos de envío en tus compras. Esto te permitirá disfrutar de tus productos sin preocupaciones adicionales.
          </div>
        </div>
        <div className="plan">
          <div className="plan-title">- Plan Vendedor:</div>
          <div className="plan-description">
            Por solo 15€ al mes, tendrás la oportunidad de resaltar hasta cinco productos en nuestra plataforma. Destacar tus productos aumentará significativamente su visibilidad, lo que puede traducirse en mayores ventas y una mayor exposición de tus productos a nuestros usuarios.
          </div>
        </div>
        <div className="plan">
          <div className="plan-title">- Plan Diseñador:</div>
          <div className="plan-description">
            Con una tarifa de 15€ al mes, podrás resaltar hasta tres de tus diseños en nuestra plataforma. Además de aumentar tu visibilidad como diseñador, esta opción te permitirá mostrar tus creaciones de manera destacada, atrayendo la atención de potenciales compradores.
          </div>
        </div>
        <p>Es importante tener en cuenta que si decides adquirir varios planes, las ventajas de cada uno se sumarán para ofrecerte una experiencia aún más completa y satisfactoria. Asimismo, ten en cuenta que los cargos por los planes seleccionados se renovarán automáticamente cada mes hasta que decidas cancelarlos. Esto te brinda flexibilidad para ajustar tus preferencias según tus necesidades cambiantes.</p>
        <h3>Política de Privacidad</h3>
        <p>Tu privacidad es una prioridad para nosotros en Shar3d. Valoramos la confianza que depositas en nosotros al proporcionarnos tu información personal. Nuestra Política de Privacidad, disponible <a href="/privacidad">aquí</a>, detalla cómo recopilamos, utilizamos y protegemos tu información personal.</p>
        <h3>Pago</h3>
        <p>Si el Servicio requiere pago, aceptas pagar todas las tarifas aplicables según se describe en el sitio web del Servicio o dentro del mismo. Todas las tarifas son no reembolsables. Aceptamos pagos a través de PayPal, lo que proporciona una opción de pago segura y conveniente.</p>
        <h3>Propiedad Intelectual</h3>
        <p>Todo el contenido y materiales proporcionados en el Servicio son propiedad intelectual de Shar3d o sus licenciantes y están protegidos por las leyes de derechos de autor y otras leyes de propiedad intelectual.</p>
        <h3>Terminación</h3>
        <p>En caso de que se requiera la terminación o suspensión, nos comprometemos a proporcionarte un aviso previo, salvo en casos de emergencia o cuando sea necesario proteger la integridad del Servicio o de nuestros usuarios. Tras este aviso y sus respectivas apelaciones habrá una resolución en el que se recogerá el motivo y los hechos por los que se termina el contrato o no, de esta manera quedando vetado del servicio.</p>
        <h3>Limitación de Responsabilidad</h3>
        <p>Shar3d se hará responsable de daños directos, incidentales, especiales, consecuenciales, y de terceros resultantes de lo que la ley establezca. Si no se está de acuerdo se pasará a poner en manos de autoridades judiciales para determinar quien es responsable del daño.</p>
        <h3>Cambios al Acuerdo</h3>
        <p>Cualquier cambio en el Acuerdo deberá ser reaceptado por los usuarios de nuevo para así volver a hacer uso de nuestros servicios. Para la reaceptación, te notificaremos sobre cualquier cambio significativo mediante una notificación visible en nuestro sitio web o por otros medios adecuados. La reaceptación de los Términos de Servicios del Servicio después de la entrada en vigor de los cambios constituirá la aceptación implícita y total de los nuevos términos.</p>
        <h3>Ley Aplicable</h3>
        <p>Este Acuerdo estará regido y se interpretará de acuerdo a las leyes que más le beneficien a la parte más débil en este caso a usted Cliente.</p>
        <h3>Información de Contacto</h3>
        <p>Si tienes alguna pregunta sobre este Acuerdo o necesitas ponerte en contacto con nosotros por cualquier motivo relacionado con el Servicio, puedes hacerlo a través de <a href="https://landing-page-shar3d.vercel.app/#contact">aquí</a>.</p>
        <p>Al aceptar el Acuerdo, reconoces y aceptas haber leído, entendido y aceptado quedar sujeto a los términos y condiciones de este Acuerdo.</p>
        <div className='fecha'>Fecha de entrada en vigor: 06/04/2024</div>
      </div>
    </>

  );
}
export default TermsPage;