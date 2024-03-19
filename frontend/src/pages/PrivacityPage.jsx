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
          .info {
            margin-left: 20px;
          }
          .fecha {
            margin-top: 20px;
            text-align: right;
          }
        `}
      </style>
      <div className="section-title-container">
        <Text type={TEXT_TYPES.TITLE_BOLD} text='Política de Privacidad' />
        <PageTitle title="Política de Privacidad" />
      </div>
      <div className='text-container'>
        <h3>¡Bienvenido a Shar3d!</h3>
        <p>En Shar3d, estamos comprometidos a proteger tu privacidad y garantizar el manejo seguro y transparente de tu información personal. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos tu información cuando utilizas nuestros servicios.</p>
        <h3>1. Información Recopilada</h3>
        <p>Recopilamos información para brindarte nuestros servicios y mejorar tu experiencia de usuario. Esto puede incluir información proporcionada por ti. Recopilamos la información que nos proporcionas al crear una cuenta, completar formularios, realizar transacciones o comunicarte con nosotros.</p>
        <h3>2. Uso de la información</h3>
        <p>Utilizamos la información recopilada para diversos fines, que incluyen:</p>
        <div className='info'>- Proporcionar y mantener nuestros servicios.</div>
        <div className='info'>- Personalizar tu experiencia y ofrecerte contenido relevante.</div>
        <div className='info'>- Mejorar la calidad y funcionalidad de nuestros servicios.</div>
        <div className='info'>- Comunicarnos contigo, responder a tus consultas y proporcionarte asistencia.</div>
        <div className='info'>- Detectar y prevenir actividades fraudulentas, abusivas o no autorizadas.</div>
        <h3>3. Compartir de la Información</h3>
        <p>No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales sin tu consentimiento expreso, excepto según lo permita esta Política de Privacidad o cuando la ley lo requiera.</p>
        <h3>4. Seguridad de la Información</h3>
        <p>Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información contra pérdida, uso indebido, acceso no autorizado o divulgación.</p>
        <h3>5. Acceso y Control de tu Información</h3>
        <p>Puedes acceder, corregir o eliminar tu información personal en cualquier momento a través de tu cuenta. También puedes optar por no recibir comunicaciones promocionales de nuestra parte.</p>
        <h3>6. Cambios en esta Política de Privacidad</h3>
        <p>Los cambios en nuestra política de privacidad serán notificados mediante una notificación visible en nuestro sitio web o por los medios convenientes para que el usuario pueda aceptar de nuevo los cambios tras su lectura y comprensión. </p>
        <p>Al aceptar los Términos de Servicio, aceptas esta Política de Privacidad y nuestro procesamiento de tu información personal de acuerdo con ella. Si tienes alguna pregunta o inquietud sobre nuestra Política de Privacidad o el manejo de tu información personal, no dudes en <a href="https://landing-page-shar3d.vercel.app/#contact">contactarnos</a>.</p>
        <div className='fecha'>Fecha de entrada en vigor: 17/03/2024</div>
      </div>
    </>

  );
}
export default TermsPage;