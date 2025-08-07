import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { foodService } from '../services/foodService';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  LocalDining,
  Whatshot,
  FitnessCenter,
  Grain,
  WaterDrop,
  PhotoCamera,
} from '@mui/icons-material';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadFoodData();
    }
  }, [id]);

  const loadFoodData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const foodData = await foodService.getFood(id);
      setFood(foodData);
      
    } catch {
      setError('Errore nel caricamento dei dati dell\'alimento');
      enqueueSnackbar('Errore nel caricamento dei dati dell\'alimento', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const formatMacro = (value, unit = 'g') => {
    if (value === null || value === undefined) return '0';
    return `${Number(value).toFixed(1)}${unit}`;
  };

  const getMacroIcon = (type) => {
    switch (type) {
      case 'calories':
        return <Whatshot sx={{ fontSize: 24, color: 'error.main' }} />;
      case 'protein':
        return <FitnessCenter sx={{ fontSize: 24, color: 'primary.main' }} />;
      case 'carbs':
        return <Grain sx={{ fontSize: 24, color: 'warning.main' }} />;
      case 'fat':
        return <WaterDrop sx={{ fontSize: 24, color: 'info.main' }} />;
      default:
        return null;
    }
  };



  const calculateEstimatedCalories = () => {
    if (!food) return 0;
    const protein = food.protein || 0;
    const carbs = food.carbs || 0;
    const fat = food.fat || 0;
    
    return (protein * 4) + (carbs * 4) + (fat * 9);
  };

  const getCaloricCategory = (calories) => {
    if (calories < 100) return { label: 'Basso contenuto calorico', color: 'success' };
    if (calories < 300) return { label: 'Medio contenuto calorico', color: 'warning' };
    return { label: 'Alto contenuto calorico', color: 'error' };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !food) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Alimento non trovato'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/alimenti')}
        >
          Torna agli Alimenti
        </Button>
      </Container>
    );
  }

  const estimatedCalories = calculateEstimatedCalories();
  const actualCalories = food.calories || 0;
  const calorieCategory = getCaloricCategory(actualCalories);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton
          onClick={() => navigate('/alimenti')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {food.name}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Dettagli nutrizionali e informazioni complete
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          sx={{ mr: 1 }}
          onClick={() => navigate(`/alimenti/${id}/modifica`)}
        >
          Modifica
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => navigate(`/alimenti/${id}/elimina`)}
        >
          Elimina
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Immagine e Info Base */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            {food.photoUrl ? (
              <CardMedia
                component="img"
                height="200"
                image={food.photoUrl}
                alt={food.name}
                sx={{ borderRadius: 2, mb: 2 }}
              />
            ) : (
              <Box
                sx={{
                  height: 200,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 2,
                  mb: 2,
                }}
              >
                <LocalDining sx={{ fontSize: 80, color: 'grey.400' }} />
              </Box>
            )}
            
            <Typography variant="h5" gutterBottom>
              {food.name}
            </Typography>
            
            <Chip 
              label={calorieCategory.label}
              color={calorieCategory.color}
              sx={{ mb: 2 }}
            />
            
            {!food.photoUrl && (
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<PhotoCamera />}
                  variant="outlined"
                  size="small"
                  onClick={() => navigate(`/alimenti/${id}/modifica`)}
                >
                  Aggiungi Foto
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Valori Nutrizionali */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Valori Nutrizionali
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Per 100 grammi di prodotto
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Calorie */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ bgcolor: 'error.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getMacroIcon('calories')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Calorie
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="error.main">
                      {formatMacro(actualCalories, ' kcal')}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Proteine */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getMacroIcon('protein')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Proteine
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="primary.main">
                      {formatMacro(food.protein)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Carboidrati */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ bgcolor: 'warning.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getMacroIcon('carbs')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Carboidrati
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="warning.main">
                      {formatMacro(food.carbs)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Grassi */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined" sx={{ bgcolor: 'info.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getMacroIcon('fat')}
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Grassi
                      </Typography>
                    </Box>
                    <Typography variant="h4" color="info.main">
                      {formatMacro(food.fat)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Analisi Nutrizionale */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Analisi Nutrizionale
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Distribuzione Macronutrienti
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Proteine</Typography>
                    <Typography variant="body2">
                      {((food.protein || 0) / ((food.protein || 0) + (food.carbs || 0) + (food.fat || 0)) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Carboidrati</Typography>
                    <Typography variant="body2">
                      {((food.carbs || 0) / ((food.protein || 0) + (food.carbs || 0) + (food.fat || 0)) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Grassi</Typography>
                    <Typography variant="body2">
                      {((food.fat || 0) / ((food.protein || 0) + (food.carbs || 0) + (food.fat || 0)) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Verifica Calorie
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Calorie dichiarate:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatMacro(actualCalories, ' kcal')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Calorie calcolate:</Typography>
                    <Typography variant="body2">
                      {Math.round(estimatedCalories)} kcal
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Differenza:</Typography>
                    <Typography 
                      variant="body2" 
                      color={Math.abs(estimatedCalories - actualCalories) > actualCalories * 0.1 ? "error" : "success"}
                    >
                      {Math.abs(estimatedCalories - actualCalories).toFixed(0)} kcal
                      ({(Math.abs(estimatedCalories - actualCalories) / actualCalories * 100).toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
                
                {Math.abs(estimatedCalories - actualCalories) > actualCalories * 0.1 && (
                  <Alert severity="warning" size="small">
                    Le calorie dichiarate sembrano inconsistenti con i macronutrienti
                  </Alert>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FoodDetail;