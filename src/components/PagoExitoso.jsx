import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Container, Fade, Grow } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HomeIcon from '@mui/icons-material/Home';

const PagoExitoso = () => {
    const [hash, setHash] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlHash = urlParams.get('hash');
        if (urlHash) {
            setHash(urlHash);
        }
    }, []);

    const handleGoToOrders = () => {
        // Redirigir a mis-pedidos y disparar el evento de navegación de la SPA
        window.history.pushState({}, '', '/mis-pedidos');
        window.dispatchEvent(new Event('popstate'));
    };

    const handleGoHome = () => {
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
    };

    return (
        <Box sx={{ 
            minHeight: '80vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            p: 3
        }}>
            <Container maxWidth="sm">
                <Fade in={true} timeout={800}>
                    <Paper elevation={0} sx={{
                        p: { xs: 4, md: 6 },
                        borderRadius: 4,
                        textAlign: 'center',
                        backgroundColor: '#ffffff',
                        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.05)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* Decorative background element */}
                        <Box sx={{
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: 'radial-gradient(circle, rgba(196,164,132,0.1) 0%, rgba(255,255,255,0) 70%)',
                            pointerEvents: 'none',
                            zIndex: 0
                        }} />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Grow in={true} timeout={1200}>
                                <CheckCircleIcon sx={{ 
                                    fontSize: 90, 
                                    color: '#10b981', // Emerald green
                                    mb: 3,
                                    filter: 'drop-shadow(0px 8px 16px rgba(16, 185, 129, 0.2))'
                                }} />
                            </Grow>

                            <Typography variant="h3" sx={{ 
                                fontWeight: 800, 
                                color: '#1e293b', 
                                mb: 2,
                                fontFamily: "'Nunito', sans-serif",
                                letterSpacing: '-0.5px'
                            }}>
                                ¡Pago Exitoso!
                            </Typography>

                            <Typography variant="body1" sx={{ 
                                color: '#64748b', 
                                mb: 4, 
                                fontSize: '1.1rem',
                                lineHeight: 1.6
                            }}>
                                Tu pago ha sido procesado correctamente. Gracias por confiar en nosotros, tu pedido ya está siendo preparado.
                            </Typography>

                            {hash && (
                                <Box sx={{ mb: 4, p: 2, backgroundColor: '#f1f5f9', borderRadius: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>
                                        Código de transacción
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#475569', fontFamily: 'monospace', mt: 0.5, wordBreak: 'break-all' }}>
                                        {hash}
                                    </Typography>
                                </Box>
                            )}

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleGoToOrders}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        backgroundColor: '#c4a484',
                                        color: '#ffffff',
                                        fontWeight: 700,
                                        py: 1.5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontSize: '1.05rem',
                                        boxShadow: '0 8px 20px -6px rgba(196, 164, 132, 0.6)',
                                        '&:hover': {
                                            backgroundColor: '#a88a6c',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 12px 24px -8px rgba(196, 164, 132, 0.8)',
                                        },
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    Ver mis pedidos
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={handleGoHome}
                                    startIcon={<HomeIcon />}
                                    sx={{
                                        color: '#64748b',
                                        borderColor: '#e2e8f0',
                                        fontWeight: 600,
                                        py: 1.5,
                                        borderRadius: 3,
                                        textTransform: 'none',
                                        fontSize: '1.05rem',
                                        '&:hover': {
                                            backgroundColor: '#f8fafc',
                                            borderColor: '#cbd5e1'
                                        }
                                    }}
                                >
                                    Volver a la tienda
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default PagoExitoso;
