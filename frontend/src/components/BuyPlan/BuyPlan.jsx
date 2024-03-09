import React from 'react';
import './BuyPlan.css';

const backend = JSON.stringify(import.meta.env.VITE_APP_BACKEND);
const frontend = JSON.stringify(import.meta.env.VITE_APP_FRONTEND);

export default class BuyPlan extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            user : null,
            plans: {
                buyerPlan: false,
                sellerPlan: false,
                designerPlan: false
            },
            buyer_plan: false,
            seller_plan: false,
            designer_plan:false,
            errors:{}
        };
    }

    async componentDidMount(){
        if (!localStorage.getItem('token')) {
            alert('Debes iniciar sesión para poder comprar un plan');
            window.location.href = '/';
        }else{
            try{
                let petition = backend + '/designs/loguedUser';
                    petition = petition.replace(/"/g, '');
                    const response = await fetch(petition, {
                    headers: {'Authorization': `Bearer ${localStorage.getItem('token')}`}
                });
                const datos = await response.json();
                this.state.buyer_plan= datos.buyer_plan;
                this.state.seller_plan = datos.seller_plan;
                this.state.designer_plan = datos.designer_plan;
            }catch(e){
                console.log(e);
            }
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
        if(!this.state.plans.buyerPlan && !this.state.plans.sellerPlan && !this.state.plans.designerPlan){
            this.state.errors.empty = 'Debes seleccionar al menos un plan para comprar';
            alert(this.state.errors.empty);
        }
        if(this.state.buyer_plan && this.state.plans.buyerPlan){
            this.state.errors.buyerplan = 'Ya has pagado por el plan comprador, por lo que no tienes que volver a pagar';
            alert(this.state.errors.buyerplan);
        }
        if(this.state.seller_plan && this.state.plans.sellerPlan){
            this.state.errors.sellerPlan = 'Ya has pagado por el plan vendedor, por lo que no tienes que volver a pagar';
            alert(this.state.errors.sellerPlan);
        }
        if(this.state.designer_plan && this.state.plans.designerPlan){
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
            
            if(response.ok){
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

    render(){
        return(
            <>
                <div style={{textAlign:'center',}}>
                    <h1>Aqui tienes un pequeño resumen para que puedas decidir que plan comprar</h1>
                    <div className='container'>
                        <table>
                            <tr>
                                <th>Plan</th>
                                <th>Ventajas</th>
                                <th>Precio</th>
                            </tr>
                            <tr>
                                <td>Comprador</td>
                                <td>No pagarás gastos de envío</td>
                                <td>10€/mes</td>
                            </tr>
                            <tr>
                                <td>Vendedor</td>
                                <td>Podrás destacar cinco productos</td>
                                <td>15€/mes</td>
                            </tr>
                            <tr>
                                <td>Diseñador</td>
                                <td>
                                    Podrás destacar tres productos <br></br>
                                    Aumenta tu visibilidad como diseñador
                                </td>
                                <td>15€/mes</td>
                            </tr>
                        </table>
                        *Si compras varios planes, sus ventajas son acumulables
                        <br></br>
                        **Mensualmente se cobrará por los planes que hayas comprado hasta que los canceles
                    </div>
                    <h2 >Selecciona el plan que quieras comprar</h2>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Plan Comprador
                            <input
                                type="checkbox"
                                style={{ transform: 'scale(2)' }}
                                checked={this.state.plans.buyerPlan}
                                onChange={() => this.handlePlanChange('buyerPlan')}
                            />
                        </label>
                        <br />
                        <label>
                            Plan Vendedor
                            <input
                                type="checkbox"
                                style={{ transform: 'scale(2)' }}
                                checked={this.state.plans.sellerPlan}
                                onChange={() => this.handlePlanChange('sellerPlan')}
                            />
                        </label>
                        <br />
                        <label>
                            Plan Diseñador
                            <input
                                type="checkbox"
                                style={{ transform: 'scale(2)' }}
                                checked={this.state.plans.designerPlan}
                                onChange={() => this.handlePlanChange('designerPlan')}
                            />
                        </label>
                        <br />
                        
                        <button type="submit">Comprar</button>
                    </form>

                </div>
            </>
        )
    }
}
