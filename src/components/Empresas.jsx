import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, IconButton, Tooltip, Chip, TablePagination } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BusinessIcon from '@mui/icons-material/Business'; // Icon for Empresa
import DeleteIcon from '@mui/icons-material/Delete';
import { API_BASE_URL } from '../config';


export default function Empresas() {
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedEmpresa, setSelectedEmpresa] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmAnularOpen, setConfirmAnularOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        fetchEmpresas();
    }, []);

    const fetchEmpresas = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/getEmpresas.php`)
            .then(res => {
                if (!res.ok) throw new Error('Error al cargar las empresas');
                return res.json();
            })
            .then(data => {
                if (data.error) throw new Error(data.error);
                setEmpresas(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleRowClick = (empresa) => {
        setSelectedEmpresa({ ...empresa });
        setModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedEmpresa({ id: null, nombre: '', ruc: '', direcion: '', telefono: '', email: '', horario_abierto_entre_semana: '', horario_cerrado_entre_semana: '', horario_abierto_fin_semana: '', horario_cerrado_fin_semana: '', logo: '', link_facebook: '', link_instagram: '', link_tiktok: '' });
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
        setSelectedEmpresa(null);
        setConfirmAnularOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEmpresa(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedEmpresa(prev => ({
                    ...prev,
                    logo: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        setSaving(true);
        const isNew = !selectedEmpresa.id;
        const endpoint = isNew
            ? `${API_BASE_URL}/createEmpresa.php`
            : `${API_BASE_URL}/updateEmpresa.php`;

        const payload = {
            nombre: selectedEmpresa.nombre,
            ruc: selectedEmpresa.ruc,
            direcion: selectedEmpresa.direcion,
            telefono: selectedEmpresa.telefono,
            email: selectedEmpresa.email,
            horario_abierto_entre_semana: selectedEmpresa.horario_abierto_entre_semana,
            horario_cerrado_entre_semana: selectedEmpresa.horario_cerrado_entre_semana,
            horario_abierto_fin_semana: selectedEmpresa.horario_abierto_fin_semana,
            horario_cerrado_fin_semana: selectedEmpresa.horario_cerrado_fin_semana,
            logo: selectedEmpresa.logo,
            link_facebook: selectedEmpresa.link_facebook,
            link_instagram: selectedEmpresa.link_instagram,
            link_tiktok: selectedEmpresa.link_tiktok
        };
        if (!isNew) {
            payload.id = selectedEmpresa.id;
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
                    setSnackbar({ open: true, message: data.message || (isNew ? 'Empresa creada' : 'Empresa actualizada'), severity: 'success' });
                    handleModalClose();
                    fetchEmpresas(); // Refrescar la lista
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
        fetch(`${API_BASE_URL}/anularEmpresa.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedEmpresa.id
            })
        })
            .then(res => res.json())
            .then(data => {
                setSaving(false);
                setConfirmAnularOpen(false);
                if (data.error) {
                    setSnackbar({ open: true, message: data.error, severity: 'error' });
                } else {
                    setSnackbar({ open: true, message: data.message || 'Empresa eliminada', severity: 'success' });
                    handleModalClose();
                    fetchEmpresas(); // Refrescar la lista
                }
            })
            .catch(err => {
                setSaving(false);
                setConfirmAnularOpen(false);
                setSnackbar({ open: true, message: 'Error al eliminar', severity: 'error' });
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
                            <BusinessIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Gestión de Empresa
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Administra los datos de la empresa registrada.
                                </Typography>
                            </Box>
                        </Box>
                        {empresas.length === 0 && (
                            <Button size="small"
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddClick}
                                sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3 }}
                            >
                                Nueva Empresa
                            </Button>
                        )}
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
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Razón Social</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>RUC / NIT</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Dirección</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Teléfono</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {empresas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay empresas registradas.</TableCell>
                                        </TableRow>
                                    ) : (
                                        empresas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((empresa, index) => (
                                            <TableRow
                                                key={empresa.id}
                                                hover
                                                onClick={() => handleRowClick(empresa)}
                                                sx={{ cursor: 'pointer', transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>{empresa.id}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                    {empresa.nombre}
                                                </TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b' }}>
                                                    {empresa.ruc || 'No registrado'}
                                                </TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b' }}>
                                                    {empresa.direcion || 'No registrada'}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {empresa.telefono ? (
                                                        <Chip label={empresa.telefono} size="small" sx={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
                                                    ) : (
                                                        <Typography variant="body2" color="text.disabled">No registrado</Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 50, 100]}
                                component="div"
                                count={empresas.length}
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
                    {selectedEmpresa?.id ? <EditIcon sx={{ color: '#c4a484' }} /> : <AddIcon sx={{ color: '#c4a484' }} />}
                    {selectedEmpresa?.id ? 'Editar Empresa' : 'Nueva Empresa'}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ffffff', p: 4, pt: '32px !important' }}>
                    {selectedEmpresa && (
                        <Box component="form" sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            <TextField size="small"
                                label="Razón Social / Nombre"
                                name="nombre"
                                value={selectedEmpresa.nombre || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                autoFocus
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                            <TextField size="small"
                                label="RUC / NIT"
                                name="ruc"
                                value={selectedEmpresa.ruc || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                            <TextField size="small"
                                label="Dirección (Enlace o Iframe de Mapa)"
                                name="direcion"
                                value={selectedEmpresa.direcion || ''}
                                onChange={handleInputChange}
                                fullWidth
                                multiline
                                rows={3}
                                disabled={saving}
                                variant="outlined"
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                            <TextField size="small"
                                label="Teléfono"
                                name="telefono"
                                value={selectedEmpresa.telefono || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                            <TextField size="small"
                                label="Email"
                                name="email"
                                type="email"
                                value={selectedEmpresa.email || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                                sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}
                            />

                            <Typography variant="subtitle2" sx={{ gridColumn: { xs: '1fr', sm: 'span 2' }, mt: 1, color: '#475569', fontWeight: 700 }}>Horarios de Atención</Typography>

                            <TextField size="small"
                                label="Apertura (Entre Semana)"
                                name="horario_abierto_entre_semana"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={selectedEmpresa.horario_abierto_entre_semana || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />
                            <TextField size="small"
                                label="Cierre (Entre Semana)"
                                name="horario_cerrado_entre_semana"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={selectedEmpresa.horario_cerrado_entre_semana || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />
                            <TextField size="small"
                                label="Apertura (Fin de Semana)"
                                name="horario_abierto_fin_semana"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={selectedEmpresa.horario_abierto_fin_semana || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />
                            <TextField size="small"
                                label="Cierre (Fin de Semana)"
                                name="horario_cerrado_fin_semana"
                                type="time"
                                InputLabelProps={{ shrink: true }}
                                value={selectedEmpresa.horario_cerrado_fin_semana || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />

                            <Typography variant="subtitle2" sx={{ gridColumn: { xs: '1fr', sm: 'span 2' }, mt: 1, color: '#475569', fontWeight: 700 }}>Redes y Enlaces</Typography>

                            <Box sx={{ gridColumn: { xs: '1fr', sm: 'span 2' } }}>
                                <Button size="small"
                                    variant="outlined"
                                    component="label"
                                    fullWidth
                                    disabled={saving}
                                    sx={{ textTransform: 'none', height: '56px', borderColor: '#c4a484', color: '#c4a484', '&:hover': { borderColor: '#a88a6c', backgroundColor: 'rgba(196, 164, 132, 0.04)' } }}
                                >
                                    {selectedEmpresa.logo ? 'Cambiar Logo' : 'Subir Logo'}
                                    <input
                                        type="file"
                                        name="logo"
                                        hidden
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </Button>
                                {selectedEmpresa.logo && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <img src={selectedEmpresa.logo} alt="Logo preview" style={{ maxHeight: '100px', maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                )}
                            </Box>
                            <TextField size="small"
                                label="Link Facebook"
                                name="link_facebook"
                                value={selectedEmpresa.link_facebook || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />
                            <TextField size="small"
                                label="Link Instagram"
                                name="link_instagram"
                                value={selectedEmpresa.link_instagram || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />
                            <TextField size="small"
                                label="Link TikTok"
                                name="link_tiktok"
                                value={selectedEmpresa.link_tiktok || ''}
                                onChange={handleInputChange}
                                fullWidth
                                disabled={saving}
                                variant="outlined"
                            />

                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: selectedEmpresa?.id ? 'space-between' : 'flex-end', px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    {selectedEmpresa?.id && (
                        <Button size="small"
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
                        ¿Estás seguro de que deseas eliminar permanentemente la empresa <strong>{selectedEmpresa?.nombre}</strong>?
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


