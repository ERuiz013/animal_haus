import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Chip,
  CircularProgress,
  Button
} from '@mui/material';
import { SentimentDissatisfied as SadIcon, AccessTime as AccessTimeIcon, LocalShipping as LocalShippingIcon, Cancel as CancelIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config';

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroActivo, setFiltroActivo] = useState('Todos');

  const filtros = ['Todos', 'Pendientes de Pago', 'En camino', 'Entregados', 'Cancelados'];

  useEffect(() => {
    window.scrollTo(0, 0);
    const savedUser = localStorage.getItem('animal_haus_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      const userId = user.uuid || user.id || user.id_usuario;

      if (userId) {
        fetch(`${API_BASE_URL}/getMisPedidos.php?cliente_id=${userId}`)
          .then(res => res.json())
          .then(data => {
            if (data.error) {
              setError(data.error);
            } else {
              setPedidos(data);
            }
          })
          .catch(err => {
            console.error("Error fetching pedidos:", err);
            setError("Ocurrió un error al cargar tus pedidos.");
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setLoading(false);
        setError("Usuario no válido.");
      }
    } else {
      setLoading(false);
      setError("No has iniciado sesión.");
    }
  }, []);

  const getChipStyles = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pagado':
      case 'completado':
      case 'confirmado':
      case 'entregado':
        return { bgcolor: '#dcfce7', color: '#166534' }; // Verde pastel
      case 'pendiente_entrega':
      case 'en_camino':
        return { bgcolor: '#e0f2fe', color: '#075985' }; // Azul pastel
      case 'pendiente':
      case 'pendiente_pago':
        return { bgcolor: '#ffedd5', color: '#0f172a' }; // Naranja pastel con letra negra
      case 'cancelado':
      case 'anulado':
        return { bgcolor: '#fee2e2', color: '#991b1b' }; // Rojo pastel
      default:
        return { bgcolor: '#f1f5f9', color: '#475569' }; // Gris pastel
    }
  };

  const formatStatusText = (estado) => {
    if (!estado) return 'Pendiente';
    const est = estado.toLowerCase();
    if (est === 'pendiente_pago') return 'Pendiente Pago';
    if (est === 'pendiente_entrega' || est === 'en_camino') return 'En Camino';

    // Capitalizar la primera letra del estado por defecto (ej. anulado -> Anulado)
    const text = est.replace('_', ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#f59e0b' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f3efe6', minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', letterSpacing: '-0.02em', mb: 1 }}>
            Mis Pedidos
          </Typography>
          <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
            Historial y estado de tus compras
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filtros.map(f => (
              <Chip
                key={f}
                label={f}
                onClick={() => setFiltroActivo(f)}
                clickable
                sx={{
                  bgcolor: filtroActivo === f ? 'rgba(0,0,0,0.06)' : '#ffffff',
                  color: '#1e293b',
                  fontWeight: filtroActivo === f ? 700 : 500,
                  border: filtroActivo === f ? '1px solid rgba(0,0,0,0.15)' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  px: 0.5,
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                }}
              />
            ))}
          </Box>
        </Box>

        {(() => {
          const pedidosFiltrados = pedidos.filter(pedido => {
            if (filtroActivo === 'Todos') return true;
            if (filtroActivo === 'Pendientes de Pago') return pedido.estado === 'pendiente_pago';
            if (filtroActivo === 'En camino') return pedido.estado === 'pendiente_entrega' || pedido.estado === 'en_camino';
            if (filtroActivo === 'Entregados') return pedido.estado === 'entregado' || pedido.estado === 'pagado';
            if (filtroActivo === 'Cancelados') return pedido.estado === 'cancelado';
            return true;
          });

          return (
            <>

              {error && (
                <Typography color="error" sx={{ mb: 4, textAlign: 'center', p: 3, bgcolor: '#fee2e2', borderRadius: 2 }}>
                  {error}
                </Typography>
              )}

              {!error && pedidosFiltrados.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                  <SadIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
                  <Typography variant="h5" fontWeight="700" sx={{ color: '#475569', mb: 1 }}>
                    Aún no tienes pedidos
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>
                    Cuando realices compras, aparecerán aquí.
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => {
                      window.history.pushState({}, '', import.meta.env.BASE_URL);
                      window.dispatchEvent(new Event('popstate'));
                    }}
                    sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' }, borderRadius: '50px', px: 4, py: 1.5, fontWeight: 600 }}
                  >
                    Ir a la tienda
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, alignItems: 'start' }}>
                  {pedidosFiltrados.map((pedido) => (
                    <Box key={pedido.id}>
                      <Card elevation={0} sx={{ width: '100%', borderRadius: 4, overflow: 'hidden', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ bgcolor: '#f8fafc', px: { xs: 1, sm: 3 }, py: { xs: 1, sm: 1.5 }, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                          <Box sx={{ flex: 1, pr: 1, minWidth: 0, display: { xs: 'none', sm: 'block' } }}>
                            <Typography variant="caption" color="#64748b" fontWeight={600} component="div" noWrap>
                              PEDIDO N°
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="#1e293b" component="div">
                              {pedido.numero_factura || `00${pedido.id}`}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: { xs: 1, sm: 1.3 }, pr: { xs: 0.5, sm: 1 }, minWidth: 0 }}>
                            <Typography variant="caption" color="#64748b" fontWeight={600} component="div" noWrap>
                              FECHA
                            </Typography>
                            <Typography variant="body2" color="#475569" fontWeight={500} component="div">
                              {formatDate(pedido.fecha)}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1, px: { xs: 0.5, sm: 1 }, minWidth: 0, textAlign: (filtroActivo === 'Todos' || (pedido.estado === 'pendiente_pago' && pedido.pagopar_hash)) ? { xs: 'center', sm: 'left' } : 'right' }}>
                            <Typography variant="caption" color="#64748b" fontWeight={600} component="div" noWrap>
                              TOTAL
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="#f59e0b" component="div" sx={{ whiteSpace: 'nowrap' }}>
                              Gs. {Number(pedido.total).toLocaleString('es-PY')}
                            </Typography>
                          </Box>
                          {(filtroActivo === 'Todos' || (pedido.estado === 'pendiente_pago' && pedido.pagopar_hash)) && (
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end', minWidth: 0 }}>
                              {filtroActivo === 'Todos' && (
                                <Chip
                                  label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      {formatStatusText(pedido.estado)}
                                      {pedido.estado === 'pendiente_pago' && <AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
                                      {(pedido.estado === 'pendiente_entrega' || pedido.estado === 'en_camino') && <LocalShippingIcon sx={{ fontSize: '14px !important' }} />}
                                      {(pedido.estado === 'cancelado' || pedido.estado === 'anulado') && <CancelIcon sx={{ fontSize: '14px !important' }} />}
                                      {(pedido.estado === 'entregado' || pedido.estado === 'pagado' || pedido.estado === 'completado' || pedido.estado === 'confirmado') && <CheckCircleIcon sx={{ fontSize: '14px !important' }} />}
                                    </Box>
                                  }
                                  size="small"
                                  sx={{
                                    ...getChipStyles(pedido.estado),
                                    fontWeight: 600,
                                    borderRadius: '8px',
                                    '.MuiChip-label': { px: 1 },
                                    '& .MuiSvgIcon-root': { color: 'inherit' }
                                  }}
                                />
                              )}
                              {pedido.estado === 'pendiente_pago' && pedido.pagopar_hash && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => window.location.href = `https://www.pagopar.com/pagos/${pedido.pagopar_hash}`}
                                  sx={{ backgroundColor: '#10b981', '&:hover': { backgroundColor: '#059669' }, textTransform: 'none', fontWeight: 600, width: '100%' }}
                                >
                                  Pagar Ahora
                                </Button>
                              )}
                            </Box>
                          )}
                        </Box>
                        <CardContent sx={{ p: 0, flexGrow: 1, overflowY: 'auto' }}>
                          {pedido.detalles && pedido.detalles.length > 0 ? (
                            pedido.detalles.map((item, index) => (
                              <Box key={item.id} sx={{ px: { xs: 2, sm: 3 }, py: 2, display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, borderBottom: index < pedido.detalles.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                <Box
                                  component="img"
                                  src={item.producto_imagen ? `${IMAGE_BASE_URL}${item.producto_imagen}` : 'https://placehold.co/50x50/f1f5f9/94a3b8?text=Sin+Imagen'}
                                  sx={{ width: 50, height: 50, borderRadius: 1.5, objectFit: 'cover', bgcolor: '#f8fafc' }}
                                  alt={item.producto_nombre}
                                />
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography variant="body2" fontWeight={600} color="#1e293b" sx={{ mb: 0.2 }}>
                                    {item.producto_nombre || 'Producto'}
                                  </Typography>
                                  <Typography variant="caption" color="#64748b">
                                    Cantidad: <Box component="span" fontWeight={600} color="#334155">{item.cantidad}</Box> x Gs. {Number(item.precio_unitario).toLocaleString('es-PY')}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" fontWeight={700} color="#1e293b" sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}>
                                  Gs. {Number(item.subtotal).toLocaleString('es-PY')}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Box sx={{ p: 3 }}>
                              <Typography variant="body2" color="#64748b">No hay detalles de productos para este pedido.</Typography>
                            </Box>
                          )}
                        </CardContent>
                        <Box sx={{ p: 1.5, borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', bgcolor: '#ffffff' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              borderRadius: '8px',
                              color: '#64748b',
                              borderColor: '#cbd5e1',
                              '&:hover': { bgcolor: '#f8fafc', borderColor: '#94a3b8' }
                            }}
                          >
                            Ver Detalle
                          </Button>
                        </Box>
                      </Card>
                    </Box>
                  ))}
                </Box>
              )}
            </>
          );
        })()}
      </Container>
    </Box>
  );
}
