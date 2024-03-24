import React, {useEffect} from 'react';

const backend = import.meta.env.VITE_APP_BACKEND.replace(/['"]+/g, '');
const VerifyEmail = () => {
    useEffect(() => {
            const verifyEmail = async () => {
                // 1. Realizar una petición a una URL con el uidb64 y el token
                const uuid64 = window.location.href.split('/')[4];
                const token = window.location.href.split('/')[5];
                let response = await fetch(`${backend}/users/api/v1/verify-email/${uuid64}/${token}/`)
                let data = await response.json();
                if (!response.ok) {
                    alert('Ocurrió un error al verificar el correo.');
                } else {
                    alert(data.message);
                }

                // 2. Si la petición es exitosa, mostrar un mensaje de éxito y redirigir al usuario a la página principal-
                window.location.href = '/';
            }
            verifyEmail();

        }, []
    )
    ;

    return (
        <div>
            <h1>Verificando correo...</h1>
        </div>
    );
};

export default VerifyEmail;



