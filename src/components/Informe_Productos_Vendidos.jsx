import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert, Button, Chip, TextField, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions, TablePagination } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SearchIcon from '@mui/icons-material/Search';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { API_BASE_URL } from '../config';


export default function InformeProductosVendidos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [unidades, setUnidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfDoc, setPdfDoc] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, uniRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/getInformeProductosVendidos.php`),
                    fetch(`${API_BASE_URL}/getCategorias.php`),
                    fetch(`${API_BASE_URL}/getUnidadesMedidas.php`)
                ]);

                if (!prodRes.ok || !catRes.ok || !uniRes.ok) {
                    throw new Error('Error al cargar datos');
                }

                const prodData = await prodRes.json();
                const catData = await catRes.json();
                const uniData = await uniRes.json();

                if(prodData.error) throw new Error(prodData.error);

                setProductos(prodData);
                setCategorias(catData);
                setUnidades(uniData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getCategoriaName = (id) => categorias.find(c => String(c.id) === String(id))?.nombre || 'Desconocida';
    const getUnidadName = (id) => unidades.find(u => String(u.id) === String(id))?.simbolo || '';

    const filteredProductos = productos.filter(p => 
        (p.nombre && p.nombre.toLowerCase().includes(searchTerm.toLowerCase())) || 
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const paginatedProductos = filteredProductos.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const generarPDF = () => {
        const doc = new jsPDF();
        
        const now = new Date();
        const dateFile = `${String(now.getDate()).padStart(2, '0')}_${String(now.getMonth() + 1).padStart(2, '0')}_${now.getFullYear()}`;
        const fileName = `Informe_Productos_Vendidos_AnimalHaus_${dateFile}`;
        
        doc.setProperties({
            title: fileName
        });
        
        doc.setFontSize(18);
        doc.text('Informe de Productos Vendidos', 14, 22);

        const tableColumn = ["SKU", "Producto", "Categoría", "Cant. Vendida", "Total Recaudado (Gs)"];
        const tableRows = [];

        filteredProductos.forEach(prod => {
            const prodData = [
                prod.sku,
                `${prod.nombre} ${getUnidadName(prod.uni_med_id)}`,
                getCategoriaName(prod.categoria_id),
                prod.cantidad_vendida,
                Number(prod.total_recaudado).toLocaleString('es-PY')
            ];
            tableRows.push(prodData);
        });

        const totalPagesExp = '{total_pages_count_string}';
        const dateStr = now.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [196, 164, 132] },
            styles: { fontSize: 10 },
            margin: { bottom: 20 },
            didDrawPage: function (data) {
                doc.setFontSize(10);
                doc.setTextColor(100);
                
                const pageSize = doc.internal.pageSize;
                const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                
                doc.text(`Generado el ${dateStr} a las ${timeStr}`, data.settings.margin.left, pageHeight - 10);
                
                let str = 'Página ' + doc.internal.getNumberOfPages();
                if (typeof doc.putTotalPages === 'function') {
                    str = str + ' de ' + totalPagesExp;
                }
                doc.text(str, pageWidth - data.settings.margin.right, pageHeight - 10, { align: 'right' });
            }
        });

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }

        const blobUrl = doc.output('bloburl');
        setPdfBlobUrl(blobUrl);
        setPdfDoc(doc);
        setPdfModalOpen(true);
    };

    return (
        <Box sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', minHeight: '100vh', py: 5 }}>
            <Container maxWidth="lg">
                <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: '#ffffff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PointOfSaleIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Informe de Productos Vendidos
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Historial y estadísticas de ventas de productos.
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button 
                                variant="contained" 
                                startIcon={<PictureAsPdfIcon />} 
                                onClick={generarPDF}
                                sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', textTransform: 'none', fontWeight: 600, borderRadius: 2, boxShadow: 2 }}
                            >
                                Generar PDF
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <TextField
                            size="small"
                            placeholder="Buscar por nombre o SKU..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                )
                            }}
                            sx={{ width: { xs: '100%', sm: 300 } }}
                        />
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}><CircularProgress /></Box>
                    ) : error ? (
                        <Alert severity="error">{error}</Alert>
                    ) : (
                        <Box>
                            <TableContainer sx={{ border: '1px solid #edf2f7', borderRadius: 3, overflowX: 'auto' }}>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>SKU</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Producto</TableCell>
                                            <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Categoría</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Cant. Vendida</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Total Recaudado (Gs)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {paginatedProductos.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No se encontraron productos vendidos.</TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedProductos.map((prod) => (
                                                <TableRow key={prod.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell sx={{ color: 'text.secondary' }}>
                                                        <Chip label={prod.sku} size="small" sx={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }} />
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                        {prod.nombre} <span style={{ color: '#94a3b8', fontSize: '0.85em', marginLeft: 4 }}>{getUnidadName(prod.uni_med_id)}</span>
                                                    </TableCell>
                                                    <TableCell sx={{ color: '#64748b' }}>{getCategoriaName(prod.categoria_id)}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip 
                                                            label={prod.cantidad_vendida} 
                                                            color="primary"
                                                            size="small" 
                                                            sx={{ fontWeight: 'bold', minWidth: 60 }} 
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right" sx={{ color: '#64748b', fontWeight: 'bold' }}>
                                                        {Number(prod.total_recaudado).toLocaleString('es-PY')}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[10, 20, 50, 100]}
                                component="div"
                                count={filteredProductos.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                labelRowsPerPage="Filas por página:"
                                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`}
                            />
                        </Box>
                    )}
                </Paper>
            </Container>

            {/* Modal para previsualizar PDF */}
            <Dialog 
                open={pdfModalOpen} 
                onClose={() => setPdfModalOpen(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle sx={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', p: 2, m: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>Informe de Productos Vendidos</Typography>
                </DialogTitle>
                <DialogContent sx={{ p: 0, height: '80vh', backgroundColor: '#525659' }}>
                    {pdfBlobUrl && (
                        <iframe 
                            src={`${pdfBlobUrl}#toolbar=0`} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 'none' }}
                            title="PDF Preview"
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc' }}>
                    <Button
                        variant="contained"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => {
                            if (pdfDoc) {
                                const now = new Date();
                                const dateFile = `${String(now.getDate()).padStart(2, '0')}_${String(now.getMonth() + 1).padStart(2, '0')}_${now.getFullYear()}`;
                                pdfDoc.save(`Informe_Productos_Vendidos_AnimalHaus_${dateFile}.pdf`);
                            }
                        }}
                        sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#fff', textTransform: 'none', fontWeight: 600 }}
                    >
                        Descargar PDF
                    </Button>
                    <Button 
                        onClick={() => setPdfModalOpen(false)}
                        sx={{ color: '#64748b', textTransform: 'none', fontWeight: 600 }}
                    >
                        Cerrar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
