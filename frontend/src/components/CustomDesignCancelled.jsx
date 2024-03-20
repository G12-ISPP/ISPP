import React from 'react';
import PageTitle from './PageTitle/PageTitle';
export default class CustonDesignCancelled extends React.Component{
render(){
    return(
        <>
            <PageTitle title="Diseño personalizado cancelado" />
            <div className="custom-design-details">
                <h1>Lo siento, ha habido un fallo en el pago, vuelve a intentarlo</h1>
            </div>
        </>
    )
}
}