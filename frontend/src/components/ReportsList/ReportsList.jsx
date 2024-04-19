import React from "react";
import "./ReportsList.css";
import Text, { TEXT_TYPES } from "../Text/Text";
import PageTitle from '../PageTitle/PageTitle';
import { useState } from 'react';

const backend = import.meta.env.VITE_APP_BACKEND;

export default class ReportsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reports: [],
      product: null,
      isReportUser: false,
      isReportProduct: false
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

  deleteUser = async (userId) => {
    const confirmation = window.confirm('¿Estás seguro de que quieres eliminar el reporte y el usuario reportado?');
    if (!confirmation) {
      return;
    }

    const url = `${backend}/users/api/v1/users/${userId}`;
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
        alert('No se ha podido borrar el usuario');
      } else {
        alert('Usuario y producto eliminado con éxito');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  render() {
    const { reports, isReportUser, isReportProduct } = this.state;
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

    const showReports = (isReportUser, isReportProduct) => {
      if (isReportUser && isReportProduct) {
        return reports;
      } else if (isReportProduct) {
        return reports.filter(report => report.user === null);
      } else if (isReportUser) {
        return reports.filter(report => report.product === null);
      } else {
        return [];
      }
    };

    const filteredReports = showReports(isReportUser, isReportProduct);

    return (
      <>
        {reports ? (
          <>
            <PageTitle title="Panel de administrador" />
            <div className="profile-title-container">
              <Text type={TEXT_TYPES.TITLE_BOLD} text='Listado de reportes' />
              <div className="report-switches">
                <div className="report-switch-column">
                  <p>Usuarios</p>
                  <label class="report-switch">
                    <input type="checkbox"
                      checked={isReportUser}
                      onChange={(e) => this.setState({ isReportUser: e.target.checked })} />
                    <span class="report-slider round"></span>
                  </label>

                </div>
                <div className="report-switch-column">
                  <p>Productos</p>
                  <label class="report-switch">
                    <input type="checkbox"
                      checked={isReportProduct}
                      onChange={(e) => this.setState({ isReportProduct: e.target.checked })} />
                    <span class="report-slider round"></span>

                  </label>

                </div>


              </div>
            </div>
            <div>
              {/* <label className="report-list-switch">
                <input type="checkbox" className="report-list-checkbox">
                  <div className="report-list-slider"></div>
                </input>
              </label>
              <label className="report-list-switch">
                <input type="checkbox" className="report-list-checkbox">
                  <div className="report-list-slider"></div>
                </input>
              </label> */}
            </div>
            {filteredReports.length === 0 && <div style={{ margin: 'auto', display: 'flex', justifyContent: 'center' }}>
                <p>No hay reportes</p>
              </div>}
            <div className="report-users-list">
              {filteredReports.map((report) => {
                const reason = REASONS.find(([key]) => key === report.reason);
                const reasonText = reason ? reason[1] : 'Razón desconocida';
                return (
                  <div key={report.id} className="report-user-card">
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <p className="report-reasonBox">{report.product ? 'Reporte de producto' : 'Reporte de usuario'}</p>
                      <p className="report-reasonBox">{reasonText}</p>
                    </div>
                    <h3>{report.title}</h3>
                    <p>{report.description}</p>
                    <div className="reports-image-container">
                      <img src={report.image} alt="report" className="reports-image"/>
                    </div>


                    <div className="report-buttons">
                      <button className="plain-btn button green" onClick={() => window.location.href = `/user-details/${report.author_user}`}>Ver autor</button>
                      <button className="plain-btn button green" onClick={() => window.location.href = report.product ? `/product-details/${report.product}` : `/user-details/${report.user}`}>{report.product ? 'Ver producto' : 'Ver usuario'} </button>
                      <button className="plain-btn button red" onClick={() => report.product ? this.deleteProduct(report.product) : this.deleteUser(report.user)}>
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