import { useState, useEffect, useContext } from "react";
import card1 from "../../img/Payments/cards1.png";
import cards2 from "../../img/Payments/cards2.png";
import imgcvv from "../../img/Payments/cvv.png";
import openpay from "../../img/Payments/openpay.png";
import security from "../../img/Payments/security.png";
import { toast } from 'react-toastify';
import { UserContext } from '../../Context/UserContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import addNotification from 'react-push-notification';



const PaymentForm = ({ total, carrito }) => {
  const { userData } = useContext(UserContext);
  const { idProducto, talla, cantidad, productosPrecios } = useParams();
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    OpenPay.setId("mqmfdl22jfymjamikdso");
    OpenPay.setApiKey("pk_aa2a43cd8d4b4479a30b1b996cd506f3");
    OpenPay.setSandboxMode(true); // Cambia a false en producción
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      for (const item of carrito) {
        console.log("Esto es el producto que se está procesando:", item);
        const precioProducto = (item.cantidad * item.precioSeleccionado)
        const response = await axios.post('http://localhost:3001/nueva-compra', {
          idUsuario: userData.idUsuario,
          idProducto: item.idProducto,
          cantidad_producto: item.cantidad,
          idTalla: item.idTalla,
          precio: precioProducto,
        });

        console.log('Respuesta del servidor:', response.data);
        
      }
    } catch (error) {
      console.error('Error al realizar las compras:', error);
    }


    // Generar token con Openpay
    OpenPay.token.extractFormAndCreate(
      document.getElementById("payment-form"),
      (response) => {
        console.log("Token creado correctamente:", response.data.id);
        const tokenId = response.data.id; // Token generado por Openpay
        const deviceSessionId = OpenPay.deviceData.setup(); // ID de sesión del dispositivo

        // Enviar token y otros datos al backend
        sendPaymentToServer(tokenId, deviceSessionId);
        setError(null);
      },
      (errorResponse) => {
        console.error("Error al generar el token:", errorResponse);
        setError("Error al procesar el pago. Por favor, verifica tus datos.");
      }
    );
  };

  const sendPaymentToServer = (tokenId, deviceSessionId) => {
    const apiUrl = "http://localhost:3001/api/process-payment";
    console.log("esto es el token antes de mandarlo al back", tokenId)

    const paymentData = {
      token_id: tokenId, // Token de Openpay
      device_session_id: deviceSessionId, // ID de sesión del dispositivo
      amount: total, // Cambia este valor según el monto de tu pago
      description: "Pago de ejemplo", // Descripción del pago
    };

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al procesar el pago en el servidor.");
        }
        return response.json();
      })
      .then((data) => {
        console.log('Datos enviados al servidor:', paymentData);
        console.log("Pago procesado con éxito:", data);
        //alert("¡Pago realizado con éxito!");
        //  toast.success("Pago realizado con éxito", {
         // position: "top-center",
          //autoClose: 900,
          //hideProgressBar: true,
          //closeOnClick: true,
          //pauseOnHover: true,
          //draggable: true,
          //progress: undefined,
        //});
        addNotification({
          title: 'Pago realizado con éxito',
         // message: `Adquiriste: ${purchasedItems}`,
          duration: 10000, //optional, default: 5000,
          icon: '/images/logo.png',
          vibrate: 10,
          native: true // when using native, your OS will handle theming.
      });
        navigate('/perfilUsuario');
      })
      .catch((error) => {
        console.log('Datos enviados al servidor:', paymentData);
        console.error("Error al procesar el pago:", error);
        setError("Hubo un problema al procesar el pago. Inténtalo de nuevo.");
      });
  };
  const validateCardHolderName = (value) => {
    if (!value.trim()) return "El nombre del titular es requerido.";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "El nombre solo puede contener letras y espacios.";
    if (value.length > 30) return "El nombre no puede exceder 30 caracteres.";
    return "";
  };

  const validateCardNumber = (value) => {
    if (!value.trim()) return "El número de tarjeta es requerido.";
    if (!/^\d{16}$/.test(value)) return "El número de tarjeta debe contener 16 dígitos.";
    return "";
  };

  const validateExpiryMonth = (value) => {
    if (!value.trim()) return "El mes de expiración es requerido.";
    if (!/^(0[1-9]|1[0-2])$/.test(value)) return "Ingrese un mes válido (01-12).";
    return "";
  };

  const validateExpiryYear = (value) => {
    if (!value.trim()) return "El año de expiración es requerido.";
    if (!/^\d{2}$/.test(value)) return "Ingrese un año válido (dos dígitos).";
    const currentYear = new Date().getFullYear() % 100; // Últimos dos dígitos del año actual
    if (parseInt(value, 10) < currentYear) return "El año de expiración no puede ser en el pasado.";
    return "";
  };

  const validateCvv = (value) => {
    if (!value.trim()) return "El CVV es requerido.";
    if (!/^\d{3,4}$/.test(value)) return "El CVV debe contener entre 3 y 4 dígitos.";
    return "";
  };

  const handleValidation = (field, value) => {
    let error = "";
    switch (field) {
      case "cardHolderName":
        error = validateCardHolderName(value);
        break;
      case "cardNumber":
        error = validateCardNumber(value);
        break;
      case "expiryMonth":
        error = validateExpiryMonth(value);
        break;
      case "expiryYear":
        error = validateExpiryYear(value);
        break;
      case "cvv":
        error = validateCvv(value);
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));
  };



  return (
    <div>
      <form action="#" method="POST" id="payment-form" onSubmit={handlePayment}>
        {/* Información y tokens ocultos para Openpay */}
        <input type="hidden" name="token_id" id="token_id" />
        <input type="hidden" name="use_card_points" id="use_card_points" value="false" />
        <div className="flex ">
          <div className="flex flex-col w-1/2">
            <h2 className="text-xl font-semibold mb-2">Tarjeta de crédito </h2>
            <img src={card1} alt="Tarjetas de crédito" />
          </div>
          <div className="flex flex-col w-1/2 ">
            <h2 className="text-xl font-semibold mb-2">Tarjeta de débito</h2>
            <img src={cards2} alt="Tarjetas de débito items-center" />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre del titular</label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border ${errors.cardHolderName ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            placeholder="Como aparece en la tarjeta"
            value={cardHolderName}
            onChange={(e) => {
              setCardHolderName(e.target.value);
              handleValidation("cardHolderName", e.target.value);
            }}
            maxLength="30" // Longitud máxima del nombre
            data-openpay-card="holder_name"
          />
          {errors.cardHolderName && <p className="text-red-500 text-sm">{errors.cardHolderName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Número de tarjeta</label>
          <input
            type="text"
            className={`mt-1 p-2 w-full border ${errors.cardNumber ? "border-red-500" : "border-gray-300"
              } rounded-md`}
            placeholder="Número de tarjeta"
            value={cardNumber}
            onChange={(e) => {
              setCardNumber(e.target.value.replace(/\D/g, "")); // Solo números
              handleValidation("cardNumber", e.target.value);
            }}
            maxLength="16" // Longitud exacta de 16 dígitos
            inputMode="numeric" // Entrada en modo numérico
            data-openpay-card="card_number"
          />
          {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Mes</label>
            <input
              type="text"
              className={`mt-1 p-2 w-full border ${errors.expiryMonth ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              placeholder="MM"
              value={expiryMonth}
              onChange={(e) => {
                setExpiryMonth(e.target.value.replace(/\D/g, "")); // Solo números
                handleValidation("expiryMonth", e.target.value);
              }}
              maxLength="2" // Longitud exacta de 2 dígitos
              inputMode="numeric"
              data-openpay-card="expiration_month"
            />
            {errors.expiryMonth && <p className="text-red-500 text-sm">{errors.expiryMonth}</p>}
          </div>

          <div>
            <label className="block text-gray-700">Año</label>
            <input
              type="text"
              className={`mt-1 p-2 w-full border ${errors.expiryYear ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              placeholder="AA"
              value={expiryYear}
              onChange={(e) => {
                setExpiryYear(e.target.value.replace(/\D/g, "")); // Solo números
                handleValidation("expiryYear", e.target.value);
              }}
              maxLength="2" // Longitud exacta de 2 dígitos
              inputMode="numeric"
              data-openpay-card="expiration_year"
            />
            {errors.expiryYear && <p className="text-red-500 text-sm">{errors.expiryYear}</p>}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Código de seguridad (CVV)</label>
          <div className="relative">
            <input
              type="text"
              className={`mt-1 p-2 w-full border ${errors.cvv ? "border-red-500" : "border-gray-300"
                } rounded-md`}
              placeholder="3 o 4 dígitos"
              value={cvv}
              onChange={(e) => {
                setCvv(e.target.value.replace(/\D/g, "")); // Solo números
                handleValidation("cvv", e.target.value);
              }}
              maxLength="4" // Longitud máxima de 4 dígitos
              inputMode="numeric"
              data-openpay-card="cvv2"
            />
            <img src={imgcvv} alt="CVV" className="absolute right-3 top-3 h-6" />
          </div>
          {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
        </div>

        {/* Botón de pago */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Pagar
        </button>
        {/* Error */}
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;