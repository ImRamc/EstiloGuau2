import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from "../../Components/Footer/Footer";
import Sidebar from '../../Components/Sidebar/Sidebar';

const FormSub = () => {
  const [suscripciones, setSuscripciones] = useState([]);

  useEffect(() => {
    obtenerSuscripciones();
  }, []);

  const obtenerSuscripciones = async () => {
    try {
      const response = await axios.get('https://estilo-guau2-bak.vercel.app/suscripciones');
      setSuscripciones(response.data);
    } catch (error) {
      console.error('Error al obtener las suscripciones:', error);
    }
  };

  const eliminarSuscripcion = async (id_sub) => {
    try {
      await axios.delete(`https://estilo-guau2-bak.vercel.app/suscripcion/${id_sub}`);
      setSuscripciones(suscripciones.filter(suscripcion => suscripcion.id_sub !== id_sub));
    } catch (error) {
      console.error(`Error al eliminar la suscripción con ID ${id_sub}:`, error);
    }
  };

  return (
    <div className="">
      <div className="pl-72 pt-20 pr-24 carrito-page flex flex-col min-h-screen shadow-lg">
        <Navbar />
        <Sidebar />
        <div className="carrito-container mx-4 flex-1 ">
          <h2 className="pl-10 font-bold mb-4 ml-4 text-center text-4xl">Suscripciones</h2>
          <p className="pl-10 font-light mb-4 ml-4 text-center text-1xl">Resumen de todas las suscripciones</p>
          <div className="text-left justify-start pb-10">
            <Link to="/NewSub">
              <button className="bg-custom border hover:bg-second text-black font-medium py-2 px-4 rounded">
                Agregar Suscripción
              </button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-collapse border border-black">
              <thead className="bg-custom text-black text-medium">
                <tr>
                  <th className="py-3 px-4 text-center border border-white-900">ID</th>
                  <th className="py-3 px-4 text-center border border-white-900">Nombre</th>
                  <th className="py-3 px-4 text-center border border-white-900">Duración</th>
                  <th className="py-3 px-4 text-center border border-white-900">Precio</th>
                  <th className="py-3 px-4 text-center border border-white-900">Editar</th>
                  <th className="py-3 px-4 text-center border border-white-900">Eliminar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {suscripciones.map(suscripcion => (
                  <tr key={suscripcion.id_sub}>
                    <td className="py-3 px-4 border border-gray-300">{suscripcion.id_sub}</td>
                    <td className="py-3 px-4 border border-gray-300">{suscripcion.nombre_sub}</td>
                    <td className="py-3 px-4 border border-gray-300">{suscripcion.duracion_sub} días</td>
                    <td className="py-3 px-4 border border-gray-300">${suscripcion.precio_sub}</td>
                    <td className="py-3 px-4 text-center border border-gray-300">
                      <Link to={`/suscripcion/editar/${suscripcion.id_sub}`}>
                        <button className="bg-custom border hover:bg-second text-black font-bold rounded-md px-4 py-2">
                          Editar
                        </button>
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-center border border-gray-300">
                      <button
                        className="bg-white-500 hover:text-second text-custom font-bold py-1 px-2 rounded"
                        onClick={() => eliminarSuscripcion(suscripcion.id_sub)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10">
                      <path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {suscripciones.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-4 px-6 text-center text-gray-500 border-gray-300">
                      No hay suscripciones disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FormSub;
