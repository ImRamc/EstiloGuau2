import React, { createContext, useEffect, useState } from "react";

const LocationContext = createContext();

const LocationProvider = ({ children }) => {
  // Variables de estado para la ubicación
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [colonia, setColonia] = useState(null);

  // Función para obtener información de ubicación basada en latitud y longitud
  function getReverseGeocode(latitude, longitude) {
    const API_KEY = "AIzaSyBcwPmyzMcsggh1LgLXVOgvjdQJEUp60Zk";
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`;
    
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "OK") {
          const result = data.results[0];
          setLocation(result.formatted_address);
          console.log(result.formatted_address);
          // Extraer componentes adicionales
          const components = result.address_components;
          setCity(components.find(c => c.types.includes("locality"))?.long_name || "Ciudad desconocida");
          setCountry(components.find(c => c.types.includes("country"))?.long_name || "País desconocido");
          setColonia(components.find(c => c.types.includes("sublocality") || c.types.includes("neighborhood"))?.long_name || "Colonia desconocida");
          console.log(components.find(c => c.types.includes("locality"))?.long_name || "Ciudad desconocida");
          console.log(components.find(c => c.types.includes("country"))?.long_name || "País desconocido");
          console.log(components.find(c => c.types.includes("sublocality") || c.types.includes("neighborhood"))?.long_name || "Colonia desconocida");
        } else {
          console.error("Error al obtener la dirección:", data.status);
        }
      })
      .catch((error) => console.error("Error en la solicitud:", error));
  }

  // Función para manejar éxito en obtener coordenadas
  function success(pos) {
    const crd = pos.coords;
    getReverseGeocode(crd.latitude, crd.longitude);
    console.log("Tu posición actual es:");
    console.log(`Latitud: ${crd.latitude}`);
    console.log(`Longitud: ${crd.longitude}`);
    console.log(`Precisión: ${crd.accuracy} metros.`);
  }

  // Función para manejar errores de geolocalización
  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  // Opciones de geolocalización
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  // useEffect para pedir permisos de geolocalización y obtener la ubicación
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => {
          if (result.state === "granted" || result.state === "prompt") {
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            console.log("Permiso de geolocalización denegado.");
          }
        })
        .catch((error) => {
          console.error("Error al consultar permisos de geolocalización:", error);
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <LocationContext.Provider value={{ location, city, country, colonia }}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationProvider };
