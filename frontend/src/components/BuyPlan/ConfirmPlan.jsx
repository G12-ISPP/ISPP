import React from 'react';
import PageTitle from '../PageTitle/PageTitle';

export default class CancelPlan extends React.Component{
render(){
    return(
        <>
            <PageTitle title="Plan confirmado" />
            <div className="custom-design-details">
                <h1>Pago realizado correctamente, disfruta de tus nuevas ventajas</h1>
            </div>
        </>
    )
}
}