import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext'; // Asegúrate de importar UserContext correctamente
import Login from '../Pages/Login/Login';
import Registro from '../Pages/Registro/Registro';
import Compras from '../Pages/Compras/Compras';
import Productos from '../Pages/Productos/Productos';
import EditarProducto from '../Pages/Productos/EditarProducto';
import FormularioProducto from '../Pages/Productos/formularioproducto';
import Landing from '../Pages/Landing/Landing';
import Tienda from '../Pages/Tienda/Tienda';
import Dashboard from '../Pages/Dashboard/Dashboard';
import DetalleProducto from '../Pages/DetalleProducto/DetalleProducto';
import PerfilUsuario from '../Pages/PerfilUsuario/PerfilUsuario';
import FormUs from '../Pages/PerfilUsuario/FormUsuario';
import Cupones from '../Pages/Cupones/Cupones';
import EditarCupon from '../Pages/Cupones/EditarCupon';
import FormularioCupon from '../Pages/Cupones/FormularioCupon';
import Usuarios from '../Pages/Usuarios/Usuarios';
import FormularioUsuario from '../Pages/Usuarios/formulariousuario';
import EditarUsuario from '../Pages/Usuarios/EditarUsuario';
import Ofertas from '../Pages/Ofertas/Ofertas';
import EditarOferta from '../Pages/Ofertas/EditarOfertas';
import FormularioOferta from '../Pages/Ofertas/FormularioOfertas';
import CatSub from '../Pages/Suscripcion/CatSub';
import NewSub from '../Pages/Suscripcion/NewSub';
import Suscripciones from '../Pages/Suscripcion/Suscripciones';
import ResumenCompra from '../Pages/Pagos/ResumenCompra';
import ResumenCompraDirecta from '../Pages/Pagos/ResumenCompraDirecta';
import ResumenCompraSub from '../Pages/Pagos/ResumenCompraSub';
import EditarSub from '../Pages/Suscripcion/EditarSub';
import RegistroVendedor from '../Pages/Vendedor/RegistroVendedor';
import PerfilVendedor from '../Pages/PerfilUsuario/PerfilVendedor';
import ProtectedRoute from "../Components/ProtectedRoute";
import ProductoUser from '../Pages/Compras/productoUser';
import EditarVendedor from '../Pages/Vendedor/EditarVendedor';
import Uscupones from '../Pages/Uscupones/Uscupones';
import DashboardCupones from '../Pages/DashboardCupones/DashboardCupones';
import DashboardSuscripcion from '../Pages/DashboardSuscripcion/DashboardSuscripcion';
import SupersetData from '../Pages/DashboardSuperset/SupersetData';
import Cookies from "../Components/Politics/cookies";

const RoutesComponent = () => {
  const { userData } = useContext(UserContext);
  const { idRol } = userData;
  const { idUsuario } = userData;

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/Registro" element={<Registro />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Tienda" element={<Tienda />} />
        <Route path="/politica-de-cookies" element={<Cookies />} />
        
        <Route path="/Suscripciones" element={<Suscripciones />} />      
        <Route path="/Uscupones" element={<Uscupones />} />      
        <Route path="/registro-vendedor" element={<RegistroVendedor />} />
        
        
       {/*  <Route path="/DetalleProducto/:idProducto" element={<DetalleProducto />} />
        <Route path="/ResumenCompra" element={<ResumenCompra />} />
        <Route path="/ResumenCompraDirecta" element={<ResumenCompraDirecta />} />
        <Route path="/ResumenCompraSub" element={<ResumenCompraSub />} />*/}
        {/* Rutas protegidas por rol */}
        <Route
          path="/Compras"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <Compras />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route
          path="/Dashboard"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <Dashboard />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/DashboardCupones"
          element={
            idRol && (idRol === 3) ? (
              <DashboardCupones />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/DashboardSuscripcion"
          element={
            idRol && (idRol === 3) ? (
              <DashboardSuscripcion />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/SupersetData"
          element={
            idRol && (idRol === 3) ? (
              <SupersetData />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />


        <Route
          path="/Productos"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <Productos />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route
          path="/productos/formulario"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <FormularioProducto />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route
          path="/productos/editar/:id"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <EditarProducto />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/PerfilUsuario"
          element={
            idRol && (idRol === 1 || idRol === 2 || idRol === 3 ) ? (
              <PerfilUsuario />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route
          path="/formUs"
          element={
            idRol && (idRol === 1 || idRol === 2 || idRol === 3 ) ? (
              <FormUs />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        
        <Route
          path="/usuarios"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <Usuarios />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        
        <Route
          path="/usuarios/formulario"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <FormularioUsuario />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route
          path="/usuarios/editar/:id"
          element={
            idRol && (idRol === 1 ||  idRol === 3 || idRol === 2) ? (
              <EditarUsuario />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/Cupones"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <Cupones />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        
        <Route
          path="/Cupones/formulario"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <FormularioCupon />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
        <Route
          path="/Cupones/editar/:id"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <EditarCupon />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/Ofertas"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <Ofertas />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/Ofertas/formulario"
          element={
            idRol &&(idRol === 3 || idRol === 2) ? (
              <FormularioOferta />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/Ofertas/editar/:id"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <EditarOferta />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/CatSub"
          element={
            idRol && (idRol === 3) ? (
              <CatSub  />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/NewSub"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <NewSub  />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />
         <Route
          path="/suscripcion/editar/:id"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <EditarSub />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

<Route
  path="/DetalleProducto/:idProducto"
  element={
    idRol && (idRol === 1 || idRol === 2 || idRol === 3) ? (
      <DetalleProducto />
    ) : (
      <Navigate to="/Login" />
    )
  }
/>
<Route
  path="/ResumenCompra"
  element={
    idRol && (idRol === 1 || idRol === 2 || idRol === 3) ? (
      <ResumenCompra />
    ) : (
      <Navigate to="/Login" />
    )
  }
/>
<Route
  path="/ResumenCompraDirecta"
  element={
    idRol && (idRol === 1 || idRol === 2 || idRol === 3) ? (
      <ResumenCompraDirecta />
    ) : (
      <Navigate to="/Login" />
    )
  }
/>
<Route
  path="/ResumenCompraSub"
  element={
    idRol && (idRol === 1 || idRol === 2 || idRol === 3) ? (
      <ResumenCompraSub />
    ) : (
      <Navigate to="/Login" />
    )
  }
/>;
<Route
  path="/perfil-vendedor"
  element={
    idRol && (idRol === 1 || idRol === 2 || idRol === 3) ? (
      <PerfilVendedor />
    ) : (
      <Navigate to="/Login" />
    )
  }
/>;
        <Route
          path="/ver-todas-compras"
          element={
            idRol && (idRol === 1 ||  idRol === 3 || idRol === 2) ? (
              <ProductoUser  />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        <Route
          path="/editar-vendedor/:idVendedor"
          element={
            idRol && (idRol === 3 || idRol === 2) ? (
              <EditarVendedor  />
            ) : (
              <Navigate to="/Login" />
            )
          }
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default RoutesComponent;
