import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        runtimeCaching: [
          // Cache para la landing page
          {
            urlPattern: /^\/?$/, // Se ajusta para producción
            handler: 'NetworkFirst',
            options: {
              cacheName: 'landing-page-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          // Cache para la página de la tienda
          {
            urlPattern: /^\/Tienda$/, // Ruta relativa
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tienda-page-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          // Cache para imágenes
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/, // Tipos de imágenes
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 días
              },
            },
          },
          // Rutas generales para contenido offline
          {
            urlPattern: /^\/(?!Suscripciones|Uscupones|Login|Registro).*$/, // Rutas permitidas
            handler: 'NetworkFirst',
            options: {
              cacheName: 'general-pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
        ],
        navigateFallback: '/index.html', // Redirección a index.html para rutas no encontradas
        navigateFallbackDenylist: [
          /^\/Suscripciones/,
          /^\/Uscupones/,
          /^\/Login/,
          /^\/Registro/,
        ], // Bloqueo de rutas específicas
        navigationPreload: true, // Habilita precarga para mejorar tiempos de respuesta
      },
      devOptions: {
        enabled: true, // Activa en modo desarrollo
      },
      manifest: {
        name: 'Estilo Guau',
        short_name: 'Guau',
        description: 'PWA con soporte offline para Estilo Guau',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon-192x192.png', // Asegúrate de que los íconos estén en la carpeta public
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512x512.png', // Asegúrate de que los íconos estén en la carpeta public
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    hmr: true, // Habilita hot module reload para el desarrollo
  },
});
