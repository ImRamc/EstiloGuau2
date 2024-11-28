import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { LocationContext } from '../../Context/LocationContext';

const RegistroVendedor = () => {
  const { location, city, country, latitude, longitude, CodigoPostal, calle, colonia, numero } = useContext(LocationContext); // Asegúrate de que latitude y longitude estén disponibles
  const { userData } = useContext(UserContext);
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom_empresa: '',
    direccion: location || 'Dirección no disponible',  // Valor predeterminado
    telefono: '',
    pais: country || 'País no disponible',           // Valor predeterminado
    estado: city || 'Estado no disponible',           // Valor predeterminado
    codigo_postal: CodigoPostal || 'No disponible',
    rfc: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');




  useEffect(() => {
    // Obtener la ubicación del usuario cuando el componente se monta
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitud(position.coords.latitude);
          setLongitud(position.coords.longitude);
        },
        (error) => {
          console.error('Error al obtener la geolocalización:', error);
          setError('No se pudo obtener la geolocalización');
        }
      );
    } else {
      setError('La geolocalización no es compatible con este navegador.');
    }
  })

  useEffect(() => {
    const verificarEmpresa = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/empresa/verificar/${userData.idUsuario}`);
        if (response.data.existe) {
          alert(`Ya tienes una empresa asociada: ${response.data.vendedor.nom_empresa}`);
          navigate('/perfil-vendedor');
        }
      } catch (error) {
        console.error('Error al verificar la empresa:', error);
        setError('Error al verificar la empresa.');
      }
    };

    if (userData?.idUsuario) {
      verificarEmpresa();
    }
  }, [userData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!latitud || !longitud) {
      setError('Latitud y longitud no disponibles');
      return;
    }

    try {
      // Obtener ID de suscripción desde los parámetros de la URL
      const queryParams = new URLSearchParams(window.location.search);
      const subscriptionId = queryParams.get('subscriptionId');

      if (!subscriptionId) {
        setError('ID de suscripción no disponible.');
        return;
      }

      const idRol = userData.idRol; // Si el rol se debe obtener del contexto, asegúrate que sea el correcto

      // Registrar vendedor
      await axios.post('http://localhost:3001/registro-vendedor', {
        ...formData,
        latitud,
        longitud,
        idUsuario: userData.idUsuario,
        id_sub: subscriptionId, // Usar el ID de la suscripción de la URL
      });

      setSuccessMessage('Vendedor registrado con éxito.');
      setError('');
      navigate("/ResumenCompraSub", { state: { id_sub: subscriptionId } });
      //navigate('/perfil-vendedor');
    } catch (error) {
      console.error('Error al registrar el vendedor:', error);
      setError('Error al registrar. Intenta de nuevo más tarde.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
      <Navbar />
      <div className="flex-grow flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl mb-4 text-center">Registrar Vendedor</h2>
          {error && <p className="text-red-500">{error}</p>}
          {successMessage && <p className="text-green-500">{successMessage}</p>}
          
          <div className="flex flex-col space-y-4">
            <input type="text" name="nom_empresa" placeholder="Nombre de la empresa" onChange={handleChange} required maxLength={25} />
            <input type="text" name="direccion" placeholder="Dirección" value={location} onChange={handleChange} required />
            <input type="text" name="telefono" placeholder="Teléfono" onChange={handleChange} required maxLength={10}/>
            <input type="text" name="pais" placeholder="País" value={country} onChange={handleChange} required />
            <input type="text" name="estado" placeholder="Estado" value={city} onChange={handleChange} required />
            <input type="text" name="codigo_postal" placeholder="Código Postal" value={CodigoPostal} onChange={handleChange} required />
            <input type="text" name="rfc" placeholder="RFC" onChange={handleChange} required maxLength={12} />
          </div>

          <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Registrar Vendedor</button>
        </form>
      </div>
      <div>
         <Footer />
      </div>
    </div>
  );
};

export default RegistroVendedor;
