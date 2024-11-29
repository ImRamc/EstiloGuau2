import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import Footer from "../../Components/Footer/Footer";
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import ModalPasarelaPago from "../../Components/Payments/ModalPasarelaPago";
import ModalCupones from "../../Components/Payments/ModalCupones";

const ResumenCompraSub = () => {

  const location = useLocation();
  const { state } = location || {};
  const { id_sub } = location.state || {}; // Obtenemos idSub desde el estado
  const { userData } = useContext(UserContext);
  const [error, setError] = useState(null);
  const [producto, setProducto] = useState({
    idRol: '',
    nombre_sub: '',
    descripcion_sub: 0, // Inicializar con 0 o un valor numérico
    precio_sub: '',
    duracion_sub: '',
    beneficios: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCupon, setIsModalOpenCupon] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const toggleModalCupones = () => setIsModalOpenCupon((prev) => !prev);

  let iva = 16;
  iva = parseFloat((producto.precio_sub  * (iva / 100)).toFixed(2));
  let total = parseFloat((producto.precio_sub  + iva).toFixed(2));
  // Lógica para obtener el producto
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`https://estilo-guau2-bak.vercel.app/api/suscripcion/${id_sub}`);
        console.log("Respuesta de la API:", response.data);
        const producto = response.data;
        if (producto.porcentaje_descuento !== 0) {
          const descuento = (producto.precio_sub * producto.porcentaje_descuento) / 100;
          const precioConDescuento = producto.precio_sub - descuento;
          producto.precioConDescuento = precioConDescuento;
        } else {
          producto.precioConDescuento = 0;
        }
        setProducto(producto);
      } catch (error) {
        console.error(`Error al obtener el producto con ID ${idProducto}:`, error);
        setError('Error al obtener el producto.');
      }
    };

    obtenerProducto();
  }, [id_sub]);




  return (
    <div className="w-full">
      <div className="w-full px-52 pt-28 font-roboto">
        <Navbar />
        <div className="shadow-md shadow-slate-300">
          <h1 className="m-5 font-bold text-4xl text-center">Resumen de Compra</h1>

          <div className="shadow-md shadow-slate-200 pb-2">
            <section className="mb-6 m-5">
              <h2 className="text-3xl font-bold flex justify-between items-center my-5">
                <span>1. Tus datos</span>
                <button className="text-blue-600 hover:underline">Editar</button>
              </h2>
              <div className="mx-10">
                <p>{userData.nombre} {userData.apellido}</p>
                <p>{userData.email}</p>
              </div>
            </section>
          </div>

          <div className="shadow-md shadow-slate-200 pb-2">
            <section className="mb-6 m-5">
              <h2 className="text-3xl font-bold flex justify-between items-center my-5">2. Resumen de compra</h2>
              <div className="mx-10">
                <div className="w-1/2">
                  <p className="font-black">Nombre de la suscripción: <span className="font-light">{producto.nombre_sub}</span> </p>                  <p className="font-black">
                    Vigencia hasta:{" "}
                    <span className="font-light">
                      {new Date(new Date().setDate(new Date().getDate() + 30)).toLocaleDateString()}
                    </span>
                  </p>
                  <p className="font-black">Precio: <span className="font-light">${producto.precio_sub}</span></p>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-2">

            <div className="mt-6 p-4 bg-custom rounded-lg">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${producto.precio_sub}</span>
              </div>
              <div className="flex justify-between">
                <span>IVA</span>
                <span>+${iva}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span>${total}</span>
              </div>

              {/* Botón de pago */}
              <div className="">
                <button
                  className="w-full bg-black text-white mt-6 p-4 font-roboto font-bold rounded-lg hover:bg-slate-900"
                  onClick={toggleModal}>
                  Proceder a pago
                </button>
              </div>
            </div>

          </div>
        </div>
        <div>
          <ModalCupones isOpen={isModalOpenCupon} toggleModal={toggleModalCupones} />

        </div>
        <div>
          <ModalPasarelaPago isOpen={isModalOpen} toggleModal={toggleModal} total={total}/>
        </div>
      </div>
      <Footer />
    </div>
  );
};



export default ResumenCompraSub;
