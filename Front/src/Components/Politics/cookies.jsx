import React from 'react';
import { useNavigate } from 'react-router-dom';

const PoliticaDeCookies = () => {
  const navigate = useNavigate(); // Hook para navegar a otra ruta

  const handleGoBack = () => {
    navigate(-1); // Esto regresa a la página anterior
  };

  return (
    <div style={{ padding: '30px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <button
        onClick={handleGoBack}
        style={{
          backgroundColor: '#CDD5AE',
          color: 'Black',
          border: 'ridge',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'inline-block',
          fontSize: '16px',
        }}
      >
        Volver
      </button>

      <h1 style={{
        fontSize: '28px', fontWeight: '700', marginBottom: '20px', color: '#333', textAlign: 'center'
      }}>
        Política de Cookies
      </h1>

      <p style={{
        fontSize: '16px', marginBottom: '20px', color: '#555', lineHeight: '1.6', textAlign: 'justify'
      }}>
        Esta página explica qué son las cookies, cómo las utilizamos y las opciones que tienes al respecto.
      </p>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#2c3e50'
        }}>
          ¿Qué son las cookies?
        </h2>
        <p style={{
          fontSize: '14px', marginBottom: '20px', color: '#555', lineHeight: '1.6', textAlign: 'justify'
        }}>
          Las cookies son pequeños archivos de texto que los sitios web colocan en tu dispositivo para almacenar información. 
          Esto ayuda a personalizar tu experiencia y mejorar la funcionalidad del sitio.
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#2c3e50'
        }}>
          ¿Qué tipos de cookies utilizamos?
        </h2>
        <ul style={{
          fontSize: '14px', marginBottom: '20px', color: '#555', lineHeight: '1.6', paddingLeft: '20px'
        }}>
          <li><b>Cookies esenciales:</b> Son necesarias para que el sitio funcione correctamente (como navegación o autenticación).</li>
          <li><b>Cookies de funcionalidad:</b> Mejoran tu experiencia, como recordar preferencias de idioma.</li>
          <li><b>Cookies de análisis:</b> Nos ayudan a entender cómo interactúan los usuarios con el sitio (Google Analytics, por ejemplo).</li>
          <li><b>Cookies de publicidad:</b> Se utilizan para mostrar anuncios relevantes y personalizados.</li>
        </ul>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#2c3e50'
        }}>
          ¿Cómo puedes controlar las cookies?
        </h2>
        <p style={{
          fontSize: '14px', marginBottom: '20px', color: '#555', lineHeight: '1.6', textAlign: 'justify'
        }}>
          Puedes aceptar o rechazar las cookies a través del banner mostrado en la primera visita. También puedes configurar tu navegador para bloquear o eliminar cookies. Sin embargo, esto puede afectar la funcionalidad del sitio.
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#2c3e50'
        }}>
          Terceros
        </h2>
        <p style={{
          fontSize: '14px', marginBottom: '20px', color: '#555', lineHeight: '1.6', textAlign: 'justify'
        }}>
          Algunos servicios utilizados en este sitio pueden colocar cookies en tu dispositivo (por ejemplo, servicios de análisis como Google Analytics o redes sociales). Consulta sus políticas de privacidad para más información.
        </p>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{
          fontSize: '22px', fontWeight: '600', marginBottom: '15px', color: '#2c3e50'
        }}>
          Cambios en esta política
        </h2>
        <p style={{
          fontSize: '14px', marginBottom: '20px', color: '#555', lineHeight: '1.6', textAlign: 'justify'
        }}>
          Nos reservamos el derecho a modificar esta política de cookies en cualquier momento. Te recomendamos revisar esta página periódicamente.
        </p>
      </div>

      <p style={{
        fontSize: '14px', marginTop: '30px', textAlign: 'center', color: '#333'
      }}>
        Si tienes preguntas, puedes contactarnos a través de nuestro{' '}
        <a href="/contacto" style={{ color: '#3498db', textDecoration: 'underline' }}>formulario de contacto</a>.
      </p>
    </div>
  );
};

export default PoliticaDeCookies;
