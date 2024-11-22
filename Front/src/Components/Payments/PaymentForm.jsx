import { useState, useEffect } from "react";
import card1 from "../../img/Payments/cards1.png";
import cards2 from "../../img/Payments/cards2.png";
import imgcvv from "../../img/Payments/cvv.png";
import openpay from "../../img/Payments/openpay.png";
import security from "../../img/Payments/security.png";

const PaymentForm = () => {
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    OpenPay.setId("mqmfdl22jfymjamikdso");
    OpenPay.setApiKey("pk_aa2a43cd8d4b4479a30b1b996cd506f3");
    OpenPay.setSandboxMode(true); // Cambia a false en producción
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
  
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
    const apiUrl = "http://localhost:3000/api/process-payment";
  
    const paymentData = {
      token_id: tokenId, // Token de Openpay
      device_session_id: deviceSessionId, // ID de sesión del dispositivo
      amount: 100.00, // Cambia este valor según el monto de tu pago
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
        console.log("Pago procesado con éxito:", data);
        alert("¡Pago realizado con éxito!");
      })
      .catch((error) => {
        console.error("Error al procesar el pago:", error);
        setError("Hubo un problema al procesar el pago. Inténtalo de nuevo.");
      });
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg mx-auto">
      <form action="#" method="POST" id="payment-form" onSubmit={handlePayment}>
        {/* Información y tokens ocultos para Openpay */}
        <input type="hidden" name="token_id" id="token_id" />
        <input type="hidden" name="use_card_points" id="use_card_points" value="false" />

        {/* Logos de tarjetas */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col w-1/2">
            <h2 className="text-xl font-semibold mb-2">Tarjeta de crédito</h2>
            <img src={card1} alt="Tarjetas de crédito" />
          </div>
          <div className="border-l border-gray-300 h-24 mx-4"></div>
          <div className="flex flex-col w-1/2">
            <h2 className="text-xl font-semibold mb-2">Tarjeta de débito</h2>
            <img src={cards2} alt="Tarjetas de débito" />
          </div>
        </div>

        {/* Campos del formulario */}
        <div className="mb-4">
          <label className="block text-gray-700">Nombre del titular</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Como aparece en la tarjeta"
            value={cardHolderName}
            onChange={(e) => setCardHolderName(e.target.value)}
            data-openpay-card="holder_name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Número de tarjeta</label>
          <input
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            placeholder="Número de tarjeta"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            data-openpay-card="card_number"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700">Mes</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="MM"
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              data-openpay-card="expiration_month"
            />
          </div>
          <div>
            <label className="block text-gray-700">Año</label>
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="AA"
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              data-openpay-card="expiration_year"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700">Código de seguridad (CVV)</label>
          <div className="relative">
            <input
              type="text"
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="3 dígitos"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              data-openpay-card="cvv2"
            />
            <img src={imgcvv} alt="CVV" className="absolute right-3 top-3 h-6" />
          </div>
        </div>

        {/* Información de seguridad */}
        <div className="text-sm text-gray-600 mb-4">
          <div className="flex items-center mb-1">
            <img src={openpay} alt="Openpay" className="h-6 mr-2" />
            Transacciones realizadas vía: <strong>Openpay</strong>
          </div>
          <div className="flex items-center">
            <img src={security} alt="Security" className="h-6 mr-2" />
            Tus pagos se realizan de forma segura con encriptación de 256 bits.
          </div>
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