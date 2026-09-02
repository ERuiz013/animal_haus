import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, IconButton, Tooltip, Chip, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PeopleIcon from '@mui/icons-material/People'; // Icon for Clientes
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../config';


export default function Clientes() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [viewClienteData, setViewClienteData] = useState(null);
    const [loadingView, setLoadingView] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmAnularOpen, setConfirmAnularOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/getClientes.php`)
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar los clientes');
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setClientes(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleRowClick = (cliente) => {
        setSelectedCliente({ ...cliente });
        setModalOpen(true);
    };

    const handleViewClick = (cliente) => {
        setViewModalOpen(true);
        setLoadingView(true);
        setViewClienteData(null);
        fetch(`${API_BASE_URL}/getClienteDetalle.php?id=${cliente.id}`)
            .then(res => res.json())
            .then(data => {
                setLoadingView(false);
                if (!data.error) {
                    setViewClienteData(data);
                } else {
                    setSnackbar({ open: true, message: data.error, severity: 'error' });
                    setViewModalOpen(false);
                }
            })
            .catch(err => {
                setLoadingView(false);
                setSnackbar({ open: true, message: 'Error al cargar detalles', severity: 'error' });
                setViewModalOpen(false);
            });
    };

    const handleAddClick = () => {
        setSelectedCliente({ id: null, nombre: '', apellido: '', email: '', telefono: '' });
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
        setSelectedCliente(null);
        setConfirmAnularOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedCliente(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setSaving(true);
        const isNew = !selectedCliente.id;
        const endpoint = isNew
            ? `${API_BASE_URL}/createCliente.php`
            : `${API_BASE_URL}/updateCliente.php`;

        const payload = {
            nombre: selectedCliente.nombre,
            apellido: selectedCliente.apellido,
            email: selectedCliente.email,
            telefono: selectedCliente.telefono
        };
        if (!isNew) {
            payload.id = selectedCliente.id;
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
                    setSnackbar({ open: true, message: data.message || (isNew ? 'Cliente creado' : 'Cliente actualizado'), severity: 'success' });
                    handleModalClose();
                    fetchClientes(); // Refrescar la lista
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
        fetch(`${API_BASE_URL}/anularCliente.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedCliente.id
            })
        })
            .then(res => res.json())
            .then(data => {
                setSaving(false);
                setConfirmAnularOpen(false);
                if (data.error) {
                    setSnackbar({ open: true, message: data.error, severity: 'error' });
                } else {
                    setSnackbar({ open: true, message: data.message || 'Cliente anulado', severity: 'success' });
                    handleModalClose();
                    fetchClientes(); // Refrescar la lista
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
                            <PeopleIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Gestión de Clientes
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Administra los datos de los usuarios y clientes registrados.
                                </Typography>
                            </Box>
                        </Box>
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
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>ID</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Nombre Completo</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Correo Electrónico</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Teléfono</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clientes.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay clientes registrados.</TableCell>
                                        </TableRow>
                                    ) : (
                                        clientes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((cliente, index) => (
                                            <TableRow
                                                key={cliente.id}
                                                hover
                                                sx={{ transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>{page * rowsPerPage + index + 1}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                    {cliente.nombre} {cliente.apellido}
                                                </TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b' }}>
                                                    {cliente.email}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {cliente.telefono ? (
                                                        <Chip label={cliente.telefono} size="small" sx={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled">No registrado</Typography>
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Ver detalles">
                                                        <IconButton color="primary" onClick={() => handleViewClick(cliente)} sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)', mr: 1 }}>
                                                            <VisibilityIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Editar">
                                                        <IconButton color="primary" onClick={() => handleRowClick(cliente)} sx={{ backgroundColor: 'rgba(25, 118, 210, 0.04)' }}>
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
                                count={clientes.length}
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
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 700, fontSize: '1.1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', p: 2 }}>
                    {selectedCliente?.id ? <EditIcon sx={{ color: '#c4a484' }} /> : <AddIcon sx={{ color: '#c4a484' }} />}
                    {selectedCliente?.id ? 'Editar Cliente' : 'Nuevo Cliente'}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ffffff', p: 4, pt: '32px !important' }}>
                    {selectedCliente && (
                        <Box component="form" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            <TextField size="small"
                                label="Nombre"
                                name="nombre"
                                value={selectedCliente.nombre || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                autoFocus
                            />

                            <TextField size="small"
                                label="Apellido"
                                name="apellido"
                                value={selectedCliente.apellido || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />

                            <TextField size="small"
                                label="Correo Electrónico"
                                name="email"
                                type="email"
                                value={selectedCliente.email || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                            <TextField size="small"
                                label="Teléfono"
                                name="telefono"
                                value={selectedCliente.telefono || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'flex-end', px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button size="small" onClick={handleModalClose} disabled={saving} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                            Cancelar
                        </Button>
                        <Button size="small"
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

            {/* Modal para ver detalles del cliente */}
            <Dialog
                open={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: 24 } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 700, fontSize: '1.1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', p: 2 }}>
                    <VisibilityIcon sx={{ color: '#c4a484' }} />
                    Detalles del Cliente
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ffffff', p: 4 }}>
                    {loadingView ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
                    ) : viewClienteData ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Nombre Completo</Typography>
                                <Typography variant="body1" fontWeight={600} color="#1e293b">{viewClienteData.nombre} {viewClienteData.apellido}</Typography>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Documento / C.I.</Typography>
                                    <Typography variant="body1" color="#1e293b">{viewClienteData.documento || 'No registrado'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Teléfono</Typography>
                                    <Typography variant="body1" color="#1e293b">{viewClienteData.telefono || 'No registrado'}</Typography>
                                </Box>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Correo Electrónico</Typography>
                                <Typography variant="body1" color="#1e293b">{viewClienteData.email}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">Últimas Direcciones de Envío</Typography>
                                <Paper variant="outlined" sx={{ p: 2, mt: 0.5, backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: 2 }}>
                                    {viewClienteData.direcciones && viewClienteData.direcciones.length > 0 ? (
                                        <ul style={{ margin: 0, paddingLeft: '20px', color: '#1e293b' }}>
                                            {viewClienteData.direcciones.map((dir, idx) => (
                                                <li key={idx} style={{ marginBottom: '8px' }}>
                                                    <Typography variant="body2">{dir}</Typography>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <Typography variant="body1" color="text.disabled">
                                            El cliente aún no ha registrado direcciones de envío en sus compras.
                                        </Typography>
                                    )}
                                </Paper>
                            </Box>
                        </Box>
                    ) : (
                        <Alert severity="error">No se pudo cargar la información del cliente.</Alert>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    <Button size="small" onClick={() => setViewModalOpen(false)} variant="contained" sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 3 }}>
                        Cerrar
                    </Button>
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
                        ¿Estás seguro de que deseas eliminar permanentemente al cliente <strong>{selectedCliente?.nombre} {selectedCliente?.apellido}</strong>?
                        Esta acción no se puede deshacer.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button size="small" onClick={() => setConfirmAnularOpen(false)} color="inherit" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Cancelar
                    </Button>
                    <Button size="small" onClick={handleConfirmAnular} color="error" variant="contained" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
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


