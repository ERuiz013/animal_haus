import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  InputBase,
  Box,
  Button,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  FavoriteBorder as FavoriteIcon,
  Close as CloseIcon,
  Logout as LogoutIcon,
  PersonOutlined as PersonIcon,
  ReceiptLong as ReceiptIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  WhatsApp as WhatsAppIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import logo from '../../../assets/animalhause.png';
import AuthModal from '../../AuthModal';
import ChangePasswordModal from '../../ChangePasswordModal';
import SvgIcon from '@mui/material/SvgIcon';
import { useCart } from '../../../context/CartContext';
import { useFavorite } from '../../../context/FavoriteContext';

const TikTokIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.12-3.44-3.17-3.61-5.66-.02-.85-.02-1.7.02-2.55.15-2.18 1.1-4.22 2.67-5.71 1.73-1.63 4.2-2.5 6.64-2.28 0 1.44-.02 2.87.01 4.31-.57-.03-1.14-.02-1.7.07-1.14.21-2.21.94-2.82 1.9-.66 1.05-.8 2.39-.42 3.55.33.99 1.15 1.77 2.11 2.16 1.34.54 2.99.3 4.09-.64.9-.76 1.39-1.92 1.4-3.08.02-3.89.01-7.79.01-11.68z"/>
  </SvgIcon>
);



