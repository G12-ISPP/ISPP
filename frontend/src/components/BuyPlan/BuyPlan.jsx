import React from 'react';
import './BuyPlan.css';
import PageTitle from '../PageTitle/PageTitle';
import { RxCross1 } from "react-icons/rx";


const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

class ModalDeletePlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
    }
    
    handleDeletePlan = async (planName) => {
        let petition = backend + '/deletePlan/';
        petition = petition.replace(/"/g, '');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(petition, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ planName })
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.success) {
                    alert('Plan cancelado correctamente');
                    window.location.reload();
                } else {
                    alert('No se pudo cancelar el plan');
                }
            } else {
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    render() {
        return (
            <>
                <button className='buy-plan purchased' onClick={() => this.setState({ show: true })}>Cancelar</button>
                {this.state.show && (
                    <div className='cancel-plan-modal'>
                        <div className='cancel-plan-modal-content'>
                            <div className="close-cancel-plan-modal">
                                <span className='close-cancel-plan-modal-icon' onClick={() => this.setState({ show: false })}>&times;</span>
                            </div>
                            <div className="cancel-modal-warning">
                                <h3 className="warning-text">¿Está seguro de que quiere cancelar el plan?</h3>
                            </div>
                            <div className="cancel-plan-modal-button-wrapper">
                                <button className='cancel-plan-button cancel' onClick={() => this.handleDeletePlan(this.props.planName)}>Sí</button>
                                <button className='cancel-plan-button not-cancel' onClick={() => this.setState({ show: false })}>No</button>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

}

export default class BuyPlan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            plans: {
                buyerPlan: false,
                sellerPlan: false,
                designerPlan: false
            },
            buyer_plan: false,
            seller_plan: false,
            designer_plan: false,
            errors: {}
        };
    }

    async componentDidMount() {
        try {
            if (!localStorage.getItem('token')) {
                alert('Debes iniciar sesión para poder comprar un plan');
                window.location.href = '/';
            } else {
                let petition = backend + '/designs/loguedUser';
                petition = petition.replace(/"/g, '');
                const response = await fetch(petition, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                const datos = await response.json();
                // Actualiza los estados según los datos recibidos del backend
                this.setState({
                    buyer_plan: datos.buyer_plan,
                    seller_plan: datos.seller_plan,
                    designer_plan: datos.designer_plan
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    handleButtonClick = async (planName) => {
        this.setState(prevState => ({
            plans: {
                ...prevState.plans,
                [planName]: !prevState.plans[planName]
            },
            errors: {}
        }), async () => {
    
            if (this.state.buyer_plan && this.state.plans.buyerPlan) {
                this.setState(prevState => ({
                    errors: {
                        ...prevState.errors,
                        buyerplan: 'Ya has pagado por el plan comprador, por lo que no tienes que volver a pagar'
                    }
                }));
                alert(this.state.errors.buyerplan);
            }
            if (this.state.seller_plan && this.state.plans.sellerPlan) {
                this.setState(prevState => ({
                    errors: {
                        ...prevState.errors,
                        sellerPlan: 'Ya has pagado por el plan vendedor, por lo que no tienes que volver a pagar'
                    }
                }));
                alert(this.state.errors.sellerPlan);
            }
            if (this.state.designer_plan && this.state.plans.designerPlan) {
                this.setState(prevState => ({
                    errors: {
                        ...prevState.errors,
                        designerPlan: 'Ya has pagado por el plan diseñador, por lo que no tienes que volver a pagar'
                    }
                }));
                alert(this.state.errors.designerPlan);
            }
    
            if (Object.keys(this.state.errors).length > 0) {
                return;
            }
    
            let petition = backend + '/buyPlan/';
            petition = petition.replace(/"/g, '');
            const token = localStorage.getItem('token');
    
            try {
                const response = await fetch(petition, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.state.plans)
                });
    
                if (response.ok) {
                    const responseData = await response.json();
                    const paypalPaymentUrl = responseData.paypal_payment_url;
                    window.location.href = paypalPaymentUrl;
                } else {
                    alert('No se pudo comprar el plan.');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
    

    render() {
        const { buyer_plan, seller_plan, designer_plan } = this.state;

        return (
            <div className="buy-plan-page">
                
                <PageTitle title="Planes" />

                <div className="buy-plan-slogan">
                    <h2 className="pre-slogan">La comunidad de impresores que necesitas.</h2>
                    <h2 className="slogan">¡Únete a la innovación!</h2>
                </div>

                <div className="pricing-container">

                    <div className={`plan ${this.state.buyer_plan ? 'purchased' : ''}`}>

                        {this.state.buyer_plan && (
                            <div className="purchased-text">
                                ADQUIRIDO
                            </div>
                        )}

                        <div className="plan-wrapper">

                            <div className="main-info">
                                <h3 className="plan-name">Comprador</h3>
                                <div className="plan-price">
                                    <h2 className="price">10€</h2>
                                    <p className="period">/mes</p>
                                </div>
                            </div>

                            <div className="plan-features">
                                <p className="feature">
                                    No pagarás gastos de envío.
                                </p>
                            </div>

                            {this.state.buyer_plan ? (
                                <ModalDeletePlan planName='buyer_plan' handleDeletePlan={this.handleDeletePlan} />
                            ) : (
                                <button className="buy-plan" onClick={() => this.handleButtonClick('buyerPlan')}>
                                    Comprar
                                </button>
                            )}

                        </div>
                    </div>

                    <div className={`plan ${this.state.seller_plan ? 'purchased' : ''}`}>
                        
                        {this.state.seller_plan && (
                            <div className="purchased-text">
                                ADQUIRIDO
                            </div>
                        )}

                        <div className="plan-wrapper">
                            <div className="main-info">
                                <h3 className="plan-name">Vendedor</h3>
                                <div className="plan-price">
                                    <h2 className="price">15€</h2>
                                    <p className="period">/mes</p>
                                </div>
                            </div>

                            <div className="plan-features">
                                <p className="feature">
                                    Podrás destacar cinco productos.
                                </p>
                            </div>

                            {this.state.seller_plan ? (
                                <ModalDeletePlan planName='seller_plan' handleDeletePlan={this.handleDeletePlan} />
                            ) : (
                                <button className="buy-plan" onClick={() => this.handleButtonClick('sellerPlan')}>
                                    Comprar
                                </button>
                            )}
                        </div>
                    </div>

                    <div className={`plan ${this.state.designer_plan ? 'purchased' : ''}`}>

                        {this.state.designer_plan && (
                            <div className="purchased-text">
                                ADQUIRIDO
                            </div>
                        )}

                        <div className="plan-wrapper">
                            <div className="main-info">
                                <h3 className="plan-name">Diseñador</h3>
                                <div className="plan-price">
                                    <h2 className="price">15€</h2>
                                    <p className="period">/mes</p>
                                </div>
                            </div>

                            <div className="plan-features">
                                <p className="feature">
                                    Podrás destacar tres productos.
                                </p>
                                <p className="feature">
                                    Aumenta tu visibilidad como diseñador.
                                </p>
                            </div>

                            {this.state.designer_plan ? (
                                <ModalDeletePlan planName='designer_plan' handleDeletePlan={this.handleDeletePlan} />
                            ) : (
                                <button className="buy-plan" onClick={() => this.handleButtonClick('designerPlan')}>
                                    Comprar
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                <div className="purchase-info">
                    <p className="purchase-info-text">Si compras varios planes, se acumularán las ventajas.</p>
                    <p className="purchase-info-text">Se cobrará mensualmente por los planes que posea hasta que los cancele.</p>
                </div>

            </div>
            
        )
    }
}
