import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    Link,
    IconButton,
    InputAdornment
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import '../App.css';
import logo from '../assets/animalhause.png';

export default function Login() {
    const [credentials, setCredentials] = useState({ user: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (e) => {
        e.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Intento de login con:', credentials);
        // Aquí iría tu lógica de autenticación
    };

    return (
        <Box className="login-wrapper">
            <Container component="main" maxWidth="xs">
                <Card elevation={6} className="login-card">
                    <CardContent className="login-card-content">

                        <img className="login-logo" src={logo} alt="Logo Animal Haus" />

                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            gutterBottom
                            fontWeight="800"
                            className="login-title"
                        >
                            Bienvenido
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit} noValidate className="login-form">
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="user"
                                label="Usuario"
                                name="user"
                                autoComplete="user"
                                autoFocus
                                value={credentials.user}
                                onChange={handleChange}
                                className="login-textfield"
                            />

                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Contraseña"
                                id="password"
                                autoComplete="current-password"
                                type={showPassword ? 'text' : 'password'}
                                value={credentials.password}
                                onChange={handleChange}
                                className="login-textfield login-textfield-mb"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="alternar visibilidad de contraseña"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                className="login-button"
                            >
                                Iniciar Sesión
                            </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}