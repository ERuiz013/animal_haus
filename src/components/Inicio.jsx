import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Link,
  IconButton,
  Skeleton,
  Fab,
  Snackbar,
  Alert,
  Avatar,
  TextField,
  Tooltip,
  Chip,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import PetsIcon from '@mui/icons-material/PetsOutlined';
import { PiCow, PiHorse } from 'react-icons/pi';
import { LuTurtle, LuRabbit, LuBird, LuRat, LuFish, LuPiggyBank, LuCat, LuDog } from 'react-icons/lu';
import LocalShippingIcon from '@mui/icons-material/LocalShippingOutlined';
import SecurityIcon from '@mui/icons-material/SecurityOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneIcon from '@mui/icons-material/PhoneOutlined';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTimeOutlined';
import SupportAgentIcon from '@mui/icons-material/SupportAgentOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useCart } from '../context/CartContext';
import { useFavorite } from '../context/FavoriteContext';

const features = [
  {
    title: 'Envíos a todo el país',
    description: 'Seguridad y Rapidez en cada entrega',
    icon: <LocalShippingIcon sx={{ fontSize: 32, color: '#ff9800' }} />
  },
  {
    title: 'Productos Premium',
    description: 'La mejor calidad garantizada',
    icon: <PetsIcon sx={{ fontSize: 32, color: '#ff9800' }} />
  },
  {
    title: 'Compra Segura',
    description: 'Pagos 100% protegidos',
    icon: <SecurityIcon sx={{ fontSize: 32, color: '#ff9800' }} />
  },
  {
    title: 'Atención Personalizada',
    description: 'Te asesoramos en cada paso',
    icon: <SupportAgentIcon sx={{ fontSize: 32, color: '#ff9800' }} />
  }
];

const categories = [
  { title: 'Conejos', image: 'https://loremflickr.com/200/200/rabbit,pet' },
  { title: 'Rumiantes', image: 'https://loremflickr.com/200/200/cow,farm' },
  { title: 'Perro', image: 'https://loremflickr.com/200/200/dog,puppy' },
  { title: 'Gato', image: 'https://loremflickr.com/200/200/cat,kitten' },
  { title: 'Aves', image: 'https://loremflickr.com/200/200/bird,pet' },
  { title: 'Hamsters', image: 'https://loremflickr.com/200/200/hamster,pet' },
  { title: 'Aves Exóticas', image: 'https://loremflickr.com/200/200/parrot,macaw' },
  { title: 'Cerdos', image: 'https://loremflickr.com/200/200/piglet,farm' },
  { title: 'Tortugas', image: 'https://loremflickr.com/200/200/turtle,pet' },
  { title: 'Peces', image: 'https://loremflickr.com/200/200/aquarium,fish' },
  { title: 'Vacunas', image: 'https://loremflickr.com/200/200/veterinary,syringe' },
  { title: 'Repuestos', image: 'https://loremflickr.com/200/200/pet,accessories' },
];

const FadeInSection = ({ children, delay = 0 }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const currentRef = domRef.current;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (currentRef) observer.unobserve(currentRef);
        }
      });
    }, { threshold: 0.1 });

    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <Box
      ref={domRef}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform'
      }}
    >
      {children}
    </Box>
  );
};

const heroBackgrounds = [
  '/farm_hero.png',
  '/farm_hero_2.jpg'
];

const getAnimalIcon = (animalName) => {
  const name = animalName.toLowerCase();
  const iconProps = { size: 50, color: '#f59e0b', style: { marginBottom: '16px', display: 'block', margin: '0 auto' } };

  if (name.includes('ave') || name.includes('pájaro') || name.includes('exótica') || name.includes('codorni')) return <LuBird {...iconProps} />;
  if (name.includes('gato') || name.includes('felino')) return <LuCat {...iconProps} />;
  if (name.includes('perro') || name.includes('canino')) return <LuDog {...iconProps} />;
  if (name.includes('cerdo')) return <LuPiggyBank {...iconProps} />;
  if (name.includes('cobayo') || name.includes('roedor') || name.includes('hámster') || name.includes('chinchilla') || name.includes('ratón')) return <LuRat {...iconProps} />;
  if (name.includes('pez') || name.includes('peces') || name.includes('acuario')) return <LuFish {...iconProps} />;
  if (name.includes('conejo')) return <LuRabbit {...iconProps} />;
  if (name.includes('tortuga') || name.includes('reptil') || name.includes('iguana')) return <LuTurtle {...iconProps} />;
  if (name.includes('vaca') || name.includes('ganado') || name.includes('toro') || name.includes('oveja') || name.includes('cabra') || name.includes('rumiante') || name.includes('ciervo')) return <PiCow {...iconProps} />;
  if (name.includes('caballo') || name.includes('equino')) return <PiHorse {...iconProps} />;

  return <PetsIcon sx={{ fontSize: 50, color: '#f59e0b', mb: 2 }} />;
};

