import React, { useContext } from "react";
import { UserContext } from '../../Context/UserContext';
import Navbar from '../../Components/Navbar/Navbar';
import Sidebar from '../../Components/Sidebar/Sidebar';
import GraficasSuscripcion from '../../Components/Graficas/GraficasSuscripcion';
import Footer from "../../Components/Footer/Footer";

const DashboardSuscripciones = () => {
  const { userData } = useContext(UserContext);

  // Define las rutas de API
  const apiEndpoints = {
    suscripciones: '/api/dashboard/suscripciones',
    suscripcionesMes: '/api/dashboard/suscripciones-mes',
    suscripcionesVendedor: '/api/dashboard/suscripciones-vendedor',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <div className="flex-1">
          <div className="p-0">
            <h2 className="font-bold mb-4 text-left text-4xl">Dashboard de Suscripciones</h2>
            <p className="font-light mb-4 text-left text-xl">Estadísticas de suscripciones y usuarios suscritos por todos los vendedores</p>
            <div className="w-full h-full">
              <GraficasSuscripcion apiEndpoints={apiEndpoints} />
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

export default DashboardSuscripciones;
