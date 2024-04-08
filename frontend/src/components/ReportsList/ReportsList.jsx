import React from "react";
import "./ReportsList.css";
import Text, { TEXT_TYPES } from "../Text/Text";
import PageTitle from '../PageTitle/PageTitle';

const backend = import.meta.env.VITE_APP_BACKEND;

export default class ReportsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      product: null,
    };
  }

  async componentDidMount() {
    const id = localStorage.getItem('userId');
    if (id) {
      const petition = `${backend}/users/api/v1/users/${id}/get_user_data/`;

      const fetchUserData = async () => {
        try {
          const response = await fetch(petition);
          if (!response.ok) {
            throw new Error('Error al obtener al usuario');
          }
          const userData = await response.json();
          if (!userData.is_staff) {
            alert('No tienes permisos para acceder a esta página');
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Error al obtener al usuario:', error);
        }
      };
      fetchUserData();
    } else {
      alert('No tienes permisos para acceder a esta página');
      window.location.href = '/';
    }


    const getReports = async () => {
      const url = `${backend}/report/api/v1/reports/`;
      const token = localStorage.getItem('token');
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los reportes');
        }
        return response.json();
      }).then(data => {
        this.setState({ reports: data });
      }).catch(error => {
        console.error('Error al obtener los reportes:', error);
      });

    };
    getReports();
  }


  deleteProduct = async (productId) => {
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar el reporte y el producto reportado?');
    if (!confirmation) {
      return;
    }
  
    const url = `${backend}/products/api/v1/products/${productId}`;
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        alert('No se ha podido borrar el producto');
      } else {
        alert('Reporte y producto eliminado con éxito');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  render() {
    const { reports } = this.state;
    const REASONS = [
      ['P', 'Problema de calidad'],
      ['D', 'Derecho de Autor'],
      ['E', 'Problemas de envio/logistica'],
      ['C', 'Comportamiento abusivo del vendedor/comprador'],
      ['S', 'Spam o publicidad'],
      ['F', 'Fraude o estafa'],
      ['R', 'Robo de diseño/idea'],
      ['I', 'Inapropiado']
    ];

    return (
      <>
        {reports ? (
          <>
            <PageTitle title="Panel de administrador" />
            <div className="profile-title-container">
              <Text type={TEXT_TYPES.TITLE_BOLD} text='Listado de reportes de productos' />
            </div>
            <div className="users-list">
              {reports.map((report) => {
                const reason = REASONS.find(([key]) => key === report.reason);
                const reasonText = reason ? reason[1] : 'Razón desconocida';
                return (
                  <div key={report.id} className="user-card">
                    <h3>{report.title}</h3>
                    <p>{report.description}</p>
                    <p className="reasonBox">{reasonText}</p>

                    <div className="buttons-report">
                      <button className="plain-btn button green" onClick={() => window.location.href = `/user-details/${report.author_user}`}>Ver usuario</button>
                      <button className="plain-btn button green" onClick={() => window.location.href = `/product-details/${report.product}`}>Ver producto</button>
                      <button className="plain-btn button red" onClick={() => this.deleteProduct(report.product)}>
                      Eliminar
                    </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : <div>Loading...</div>}
      </>
    );
  }
}