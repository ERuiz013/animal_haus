import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Skeleton,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddShoppingCartOutlined as AddShoppingCartOutlinedIcon,
  SentimentDissatisfied as SadIcon
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config';


const ProductCard = ({ product, isFavorite, onToggleFavorite, onClick, onAddToCart }) => (
  <Card
    elevation={0}
    sx={{
      display: 'flex', flexDirection: 'column', width: '100%', height: '100%', backgroundColor: '#ffffff',
      borderRadius: '16px', position: 'relative', cursor: 'pointer',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: '0 10px 25px rgba(0,0,0,0.08)', borderColor: '#cbd5e1', transform: 'translateY(-4px)' },
      overflow: 'visible'
    }}
    onClick={onClick}
  >
    <Box sx={{
      width: '100%', height: { xs: '150px', sm: '200px' },
      p: 2,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#ffffff', borderRadius: '16px 16px 0 0', position: 'relative',
      borderBottom: '1px solid #f8fafc'
    }}>
      <Box
        component="img"
        src={product.imagen ? `${IMAGE_BASE_URL}${ product.imagen }` : 'https://placehold.co/400x400/ffffff/94a3b8?text=Sin+Imagen'}
        alt={product.nombre}
        sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
      />
      <IconButton
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        sx={{ 
          position: 'absolute', top: 8, right: 8, 
          backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          '&:hover': { backgroundColor: '#f8fafc' }
        }}
      >
        {isFavorite ? <FavoriteIcon sx={{ color: '#ef4444', fontSize: '1.2rem' }} /> : <FavoriteBorderIcon sx={{ color: '#94a3b8', fontSize: '1.2rem' }} />}
      </IconButton>
    </Box>

    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 2.5 } }}>
      <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#1e293b', lineHeight: 1.3, mb: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {product.nombre}
      </Typography>

      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        PRECIO
      </Typography>
      
      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', pt: 1 }}>
        <Typography variant="h6" fontWeight="800" sx={{ color: '#d32f2f', lineHeight: 1 }}>
          Gs. {Number(product.precio).toLocaleString('es-PY')}
        </Typography>
        
        <IconButton
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          sx={{
            backgroundColor: '#1e293b', color: '#fff', 
            '&:hover': { backgroundColor: '#334155' }
          }}
        >
          <AddShoppingCartOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);

const Descuentos = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleProductsCount, setVisibleProductsCount] = useState(10);
  const { addToCart } = useCart() || { addToCart: () => { } };
  const { favorites, toggleFavorite } = useFavorite() || { favorites: {}, toggleFavorite: () => { } };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const API_URL = API_BASE_URL;

  useEffect(() => {
    window.scrollTo(0, 0);
    fetch(`${API_URL}/getProductos.php?tipo_precio=descuento,oferta`)
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts([]);
        }
      })
      .catch(err => {
        console.error("Error fetching descuentos products:", err);
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [API_URL]);

  const handleProductClick = (id) => {
    window.history.pushState({}, '', `${import.meta.env.BASE_URL.replace(/\/$/, '')}/producto?id=${id}`);
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`Agregaste ${product.nombre} al carrito`);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{
      flexGrow: 1,
      backgroundColor: '#f3efe6',
      minHeight: '100vh',
      pt: { xs: 4, md: 8 }, // For navbar
      pb: 8,
      color: '#0f172a',
      '& .MuiTypography-root, & .MuiButton-root, & .MuiChip-root, & .MuiLink-root, & .MuiTab-root': {
        fontFamily: "'Nunito', sans-serif !important"
      }
    }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
          <Box sx={{ height: 2, width: 40, bgcolor: '#EF5350', borderRadius: 2 }} />
          <Typography variant="h3" fontWeight="900" align="center" sx={{ color: '#1e293b', letterSpacing: '-0.02em', fontSize: { xs: '2rem', sm: '3rem' }, textTransform: 'uppercase' }}>
            Ofertas Flash
          </Typography>
          <Box sx={{ height: 2, width: 40, bgcolor: '#EF5350', borderRadius: 2 }} />
        </Box>
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 6, fontWeight: 500 }}>
          Descubre los mejores descuentos en productos seleccionados
        </Typography>

        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          {loading ? (
            <Grid container spacing={2}>
              {Array.from(new Array(4)).map((_, index) => (
                <Grid item xs={6} sm={6} md={3} key={index}>
                  <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                    <Skeleton variant="rectangular" height={160} />
                    <CardContent sx={{ px: { xs: 1.5, sm: 2 }, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} width="60%" sx={{ mb: 2 }} />
                      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Skeleton variant="rectangular" height={30} width="40%" />
                        <Skeleton variant="circular" width={40} height={40} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : products.length > 0 ? (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, sm: 3, md: 4 } }}>
                {products.slice(0, visibleProductsCount).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    isFavorite={!!favorites[prod.id]}
                    onToggleFavorite={() => toggleFavorite(prod.id)}
                    onClick={() => handleProductClick(prod.id)}
                    onAddToCart={() => handleAddToCart(prod)}
                  />
                ))}
              </Box>
              
              {visibleProductsCount < products.length && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => setVisibleProductsCount(prev => prev + 10)}
                    sx={{
                      color: '#EF5350',
                      borderColor: '#EF5350',
                      borderRadius: '50px',
                      px: 5,
                      py: 1.5,
                      fontWeight: 700,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      borderWidth: '2px',
                      '&:hover': {
                        borderWidth: '2px',
                        borderColor: '#D32F2F',
                        backgroundColor: '#fef2f2'
                      }
                    }}
                  >
                    Ver más Ofertas
                  </Button>
                </Box>
              )}
            </>
          ) : (
            <Box sx={{ textAlign: 'center', py: 10, backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
              <SadIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" fontWeight="700" sx={{ color: '#1e293b', mb: 1 }}>
                No hay ofertas activas
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                Vuelve pronto para descubrir nuevos descuentos.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  window.history.pushState({}, '', import.meta.env.BASE_URL);
                  window.dispatchEvent(new Event('popstate'));
                }}
                sx={{
                  color: '#EF5350',
                  borderColor: '#EF5350',
                  borderRadius: '50px',
                  px: 5,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  borderWidth: '2px',
                  '&:hover': {
                    borderWidth: '2px',
                    borderColor: '#D32F2F',
                    backgroundColor: '#fef2f2'
                  }
                }}
              >
                Volver al Inicio
              </Button>
            </Box>
          )}
        </Box>
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Descuentos;
