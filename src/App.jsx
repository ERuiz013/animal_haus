import React, { useState, useEffect } from 'react';
import { CssBaseline, Snackbar, Alert } from '@mui/material';
import './App.css';
import Navbar from './components/layout/navbar/index.jsx';
import NavbarAdmin from './components/layout/navbar/index_adm.jsx';
import Inicio from './components/Inicio';
import InicioAdmin from './components/Inicio_adm.jsx';
import Categorias from './components/Categorias.jsx';
import Animales from './components/Animales.jsx';
import UnidadesMedidas from './components/Unidades_Medidas.jsx';
import Productos from './components/Productos.jsx';
import Impuestos from './components/Impuestos.jsx';
import Clientes from './components/Clientes.jsx';
import Empresas from './components/Empresas.jsx';
import ProductoDetalle from './components/ProductoDetalle.jsx';
import TestHero from './components/TestHero.jsx';
import Descuentos from './components/Descuentos.jsx';
import Timbrados from './components/Timbrados.jsx';
import Talonarios from './components/Talonarios.jsx';
import Venta from './components/Venta.jsx';
import AjustesExistencias from './components/Ajustes_Existencias.jsx';
import InformeListaProductos from './components/Informe_Lista_Productos.jsx';
import InformeProductosVendidos from './components/Informe_Productos_Vendidos.jsx';
import ProductosFavoritos from './components/Productos_Favoritos.jsx';
import ProductosAnimales from './components/Productos_Animales.jsx';
import MisPedidos from './components/Mis_Pedidos.jsx';
import PagoExitoso from './components/PagoExitoso.jsx';
import { API_BASE_URL } from './config';

function App() {
  const [user, setUser] = useState(null);
  const getNormalizedPath = () => {
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const path = window.location.pathname;
    if (basePath && path.startsWith(basePath)) {
      return path.slice(basePath.length) || '/';
    }
    return path;
  };

  const [currentPath, setCurrentPath] = useState(getNormalizedPath());

  const checkUser = () => {
    const saved = localStorage.getItem('animal_haus_user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser(null);
    }
  };

  const [stockAlert, setStockAlert] = useState({ open: false, message: '' });

    useEffect(() => {
    checkUser();
    // Escuchar el evento de cambio de sesión
    window.addEventListener('authChange', checkUser);
    
    // Escuchar cambios de URL en navegación (si es necesario)
    const handleLocationChange = () => setCurrentPath(getNormalizedPath());
    window.addEventListener('popstate', handleLocationChange);
    
    const handleStockLimit = (e) => {
      setStockAlert({ open: true, message: `Solo hay ${e.detail.stock} disponible(s) de: ${e.detail.name}` });
    };
    window.addEventListener('cartStockLimit', handleStockLimit);

    // Cargar favicon dinámico desde la empresa
    fetch(`${API_BASE_URL}/getEmpresa.php`)
      .then(res => res.json())
      .then(data => {
        if (data && data.logoBase64) {
          let link = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = data.logoBase64;
          if (data.nombre) {
            document.title = data.nombre;
          }
        }
      })
      .catch(err => console.error("Error al cargar logo de pestaña", err));

    return () => {
      window.removeEventListener('authChange', checkUser);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('cartStockLimit', handleStockLimit);
    };
  }, []);

  // Verificar el rol del usuario (asumiendo que viene como rol o id_rol)
  const isAdmin = user && (String(user.rol) === '1' || String(user.id_rol) === '1');

  const renderAdminContent = () => {
    if (currentPath === '/admin/categorias') {
      return <Categorias />;
    }
    if (currentPath === '/admin/animales') {
      return <Animales />;
    }
    if (currentPath === '/admin/unidad-medida') {
      return <UnidadesMedidas />;
    }
    if (currentPath === '/admin/productos') {
      return <Productos />;
    }
    if (currentPath === '/admin/impuestos') {
      return <Impuestos />;
    }
    if (currentPath === '/admin/clientes') {
      return <Clientes />;
    }
    if (currentPath === '/admin/empresa') {
      return <Empresas />;
    }
    if (currentPath === '/admin/timbrados') {
      return <Timbrados />;
    }
    if (currentPath === '/admin/talonarios') {
      return <Talonarios />;
    }
    if (currentPath === '/admin/ventas') {
      return <Venta />;
    }
    if (currentPath === '/admin/ajustes-existencias') {
      return <AjustesExistencias />;
    }
    if (currentPath === '/admin/informe-productos') {
      return <InformeListaProductos />;
    }
    if (currentPath === '/admin/informe-productos-vendidos') {
      return <InformeProductosVendidos />;
    }
    return <InicioAdmin />;
  };

  const renderUserContent = () => {
    if (currentPath === '/test-hero') {
      return <TestHero />;
    }
    if (currentPath.startsWith('/pago-exitoso')) {
      return <PagoExitoso />;
    }
    if (currentPath === '/mis-pedidos') {
      return <MisPedidos />;
    }
    if (currentPath === '/descuentos') {
      return <Descuentos />;
    }
    if (currentPath === '/favoritos') {
      return <ProductosFavoritos />;
    }
    if (currentPath.startsWith('/productos-animales')) {
      return <ProductosAnimales />;
    }
    if (currentPath.startsWith('/producto')) {
      return <ProductoDetalle />;
    }
    return <Inicio />;
  };

  return (
    <>
      {isAdmin ? <NavbarAdmin /> : <Navbar />}
      {isAdmin ? renderAdminContent() : renderUserContent()}
      <CssBaseline />
      <Snackbar open={stockAlert.open} autoHideDuration={3000} onClose={() => setStockAlert({ ...stockAlert, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setStockAlert({ ...stockAlert, open: false })} severity="warning" sx={{ width: '100%', borderRadius: '12px', fontWeight: 600 }}>
          {stockAlert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default App;
