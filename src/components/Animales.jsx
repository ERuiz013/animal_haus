import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, IconButton, Tooltip, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PetsIcon from '@mui/icons-material/Pets';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Animales() {
    const [animales, setAnimales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmAnularOpen, setConfirmAnularOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        fetchAnimales();
    }, []);

    const fetchAnimales = () => {
        setLoading(true);
        fetch('http://localhost/rjs_animal_haus/api/getAnimales.php')
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar los animales');
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setAnimales(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleRowClick = (animal) => {
        setSelectedAnimal({ ...animal });
        setModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedAnimal({ id: null, nombre: '' });
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
        setSelectedAnimal(null);
        setConfirmAnularOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedAnimal(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setSaving(true);
        const isNew = !selectedAnimal.id;
        const endpoint = isNew 
            ? 'http://localhost/rjs_animal_haus/api/createAnimal.php' 
            : 'http://localhost/rjs_animal_haus/api/updateAnimal.php';

        const payload = {
            nombre: selectedAnimal.nombre
        };
        if (!isNew) {
            payload.id = selectedAnimal.id;
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
                setSnackbar({ open: true, message: data.message || (isNew ? 'Animal creado' : 'Animal actualizado'), severity: 'success' });
                handleModalClose();
                fetchAnimales(); // Refrescar la lista
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
        fetch('http://localhost/rjs_animal_haus/api/anularAnimal.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedAnimal.id
            })
        })
        .then(res => res.json())
        .then(data => {
            setSaving(false);
            setConfirmAnularOpen(false);
            if (data.error) {
                setSnackbar({ open: true, message: data.error, severity: 'error' });
            } else {
                setSnackbar({ open: true, message: data.message || 'Animal anulado', severity: 'success' });
                handleModalClose();
                fetchAnimales(); // Refrescar la lista
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
                            <PetsIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Gestión de Animales
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Administra los tipos de animales para tus productos.
                                </Typography>
                            </Box>
                        </Box>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            onClick={handleAddClick}
                            sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5, boxShadow: 2 }}
                        >
                            Nuevo Animal
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
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Animal</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {animales.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay animales disponibles.</TableCell>
                                        </TableRow>
                                    ) : (
                                        animales.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((animal, index) => (
                                            <TableRow 
                                                key={animal.id || index} 
                                                hover 
                                                sx={{ transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>{animal.nombre}</TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Editar animal">
                                                        <IconButton 
                                                            onClick={(e) => { e.stopPropagation(); handleRowClick(animal); }}
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
                                count={animales.length}
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
                    {selectedAnimal?.id ? <EditIcon sx={{ color: '#c4a484' }} /> : <AddIcon sx={{ color: '#c4a484' }} />}
                    {selectedAnimal?.id ? 'Editar Animal' : 'Nuevo Animal'}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ffffff', p: 4, pt: '32px !important' }}>
                    {selectedAnimal && (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <TextField
                                label="Nombre del Animal"
                                name="nombre"
                                value={selectedAnimal.nombre || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                autoFocus
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: selectedAnimal?.id ? 'space-between' : 'flex-end', px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    {selectedAnimal?.id && (
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
                        ¿Estás seguro de que deseas eliminar permanentemente el animal <strong>{selectedAnimal?.nombre}</strong>? 
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
