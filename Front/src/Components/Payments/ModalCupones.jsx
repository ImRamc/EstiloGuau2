import { Modal, Accordion } from "flowbite-react";
import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

const ModalCupones = ({ isOpen, toggleModal }) => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [cupon, setCupon] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleApplyCoupon = async () => {
    

     try {
      
      const response = await axios.get(`https://estilo-guau2-bak.vercel.app/apply-cupon/${cupon}/${userData.idUsuario}`);
      console.log(response);
      if (response.data !=null && response.data.Usado == 0 ) {
        let porcentaje = response.data.porcentaje;
        navigate('/resumencompra', { state: { cupon, porcentaje} });   
    toggleModal();
      } else {
        setStatusMessage(response.data.message);
      }
    } catch (error) {
      setStatusMessage("Hubo un error al aplicar el cupón. Inténtalo de nuevo.");
      console.error("Error aplicando el cupón:", error);
    }
  };

  return (
    <Modal show={isOpen} onClose={toggleModal} size="md">
      <Modal.Header>
        <h2 className="text-2xl font-bold">Aplicar Cupón</h2>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <p className="text-gray-600">
            Ingresa tu código de cupón para obtener un descuento en tu compra.
          </p>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Código de cupón"
            value={cupon}
            onChange={(e) => setCupon(e.target.value)}
          />
          {statusMessage && (
            <p className={`text-sm ${statusMessage.includes("exitosamente") ? "text-green-600" : "text-red-600"}`}>
              {statusMessage}
            </p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={handleApplyCoupon}
          >
            Aplicar Cupón
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            onClick={toggleModal}
          >
            Cerrar
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalCupones;
