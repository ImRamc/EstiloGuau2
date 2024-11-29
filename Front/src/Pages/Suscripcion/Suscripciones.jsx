import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const Suscripcion = () => {
  const [suscripciones, setSuscripciones] = useState([]);
  const { userData } = useContext(UserContext);
  const idUsuario = userData.idUsuario;
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    obtenerSuscripciones();
  }, []);

  const obtenerSuscripciones = async () => {
    try {
      const response = await axios.get('https://estilo-guau2-bak.vercel.app/suscripciones');
      setSuscripciones(response.data);
    } catch (error) {
      console.error('Error al obtener las suscripciones:', error);
      setError('No se pudieron cargar las suscripciones. Intenta más tarde.');
    }
  };

  const manejarSuscripcion = async (suscripcion) => {
    if (!idUsuario) {
    
     alert('Debes estar logueado para suscribirte.');
      return;
    }
    
    try {
      const response = await axios.get(`https://estilo-guau2-bak.vercel.app/empresa/verificar/${idUsuario}`);
      if (response.data.existe) {
        
       alert(`Ya tienes una empresa asociada: ${response.data.vendedor.nom_empresa}`);
        navigate('/perfil-vendedor');
        return;
      }
    } catch (error) {
      console.error('Error al verificar la empresa:', error);
      setError('Error al verificar la empresa.');
      return;
    }

   navigate(`/registro-vendedor?subscriptionId=${suscripcion.id_sub}`);
   //console.log(suscripcion.id_sub)
   //navigate("/ResumenCompraSub", { state: { id_sub: suscripcion.id_sub } });
  };

  const openModal = (suscripcion) => {
    setSelectedSubscription(suscripcion);
    setIsModalOpen(true);
  };

  const Modal = ({ isOpen, onClose, subscription }) => {
    if (!isOpen || !subscription) return null;

    let beneficios = [];
    if (Array.isArray(subscription.beneficios)) {
      beneficios = subscription.beneficios;
    } else if (typeof subscription.beneficios === 'string') {
      try {
        beneficios = JSON.parse(subscription.beneficios);
      } catch (error) {
        console.error('Error al parsear beneficios:', error);
        beneficios = []; // Asignar un valor por defecto en caso de error
      }
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold">{subscription.nombre_sub}</h2>
          <p>{subscription.descripcion_sub}</p>
          <p><strong>Precio:</strong> ${subscription.precio_sub}</p>
          <p><strong>Duración:</strong> {subscription.duracion_sub}</p>
          <p><strong>Beneficios:</strong></p>
          <ul className="list-disc pl-5">
            {Array.isArray(beneficios) && beneficios.map((beneficio, index) => (
              <li key={index}>{beneficio}</li>
            ))}
          </ul>
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 w-full items-center justify-center carrito-page flex flex-col min-h-96 shadow-lg">
  <Navbar />
  <h1 className="text-7xl text-center font-extrabold mb-7 mt-10 uppercase">SUSCRIPCIONES</h1>

  {error && <p className="text-red-500 text-center">{error}</p>}

  <div className="flex justify-center gap-8 flex-wrap">
    {suscripciones.map(suscripcion => (
      <div
        key={suscripcion.id_sub}
        className="bg-black text-white p-8 shadow-lg border-[16px] border-[#CCD5AE] max-w-lg flex flex-col items-center"
        style={{
          width: '350px',
          height: '500px', // Asegura una altura uniforme para todas las tarjetas
          overflow: 'hidden',
          borderRadius: '5rem', // Ajusta según el redondeado deseado
        }}
      >
        <div className="flex flex-col flex-grow items-center justify-between font-roboto">
          <h2 className="text-6xl font-extrabold text-center">{suscripcion.nombre_sub}</h2>
          <p className="text-2xl font-medium">
            {suscripcion.descripcion_sub}
          </p>
          <ul className="list-disc pl-5 text-1xl font-light">
            {Array.isArray(suscripcion.beneficios) && suscripcion.beneficios.map((beneficio, index) => (
              <li key={index}>{beneficio}</li>
            ))}
          </ul>
          <p className="text-2xl mb-8 text-center">Desde ${suscripcion.precio_sub}</p>
        </div>

        <button
          className="bg-[#FFFF00] text-black px-8 py-6 rounded-full text-3xl font-bold hover:bg-yellow-500 transition-colors"
          onClick={() => manejarSuscripcion(suscripcion)}
        >
          SUSCRIBIRSE
        </button>
      </div>
    ))}

{/** 
           <span
              className="text-blue-500 underline mt-2 cursor-pointer"
              onClick={() => openModal(suscripcion)}
            >
              Ver más
            </span>
           */}
        {suscripciones.length === 0 && (
          <div className="text-center text-gray-500">
            <h2 className="text-2xl">No hay suscripciones disponibles.</h2>
          </div>
        )}
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        subscription={selectedSubscription} 
      /> 
      
      <div className="">
      <Footer />
      </div>
    </div>
  );  
};

export default Suscripcion;
