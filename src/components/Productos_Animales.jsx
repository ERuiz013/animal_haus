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
  Breadcrumbs,
  Link,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  AddShoppingCartOutlined as AddShoppingCartOutlinedIcon,
  SentimentDissatisfied as SadIcon,
  ArrowBack as ArrowBackIcon
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

export default function ProductosAnimales() {
  const [animalProducts, setAnimalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animalName, setAnimalName] = useState("");
  const [visibleProductsCount, setVisibleProductsCount] = useState(10);
  const { addToCart } = useCart() || { addToCart: () => { } };
  const { favorites, toggleFavorite } = useFavorite() || { favorites: {}, toggleFavorite: () => { } };
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const API_URL = API_BASE_URL;

  const [currentUrl, setCurrentUrl] = useState(window.location.search);

  useEffect(() => {
    const handlePopState = () => setCurrentUrl(window.location.search);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(currentUrl);
    const animalId = searchParams.get('id');
    const animalNombre = searchParams.get('nombre') || "Animal";
    
    setAnimalName(animalNombre);
    setLoading(true);
    setVisibleProductsCount(10);

    if (animalId) {
      fetch(`${API_URL}/getProductos.php?animal_id=${animalId}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error && Array.isArray(data)) {
            setAnimalProducts(data);
          } else {
            setAnimalProducts([]);
          }
        })
        .catch(err => {
          console.error("Error fetching animal products:", err);
          setAnimalProducts([]);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [API_URL, currentUrl]);

  const handleProductClick = (id) => {
    window.history.pushState({}, '', `${import.meta.env.BASE_URL.replace(/\/$/, '')}/producto?id=${id}`);
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleGoBack = () => {
    window.history.pushState({}, '', import.meta.env.BASE_URL);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`Agregaste ${product.nombre} al carrito`);
    setSnackbarOpen(true);
  };

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f3efe6', minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: 10 }}>
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
            <Typography color="text.primary" sx={{ textTransform: 'capitalize' }}>
              {animalName}
            </Typography>
          </Breadcrumbs>
        </Box>

        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ height: 2, width: 40, bgcolor: '#dc2626', borderRadius: 2 }} />
          <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', letterSpacing: '-0.02em', textTransform: 'capitalize' }}>
            Productos para {animalName}
          </Typography>
        </Box>

        {loading ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>Cargando productos...</Typography>
        ) : animalProducts.length > 0 ? (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, sm: 3, md: 4 } }}>
              {animalProducts.slice(0, visibleProductsCount).map((prod) => (
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
            
            {visibleProductsCount < animalProducts.length && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => setVisibleProductsCount(prev => prev + 10)}
                  sx={{
                    color: '#dc2626',
                    borderColor: '#dc2626',
                    borderRadius: '50px',
                    px: 5,
                    py: 1.5,
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                      borderColor: '#b91c1c',
                      backgroundColor: '#fef2f2'
                    }
                  }}
                >
                  Ver más Productos
                </Button>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10, backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <SadIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h6" fontWeight="700" sx={{ color: '#1e293b', mb: 1 }}>
              No hay productos
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
              Lo sentimos, no encontramos productos para esta categoría.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleGoBack}
              sx={{ borderColor: '#e2e8f0', color: '#64748b', borderRadius: '50px', textTransform: 'none', fontWeight: 600 }}
            >
              Volver al inicio
            </Button>
          </Box>
        )}
      </Container>
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
