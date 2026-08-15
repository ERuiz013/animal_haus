import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';

const InicioAdmin = () => {
    return (
        <Box sx={{
            flexGrow: 1,
            background: '#f5f5f5',
            minHeight: '100vh',
            py: 4
        }}>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#000000' }}>
                        Pedidos
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Bienvenido al sistema de administración de Animal Haus.
                        Utiliza el menú superior para gestionar categorías, productos, pedidos y clientes.
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
};

export default InicioAdmin;
