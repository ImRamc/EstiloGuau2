import React, {useState,useEffect, useContext } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Line } from 'react-chartjs-2';
import { UserContext } from '../../Context/UserContext';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Graficas = () => {
  const { userData } = useContext(UserContext);
  const { idRol } = userData;

    const [ventasMensuales, setVentasMensuales] = useState([]);
    const [ventasSemanales, setVentasSemanales] = useState(0);
    const [ventasDiarias, setVentasDiarias] = useState(0);

    const [anioActual, setAnioActual] = useState('');
    const [mesActual, setMesActual] = useState('');

    const [fechaInicioSemana, setFechaInicioSemana] = useState(null);
    const [fechaFinSemana, setFechaFinSemana] = useState(null);

    const obtenerFechaActual = () => {
      const ahora = new Date();
      const dia = ahora.getDate();
      const mes = ahora.getMonth() + 1; // Los meses son base 0 en JavaScript
      const anio = ahora.getFullYear();
  
      // Formatear la fecha como necesario (ejemplo: DD/MM/YYYY)
      const fechaFormateada = `${dia}/${mes}/${anio}`;
  
      return fechaFormateada;
    };

    const fetchVentasMensuales = async () => {
      // Función para obtener ventas mensuales
      try {
        let response;
        if (userData.idRol === 2) {
          // Si el rol es 2, obtenemos las ventas mensuales para un vendedor específico
          response = await axios.get(`https://estilo-guau2-bak.vercel.app/ventas/mensuales/${userData.idVendedor}`);
        } else if (userData.idRol === 3) {
          // Si el rol es 3, obtenemos las ventas mensuales generales
          response = await axios.get(`https://estilo-guau2-bak.vercel.app/ventas/mensuales`);
        } else {
          console.warn('Rol no válido para obtener ventas mensuales.');
          return; // O maneja el caso de rol no válido según tus necesidades
        }
    
        setVentasMensuales(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching ventas mensuales:', error);
      }
    };

    // Función para obtener ventas semanales
    const fetchVentasSemanales = async () => {
      try {
        let response;
        if (userData.idRol === 2) {
          // Si el rol es 3, obtenemos las ventas semanales para un vendedor específico
          response = await axios.get(`https://estilo-guau2-bak.vercel.app/ventas/semana/${userData.idVendedor}`);
        } else if (userData.idRol === 3) {
          // Si el rol es 2, obtenemos las ventas semanales generales
          response = await axios.get(`https://estilo-guau2-bak.vercel.app/ventas/semana`);
        } else {
          console.warn('Rol no válido para obtener ventas semanales.');
          return; // Maneja el caso de rol no válido según tus necesidades
        }
    
        setVentasSemanales(response.data[0]?.total_ventas_semana);
      } catch (error) {
        console.error('Error fetching ventas semanales:', error);
      }
    };
    

      // Función para obtener ventas diarias
      const fetchVentasDiarias = async () => {
        try {
          let response;
          if (userData.idRol === 3) {
            // Si el rol es 3, obtenemos las ventas diarias generales
            response = await axios.get(`https://estilo-guau2-bak.vercel.app/ventas/dia`);
          } else if (userData.idRol === 2) {
            // Si el rol es 2, obtenemos las ventas diarias para un vendedor específico
            response = await axios.get(`https://estilo-guau2-bak.vercel.app/ventas/dia/${userData.idVendedor}`);
          } else {
            console.warn('Rol no válido para obtener ventas diarias.');
            return; // O maneja el caso de rol no válido según tus necesidades
          }
      
          setVentasDiarias(response.data[0]?.total_ventas_dia || 0);
        } catch (error) {
          console.error('Error fetching ventas diarias:', error);
        }
      };
      

    // Llamar a las funciones al cargar el componente
    useEffect(() => {
      fetchVentasMensuales();
      fetchVentasSemanales();
      fetchVentasDiarias();
    }, []);


  
    useEffect(() => {
      const fechaActual = new Date();
      const anio = fechaActual.getFullYear();
      const mes = fechaActual.toLocaleString('default', { month: 'long' }); // Obtener nombre del mes
  
      setAnioActual(anio.toString());
      setMesActual(mes);
    }, []);

    const [productosMasVendidos, setProductosMasVendidos] = useState([]);

    useEffect(() => {
      const fetchProductosMasVendidos = async () => {
        try {
          let response;
          if (userData.idRol === 3) {
            // Si el rol es 3, obtenemos los productos más vendidos sin especificar vendedor
            response = await axios.get(`https://estilo-guau2-bak.vercel.app/mas-vendidos`);
            console.log('Datos recibidos:', response.data); // Verifica los datos recibidos desde la API
          } else if (userData.idRol === 2) {
            // Si el rol es 2, obtenemos los productos más vendidos para un vendedor específico
            response = await axios.get(`https://estilo-guau2-bak.vercel.app/mas-vendidos/${userData.idVendedor}`);
            //console.log('Datos recibidos:', response.data); // Verifica los datos recibidos desde la API
          } else {
            console.warn('Rol no válido para obtener productos más vendidos.');
            return; // O maneja el caso de rol no válido según tus necesidades
          }
      
          setProductosMasVendidos(response.data);
        } catch (error) {
          console.error('Error al obtener productos más vendidos:', error);
        }
      };
      
    
      fetchProductosMasVendidos();
    }, []);


  useEffect(() => {
    // Calcula las fechas de inicio y fin de la semana actual
    const inicioSemana = moment().startOf('week').format('DD/MM/YYYY');
    const finSemana = moment().endOf('week').format('DD/MM/YYYY');
    
    setFechaInicioSemana(inicioSemana);
    setFechaFinSemana(finSemana);
  }, []);
  

//#region  Ganancias por mes
    const [lineData, setLineData] = useState({
      labels: [],
      datasets: [
        {
          label: 'Ganancias',
          data: [],
          fill: false,
          borderColor: 'rgba(0, 0, 0, 1)',
          tension: 0.1,
        },
      ],
    });
  
    useEffect(() => {
      const fetchGananciasMensuales = async () => {
        try {
          let response;
      
          if (userData.idRol === 2) {
            // Si el rol es 2, obtenemos las ganancias mensuales para un vendedor específico
            response = await axios.get(`https://estilo-guau2-bak.vercel.app/ganancias/mensuales/${userData.idVendedor}`);
          } else if (userData.idRol === 3) {
            // Si el rol es 3, obtenemos las ganancias mensuales generales
            response = await axios.get(`https://estilo-guau2-bak.vercel.app/ganancias/mensuales`);
          } else {
            console.warn('Rol no válido para obtener ganancias mensuales.');
            return; // Maneja el caso de rol no válido según tus necesidades
          }
      
          const data = response.data;
          // Procesar los datos para las gráficas
          const labels = data.map(item => `${item.mes}/${item.anio}`);
          const ganancias = data.map(item => item.total_ganancias);
      
          setLineData({
            labels: labels,
            datasets: [
              {
                ...lineData.datasets[0],
                data: ganancias,
              },
            ],
          });
      
          //console.log('Datos recibidos:', response.data);
        } catch (error) {
          console.error('Error fetching ganancias mensuales:', error);
        }
      };
  
      fetchGananciasMensuales();
    }, []);
  


  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Últimos 6 meses',
      },
    },
  };
  //#endregion

  return (
    <div className="container mx-auto px-32 p-4 grid grid-cols-3 gap-4">
    <h1 className="text-start text-4xl font-bold">Resumen de ganancias</h1>
      <div className="col-span-3 grid grid-cols-3 gap-4">
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h2 className="my-2 text-start text-xl font-semibold">Ventas por Mes</h2>
          <p className="m-2 text-start text-3xl font-bold">
      {ventasMensuales.length > 0 
        ? `$${ventasMensuales.reduce((total, venta) => total + venta.total_ventas, 0).toFixed(2)}`
        : '$0.00'}
    </p>          <p className="m-2 text-start text-sm text-green-700">Año: {anioActual} Mes: {mesActual} </p>
        </div>
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h2 className="my-2 text-start text-xl font-semibold">Ventas de la Semana</h2>
          <p className="m-2 text-start text-3xl font-bold">
      ${ventasSemanales ? ventasSemanales.toFixed(2) : '0.00'} {/* Verificación para evitar null */}
    </p>          <p className="text-start text-sm text-green-700">Semana del: {fechaInicioSemana && fechaFinSemana ? `${fechaInicioSemana} al ${fechaFinSemana}` : 'Cargando...'}</p>
        </div>
        <div className="p-4 bg-custom rounded-lg shadow-xl text-center">
          <h2 className="my-2 text-start text-xl font-semibold">Ventas del Día</h2>
          <p className="m-2 text-start text-3xl font-bold">
      ${ventasDiarias ? ventasDiarias.toFixed(2) : '0.00'} {/* Verificación para evitar null */}
    </p>          <p className="text-start text-sm text-green-700">Fecha: {obtenerFechaActual()}</p>
        </div>
      </div>
      <div className="col-span-2 pb-8 pl-2 pt-2 h-auto bg-custom rounded-md shadow-xl">
      <h2 className='my-2 text-start text-xl font-semibold'>Ganancias por mes</h2>
        <Line data={lineData} options={lineOptions} />
      </div>

      <div className="p-4 bg-custom rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold">Artículos más vendidos</h2>
        <div className="mt-4">
        {productosMasVendidos.map((producto, index) => (
          <div key={index} className="flex flex-row  mb-4">
            <img src={`https://estilo-guau2-bak.vercel.app/images/${producto.primera_foto}`}
                      alt="" className=" h-32 p-3" />
            <p className=" flex flex-col text-lg font-bold mt-2">{producto.nombre_producto}
            <span className='text-lg font-light mt-2'> {producto.descripcion}</span>
            <span className='text-lg font-light mt-2'> ${producto.precio}</span>
            </p>
            
          </div>
        ))}
        {productosMasVendidos.length === 0 && <p>No hay productos vendidos aún.</p>}
        </div>
      </div>
    
    </div>
  );
};
export default Graficas;
