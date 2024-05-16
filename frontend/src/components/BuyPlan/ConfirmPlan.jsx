import React from 'react';
import './BuyPlan.css';
import logo from '../../assets/logo_with_background.png';
import PageTitle from '../PageTitle/PageTitle';

const CancelPlan = () => {

    const onButtonClick = (path) => {
        window.location.href = path;
    };

    return (
        <div className="plan-confirmed-page">
            <PageTitle title="Plan confirmado" />
            <div className="plan-confirmed-container">
                <div className="plan-confirmed-contents-wrapper">
                    <div className="logo-container">
                        <img src={logo} alt="logo" className="logo" onClick={() => onButtonClick('/')} role="button" tabIndex="0" />
                    </div>
                    <div className="plan-confirmed-text">
                        <h3 className="plan-confirmed-text-primary">Pago realizado correctamente, disfruta de tus nuevas ventajas.</h3>
                        <p className="plan-confirmed-text-secondary">El equipo de SHAR3D</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelPlan;
