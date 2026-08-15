import React, { useState, useEffect } from 'react';
import { CssBaseline } from '@mui/material';
import './App.css';
import Navbar from './components/layout/navbar/index.jsx';
import NavbarAdmin from './components/layout/navbar/index_adm.jsx';
import Inicio from './components/Inicio';
import InicioAdmin from './components/Inicio_adm.jsx';
import Categorias from './components/Categorias.jsx';
import Animales from './components/Animales.jsx';
import UnidadesMedidas from './components/Unidades_Medidas.jsx';
import Productos from './components/Productos.jsx';
import Clientes from './components/Clientes.jsx';
import Empresas from './components/Empresas.jsx';
import ProductoDetalle from './components/ProductoDetalle.jsx';
import TestHero from './components/TestHero.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const checkUser = () => {
    const saved = localStorage.getItem('animal_haus_user');
    if (saved) {
      setUser(JSON.parse(saved));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
    // Escuchar el evento de cambio de sesión
    window.addEventListener('authChange', checkUser);
    
    // Escuchar cambios de URL en navegación (si es necesario)
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('authChange', checkUser);
      window.removeEventListener('popstate', handleLocationChange);
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
    if (currentPath === '/admin/clientes') {
      return <Clientes />;
    }
    if (currentPath === '/admin/empresa') {
      return <Empresas />;
    }
    return <InicioAdmin />;
  };

  const renderUserContent = () => {
    if (currentPath === '/test-hero') {
      return <TestHero />;
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
    </>
  );
}

export default App;
