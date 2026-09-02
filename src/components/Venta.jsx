import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, Container, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, CircularProgress, Alert, Button, IconButton, Tooltip,
    Chip, TablePagination, Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, FormControl, InputLabel, Select, MenuItem, TextField, Autocomplete,
    Snackbar, Divider, FormControlLabel, Switch
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { API_BASE_URL } from '../config';


const opcionesDelivery = [
    { label: 'Asunción', costo: 25000 },
    { label: 'San Lorenzo', costo: 20000 },
    { label: 'Luque', costo: 20000 },
    { label: 'Capiatá', costo: 20000 },
    { label: 'Lambaré', costo: 25000 },
    { label: 'Mariano Roque Alonso', costo: 30000 },
    { label: 'Fernando de la Mora', costo: 25000 },
    { label: 'Ñemby', costo: 25000 },
    { label: 'Limpio', costo: 40000 },
    { label: 'Villa Elisa', costo: 25000 },
    { label: 'Itauguá', costo: 20000 },
    { label: 'Areguá', costo: 25000 },
    { label: 'J. Augusto Saldívar', costo: 25000 },
    { label: 'Guarambaré', costo: 30000 },
    { label: 'Villeta', costo: 40000 },
    { label: 'Itá', costo: 30000 },
    { label: 'Ypané', costo: 25000 },
    { label: 'San Antonio', costo: 25000 },
    { label: 'Ypacarai', costo: 45000 },
];

