//import addNotification from 'react-push-notification';
import { useEffect } from "react";

const Page = () => {
  const publicVapidKey =
  "BLmOFpj8Li6Ehq6dznVJZ_e2NLM7cyLd-T_KsONQSsQCDjg7Tfp6RGm6QGlf5O2P80jbglUALUxXq5zfLF3tSyE";

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
  useEffect(() => {
    const registerServiceWorker = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        // Verificar si ya estás suscrito
        const existingSubscription =
          await registration.pushManager.getSubscription();
        if (existingSubscription) {
          console.log("Ya estás suscrito:", existingSubscription);
          return; // Salir si ya estás suscrito
        }

        // Suscribirse si no estás suscrito
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        await fetch("https://estilo-guau2-bak.vercel.app/subscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
        });

        console.log("Usuario suscrito a notificaciones");
      }
    };

    registerServiceWorker();
  }, []);

    const buttonClick = () => {
        addNotification({
            title: 'Error al activar la suscripción',
            message: 'Hubo un problema al activar tu suscripción',
            duration: 10000, //optional, default: 5000,
            icon: '/images/logo.png',
            vibrate: 10,
            native: true // when using native, your OS will handle theming.
        });
    };

    return (
      <div></div>
    );
  };

export default Page;