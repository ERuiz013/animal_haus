import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Alert, Button, IconButton, Tooltip,
    TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
    FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete,
    Snackbar, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../config';


export default function AjustesExistencias() {
    // Listado de ajustes
    const [ajustes, setAjustes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    // Estado del modal de nuevo ajuste
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Cabecera del ajuste
    const [ajusteHead, setAjusteHead] = useState({
        tipo_ajuste: 'entrada', // 'entrada' o 'salida'
        motivo: ''
    });

    // Detalle de productos (Carrito de ajustes)
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cantidadSelect, setCantidadSelect] = useState(1);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [productos, setProductos] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(false);

    // Detalle Modal
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [selectedAjuste, setSelectedAjuste] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchAjustes();
    }, []);

    // Búsqueda dinámica de productos
    useEffect(() => {
        const inputVal = searchInputValue || '';
        if (inputVal.length < 4) {
            setProductos([]);
            return;
        }

        const timer = setTimeout(() => {
            setLoadingProductos(true);
            fetch(`${API_BASE_URL}/getProductos.php?q=${encodeURIComponent(inputVal)}`)
                .then(res => res.json())
                .then(data => {
                    setProductos(Array.isArray(data) ? data : []);
                    setLoadingProductos(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingProductos(false);
                });
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchInputValue]);

    const fetchAjustes = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/getAjustes.php`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setAjustes(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message || 'Error al obtener los ajustes de existencias.');
                setLoading(false);
                setAjustes([]);
            });
    };

    const handleAddProduct = () => {
        if (!selectedProduct) return;
        if (cantidadSelect < 1) {
            setSnackbar({ open: true, message: 'La cantidad debe ser mayor a 0', severity: 'error' });
            return;
        }

        if (ajusteHead.tipo_ajuste === 'salida' && cantidadSelect > selectedProduct.stock) {
            setSnackbar({ open: true, message: `Stock insuficiente para salida. Disponible: ${selectedProduct.stock}`, severity: 'warning' });
            return;
        }

        // Check if already in cart
        const existingIndex = cart.findIndex(c => c.id === selectedProduct.id);
        if (existingIndex >= 0) {
            const newCart = [...cart];
            const newQty = newCart[existingIndex].cantidad + Number(cantidadSelect);
            
            if (ajusteHead.tipo_ajuste === 'salida' && newQty > selectedProduct.stock) {
                setSnackbar({ open: true, message: `Stock insuficiente para salida. Disponible: ${selectedProduct.stock}`, severity: 'warning' });
                return;
            }

            newCart[existingIndex].cantidad = newQty;
            setCart(newCart);
        } else {
            setCart([...cart, { ...selectedProduct, cantidad: Number(cantidadSelect) }]);
        }

        setSelectedProduct(null);
        setCantidadSelect(1);
    };

    const handleRemoveProduct = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setCart([]);
        setSelectedProduct(null);
        setCantidadSelect(1);
        setSearchInputValue('');
        setProductos([]);
        setAjusteHead({
            tipo_ajuste: 'entrada',
            motivo: ''
        });
    };

    const handleGuardarAjuste = () => {
        if (!ajusteHead.motivo.trim()) {
            setSnackbar({ open: true, message: 'Debe ingresar un motivo para el ajuste.', severity: 'warning' });
            return;
        }
        if (cart.length === 0) {
            setSnackbar({ open: true, message: 'Debe agregar al menos un producto al ajuste.', severity: 'warning' });
            return;
        }

        setSaving(true);

        const payload = {
            ...ajusteHead,
            detalles: cart.map(item => ({
                producto_id: item.id,
                cantidad: item.cantidad
            }))
        };

        fetch(`${API_BASE_URL}/createAjuste.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                setSaving(false);
                if (data.error) throw new Error(data.error);

                setSnackbar({ open: true, message: 'Ajuste de existencias registrado con éxito.', severity: 'success' });
                handleCloseModal();
                fetchAjustes();
            })
            .catch(err => {
                setSaving(false);
                setSnackbar({ open: true, message: err.message || 'Error al registrar el ajuste.', severity: 'error' });
            });
    };

    const handleVerDetalle = (ajuste) => {
        setLoadingDetail(true);
        setDetailModalOpen(true);
        fetch(`${API_BASE_URL}/getAjusteDetalle.php?id=${ajuste.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setSelectedAjuste(data);
                setLoadingDetail(false);
            })
            .catch(err => {
                setLoadingDetail(false);
                setSnackbar({ open: true, message: err.message || 'Error al obtener detalles.', severity: 'error' });
                setDetailModalOpen(false);
            });
    };

    return (
        <Box sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', minHeight: '100vh', py: 5 }}>
            <Container maxWidth="lg">
                <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: '#ffffff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <InventoryIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Ajustes de Existencias
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Gestione las entradas y salidas manuales del inventario.
                                </Typography>
                            </Box>
                        </Box>
                        <Button size="small"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setModalOpen(true)}
                            sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5, boxShadow: 2 }}
                        >
                            Nuevo Ajuste
                        </Button>
                    </Box>

                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <TableContainer sx={{ border: '1px solid #edf2f7', borderRadius: 3, overflowX: 'auto' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Nro. Ajuste</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Fecha</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Tipo</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Motivo</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ajustes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay ajustes registrados.</TableCell>
                                        </TableRow>
                                    ) : (
                                        ajustes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((a, index) => (
                                            <TableRow key={a.id || index} hover>
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>#{a.id}</TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b' }}>{new Date(a.fecha_creacion || a.fecha).toLocaleString('es-PY', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={a.tipo_ajuste.toUpperCase()} 
                                                        size="small" 
                                                        color={a.tipo_ajuste === 'entrada' ? 'success' : 'error'} 
                                                        sx={{ fontWeight: 600, borderRadius: 1 }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="left" sx={{ color: '#1e293b' }}>
                                                    {a.motivo}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Ver Detalle">
                                                        <IconButton onClick={() => handleVerDetalle(a)} sx={{ color: '#3b82f6', backgroundColor: '#eff6ff', '&:hover': { backgroundColor: '#dbeafe' } }}>
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[15, 30, 50]}
                                component="div"
                                count={ajustes.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                                labelRowsPerPage="Filas por página:"
                            />
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            {/* Modal Nuevo Ajuste */}
            <Dialog
                open={modalOpen}
                onClose={() => !saving && handleCloseModal()}
                fullWidth
                maxWidth="md"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: 24, minHeight: '60vh' } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 700, fontSize: '1.1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', p: 2 }}>
                    <InventoryIcon sx={{ color: '#c4a484' }} />
                    Registrar Nuevo Ajuste de Existencias
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        
                        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, pt: 1 }}>
                            <TextField
                                select
                                size="small"
                                label="Tipo de Ajuste"
                                value={ajusteHead.tipo_ajuste}
                                onChange={(e) => setAjusteHead({ ...ajusteHead, tipo_ajuste: e.target.value })}
                                sx={{ minWidth: 250, flexShrink: 0 }}
                            >
                                <MenuItem value="entrada">Entrada (Aumento)</MenuItem>
                                <MenuItem value="salida">Salida (Disminución)</MenuItem>
                            </TextField>

                            <TextField 
                                size="small" 
                                fullWidth 
                                label="Motivo del Ajuste" 
                                placeholder="Ej: Mercadería dañada, Ingreso por conteo..."
                                value={ajusteHead.motivo}
                                onChange={(e) => setAjusteHead({ ...ajusteHead, motivo: e.target.value })}
                            />
                        </Box>

                        <Typography variant="h6" fontWeight="700" sx={{ color: '#334155', mt: 2 }}>Detalle de Productos</Typography>

                        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                            <Autocomplete size="small"
                                fullWidth
                                sx={{ flexGrow: 1 }}
                                options={productos || []}
                                getOptionLabel={(option) => option && option.nombre ? `${option.nombre} (Stock actual: ${option.stock})` : ''}
                                value={selectedProduct}
                                onChange={(event, newValue) => setSelectedProduct(newValue)}
                                onInputChange={(event, newInputValue) => setSearchInputValue(newInputValue || '')}
                                loading={loadingProductos}
                                noOptionsText={(searchInputValue || '').length < 4 ? "Escriba 4 caracteres para buscar..." : "No se encontraron productos"}
                                renderInput={(params) => <TextField size="small" {...params} label="Buscar Producto" variant="outlined" />}
                                isOptionEqualToValue={(option, value) => option && value ? option.id === value.id : option === value}
                            />
                            <TextField size="small"
                                label="Cant."
                                type="number"
                                inputProps={{ min: 1 }}
                                value={cantidadSelect}
                                onChange={(e) => setCantidadSelect(e.target.value)}
                                sx={{ width: '100px' }}
                            />
                            <Button size="small"
                                variant="contained"
                                onClick={handleAddProduct}
                                sx={{ backgroundColor: '#1e293b', '&:hover': { backgroundColor: '#0f172a' }, color: '#fff' }}
                            >
                                Agregar
                            </Button>
                        </Box>

                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #edf2f7', borderRadius: 2, width: '100%', mt: 1 }}>
                            <Table size="small" sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell>Producto</TableCell>
                                        <TableCell align="center">Cant. a Ajustar</TableCell>
                                        <TableCell align="center">Acción</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {cart.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>No hay productos en el ajuste</TableCell>
                                        </TableRow>
                                    ) : (
                                        cart.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontWeight: 500 }}>{item.nombre}</TableCell>
                                                <TableCell align="center">
                                                    <Typography color={ajusteHead.tipo_ajuste === 'entrada' ? 'success.main' : 'error.main'} fontWeight="bold">
                                                        {ajusteHead.tipo_ajuste === 'entrada' ? '+' : '-'}{item.cantidad}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton size="small" color="error" onClick={() => handleRemoveProduct(index)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    <Button size="small" onClick={handleCloseModal} disabled={saving} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Cancelar
                    </Button>
                    <Button size="small"
                        onClick={handleGuardarAjuste}
                        variant="contained"
                        disabled={saving || cart.length === 0}
                        sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 4 }}
                    >
                        {saving ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Ajuste'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal Detalle del Ajuste */}
            <Dialog open={detailModalOpen} onClose={() => setDetailModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#1e293b', backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7' }}>
                    Detalle del Ajuste #{selectedAjuste?.id}
                </DialogTitle>
                <DialogContent sx={{ p: 3 }}>
                    {loadingDetail ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
                    ) : selectedAjuste ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" color="text.secondary">Fecha:</Typography>
                                <Typography fontWeight="600">{new Date(selectedAjuste.fecha_creacion || selectedAjuste.fecha).toLocaleString('es-PY')}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" color="text.secondary">Tipo:</Typography>
                                <Chip 
                                    label={(selectedAjuste.tipo_ajuste || '').toUpperCase()} 
                                    size="small" 
                                    color={selectedAjuste.tipo_ajuste === 'entrada' ? 'success' : 'error'} 
                                    sx={{ fontWeight: 600, borderRadius: 1 }} 
                                />
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="subtitle2" color="text.secondary">Motivo:</Typography>
                                <Typography fontWeight="500">{selectedAjuste.motivo}</Typography>
                            </Box>

                            <Typography variant="h6" sx={{ mt: 2, mb: 1, fontSize: '1rem', fontWeight: 'bold' }}>Productos Ajustados</Typography>
                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #edf2f7', borderRadius: 2 }}>
                                <Table size="small" sx={{ minWidth: 650 }}>
                                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="center">Cantidad</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(selectedAjuste.detalles || []).map((det, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{det.producto_nombre}</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 'bold', color: selectedAjuste.tipo_ajuste === 'entrada' ? 'success.main' : 'error.main' }}>
                                                    {selectedAjuste.tipo_ajuste === 'entrada' ? '+' : '-'}{det.cantidad}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    ) : (
                        <Typography color="error">No se encontraron detalles.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    <Button onClick={() => setDetailModalOpen(false)} color="inherit" variant="contained" sx={{ backgroundColor: '#e2e8f0', color: '#334155', '&:hover': { backgroundColor: '#cbd5e1' } }}>
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>

        </Box>
    );
}
