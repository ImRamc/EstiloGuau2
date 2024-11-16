import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../Context/UserContext';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GraficasSuscripcion = () => {
  const { userData } = useContext(UserContext);
  const { idRol } = userData;

  const [totalSuscripciones, setTotalSuscripciones] = useState(0);
  const [totalEmpresas, setTotalEmpresas] = useState(0);
  const [barDataMes, setBarDataMes] = useState({
    labels: [],
    datasets: []
  });
  const [barDataVendedor, setBarDataVendedor] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch total suscripciones
  const fetchTotalSuscripciones = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suscripciones');
      const data = await response.json();
      setTotalSuscripciones(data.total_suscripciones || 0);
    } catch (error) {
      console.error('Error al obtener total de suscripciones:', error);
    }
  };

  // Fetch total empresas
  const fetchTotalEmpresas = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suscripciones/total-empresas');
      const data = await response.json();
      setTotalEmpresas(data.total_empresas);  // Asegúrate de que esta línea actualiza el estado correctamente
    } catch (error) {
      console.error('Error al obtener total de suscripciones:', error);
    }
  };

  // Fetch suscripciones por mes
  const fetchSuscripcionesPorMes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suscripciones/por-mes');
      const data = await response.json();

      const labels = data.map(item => item.mes);
      const datasets = [{
        label: 'Suscripciones por Mes',
        data: data.map(item => item.cantidad),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }];

      setBarDataMes({
        labels,
        datasets
      });
    } catch (error) {
      console.error('Error al obtener suscripciones por mes:', error);
    }
  };

  const fetchSuscripcionesPorTipo = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suscripciones/empresas-por-tipo');
      
      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(`Error en la respuesta: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('Datos recibidos:', data);
  
      // Verifica si los datos están en el formato esperado
      if (Array.isArray(data) && data.length > 0) {
        const suscripcionesCount = data.reduce((acc, curr) => {
          const tipo = curr.nombre_sub;
          const cantidad = curr.cantidad_empresas;
  
          if (tipo && cantidad) {
            if (acc[tipo]) {
              acc[tipo] += cantidad;
            } else {
              acc[tipo] = cantidad;
            }
          }
          return acc;
        }, {});
        
        const labels = Object.keys(suscripcionesCount);
        const dataCount = Object.values(suscripcionesCount);
        setBarDataVendedor({
          labels: labels,
          datasets: [{
            label: 'Cantidad de Empresas por Tipo de Suscripción',
            data: dataCount,
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
          }]
        });
      } else {
        console.error('La respuesta de la API no tiene el formato esperado:', data);
      }
    } catch (error) {
      console.error('Error al obtener suscripciones por tipo:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTotalSuscripciones();
    fetchTotalEmpresas();
    fetchSuscripcionesPorMes();
    fetchSuscripcionesPorTipo();
    setLoading(false);
  }, []);

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Estadísticas de Suscripciones',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tipo de Suscripción',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Empresas',
        },
        beginAtZero: true,
      }
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-32 p-4">
      <h2 className="font-bold text-2xl mb-4">Estadísticas de Suscripciones</h2>

      {/* Estadísticas Totales */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold">Total Suscripciones</h3>
          <p className="text-3xl font-bold">{totalSuscripciones}</p>
        </div>
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold">Total Empresas</h3>
          <p className="text-3xl font-bold">{totalEmpresas}</p>
        </div>
      </div>

      {/* Gráfica de Suscripciones por Tipo */}
      <div className="bg-custom p-4 rounded-lg shadow-xl mb-4">
        <h3 className="text-xl font-semibold mb-4">Cantidad de Empresas por Tipo de Suscripción</h3>
        <Bar data={barDataVendedor} options={barOptions} />
      </div>

      {/* Gráfica de Suscripciones por Mes */}
      <div className="bg-custom p-4 rounded-lg shadow-xl mb-4">
        <h3 className="text-xl font-semibold mb-4">Gráfico de Suscripciones por Mes</h3>
        <Bar data={barDataMes} options={barOptions} />
      </div>
    </div>
  );
};

export default GraficasSuscripcion;
