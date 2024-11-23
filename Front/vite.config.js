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
          // Cache de la landing page
          {
            urlPattern: /^http:\/\/localhost:4173\/?$/, // Landing
            handler: 'NetworkFirst',
            options: {
              cacheName: 'landing-page-cache',
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          // Cache de la tienda
          {
            urlPattern: /^http:\/\/localhost:4173\/Tienda$/, // Tienda
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
          // Rutas generales sin cache para rutas bloqueadas
          {
            urlPattern: /^(?!.*(\/Suscripciones|\/Uscupones|\/Login|\/Registro)).*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'valid-pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
        ],
        // Eliminar fallback para offline.html
        navigateFallback: undefined, // Ya no usamos una página de fallback
        navigateFallbackDenylist: [
          /^\/Suscripciones/,
          /^\/Uscupones/,
          /^\/Login/,
          /^\/Registro/,
        ], // Rutas bloqueadas
        navigationPreload: true,
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'Mi PWA',
        short_name: 'PWA',
        description: 'PWA con soporte offline para landing y tienda',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
