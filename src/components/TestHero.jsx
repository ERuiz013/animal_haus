import React from 'react';
import { Box, Typography, Button, Container, Grid, Paper, Chip, InputBase } from '@mui/material';
import { Search as SearchIcon, LocalShipping, Shield, SupportAgent, Pets, ArrowForward, LocalOffer, Percent } from '@mui/icons-material';

export default function TestHero() {
  return (
    <Box sx={{ width: '100%', pb: 10, bgcolor: '#fffbf2' }}>
      
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#ffffff', borderBottom: '1px solid #ffedd5', mb: 5 }}>
        <Typography variant="h3" fontWeight="800" color="#c2410c" gutterBottom>
          Propuestas Finales - Animal Haus
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Basado en tus elecciones: Opción 1, Opción 2 (con pollito3.png), Opción 3, y Diseños de Ofertas (con pollito2.png).
          <br/>
          <strong>Recuerda tener todas las imágenes nombradas correctamente en tu carpeta <code>public</code>.</strong>
        </Typography>
      </Box>

      {/* =========================================================================
          OPCIÓN 1: GLASSMORPHISM CLÁSICO (Se mantiene)
      ========================================================================= */}
      <Box sx={{ px: 4, mb: 12 }}>
        <Typography variant="h4" fontWeight="800" color="#ea580c" sx={{ mb: 4, textAlign: 'center' }}>
          Opción 1: Glassmorphism Clásico
        </Typography>

        <Box sx={{ 
          maxWidth: 1400, mx: 'auto', borderRadius: 4, overflow: 'hidden', position: 'relative', minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
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
            <Box sx={{ maxWidth: 650 }}>
              <Typography variant="overline" sx={{ color: '#dc2626', fontWeight: 800, letterSpacing: 2, mb: 1, display: 'block' }}>ANIMAL HAUS</Typography>
              <Typography variant="h2" fontWeight="900" sx={{ color: '#1e293b', mb: 3, fontSize: { xs: '2.5rem', md: '3.8rem' }, lineHeight: 1.1 }}>
                Todo lo que tu mascota necesita, <span style={{ color: '#f59e0b'}}>en un solo lugar.</span>
              </Typography>
              <Typography variant="h6" sx={{ color: '#475569', mb: 5, fontWeight: 500, lineHeight: 1.6 }}>
                Únete a la familia Animal Haus. Alimentos premium, accesorios y mucho más, con el cariño que ellos merecen.
              </Typography>
              <Button variant="contained" endIcon={<ArrowForward />} size="large" onClick={() => { document.getElementById('productos-destacados')?.scrollIntoView({ behavior: 'smooth' }); }} sx={{ bgcolor: '#dc2626', color: '#ffffff', '&:hover': { bgcolor: '#b91c1c' }, borderRadius: '50px', px: 4, py: 1.5, fontWeight: 700, textTransform: 'none', fontSize: '1.2rem', boxShadow: '0 8px 20px rgba(220, 38, 38, 0.4)' }}>
                Explorar Catálogo
              </Button>
            </Box>
          </Container>
          {/* Barra inferior */}
          <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, backdropFilter: 'blur(12px)', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderTop: '1px solid rgba(255,255,255,0.4)', py: 2.5 }}>
            <Container maxWidth="lg">
              <Grid container spacing={2} justifyContent="space-between">
                {[
                  { icon: <LocalShipping sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Envíos Rápidos', sub: 'A todo el país' },
                  { icon: <Pets sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Calidad Premium', sub: 'Mejores marcas' },
                  { icon: <Shield sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Compra Segura', sub: 'Pagos protegidos' },
                  { icon: <SupportAgent sx={{ fontSize: 32, color: '#f59e0b' }} />, title: 'Atención Personal', sub: 'Asesoría experta' },
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
      </Box>

      {/* =========================================================================
          OPCIÓN 2: GLASSMORPHISM FLOTANTE CENTRAL (Con pollito3.png)
      ========================================================================= */}
      <Box sx={{ px: 4, mb: 12 }}>
        <Typography variant="h4" fontWeight="800" color="#ea580c" sx={{ mb: 4, textAlign: 'center' }}>
          Opción 2: Buscador Central Flotante
        </Typography>
        <Box sx={{ 
          maxWidth: 1400, mx: 'auto', borderRadius: 4, overflow: 'hidden', position: 'relative', minHeight: 650, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fef9c3', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          {/* Fondo sutil (patrón o gradiente para que resalte la caja central) */}
          <Box sx={{ 
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'radial-gradient(circle at center, #fef3c7 0%, #fffbeb 100%)',
          }} />
          
          <Box sx={{ 
            position: 'relative', zIndex: 1, 
            backdropFilter: 'blur(16px)', backgroundColor: 'rgba(255, 255, 255, 0.8)', 
            border: '2px solid #fde047', borderRadius: 6, p: { xs: 4, md: 8 }, 
            maxWidth: 800, width: '90%', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(250, 204, 21, 0.4)'
          }}>
            {/* AQUÍ ESTÁ EL POLLITO 3 */}
            <Box component="img" src="/pollito3.png" sx={{ height: 160, mb: 3, filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.15))', transform: 'scale(1.1)' }} />
            
            <Typography variant="h2" fontWeight="900" sx={{ color: '#1e293b', mb: 2 }}>
              ¿Qué está buscando tu <span style={{ color: '#dc2626' }}>mejor amigo?</span>
            </Typography>
            <Typography variant="h6" sx={{ color: '#475569', mb: 5 }}>
              Encuentra los mejores productos, alimentos y accesorios al instante.
            </Typography>
            
            <Paper elevation={0} sx={{ display: 'flex', alignItems: 'center', width: '100%', borderRadius: '50px', p: '8px 8px 8px 24px', bgcolor: '#ffffff', border: '1px solid #fde047', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
              <SearchIcon sx={{ color: '#f59e0b', mr: 1, fontSize: 28 }} />
              <InputBase sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }} placeholder="Busca croquetas, juguetes, collares..." />
              <Button variant="contained" size="large" sx={{ borderRadius: '50px', bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' }, px: 4, py: 1.5, fontWeight: 800, textTransform: 'none' }}>
                Buscar
              </Button>
            </Paper>
          </Box>
        </Box>
      </Box>

      {/* =========================================================================
          OPCIÓN 3: CATEGORÍAS SUPERPUESTAS
      ========================================================================= */}
      <Box sx={{ px: 4, mb: 12 }}>
        <Typography variant="h4" fontWeight="800" color="#ea580c" sx={{ mb: 4, textAlign: 'center' }}>
          Opción 3: Categorías Superpuestas
        </Typography>

        <Box sx={{ maxWidth: 1400, mx: 'auto', position: 'relative', pb: 10 }}>
          <Box sx={{ 
            borderRadius: 4, overflow: 'hidden', position: 'relative', minHeight: 450, display: 'flex', flexDirection: 'column', pt: 6,
            boxShadow: '0 20px 40px rgba(220, 38, 38, 0.15)', bgcolor: '#dc2626'
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', flexGrow: 1 }}>
              <Box sx={{ flex: 1, color: '#fff', pr: 4, pb: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h2" fontWeight="900" sx={{ mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  Lo mejor para tu mejor amigo.
                </Typography>
                <Typography variant="h6" sx={{ color: '#fef08a', fontWeight: 500 }}>
                  Hecho con amor. Selecciona la categoría de tu mascota y empieza a explorar.
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Box component="img" src="/pollito3.png" sx={{ width: '100%', maxWidth: 360, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))', display: 'block' }} />
              </Box>
            </Container>
          </Box>
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, mt: -8 }}>
            <Grid container spacing={3} justifyContent="center">
              {['Perros', 'Gatos', 'Aves', 'Pequeños'].map((cat, i) => (
                <Grid item xs={6} md={3} key={i}>
                  <Box sx={{ 
                    bgcolor: '#ffffff', borderRadius: 4, p: 4, textAlign: 'center', border: '2px solid #fef08a',
                    boxShadow: '0 15px 30px -5px rgba(0,0,0,0.1)', cursor: 'pointer',
                    transition: 'all 0.3s', '&:hover': { transform: 'translateY(-10px)', borderColor: '#dc2626', boxShadow: '0 20px 40px -5px rgba(220,38,38,0.2)' }
                  }}>
                    <Pets sx={{ fontSize: 50, color: '#f59e0b', mb: 2 }} />
                    <Typography variant="h5" fontWeight="800" color="#1e293b">{cat}</Typography>
                    <Typography variant="body2" color="#64748b" fontWeight="600" sx={{ mt: 1 }}>Ver productos →</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* =========================================================================
          NUEVAS PROPUESTAS: OFERTAS (CON POLLITO 2)
      ========================================================================= */}
      <Box sx={{ px: 4, mb: 12 }}>
        <Typography variant="h4" fontWeight="800" color="#ea580c" sx={{ mb: 4, textAlign: 'center' }}>
          Diseños de Ofertas (Usando pollito2.png)
        </Typography>

        {/* Oferta A: Banner Extendido */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo A: Banner Promocional</Typography>
          <Box sx={{ 
            maxWidth: 1400, mx: 'auto', borderRadius: 4, overflow: 'hidden', background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)', position: 'relative', display: 'flex', alignItems: 'center', boxShadow: '0 20px 40px rgba(234, 88, 12, 0.3)', pt: { xs: 4, md: 0 }
          }}>
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
              <Grid container alignItems="center">
                <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                  {/* El pollito 2 (corazón o similar) a la izquierda */}
                  <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 350, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))', mt: { md: 6 } }} />
                </Grid>
                <Grid item xs={12} md={7} sx={{ py: 6, pl: { md: 2 }, textAlign: { xs: 'center', md: 'left' } }}>
                  <Chip icon={<LocalOffer />} label="¡OFERTAS QUE ENAMORAN!" sx={{ bgcolor: '#ffffff', color: '#ea580c', fontWeight: 900, mb: 2, px: 2, fontSize: '1.1rem', py: 2.5, borderRadius: '8px' }} />
                  
                  <Paper elevation={0} sx={{ display: 'inline-block', bgcolor: '#dc2626', p: 2, borderRadius: 2, mb: 3, transform: 'rotate(-2deg)' }}>
                    <Typography variant="h1" fontWeight="900" color="#ffffff" sx={{ textTransform: 'uppercase', lineHeight: 1, fontSize: { xs: '3rem', md: '5.5rem' }, textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
                      DESCUENTO
                    </Typography>
                  </Paper>
                  
                  <Typography variant="h4" color="#fff" fontWeight="700" sx={{ mb: 4 }}>
                    Hasta 30% en Alimentos Seleccionados
                  </Typography>
                  <Button variant="contained" size="large" sx={{ bgcolor: '#ffffff', color: '#ea580c', '&:hover': { bgcolor: '#ffedd5', transform: 'translateY(-2px)' }, borderRadius: '50px', px: 6, py: 2, fontWeight: 900, fontSize: '1.3rem', boxShadow: '0 10px 20px rgba(0,0,0,0.2)', transition: 'all 0.3s' }}>
                    Ver Productos en Rebaja
                  </Button>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>

        {/* Oferta B: Tarjeta Centrada con Placa de Descuento */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo B: Tarjeta Promocional Centrada</Typography>
          <Box sx={{ 
            maxWidth: 1200, mx: 'auto', borderRadius: 4, overflow: 'hidden', bgcolor: '#ffffff', border: '2px solid #fef08a', display: 'flex', alignItems: 'center', boxShadow: '0 15px 30px rgba(0,0,0,0.08)', position: 'relative'
          }}>
            <Grid container>
              <Grid item xs={12} md={5} sx={{ bgcolor: '#fffbf2', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', pt: 4, position: 'relative', borderRight: '2px dashed #fde047' }}>
                {/* Pollito 2 */}
                <Box component="img" src="/pollito2.png" sx={{ width: '90%', maxWidth: 300, filter: 'drop-shadow(0 15px 20px rgba(0,0,0,0.15))' }} />
              </Grid>
              <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h3" fontWeight="900" color="#1e293b">
                    Gran
                  </Typography>
                  <Box sx={{ bgcolor: '#dc2626', color: '#fff', px: 2, py: 0.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Percent sx={{ fontSize: 32 }} />
                    <Typography variant="h3" fontWeight="900">DESCUENTO</Typography>
                  </Box>
                </Box>
                <Typography variant="h5" color="#f59e0b" fontWeight="800" sx={{ mb: 3 }}>
                  ¡Por tiempo limitado!
                </Typography>
                <Typography variant="h6" color="#64748b" sx={{ mb: 5, fontWeight: 500 }}>
                  Con mucho amor para tus mascotas. Obtén un 20% de descuento usando el código al finalizar tu compra.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ border: '2px dashed #cbd5e1', bgcolor: '#f8fafc', borderRadius: 2, px: 3, py: 1.5, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="900" color="#0f172a" letterSpacing={2}>
                      ANIMAL20
                    </Typography>
                  </Box>
                  <Button variant="contained" size="large" sx={{ bgcolor: '#ea580c', '&:hover': { bgcolor: '#c2410c' }, borderRadius: 2, px: 5, fontWeight: 800 }}>
                    Usar Código
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Oferta C: Diseño Flotante Asimétrico */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo C: Bloque Moderno Superpuesto</Typography>
          <Box sx={{ 
            maxWidth: 1400, mx: 'auto', borderRadius: 4, bgcolor: '#fef3c7', minHeight: 400, display: 'flex', alignItems: 'center', position: 'relative', p: { xs: 4, md: 8 }
          }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7} sx={{ zIndex: 2 }}>
                <Typography variant="h2" fontWeight="900" color="#1e293b" sx={{ mb: 2, lineHeight: 1.2 }}>
                  ¡Descubre nuestro <br/>
                  <span style={{ color: '#dc2626', backgroundColor: '#ffffff', padding: '0 10px', borderRadius: '8px' }}>Súper Descuento!</span>
                </Typography>
                <Typography variant="h6" color="#92400e" sx={{ mb: 4, maxWidth: 500 }}>
                  Encuentra los mejores precios en las marcas favoritas de tu mascota. Aprobado con mucho cariño por nuestro pollito experto.
                </Typography>
                <Button variant="contained" size="large" sx={{ bgcolor: '#1e293b', color: '#ffffff', '&:hover': { bgcolor: '#0f172a' }, borderRadius: '50px', px: 5, py: 1.5, fontWeight: 700, fontSize: '1.1rem' }}>
                  Ir a las Ofertas
                </Button>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: '20%', left: '-10%', transform: 'translateY(-50%)', bgcolor: '#dc2626', color: '#fff', p: 3, borderRadius: '50%', width: 120, height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(220,38,38,0.3)', zIndex: 3 }}>
                  <Typography variant="h5" fontWeight="900" lineHeight={1}>-40%</Typography>
                  <Typography variant="caption" fontWeight="700">HOY</Typography>
                </Box>
                {/* Pollito 2 */}
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 350, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))', zIndex: 1 }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* =========================================================================
            NUEVOS 10 EJEMPLOS BASADOS EN A Y C
        ========================================================================= */}
        <Typography variant="h4" fontWeight="800" color="#ea580c" sx={{ mb: 4, mt: 12, textAlign: 'center' }}>
          10 Ejemplos Adicionales (Basados en A y C)
        </Typography>

        {/* Ejemplo 1: Dark Premium */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 1: Dark Premium (Inspirado en C)</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: '#0f172a', p: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <Box sx={{ position: 'absolute', top: '-50%', right: '-10%', width: '60%', height: '200%', background: 'radial-gradient(circle, rgba(234,88,12,0.2) 0%, rgba(15,23,42,0) 70%)' }} />
            <Grid container spacing={4} alignItems="center" position="relative" zIndex={1}>
              <Grid item xs={12} md={7}>
                <Chip label="SÚPER OFERTA" sx={{ bgcolor: '#dc2626', color: '#fff', fontWeight: 900, mb: 3 }} />
                <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2, lineHeight: 1.1 }}>Amor a <br/><span style={{ color: '#f59e0b' }}>primer descuento</span></Typography>
                <Typography variant="h6" color="#94a3b8" sx={{ mb: 4, maxWidth: 400 }}>Calidad premium para los reyes de la casa. Aprovecha hoy.</Typography>
                <Button variant="contained" sx={{ bgcolor: '#f59e0b', color: '#000', fontWeight: 800, px: 5, py: 1.5, borderRadius: 8, '&:hover': { bgcolor: '#d97706' } }}>Comprar Ahora</Button>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <Box sx={{ position: 'absolute', right: '10%', top: '10%', width: 90, height: 90, bgcolor: '#f59e0b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(15deg)', boxShadow: '0 10px 20px rgba(245,158,11,0.4)', zIndex: 2 }}>
                  <Typography variant="h5" fontWeight="900" color="#000">-50%</Typography>
                </Box>
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 320, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.6))', zIndex: 1 }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Ejemplo 2: Split Contrast */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 2: Split Contrast (Rojo y Crema)</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: '0 20px 40px rgba(220,38,38,0.15)' }}>
            <Box sx={{ flex: 1, bgcolor: '#dc2626', p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2 }}>Festival de<br/>Ofertas</Typography>
              <Typography variant="h6" color="#fef08a" sx={{ mb: 4 }}>Consiente a tu mascota con los mejores productos.</Typography>
              <Box>
                <Button variant="outlined" sx={{ color: '#fff', borderColor: '#fff', borderWidth: 2, borderRadius: 8, px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#fff', color: '#dc2626' } }}>Ver Catálogo</Button>
              </Box>
            </Box>
            <Box sx={{ flex: 1, bgcolor: '#fef3c7', p: { xs: 4, md: 8 }, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <Paper elevation={4} sx={{ position: 'absolute', left: { md: '-40px' }, top: '20%', p: 2, borderRadius: 3, bgcolor: '#fff', zIndex: 2, transform: 'rotate(-5deg)' }}>
                <Typography fontWeight="900" color="#dc2626" variant="h6">¡Lleva 3 Paga 2!</Typography>
              </Paper>
              <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 300, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.15))' }} />
            </Box>
          </Box>
        </Box>

        {/* Ejemplo 3: Full Gradient impact */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 3: Impacto Naranja (Inspirado en A)</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, overflow: 'hidden', background: 'linear-gradient(90deg, #f97316 0%, #ea580c 100%)', position: 'relative', p: { xs: 4, md: 8 } }}>
            <Typography variant="h1" sx={{ position: 'absolute', top: -20, left: -20, fontSize: '12rem', fontWeight: 900, color: 'rgba(255,255,255,0.1)', userSelect: 'none' }}>SALE</Typography>
            <Grid container spacing={4} alignItems="center" position="relative" zIndex={1}>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 340, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }} />
              </Grid>
              <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2, textTransform: 'uppercase' }}>Descuentos<br/>Bestiales</Typography>
                <Typography variant="h5" color="#ffedd5" sx={{ mb: 4, fontWeight: 500 }}>Solo por este fin de semana.</Typography>
                <Button variant="contained" sx={{ bgcolor: '#fff', color: '#ea580c', px: 6, py: 2, borderRadius: 2, fontWeight: 900, fontSize: '1.2rem', '&:hover': { bgcolor: '#fef3c7' } }}>Descubrir</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Ejemplo 4: Floating Glassmorphism */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 4: Floating Glassmorphism</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, bgcolor: '#fef08a', position: 'relative', p: { xs: 4, md: 8 }, overflow: 'hidden', minHeight: 450, display: 'flex', alignItems: 'center' }}>
            <Box component="img" src="/pollito2.png" sx={{ position: 'absolute', right: '5%', bottom: '-10%', width: '50%', maxWidth: 400, opacity: 0.9 }} />
            <Box sx={{ position: 'relative', zIndex: 2, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', p: { xs: 4, md: 6 }, borderRadius: 4, maxWidth: 600, border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
              <Chip label="NUEVO" sx={{ bgcolor: '#ea580c', color: '#fff', fontWeight: 800, mb: 2 }} />
              <Typography variant="h3" color="#1e293b" fontWeight="900" sx={{ mb: 2 }}>Precios que dan ganas de saltar.</Typography>
              <Typography variant="h6" color="#64748b" sx={{ mb: 4 }}>Encuentra rebajas exclusivas en accesorios.</Typography>
              <Button variant="contained" sx={{ bgcolor: '#dc2626', color: '#fff', borderRadius: 8, px: 4, py: 1.5, fontWeight: 700 }}>Ver Ofertas</Button>
            </Box>
          </Box>
        </Box>

        {/* Ejemplo 5: Centered Pop */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 5: Centered Pop</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: 'linear-gradient(180deg, #fef3c7 0%, #fde047 100%)', pt: 8, px: 4, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <Typography variant="h2" color="#b45309" fontWeight="900" sx={{ mb: 2 }}>El mes de tu Mascota</Typography>
            <Typography variant="h6" color="#92400e" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>Todo lo que necesitas con hasta 40% de descuento. ¡No lo dejes pasar!</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6 }}>
               <Button variant="contained" sx={{ bgcolor: '#ea580c', color: '#fff', px: 4, py: 1.5, borderRadius: 2, fontWeight: 700 }}>Comprar</Button>
            </Box>
            <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 350, mx: 'auto', display: 'block', mb: -4, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.2))' }} />
          </Box>
        </Box>

        {/* Ejemplo 6: Diagonal Cut */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 6: Diagonal Cut</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, overflow: 'hidden', position: 'relative', minHeight: 400, bgcolor: '#fef3c7' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(110deg, #dc2626 60%, transparent 60.1%)' }} />
            <Grid container sx={{ height: '100%', minHeight: 400 }} position="relative" zIndex={1}>
              <Grid item xs={12} md={7} sx={{ p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2 }}>Corte de<br/>Precios</Typography>
                <Typography variant="h6" color="#fca5a5" sx={{ mb: 4 }}>Literalmente partimos los precios a la mitad.</Typography>
                <Box><Button variant="contained" sx={{ bgcolor: '#fff', color: '#dc2626', borderRadius: '50px', px: 4, fontWeight: 800 }}>Aprovechar 50%</Button></Box>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 280, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Ejemplo 7: Vibrant Pink/Orange Neon */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 7: Vibrant Neon</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: 'linear-gradient(45deg, #f43f5e 0%, #f97316 100%)', p: { xs: 4, md: 6 }, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(244,63,94,0.3)' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)', zIndex: 0 }} />
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 300, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }} />
              </Grid>
              <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2, letterSpacing: '-1px' }}>Días de Locura</Typography>
                <Typography variant="h5" color="#ffe4e6" sx={{ mb: 4, fontWeight: 600 }}>Todo para ellos, a precios que no volverán.</Typography>
                <Button variant="contained" sx={{ bgcolor: '#fff', color: '#f43f5e', borderRadius: 8, px: 5, py: 1.5, fontWeight: 900, fontSize: '1.1rem' }}>Me Vuelvo Loco</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Ejemplo 8: Clean Minimal Ribbon */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 8: Clean Minimal Ribbon</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', p: 0, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ width: { md: '30%' }, bgcolor: '#ea580c', p: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <Typography variant="h3" color="#fff" fontWeight="900" sx={{ writingMode: { md: 'vertical-rl' }, transform: { md: 'rotate(180deg)' }, textAlign: 'center', m: 0 }}>
                 OFERTA FLASH
               </Typography>
            </Box>
            <Box sx={{ width: { md: '70%' }, p: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center' }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h3" color="#0f172a" fontWeight="900" sx={{ mb: 2 }}>Llegó el momento.</Typography>
                  <Typography variant="h6" color="#64748b" sx={{ mb: 4 }}>Hasta agotar stock en marcas seleccionadas.</Typography>
                  <Button variant="outlined" sx={{ color: '#ea580c', borderColor: '#ea580c', borderWidth: 2, borderRadius: 8, px: 4, fontWeight: 700 }}>Ver Selección</Button>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 200 }} />
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>

        {/* Ejemplo 9: Multiple Badges */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 9: Multiple Badges</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, bgcolor: '#ffffff', border: '2px dashed #fcd34d', p: { xs: 4, md: 6 }, display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h2" color="#1e293b" fontWeight="900" sx={{ mb: 3 }}>Elige tu <span style={{ color: '#dc2626'}}>Descuento</span></Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                  <Paper elevation={2} sx={{ p: 2, bgcolor: '#fee2e2', borderRadius: 2 }}><Typography variant="h5" color="#dc2626" fontWeight="900">-20%</Typography><Typography variant="caption" color="#dc2626">Alimentos</Typography></Paper>
                  <Paper elevation={2} sx={{ p: 2, bgcolor: '#fef3c7', borderRadius: 2 }}><Typography variant="h5" color="#d97706" fontWeight="900">2x1</Typography><Typography variant="caption" color="#d97706">Juguetes</Typography></Paper>
                  <Paper elevation={2} sx={{ p: 2, bgcolor: '#e0e7ff', borderRadius: 2 }}><Typography variant="h5" color="#4338ca" fontWeight="900">Envío 0</Typography><Typography variant="caption" color="#4338ca">En Capital</Typography></Paper>
                </Box>
                <Button variant="contained" sx={{ bgcolor: '#1e293b', color: '#fff', px: 5, py: 1.5, borderRadius: 2, fontWeight: 700 }}>Aplicar Promos</Button>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 320, filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.1))' }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Ejemplo 10: Elegant Gold & Red */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 10: Elegant Gold & Red</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)', p: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Patrón de fondo */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, backgroundImage: 'radial-gradient(#fcd34d 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <Grid container spacing={4} alignItems="center" position="relative" zIndex={1}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', order: { xs: 2, md: 1 } }}>
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 300, filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.8))' }} />
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'center', md: 'left' }, order: { xs: 1, md: 2 } }}>
                <Typography variant="overline" sx={{ color: '#fcd34d', letterSpacing: 3, fontWeight: 700, fontSize: '1rem' }}>EDICIÓN LIMITADA</Typography>
                <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2, mt: 1 }}>Premium<br/>Week</Typography>
                <Typography variant="h6" color="#fef3c7" sx={{ mb: 4, opacity: 0.9 }}>Un evento exclusivo para consentir a tu mejor amigo con lo mejor del mercado.</Typography>
                <Button variant="contained" sx={{ bgcolor: '#fcd34d', color: '#450a0a', px: 6, py: 1.5, borderRadius: '0px', fontWeight: 900, '&:hover': { bgcolor: '#fde68a' } }}>ENTRAR</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* =========================================================================
            NUEVOS 5 EJEMPLOS PREMIUM (Inspirados en 1 y 3)
        ========================================================================= */}
        <Typography variant="h4" fontWeight="800" color="#ea580c" sx={{ mb: 4, mt: 12, textAlign: 'center' }}>
          5 Ejemplos Premium (Dark & High Impact)
        </Typography>

        {/* Ejemplo 11: Dark Impact + Watermark */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 11: Dark Impact + Watermark</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: '#0f172a', p: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <Typography variant="h1" sx={{ position: 'absolute', bottom: -40, left: 20, fontSize: '14rem', fontWeight: 900, color: 'rgba(255,255,255,0.02)', userSelect: 'none', lineHeight: 1 }}>SALE</Typography>
            <Grid container spacing={4} alignItems="center" position="relative" zIndex={1}>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 350, filter: 'drop-shadow(0 20px 30px rgba(245,158,11,0.2))' }} />
              </Grid>
              <Grid item xs={12} md={7} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="overline" sx={{ color: '#f59e0b', letterSpacing: 3, fontWeight: 800, fontSize: '1rem' }}>SÓLO POR HOY</Typography>
                <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2, mt: 1 }}>Descuento<br/><span style={{ color: '#f59e0b' }}>Nocturno</span></Typography>
                <Typography variant="h6" color="#94a3b8" sx={{ mb: 4, maxWidth: 500 }}>No dejes que tu mascota se quede sin su regalo. Encuentra todo lo necesario en nuestra tienda exclusiva.</Typography>
                <Button variant="contained" sx={{ bgcolor: '#f59e0b', color: '#0f172a', px: 5, py: 1.5, borderRadius: 2, fontWeight: 900, fontSize: '1.1rem', '&:hover': { bgcolor: '#d97706' } }}>Comprar Ya</Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Ejemplo 12: Vibrant Split (Dark + Orange) */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 12: Vibrant Split</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, boxShadow: '0 20px 40px rgba(234,88,12,0.2)' }}>
            <Box sx={{ flex: 1, bgcolor: '#0f172a', p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2 }}>La Noche de<br/><span style={{ color: '#f59e0b' }}>las Patitas</span></Typography>
              <Typography variant="h6" color="#94a3b8" sx={{ mb: 4 }}>Ofertas increíbles que brillan en la oscuridad.</Typography>
            </Box>
            <Box sx={{ flex: 1, background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', p: { xs: 4, md: 8 }, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <Box component="img" src="/pollito2.png" sx={{ position: { md: 'absolute' }, left: { md: '-150px' }, width: '100%', maxWidth: 350, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))' }} />
              <Box sx={{ position: 'absolute', top: 20, right: 20, bgcolor: '#ffffff', color: '#ea580c', fontWeight: 900, px: 2, py: 1, borderRadius: 2 }}>-30%</Box>
            </Box>
          </Box>
        </Box>

        {/* Ejemplo 13: Neon Outline Card */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 13: Neon Outline</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: '#020617', border: '1px solid rgba(245,158,11,0.2)', p: { xs: 4, md: 8 }, position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 100px rgba(245,158,11,0.05), 0 0 20px rgba(245,158,11,0.1)' }}>
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)' }} />
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7} sx={{ zIndex: 2 }}>
                <Typography variant="h3" color="#fff" fontWeight="900" sx={{ mb: 2, display: 'inline-block', position: 'relative' }}>
                  Resplandece con<br/>
                  <span style={{ color: '#f59e0b', textShadow: '0 0 20px rgba(245,158,11,0.5)' }}>Descuentos</span>
                </Typography>
                <Typography variant="h6" color="#64748b" sx={{ mb: 4 }}>Dale a tu mejor amigo el brillo que merece con accesorios top.</Typography>
                <Button variant="outlined" sx={{ color: '#f59e0b', borderColor: '#f59e0b', borderRadius: 8, px: 5, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: 'rgba(245,158,11,0.1)' } }}>Explorar</Button>
              </Grid>
              <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <Box sx={{ position: 'absolute', width: 250, height: 250, background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', zIndex: 0 }} />
                <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 280, position: 'relative', zIndex: 1, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }} />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Ejemplo 14: Orange Canvas + Dark Glass Card */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 14: Orange Canvas + Dark Glass</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', p: { xs: 4, md: 8 }, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <Box component="img" src="/pollito2.png" sx={{ position: 'absolute', right: '5%', bottom: '-10%', width: '50%', maxWidth: 450, opacity: 0.9, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }} />
            <Box sx={{ position: 'relative', zIndex: 2, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(20px)', p: { xs: 4, md: 6 }, borderRadius: 4, maxWidth: 650, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <Chip label="EXCLUSIVO VIP" sx={{ bgcolor: '#f59e0b', color: '#000', fontWeight: 900, mb: 3 }} />
              <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2 }}>Poder <span style={{ color: '#f59e0b' }}>Naranja</span></Typography>
              <Typography variant="h6" color="#cbd5e1" sx={{ mb: 4 }}>Disfruta la potencia de nuestras ofertas exclusivas, diseñadas especialmente para los reyes del hogar.</Typography>
              <Button variant="contained" sx={{ bgcolor: '#fff', color: '#ea580c', borderRadius: 2, px: 5, py: 1.5, fontWeight: 900 }}>Activar Promoción</Button>
            </Box>
          </Box>
        </Box>

        {/* Ejemplo 15: Intense Radial Focus */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="subtitle1" fontWeight="700" color="#475569" sx={{ mb: 2 }}>Ejemplo 15: Intense Radial Focus</Typography>
          <Box sx={{ maxWidth: 1400, mx: 'auto', borderRadius: 4, background: 'radial-gradient(circle at center, #7c2d12 0%, #0f172a 100%)', p: { xs: 4, md: 8 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative', overflow: 'hidden', border: '1px solid #450a0a' }}>
            <Box component="img" src="/pollito2.png" sx={{ width: '100%', maxWidth: 220, filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.8))', mb: 3, position: 'relative', zIndex: 2 }} />
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography variant="h2" color="#fff" fontWeight="900" sx={{ mb: 2 }}>Foco en tu <span style={{ color: '#f97316' }}>Mascota</span></Typography>
              <Typography variant="h6" color="#94a3b8" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>Ellos son el centro de atención. Por eso, hemos bajado nuestros precios hasta un 40% este fin de semana.</Typography>
              <Button variant="contained" sx={{ bgcolor: '#f97316', color: '#fff', px: 6, py: 1.5, borderRadius: 8, fontWeight: 800, '&:hover': { bgcolor: '#ea580c' } }}>Ir al Centro de Ofertas</Button>
            </Box>
          </Box>
        </Box>

      </Box>

    </Box>
  );
}