const ProductCard = ({ product, isFavorite, onToggleFavorite, onClick, onAddToCart }) => (
  <Card
    sx={{
      borderRadius: '24px',
      overflow: 'visible',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: '#f8fafc',
      border: '1px solid #f1f5f9',
      cursor: 'pointer',
      position: 'relative',
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
        '&:hover': { backgroundColor: '#ffffff', transform: 'scale(1.1)' },
        transition: 'all 0.2s', zIndex: 2,
        padding: { xs: '4px', sm: '8px' }
      }}
    >
      {isFavorite ? <FavoriteIcon sx={{ color: '#ef4444', fontSize: { xs: '1rem', sm: '1.2rem' } }} /> : <FavoriteBorderIcon sx={{ color: '#94a3b8', fontSize: { xs: '1rem', sm: '1.2rem' } }} />}
    </IconButton>

    <Box sx={{ p: { xs: 1, sm: 2 }, pb: 0 }}>
      <Box sx={{
        height: { xs: 140, sm: 220 }, backgroundColor: '#ffffff', borderRadius: '16px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative'
      }}>
        <Box
          className="product-img" component="img"
          src={product.imagen ? `http://localhost/rjs_animal_haus/${product.imagen}` : 'https://placehold.co/400x400/ffffff/94a3b8?text=Sin+Imagen'}
          alt={product.nombre}
          sx={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain', transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </Box>
    </Box>

    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 3 }, pt: { xs: 1, sm: 2 } }}>
      <Typography variant="subtitle1" fontWeight="700" sx={{ color: '#0f172a', lineHeight: 1.4, mb: { xs: 1, sm: 2 }, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: { xs: '2.4em', sm: '2.8em' }, fontSize: { xs: '0.85rem', sm: '1.05rem' } }}>
        {product.nombre}
      </Typography>

      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
            Precio
          </Typography>
          <Typography variant="h6" fontWeight="900" sx={{ color: '#dc2626', lineHeight: 1, fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
            Gs. {Number(product.precio).toLocaleString('es-PY')}
          </Typography>
        </Box>
        <Fab
          size="small"
          onClick={(e) => { e.stopPropagation(); onAddToCart(); }}
          sx={{
            backgroundColor: '#1e293b', color: '#fff', boxShadow: '0 4px 12px rgba(30, 41, 59, 0.2)',
            '&:hover': { backgroundColor: '#334155', transform: 'scale(1.05)' },
            transition: 'all 0.2s',
            width: { xs: 32, sm: 48 },
            height: { xs: 32, sm: 48 },
            minHeight: 'unset'
          }}
        >
          <AddShoppingCartOutlinedIcon sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }} />
        </Fab>
      </Box>
    </CardContent>
  </Card>
);

