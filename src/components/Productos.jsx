import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Chip, TablePagination, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AutorenewIcon from '@mui/icons-material/Autorenew';

export default function Productos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [animales, setAnimales] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProducto, setSelectedProducto] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmAnularOpen, setConfirmAnularOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes, uniRes, animalRes] = await Promise.all([
                fetch('http://localhost/rjs_animal_haus/api/getProductos.php'),
                fetch('http://localhost/rjs_animal_haus/api/getCategorias.php'),
                fetch('http://localhost/rjs_animal_haus/api/getUnidadesMedidas.php'),
                fetch('http://localhost/rjs_animal_haus/api/getAnimales.php')
            ]);

            if (!prodRes.ok || !catRes.ok || !uniRes.ok || !animalRes.ok) {
                throw new Error('Error al cargar los datos');
            }

            const [prodData, catData, uniData, animalData] = await Promise.all([
                prodRes.json(),
                catRes.json(),
                uniRes.json(),
                animalRes.json()
            ]);

            if (prodData.error) throw new Error(prodData.error);
            if (catData.error) throw new Error(catData.error);
            if (uniData.error) throw new Error(uniData.error);
            if (animalData.error) throw new Error(animalData.error);

            setProductos(prodData);
            setCategorias(catData);
            setUnidades(uniData);
            setAnimales(animalData);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProductos = () => {
        fetch('http://localhost/rjs_animal_haus/api/getProductos.php')
            .then(res => res.json())
            .then(data => {
                if (!data.error) setProductos(data);
            });
    };

    const getCategoriaName = (id) => {
        const cat = categorias.find(c => String(c.id) === String(id));
        return cat ? cat.nombre : 'Desconocida';
    };

    const getUnidadName = (id) => {
        const uni = unidades.find(u => String(u.id) === String(id));
        return uni ? uni.simbolo : 'N/A';
    };

    useEffect(() => {
        if (selectedProducto && selectedProducto.categoria_id && selectedProducto.nombre && selectedProducto.nombre.length >= 3) {
            const categoria = getCategoriaName(selectedProducto.categoria_id);
            const catCode = categoria.substring(0, 3).toUpperCase();
            const nomCode = selectedProducto.nombre.replace(/\s+/g, '').substring(0, 3).toUpperCase();
            
            let numUnico = "";
            if (selectedProducto.sku) {
                const parts = selectedProducto.sku.split('-');
                if (parts.length === 3 && /^\d+$/.test(parts[2])) {
                    numUnico = parts[2];
                }
            }
            if (!numUnico) {
                numUnico = Math.floor(1000 + Math.random() * 9000);
            }
            
            const nuevoSku = `${catCode}-${nomCode}-${numUnico}`;
            
            if (selectedProducto.sku !== nuevoSku) {
                setSelectedProducto(prev => ({ ...prev, sku: nuevoSku }));
            }
        }
    }, [selectedProducto?.nombre, selectedProducto?.categoria_id]);

    const handleRowClick = (producto) => {
        setSelectedProducto({ ...producto, imagenFile: null, imagenPreview: null });
        setModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedProducto({ 
            id: null, 
            categoria_id: '', 
            animal_id: '',
            uni_med_id: '', 
            sku: '', 
            nombre: '', 
            precio: '', 
            stock: '', 
            imagen: '',
            detalle: '',
            tipo_precio: 'Normal',
            imagenFile: null,
            imagenPreview: null
        });
        setModalOpen(true);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedProducto(null);
        setConfirmAnularOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedProducto(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const generarSKU = () => {
        if (!selectedProducto.categoria_id || !selectedProducto.nombre) {
            setSnackbar({ open: true, message: 'Ingresa primero la categoría y el nombre del producto', severity: 'warning' });
            return;
        }
        const categoria = getCategoriaName(selectedProducto.categoria_id);
        const catCode = categoria.substring(0, 3).toUpperCase();
        const nomCode = selectedProducto.nombre.replace(/\s+/g, '').substring(0, 3).toUpperCase();
        const numUnico = Math.floor(1000 + Math.random() * 9000);
        const nuevoSku = `${catCode}-${nomCode}-${numUnico}`;
        
        setSelectedProducto(prev => ({ ...prev, sku: nuevoSku }));
        setSnackbar({ open: true, message: 'SKU autogenerado correctamente', severity: 'success' });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedProducto(prev => ({
                ...prev,
                imagenFile: file,
                imagenPreview: URL.createObjectURL(file)
            }));
        }
    };

    const handleSave = () => {
        setSaving(true);
        const isNew = !selectedProducto.id;
        const endpoint = isNew 
            ? 'http://localhost/rjs_animal_haus/api/createProducto.php' 
            : 'http://localhost/rjs_animal_haus/api/updateProducto.php';

        const formData = new FormData();
        if (!isNew) formData.append('id', selectedProducto.id);
        
        formData.append('categoria_id', selectedProducto.categoria_id);
        formData.append('animal_id', selectedProducto.animal_id || '');
        formData.append('uni_med_id', selectedProducto.uni_med_id);
        formData.append('sku', selectedProducto.sku);
        formData.append('nombre', selectedProducto.nombre);
        formData.append('precio', selectedProducto.precio);
        formData.append('stock', selectedProducto.stock);
        formData.append('detalle', selectedProducto.detalle || '');
        formData.append('tipo_precio', selectedProducto.tipo_precio || 'Normal');
        
        if (selectedProducto.imagenFile) {
            formData.append('imagen', selectedProducto.imagenFile);
        }

        fetch(endpoint, {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            setSaving(false);
            if (data.error) {
                setSnackbar({ open: true, message: data.error, severity: 'error' });
            } else {
                setSnackbar({ open: true, message: data.message || (isNew ? 'Producto creado' : 'Producto actualizado'), severity: 'success' });
                handleModalClose();
                fetchProductos();
            }
        })
        .catch(err => {
            setSaving(false);
            setSnackbar({ open: true, message: isNew ? 'Error al crear' : 'Error al actualizar', severity: 'error' });
        });
    };

    const handleAnularClick = () => {
        setConfirmAnularOpen(true);
    };

    const handleConfirmAnular = () => {
        setSaving(true);
        fetch('http://localhost/rjs_animal_haus/api/anularProducto.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedProducto.id
            })
        })
        .then(res => res.json())
        .then(data => {
            setSaving(false);
            setConfirmAnularOpen(false);
            if (data.error) {
                setSnackbar({ open: true, message: data.error, severity: 'error' });
            } else {
                setSnackbar({ open: true, message: data.message || 'Producto anulado', severity: 'success' });
                handleModalClose();
                fetchProductos();
            }
        })
        .catch(err => {
            setSaving(false);
            setConfirmAnularOpen(false);
            setSnackbar({ open: true, message: 'Error al anular', severity: 'error' });
        });
    };

    const handleSnackbarClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const filteredProductos = productos.filter(prod => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            (prod.nombre && prod.nombre.toLowerCase().includes(searchLower)) ||
            (prod.sku && prod.sku.toLowerCase().includes(searchLower)) ||
            (getCategoriaName(prod.categoria_id) && getCategoriaName(prod.categoria_id).toLowerCase().includes(searchLower))
        );
    });

    return (
        <Box sx={{
            flexGrow: 1,
            background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
            minHeight: '100vh',
            py: 5
        }}>
            <Container maxWidth="lg">
                <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: '#ffffff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <InventoryIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Gestión de Productos
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Administra el inventario de productos, precios y existencias.
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Buscar producto..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setPage(0);
                                }}
                                sx={{ backgroundColor: '#ffffff', borderRadius: 1, minWidth: '250px' }}
                            />
                            <Button 
                                variant="contained" 
                                startIcon={<AddIcon />}
                                onClick={handleAddClick}
                                sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5, boxShadow: 2 }}
                            >
                                Nuevo Producto
                            </Button>
                        </Box>
                    </Box>
                    {loading ? (
                        <CircularProgress />
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <TableContainer sx={{ border: '1px solid #edf2f7', borderRadius: 3, overflow: 'hidden' }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                    <TableRow>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Imagen</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>SKU</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Producto</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Categoría</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Precio</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Stock</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProductos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay productos disponibles.</TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProductos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((prod) => (
                                            <TableRow 
                                                key={prod.id} 
                                                hover 
                                                sx={{ transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center">
                                                    {prod.imagen ? (
                                                        <Box 
                                                            component="img" 
                                                            src={`http://localhost/rjs_animal_haus/${prod.imagen}`} 
                                                            alt={prod.nombre}
                                                            sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, border: '1px solid #edf2f7' }}
                                                        />
                                                    ) : (
                                                        <Box sx={{ width: 48, height: 48, borderRadius: 2, backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <InventoryIcon sx={{ color: '#cbd5e1' }} />
                                                        </Box>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                                                    <Chip label={prod.sku} size="small" sx={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
                                                </TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        {prod.nombre}
                                                        <Chip 
                                                            label={getUnidadName(prod.uni_med_id)} 
                                                            size="small" 
                                                            variant="outlined"
                                                            sx={{ height: 20, fontSize: '0.7rem', color: '#8b5a2b', borderColor: '#d4a373', backgroundColor: '#faf6f0', fontWeight: 700 }} 
                                                        />
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b' }}>
                                                    {getCategoriaName(prod.categoria_id)}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: '#10b981' }}>
                                                    Gs. {Number(prod.precio).toLocaleString('es-PY')}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip 
                                                        label={prod.stock} 
                                                        size="small" 
                                                        color={prod.stock > 10 ? "success" : prod.stock > 0 ? "warning" : "error"} 
                                                        sx={{ fontWeight: 600 }} 
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Editar producto">
                                                        <IconButton 
                                                            onClick={(e) => { e.stopPropagation(); handleRowClick(prod); }}
                                                            sx={{ color: '#c4a484', backgroundColor: '#faf6f0', '&:hover': { backgroundColor: '#f0e6d2' } }}
                                                        >
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                component="div"
                                count={filteredProductos.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Filas por página:"
                                labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count !== -1 ? count : `más de ${to}`}`}
                            />
                        </TableContainer>
                    )}
                </Paper>
            </Container>

            {/* Modal para editar / agregar */}
            <Dialog 
                open={modalOpen} 
                onClose={handleModalClose} 
                fullWidth 
                maxWidth="md"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: 24 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 800, backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', p: 3 }}>
                    {selectedProducto?.id ? <EditIcon sx={{ color: '#c4a484' }} /> : <AddIcon sx={{ color: '#c4a484' }} />}
                    {selectedProducto?.id ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ffffff', p: 4, pt: '32px !important' }}>
                    {selectedProducto && (
                        <Box component="form" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            
                            {/* IMAGEN UPLOAD SECTION */}
                            <Box sx={{ gridColumn: { xs: '1fr', sm: 'span 2' }, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 3, border: '2px dashed #cbd5e1', borderRadius: 3, backgroundColor: '#f8fafc' }}>
                                {selectedProducto.imagenPreview || selectedProducto.imagen ? (
                                    <Box 
                                        component="img" 
                                        src={selectedProducto.imagenPreview ? selectedProducto.imagenPreview : `http://localhost/rjs_animal_haus/${selectedProducto.imagen}`} 
                                        alt="Preview"
                                        sx={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 3, border: '1px solid #e2e8f0', boxShadow: 1 }}
                                    />
                                ) : (
                                    <Box sx={{ width: 120, height: 120, borderRadius: 3, backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <InventoryIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
                                    </Box>
                                )}
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUploadIcon />}
                                    sx={{ textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#cbd5e1' }}
                                >
                                    {selectedProducto.imagen || selectedProducto.imagenPreview ? 'Cambiar Imagen' : 'Subir Imagen'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        disabled={saving}
                                    />
                                </Button>
                            </Box>

                            <TextField
                                label="Nombre del Producto"
                                name="nombre"
                                value={selectedProducto.nombre || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                autoFocus
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                            <TextField
                                label="SKU (Código)"
                                name="sku"
                                value={selectedProducto.sku || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Tooltip title="Autogenerar SKU">
                                                <IconButton onClick={generarSKU} edge="end" sx={{ color: '#f59e0b' }}>
                                                    <AutorenewIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </InputAdornment>
                                    )
                                }}
                            />

                            <FormControl fullWidth disabled={saving} variant="outlined">
                                <InputLabel id="categoria-label">Categoría</InputLabel>
                                <Select
                                    labelId="categoria-label"
                                    name="categoria_id"
                                    value={selectedProducto.categoria_id || ''}
                                    label="Categoría"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="">
                                        <em>-- Seleccione Categoría --</em>
                                    </MenuItem>
                                    {categorias.map(c => (
                                        <MenuItem key={c.id} value={c.id}>
                                            {c.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth disabled={saving} variant="outlined">
                                <InputLabel id="animal-label">Tipo de Animal</InputLabel>
                                <Select
                                    labelId="animal-label"
                                    name="animal_id"
                                    value={selectedProducto.animal_id || ''}
                                    label="Tipo de Animal"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="">
                                        <em>-- Seleccione Animal --</em>
                                    </MenuItem>
                                    {animales.map(a => (
                                        <MenuItem key={a.id} value={a.id}>
                                            {a.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth disabled={saving} variant="outlined">
                                <InputLabel id="unidad-label">Unidad de Medida</InputLabel>
                                <Select
                                    labelId="unidad-label"
                                    name="uni_med_id"
                                    value={selectedProducto.uni_med_id || ''}
                                    label="Unidad de Medida"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="">
                                        <em>-- Seleccione Unidad --</em>
                                    </MenuItem>
                                    {unidades.map(u => (
                                        <MenuItem key={u.id} value={u.id}>
                                            {u.nombre} ({u.simbolo})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Precio"
                                name="precio"
                                type="number"
                                value={selectedProducto.precio || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />

                            <FormControl fullWidth disabled={saving} variant="outlined">
                                <InputLabel id="tipo-precio-label">Tipo de Precio</InputLabel>
                                <Select
                                    labelId="tipo-precio-label"
                                    name="tipo_precio"
                                    value={selectedProducto.tipo_precio || 'Normal'}
                                    label="Tipo de Precio"
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="Normal">Normal</MenuItem>
                                    <MenuItem value="Descuento">Descuento</MenuItem>
                                    <MenuItem value="Oferta">Oferta</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                label="Stock"
                                name="stock"
                                type="number"
                                value={selectedProducto.stock || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />

                            <TextField
                                label="Detalle / Descripción"
                                name="detalle"
                                value={selectedProducto.detalle || ''}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={4}
                                disabled={saving}
                                variant="outlined"
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: selectedProducto?.id ? 'space-between' : 'flex-end', px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    {selectedProducto?.id && (
                        <Button 
                            onClick={handleAnularClick} 
                            color="error" 
                            variant="text" 
                            disabled={saving}
                            startIcon={<DeleteIcon />}
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                            Eliminar
                        </Button>
                    )}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={handleModalClose} disabled={saving} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                            Cancelar
                        </Button>
                        <Button 
                            onClick={handleSave} 
                            variant="contained" 
                            disabled={saving}
                            sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3, boxShadow: 2 }}
                        >
                            {saving ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
                        </Button>
                    </Box>
                </DialogActions>
            </Dialog>

            {/* Modal de confirmación para anular */}
            <Dialog 
                open={confirmAnularOpen} 
                onClose={() => setConfirmAnularOpen(false)}
                PaperProps={{ sx: { borderRadius: 3 } }}
            >
                <DialogTitle sx={{ fontWeight: 'bold', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeleteIcon />
                    Confirmar Eliminación
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mt: 1, color: '#475569' }}>
                        ¿Estás seguro de que deseas eliminar permanentemente el producto <strong>{selectedProducto?.nombre}</strong>? 
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button onClick={() => setConfirmAnularOpen(false)} color="inherit" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Cancelar
                    </Button>
                    <Button onClick={handleConfirmAnular} color="error" variant="contained" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                        {saving ? <CircularProgress size={24} color="inherit" /> : 'Sí, eliminar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
