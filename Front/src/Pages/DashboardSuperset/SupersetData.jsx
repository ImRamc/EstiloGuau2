import React, { useState, useEffect } from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Footer from "../../Components/Footer/Footer";
import axios from 'axios';

const SupersetData = () => {
  const [loading, setLoading] = useState(true);
  const [iframeSrc, setIframeSrc] = useState(null); // Aquí guardamos la URL del iframe

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Aquí generamos la URL del dashboard de Superset (Asegúrate de actualizar el ID del dashboard)
        const dashboardUrl = "http://localhost:8088/superset/dashboard/13/";
        setIframeSrc(dashboardUrl); // Establecemos el iframe con la URL de Superset

        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el dashboard:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen">
      <Navbar />
      <Sidebar />
      <div className="carrito-container mx-4 flex-1">
        <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">
          Mi Superset
        </h2>
        <div className="mt-4">
          {loading ? (
            <p>Cargando datos del dashboard...</p>
          ) : iframeSrc ? (
            <iframe
              src={iframeSrc}
              width="100%" // Ajusta el tamaño según tus necesidades
              height="600px" // Ajusta la altura según sea necesario
              frameBorder="0"
              title="Dashboard Superset"
            ></iframe>
          ) : (
            <p className="text-red-500">Hubo un error al cargar el dashboard.</p>
          )}
        </div>
      </div>
      <div className="m-10">
        <Footer />
      </div>
    </div>
  );
};

export default SupersetData;
