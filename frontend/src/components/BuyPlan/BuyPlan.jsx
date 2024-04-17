import React from 'react';
import './BuyPlan.css';
import PageTitle from '../PageTitle/PageTitle';
import { RxCross1 } from "react-icons/rx";
import Button, { BUTTON_TYPES } from '../Button/Button';


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
        console.log(this.props.planName);
        return (
            <>
                <button onClick={() => this.setState({ show: true })}>Cancelar Plan</button>
                {this.state.show && (
                    <div className='modal'>
                        <div className='modal-content'>
                            <span className='close' onClick={() => this.setState({ show: false })}>&times;</span>
                            <h1>¿Estás seguro de que quieres cancelar el plan?</h1>
                            <button onClick={() => this.handleDeletePlan(this.props.planName)}>Sí</button>
                            <button onClick={() => this.setState({ show: false })}>No</button>
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

    handlePlanChange = (planName) => {
        this.setState(prevState => ({
            plans: {
                ...prevState.plans,
                [planName]: !prevState.plans[planName]
            }
        }));
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        this.state.errors = {};
        if (!this.state.plans.buyerPlan && !this.state.plans.sellerPlan && !this.state.plans.designerPlan) {
            this.state.errors.empty = 'Debes seleccionar al menos un plan para comprar';
            alert(this.state.errors.empty);
        }
        if (this.state.buyer_plan && this.state.plans.buyerPlan) {
            this.state.errors.buyerplan = 'Ya has pagado por el plan comprador, por lo que no tienes que volver a pagar';
            alert(this.state.errors.buyerplan);
        }
        if (this.state.seller_plan && this.state.plans.sellerPlan) {
            this.state.errors.sellerPlan = 'Ya has pagado por el plan vendedor, por lo que no tienes que volver a pagar';
            alert(this.state.errors.sellerPlan);
        }
        if (this.state.designer_plan && this.state.plans.designerPlan) {
            this.state.errors.designerPlan = 'Ya has pagado por el plan diseñador, por lo que no tienes que volver a pagar';
            alert(this.state.errors.designerPlan)
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
                alert('No se pudo comprar el plan')
            }
        } catch (error) {
            console.error('Error:', error);
        }
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
        const { buyer_plan, seller_plan, designer_plan } = this.state;
        console.log(buyer_plan, seller_plan, designer_plan);
        return (
            <>
                <PageTitle title="Comprar Plan" />
                <div style={{ textAlign: 'center', }}>
                    <h1>Aqui tienes un pequeño resumen para que puedas decidir que plan comprar</h1>
                    <div className='container'>
                        <table>
                            <tr>
                                <th>Plan</th>
                                <th>Ventajas</th>
                                <th>Precio</th>
                                <th>Adquirido</th>
                            </tr>
                            <tr>
                                <td>Comprador</td>
                                <td>No pagarás gastos de envío</td>
                                <td>10€/mes</td>
                                <td>
                                    <div>
                                        {this.state.buyer_plan ? (
                                            <div className='plan-info'>
                                                <span role="img" aria-label="tick">✓</span>
                                                <ModalDeletePlan planName='buyer_plan' handleDeletePlan={this.handleDeletePlan} />
                                            </div>
                                        ) : (
                                            <span role="img" aria-label="cross"><RxCross1 /></span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Vendedor</td>
                                <td>Podrás destacar cinco productos</td>
                                <td>15€/mes</td>
                                <td>
                                    <div>
                                        {this.state.seller_plan ? (
                                            <div className='plan-info'>
                                                <span role="img" aria-label="tick">✓</span>
                                                <ModalDeletePlan planName='seller_plan' handleDeletePlan={this.handleDeletePlan} />
                                            </div>) : (
                                            <span role="img" aria-label="cross"><RxCross1 /></span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>Diseñador</td>
                                <td>
                                    Podrás destacar tres productos <br></br>
                                    Aumenta tu visibilidad como diseñador
                                </td>
                                <td>15€/mes</td>
                                <td>
                                    <div>
                                        {this.state.designer_plan ? (
                                            <div className='plan-info'>
                                                <span role="img" aria-label="tick">✓</span>
                                                <ModalDeletePlan planName='designer_plan' handleDeletePlan={this.handleDeletePlan} />
                                            </div>) : (
                                            <span role="img" aria-label="cross"><RxCross1 /></span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        </table>
                        *Si compras varios planes, sus ventajas son acumulables
                        <br></br>
                        **Mensualmente se cobrará por los planes que hayas comprado hasta que los canceles
                    </div>
                    {(!this.state.buyer_plan || !this.state.seller_plan || !this.state.designer_plan) && (
                        <form onSubmit={this.handleSubmit}>
                            <h2 >Selecciona el plan que quieras comprar</h2>
                            {!this.state.buyer_plan && (
                                <label>
                                    Plan Comprador
                                    <input
                                        type="checkbox"
                                        style={{ transform: 'scale(2)' }}
                                        checked={this.state.buyerPlan}
                                        onChange={() => this.handlePlanChange('buyerPlan')}
                                    />
                                </label>
                            )}
                            <br />
                            {!this.state.seller_plan && (
                                <label>
                                    Plan Vendedor
                                    <input
                                        type="checkbox"
                                        style={{ transform: 'scale(2)' }}
                                        checked={this.state.plans.sellerPlan}
                                        onChange={() => this.handlePlanChange('sellerPlan')}
                                    />
                                </label>
                            )}
                            <br />
                            {!this.state.designer_plan && (
                                <label>
                                    Plan Diseñador
                                    <input
                                        type="checkbox"
                                        style={{ transform: 'scale(2)' }}
                                        checked={this.state.plans.designerPlan}
                                        onChange={() => this.handlePlanChange('designerPlan')}
                                    />
                                </label>
                            )}
                            <br />

                            <button type="submit">Comprar</button>
                        </form>
                    )}
                </div>
            </>
        )
    }
}
