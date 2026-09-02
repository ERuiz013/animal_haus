import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button
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
      display: 'flex', flexDirection: 'row', width: '100%', backgroundColor: '#ffffff',
      borderRadius: '16px', position: 'relative', cursor: 'pointer',
      border: '1px solid #e2e8f0',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'all 0.3s ease',
      '&:hover': { boxShadow: '0 8px 20px rgba(0,0,0,0.08)', borderColor: '#cbd5e1' },
      mb: 2, overflow: 'visible'
    }}
    onClick={onClick}
  >
    <Box sx={{
      width: { xs: '120px', sm: '180px' }, height: { xs: '120px', sm: '180px' },
      flexShrink: 0, p: 1,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#ffffff', borderRadius: '16px 0 0 16px', position: 'relative'
    }}>
      <Box
        component="img"
        src={product.imagen ? `${IMAGE_BASE_URL}${ product.imagen }` : 'https://placehold.co/400x400/ffffff/94a3b8?text=Sin+Imagen'}
        alt={product.nombre}
        sx={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '12px' }}
      />
    </Box>

    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 2 }, pb: { xs: '12px !important', sm: '16px !important' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#1e293b', lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: { xs: '0.9rem', sm: '1.1rem' }, pr: 3 }}>
          {product.nombre}
        </Typography>
        <IconButton
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          sx={{ position: 'absolute', top: 4, right: 4, padding: '4px' }}
        >
          {isFavorite ? <FavoriteIcon sx={{ color: '#ef4444', fontSize: '1.3rem' }} /> : <FavoriteBorderIcon sx={{ color: '#94a3b8', fontSize: '1.3rem' }} />}
        </IconButton>
      </Box>

      <Typography variant="caption" sx={{ color: '#64748b', mt: 0.5, mb: 1, display: 'block' }}>
        Envío disponible
      </Typography>

      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1 }}>
        <Box>
          <Typography variant="h6" fontWeight="800" sx={{ color: '#d32f2f', lineHeight: 1, fontSize: { xs: '1.1rem', sm: '1.4rem' } }}>
            Gs. {Number(product.precio).toLocaleString('es-PY')}
          </Typography>
        </Box>
        
        <Button
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          variant="contained"
          startIcon={<AddShoppingCartOutlinedIcon />}
          sx={{
            backgroundColor: '#1e293b', color: '#fff', 
            borderRadius: '50px', textTransform: 'none', fontWeight: 600,
            fontSize: '0.85rem', px: 2, py: 0.5,
            width: { xs: '100%', sm: 'auto' },
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#334155', boxShadow: 'none' }
          }}
        >
          Añadir al carrito
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export default function ProductosFavoritos() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedUser, setSavedUser] = useState(localStorage.getItem('animal_haus_user'));
  const { addToCart } = useCart() || { addToCart: () => { } };
  const { favorites, toggleFavorite } = useFavorite() || { favorites: {}, toggleFavorite: () => { } };

  const API_URL = API_BASE_URL;

  useEffect(() => {
    const handleAuthChange = () => {
      setSavedUser(localStorage.getItem('animal_haus_user'));
    };
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  useEffect(() => {
    if (!savedUser) {
      setFavoriteProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const user = JSON.parse(savedUser);
    const userId = user.uuid || user.id || user.id_usuario;

    fetch(`${API_URL}/getFavoriteProducts.php?usuario_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) {
          setFavoriteProducts(data.products);
        } else {
          setFavoriteProducts([]);
        }
      })
      .catch(err => console.error("Error fetching favorite products:", err))
      .finally(() => setLoading(false));
  }, [API_URL, savedUser]);

  const handleProductClick = (id) => {
    window.history.pushState({}, '', `${import.meta.env.BASE_URL.replace(/\/$/, '')}/producto?id=${id}`);
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('popstate'));
  };

  if (!savedUser) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', mb: 2 }}>Mis Favoritos</Typography>
        <Typography variant="body1" sx={{ color: '#64748b', mb: 4 }}>Inicia sesión para ver tus productos favoritos guardados.</Typography>
        <Button 
          variant="contained" 
          onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal', { detail: { mode: 'login' } }))}
          sx={{ backgroundColor: '#ff9800', '&:hover': { backgroundColor: '#f57c00' }, borderRadius: '50px', px: 4 }}
        >
          Iniciar Sesión
        </Button>
      </Container>
    );
  }

  // Filter out products that have been unfavorited in the current session
  const displayProducts = favoriteProducts.filter(p => favorites[p.id]);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: '#f3efe6', minHeight: '100vh', pt: { xs: 2, md: 4 }, pb: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#1e293b', letterSpacing: '-0.02em', mb: 1 }}>
            Mis Favoritos
          </Typography>
        </Box>

        {loading ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: '#64748b' }}>Cargando favoritos...</Typography>
        ) : displayProducts.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {displayProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                isFavorite={!!favorites[prod.id]}
                onToggleFavorite={() => toggleFavorite(prod.id)}
                onClick={() => handleProductClick(prod.id)}
                onAddToCart={() => addToCart(prod, 1)}
              />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 10, backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
            <SadIcon sx={{ fontSize: 80, color: '#cbd5e1', mb: 2 }} />
            <Typography variant="h5" fontWeight="700" sx={{ color: '#475569', mb: 1 }}>Aún no tienes favoritos</Typography>
            <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4 }}>Explora nuestro catálogo y guarda los artículos que más te gusten.</Typography>
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
        )}
      </Container>
    </Box>
  );
}
