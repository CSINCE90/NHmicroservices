import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { foodService } from '../services/foodService';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
  Divider,
  Chip,
  Grid,
} from '@mui/material';
import { ArrowBack, Delete, Whatshot, FitnessCenter, Grain, WaterDrop } from '@mui/icons-material';

const DeleteFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await foodService.getFood(id);
        setFood(data);
      } catch {
        enqueueSnackbar('Errore nel caricamento dell\'alimento', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, enqueueSnackbar]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await foodService.deleteFood(id);
      enqueueSnackbar('Alimento eliminato con successo', { variant: 'success' });
      navigate('/alimenti');
    } catch {
      enqueueSnackbar('Errore nell\'eliminazione dell\'alimento', { variant: 'error' });
      setDeleting(false);
    }
  };

  const formatMacro = (value, unit = 'g') => {
    if (value === null || value === undefined) return '0';
    return `${Number(value).toFixed(1)}${unit}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!food) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="error">
            Alimento non trovato
          </Typography>
        </Paper>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/alimenti')}>
          Torna agli Alimenti
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Conferma Eliminazione
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Sei sicuro di voler eliminare l'alimento:
        </Typography>

        <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            {food.name}
          </Typography>
          
          {/* Valori nutrizionali dell'alimento da eliminare */}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Whatshot sx={{ fontSize: 16, color: 'error.main' }} />
                <Typography variant="body2">
                  {formatMacro(food.calories, ' kcal')}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FitnessCenter sx={{ fontSize: 16, color: 'primary.main' }} />
                <Typography variant="body2">
                  P: {formatMacro(food.protein)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Grain sx={{ fontSize: 16, color: 'warning.main' }} />
                <Typography variant="body2">
                  C: {formatMacro(food.carbs)}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <WaterDrop sx={{ fontSize: 16, color: 'info.main' }} />
                <Typography variant="body2">
                  F: {formatMacro(food.fat)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Categoria calorica */}
          <Box sx={{ mt: 2 }}>
            <Chip 
              label={
                food.calories < 100 ? 'Basso contenuto calorico' :
                food.calories < 300 ? 'Medio contenuto calorico' :
                'Alto contenuto calorico'
              }
              size="small"
              color={
                food.calories < 100 ? 'success' :
                food.calories < 300 ? 'warning' : 'error'
              }
              variant="outlined"
            />
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Questa azione è irreversibile e rimuoverà definitivamente l'alimento dal database.
        </Typography>

        <Typography variant="body2" color="warning.main" sx={{ mt: 1, fontWeight: 'medium' }}>
          ⚠️ Se questo alimento è utilizzato in piani nutrizionali esistenti, 
          l'eliminazione potrebbe causare problemi nei calcoli nutrizionali.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            component={RouterLink}
            to={`/alimenti/${id}`}
            disabled={deleting}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Eliminazione...' : 'Elimina Alimento'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DeleteFood;