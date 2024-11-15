import { useEffect, useState } from "react";

const publicVapidKey =
  "BBHornJrxSrn0IGAIMiW7XNgBv5NIwBrx03BW0GaAuNrTh8JWB47PD8K0yKMd6TiYpPdheTt_9ptbkhqsRy__wE";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const NotificationSetup = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js", {
            scope: "/",
          });

          // Verificar si ya estás suscrito
          const existingSubscription = await registration.pushManager.getSubscription();
          if (existingSubscription) {
            console.log("Ya estás suscrito:", existingSubscription);
            setIsSubscribed(true);
            return; // Salir si ya estás suscrito
          }

          // Suscribirse si no estás suscrito
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
          });

          // Enviar la suscripción al backend
          await fetch("http://localhost:3001/subscribe", {
            method: "POST",
            body: JSON.stringify(subscription),
            headers: { "Content-Type": "application/json" },
          });

          console.log("Usuario suscrito a notificaciones");
          setIsSubscribed(true);
        } catch (err) {
          console.error("Error al registrar el service worker o suscripción:", err);
        }
      }
    };

    registerServiceWorker();
  }, []);

  // Función para enviar notificación
  const sendNotification = async () => {
    // try {
    //   const response = await fetch("http://localhost:3001/send-notification", {
    //     method: "POST",
    //   });

    //   if (response.ok) {
    //     console.log("Notificación enviada!");
    //   } else {
    //     console.error("Error enviando notificación");
    //   }
    // } catch (error) {
    //   console.error("Error al enviar la notificación", error);
    // }

    
      fetch("http://localhost:3001/send-notification", {
        method: "POST",
      })
      .then ( () => console.log("Notificación enviada!"))
      .catch( (err) => console.log(err));
  };

  return (
    <div>
      {isSubscribed ? (
        <div>
          <p>Estás suscrito a notificaciones.</p>
          <button onClick={sendNotification}>Enviar Notificación</button>
        </div>
      ) : (
        <p>Suscribiéndote a notificaciones...</p>
      )}
    </div>
  );
};

export default NotificationSetup;
