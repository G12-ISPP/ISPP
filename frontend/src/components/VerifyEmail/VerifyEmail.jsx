import React, {useEffect} from 'react';

const backend = import.meta.env.VITE_APP_BACKEND.replace(/['"]+/g, '');
const VerifyEmail = ({uidb64, token}) => {
    useEffect(() => {
        const verifyEmail = async () => {
            // 1. Realizar una petición a una URL con el uidb64 y el token
            fetch(`${backend}/api/v1/verify-email/${uidb64}/${token}/`)
                .then(response => {
                    if (!response.ok) {
                        alert('Ocurrió un error al verificar el correo.');
                    } else {
                        alert('¡Correo verificado! Gracias por confirmar tu dirección de correo electrónico.');
                    }
                }).catch(error => {
                console.error('Error al verificar el correo:', error);
                alert('Ocurrió un error al verificar el correo.');

            })
            // 2. Si la petición es exitosa, mostrar un mensaje de éxito y redirigir al usuario a la página principal-
            window.location.href = '/';
        }
        verifyEmail();

    }, [uidb64, token]);

    return (
        <div>
            <h1>Verificando correo...</h1>
        </div>
    );
};

export default VerifyEmail;



