import React, { useContext, useEffect, useState } from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import GraficasCupon from '../../Components/Graficas/GraficasCupon'; // Importación de las gráficas de cupones
import Footer from "../../Components/Footer/Footer";
import axios from 'axios';

const DashboardCupones = () => {
  const { userData } = useContext(UserContext);
  const { idRol } = userData;

  // Estado para almacenar los cupones usados por mes
  const [cuponesData, setCuponesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar los datos de cupones cuando el componente se monta
  useEffect(() => {
    axios.get('/api/dashboard/cupones')
      .then((response) => {
        setCuponesData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al cargar los cupones:', error);
        setLoading(false);
      });
  }, []);

  // Mostrar una carga mientras se obtienen los datos
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <div className="flex-1">
          <div className="p-0">
            {/* Título y descripción actualizados */}
            <h2 className="font-bold mb-4 text-left text-4xl">Dashboard de Cupones</h2>
            <p className="font-light mb-4 text-left text-xl">Estadísticas de cupones usados por todos los vendedores</p>

            <div className="w-full h-full">
              {/* Se pasa la data de cupones al componente de gráficas */}
              <GraficasCupon cuponesData={cuponesData} />
            </div>
          </div>
        </div>
      </div>
      <div className="m-0">
        <Footer />
      </div>
    </div>
  );
};

export default DashboardCupones;
