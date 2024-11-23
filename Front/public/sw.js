self.addEventListener("push", (event) => {
  // Asegúrate de que los datos de la notificación son JSON
  const data = event.data ? event.data.json() : {};
  console.log("Push recibido:", data);

  // Título y mensaje de la notificación
  const title = data.title || 'Notificación Push';
  const message = data.message || 'Tienes una nueva notificación.';
  
  // Opciones de la notificación
  const options = {
    body: message,
    icon: data.icon || '/images/default-icon.png', // Puedes definir tu propio icono aquí
    badge: '/images/badge.png', // Icono de la notificación
    data: data, // Guarda los datos para usarlos en el clic
  };

  // Muestra la notificación en el navegador
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Responder a la acción cuando el usuario hace clic en la notificación
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const data = notification.data;

  // Cierra la notificación
  notification.close();

  // Aquí puedes definir lo que pasa al hacer clic en la notificación
  // Por ejemplo, abrir una URL específica
  event.waitUntil(
    clients.openWindow(data.url || '/')
  );
});
  //? Codigo de ejemplo
  // self.addEventListener("push", (event) => {
  //   const data = event.data.json();
  //   console.log("Push recibido:", data);
  //   self.registration.showNotification(data.title, {
  //     body: data.message,
  //     icon: "/path/to/icon.png", // Opcional: agrega un ícono si quieres
  //   });
  // });