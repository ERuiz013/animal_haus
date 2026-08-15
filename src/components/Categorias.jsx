import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, FormControl, InputLabel, Select, MenuItem, IconButton, Tooltip, Chip, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CategoryIcon from '@mui/icons-material/Category';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmAnularOpen, setConfirmAnularOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        fetchCategorias();
    }, []);

    const fetchCategorias = () => {
        setLoading(true);
        fetch('http://localhost/rjs_animal_haus/api/getCategorias.php')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las categorías');
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setCategorias(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleRowClick = (categoria) => {
        setSelectedCategoria({ ...categoria });
        setModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedCategoria({ id: null, nombre: '', descripcion: '', parent_id: '' });
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
        setSelectedCategoria(null);
        setConfirmAnularOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCategoria(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setSaving(true);
        const isNew = !selectedCategoria.id;
        const endpoint = isNew 
            ? 'http://localhost/rjs_animal_haus/api/createCategoria.php' 
            : 'http://localhost/rjs_animal_haus/api/updateCategoria.php';

        const payload = {
            nombre: selectedCategoria.nombre,
            descripcion: selectedCategoria.descripcion,
            parent_id: selectedCategoria.parent_id
        };
        if (!isNew) {
            payload.id = selectedCategoria.id;
        }

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            setSaving(false);
            if (data.error) {
                setSnackbar({ open: true, message: data.error, severity: 'error' });
            } else {
                setSnackbar({ open: true, message: data.message || (isNew ? 'Categoría creada' : 'Categoría actualizada'), severity: 'success' });
                handleModalClose();
                fetchCategorias(); // Refrescar la lista
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
        fetch('http://localhost/rjs_animal_haus/api/anularCategoria.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedCategoria.id
            })
        })
        .then(res => res.json())
        .then(data => {
            setSaving(false);
            setConfirmAnularOpen(false);
            if (data.error) {
                setSnackbar({ open: true, message: data.error, severity: 'error' });
            } else {
                setSnackbar({ open: true, message: data.message || 'Categoría anulada', severity: 'success' });
                handleModalClose();
                fetchCategorias(); // Refrescar la lista
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

    // Helper to find parent name
    const getParentName = (parentId) => {
        if (!parentId) return 'Ninguna';
        const parent = categorias.find(c => c.id === parentId);
        return parent ? parent.nombre : 'Desconocida';
    };

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
                            <CategoryIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Gestión de Categorías
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Administra las categorías y subcategorías de tus productos.
                                </Typography>
                            </Box>
                        </Box>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            onClick={handleAddClick}
                            sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5, boxShadow: 2 }}
                        >
                            Nueva Categoría
                        </Button>
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
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>ID</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Categoría</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Categoría Padre</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Descripción</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categorias.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay categorías disponibles.</TableCell>
                                        </TableRow>
                                    ) : (
                                        categorias.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cat, index) => (
                                            <TableRow 
                                                key={cat.id || index} 
                                                hover 
                                                sx={{ transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>{cat.nombre}</TableCell>
                                                <TableCell align="left">
                                                    {cat.parent_id ? (
                                                        <Chip 
                                                            label={getParentName(cat.parent_id)} 
                                                            size="small" 
                                                            sx={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 500 }} 
                                                        />
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>Principal</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {cat.descripcion || '-'}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Editar categoría">
                                                        <IconButton 
                                                            onClick={(e) => { e.stopPropagation(); handleRowClick(cat); }}
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
                                count={categorias.length}
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
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: 24 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 800, backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', p: 3 }}>
                    {selectedCategoria?.id ? <EditIcon sx={{ color: '#c4a484' }} /> : <AddIcon sx={{ color: '#c4a484' }} />}
                    {selectedCategoria?.id ? 'Editar Categoría' : 'Nueva Categoría'}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ffffff', p: 4, pt: '32px !important' }}>
                    {selectedCategoria && (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Nombre de la Categoría"
                                name="nombre"
                                value={selectedCategoria.nombre || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                autoFocus
                            />
                            
                            <FormControl fullWidth disabled={saving} variant="outlined">
                                <InputLabel id="parent-category-label">Subcategoría de...</InputLabel>
                                <Select
                                    labelId="parent-category-label"
                                    name="parent_id"
                                    value={selectedCategoria.parent_id || ''}
                                    label="Subcategoría de..."
                                    onChange={handleInputChange}
                                >
                                    <MenuItem value="">
                                        <em>-- Categoría Principal --</em>
                                    </MenuItem>
                                    {categorias
                                        .filter(c => c.id !== selectedCategoria.id) 
                                        .map(c => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.nombre}
                                            </MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                            <TextField
                                label="Descripción (Opcional)"
                                name="descripcion"
                                value={selectedCategoria.descripcion || ''}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={3}
                                disabled={saving}
                                variant="outlined"
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: selectedCategoria?.id ? 'space-between' : 'flex-end', px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    {selectedCategoria?.id && (
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
                        ¿Estás seguro de que deseas eliminar permanentemente la categoría <strong>{selectedCategoria?.nombre}</strong>? 
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
