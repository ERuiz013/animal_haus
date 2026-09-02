import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, IconButton, Tooltip, Chip, TablePagination, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BlockIcon from '@mui/icons-material/Block';
import { API_BASE_URL } from '../config';


export default function Talonarios() {
    const [talonarios, setTalonarios] = useState([]);
    const [timbrados, setTimbrados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedTalonario, setSelectedTalonario] = useState(null);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [confirmAnularOpen, setConfirmAnularOpen] = useState(false);

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        setLoading(true);
        Promise.all([
            fetch(`${API_BASE_URL}/getTalonarios.php`).then(res => res.json()),
            fetch(`${API_BASE_URL}/getTimbrados.php`).then(res => res.json())
        ])
        .then(([dataTalonarios, dataTimbrados]) => {
            if (dataTalonarios.error) throw new Error(dataTalonarios.error);
            if (dataTimbrados.error) throw new Error(dataTimbrados.error);
            setTalonarios(dataTalonarios);
            // Filtrar solo timbrados activos (estado == 1) para el select
            setTimbrados(dataTimbrados.filter(t => t.estado == 1));
            setLoading(false);
        })
        .catch(err => {
            setError(err.message);
            setLoading(false);
        });
    };

    const handleRowClick = (talonario) => {
        setSelectedTalonario({ ...talonario });
        setModalOpen(true);
    };

    const handleAddClick = () => {
        setSelectedTalonario({ 
            id: null, 
            timbrado_id: '', 
            tipo_comprobante: '', 
            establecimiento: '', 
            punto_expedicion: '', 
            numero_inicial: '', 
            numero_final: '', 
            numero_actual: '' 
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
        setSelectedTalonario(null);
        setConfirmAnularOpen(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedTalonario(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        setSaving(true);
        const isNew = !selectedTalonario.id;
        const endpoint = isNew 
            ? `${API_BASE_URL}/createTalonario.php` 
            : `${API_BASE_URL}/updateTalonario.php`;

        const payload = { ...selectedTalonario };

        fetch(endpoint, {
            method: isNew ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            setSaving(false);
            if (data.error) {
                setSnackbar({ open: true, message: data.error, severity: 'error' });
            } else {
                setSnackbar({ open: true, message: data.message || (isNew ? 'Talonario creado' : 'Talonario actualizado'), severity: 'success' });
                handleModalClose();
                fetchData(); // Refrescar la lista
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
        fetch(`${API_BASE_URL}/anularTalonario.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: selectedTalonario.id
            })
        })
        .then(res => res.json())
        .then(data => {
            setSaving(false);
            setConfirmAnularOpen(false);
            if (data.error) {
                setSnackbar({ open: true, message: data.error, severity: 'error' });
            } else {
                setSnackbar({ open: true, message: data.message || 'Talonario anulado', severity: 'success' });
                handleModalClose();
                fetchData(); // Refrescar la lista
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
                            <ReceiptIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Gestión de Talonarios
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Administra los talonarios de comprobantes.
                                </Typography>
                            </Box>
                        </Box>
                        <Button size="small" 
                            variant="contained" 
                            startIcon={<AddIcon />}
                            onClick={handleAddClick}
                            sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5, boxShadow: 2 }}
                        >
                            Nuevo Talonario
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
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>ID</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Nro. Timbrado</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Tipo Comprobante</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Est.</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>P.Exp.</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Rango</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Estado</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {talonarios.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay talonarios disponibles.</TableCell>
                                        </TableRow>
                                    ) : (
                                        talonarios.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((t, index) => (
                                            <TableRow 
                                                key={t.id || index} 
                                                hover 
                                                sx={{ transition: 'background-color 0.2s', '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>{t.id}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>{t.nro_timbrado}</TableCell>
                                                <TableCell align="left">{t.tipo_comprobante}</TableCell>
                                                <TableCell align="center">{t.establecimiento}</TableCell>
                                                <TableCell align="center">{t.punto_expedicion}</TableCell>
                                                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{t.numero_inicial} - {t.numero_final}</TableCell>
                                                <TableCell align="center">
                                                    {t.estado == 1 ? (
                                                        <Chip label="Activo" size="small" color="success" sx={{ fontWeight: 500 }} />
                                                    ) : (
                                                        <Chip label="Inactivo" size="small" color="default" sx={{ fontWeight: 500 }} />
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Editar talonario">
                                                        <IconButton 
                                                            onClick={(e) => { e.stopPropagation(); handleRowClick(t); }}
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
                                count={talonarios.length}
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
                    {selectedTalonario?.id ? <EditIcon sx={{ color: '#c4a484' }} /> : <AddIcon sx={{ color: '#c4a484' }} />}
                    {selectedTalonario?.id ? 'Editar Talonario' : 'Nuevo Talonario'}
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#ffffff', p: 4, pt: '32px !important' }}>
                    {selectedTalonario && (
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            
                            <FormControl size="small" fullWidth variant="outlined" disabled={saving}>
                                <InputLabel id="timbrado-label">Timbrado Activo</InputLabel>
                                <Select size="small"
                                    labelId="timbrado-label"
                                    name="timbrado_id"
                                    value={selectedTalonario.timbrado_id || ''}
                                    onChange={handleInputChange}
                                    label="Timbrado Activo"
                                >
                                    {timbrados.map(timbrado => (
                                        <MenuItem key={timbrado.id} value={timbrado.id}>
                                            {timbrado.nro_timbrado}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl size="small" fullWidth variant="outlined" disabled={saving}>
                                <InputLabel id="tipo-comprobante-label">Tipo de Comprobante</InputLabel>
                                <Select size="small"
                                    labelId="tipo-comprobante-label"
                                    name="tipo_comprobante"
                                    value={selectedTalonario.tipo_comprobante || ''}
                                    onChange={handleInputChange}
                                    label="Tipo de Comprobante"
                                >
                                    <MenuItem value="Factura">Factura</MenuItem>
                                    <MenuItem value="Ticket">Ticket</MenuItem>
                                    <MenuItem value="Nota de Crédito">Nota de Crédito</MenuItem>
                                    <MenuItem value="Nota de Débito">Nota de Débito</MenuItem>
                                    <MenuItem value="Remisión">Remisión</MenuItem>
                                </Select>
                            </FormControl>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField size="small"
                                    label="Establecimiento"
                                    name="establecimiento"
                                    value={selectedTalonario.establecimiento || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={saving}
                                    variant="outlined"
                                    placeholder="001"
                                    inputProps={{ maxLength: 3 }}
                                />
                                <TextField size="small"
                                    label="Punto de Expedición"
                                    name="punto_expedicion"
                                    value={selectedTalonario.punto_expedicion || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={saving}
                                    variant="outlined"
                                    placeholder="001"
                                    inputProps={{ maxLength: 3 }}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField size="small"
                                    label="Número Inicial"
                                    name="numero_inicial"
                                    value={selectedTalonario.numero_inicial || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={saving}
                                    variant="outlined"
                                    type="number"
                                />
                                <TextField size="small"
                                    label="Número Final"
                                    name="numero_final"
                                    value={selectedTalonario.numero_final || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={saving}
                                    variant="outlined"
                                    type="number"
                                />
                            </Box>

                            {selectedTalonario.id && (
                                <TextField size="small"
                                    label="Número Actual"
                                    name="numero_actual"
                                    value={selectedTalonario.numero_actual || ''}
                                    onChange={handleInputChange}
                                    fullWidth
                                    disabled={saving}
                                    variant="outlined"
                                    type="number"
                                    helperText="Último número utilizado en este talonario."
                                />
                            )}

                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ justifyContent: selectedTalonario?.id ? 'space-between' : 'flex-end', px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    {selectedTalonario?.id && (
                        <Button size="small" 
                            onClick={handleAnularClick} 
                            color="error" 
                            variant="text" 
                            disabled={saving}
                            startIcon={<BlockIcon />}
                            sx={{ fontWeight: 600, textTransform: 'none' }}
                        >
                            Inactivar
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
                    <BlockIcon />
                    Confirmar Inactivación
                </DialogTitle>
                <DialogContent>
                    <Typography sx={{ mt: 1, color: '#475569' }}>
                        ¿Estás seguro de que deseas inactivar este talonario? 
                        Esta acción cambiará su estado a inactivo.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button size="small" onClick={() => setConfirmAnularOpen(false)} color="inherit" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Cancelar
                    </Button>
                    <Button size="small" onClick={handleConfirmAnular} color="error" variant="contained" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                        {saving ? <CircularProgress size={24} color="inherit" /> : 'Sí, inactivar'}
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


