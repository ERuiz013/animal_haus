import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
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
    Collapse,
    ListItemIcon
} from '@mui/material';
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    Logout as LogoutIcon,
    PersonOutlined as PersonIcon,
    Category as CategoryIcon,
    Scale as ScaleIcon,
    Inventory as InventoryIcon,
    People as PeopleIcon,
    ReceiptLong as ReceiptIcon,
    Security as SecurityIcon,
    Storefront as StorefrontIcon,
    PointOfSale as PointOfSaleIcon,
    Business as BusinessIcon,
    ExpandLess,
    ExpandMore,
    KeyboardArrowDown as ArrowDownIcon,
    Pets as PetsIcon
} from '@mui/icons-material';
import logo from '../../../assets/animalhause.png';
import AuthModal from '../../AuthModal';
import ChangePasswordModal from '../../ChangePasswordModal';

export default function NavbarAdmin() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Desktop menus
    const [anchorElSeguridad, setAnchorElSeguridad] = useState(null);
    const [anchorElStock, setAnchorElStock] = useState(null);
    const [anchorElVentas, setAnchorElVentas] = useState(null);

    // Mobile collapses
    const [mobileOpenSeguridad, setMobileOpenSeguridad] = useState(false);
    const [mobileOpenStock, setMobileOpenStock] = useState(false);
    const [mobileOpenVentas, setMobileOpenVentas] = useState(false);

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

    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseUserMenu = () => setAnchorElUser(null);
    const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

    const handleMenuClick = (setter) => (event) => setter(event.currentTarget);
    const handleMenuClose = (setter) => () => setter(null);

    // Drawer para vista móvil
    const drawer = (
        <Box sx={{ textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <img src={logo} alt="Animal Haus Admin" style={{ height: '35px', objectFit: 'contain' }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'var(--text-h)', letterSpacing: '-0.5px' }}>
                        Panel Admin
                    </Typography>
                </Box>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Divider />

            {/* Menús móviles */}
            <List sx={{ flexGrow: 1, textAlign: 'left' }}>

                {/* Seguridad */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton onClick={() => setMobileOpenSeguridad(!mobileOpenSeguridad)}>
                        <ListItemIcon sx={{ minWidth: 40 }}><SecurityIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Seguridad" primaryTypographyProps={{ fontWeight: 600 }} />
                        {mobileOpenSeguridad ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={mobileOpenSeguridad} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/empresa" onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 32 }}><BusinessIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Empresa" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Stock */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton onClick={() => setMobileOpenStock(!mobileOpenStock)}>
                        <ListItemIcon sx={{ minWidth: 40 }}><StorefrontIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Stock" primaryTypographyProps={{ fontWeight: 600 }} />
                        {mobileOpenStock ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={mobileOpenStock} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/unidad-medida" onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 32 }}><ScaleIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Unidad de Medida" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/categorias" onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 32 }}><CategoryIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Categoria" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/animales" onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 32 }}><PetsIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Animales" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/productos" onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 32 }}><InventoryIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Productos" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Ventas */}
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <ListItemButton onClick={() => setMobileOpenVentas(!mobileOpenVentas)}>
                        <ListItemIcon sx={{ minWidth: 40 }}><PointOfSaleIcon color="primary" /></ListItemIcon>
                        <ListItemText primary="Ventas" primaryTypographyProps={{ fontWeight: 600 }} />
                        {mobileOpenVentas ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>
                <Collapse in={mobileOpenVentas} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/clientes" onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 32 }}><PeopleIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Clientes" />
                        </ListItemButton>
                        <ListItemButton sx={{ pl: 4 }} component="a" href="/admin/pedidos" onClick={handleDrawerToggle}>
                            <ListItemIcon sx={{ minWidth: 32 }}><ReceiptIcon fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Pedidos" />
                        </ListItemButton>
                    </List>
                </Collapse>

            </List>

            <Divider />
            {/* Acciones de usuario móviles */}
            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isLoggedIn ? (
                    <>
                        <Button
                            variant="outlined"
                            startIcon={<PersonIcon />}
                            fullWidth
                            onClick={() => {
                                setChangePasswordOpen(true);
                                if (mobileOpen) setMobileOpen(false);
                            }}
                            sx={{ textTransform: 'none', borderRadius: '50px', borderColor: 'var(--border)', color: 'var(--text-h)' }}
                        >
                            Perfil Admin
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => {
                                localStorage.removeItem('animal_haus_user');
                                setUserData(null);
                                setIsLoggedIn(false);
                                window.dispatchEvent(new Event('authChange'));
                            }}
                            sx={{ textTransform: 'none', borderRadius: '50px', bgcolor: 'var(--accent)' }}
                        >
                            Cerrar Sesión
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outlined"
                            fullWidth
                            onClick={() => handleOpenAuthModal('login')}
                            sx={{ textTransform: 'none', borderRadius: '50px', borderColor: 'var(--border)', color: 'var(--text-h)' }}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => handleOpenAuthModal('register')}
                            sx={{ textTransform: 'none', borderRadius: '50px', bgcolor: 'var(--accent)' }}
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
            <AppBar position="sticky" className="navbar-appbar">
                <Toolbar sx={{ justifyContent: 'space-between', minHeight: { xs: '64px', md: '80px' } }}>

                    {/* Logo y Nombre de la marca */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 1, display: { md: 'none' }, color: '#d4a373' }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Box
                            component="a"
                            href="/admin"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                textDecoration: 'none',
                                transition: 'transform 0.2s ease',
                                '&:hover': { transform: 'scale(1.02)' }
                            }}
                        >
                            <img src={logo} alt="Animal Haus Admin" className="navbar-logo" style={{ height: '42px', objectFit: 'contain' }} />
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
                                Admin Panel
                            </Typography>
                        </Box>
                    </Box>

                    {/* Menús Desplegables (Desktop) */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>

                        {/* Botón Seguridad */}
                        <Button
                            className="nav-link"
                            onClick={handleMenuClick(setAnchorElSeguridad)}
                            endIcon={<ArrowDownIcon />}
                            startIcon={<SecurityIcon fontSize="small" />}
                        >
                            Seguridad
                        </Button>
                        <Menu
                            anchorEl={anchorElSeguridad}
                            open={Boolean(anchorElSeguridad)}
                            onClose={handleMenuClose(setAnchorElSeguridad)}
                            sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '150px', mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
                        >
                            <MenuItem component="a" href="/admin/empresa" onClick={handleMenuClose(setAnchorElSeguridad)}>
                                <ListItemIcon><BusinessIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Empresa</ListItemText>
                            </MenuItem>
                        </Menu>

                        {/* Botón Stock */}
                        <Button
                            className="nav-link"
                            onClick={handleMenuClick(setAnchorElStock)}
                            endIcon={<ArrowDownIcon />}
                            startIcon={<StorefrontIcon fontSize="small" />}
                        >
                            Stock
                        </Button>
                        <Menu
                            anchorEl={anchorElStock}
                            open={Boolean(anchorElStock)}
                            onClose={handleMenuClose(setAnchorElStock)}
                            sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '150px', mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
                        >
                            <MenuItem component="a" href="/admin/unidad-medida" onClick={handleMenuClose(setAnchorElStock)}>
                                <ListItemIcon><ScaleIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Unidad de Medida</ListItemText>
                            </MenuItem>
                            <MenuItem component="a" href="/admin/categorias" onClick={handleMenuClose(setAnchorElStock)}>
                                <ListItemIcon><CategoryIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Categoria</ListItemText>
                            </MenuItem>
                            <MenuItem component="a" href="/admin/animales" onClick={handleMenuClose(setAnchorElStock)}>
                                <ListItemIcon><PetsIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Animales</ListItemText>
                            </MenuItem>
                            <MenuItem component="a" href="/admin/productos" onClick={handleMenuClose(setAnchorElStock)}>
                                <ListItemIcon><InventoryIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Productos</ListItemText>
                            </MenuItem>
                        </Menu>

                        {/* Botón Ventas */}
                        <Button
                            className="nav-link"
                            onClick={handleMenuClick(setAnchorElVentas)}
                            endIcon={<ArrowDownIcon />}
                            startIcon={<PointOfSaleIcon fontSize="small" />}
                        >
                            Ventas
                        </Button>
                        <Menu
                            anchorEl={anchorElVentas}
                            open={Boolean(anchorElVentas)}
                            onClose={handleMenuClose(setAnchorElVentas)}
                            sx={{ '& .MuiPaper-root': { borderRadius: '12px', minWidth: '150px', mt: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
                        >
                            <MenuItem component="a" href="/admin/clientes" onClick={handleMenuClose(setAnchorElVentas)}>
                                <ListItemIcon><PeopleIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Clientes</ListItemText>
                            </MenuItem>
                            <MenuItem component="a" href="/admin/pedidos" onClick={handleMenuClose(setAnchorElVentas)}>
                                <ListItemIcon><ReceiptIcon fontSize="small" /></ListItemIcon>
                                <ListItemText>Pedidos</ListItemText>
                            </MenuItem>
                        </Menu>

                    </Box>

                    {/* Controles de Usuario */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
                        {/* Avatar / Usuario */}
                        <Box sx={{ ml: 1 }}>
                            {isLoggedIn ? (
                                <>
                                    <Tooltip title="Mi Cuenta Admin">
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
                                                alt="Administrador"
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
                                                {userData && userData.nombre ? userData.nombre.charAt(0).toUpperCase() : 'A'}
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
                                                Admin: {userData ? userData.nombre : 'Usuario'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'var(--text)' }}>
                                                {userData ? userData.email : ''}
                                            </Typography>
                                        </Box>
                                        <Divider sx={{ my: 0.5, borderColor: 'var(--border)' }} />

                                        <MenuItem onClick={() => {
                                            setChangePasswordOpen(true);
                                            handleCloseUserMenu();
                                        }} sx={{ py: 1, gap: 1.5, '&:hover': { bgcolor: 'var(--accent-bg)', color: 'var(--accent)' } }}>
                                            <PersonIcon fontSize="small" />
                                            <Typography variant="body2">Perfil Admin</Typography>
                                        </MenuItem>

                                        <Divider sx={{ my: 0.5, borderColor: 'var(--border)' }} />

                                        <MenuItem onClick={() => {
                                            handleCloseUserMenu();
                                            localStorage.removeItem('animal_haus_user');
                                            setUserData(null);
                                            setIsLoggedIn(false);
                                            window.dispatchEvent(new Event('authChange'));
                                        }} sx={{ py: 1, gap: 1.5, '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.08)', color: '#d32f2f' } }}>
                                            <LogoutIcon fontSize="small" />
                                            <Typography variant="body2">Cerrar Sesión</Typography>
                                        </MenuItem>
                                    </Menu>
                                </>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={() => handleOpenAuthModal('login')}
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '50px',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text-h)',
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
                ModalProps={{
                    keepMounted: true,
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
        </>
    );
}
