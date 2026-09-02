import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Skeleton,
  Breadcrumbs,
  Link,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  AddShoppingCartOutlined as AddShoppingCartOutlinedIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  ArrowBack as ArrowBackIcon,
  Share as ShareIcon,
  WhatsApp as WhatsAppIcon,
  Telegram as TelegramIcon,
  Instagram as InstagramIcon,
  ContentCopy as ContentCopyIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  DescriptionOutlined as DescriptionOutlinedIcon,
  ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config';


const ProductCard = ({ product, isFavorite, onToggleFavorite, onClick, onAddToCart }) => (
  <Card
    elevation={0}
    sx={{
      display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: '#ffffff',
      borderRadius: { xs: '16px', sm: '24px' }, position: 'relative', cursor: 'pointer',
      border: '1px solid #f1f5f9',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', borderColor: 'transparent' },
      '&:hover .product-img': { transform: 'scale(1.08)' }
    }}
    onClick={onClick}
  >
    <IconButton
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
      sx={{
        position: 'absolute', top: { xs: 8, sm: 12 }, right: { xs: 8, sm: 12 },
        backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(4px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        width: { xs: 30, sm: 40 }, height: { xs: 30, sm: 40 },
        '&:hover': { backgroundColor: '#ffffff', transform: 'scale(1.1)' },
        transition: 'all 0.2s', zIndex: 2
      }}
    >
      {isFavorite ? <FavoriteIcon sx={{ color: '#ef4444', fontSize: { xs: '1rem', sm: '1.2rem' } }} /> : <FavoriteBorderIcon sx={{ color: '#94a3b8', fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
    </IconButton>

    <Box sx={{ p: { xs: 1, sm: 2 }, pb: 0 }}>
      <Box sx={{
        height: { xs: 130, sm: 220 }, backgroundColor: '#ffffff', borderRadius: { xs: '12px', sm: '16px' },
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative'
      }}>
        <Box
          className="product-img" component="img"
          src={product.imagen ? `${IMAGE_BASE_URL}${ product.imagen }` : 'https://placehold.co/400x400/ffffff/94a3b8?text=Sin+Imagen'}
          alt={product.nombre}
          sx={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </Box>
    </Box>

    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 3 }, pt: { xs: 1, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 3 } } }}>
      <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#0f172a', lineHeight: 1.3, mb: { xs: 1, sm: 2 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: { xs: '2.6em', sm: '2.6em' }, fontSize: { xs: '0.85rem', sm: '1.05rem' } }}>
        {product.nombre}
      </Typography>

      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: { xs: 0, sm: 0.5 }, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
            Precio
          </Typography>
          <Typography variant="h6" fontWeight="900" sx={{ color: '#dc2626', lineHeight: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
            Gs. {Number(product.precio).toLocaleString('es-PY')}
          </Typography>
        </Box>
        <Box
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          sx={{
            backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)',
            borderRadius: '50%', width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 }, display: 'flex', alignItems: 'center', justifyContent: 'center',
            '&:hover': { backgroundColor: '#334155', transform: 'scale(1.05)' },
            transition: 'all 0.2s', flexShrink: 0, ml: 1
          }}
        >
          <AddShoppingCartOutlinedIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function ProductoDetalle() {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart() || { addToCart: () => { } };
  const { favorites, toggleFavorite } = useFavorite() || { favorites: {}, toggleFavorite: () => { } };

  const [productId, setProductId] = useState(() => new URLSearchParams(window.location.search).get('id'));

  useEffect(() => {
    const handlePopState = () => {
      setProductId(new URLSearchParams(window.location.search).get('id'));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!productId) {
      setError('ID de producto no proporcionado.');
      setLoading(false);
      return;
    }

    const API_URL = API_BASE_URL;

    fetch(`${API_URL}/getProducto.php?id=${productId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setProducto(data);
        }
      })
      .catch(err => {
        console.error("Error fetching product details:", err);
        setError('Ocurrió un error al cargar el producto.');
      })
      .finally(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    if (producto && producto.categoria_id) {
      setLoadingSimilar(true);
      const API_URL = API_BASE_URL;

      fetch(`${API_URL}/getProductos.php`)
        .then(res => res.json())
        .then(data => {
          if (!data.error && Array.isArray(data)) {
            const similar = data.filter(p => String(p.categoria_id) === String(producto.categoria_id) && String(p.id) !== String(producto.id)).slice(0, 4);
            setSimilarProducts(similar);
          }
        })
        .catch(err => console.error("Error fetching similar products:", err))
        .finally(() => setLoadingSimilar(false));
    }
  }, [producto]);

  const handleAddToCart = () => {
    if (producto) {
      addToCart(producto, quantity);
      setSnackbarMessage(`Agregaste ${quantity}x ${producto.nombre} al carrito`);
      setSnackbarOpen(true);
      setQuantity(1); // Reset quantity after adding
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleProductClick = (id) => {
    window.history.pushState({}, '', `${import.meta.env.BASE_URL.replace(/\/$/, '')}/producto?id=${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQuantity(1);
    setLoading(true);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleAddSimilarToCart = (e, prod) => {
    e.stopPropagation();
    if (prod) {
      addToCart(prod);
      setSnackbarMessage(`Agregaste ${prod.nombre} al carrito`);
      setSnackbarOpen(true);
    }
  };

  const handleShare = () => {
    setShareDialogOpen(true);
  };

  const handleCloseShareDialog = () => {
    setShareDialogOpen(false);
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`¡Mira este producto genial en Animal Haus!\n\n${producto.nombre}\n\n`);
    window.open(`https://api.whatsapp.com/send?text=${text}${url}`, '_blank');
    handleCloseShareDialog();
  };

  const shareToTelegram = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`¡Mira este producto genial en Animal Haus: ${producto.nombre}!`);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank');
    handleCloseShareDialog();
  };

  const shareToInstagram = () => {
    // Instagram doesn't have a direct web intent for sharing links to feed.
    // We copy the link and let the user know they can paste it.
    navigator.clipboard.writeText(window.location.href).then(() => {
      setSnackbarMessage('Enlace copiado. ¡Abre Instagram para pegarlo y compartirlo!');
      setSnackbarOpen(true);
      handleCloseShareDialog();
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setSnackbarMessage('¡Enlace copiado al portapapeles!');
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMessage('Error al copiar el enlace');
        setSnackbarOpen(true);
      });
    handleCloseShareDialog();
  };

  const handleGoBack = () => {
    window.history.pushState({}, '', import.meta.env.BASE_URL);
    window.dispatchEvent(new Event('popstate'));
  };

  if (loading) {
    return (
      <Box sx={{ flexGrow: 1, backgroundColor: '#f3efe6', minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: '16px' }} />
        </Container>
      </Box>
    );
  }

  if (error || !producto) {
    return (
      <Box sx={{ flexGrow: 1, backgroundColor: '#f3efe6', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>{error || 'Producto no encontrado.'}</Typography>
        <Button variant="contained" onClick={handleGoBack} sx={{ mt: 2, bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}>
          Volver a Inicio
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f3efe6', minHeight: '100vh', pt: { xs: 2, md: 3 }, pb: { xs: 14, md: 8 } }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs / Back button */}
        <Box sx={{ mb: { xs: 2, md: 3 }, display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleGoBack} sx={{ bgcolor: 'rgba(0,0,0,0.05)', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}>
            <ArrowBackIcon />
          </IconButton>
          <Breadcrumbs aria-label="breadcrumb">
            <Link underline="hover" color="inherit" onClick={handleGoBack} sx={{ cursor: 'pointer' }}>
              Inicio
            </Link>
            <Typography color="text.primary">{producto.categoria_nombre || 'Producto'}</Typography>
          </Breadcrumbs>
        </Box>

        <Card elevation={0} sx={{ borderRadius: '24px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Imagen del producto */}
            <Box sx={{
              flex: 1,
              width: { xs: '100%', md: '50%' },
              backgroundColor: '#ffffff',
              p: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: { md: '1px solid #f1f5f9' },
              borderBottom: { xs: '1px solid #f1f5f9', md: 'none' },
              position: 'relative'
            }}>
              <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1, zIndex: 10 }}>
                <IconButton
                  onClick={handleShare}
                  sx={{ bgcolor: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#ffffff', transform: 'scale(1.1)' }, transition: 'all 0.2s', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
                  title="Compartir"
                >
                  <ShareIcon sx={{ color: '#64748b' }} />
                </IconButton>
                <IconButton
                  onClick={() => toggleFavorite(producto.id)}
                  sx={{ bgcolor: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', '&:hover': { bgcolor: '#ffffff', transform: 'scale(1.1)' }, transition: 'all 0.2s', width: { xs: 40, sm: 48 }, height: { xs: 40, sm: 48 } }}
                >
                  {favorites?.[producto.id] ? (
                    <FavoriteIcon sx={{ color: '#d32f2f' }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: '#64748b' }} />
                  )}
                </IconButton>
              </Box>

              <Box
                component="img"
                src={producto.imagen ? `${IMAGE_BASE_URL}${ producto.imagen }` : 'https://placehold.co/600x600/f1f5f9/94a3b8?text=Sin+Imagen'}
                alt={producto.nombre}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '500px',
                  objectFit: 'contain',
                  borderRadius: '12px'
                }}
              />
            </Box>

            {/* Detalles del producto */}
            <Box sx={{ flex: 1, width: { xs: '100%', md: '50%' } }}>
              <CardContent sx={{ p: { xs: 4, md: 6 }, height: '100%', display: 'flex', flexDirection: 'column' }}>

                <Typography variant="h3" component="h1" fontWeight="800" sx={{ color: '#0f172a', mb: 2, letterSpacing: '-0.5px', fontSize: { xs: '1.75rem', md: '2.5rem' }, lineHeight: 1.2 }}>
                  {producto.nombre}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                  <Typography variant="h4" fontWeight="900" sx={{ color: '#dc2626', fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                    Gs. {Number(producto.precio).toLocaleString('es-PY')}
                  </Typography>
                  {producto.stock !== undefined && (
                    <Chip
                      label={Number(producto.stock) > 0 ? `${producto.stock} disponible(s)` : 'Agotado'}
                      color={Number(producto.stock) > 0 ? 'default' : 'error'}
                      size="small"
                      sx={{ fontWeight: 'bold', letterSpacing: '0.5px' }}
                    />
                  )}
                </Box>

                <Divider sx={{ mb: 4, borderColor: '#f1f5f9' }} />

                <Box
                  onClick={() => setDescDialogOpen(true)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    mb: 4,
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f8fafc',
                      borderColor: '#cbd5e1',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      backgroundColor: '#f1f5f9', 
                      p: 1, 
                      borderRadius: '10px',
                      display: 'flex'
                    }}>
                      <DescriptionOutlinedIcon sx={{ color: '#475569' }} />
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#1e293b', lineHeight: 1.2 }}>
                        Descripción del producto
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748b' }}>
                        Toca para leer más detalles
                      </Typography>
                    </Box>
                  </Box>
                  <ChevronRightIcon sx={{ color: '#94a3b8' }} />
                </Box>

                {/* Spacer removed as requested */}

                <Box sx={{ 
                  mt: 'auto', pt: { xs: 0, sm: 4 }, 
                  display: 'flex', flexDirection: 'row', gap: 2, alignItems: { xs: 'center', sm: 'flex-end' },
                  position: { xs: 'fixed', sm: 'static' },
                  bottom: { xs: 0, sm: 'auto' },
                  left: { xs: 0, sm: 'auto' },
                  right: { xs: 0, sm: 'auto' },
                  backgroundColor: { xs: '#ffffff', sm: 'transparent' },
                  p: { xs: 2, sm: 0 },
                  pb: { xs: 'calc(16px + env(safe-area-inset-bottom))', sm: 0 },
                  boxShadow: { xs: '0 -4px 24px rgba(0,0,0,0.1)', sm: 'none' },
                  zIndex: { xs: 1100, sm: 1 },
                  borderTop: { xs: '1px solid #f1f5f9', sm: 'none' }
                }}>
                  {/* Selector de cantidad */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: { xs: '130px', sm: 'auto' }, gap: 1, alignItems: 'center', flexShrink: 0 }}>
                    <Typography variant="body2" fontWeight="800" sx={{ display: { xs: 'none', sm: 'block' }, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Cantidad
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '2px solid #e2e8f0',
                      borderRadius: '50px',
                      backgroundColor: '#f8fafc',
                      p: { xs: 0, sm: 0.5 },
                      width: '100%',
                      justifyContent: 'space-between',
                      height: { xs: '54px', sm: 'auto' }
                    }}>
                      <IconButton
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        sx={{ width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, color: '#64748b', '&:hover': { bgcolor: '#e2e8f0' } }}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography sx={{ width: 30, textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a' }}>
                        {quantity}
                      </Typography>
                      <IconButton
                        onClick={() => {
                          const maxStock = producto?.stock !== undefined && producto?.stock !== null ? Number(producto.stock) : Infinity;
                          if (quantity >= maxStock) {
                            setSnackbarMessage(`Solo hay ${maxStock} disponible(s)`);
                            setSnackbarOpen(true);
                          } else {
                            setQuantity(q => q + 1);
                          }
                        }}
                        sx={{ width: { xs: 40, sm: 44 }, height: { xs: 40, sm: 44 }, color: '#64748b', '&:hover': { bgcolor: '#e2e8f0' } }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    onClick={handleAddToCart}
                    sx={{
                      backgroundColor: '#1e293b',
                      color: '#ffffff',
                      borderRadius: '50px',
                      py: { xs: 0, sm: 1.8 },
                      height: { xs: '54px', sm: 'auto' },
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      fontWeight: 700,
                      textTransform: 'none',
                      boxShadow: '0 10px 20px rgba(30, 41, 59, 0.2)',
                      '&:hover': {
                        backgroundColor: '#334155',
                        boxShadow: '0 12px 24px rgba(30, 41, 59, 0.3)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      gap: { xs: 1, sm: 2 },
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <AddShoppingCartOutlinedIcon />
                    Añadir al carrito
                  </Button>
                </Box>
              </CardContent>
            </Box>
          </Box>
        </Card>

        {/* Artículos Similares */}
        {similarProducts.length > 0 && (
          <Box sx={{ mt: { xs: 5, md: 8 }, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1, textAlign: 'center' }}>
              <Box sx={{ height: 2, width: 40, bgcolor: '#f59e0b', borderRadius: 2, display: { xs: 'none', sm: 'block' } }} />
              <Typography variant="h3" fontWeight="900" sx={{ color: '#1e293b', letterSpacing: '-0.02em', fontSize: { xs: '1.75rem', sm: '3rem' } }}>
                Artículos Similares
              </Typography>
              <Box sx={{ height: 2, width: 40, bgcolor: '#f59e0b', borderRadius: 2, display: { xs: 'none', sm: 'block' } }} />
            </Box>
            <Typography variant="body1" sx={{ color: '#64748b', mb: 4, textAlign: 'center', fontWeight: 500 }}>
              Otros clientes también compraron
            </Typography>

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: { xs: 2, sm: 4 }
            }}>
              {similarProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  isFavorite={favorites?.[prod.id]}
                  onToggleFavorite={() => toggleFavorite(prod.id)}
                  onClick={() => handleProductClick(prod.id)}
                  onAddToCart={() => {
                    if (prod) {
                      addToCart(prod);
                      setSnackbarMessage(`Agregaste ${prod.nombre} al carrito`);
                      setSnackbarOpen(true);
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </Container>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%', bgcolor: '#1e293b', color: 'white', '& .MuiAlert-icon': { color: '#4ade80' } }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={shareDialogOpen}
        onClose={handleCloseShareDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            padding: 2,
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, pt: 1, color: '#0f172a', fontWeight: 700 }}>
          Compartir Producto
          <IconButton onClick={handleCloseShareDialog} sx={{ bgcolor: 'rgba(0,0,0,0.04)', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
            Selecciona una plataforma para compartir este increíble producto con tus amigos.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, textAlign: 'center', pb: 2 }}>

            {/* Copiar Enlace */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={copyLink}
                sx={{
                  bgcolor: '#f1f5f9',
                  width: 56, height: 56,
                  '&:hover': { bgcolor: '#e2e8f0', transform: 'scale(1.05)' },
                  transition: 'all 0.2s'
                }}
              >
                <ContentCopyIcon sx={{ color: '#475569' }} />
              </IconButton>
              <Typography variant="caption" fontWeight="600" color="#475569">Copiar</Typography>
            </Box>

            {/* WhatsApp */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={shareToWhatsApp}
                sx={{
                  bgcolor: '#e6fbf0',
                  width: 56, height: 56,
                  '&:hover': { bgcolor: '#dcf8e8', transform: 'scale(1.05)' },
                  transition: 'all 0.2s'
                }}
              >
                <WhatsAppIcon sx={{ color: '#25D366' }} />
              </IconButton>
              <Typography variant="caption" fontWeight="600" color="#475569">WhatsApp</Typography>
            </Box>

            {/* Telegram */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={shareToTelegram}
                sx={{
                  bgcolor: '#e6f3fb',
                  width: 56, height: 56,
                  '&:hover': { bgcolor: '#d6eefb', transform: 'scale(1.05)' },
                  transition: 'all 0.2s'
                }}
              >
                <TelegramIcon sx={{ color: '#0088cc' }} />
              </IconButton>
              <Typography variant="caption" fontWeight="600" color="#475569">Telegram</Typography>
            </Box>

            {/* Instagram */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <IconButton
                onClick={shareToInstagram}
                sx={{
                  bgcolor: '#fcecf2',
                  width: 56, height: 56,
                  '&:hover': { bgcolor: '#fbdbe6', transform: 'scale(1.05)' },
                  transition: 'all 0.2s'
                }}
              >
                <InstagramIcon sx={{ color: '#E1306C' }} />
              </IconButton>
              <Typography variant="caption" fontWeight="600" color="#475569">Instagram</Typography>
            </Box>

          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        open={descDialogOpen}
        onClose={() => setDescDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            padding: 2,
            boxShadow: '0 24px 48px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, pt: 1, color: '#0f172a', fontWeight: 700 }}>
          Descripción del Producto
          <IconButton onClick={() => setDescDialogOpen(false)} sx={{ bgcolor: 'rgba(0,0,0,0.04)', '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' } }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
            {producto.detalle || producto.descripcion || 'Este producto no cuenta con una descripción detallada en este momento.'}
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
