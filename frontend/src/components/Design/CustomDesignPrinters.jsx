import React, { useState, useEffect } from "react";
import "./CustomDesignPrinters.css";
import "../CustomDesign.css";
import { useParams } from "react-router-dom";
import PageTitle from "../PageTitle/PageTitle";
import Button, { BUTTON_TYPES } from "../Button/Button";

const backend = import.meta.env.VITE_APP_BACKEND;

const CustomDesignPrinters = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${backend}/designs/details-to-printer/${id}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        console.log(response.status);
        if (response.ok) {
          const datos = await response.json();
          setData(datos);
        } else if (response.status === 403) {
          alert(
            "No tienes permiso para acceder a esta página. Solo los impresores pueden ver los detalles."
          );
          window.location.href = "/";
        } else if (response.status === 401) {
          alert("No estás logueado. Por favor, inicia sesión.");
          window.location.href = "/login";
        } else {
          alert("Error al cargar los detalles del diseño.");
          window.location.href = "/";
        }
        const userResponse = await fetch(`${backend}/designs/loguedUser`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setCurrentUser(userData);
        } else {
        }
      } catch (error) {
        console.log(error);
        alert("Error al cargar los detalles del diseño.");
      }
    };

    fetchData();
  }, [id]);

  const handlePrint = async () => {
    try {
      const response = await fetch(`${backend}/designs/update-status/${id}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        alert("Asignación realizada. Ya puede empezar a imprimir la pieza");
        window.location.href = "/";
      } else {
        alert("Error al actualizar el diseño.");
      }
    } catch (error) {
      console.error("Error al actualizar el diseño:", error);
    }
  };

  const handleFinish = async () => {
    try {
      const response = await fetch(
        `${backend}/designs/update-status-finish/${id}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      const result = await response.json();
      console.log(result);
      if (result.success === "Estado actualizado correctamente") {
        alert("Diseño terminado.");
        window.location.href = "/";
      } else {
        alert("Error al actualizar el diseño.");
      }
    } catch (error) {
      console.error("Error al actualizar el diseño:", error);
    }
  };

  return (
    <>
      <PageTitle title="Detalles de la solicitud" />

      {data &&  (
        <>
          <div
            style={{ textAlign: "center", margin: "30px", fontSize: "20px" }}
          >
            <h1>Detalles de la solicitud de impresión</h1>
            {data && (
              <>
                <p>Nombre: {data.name}</p>
                <p>Cantidad: {data.quantity}</p>
                <p>
                  Color:{" "}
                  {data.color === "red"
                    ? "rojo"
                    : data.color === "green"
                    ? "verde"
                    : data.color === "blue"
                    ? "azul"
                    : "Color desconocido"}
                </p>
                <h2>Datos de entrega</h2>
                <p>Ciudad: {data.city}</p>
                <p>Código Postal: {data.postal_code}</p>
                <p>Dirección: {data.address}</p>
                <p>
                  Estado:{" "}
                  {data.status === "searching"
                    ? "Buscando impresor"
                    : data.status === "printing"
                    ? "Imprimiendo"
                    : data.status === "printed"
                    ? "Impreso"
                    : "Estado desconocido"}
                </p>
              </>
            )}
          </div>
          <div className="my-design-summary">
            <div className="my-design-summary-section-title">Resumen</div>
            <div className="my-design-summary-contents">
              {data && (
                <>
                  <h3 className="summary-title">Resumen del diseño</h3>

                  <ul className="summary-list">
                    <li>
                      <strong>Dimensiones: </strong>
                      {data.dimensions.width}cm x {data.dimensions.height}cm x{" "}
                      {data.dimensions.depth}cm
                    </li>
                    <li>
                      <strong>Área/Volumen: </strong>
                      {data.area}cm²/ {data.volume}cm³
                    </li>
                    <li>
                      <strong>Peso: </strong>
                      {data.weight}g
                    </li>
                    <li>
                      <strong>Calidad: </strong>
                      {data.quality}
                    </li>
                  </ul>

                  <div className="summary-price">
                    <p className="price">
                      Precio: <strong>{data.price}€</strong>
                    </p>
                    <p className="iva">(IVA y gastos de envío incluidos)</p>
                  </div>
                </>
              )}
            </div>
            {data.status === "printing" && (
              <div style={{ textAlign: "center", alignItems: "center" }}>
                {data.status === "printing" && (
                  <button className="large-btn button" onClick={handleFinish}>
                    Terminar impresión
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {data && currentUser && (
        <>
          {!data?.printer && currentUser.id != data.buyer && (
            <div style={{ textAlign: "center", alignItems: "center" }}>
              <button
                className="large-btn button"
                style={{ marginLeft: "45%" }}
                onClick={handlePrint}
              >
                Imprimir
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CustomDesignPrinters;