export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElCategories, setAnchorElCategories] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const openCategories = Boolean(anchorElCategories);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart() || { cartItems: [], getCartCount: () => 0, getCartTotal: () => 0 };
  const { getFavoriteCount } = useFavorite() || { getFavoriteCount: () => 0 };
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchVal.length >= 3) {
        setIsSearching(true);
        try {
          const res = await fetch(`http://localhost/rjs_animal_haus/api/searchProductos.php?q=${encodeURIComponent(searchVal)}`);
          const data = await res.json();
          setSearchResults(data);
        } catch (err) {
          console.error("Error buscando productos:", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchVal]);
  const [userData, setUserData] = useState(null);
  const [empresaData, setEmpresaData] = useState(null);

  useEffect(() => {
    fetch('http://localhost/rjs_animal_haus/api/getEmpresas.php')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setEmpresaData(data[0]);
          if (data[0].logo) {
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = data[0].logo;
          }
        }
      })
      .catch(err => console.error("Error al cargar datos de empresa:", err));

    // Cargar la lista de animales para el menú de categorías
    fetch('http://localhost/rjs_animal_haus/api/getAnimales.php')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setCategoriesList(data);
      })
      .catch(err => console.error("Error al cargar animales:", err));
  }, []);

  // Cargar sesión persistente al iniciar
  useEffect(() => {
    const saved = localStorage.getItem('animal_haus_user');
    if (saved) {
      setUserData(JSON.parse(saved));
      setIsLoggedIn(true);
    }
  }, []);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleOpenAuthModal = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
    if (mobileOpen) setMobileOpen(false);
  };

  useEffect(() => {
    const handleCustomOpenAuth = (e) => {
      handleOpenAuthModal(e.detail?.mode || 'login');
    };
    window.addEventListener('openAuthModal', handleCustomOpenAuth);
    return () => window.removeEventListener('openAuthModal', handleCustomOpenAuth);
  }, [mobileOpen]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenCategories = (event) => setAnchorElCategories(event.currentTarget);
  const handleCloseCategories = () => setAnchorElCategories(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  // Drawer para vista móvil
  const drawer = (
    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={logo} alt="Animal Haus" style={{ height: '35px', objectFit: 'contain' }} />
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon sx={{ color: '#1e293b' }} />
        </IconButton>
      </Box>
      <Divider sx={{ borderColor: '#f1f5f9' }} />

      {/* Barra de búsqueda móvil */}
      <Box sx={{ p: 2, position: 'relative' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: '#ffffff', 
          borderRadius: '50px', 
          px: 2, 
          py: 0.5,
          border: isSearchFocused ? '1.5px solid #d32f2f' : '1px solid #d32f2f',
          transition: 'all 0.3s ease'
        }}>
          <SearchIcon sx={{ color: '#d32f2f', mr: 1 }} />
          <InputBase
            placeholder="Buscar productos..."
            value={searchVal}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            fullWidth
            sx={{ fontSize: '0.95rem' }}
          />
        </Box>
        {/* Resultados Móvil */}
        {isSearchFocused && searchVal.length >= 3 && (
          <Box sx={{
            position: 'absolute',
            top: '100%',
            left: 16,
            right: 16,
            bgcolor: '#fff',
            mt: 0.5,
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000
          }}>
            {isSearching ? (
              <Box sx={{ p: 2, textAlign: 'center', color: '#64748b' }}>Buscando...</Box>
            ) : searchResults.length > 0 ? (
              <List sx={{ py: 0 }}>
                {searchResults.map((prod) => (
                  <ListItem key={prod.id} disablePadding sx={{ borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }}>
                    <ListItemButton 
                      component="a" 
                      href={`/producto/${prod.id}`}
                      sx={{ gap: 2, '&:hover': { bgcolor: '#f8fafc' } }}
                    >
                      <img 
                        src={prod.imagen ? `http://localhost/rjs_animal_haus/${prod.imagen}` : 'https://placehold.co/50x50/f1f5f9/94a3b8?text=Sin+Imagen'} 
                        alt={prod.nombre} 
                        style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4 }}
                      />
                      <ListItemText 
                        primary={prod.nombre} 
                        secondary={`Gs. ${Number(prod.precio).toLocaleString('es-PY')}`} 
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: '#1e293b' }}
                        secondaryTypographyProps={{ variant: 'caption', color: '#d32f2f', fontWeight: 600 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 2, textAlign: 'center', color: '#64748b' }}>No se encontraron productos.</Box>
            )}
          </Box>
        )}
      </Box>
      <Divider sx={{ borderColor: '#f1f5f9' }} />

      {/* Lista de categorías móvil */}
      <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <ListItem disablePadding>
          <ListItemText
            primary="Categorías"
            primaryTypographyProps={{
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              ml: 3,
              mt: 2,
              mb: 1,
              color: '#94a3b8'
            }}
          />
        </ListItem>
        {categoriesList.map((cat) => (
          <ListItem key={cat.id} disablePadding>
            <ListItemButton
              component="a"
              href={`#${cat.nombre.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={handleDrawerToggle}
              sx={{
                justifyContent: 'flex-start',
                pl: 4,
                color: '#334155',
                '&:hover': { color: '#d32f2f', bgcolor: '#f8fafc' }
              }}
            >
              <ListItemText
                primary={cat.nombre}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: '#f1f5f9' }} />
      {/* Acciones de usuario móviles */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {isLoggedIn ? (
          <>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              fullWidth
              sx={{
                textTransform: 'none',
                borderRadius: '50px',
                borderColor: '#e2e8f0',
                color: '#1e293b',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }
              }}
            >
              Mi Perfil
            </Button>
            <Button
              variant="text"
              fullWidth
              onClick={() => {
                localStorage.removeItem('animal_haus_user');
                setUserData(null);
                setIsLoggedIn(false);
                window.dispatchEvent(new Event('authChange'));
              }}
              sx={{ textTransform: 'none', color: '#64748b', fontWeight: 500 }}
            >
              Cerrar Sesión
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleOpenAuthModal('login')}
              sx={{
                textTransform: 'none',
                borderRadius: '50px',
                backgroundColor: '#ff9800',
                color: '#ffffff',
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#f57c00',
                  boxShadow: 'none'
                }
              }}
            >
              Iniciar Sesión
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => handleOpenAuthModal('register')}
              sx={{
                textTransform: 'none',
                borderRadius: '50px',
                borderColor: '#d32f2f',
                color: '#d32f2f',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(211, 47, 47, 0.08)',
                  borderColor: '#b71c1c'
                }
              }}
            >
              Registrarse
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', color: '#1e293b' }}>
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: '64px', md: '80px' }, px: { lg: 6 } }}>

          {/* Lado Izquierdo: Logo y Categorías */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {/* Logo y Nombre de la marca */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 1, display: { lg: 'none' }, color: '#d32f2f' }}
              >
                <MenuIcon />
              </IconButton>
              <Box
                component="a"
                href="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  transition: 'opacity 0.2s ease',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                <img src={logo} alt="Animal Haus" style={{ height: '38px', objectFit: 'contain' }} />
              </Box>
            </Box>


          </Box>

          {/* Buscador (Desktop) y Redes Sociales - Centrado */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1, justifyContent: 'center', alignItems: 'center', px: { md: 2, lg: 4 } }}>
            {/* Redes Sociales */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 0.5, mr: 2 }}>
              <IconButton component="a" href={empresaData?.link_facebook || '#'} target="_blank" aria-label="facebook" sx={{ color: '#d32f2f', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}>
                <FacebookIcon />
              </IconButton>
              <IconButton component="a" href={empresaData?.link_instagram || '#'} target="_blank" aria-label="instagram" sx={{ color: '#d32f2f', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}>
                <InstagramIcon />
              </IconButton>
              <IconButton component="a" href={empresaData?.link_tiktok || '#'} target="_blank" aria-label="tiktok" sx={{ color: '#d32f2f', '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}>
                <TikTokIcon />
              </IconButton>
            </Box>

            <Box sx={{ 
              width: '100%', 
              maxWidth: '500px',
              display: 'flex', 
              alignItems: 'center', 
              bgcolor: '#ffffff', 
              borderRadius: '50px', 
              px: 2.5, 
              py: 0.8,
              border: isSearchFocused ? '1.5px solid #d32f2f' : '1px solid #d32f2f',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}>
              <SearchIcon sx={{ color: '#d32f2f', mr: 1.5, fontSize: '1.2rem' }} />
              <InputBase
                placeholder="Buscar productos..."
                value={searchVal}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                sx={{ width: '100%', fontSize: '0.95rem', color: '#1e293b' }}
              />
              
              {/* Resultados Desktop */}
              {isSearchFocused && searchVal.length >= 3 && (
                <Box sx={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  bgcolor: '#fff',
                  mt: 1,
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                  border: '1px solid #f1f5f9',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}>
                  {isSearching ? (
                    <Box sx={{ p: 2, textAlign: 'center', color: '#64748b' }}>Buscando...</Box>
                  ) : searchResults.length > 0 ? (
                    <List sx={{ py: 0 }}>
                      {searchResults.map((prod) => (
                        <ListItem key={prod.id} disablePadding sx={{ borderBottom: '1px solid #f1f5f9', '&:last-child': { borderBottom: 'none' } }}>
                          <ListItemButton 
                            component="a" 
                            href={`/producto/${prod.id}`}
                            sx={{ gap: 2, '&:hover': { bgcolor: '#f8fafc' } }}
                          >
                            <img 
                              src={prod.imagen ? `http://localhost/rjs_animal_haus/${prod.imagen}` : 'https://placehold.co/50x50/f1f5f9/94a3b8?text=Sin+Imagen'} 
                              alt={prod.nombre} 
                              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 4 }}
                            />
                            <ListItemText 
                              primary={prod.nombre} 
                              secondary={`Gs. ${Number(prod.precio).toLocaleString('es-PY')}`} 
                              primaryTypographyProps={{ variant: 'body2', fontWeight: 600, color: '#1e293b' }}
                              secondaryTypographyProps={{ variant: 'caption', color: '#d32f2f', fontWeight: 600 }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 2, textAlign: 'center', color: '#64748b' }}>No se encontraron productos.</Box>
                  )}
                </Box>
              )}
            </Box>

            {/* Menú de Categorías (Desktop) - Derecha del buscador */}
            <Box sx={{ display: { xs: 'none', lg: 'flex' }, ml: 2 }}>
              <Button
                id="categories-button"
                aria-controls={openCategories ? 'categories-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openCategories ? 'true' : undefined}
                onClick={handleOpenCategories}
                endIcon={<ArrowDownIcon />}
                sx={{
                  color: '#334155',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  '&:hover': { color: '#d32f2f', bgcolor: 'transparent' }
                }}
              >
                Categorías
              </Button>
              <Menu
                id="categories-menu"
                anchorEl={anchorElCategories}
                open={openCategories}
                onClose={handleCloseCategories}
                MenuListProps={{
                  'aria-labelledby': 'categories-button',
                }}
                sx={{
                  mt: 1,
                  '& .MuiPaper-root': {
                    borderRadius: '12px',
                    minWidth: '200px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                    border: '1px solid #f1f5f9',
                  }
                }}
              >
                {categoriesList.map((cat) => (
                  <MenuItem 
                    key={cat.id} 
                    onClick={handleCloseCategories} 
                    component="a"
                    href={`#${cat.nombre.toLowerCase().replace(/\s+/g, '-')}`}
                    sx={{ color: '#475569', py: 1.2, '&:hover': { bgcolor: '#f8fafc', color: '#d32f2f' } }}
                  >
                    {cat.nombre}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

          {/* Controles de Carrito / Usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {/* Favoritos */}
            <Tooltip title="Favoritos">
              <IconButton sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}>
                <Badge badgeContent={getFavoriteCount()} sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: '#ef4444', 
                    color: '#ffffff',
                    fontWeight: 600,
                    minWidth: '18px',
                    height: '18px',
                    fontSize: '0.7rem'
                  } 
                }}>
                  <FavoriteIcon sx={{ fontSize: '1.4rem' }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Carrito de Compras */}
            <Tooltip title="Carrito de compras">
              <IconButton onClick={() => setCartDrawerOpen(true)} sx={{ color: '#d32f2f', '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)' } }}>
                <Badge badgeContent={getCartCount()} sx={{ 
                  '& .MuiBadge-badge': { 
                    bgcolor: '#ff9800', 
                    color: '#ffffff',
                    fontWeight: 600,
                    minWidth: '18px',
                    height: '18px',
                    fontSize: '0.7rem'
                  } 
                }}>
                  <ShoppingCartIcon sx={{ fontSize: '1.4rem' }} />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar / Usuario */}
            <Box sx={{ ml: 0.5 }}>
              {isLoggedIn ? (
                <>
                  <Tooltip title="Mi Cuenta">
                    <IconButton
                      onClick={handleOpenUserMenu}
                      sx={{ p: 0.5 }}
                    >
                      <Avatar
                        alt="Usuario"
                        src=""
                        sx={{
                          width: 34,
                          height: 34,
                          bgcolor: '#e2e8f0',
                          color: '#1e293b',
                          fontWeight: 600,
                          fontSize: '0.9rem'
                        }}
                      >
                        {userData && userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'U'}
                      </Avatar>
                    </IconButton>
                  </Tooltip>

                  {/* Menú desplegable de Usuario */}
                  <Menu
                    sx={{
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: '12px',
                        minWidth: '220px',
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
                        border: '1px solid #f1f5f9',
                      }
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Box sx={{ px: 2, py: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        Hola, {userData ? userData.nombre : 'Usuario'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        {userData ? userData.email : ''}
                      </Typography>
                    </Box>
                    <Divider sx={{ borderColor: '#f1f5f9' }} />

                    <MenuItem onClick={() => {
                      setChangePasswordOpen(true);
                      handleCloseUserMenu();
                    }} sx={{ py: 1.5, gap: 1.5, color: '#475569', '&:hover': { bgcolor: '#f8fafc', color: '#1e293b' } }}>
                      <PersonIcon fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>Mi Cuenta</Typography>
                    </MenuItem>

                    <MenuItem onClick={handleCloseUserMenu} sx={{ py: 1.5, gap: 1.5, color: '#475569', '&:hover': { bgcolor: '#f8fafc', color: '#1e293b' } }}>
                      <ReceiptIcon fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>Mis Pedidos</Typography>
                    </MenuItem>

                    <Divider sx={{ borderColor: '#f1f5f9' }} />

                    <MenuItem onClick={() => {
                      handleCloseUserMenu();
                      localStorage.removeItem('animal_haus_user');
                      setUserData(null);
                      setIsLoggedIn(false);
                      window.dispatchEvent(new Event('authChange'));
                    }} sx={{ py: 1.5, gap: 1.5, color: '#64748b', '&:hover': { bgcolor: '#fef2f2', color: '#ef4444' } }}>
                      <LogoutIcon fontSize="small" />
                      <Typography variant="body2" fontWeight={500}>Cerrar Sesión</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  disableElevation
                  onClick={() => handleOpenAuthModal('login')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '50px',
                    backgroundColor: '#ff9800',
                    color: '#ffffff',
                    fontWeight: 600,
                    px: 3,
                    py: 0.8,
                    '&:hover': {
                      backgroundColor: '#f57c00',
                    },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Iniciar Sesión
                </Button>
              )}
            </Box>

          </Box>
        </Toolbar>
      </AppBar>

      {/* Cajón lateral para navegación móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 300,
            bgcolor: '#ffffff',
            backgroundImage: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onLoginSuccess={(user) => {
          localStorage.setItem('animal_haus_user', JSON.stringify(user));
          setUserData(user);
          setIsLoggedIn(true);
          setAuthModalOpen(false);
          window.dispatchEvent(new Event('authChange'));
        }}
      />

      <ChangePasswordModal
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        userData={userData}
      />

      {/* Drawer del Carrito de Compras */}
      <Drawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': { width: { xs: '100%', sm: 400 }, p: 0 },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShoppingCartIcon sx={{ color: '#d32f2f' }} />
              <Typography variant="h6" fontWeight="700" sx={{ color: '#1e293b' }}>
                Tu Carrito
              </Typography>
            </Box>
            <IconButton onClick={() => setCartDrawerOpen(false)} sx={{ color: '#64748b' }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {cartItems.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.6, gap: 2 }}>
                <ShoppingCartIcon sx={{ fontSize: 60, color: '#cbd5e1' }} />
                <Typography variant="body1" sx={{ color: '#475569' }}>Tu carrito está vacío</Typography>
              </Box>
            ) : (
              cartItems.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 2, pb: 2, borderBottom: '1px solid #f8fafc' }}>
                  <Box
                    component="img"
                    src={item.imagen ? `http://localhost/rjs_animal_haus/${item.imagen}` : 'https://placehold.co/100x100/f1f5f9/94a3b8?text=Sin+Imagen'}
                    sx={{ width: 80, height: 80, objectFit: 'contain', borderRadius: 2, border: '1px solid #f1f5f9', p: 0.5 }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1e293b', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.nombre}
                      </Typography>
                      <IconButton size="small" onClick={() => removeFromCart(item.id)} sx={{ color: '#ef4444', p: 0.5, ml: 1 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '50px' }}>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity - 1)} sx={{ p: 0.5 }}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="body2" sx={{ px: 1.5, fontWeight: 600 }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => updateQuantity(item.id, item.quantity + 1)} sx={{ p: 0.5 }}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                        Gs. {(Number(item.precio) * item.quantity).toLocaleString('es-PY')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {cartItems.length > 0 && (
            <Box sx={{ p: 3, borderTop: '1px solid #f1f5f9', bgcolor: '#f8fafc' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#475569' }}>Total:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#1e293b' }}>
                  Gs. {getCartTotal().toLocaleString('es-PY')}
                </Typography>
              </Box>
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  if (!isLoggedIn) {
                    handleOpenAuthModal('login');
                  } else {
                    // Aquí iría la lógica de procesar pago o redirigir a WhatsApp
                    alert('Procesando compra... (En desarrollo)');
                  }
                }}
                sx={{
                  py: 1.5,
                  borderRadius: '50px',
                  bgcolor: '#d32f2f',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#b71c1c' }
                }}
              >
                Finalizar Compra
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}
