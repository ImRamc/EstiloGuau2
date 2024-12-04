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

const GraficasCupon = () => {
  const { userData } = useContext(UserContext);
  const { idRol } = userData; // Aunque no lo usamos en este componente

  const [cuponesActivos, setCuponesActivos] = useState(0);
  const [cuponesInactivos, setCuponesInactivos] = useState(0);
  const [cuponesUsados, setCuponesUsados] = useState(0);
  const [barDataMes, setBarDataMes] = useState({
    labels: [],
    datasets: []
  });
  const [barDataVendedor, setBarDataVendedor] = useState({
    labels: [],
    datasets: []
  });
  const [loading, setLoading] = useState(true);

  // Función para obtener los cupones y las estadísticas
  const fetchCupones = async () => {
    try {
      const response = await fetch('https://estilo-guau2-bak.vercel.app/api/cupones');
      const data = await response.json();
  
      // Verifica si los datos contienen la propiedad "status"
      console.log(data);  // Para ver la estructura de los datos

    // Asegúrate de que estamos comparando estrictamente el valor numérico de estado
        const activos = data.filter(cupon => cupon.estado === 1);  // Estado activo (1)
        const inactivos = data.filter(cupon => cupon.estado === 0);  // Estado inactivo (0)

      // Verifica la cantidad de cupones activos e inactivos
      console.log('Activos:', activos.length);
      console.log('Inactivos:', inactivos.length);
  
      setCuponesActivos(activos.length);
      setCuponesInactivos(inactivos.length);
    } catch (error) {
      console.error('Error al obtener los cupones:', error);
    }
  };
  

  const fetchCuponesUsados = async () => {
    try {
      const response = await fetch('https://estilo-guau2-bak.vercel.app/api/cupones/estadisticas');
      const data = await response.json();
      setCuponesUsados(data.length); // Suponiendo que 'data' contiene cupones usados
    } catch (error) {
      console.error('Error al obtener estadísticas de cupones usados:', error);
    }
  };

  const fetchCuponesPorMes = async () => {
    try {
      const response = await fetch('https://estilo-guau2-bak.vercel.app/api/dashboard/cupones');
      const data = await response.json();
  
      const labels = [...new Set(data.map(item => `${item.mes}-${item.anio}`))]; // Uniques mes-año
  
      // Crear un objeto para almacenar la cantidad de cupones usados por mes
      const cuponesPorMes = labels.reduce((acc, mesAnio) => {
        acc[mesAnio] = 0;
        return acc;
      }, {});
  
      data.forEach(item => {
        const mesAnio = `${item.mes}-${item.anio}`;
        cuponesPorMes[mesAnio] += item.cupones_usados;
      });
  
      const datasets = [{
        label: 'Cupones Usados',
        data: labels.map(mes => cuponesPorMes[mes]),
        backgroundColor: 'rgba(11, 59, 255, 0.3)',  // Cambio el color y ajusto la transparencia
        borderColor: 'rgba(54, 162, 235, 1)',        // Color del borde (sin transparencia)
        borderWidth: 1,
      }];
  
      setBarDataMes({
        labels: labels,
        datasets: datasets
      });
    } catch (error) {
      console.error('Error al obtener cupones por mes:', error);
    }
  };
  
  const fetchCuponesPorVendedor = async () => {
    try {
      const response = await fetch('https://estilo-guau2-bak.vercel.app/api/dashboard/cupones-vendedor');
      const data = await response.json();
  
      const labels = data.map(item => item.vendedor);
      const cuponesPorVendedor = data.map(item => item.cupones_usados);
  
      const datasets = [{
        label: 'Cupones Usados por Vendedor',
        data: cuponesPorVendedor,
        backgroundColor: 'rgba(0, 178, 255, 0.3)',  // Cambio el color y ajusto la transparencia
        borderColor: 'rgba(54, 162, 235, 1)',       // Color del borde (sin transparencia)
        borderWidth: 1,
      }];
  
      setBarDataVendedor({
        labels: labels,
        datasets: datasets
      });
    } catch (error) {
      console.error('Error al obtener cupones por vendedor:', error);
    }
  };
  

  useEffect(() => {
    setLoading(true);
    fetchCupones();
    fetchCuponesUsados();
    fetchCuponesPorMes();
    fetchCuponesPorVendedor();
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
        text: 'Estadísticas de Cupones',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Mes / Vendedor',
        }
      },
      y: {
        title: {
          display: true,
          text: 'Cantidad de Cupones Usados',
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
      <h2 className="font-bold text-2xl mb-4">Estadísticas de Cupones</h2>
      
      {/* Estadísticas de cupones */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold">Cupones Activos</h3>
          <p className="text-3xl font-bold">{cuponesActivos}</p>
        </div>
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold">Cupones Inactivos</h3>
          <p className="text-3xl font-bold">{cuponesInactivos}</p>
        </div>
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h3 className="text-xl font-semibold">Cupones Usados</h3>
          <p className="text-3xl font-bold">{cuponesUsados}</p>
        </div>
      </div>

      {/* Gráfica de Cupones Usados por Mes */}
      <div className="bg-custom p-4 rounded-lg shadow-xl mb-4">
        <h3 className="text-xl font-semibold mb-4">Gráfico de Cupones Usados por Mes</h3>
        <Bar data={barDataMes} options={barOptions} />
      </div>

      {/* Gráfica de Cupones Usados por Vendedor */}
      <div className="bg-custom p-4 rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Gráfico de Cupones Usados por Vendedor</h3>
        <Bar data={barDataVendedor} options={barOptions} />
      </div>
    </div>
  );
};

export default GraficasCupon;
