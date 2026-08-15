import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  useMediaQuery,
  useTheme,
  Alert,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { Close as CloseIcon, Visibility, VisibilityOff } from '@mui/icons-material';

export default function ChangePasswordModal({ open, onClose, userData }) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setErrorMsg('');
    setSuccessMsg('');
  }, [open]);

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

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMsg('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!userData || !userData.uuid) {
      setErrorMsg('No se pudo identificar al usuario. Intenta iniciar sesión de nuevo.');
      return;
    }

    try {
      const response = await fetch('http://localhost/rjs_animal_haus/api/change_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: userData.uuid,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        setErrorMsg(result.error || 'Error al intentar cambiar la contraseña.');
        return;
      }
      
      setSuccessMsg(result.message || 'Tu contraseña ha sido cambiada exitosamente.');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Optionally close modal after a delay
      setTimeout(() => {
        onClose();
      }, 2500);

    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setErrorMsg('No se pudo conectar con el servidor.');
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
          <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Nunito', sans-serif", color: '#000', letterSpacing: '-0.5px' }}>
            Cambiar Contraseña
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

          {/* Current Password */}
          <FormControl variant="outlined" fullWidth required>
            <InputLabel htmlFor="current-password">Contraseña Actual</InputLabel>
            <OutlinedInput
              id="current-password"
              name="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Contraseña Actual"
            />
          </FormControl>

          {/* New Password */}
          <FormControl variant="outlined" fullWidth required>
            <InputLabel htmlFor="new-password">Nueva Contraseña</InputLabel>
            <OutlinedInput
              id="new-password"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Nueva Contraseña"
            />
          </FormControl>

          {/* Confirm New Password */}
          <FormControl variant="outlined" fullWidth required>
            <InputLabel htmlFor="confirm-password">Confirmar Nueva Contraseña</InputLabel>
            <OutlinedInput
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirmar Nueva Contraseña"
            />
          </FormControl>

          <Button 
            type="submit"
            variant="contained" 
            fullWidth 
            size="large"
            sx={{ mt: 1, mb: 1, textTransform: 'none', borderRadius: '50px', bgcolor: 'var(--accent, #d32f2f)', fontWeight: 'bold' }}
          >
            Guardar Cambios
          </Button>

        </Box>
      </DialogContent>
    </Dialog>
  );
}
