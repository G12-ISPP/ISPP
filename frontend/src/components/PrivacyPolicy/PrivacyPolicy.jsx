import React from "react";
import './PrivacyPolicy.css';
import Text, { TEXT_TYPES } from "../Text/Text";
import logo from '../../assets/logo_with_background.png';

const PrivacyPolicy = () => {
    return (
        <div className="privacy-policy-page">

            <div className="privacy-policy-page-title-container">
                <Text type={TEXT_TYPES.TITLE_BOLD} text="Política de privacidad de SHAR3D" />
            </div>

            <div className="privacy-policy-contents">

                <div className="privacy-policy-intro">
                    <div className="privacy-policy-intro-title">
                        <h2 className="intro-text">BIENVENIDO A</h2>
                        <img src={logo} alt="Logo de SHAR3D" className="intro-logo" />
                    </div>
                    <div className="privacy-policy-intro-text-section">
                        <p className="privacy-policy-intro-text">
                            En SHAR3D, estamos comprometidos a proteger tu privacidad y garantizar el manejo seguro y transparente 
                            de tu información personal. Esta Política de Privacidad describe cómo recopilamos, utilizamos y protegemos 
                            tu información cuando utilizas nuestros servicios.
                        </p>
                    </div>
                </div>

                <div className="privacy-policy-section">
                    <div className="privacy-policy-section-title">
                        <h3 className="section-title">1. Información recopilada</h3>
                    </div>
                    <div className="privacy-policy-section-contents">
                        <p className="privacy-policy-section-text">
                            Recopilamos información para brindarte nuestros servicios y mejorar tu experiencia de usuario. Esto puede 
                            incluir información proporcionada por ti. Recopilamos la información que nos proporcionas al crear una 
                            cuenta, completar formularios, realizar transacciones o comunicarte con nosotros.
                        </p>
                    </div>
                </div>

                <div className="privacy-policy-section">
                    <div className="privacy-policy-section-title">
                        <h3 className="section-title">2. Uso de la información</h3>
                    </div>
                    <div className="privacy-policy-section-contents">
                        <p className="privacy-policy-section-text">
                            Utilizamos la información recopilada para diversos fines, que incluyen:
                        </p>
                        <p className="privacy-policy-section-text-with-dot">Proporcionar y mantener nuestros servicios.</p>
                        <p className="privacy-policy-section-text-with-dot">Personalizar tu experiencia y ofrecerte contenido relevante.</p>
                        <p className="privacy-policy-section-text-with-dot">Mejorar la calidad y funcionalidad de nuestros servicios.</p>
                        <p className="privacy-policy-section-text-with-dot">Comunicarnos contigo, responder a tus consultas y proporcionarte asistencia.</p>
                        <p className="privacy-policy-section-text-with-dot">Detectar y prevenir actividades fraudulentas, abusivas o no autorizadas.</p>
                        <p className="privacy-policy-section-text">
                            No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales sin tu 
                            consentimiento expreso, excepto según lo permita esta Política de Privacidad o cuando la ley lo requiera.
                        </p>
                    </div>
                </div>

                <div className="privacy-policy-section">
                    <div className="privacy-policy-section-title">
                        <h3 className="section-title">3. Seguridad de la información</h3>
                    </div>
                    <div className="privacy-policy-section-contents">
                        <p className="privacy-policy-section-text">
                            Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información 
                            contra pérdida, uso indebido, acceso no autorizado o divulgación.
                        </p>
                        <p className="privacy-policy-section-text">
                            En supuesto caso de fallos en las medidas seguridad, utilizaremos los correos de nuestros usuarios para 
                            contactarlos individualmente y notificarles del impacto que puede haber tenido la filtración.
                        </p>
                    </div>
                </div>

                <div className="privacy-policy-section">
                    <div className="privacy-policy-section-title">
                        <h3 className="section-title">4. Acceso y control de tu información</h3>
                    </div>
                    <div className="privacy-policy-section-contents">
                        <p className="privacy-policy-section-text">
                            Puedes acceder a tu información personal y corregirla en cualquier momento a través de tu cuenta.
                        </p>
                    </div>
                </div>

                <div className="privacy-policy-section">
                    <div className="privacy-policy-section-title">
                        <h3 className="section-title">5. Cambios en la Política de Privacidad</h3>
                    </div>
                    <div className="privacy-policy-section-contents">
                        <p className="privacy-policy-section-text">
                            Los cambios en nuestra política de privacidad serán notificados mediante una notificación visible en 
                            nuestro sitio web o por los medios convenientes para que el usuario pueda aceptar de nuevo los cambios 
                            tras su lectura y comprensión.
                        </p>
                        <p className="privacy-policy-section-text">
                            Al aceptar los Términos de Servicio, aceptas esta Política de Privacidad y nuestro procesamiento de tu 
                            información personal de acuerdo con ella. Si tienes alguna pregunta o inquietud sobre nuestra Política de 
                            Privacidad o el manejo de tu información personal, no dudes 
                            en <a href="https://landing-page-shar3d.vercel.app/#contact">contactarnos</a>.
                        </p>
                    </div>
                </div>

                <div className="privacy-policy-signature-section">
                    <div className="privacy-policy-signature-contents">
                        <p className="privacy-policy-signature-text">
                            El equipo de SHAR3D.
                        </p>
                        <p className="privacy-policy-signature-text">
                            Fecha de entrada en vigor: 06/04/2024
                        </p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default PrivacyPolicy;