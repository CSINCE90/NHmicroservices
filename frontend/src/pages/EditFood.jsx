import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { foodService } from '../services/foodService';
import FoodForm from '../components/foods/FoodForm';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

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

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      await foodService.updateFood(id, formData);
      enqueueSnackbar('Alimento aggiornato con successo', { variant: 'success' });
      navigate(`/alimenti/${id}`);
    } catch {
      enqueueSnackbar('Errore nell\'aggiornamento dell\'alimento', { variant: 'error' });
    } finally {
      setFormLoading(false);
    }
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
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          Indietro
        </Button>
        <Typography variant="h4" component="h1">
          Modifica Alimento
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <FoodForm
          open
          onClose={() => navigate(-1)}
          onSubmit={handleSubmit}
          food={food}
          loading={formLoading}
        />
      </Paper>
    </Container>
  );
};

export default EditFood;