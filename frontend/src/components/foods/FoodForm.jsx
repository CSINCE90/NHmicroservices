import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  FormHelperText,
} from '@mui/material';

const FoodForm = ({ open, onClose, onSubmit, food, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    photoUrl: '',
  });
  const [errors, setErrors] = useState({});
  const [totalMacros, setTotalMacros] = useState(0);

  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name || '',
        calories: food.calories || '',
        protein: food.protein || '',
        carbs: food.carbs || '',
        fat: food.fat || '',
        photoUrl: food.photoUrl || '',
      });
    } else {
      // Reset form for new food
      setFormData({
        name: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        photoUrl: '',
      });
    }
    setErrors({});
  }, [food, open]);

  // Calcola il totale dei macronutrienti e le calorie stimate
  useEffect(() => {
    const protein = parseFloat(formData.protein) || 0;
    const carbs = parseFloat(formData.carbs) || 0;
    const fat = parseFloat(formData.fat) || 0;
    
    const total = protein + carbs + fat;
    setTotalMacros(total);
  }, [formData.protein, formData.carbs, formData.fat]);

  const calculateEstimatedCalories = () => {
    const protein = parseFloat(formData.protein) || 0;
    const carbs = parseFloat(formData.carbs) || 0;
    const fat = parseFloat(formData.fat) || 0;
    
    // Calorie per grammo: proteine e carboidrati = 4 kcal/g, grassi = 9 kcal/g
    return (protein * 4) + (carbs * 4) + (fat * 9);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome richiesto';
    }

    if (!formData.calories || isNaN(formData.calories) || formData.calories < 0) {
      newErrors.calories = 'Calorie richieste (numero positivo)';
    }

    if (!formData.protein || isNaN(formData.protein) || formData.protein < 0) {
      newErrors.protein = 'Proteine richieste (numero positivo)';
    }

    if (!formData.carbs || isNaN(formData.carbs) || formData.carbs < 0) {
      newErrors.carbs = 'Carboidrati richiesti (numero positivo)';
    }

    if (!formData.fat || isNaN(formData.fat) || formData.fat < 0) {
      newErrors.fat = 'Grassi richiesti (numero positivo)';
    }

    // Validazione URL foto (opzionale)
    if (formData.photoUrl && !isValidUrl(formData.photoUrl)) {
      newErrors.photoUrl = 'URL non valido';
    }

    // Verifica coerenza calorie vs macronutrienti
    const estimatedCalories = calculateEstimatedCalories();
    const actualCalories = parseFloat(formData.calories) || 0;
    const difference = Math.abs(estimatedCalories - actualCalories);
    
    if (difference > actualCalories * 0.2) { // Differenza > 20%
      newErrors.calories = `Le calorie sembrano inconsistenti con i macronutrienti (stimate: ${Math.round(estimatedCalories)} kcal)`;
    }

    return newErrors;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      calories: parseFloat(formData.calories),
      protein: parseFloat(formData.protein),
      carbs: parseFloat(formData.carbs),
      fat: parseFloat(formData.fat),
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const estimatedCalories = calculateEstimatedCalories();
  const actualCalories = parseFloat(formData.calories) || 0;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
      }}
    >
      <DialogTitle>
        {food ? 'Modifica Alimento' : 'Nuovo Alimento'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* Informazioni base */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informazioni Base
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={8}>
              <TextField
                required
                fullWidth
                label="Nome Alimento"
                value={formData.name}
                onChange={handleChange('name')}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                placeholder="es. Riso integrale, Pollo petto, Mela..."
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Calorie"
                type="number"
                value={formData.calories}
                onChange={handleChange('calories')}
                error={!!errors.calories}
                helperText={errors.calories}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kcal/100g</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL Foto (opzionale)"
                value={formData.photoUrl}
                onChange={handleChange('photoUrl')}
                error={!!errors.photoUrl}
                helperText={errors.photoUrl}
                disabled={loading}
                placeholder="https://esempio.com/foto.jpg"
              />
            </Grid>

            {/* Macronutrienti */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Macronutrienti (per 100g)
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Proteine"
                type="number"
                value={formData.protein}
                onChange={handleChange('protein')}
                error={!!errors.protein}
                helperText={errors.protein}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Carboidrati"
                type="number"
                value={formData.carbs}
                onChange={handleChange('carbs')}
                error={!!errors.carbs}
                helperText={errors.carbs}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                required
                fullWidth
                label="Grassi"
                type="number"
                value={formData.fat}
                onChange={handleChange('fat')}
                error={!!errors.fat}
                helperText={errors.fat}
                disabled={loading}
                inputProps={{ min: 0, step: 0.1 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">g</InputAdornment>,
                }}
              />
            </Grid>

            {/* Riepilogo e validazione */}
            {(formData.protein || formData.carbs || formData.fat) && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Riepilogo Nutrizionale
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Totale macronutrienti: <strong>{totalMacros.toFixed(1)}g</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        Calorie stimate: <strong>{Math.round(estimatedCalories)} kcal</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {actualCalories > 0 && Math.abs(estimatedCalories - actualCalories) > actualCalories * 0.1 && (
                    <Alert 
                      severity={Math.abs(estimatedCalories - actualCalories) > actualCalories * 0.2 ? "error" : "warning"} 
                      sx={{ mt: 1 }}
                    >
                      Differenza significativa tra calorie inserite ({actualCalories}) e calorie stimate ({Math.round(estimatedCalories)})
                    </Alert>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={handleClose}
          disabled={loading}
        >
          Annulla
        </Button>
        <Button 
          type="submit"
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Salvando...' : (food ? 'Aggiorna' : 'Crea')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FoodForm;