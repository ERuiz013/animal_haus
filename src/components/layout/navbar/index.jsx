import { useState } from 'react';
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
  KeyboardArrowDown as ArrowDownIcon,
  Logout as LogoutIcon,
  PersonOutlined as PersonIcon,
  ReceiptLong as ReceiptIcon,
} from '@mui/icons-material';
import logo from '../../../assets/animalhause.png';

const NAV_CATEGORIES = [
  { label: 'Perros', path: '#perros' },
  { label: 'Gatos', path: '#gatos' },
  { label: 'Aves', path: '#aves' },
  { label: 'Accesorios', path: '#accesorios' },
  { label: 'Ofertas 🔥', path: '#ofertas', highlight: true }
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [cartCount, setCartCount] = useState(3); // Simulado
  const [searchVal, setSearchVal] = useState('');

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleSearchChange = (e) => {
    setSearchVal(e.target.value);
  };

  // Drawer para vista móvil
  const drawer = (
    <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img src={logo} alt="Animal Haus" style={{ height: '35px', objectFit: 'contain' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--text-h)', letterSpacing: '-0.5px' }}>
            Animal Haus
          </Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      
      {/* Barra de búsqueda móvil */}
      <Box sx={{ p: 2 }}>
        <div className={`search-container ${isSearchFocused ? 'focused' : ''}`} style={{ margin: 0, maxWidth: '100%' }}>
          <div className="search-icon-wrapper">
            <SearchIcon sx={{ color: 'var(--text)' }} />
          </div>
          <InputBase
            placeholder="Buscar productos..."
            className="search-input"
            value={searchVal}
            onChange={handleSearchChange}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            fullWidth
          />
        </div>
      </Box>
      <Divider />

      {/* Lista de categorías móvil */}
      <List sx={{ flexGrow: 1 }}>
        {NAV_CATEGORIES.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              component="a" 
              href={item.path} 
              onClick={handleDrawerToggle}
              sx={{ 
                justifyContent: 'center',
                color: item.highlight ? 'var(--accent)' : 'var(--text)',
                fontWeight: item.highlight ? 'bold' : 'normal'
              }}
            >
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{ 
                  fontWeight: item.highlight ? 700 : 500,
                  fontSize: '1.1rem'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      {/* Acciones de usuario móviles */}
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button 
          variant="outlined" 
          startIcon={<PersonIcon />} 
          fullWidth
          sx={{ textTransform: 'none', borderRadius: '50px', borderColor: 'var(--border)', color: 'var(--text-h)' }}
        >
          Mi Perfil
        </Button>
        <Button 
          variant="contained" 
          fullWidth
          sx={{ textTransform: 'none', borderRadius: '50px', bgcolor: 'var(--accent)' }}
        >
          Cerrar Sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" className="navbar-appbar">
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: '64px', md: '80px' } }}>
          
          {/* Logo y Nombre de la marca */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: 'none' }, color: 'var(--text-h)' }}
            >
              <MenuIcon />
            </IconButton>
            <Box 
              component="a" 
              href="/" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5, 
                textDecoration: 'none',
                transition: 'transform 0.2s ease',
                '&:hover': { transform: 'scale(1.02)' }
              }}
            >
              <img src={logo} alt="Animal Haus" className="navbar-logo" style={{ height: '42px', objectFit: 'contain' }} />
              <Typography
                variant="h6"
                noWrap
                component="span"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  fontWeight: 800,
                  fontSize: '1.4rem',
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(45deg, #b07d4f, #d4a373)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Animal Haus
              </Typography>
            </Box>
          </Box>

          {/* Menú de Categorías (Desktop) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {NAV_CATEGORIES.map((item) => (
              <Button
                key={item.label}
                component="a"
                href={item.path}
                className={item.highlight ? 'nav-link-highlight' : 'nav-link'}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Buscador y Controles de Carrito / Usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
            
            {/* Barra de búsqueda (Desktop) */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
                <div className="search-icon-wrapper">
                  <SearchIcon sx={{ color: 'var(--text)' }} />
                </div>
                <InputBase
                  placeholder="Buscar productos..."
                  className="search-input"
                  value={searchVal}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </Box>

            {/* Favoritos */}
            <Tooltip title="Favoritos">
              <IconButton 
                className="action-icon-btn" 
                aria-label="favoritos"
                sx={{ color: 'var(--text)' }}
              >
                <Badge color="error" variant="dot">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Carrito de Compras */}
            <Tooltip title="Carrito de compras">
              <IconButton 
                className="action-icon-btn" 
                aria-label="carrito de compras"
                sx={{ color: 'var(--text)' }}
              >
                <Badge badgeContent={cartCount} color="error" sx={{ '& .MuiBadge-badge': { fontWeight: 'bold' } }}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Avatar / Usuario */}
            <Box sx={{ ml: 1 }}>
              <Tooltip title="Mi Cuenta">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0.5, 
                    border: '2px solid transparent',
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: 'var(--accent)' }
                  }}
                >
                  <Avatar 
                    alt="Usuario" 
                    src="" 
                    sx={{ 
                      width: 36, 
                      height: 36, 
                      bgcolor: 'var(--accent-bg)', 
                      color: 'var(--accent)',
                      fontWeight: 'bold',
                      fontSize: '0.95rem'
                    }}
                  >
                    U
                  </Avatar>
                </IconButton>
              </Tooltip>
              
              {/* Menú desplegable de Usuario */}
              <Menu
                sx={{ 
                  mt: '45px',
                  '& .MuiPaper-root': {
                    borderRadius: '16px',
                    minWidth: '200px',
                    boxShadow: 'rgba(0, 0, 0, 0.08) 0px 15px 30px 0px, rgba(0, 0, 0, 0.03) 0px 5px 10px 0px',
                    border: '1px solid var(--border)',
                    bgcolor: 'var(--bg)',
                    color: 'var(--text-h)'
                  }
                }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'var(--text-h)' }}>
                    Hola, Elias!
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'var(--text)' }}>
                    elias@ejemplo.com
                  </Typography>
                </Box>
                <Divider sx={{ my: 0.5, borderColor: 'var(--border)' }} />
                
                <MenuItem onClick={handleCloseUserMenu} sx={{ py: 1, gap: 1.5, '&:hover': { bgcolor: 'var(--accent-bg)', color: 'var(--accent)' } }}>
                  <PersonIcon fontSize="small" />
                  <Typography variant="body2">Mi Cuenta</Typography>
                </MenuItem>
                
                <MenuItem onClick={handleCloseUserMenu} sx={{ py: 1, gap: 1.5, '&:hover': { bgcolor: 'var(--accent-bg)', color: 'var(--accent)' } }}>
                  <ReceiptIcon fontSize="small" />
                  <Typography variant="body2">Mis Pedidos</Typography>
                </MenuItem>
                
                <Divider sx={{ my: 0.5, borderColor: 'var(--border)' }} />
                
                <MenuItem onClick={handleCloseUserMenu} sx={{ py: 1, gap: 1.5, '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)', color: '#d32f2f' } }}>
                  <LogoutIcon fontSize="small" />
                  <Typography variant="body2">Cerrar Sesión</Typography>
                </MenuItem>
              </Menu>
            </Box>

          </Box>
        </Toolbar>
      </AppBar>

      {/* Cajón lateral para navegación móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Mejor rendimiento en móviles
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            bgcolor: 'var(--bg)',
            backgroundImage: 'none',
            borderRight: '1px solid var(--border)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