export default function Venta() {
    // Listado de ventas
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);

    // Data para Nueva Venta
    const [clientes, setClientes] = useState([]);
    const [talonarios, setTalonarios] = useState([]);
    const [productos, setProductos] = useState([]);

    // Estado del modal de nueva venta
    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [empresaInfo, setEmpresaInfo] = useState(null);

    // Estado del modal de PDF
    const [pdfModalOpen, setPdfModalOpen] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
    const [pdfModalVenta, setPdfModalVenta] = useState(null);
    const [confirmDeliveryModalOpen, setConfirmDeliveryModalOpen] = useState(false);
    const [anularModalOpen, setAnularModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Cabecera de venta
    const [ventaHead, setVentaHead] = useState({
        cliente_id: '',
        talonario_id: '',
        condicion_venta: 1, // 1 contado, 2 credito
        metodo_cobro: 'efectivo',
        direccion_envio: '',
        costo_envio: 0
    });
    const [esDelivery, setEsDelivery] = useState(false);

    // Detalle de productos (Carrito)
    const [cart, setCart] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cantidadSelect, setCantidadSelect] = useState(1);
    const [searchInputValue, setSearchInputValue] = useState('');
    const [loadingProductos, setLoadingProductos] = useState(false);

    // Búsqueda dinámica de clientes
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchClientValue, setSearchClientValue] = useState('');
    const [loadingClientes, setLoadingClientes] = useState(false);

    // Modal Nuevo Cliente
    const [modalClienteOpen, setModalClienteOpen] = useState(false);
    const [savingCliente, setSavingCliente] = useState(false);
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        documento: ''
    });

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchVentas();
        fetchDataForVenta();
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
                    const conStock = Array.isArray(data) ? data.filter(p => p.stock > 0) : [];
                    setProductos(conStock);
                    setLoadingProductos(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingProductos(false);
                });
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchInputValue]);

    // Búsqueda dinámica de clientes
    useEffect(() => {
        const inputVal = searchClientValue || '';
        if (inputVal.length < 3) {
            setClientes([]);
            return;
        }

        const timer = setTimeout(() => {
            setLoadingClientes(true);
            fetch(`${API_BASE_URL}/getClientes.php?q=${encodeURIComponent(inputVal)}`)
                .then(res => res.json())
                .then(data => {
                    setClientes(Array.isArray(data) ? data : []);
                    setLoadingClientes(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingClientes(false);
                });
        }, 500);

        return () => clearTimeout(timer);
    }, [searchClientValue]);

    const fetchVentas = () => {
        setLoading(true);
        fetch(`${API_BASE_URL}/getVentas.php`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setVentas(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const fetchDataForVenta = () => {
        // Talonarios (asumiendo que getTalonarios trae solo activos o filtramos)
        fetch(`${API_BASE_URL}/getTalonarios.php`)
            .then(res => res.json())
            .then(data => {
                const activos = Array.isArray(data) ? data.filter(t => t.estado == 1) : [];
                setTalonarios(activos);
                // Si hay un talonario activo por defecto, seleccionarlo
                if (activos.length > 0) {
                    setVentaHead(prev => ({ ...prev, talonario_id: activos[0].id }));
                }
            })
            .catch(err => console.error(err));

        // Empresa info
        fetch(`${API_BASE_URL}/getEmpresa.php`)
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setEmpresaInfo(data);
                }
            })
            .catch(err => console.error(err));
    };

    // Helper para formatear moneda
    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined || isNaN(amount)) return '0';
        return Math.round(amount).toLocaleString('es-PY');
    };

    // Cálculos de Totales usando useMemo
    const totals = useMemo(() => {
        let total_exenta = 0;
        let gravada_5 = 0;
        let gravada_10 = 0;
        let gravada_30 = 0;
        let total_iva_5 = 0;
        let total_iva_10 = 0;
        let total_iva_30 = 0;
        let liquidacion_iva = 0;
        let subtotal_productos = 0;

        cart.forEach(item => {
            const st = item.precio * item.cantidad;
            subtotal_productos += st;

            if (item.impuesto_id == 2) {
                gravada_5 += st;
                const iva = Number((st / 21).toFixed(2));
                total_iva_5 += iva;
                liquidacion_iva += iva;
            } else if (item.impuesto_id == 3) {
                gravada_10 += st;
                const iva = Number((st / 11).toFixed(2));
                total_iva_10 += iva;
                liquidacion_iva += iva;
            } else if (item.impuesto_id == 4) {
                gravada_30 += st;
                const iva = Number((st * 3 / 13).toFixed(2));
                total_iva_30 += iva;
                liquidacion_iva += iva;
            } else {
                total_exenta += st;
            }
        });

        const costoEnvio = Number(ventaHead.costo_envio || 0);
        if (costoEnvio > 0) {
            gravada_10 += costoEnvio;
            const ivaEnvio = Number((costoEnvio / 11).toFixed(2));
            total_iva_10 += ivaEnvio;
            liquidacion_iva += ivaEnvio;
        }

        const total_general = subtotal_productos + costoEnvio;

        return {
            total_exenta,
            gravada_5,
            gravada_10,
            gravada_30,
            total_iva_5: Number(total_iva_5.toFixed(2)),
            total_iva_10: Number(total_iva_10.toFixed(2)),
            total_iva_30: Number(total_iva_30.toFixed(2)),
            liquidacion_iva: Number(liquidacion_iva.toFixed(2)),
            total_general
        };
    }, [cart, ventaHead.costo_envio]);

    const handleAddProduct = () => {
        if (!selectedProduct) return;
        if (cantidadSelect < 1) {
            setSnackbar({ open: true, message: 'La cantidad debe ser mayor a 0', severity: 'error' });
            return;
        }
        if (cantidadSelect > selectedProduct.stock) {
            setSnackbar({ open: true, message: `Stock insuficiente. Disponible: ${selectedProduct.stock}`, severity: 'warning' });
            return;
        }

        // Check if already in cart
        const existingIndex = cart.findIndex(c => c.id === selectedProduct.id);
        if (existingIndex >= 0) {
            const newCart = [...cart];
            const newQty = newCart[existingIndex].cantidad + Number(cantidadSelect);
            if (newQty > selectedProduct.stock) {
                setSnackbar({ open: true, message: `Stock insuficiente. Disponible: ${selectedProduct.stock}`, severity: 'warning' });
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
        setSelectedClient(null);
        setSearchClientValue('');
        setClientes([]);
        setVentaHead({
            cliente_id: '',
            talonario_id: talonarios.length > 0 ? talonarios[0].id : '',
            condicion_venta: 1,
            metodo_cobro: 'efectivo',
            direccion_envio: '',
            costo_envio: 0
        });
    };

    const generateTicketPDF = (ventaId, talonarioInfo, clienteInfo, totales, condicionVenta, cartItems, exactFacturaStr = null, isPreview = false, fechaVenta = null, costoEnvio = 0, estadoVenta = null) => {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: [80, 200]
        });

        let startY = 5;
        if (empresaInfo && empresaInfo.logoBase64) {
            try {
                const match = empresaInfo.logoBase64.match(/^data:image\/(png|jpeg|jpg|webp);base64,/i);
                let format = 'PNG';
                if (match && match[1]) {
                    format = match[1].toUpperCase();
                    if (format === 'JPG') format = 'JPEG';
                }
                doc.addImage(empresaInfo.logoBase64, format, 25, startY, 30, 20);
                startY += 24;
            } catch (e) {
                console.error("Error al agregar logo al PDF", e);
                startY = 10;
            }
        } else {
            startY = 10;
        }

        // 1. Cabecera del negocio
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        const nombreEmpresa = empresaInfo ? empresaInfo.nombre : "ANIMAL HAUS";
        const rucEmpresa = empresaInfo && empresaInfo.ruc ? empresaInfo.ruc : '80012345-6';
        doc.text(`${nombreEmpresa} - Ruc ${rucEmpresa}`, 40, startY, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.text(`${empresaInfo && empresaInfo.direcion ? empresaInfo.direcion : 'Av. Principal 123'}`, 40, startY + 4, { align: "center" });
        doc.text(`Tel. ${empresaInfo && empresaInfo.telefono ? empresaInfo.telefono : '0981 123 456'}`, 40, startY + 8, { align: "center" });

        // Separador
        doc.setLineWidth(0.5);
        let y = startY + 12;
        doc.line(5, y, 75, y);
        y += 4;

        // 2. Datos de la factura
        doc.setFont("helvetica", "normal");

        const formatToDDMMYYYY = (dateStr) => {
            if (!dateStr) return 'N/A';
            if (dateStr.includes('-')) {
                const parts = dateStr.split(' ')[0].split('-');
                if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
            return dateStr;
        };

        if (talonarioInfo) {
            const tipoComprobanteStr = (talonarioInfo.tipo_comprobante || "FACTURA").toUpperCase();
            if (tipoComprobanteStr !== "TICKET") {
                doc.text(`Timbrado Nro: ${talonarioInfo.nro_timbrado || 'N/A'}`, 5, y);
                doc.text(`Inicio Vig.: ${formatToDDMMYYYY(talonarioInfo.fecha_inicio)}`, 75, y, { align: "right" });
                y += 4;
            }
            doc.text(tipoComprobanteStr, 40, y, { align: "center" });
            y += 4;
        }

        if (exactFacturaStr && exactFacturaStr.includes('-')) {
            doc.text(`N° ${exactFacturaStr.replace(/-/g, ' ')}`, 40, y, { align: "center" });
            y += 4;
        } else if (talonarioInfo) {
            const numToPad = exactFacturaStr || talonarioInfo.numero_actual;
            const facturaNum = `${String(talonarioInfo.establecimiento).padStart(3, '0')} ${String(talonarioInfo.punto_expedicion).padStart(3, '0')} ${String(numToPad).padStart(7, '0')}`;
            doc.text(`N° ${facturaNum}`, 40, y, { align: "center" });
            y += 4;
        }

        const dateOptions = { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateToShow = fechaVenta
            ? new Date(fechaVenta).toLocaleString('es-PY', dateOptions)
            : new Date().toLocaleString('es-PY', dateOptions);
        doc.text(`Fecha de Emisión: ${dateToShow}`, 40, y, { align: "center" });
        y += 4;

        const condicionTexto = condicionVenta == 1 ? "Contado" : "Crédito";
        doc.text(`Condición Venta: ${condicionTexto}`, 5, y);
        y += 4;

        doc.text(`Razón Social: ${clienteInfo ? clienteInfo.nombre + ' ' + clienteInfo.apellido : 'Consumidor Final'}`, 5, y);
        y += 4;

        if (clienteInfo) {
            doc.text(`RUC/CI: ${clienteInfo.documento || 'S/N'}`, 5, y);
            y += 4;
        }

        // Separador antes de los items
        y -= 2;
        doc.line(5, y, 75, y);
        y += 4;

        // 3. Detalles de productos
        doc.text("Cant.", 5, y);
        doc.text("Desc.", 15, y);
        doc.text("P. Unit.", 55, y, { align: "right" });
        doc.text("Subtotal", 75, y, { align: "right" });
        y += 4;
        y -= 2;
        doc.line(5, y, 75, y);
        y += 4;

        doc.setFont("helvetica", "normal");
        cartItems.forEach(item => {
            const prodName = item.nombre || 'Producto';
            const splitName = doc.splitTextToSize(prodName, 28);

            doc.text(`${item.cantidad}`, 5, y);
            doc.text(splitName, 15, y);
            doc.text(`${formatCurrency(item.precio)}`, 55, y, { align: "right" });
            doc.text(`${formatCurrency(item.cantidad * item.precio)}`, 75, y, { align: "right" });

            y += (splitName.length * 4);
        });

        y -= 2;
        doc.line(5, y, 75, y);
        y += 4;

        // 4. Subtotales y Totales
        const exentas = totales.total_exenta || 0;
        const gravada5 = totales.gravada_5 || 0;
        const gravada10 = totales.gravada_10 || 0;
        const iva5 = totales.total_iva_5 || 0;
        const iva10 = totales.total_iva_10 || 0;
        const liqIva = totales.liquidacion_iva || 0;

        doc.setFont("helvetica", "normal");

        doc.text("Subtotal Grav. 5%:", 5, y);
        doc.text(`${formatCurrency(gravada5)}`, 75, y, { align: "right" });
        y += 4;

        doc.text("Subtotal Grav. 10%:", 5, y);
        doc.text(`${formatCurrency(gravada10)}`, 75, y, { align: "right" });
        y += 4;

        if (exentas > 0) {
            doc.text("Subtotal Exentas:", 5, y);
            doc.text(`${formatCurrency(exentas)}`, 75, y, { align: "right" });
            y += 4;
        }

        if (Number(costoEnvio) > 0) {
            doc.text("Costo de Envío:", 5, y);
            doc.text(`${formatCurrency(Number(costoEnvio))}`, 75, y, { align: "right" });
            y += 4;
        }

        y -= 2;
        doc.line(5, y, 75, y);
        y += 4;

        doc.text("TOTAL A PAGAR:", 5, y);
        doc.text(`${formatCurrency(totales.total_general)}`, 75, y, { align: "right" });
        y += 4;

        y -= 2;
        doc.line(5, y, 75, y);
        y += 4;

        // 5. Liquidación de IVA
        doc.setFontSize(7);
        doc.text("LIQUIDACIÓN DE IVA", 40, y, { align: "center" });
        y += 4;
        doc.setFontSize(8);

        doc.text(`(5%) ${formatCurrency(iva5)}`, 5, y);
        doc.text(`(10%) ${formatCurrency(iva10)}`, 40, y, { align: "center" });
        doc.text(`(Total) ${formatCurrency(liqIva)}`, 75, y, { align: "right" });

        y += 8;
        doc.setFontSize(6);
        const isTicket = talonarioInfo && (talonarioInfo.tipo_comprobante || "").toUpperCase() === "TICKET";
        const footerText = isTicket
            ? "Este documento no tiene valor fiscal"
            : "El documento electrónico (KuDE) ha sido enviado a su correo.";
        const splitFooter = doc.splitTextToSize(footerText, 70);
        doc.text(splitFooter, 40, y, { align: "center" });

        y += (splitFooter.length * 3) + 4;
        const thanksText = "¡Gracias por elegirnos! Nos encanta ser parte del cuidado y bienestar de tu animal.";
        const splitThanks = doc.splitTextToSize(thanksText, 70);
        doc.text(splitThanks, 40, y, { align: "center" });

        if (estadoVenta === 'anulado') {
            try {
                doc.saveGraphicsState();
                doc.setGState(new doc.GState({ opacity: 0.4 }));
            } catch (e) { }
            doc.setTextColor(220, 38, 38);
            doc.setFontSize(45);
            doc.text("ANULADO", 55, (y / 2) + 35, { align: "center", angle: 45 });
            try {
                doc.restoreGraphicsState();
            } catch (e) { }
        }

        if (!isPreview) {
            doc.autoPrint({ variant: 'non-conform' });
        }

        const blobUrl = doc.output('bloburl');

        if (isPreview) {
            setPdfBlobUrl(blobUrl);
            setPdfModalOpen(true);
        } else {
            window.open(blobUrl, '_blank');
        }
    };

    const handleGuardarVenta = () => {
        if (!ventaHead.cliente_id) {
            setSnackbar({ open: true, message: 'Debe seleccionar un cliente.', severity: 'warning' });
            return;
        }
        if (!ventaHead.talonario_id) {
            setSnackbar({ open: true, message: 'Debe seleccionar un talonario activo.', severity: 'warning' });
            return;
        }
        if (cart.length === 0) {
            setSnackbar({ open: true, message: 'Debe agregar al menos un producto a la venta.', severity: 'warning' });
            return;
        }

        setSaving(true);

        const talonarioInfoPayload = talonarios.find(t => t.id == ventaHead.talonario_id);
        const facturaNumStr = talonarioInfoPayload ? `${String(talonarioInfoPayload.establecimiento).padStart(3, '0')}-${String(talonarioInfoPayload.punto_expedicion).padStart(3, '0')}-${String(talonarioInfoPayload.numero_actual).padStart(7, '0')}` : null;

        const payload = {
            ...ventaHead,
            nro_factura: facturaNumStr,
            total_exenta: totals.total_exenta,
            gravada_5: totals.gravada_5,
            gravada_10: totals.gravada_10,
            gravada_30: totals.gravada_30,
            total_iva_5: totals.total_iva_5,
            total_iva_10: totals.total_iva_10,
            total_iva_30: totals.total_iva_30,
            liquidacion_iva: totals.liquidacion_iva,
            total: totals.total_general,
            detalles: cart.map(item => {
                const sub = item.cantidad * item.precio;
                let monto_imp = 0;
                let porc_imp = 0;
                if (item.impuesto_id == 2) { porc_imp = 5; monto_imp = Number((sub / 21).toFixed(2)); }
                else if (item.impuesto_id == 3) { porc_imp = 10; monto_imp = Number((sub / 11).toFixed(2)); }
                else if (item.impuesto_id == 4) { porc_imp = 30; monto_imp = Number((sub * 3 / 13).toFixed(2)); }

                return {
                    producto_id: item.id,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio,
                    porcentaje_impuesto: porc_imp,
                    monto_impuesto: monto_imp,
                    subtotal: sub
                };
            })
        };

        fetch(`${API_BASE_URL}/createVenta.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                setSaving(false);
                if (data.error) throw new Error(data.error);

                setSnackbar({ open: true, message: 'Venta registrada con éxito.', severity: 'success' });

                // Generate PDF Ticket
                setPdfModalVenta({ id: data.venta_id, estado: 'pendiente_entrega' });
                generateTicketPDF(data.venta_id, talonarioInfoPayload, selectedClient, totals, ventaHead.condicion_venta, cart, data.nro_factura || facturaNumStr, false, null, ventaHead.costo_envio, 'pendiente_entrega');

                setModalOpen(false);
                setCart([]);
                setSelectedClient(null);
                setSearchClientValue('');
                setClientes([]);
                setVentaHead(prev => ({ ...prev, cliente_id: '' }));
                fetchVentas();
                fetchDataForVenta(); // Refresh stock
            })
            .catch(err => {
                setSaving(false);
                setSnackbar({ open: true, message: err.message || 'Error al registrar venta.', severity: 'error' });
            });
    };

    const handleCrearCliente = () => {
        if (!nuevoCliente.nombre || !nuevoCliente.apellido || !nuevoCliente.email) {
            setSnackbar({ open: true, message: 'Nombre, apellido y email son obligatorios', severity: 'warning' });
            return;
        }

        setSavingCliente(true);
        fetch(`${API_BASE_URL}/createCliente.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente)
        })
            .then(res => res.json())
            .then(data => {
                setSavingCliente(false);
                if (data.error) throw new Error(data.error);

                // Agregar a la lista y seleccionar
                const clienteCreado = data.cliente;
                setClientes(prev => [...prev, clienteCreado]);
                setSelectedClient(clienteCreado);
                setVentaHead(prev => ({ ...prev, cliente_id: clienteCreado.id }));

                setSnackbar({ open: true, message: 'Cliente creado con éxito', severity: 'success' });
                setModalClienteOpen(false);
                setNuevoCliente({ nombre: '', apellido: '', email: '', telefono: '' });
            })
            .catch(err => {
                setSavingCliente(false);
                setSnackbar({ open: true, message: err.message || 'Error al crear cliente', severity: 'error' });
            });
    };

    const handleVerDetalle = (venta) => {
        fetch(`${API_BASE_URL}/getVentaDetalle.php?id=${venta.id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);

                const talonarioInfo = {
                    nro_timbrado: data.nro_timbrado,
                    fecha_inicio: data.talonario_fecha_inicio,
                    establecimiento: data.establecimiento,
                    punto_expedicion: data.punto_expedicion,
                    numero_actual: data.numero_actual,
                    tipo_comprobante: data.tipo_comprobante
                };

                const clienteInfo = data.cliente_id ? {
                    nombre: data.cliente_nombre,
                    apellido: data.cliente_apellido,
                    documento: data.cliente_documento
                } : null;

                const pastCart = data.detalles.map(d => ({
                    nombre: d.producto_nombre,
                    cantidad: Number(d.cantidad),
                    precio: Number(d.precio_unitario)
                }));

                const pastTotales = {
                    total_exenta: Number(data.total_exenta || 0),
                    gravada_5: Number(data.gravada_5 || 0),
                    gravada_10: Number(data.gravada_10 || 0),
                    gravada_30: Number(data.gravada_30 || 0),
                    total_iva_5: Number(data.total_iva_5 || 0),
                    total_iva_10: Number(data.total_iva_10 || 0),
                    total_iva_30: Number(data.total_iva_30 || 0),
                    liquidacion_iva: Number(data.liquidacion_iva || 0),
                    total_general: Number(data.total)
                };

                setPdfModalVenta({ id: data.id, estado: data.estado });
                generateTicketPDF(
                    data.id,
                    talonarioInfo,
                    clienteInfo,
                    pastTotales,
                    data.condicion_venta,
                    pastCart,
                    data.nro_factura,
                    true, // isPreview
                    data.fecha, // fechaVenta
                    data.costo_envio, // costoEnvio
                    data.estado // estadoVenta
                );
            })
            .catch(err => {
                setSnackbar({ open: true, message: err.message || 'Error al obtener detalles.', severity: 'error' });
            });
    };

    const handleMarcarEntregado = () => {
        if (!pdfModalVenta) return;
        fetch(`${API_BASE_URL}/updateEstadoVenta.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: pdfModalVenta.id, estado: 'entregado' })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setSnackbar({ open: true, message: 'Venta marcada como entregada.', severity: 'success' });
                setConfirmDeliveryModalOpen(false);
                setPdfModalVenta({ ...pdfModalVenta, estado: 'entregado' });
                fetchVentas();
            })
            .catch(err => {
                setSnackbar({ open: true, message: err.message || 'Error al actualizar estado.', severity: 'error' });
            });
    };

    const handleAnularVenta = () => {
        if (!pdfModalVenta) return;
        fetch(`${API_BASE_URL}/anularVenta.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: pdfModalVenta.id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setSnackbar({ open: true, message: 'Venta anulada con éxito.', severity: 'success' });
                setAnularModalOpen(false);
                setPdfModalVenta({ ...pdfModalVenta, estado: 'anulado' });
                fetchVentas();
            })
            .catch(err => {
                setSnackbar({ open: true, message: err.message || 'Error al anular venta.', severity: 'error' });
            });
    };

    return (
        <Box sx={{ flexGrow: 1, background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)', minHeight: '100vh', py: 5 }}>
            <Container maxWidth="lg">
                <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, backgroundColor: '#ffffff' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <PointOfSaleIcon sx={{ fontSize: 40, color: '#c4a484' }} />
                            <Box>
                                <Typography variant="h4" fontWeight="800" sx={{ color: '#1a2027', m: 0, letterSpacing: '-0.5px' }}>
                                    Historial de Ventas
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Visualiza el registro de todas las ventas realizadas.
                                </Typography>
                            </Box>
                        </Box>
                        <Button size="small"
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setModalOpen(true)}
                            sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, py: 1.5, boxShadow: 2 }}
                        >
                            Nueva Venta
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
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Nro. Venta</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Fecha</TableCell>
                                        <TableCell align="left" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Cliente</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Método de Cobro</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Total</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Estado</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', py: 2 }}>Acciones</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {ventas.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No hay ventas registradas.</TableCell>
                                        </TableRow>
                                    ) : (
                                        ventas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((v, index) => (
                                            <TableRow key={v.id || index} hover>
                                                <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>#{v.id}</TableCell>
                                                <TableCell align="left" sx={{ color: '#64748b' }}>{new Date(v.fecha).toLocaleString('es-PY', { hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}</TableCell>
                                                <TableCell align="left" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                                    {v.cliente_nombre ? `${v.cliente_nombre} ${v.cliente_apellido || ''}` : 'Consumidor Final'}
                                                </TableCell>
                                                <TableCell align="center" sx={{ textTransform: 'capitalize', color: '#475569' }}>
                                                    {v.metodo_cobro}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: '#0f172a' }}>
                                                    {formatCurrency(v.total)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {v.estado === 'confirmado' ? (
                                                        <Chip label="Confirmado" size="small" color="success" sx={{ fontWeight: 500 }} />
                                                    ) : v.estado === 'pendiente_entrega' ? (
                                                        <Chip label="Pendiente de Entrega" size="small" sx={{ fontWeight: 600, backgroundColor: '#fdfbf9', color: '#c4a484', border: '1px solid #e7d8c9' }} />
                                                    ) : v.estado === 'anulado' ? (
                                                        <Chip label="Anulado" size="small" color="error" sx={{ fontWeight: 500 }} />
                                                    ) : (
                                                        <Chip label={(v.estado || '').replace(/_/g, ' ')} size="small" color="default" sx={{ textTransform: 'capitalize', fontWeight: 500 }} />
                                                    )}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Ver Detalle">
                                                        <IconButton onClick={() => handleVerDetalle(v)} sx={{ color: '#3b82f6', backgroundColor: '#eff6ff', '&:hover': { backgroundColor: '#dbeafe' } }}>
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
                                count={ventas.length}
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

            {/* Modal Nueva Venta */}
            <Dialog
                open={modalOpen}
                onClose={() => !saving && handleCloseModal()}
                fullWidth
                maxWidth="lg"
                PaperProps={{ sx: { borderRadius: 3, boxShadow: 24, minHeight: '80vh' } }}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b', fontWeight: 700, fontSize: '1.1rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #edf2f7', p: 2 }}>
                    <ShoppingCartIcon sx={{ color: '#c4a484' }} />
                    Registrar Nueva Venta
                </DialogTitle>
                <DialogContent sx={{ p: 0 }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, minHeight: '100%' }}>
                        {/* Columna Izquierda: Datos del cliente y cabecera */}
                        <Box sx={{ width: { xs: '100%', md: '35%' }, flexShrink: 0, p: 4, backgroundColor: '#fafafa', borderRight: { md: '1px solid #edf2f7' } }}>
                            <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#334155' }}>Datos de Facturación</Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Autocomplete size="small"
                                        fullWidth
                                        options={clientes || []}
                                        getOptionLabel={(option) => option ? `${option.nombre} ${option.apellido} - ${option.email}` : ''}
                                        value={selectedClient}
                                        onChange={(event, newValue) => {
                                            setSelectedClient(newValue);
                                            setVentaHead({ ...ventaHead, cliente_id: newValue ? newValue.id : '' });
                                        }}
                                        onInputChange={(event, newInputValue) => setSearchClientValue(newInputValue || '')}
                                        loading={loadingClientes}
                                        noOptionsText={(searchClientValue || '').length < 3 ? "Escriba 3 caracteres para buscar..." : "No se encontraron clientes"}
                                        renderInput={(params) => <TextField size="small" {...params} label="Buscar Cliente" variant="outlined" />}
                                        isOptionEqualToValue={(option, value) => option && value ? option.id === value.id : option === value}
                                    />
                                    <Tooltip title="Nuevo Cliente">
                                        <Button size="small"
                                            variant="contained"
                                            color="inherit"
                                            onClick={() => setModalClienteOpen(true)}
                                            sx={{ minWidth: 'auto', px: 2, backgroundColor: '#f1f5f9', color: '#475569', '&:hover': { backgroundColor: '#e2e8f0' } }}
                                        >
                                            <PersonAddIcon />
                                        </Button>
                                    </Tooltip>
                                </Box>

                                <FormControl size="small" fullWidth>
                                    <InputLabel>Talonario</InputLabel>
                                    <Select size="small"
                                        value={ventaHead.talonario_id}
                                        label="Talonario"
                                        onChange={(e) => setVentaHead({ ...ventaHead, talonario_id: e.target.value })}
                                    >
                                        {talonarios.map(t => (
                                            <MenuItem key={t.id} value={t.id}>
                                                {t.tipo_comprobante} | {String(t.establecimiento).padStart(3, '0')}-{String(t.punto_expedicion).padStart(3, '0')}-{String(t.numero_actual).padStart(7, '0')}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Condición</InputLabel>
                                            <Select size="small"
                                                value={ventaHead.condicion_venta}
                                                label="Condición"
                                                onChange={(e) => setVentaHead({ ...ventaHead, condicion_venta: e.target.value })}
                                            >
                                                <MenuItem value={1}>Contado</MenuItem>
                                                <MenuItem value={2}>Crédito</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Pago</InputLabel>
                                            <Select size="small"
                                                value={ventaHead.metodo_cobro}
                                                label="Pago"
                                                onChange={(e) => setVentaHead({ ...ventaHead, metodo_cobro: e.target.value })}
                                            >
                                                <MenuItem value="efectivo">Efectivo</MenuItem>
                                                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                                                <MenuItem value="transferencia">Transferencia</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>

                                <FormControl size="small"Label
                                    control={
                                        <Switch
                                            checked={esDelivery}
                                            onChange={(e) => {
                                                setEsDelivery(e.target.checked);
                                                if (!e.target.checked) {
                                                    setVentaHead({ ...ventaHead, direccion_envio: '', costo_envio: 0 });
                                                }
                                            }}
                                            sx={{
                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                    color: '#c4a484',
                                                },
                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                    backgroundColor: '#c4a484',
                                                }
                                            }}
                                        />
                                    }
                                    label="Envío a Domicilio (Delivery)"
                                    sx={{ display: 'block' }}
                                />

                                {esDelivery && (
                                    <Box sx={{ mt: 0.5, width: '100%' }}>
                                        <Autocomplete size="small"
                                            freeSolo
                                            fullWidth
                                            options={(ventaHead.direccion_envio || '').length >= 3 ? opcionesDelivery : []}
                                            getOptionLabel={(option) => {
                                                if (typeof option === 'string') return option;
                                                return option.label || '';
                                            }}
                                            renderOption={(props, option) => (
                                                <li {...props} key={option.label}>
                                                    {option.label} - {formatCurrency(option.costo)} Gs.
                                                </li>
                                            )}
                                            inputValue={ventaHead.direccion_envio}
                                            onInputChange={(event, newInputValue) => {
                                                setVentaHead(prev => ({ ...prev, direccion_envio: newInputValue }));
                                            }}
                                            onChange={(event, newValue) => {
                                                if (typeof newValue === 'object' && newValue !== null) {
                                                    setVentaHead(prev => ({
                                                        ...prev,
                                                        direccion_envio: newValue.label,
                                                        costo_envio: newValue.costo
                                                    }));
                                                }
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    fullWidth
                                                    size="small"
                                                    label="Dirección de Envío / Ciudad"
                                                />
                                            )}
                                            noOptionsText="Sugerencias aparecerán al escribir..."
                                        />
                                    </Box>
                                )}
                            </Box>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" fontWeight="700" sx={{ mb: 2, color: '#334155' }}>Resumen de Facturación</Typography>

                                <Paper elevation={0} sx={{ p: 2.5, backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 3 }}>

                                    <Typography variant="h6" fontWeight="700" sx={{ color: '#334155', mb: 1.5 }}>
                                        Subtotales
                                    </Typography>
                                    {totals.total_exenta > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography color="text.secondary" variant="body2">Exentas:</Typography>
                                            <Typography fontWeight="600" variant="body2">{formatCurrency(totals.total_exenta)}</Typography>
                                        </Box>
                                    )}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary" variant="body2">Gravadas 5%:</Typography>
                                        <Typography fontWeight="600" variant="body2">{formatCurrency(totals.gravada_5)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography color="text.secondary" variant="body2">Gravadas 10%:</Typography>
                                        <Typography fontWeight="600" variant="body2">{formatCurrency(totals.gravada_10)}</Typography>
                                    </Box>

                                    {Number(ventaHead.costo_envio) > 0 && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1, backgroundColor: '#fdfbf9', borderRadius: 1 }}>
                                            <Typography color="text.secondary" variant="body2" fontWeight="700">Costo de Envío:</Typography>
                                            <Typography fontWeight="700" variant="body2" color="#c4a484">{formatCurrency(ventaHead.costo_envio)}</Typography>
                                        </Box>
                                    )}

                                    <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                                    <Typography variant="h6" fontWeight="700" sx={{ color: '#334155', mb: 1.5 }}>
                                        Liquidación de IVA
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary" variant="body2">IVA 5%:</Typography>
                                        <Typography fontWeight="600" variant="body2">{formatCurrency(totals.total_iva_5)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography color="text.secondary" variant="body2">IVA 10%:</Typography>
                                        <Typography fontWeight="600" variant="body2">{formatCurrency(totals.total_iva_10)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, p: 1, backgroundColor: '#fdfbf9', border: '1px solid #f3ebe3', borderRadius: 1 }}>
                                        <Typography color="text.secondary" variant="body2" fontWeight="700">Total IVA:</Typography>
                                        <Typography fontWeight="700" variant="body2" color="#c4a484">{formatCurrency(totals.liquidacion_iva)}</Typography>
                                    </Box>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f1f5f9', color: '#000000', p: 1.5, borderRadius: 2, mt: 2, boxShadow: 1 }}>
                                        <Typography variant="subtitle2" fontWeight="900" sx={{ lineHeight: 1.2 }}>
                                            TOTAL A PAGAR
                                        </Typography>
                                        <Typography variant="h6" fontWeight="900" sx={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                            Gs. {formatCurrency(totals.total_general)}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>

                        {/* Columna Derecha: Selección de productos */}
                        <Box sx={{ flexGrow: 1, p: 4, width: { xs: '100%', md: '65%' } }}>
                            <Typography variant="h6" fontWeight="700" sx={{ mb: 3, color: '#334155' }}>Detalle de Productos</Typography>

                            <Box sx={{ display: 'flex', gap: 2, mb: 4, width: '100%' }}>
                                <Autocomplete size="small"
                                    fullWidth
                                    sx={{ flexGrow: 1 }}
                                    options={productos || []}
                                    getOptionLabel={(option) => option && option.nombre ? `${option.nombre} (Stock: ${option.stock}) - ${formatCurrency(option.precio)}` : ''}
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

                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #edf2f7', borderRadius: 2, width: '100%' }}>
                                <Table size="small">
                                    <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell>Producto</TableCell>
                                            <TableCell align="center">Cant.</TableCell>
                                            <TableCell align="right">Precio</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell align="center">Acción</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {cart.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>La canasta está vacía</TableCell>
                                            </TableRow>
                                        ) : (
                                            cart.map((item, index) => (
                                                <TableRow key={index}>
                                                    <TableCell sx={{ fontWeight: 500 }}>{item.nombre}</TableCell>
                                                    <TableCell align="center">{item.cantidad}</TableCell>
                                                    <TableCell align="right">{formatCurrency(item.precio)}</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>{formatCurrency(item.cantidad * item.precio)}</TableCell>
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
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 4, py: 3, backgroundColor: '#f8fafc', borderTop: '1px solid #edf2f7' }}>
                    <Button size="small" onClick={handleCloseModal} disabled={saving} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>
                        Cancelar
                    </Button>
                    <Button size="small"
                        onClick={handleGuardarVenta}
                        variant="contained"
                        disabled={saving || cart.length === 0}
                        sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#ffffff', textTransform: 'none', fontWeight: 600, borderRadius: 2, px: 4 }}
                    >
                        {saving ? <CircularProgress size={24} color="inherit" /> : 'Confirmar Venta'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>

            {/* Modal Nuevo Cliente */}
            <Dialog open={modalClienteOpen} onClose={() => !savingCliente && setModalClienteOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, color: '#1e293b' }}>Registrar Nuevo Cliente</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
                        <TextField
                            label="Nombre"
                            fullWidth
                            size="small"
                            value={nuevoCliente.nombre}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                        />
                        <TextField
                            label="Apellido"
                            fullWidth
                            size="small"
                            value={nuevoCliente.apellido}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            type="email"
                            fullWidth
                            size="small"
                            value={nuevoCliente.email}
                            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                        />
                        <TextField
                            label="Teléfono"
                            fullWidth
                            size="small"
                            value={nuevoCliente.telefono}
                            onChange={e => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                        />
                        <TextField
                            label="RUC/C.I."
                            fullWidth
                            size="small"
                            value={nuevoCliente.documento}
                            onChange={e => setNuevoCliente({ ...nuevoCliente, documento: e.target.value })}
                            helperText="RUC o Cédula de Identidad"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button size="small" onClick={() => setModalClienteOpen(false)} disabled={savingCliente} color="inherit" size="small">Cancelar</Button>
                    <Button
                        onClick={handleCrearCliente}
                        variant="contained"
                        disabled={savingCliente}
                        size="small"
                        sx={{ backgroundColor: '#c4a484', '&:hover': { backgroundColor: '#a88a6c' }, color: '#fff' }}
                    >
                        {savingCliente ? <CircularProgress size={24} color="inherit" /> : 'Guardar Cliente'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de Previsualización PDF */}
            <Dialog
                open={pdfModalOpen}
                onClose={() => setPdfModalOpen(false)}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#f8fafc', color: '#1e293b' }}>
                    <Typography variant="h6" fontWeight="bold">Ticket de Venta</Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ p: 0, height: '80vh' }}>
                    {pdfBlobUrl && (
                        <iframe
                            src={pdfBlobUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 'none' }}
                            title="PDF Ticket"
                        />
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: '#f8fafc' }}>
                    {pdfModalVenta && pdfModalVenta.estado === 'pendiente_entrega' && (
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => setConfirmDeliveryModalOpen(true)}
                            sx={{ backgroundColor: '#ca8a04', '&:hover': { backgroundColor: '#a16207' } }}
                        >
                            Entregado
                        </Button>
                    )}
                    {pdfModalVenta && pdfModalVenta.estado !== 'anulado' && (
                        <Button
                            variant="contained"
                            color="error"
                            size="small"
                            startIcon={<CancelIcon />}
                            onClick={() => setAnularModalOpen(true)}
                        >
                            Anular
                        </Button>
                    )}
                    <Button size="small" onClick={() => setPdfModalOpen(false)} sx={{ color: '#1e293b' }}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={confirmDeliveryModalOpen} onClose={() => setConfirmDeliveryModalOpen(false)}>
                <DialogTitle sx={{ color: '#1e293b', fontWeight: 'bold' }}>Confirmar Entrega</DialogTitle>
                <DialogContent dividers>
                    <Typography>¿Está seguro de que los artículos de esta venta han sido entregados al cliente?</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button size="small" onClick={() => setConfirmDeliveryModalOpen(false)} color="inherit">Cancelar</Button>
                    <Button size="small" onClick={handleMarcarEntregado} variant="contained" sx={{ backgroundColor: '#c4a484', color: '#fff', '&:hover': { backgroundColor: '#a88a6c' } }}>Aceptar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={anularModalOpen} onClose={() => setAnularModalOpen(false)}>
                <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>Anular Venta</DialogTitle>
                <DialogContent dividers>
                    <Typography>¿Está seguro de que desea anular esta venta? Esta acción devolverá los artículos al stock y marcará el registro como anulado.</Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button size="small" onClick={() => setAnularModalOpen(false)} color="inherit">Cancelar</Button>
                    <Button size="small" onClick={handleAnularVenta} variant="contained" color="error">Aceptar</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}



