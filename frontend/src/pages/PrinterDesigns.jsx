import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DesignDetails from '../components/Design/CustomDesign';

export const SearchingPrinterDesignsPage = () => {
 const { designId } = useParams();
 const [designs, setDesigns] = useState([]);
 const token = localStorage.getItem('token');
 const backend = import.meta.env.VITE_APP_BACKEND;

 useEffect(() => {
    const url = `${backend}/designs/searching_printer`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(`Error en la petición: ${response.status}`);
    })
    .then(data => {
      if (data && data.length > 0) {
         const designsArray = data.map(design => {
           return design;
         });
         setDesigns(designsArray);
         console.log(designsArray);
      }      
     })
    .catch(error => {
      console.error('Hubo un problema con la petición fetch:', error);
    });
 }, [designId, token]);

 return (
    <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        alignItems: 'flex-start',
    }}>
      {designs.map((design) => (
        <Link key={design.custom_design_id} to={`/designs/details-to-printer/${design.custom_design_id}`}>
          <DesignDetails design={design} />
        </Link>
      ))}
    </div>
 );
};
