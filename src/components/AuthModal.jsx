import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Link,
  useMediaQuery,
  useTheme,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import logo from '../assets/animalhause.png';

export default function AuthModal({ open, onClose, initialMode = 'login', onLoginSuccess }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'recover'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: ''
  });

  // Reset form when modal opens/closes or mode changes
  React.useEffect(() => {
    setMode(initialMode);
    setFormData({
      email: '',
      password: '',
      nombre: '',
      apellido: '',
      telefono: ''
    });
    setShowPassword(false);
    setErrorMsg('');
    setSuccessMsg('');
  }, [open, initialMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
    if (successMsg) setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (mode === 'login') {
      try {
        const response = await fetch('http://localhost/rjs_animal_haus/api/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          setErrorMsg(result.error || 'Error al iniciar sesión.');
          return;
        }
        
        onLoginSuccess(result.user);
      } catch (err) {
        console.error('Error durante login:', err);
        setErrorMsg('No se pudo conectar con el servidor. Verifica que XAMPP esté encendido.');
      }
    } else if (mode === 'recover') {
      try {
        const response = await fetch('http://localhost/rjs_animal_haus/api/recover_password.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          setErrorMsg(result.error || 'Error al intentar recuperar la contraseña.');
          return;
        }
        
        setSuccessMsg(result.message || 'Se ha enviado una nueva contraseña a tu correo.');
        setFormData(prev => ({ ...prev, password: '' }));
      } catch (err) {
        console.error('Error durante recuperación:', err);
        setErrorMsg('No se pudo conectar con el servidor.');
      }
    } else {
      // Registro
      const payload = {
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellido: formData.apellido,
        telefono: formData.telefono
      };
      
      try {
        const response = await fetch('http://localhost/rjs_animal_haus/api/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        
        if (response.status === 409) {
          setErrorMsg('El correo electrónico ingresado ya posee una cuenta registrada en nuestro sistema.');
          return;
        } else if (!response.ok) {
          setErrorMsg(result.error || 'Ocurrió un error al intentar registrar el usuario.');
          return;
        }
        
        onLoginSuccess();
      } catch (err) {
        console.error('Error durante registro:', err);
        setErrorMsg('No se pudo conectar con el servidor. Verifica que tu base de datos esté encendida.');
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullScreen={fullScreen}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: fullScreen ? 0 : '16px' }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, pb: 0 }}>
        <Box />
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent sx={{ px: { xs: 3, sm: 4 }, pb: 4, pt: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <img src={logo} alt="Animal Haus" style={{ height: '50px', marginBottom: '16px' }} />
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Nunito', sans-serif", color: '#000', letterSpacing: '-0.5px' }}>
            {mode === 'login' ? 'Iniciar Sesión' : mode === 'register' ? 'Crear Cuenta' : 'Recuperar Contraseña'}
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {errorMsg && (
            <Alert severity="error" sx={{ borderRadius: '12px', fontWeight: 500 }}>
              {errorMsg}
            </Alert>
          )}
          {successMsg && (
            <Alert severity="success" sx={{ borderRadius: '12px', fontWeight: 500 }}>
              {successMsg}
            </Alert>
          )}

          {mode === 'register' && (
            <>
              <TextField
                label="Nombre"
                name="nombre"
                variant="outlined"
                fullWidth
                required
                value={formData.nombre}
                onChange={handleChange}
              />
              <TextField
                label="Apellido"
                name="apellido"
                variant="outlined"
                fullWidth
                required
                value={formData.apellido}
                onChange={handleChange}
              />
              <TextField
                label="Teléfono"
                name="telefono"
                variant="outlined"
                fullWidth
                required
                value={formData.telefono}
                onChange={handleChange}
              />
            </>
          )}

          <TextField
            label="Correo Electrónico (Email)"
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
          />
          
          {mode !== 'recover' && (
            <FormControl variant="outlined" fullWidth required>
              <InputLabel htmlFor="outlined-adornment-password">Contraseña</InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Contraseña"
              />
            </FormControl>
          )}

          {mode === 'login' && errorMsg && errorMsg.toLowerCase().includes('contraseña') && (
            <Box sx={{ textAlign: 'right', mt: -1 }}>
              <Link 
                component="button" 
                type="button"
                variant="body2" 
                onClick={() => setMode('recover')}
                sx={{ color: '#d32f2f', fontWeight: 'bold', textDecoration: 'none' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
          )}

          <Button 
            type="submit"
            variant="contained" 
            fullWidth 
            size="large"
            sx={{ mt: 1, mb: 1, textTransform: 'none', borderRadius: '50px', bgcolor: 'var(--accent)', fontWeight: 'bold' }}
          >
            {mode === 'login' ? 'Ingresar' : mode === 'register' ? 'Registrarme' : 'Recuperar'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 1 }}>
            {mode === 'login' ? (
              <Typography variant="body2" color="text.secondary">
                ¿No tienes cuenta?{' '}
                <Link 
                  component="button" 
                  type="button"
                  variant="body2" 
                  onClick={() => setMode('register')}
                  sx={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none' }}
                >
                  Regístrate
                </Link>
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {mode === 'recover' ? '¿Recordaste tu contraseña? ' : '¿Ya tienes cuenta? '}
                <Link 
                  component="button" 
                  type="button"
                  variant="body2" 
                  onClick={() => setMode('login')}
                  sx={{ color: 'var(--accent)', fontWeight: 'bold', textDecoration: 'none' }}
                >
                  Inicia Sesión
                </Link>
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
