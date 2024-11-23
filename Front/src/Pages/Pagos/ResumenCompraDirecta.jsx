import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../Context/CartContext';
import Navbar from '../../Components/Navbar/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../Context/UserContext';
import Footer from "../../Components/Footer/Footer";
import { AiFillStar } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { Accordion } from "flowbite-react";
import PaymentForm from '../../Components/Payments/PaymentForm';


const ResumenPagoDirecto = () => {
  const { carrito } = useContext(CartContext); // Accede al carrito desde el contexto
  const descuentoTotal = carrito.reduce((acc, producto) => acc + ((Number(producto.precioOriginal) * Number(producto.cantidad) * Number(producto.productosOferta)) / 100), 0);
  const subtotal = carrito.reduce((acc, producto) => acc + (Number(producto.precioOriginal) * Number(producto.cantidad)), 0);
  const total = subtotal - descuentoTotal;
  const { userData } = useContext(UserContext);
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

  // Lógica para obtener el producto
  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/productos/${idProducto}`);
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
      <div key={carrito[carrito.length - 1]?.idProducto + carrito[carrito.length - 1]?.talla} className="flex justify-between items-center py-4 border-b border-gray-300">
      <div className="w-1/2">
        <p className="font-black">
          Nombre producto: <span className="font-light">{carrito[carrito.length - 1]?.producto}</span>
        </p>
        <p className="font-black">
          Talla: <span className="font-light">{carrito[carrito.length - 1]?.talla}</span>
        </p>
        <p className="font-black">
          Cantidad: <span className="font-light">{carrito[carrito.length - 1]?.cantidad}</span>
        </p>
        <p className="font-black">
          Precio: <span className="font-light">${(carrito[carrito.length - 1]?.precio * carrito[carrito.length - 1]?.cantidad).toFixed(2)}</span>
        </p>
      </div>     
    </div>
    
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
                  <div className="flex justify-between">
                  <span>Código promocional</span>
              <input
                type="text"
                placeholder="Escribe el código"
                className="border-0 underline rounded-lg bg-custom flex items-end"
              />
            </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                
                {/* Botón de pago */}
                <div className="">
                  <Link to={{ pathname: '/resumencompra', state: { carrito } }}>
                    <button className="w-full bg-black text-white mt-6 p-4 font-roboto font-bold rounded-lg hover:bg-slate-900">
                      Proceder a pago
                    </button>
                  </Link>
                </div>
                </div>
              )}
          </div>  
      </div>

      <div className="shadow-md shadow-slate-200 pb-1 ">
        <section className="mb-6 m-5">
          <h2 className="text-3xl font-bold flex justify-between items-center my-5">3. Método de pago</h2>
          <Accordion collapseAll className='shadow-md shadow-slate-200'>
            <Accordion.Panel>
              <Accordion.Title>Tarjeta de crédito o débito</Accordion.Title>
              <Accordion.Content>
                <PaymentForm />
              </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
              <Accordion.Title>Mercado pago</Accordion.Title>
              <Accordion.Content>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  Flowbite is first conceptualized and designed using the Figma software so everything you see in the library
                  has a design equivalent in our Figma file.
                </p>
              </Accordion.Content>
            </Accordion.Panel>
          </Accordion>
        </section>
      </div>
    </div>
    <Footer />
  </div>
  );
};

export default ResumenPagoDirecto;