const PromoCardContent = () => (
  <>
    <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 160, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))', mb: -2, zIndex: 2, position: 'relative' }} />
    <Box sx={{ textAlign: 'center', zIndex: 1, bgcolor: 'rgba(255,255,255,0.1)', p: 3, borderRadius: 3, backdropFilter: 'blur(10px)', width: '100%', border: '1px solid rgba(255,255,255,0.2)' }}>
      <Chip icon={<LocalOfferIcon sx={{ color: '#b45309 !important' }} />} label="¡OFERTAS!" sx={{ bgcolor: '#ffffff', color: '#b45309', fontWeight: 900, mb: 2, px: 1 }} />
      <br />
      <Paper elevation={0} sx={{ display: 'inline-block', bgcolor: '#dc2626', p: 1.5, borderRadius: 2, mb: 2, transform: 'rotate(-2deg)' }}>
        <Typography variant="h4" fontWeight="900" color="#ffffff" sx={{ textTransform: 'uppercase', lineHeight: 1, textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          DESCUENTO
        </Typography>
      </Paper>
      <Typography variant="h6" color="#fff" fontWeight="700" sx={{ mb: 3 }}>
        ¡SUPER PRECIOS!
      </Typography>
      <Button variant="contained" sx={{ bgcolor: '#ffffff', color: '#b45309', '&:hover': { bgcolor: '#fef3c7' }, borderRadius: '50px', px: 4, py: 1, fontWeight: 900, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
        Ver Rebajas
      </Button>
    </Box>
  </>
);

const Inicio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const itemsPerPage = isMobile ? 6 : 8;

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [empresaData, setEmpresaData] = useState(null);
  const [animales, setAnimales] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [animalProducts, setAnimalProducts] = useState([]);
  const [loadingAnimalProducts, setLoadingAnimalProducts] = useState(false);
  const [visibleAnimalProducts, setVisibleAnimalProducts] = useState(itemsPerPage);
  const [visibleFeaturedProducts, setVisibleFeaturedProducts] = useState(itemsPerPage);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const handleAnimalClick = (animal) => {
    if (selectedAnimal && selectedAnimal.id === animal.id) {
      setSelectedAnimal(null);
      setAnimalProducts([]);
      return;
    }

    setSelectedAnimal(animal);
    setLoadingAnimalProducts(true);
    setVisibleAnimalProducts(itemsPerPage);

    fetch(`http://localhost/rjs_animal_haus/api/getProductos.php?animal_id=${animal.id}`)
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
      .finally(() => setLoadingAnimalProducts(false));
  };
  const [loadingEmpresa, setLoadingEmpresa] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const { addToCart } = useCart() || { addToCart: () => { } };
  const { favorites, toggleFavorite } = useFavorite() || { favorites: {}, toggleFavorite: () => { } };

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBackgrounds.length);
    }, 5000);
    return () => clearInterval(bgInterval);
  }, []);

  useEffect(() => {
    fetch('http://localhost/rjs_animal_haus/api/getDestacados.php')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          setFeaturedProducts(data);
        }
      })
      .catch(err => {
        console.error("Error fetching featured products:", err);
        setSnackbarMessage("Error al cargar los productos destacados.");
        setSnackbarOpen(true);
      })
      .finally(() => setLoadingProducts(false));

    fetch('http://localhost/rjs_animal_haus/api/getEmpresas.php')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data) && data.length > 0) {
          setEmpresaData(data[0]);
        }
      })
      .catch(err => console.error("Error fetching empresa data:", err))
      .finally(() => setLoadingEmpresa(false));

    fetch('http://localhost/rjs_animal_haus/api/getAnimales.php')
      .then(res => res.json())
      .then(data => {
        if (!data.error && Array.isArray(data)) {
          setAnimales(data);
          const avesAnimal = data.find(a => a.nombre.toLowerCase().trim() === 'aves');
          if (avesAnimal) {
            handleAnimalClick(avesAnimal);
          } else if (data.length > 0) {
            handleAnimalClick(data[0]);
          }
        }
      })
      .catch(err => console.error("Error fetching animales:", err));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbarMessage(`Agregaste ${product.nombre} al carrito`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const handleProductClick = (id) => {
    window.history.pushState({}, '', `/producto?id=${id}`);
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <Box sx={{
      flexGrow: 1,
      backgroundColor: '#f3efe6', // Beige
      minHeight: '100vh',
      position: 'relative',
      color: '#0f172a'
    }}>
      {/* Hero Section (Opción 1 - Glassmorphism) */}
      <Box sx={{
        width: '100%', overflow: 'hidden', position: 'relative', minHeight: '75vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        bgcolor: '#fef3c7'
      }}>
        {/* Imagen de fondo sutil */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url("/pollito1.png")',
          backgroundSize: 'contain', backgroundPosition: 'calc(100% - 50px) center', backgroundRepeat: 'no-repeat',
          '&::after': { content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.85) 45%, rgba(255,255,255,0.1) 100%)' }
        }} />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8}>
              <Box sx={{ maxWidth: 650 }}>
                <Typography variant="overline" sx={{ color: '#dc2626', fontWeight: 800, letterSpacing: 2, mb: 1, display: 'block' }}>ANIMAL HAUS</Typography>
                <Typography variant="h2" fontWeight="900" sx={{ color: '#1e293b', mb: 3, fontSize: { xs: '2.5rem', md: '3.8rem' }, lineHeight: 1.1 }}>
                  Todo lo que tu mascota necesita, <span style={{ color: '#f59e0b' }}>en un solo lugar.</span>
                </Typography>
                <Typography variant="h6" sx={{ color: '#475569', mb: 5, fontWeight: 500, lineHeight: 1.6 }}>
                  Únete a la familia Animal Haus. Alimentos premium, accesorios y mucho más, con el cariño que ellos merecen.
                </Typography>
                <Button variant="contained" endIcon={<ArrowForwardIcon />} size="large" onClick={() => { document.getElementById('productos-destacados')?.scrollIntoView({ behavior: 'smooth' }); }} sx={{ bgcolor: '#dc2626', color: '#ffffff', '&:hover': { bgcolor: '#b91c1c' }, borderRadius: '50px', px: 4, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1.2rem', boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)' }}>
                  Productos Destacados
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, pb: 3,
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(234, 88, 12, 0.25)',
                width: '100%',
                position: 'relative',
                // Transición por resoluciones para no tapar al pollito
                transform: 'none',
                transformOrigin: 'right center',
                transition: 'transform 0.2s ease-out',
                '@media (max-width: 1950px)': { transform: 'scale(0.9) translateX(-50px)' },
                '@media (max-width: 1920px)': { transform: 'scale(0.9) translateX(-60px)' },
                '@media (max-width: 1900px)': { transform: 'scale(0.9) translateX(-80px)' },
                '@media (max-width: 1850px)': { transform: 'scale(0.85) translateX(-110px)' },
                '@media (max-width: 1820px)': { transform: 'scale(0.8) translateX(-130px)' },
                '@media (max-width: 1800px)': { transform: 'scale(0.75) translateX(-150px)' },
                '@media (max-width: 1750px)': { transform: 'scale(0.75) translateX(-170px)' },
                '@media (max-width: 1700px)': { transform: 'scale(0.7) translateX(-200px)' },
                '@media (max-width: 1650px)': { transform: 'scale(0.65) translateX(-250px)' },
                '@media (max-width: 1600px)': { transform: 'scale(0.60) translateX(-300px)' },
                '@media (max-width: 1550px)': { transform: 'scale(0.60) translateX(-280px)' },
                '@media (max-width: 1500px)': { transform: 'scale(0.50) translateX(-400px)' },
                '@media (max-width: 1450px)': { transform: 'scale(0.60) translateX(-240px)' },
                '@media (max-width: 1400px)': { transform: 'scale(0.55) translateX(-260px)' },
                '@media (max-width: 1350px)': { transform: 'scale(0.50) translateX(-280px)' },
                '@media (max-width: 1300px)': { transform: 'scale(0.45) translateX(-300px)' },
                '@media (max-width: 1250px)': { transform: 'scale(0.40) translateX(-320px)' },
                '@media (max-width: 1100px)': { transform: 'scale(0.50) translateX(-280px)' }
              }}>
                <PromoCardContent />
              </Box>
            </Grid>
          </Grid>
        </Container>
        {/* Barra inferior */}
        <Box sx={{ position: { xs: 'relative', md: 'absolute' }, bottom: 0, left: 0, right: 0, backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255,255,255,0.4)', py: 2.5, mt: { xs: 4, md: 0 } }}>
          <Container maxWidth="lg">
            <Grid container spacing={2} justifyContent="space-between">
              {[
                { icon: <LocalShippingIcon sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Envíos Rápidos', sub: 'A todo el país' },
                { icon: <PetsIcon sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Calidad Premium', sub: 'Mejores marcas' },
                { icon: <SecurityIcon sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Compra Segura', sub: 'Pagos protegidos' },
                { icon: <SupportAgentIcon sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Atención Personal', sub: 'Asesoría experta' },
              ].map((item, i) => (
                <Grid item xs={12} sm={3} key={i}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#1e293b' }}>
                    {item.icon}
                    <Box><Typography variant="subtitle2" fontWeight="800">{item.title}</Typography><Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>{item.sub}</Typography></Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>
        {/* Features Section - Card Centrado */}
        <FadeInSection delay={0.1}>
          <Box sx={{ mt: 6, mb: 12, position: 'relative', zIndex: 10, maxWidth: '1100px', mx: 'auto', display: 'none' /* Oculto porque el Hero nuevo ya incluye los beneficios abajo */ }}>
            <Card
              elevation={4}
              sx={{
                borderRadius: '24px',
                py: { xs: 4, md: 6 },
                px: { xs: 3, md: 6 },
                backgroundColor: '#ffffff',
                boxShadow: '0px 10px 30px rgba(0,0,0,0.08)'
              }}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: { xs: 4, md: 2 }
              }}>
                {features.map((feature, index) => (
                  <Box key={index} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    flex: 1,
                    minWidth: { xs: '100%', sm: '45%', md: '22%' }
                  }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="subtitle1" fontWeight="700" gutterBottom sx={{ color: '#1e293b' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                      {feature.description}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Card>
          </Box>
        </FadeInSection>



      </Container>

      {/* Promo Card Mobile (Ubicado fuera del Hero, encima de Categorías) */}
      <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center', width: '100%', position: 'relative', zIndex: 20 }}>
        <Box sx={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4, pb: 3,
          background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
          borderRadius: 0,
          boxShadow: '0 20px 40px rgba(234, 88, 12, 0.25)',
          width: '100%',
          position: 'relative'
        }}>
          <PromoCardContent />
        </Box>
      </Box>

      {/* Main Content Background Wrapper */}
      <Box sx={{ bgcolor: 'transparent', pt: 0, pb: 12 }}>
        {/* Categorías Superpuestas (Opción 3 de TestHero) */}
        <FadeInSection delay={0.15}>
          <Box sx={{ mb: 12, mt: 0 }}>
            <Box sx={{ width: '100%', position: 'relative', pb: 10 }}>
              <Box sx={{
                overflow: 'hidden', position: 'relative', minHeight: 450, display: 'flex', flexDirection: 'column', pt: 6,
                boxShadow: '0 20px 40px rgba(220, 38, 38, 0.15)', bgcolor: '#dc2626'
              }}>
                <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'stretch' }, justifyContent: 'space-between', flexGrow: 1 }}>
                  <Box sx={{ flex: 1, color: '#fff', pr: { xs: 0, md: 4 }, pb: { xs: 4, md: 10 }, textAlign: { xs: 'center', md: 'left' }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h2" fontWeight="900" sx={{ mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.2)', fontSize: { xs: '2.5rem', md: '3.75rem' }, mt: { xs: 4, md: 0 } }}>
                      Lo mejor para tus animales.
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#fef08a', fontWeight: 500, fontSize: { xs: '1rem', md: '1.25rem' }, px: { xs: 2, md: 0 } }}>
                      Hecho con amor. Selecciona la categoría de tu mascota y empieza a explorar.
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', width: '100%' }}>
                    <Box component="img" src="/pollito3.png" sx={{ width: '100%', maxWidth: { xs: 240, md: 360 }, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))', display: 'block' }} />
                  </Box>
                </Container>
              </Box>

              <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, mt: { xs: -4, md: -8 }, px: { xs: 1, md: 3 } }}>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  {/* Flecha Izquierda */}
                  <IconButton
                    onClick={() => handleScroll('left')}
                    sx={{
                      display: 'flex', position: 'absolute', left: { xs: -10, md: -25 }, zIndex: 10,
                      bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.5)',
                      width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 },
                      '&:hover': { bgcolor: '#ffffff', transform: 'scale(1.1)' }, transition: 'all 0.2s'
                    }}
                  >
                    <ChevronLeftIcon fontSize="large" sx={{ color: '#dc2626' }} />
                  </IconButton>

                  {/* Contenedor scrolleable */}
                  <Box
                    ref={scrollRef}
                    sx={{
                      display: 'flex', gap: { xs: 2, md: 3 }, overflowX: 'auto', px: { xs: 1, md: 2 }, py: 2, width: '100%', scrollBehavior: 'smooth',
                      '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none'
                    }}
                  >
                    {animales.map((animal) => (
                      <Box key={animal.id} sx={{ minWidth: { xs: 150, sm: 200, md: 240 }, flexShrink: 0 }}>
                        <Box
                          onClick={() => handleAnimalClick(animal)}
                          sx={{
                            bgcolor: selectedAnimal?.id === animal.id ? '#fef3c7' : '#ffffff',
                            borderRadius: 4, p: { xs: 2, md: 4 }, textAlign: 'center',
                            border: selectedAnimal?.id === animal.id ? '2px solid #dc2626' : '2px solid #fef08a',
                            boxShadow: selectedAnimal?.id === animal.id ? '0 20px 40px -5px rgba(220,38,38,0.2)' : '0 10px 20px -5px rgba(0,0,0,0.1)',
                            cursor: 'pointer', height: '100%',
                            transform: selectedAnimal?.id === animal.id ? 'translateY(-10px)' : 'none',
                            transition: 'all 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#dc2626', boxShadow: '0 20px 40px -5px rgba(220,38,38,0.2)' }
                          }}>
                          {getAnimalIcon(animal.nombre)}
                          <Typography variant="h5" fontWeight="800" color="#1e293b" sx={{ textTransform: 'capitalize' }}>
                            {animal.nombre}
                          </Typography>
                          <Typography variant="body2" color="#64748b" fontWeight="600" sx={{ mt: 1 }}>Ver productos →</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Flecha Derecha */}
                  <IconButton
                    onClick={() => handleScroll('right')}
                    sx={{
                      display: 'flex', position: 'absolute', right: { xs: -10, md: -25 }, zIndex: 10,
                      bgcolor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)', border: '1px solid rgba(255,255,255,0.5)',
                      width: { xs: 48, md: 64 }, height: { xs: 48, md: 64 },
                      '&:hover': { bgcolor: '#ffffff', transform: 'scale(1.1)' }, transition: 'all 0.2s'
                    }}
                  >
                    <ChevronRightIcon fontSize="large" sx={{ color: '#dc2626' }} />
                  </IconButton>
                </Box>
              </Container>

              {/* Products for selected animal */}
              {selectedAnimal && (
                <Container maxWidth="lg" sx={{ mt: 6, pb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 5 }}>
                    <Box sx={{ height: 2, width: 40, bgcolor: '#dc2626', borderRadius: 2 }} />
                    <Typography variant="h3" fontWeight="900" sx={{ color: '#1e293b', textAlign: 'center', letterSpacing: '-0.02em', fontSize: { xs: '2rem', sm: '3rem' } }}>
                      Productos para {selectedAnimal.nombre}
                    </Typography>
                    <Box sx={{ height: 2, width: 40, bgcolor: '#dc2626', borderRadius: 2 }} />
                  </Box>

                  {loadingAnimalProducts ? (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, sm: 4 } }}>
                      {Array.from(new Array(4)).map((_, index) => (
                        <Card key={index} sx={{ borderRadius: '16px', boxShadow: 'none', display: 'flex', flexDirection: 'column', width: '100%' }}>
                          <Skeleton variant="rectangular" height={220} />
                          <CardContent sx={{ px: 2 }}>
                            <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                            <Skeleton variant="rectangular" height={40} />
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  ) : animalProducts.length > 0 ? (
                    <>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: { xs: 2, sm: 4 } }}>
                        {animalProducts.slice(0, visibleAnimalProducts).map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            isFavorite={favorites?.[product.id]}
                            onToggleFavorite={() => toggleFavorite(product.id)}
                            onClick={() => handleProductClick(product.id)}
                            onAddToCart={() => handleAddToCart(product)}
                          />
                        ))}
                      </Box>

                      {visibleAnimalProducts < animalProducts.length && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => setVisibleAnimalProducts(prev => prev + itemsPerPage)}
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
                            Ver más productos
                          </Button>
                        </Box>
                      )}
                    </>
                  ) : (
                    <Alert severity="info" sx={{ mx: 'auto', maxWidth: 600 }}>
                      No hay productos disponibles para esta categoría en este momento.
                    </Alert>
                  )}
                </Container>
              )}

            </Box>
          </Box>
        </FadeInSection>

        <Container maxWidth="xl" sx={{ px: { xs: 2, md: 4 } }}>

          {/* Featured Products */}
          <FadeInSection delay={0.2}>
            <Box id="productos-destacados" sx={{ scrollMarginTop: '100px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
                <Box sx={{ height: 2, width: 40, bgcolor: '#f59e0b', borderRadius: 2 }} />
                <Typography variant="h3" fontWeight="900" align="center" sx={{ color: '#1e293b', letterSpacing: '-0.02em', fontSize: { xs: '2rem', sm: '3rem' } }}>
                  Productos Destacados
                </Typography>
                <Box sx={{ height: 2, width: 40, bgcolor: '#f59e0b', borderRadius: 2 }} />
              </Box>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 8, fontWeight: 500 }}>
                Lo más vendido y recomendado por nuestros expertos
              </Typography>

              <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                  gap: { xs: 2, sm: 4 }
                }}>
                  {loadingProducts ? (
                    Array.from(new Array(8)).map((_, index) => (
                      <Card key={index} sx={{ borderRadius: '0', boxShadow: 'none', display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <Skeleton variant="rectangular" height={280} />
                        <CardContent sx={{ px: 0 }}>
                          <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                          <Skeleton variant="text" height={24} width="60%" sx={{ mb: 2 }} />
                          <Skeleton variant="rectangular" height={40} />
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    featuredProducts.slice(0, visibleFeaturedProducts).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={favorites?.[product.id]}
                        onToggleFavorite={() => toggleFavorite(product.id)}
                        onClick={() => handleProductClick(product.id)}
                        onAddToCart={() => handleAddToCart(product)}
                      />
                    ))
                  )}
                </Box>
                
                {!loadingProducts && visibleFeaturedProducts < featuredProducts.length && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => setVisibleFeaturedProducts(prev => prev + itemsPerPage)}
                      sx={{
                        color: '#ea580c',
                        borderColor: '#ea580c',
                        borderRadius: '50px',
                        px: 5,
                        py: 1.5,
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '1rem',
                        '&:hover': {
                          bgcolor: '#ea580c',
                          color: '#ffffff'
                        }
                      }}
                    >
                      Ver más productos
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </FadeInSection>
        </Container>
      </Box>

      {/* Wave Separator with Paw Pattern (Using CSS Mask) */}
      <Box sx={{
        width: '100%',
        height: '100px',
        mb: -1,
        backgroundColor: '#d32f2f',
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cg transform='translate(10, 20) scale(1.5)'%3E%3Cpath d='M10 16c-3 0-6-2-6-5 0-3 2-4 6-5 4 1 6 2 6 5 0 3-3 5-6 5z'/%3E%3Ccircle cx='4' cy='5' r='3'/%3E%3Ccircle cx='9' cy='2' r='3'/%3E%3Ccircle cx='15' cy='5' r='3'/%3E%3C/g%3E%3Cg transform='translate(60, 40) scale(1.2)'%3E%3Cpath d='M10 20 l0 -10 l-6 -6 l1 -1 l5 6 l0 -6 l2 0 l0 6 l5 -6 l1 1 l-6 6 l0 10 z'/%3E%3C/g%3E%3Cg transform='translate(30, 70) scale(1) rotate(-30)'%3E%3Cpath d='M10 16c-3 0-6-2-6-5 0-3 2-4 6-5 4 1 6 2 6 5 0 3-3 5-6 5z'/%3E%3Ccircle cx='4' cy='5' r='3'/%3E%3Ccircle cx='9' cy='2' r='3'/%3E%3Ccircle cx='15' cy='5' r='3'/%3E%3C/g%3E%3Cg transform='translate(70, 80) scale(1.2) rotate(15)'%3E%3Cpath d='M4 14 c-2-5 0-10 4-12 c1 0 1 1 1 2 l0 10 z M16 14 c2-5 0-10-4-12 c-1 0-1 1-1 2 l0 10 z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' fill='black'/%3E%3C/svg%3E")`,
        maskSize: '100% 100%',
        maskRepeat: 'no-repeat',
        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1440 320' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z' fill='black'/%3E%3C/svg%3E")`,
        WebkitMaskSize: '100% 100%',
        WebkitMaskRepeat: 'no-repeat',
      }} />

      {/* Footer with Animal Pattern */}
      <Box sx={{
        backgroundColor: '#d32f2f',
        color: '#f8fafc',
        pt: 6,
        pb: 4,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.15'%3E%3Cg transform='translate(10, 20) scale(1.5)'%3E%3Cpath d='M10 16c-3 0-6-2-6-5 0-3 2-4 6-5 4 1 6 2 6 5 0 3-3 5-6 5z'/%3E%3Ccircle cx='4' cy='5' r='3'/%3E%3Ccircle cx='9' cy='2' r='3'/%3E%3Ccircle cx='15' cy='5' r='3'/%3E%3C/g%3E%3Cg transform='translate(60, 40) scale(1.2)'%3E%3Cpath d='M10 20 l0 -10 l-6 -6 l1 -1 l5 6 l0 -6 l2 0 l0 6 l5 -6 l1 1 l-6 6 l0 10 z'/%3E%3C/g%3E%3Cg transform='translate(30, 70) scale(1) rotate(-30)'%3E%3Cpath d='M10 16c-3 0-6-2-6-5 0-3 2-4 6-5 4 1 6 2 6 5 0 3-3 5-6 5z'/%3E%3Ccircle cx='4' cy='5' r='3'/%3E%3Ccircle cx='9' cy='2' r='3'/%3E%3Ccircle cx='15' cy='5' r='3'/%3E%3C/g%3E%3Cg transform='translate(70, 80) scale(1.2) rotate(15)'%3E%3Cpath d='M4 14 c-2-5 0-10 4-12 c1 0 1 1 1 2 l0 10 z M16 14 c2-5 0-10-4-12 c-1 0-1 1-1 2 l0 10 z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={{ xs: 2, sm: 4 }}>
            <Grid item xs={6} sm={6} md={3}>
              <Typography variant="h6" fontWeight="700" sx={{ mb: { xs: 2, sm: 3 }, letterSpacing: '0.05em', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                ANIMAL HAUS
              </Typography>
              <Typography variant="body2" sx={{ color: '#f8fafc', mb: 4, lineHeight: 1.6, maxWidth: '300px', fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Tu tienda de confianza para el cuidado y bienestar de tus mascotas. Ofrecemos alimentos premium y accesorios de calidad.
              </Typography>
            </Grid>

            <Grid item xs={6} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: { xs: 2, sm: 3 }, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                Contacto
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <LocationOnIcon fontSize="small" sx={{ color: '#ffffff', mt: 0.2 }} />
                  <Box sx={{ color: '#ffffff', lineHeight: 1.6 }}>
                    {loadingEmpresa ? (
                      <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    ) : empresaData?.direcion ? (
                      <Link href={empresaData.direcion.startsWith('http') ? empresaData.direcion : `https://maps.google.com/?q=${encodeURIComponent(empresaData.direcion)}`} target="_blank" rel="noopener noreferrer" sx={{ color: '#f8fafc', fontSize: '0.85rem', display: 'inline-block', mt: 0.5, '&:hover': { color: '#ffffff' } }}>
                        Ver ubicación en Google Maps
                      </Link>
                    ) : (
                      <Typography variant="body2">
                        Av. Mariscal López esq. San Martín<br />
                        Asunción, Paraguay
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <PhoneIcon fontSize="small" sx={{ color: '#ffffff' }} />
                  {loadingEmpresa ? (
                    <Skeleton variant="text" width={120} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {empresaData?.telefono || '+595 981 123 456'}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <EmailIcon fontSize="small" sx={{ color: '#ffffff' }} />
                  {loadingEmpresa ? (
                    <Skeleton variant="text" width={180} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                  ) : (
                    <Typography variant="body2" sx={{ color: '#ffffff' }}>
                      {empresaData?.email || 'contacto@animalhaus.com.py'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: { xs: 2, sm: 3 }, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                Horario
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: '#ffffff' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>Lunes a Viernes:</span><br />
                    {loadingEmpresa ? (
                      <Skeleton variant="text" width={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    ) : empresaData?.horario_abierto_entre_semana && empresaData?.horario_cerrado_entre_semana
                      ? `${empresaData.horario_abierto_entre_semana.substring(0, 5)} hs - ${empresaData.horario_cerrado_entre_semana.substring(0, 5)} hs`
                      : '08:00 hs - 18:00 hs'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <AccessTimeIcon fontSize="small" sx={{ color: 'transparent' }} />
                  <Typography variant="body2" sx={{ color: '#ffffff' }}>
                    <span style={{ color: '#ffffff', fontWeight: 600 }}>Sábados:</span><br />
                    {loadingEmpresa ? (
                      <Skeleton variant="text" width={100} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                    ) : empresaData?.horario_abierto_fin_semana && empresaData?.horario_cerrado_fin_semana
                      ? `${empresaData.horario_abierto_fin_semana.substring(0, 5)} hs - ${empresaData.horario_cerrado_fin_semana.substring(0, 5)} hs`
                      : '08:00 hs - 13:00 hs'}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6} sm={6} md={3}>
              <Typography variant="subtitle2" fontWeight="600" sx={{ mb: { xs: 2, sm: 3 }, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: { xs: '0.85rem', sm: '0.875rem' } }}>
                Ubicación
              </Typography>
              {loadingEmpresa ? (
                <Skeleton variant="rectangular" width="100%" height={200} sx={{ borderRadius: '12px', bgcolor: 'rgba(255,255,255,0.1)' }} />
              ) : empresaData?.direcion ? (
                empresaData.direcion.includes('<iframe')
                  ? <Box sx={{ '& iframe': { width: '100%', height: '200px', borderRadius: '12px', border: 'none' } }} dangerouslySetInnerHTML={{ __html: empresaData.direcion }} />
                  : (
                    <Box sx={{ width: '100%', height: '200px', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.02)' } }}>
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(empresaData.direcion.startsWith('http') ? (empresaData.nombre + ' Paraguay' || 'Tienda de mascotas Paraguay') : empresaData.direcion)}&t=&z=15&ie=UTF8&output=embed`}
                        allowFullScreen
                      />
                    </Box>
                  )
              ) : (
                <Box sx={{ width: '100%', height: '200px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Mapa no disponible</Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mt: 8, mb: 4 }} />

          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" sx={{ color: '#f8fafc' }}>
              &copy; {new Date().getFullYear()} Animal Haus. Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link href="#" underline="none" sx={{ color: '#f8fafc', '&:hover': { color: '#ffffff' }, fontSize: '0.75rem' }}>
                Términos y Condiciones
              </Link>
              <Link href="#" underline="none" sx={{ color: '#f8fafc', '&:hover': { color: '#ffffff' }, fontSize: '0.75rem' }}>
                Política de Privacidad
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Floating WhatsApp Button */}
      <Tooltip title="Contáctanos por WhatsApp" placement="left">
        <Fab
          color="success"
          aria-label="whatsapp"
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            backgroundColor: '#25D366',
            '&:hover': { backgroundColor: '#128C7E' },
            width: 56,
            height: 56,
            zIndex: 1000,
            boxShadow: '0 10px 15px -3px rgba(37, 211, 102, 0.3)'
          }}
          onClick={() => {
            const phone = '595971957205';
            const message = encodeURIComponent('¡Hola! Vengo desde la página web de Animal Haus y me gustaría hacer una consulta.');
            window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
          }}
        >
          <WhatsAppIcon sx={{ fontSize: 32, color: 'white' }} />
        </Fab>
      </Tooltip>

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
    </Box>
  );
};

export default Inicio;
