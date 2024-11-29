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

const ResumenCompra = () => {
 
  const location = useLocation();
  const { state } = location || {};
  const { cupon } = state || {};
  let { porcentaje} = state || {};
  console.log("Cupon recibido:", cupon);
  console.log("porcentaje recibido:", porcentaje);
  const { carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, disminuirCantidad } = useContext(CartContext);
  const { userData } = useContext(UserContext);
  const descuentoTotal = carrito.reduce((acc, producto) => acc + ((Number(producto.precioOriginal) * Number(producto.cantidad) * Number(producto.productosOferta)) / 100), 0);
  let subtotal = carrito.reduce((acc, producto) => acc + (Number(producto.precioOriginal) * Number(producto.cantidad)), 0);
  let iva = 16;
  iva = parseFloat((subtotal * (iva / 100)).toFixed(2));
  let total = subtotal - descuentoTotal;
  if(porcentaje != null){
    porcentaje = (total * (porcentaje / 100)).toFixed(2);
    porcentaje = parseFloat(porcentaje);
    total = (total - porcentaje).toFixed(2);
  }
  total = parseFloat(total + iva).toFixed(2);
  const [error, setError] = useState(null);
  const { idProducto, talla, cantidad, productosPrecios } = useParams();
  const [producto, setProducto] = useState({
    sku: '',
    Marca: '',
    precio: 0, // Inicializar con 0 o un valor numérico
    talla: '',
    descripcion: '',
    foto: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCupon, setIsModalOpenCupon] = useState(false);
  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const toggleModalCupones = () => setIsModalOpenCupon((prev) => !prev);
  // Lógica para obtener el producto
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`https://estilo-guau2-bak.vercel.app/productos/${idProducto}`);
        const producto = response.data;
        if (producto.porcentaje_descuento !== 0) {
          const descuento = (producto.precio * producto.porcentaje_descuento) / 100;
          const precioConDescuento = producto.precio - descuento;
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
  }, [idProducto]);

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
                {carrito.length === 0 ? (
                  <p>El carrito está vacío.</p>
                ) : (
                  carrito.map((producto) => (
                    <div key={producto.idProducto + producto.talla} className="flex justify-between items-center py-4 border-b border-gray-300">
                      <div className="w-1/2">
                        <p className="font-black">Nombre producto: <span className="font-light">{producto.producto}</span> </p>
                        <p className="font-black">Talla: <span className="font-light">{producto.talla}</span></p>
                        <p className="font-black">Cantidad: <span className="font-light">{producto.cantidad}</span></p>
                        <p className="font-black">Precio: <span className="font-light">${(producto.precioSeleccionado
                            * producto.cantidad).toFixed(2)}</span></p>
                      </div>
                      <div className="flex items-center">
                    <button
                      className="px-2 py-1 border rounded hover:bg-second"
                      onClick={() => disminuirCantidad(producto.idProducto, producto.talla)}
                    >
                      -
                    </button>
                    <span className="px-2">{producto.cantidad}</span>
                    <button
                      className="px-2 py-1 border rounded hover:bg-second"
                      onClick={() => agregarAlCarrito(producto, producto.talla)}
                    >
                      +
                    </button>
                    <button
                      className="ml-2 px-2 py-1 border rounded hover:bg-red-500 hover:text-white"
                      onClick={() => eliminarDelCarrito(producto.idProducto, producto.talla)}
                    >
                      Eliminar
                    </button>
                  </div>
                    </div>
                  ))                  
                )}                
              </div>
            </section>
          </div>

          <div className="space-y-2">
          {carrito.length === 0 ? (
           <Link to="/tienda">
           <button className="w-full bg-black text-white mt-6 p-4 font-roboto font-bold rounded-lg hover:bg-slate-900">
             Explorar artículos
             </button>
             </Link>
          ) : (
 <div className="mt-6 p-4 bg-custom rounded-lg">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-red-500">
                    <span>Ahorrado</span>
                    <span>-${descuentoTotal}</span>
                  </div>
            {cupon != null ? (
        <>
          <div className="flex justify-between">
            <span>Cupon aplicado</span>
            <span>{cupon}</span>
          </div>
          <div className="flex justify-between  text-red-500">
            <span>Descuento aplicado</span>
            <span>-${porcentaje}</span>
          </div>
        </>
      ) : 
      <div className="flex justify-between">
                  <span>Código promocional</span>
              <input
                type="button"
                value={"Escribe el código"}
                placeholder="Escribe el código"
                className="border-0 underline rounded-lg bg-custom flex items-end"
                onClick={toggleModalCupones}/>
            </div>
      }
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
              )}
          </div>          
      </div>
      <div>
                  <ModalCupones isOpen={isModalOpenCupon} toggleModal={toggleModalCupones} />

                  </div>
      <div>
      <ModalPasarelaPago isOpen={isModalOpen} toggleModal={toggleModal} total={total} carrito={carrito} />
    </div>
    </div>
    <Footer />
  </div>
  );
};



export default ResumenCompra;
