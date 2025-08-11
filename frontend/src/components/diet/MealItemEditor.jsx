// frontend/src/components/diet/MealItemEditor.jsx
import { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Button, 
  Grid,
  Typography,
  Paper,
  Alert,
  Autocomplete,
  CircularProgress,
  Chip,
} from '@mui/material';
import { foodService } from '../../services/foodService';
import FoodSearch from '../foods/FoodSearch';

const MealItemEditor = ({ item, onSave, onCancel}) => {
  const [formData, setFormData] = useState({
    foodId: item?.foodId || '',
    quantity: item?.quantity || 100,
    unit: item?.unit || 'g',
    mealType: item?.mealType || 'COLAZIONE'
  });
  const [selectedFood, setSelectedFood] = useState(null);
  const [foodSearchOpen, setFoodSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const mealTypes = [
    { value: 'COLAZIONE', label: 'Colazione' },
    { value: 'PRANZO', label: 'Pranzo' },
    { value: 'CENA', label: 'Cena' },
    { value: 'SNACK', label: 'Spuntino' }
  ];

  const units = [
    { value: 'g', label: 'grammi (g)' },
    { value: 'ml', label: 'millilitri (ml)' },
    { value: 'pz', label: 'pezzi (pz)' },
    { value: 'tazza', label: 'tazza' },
    { value: 'cucchiaio', label: 'cucchiaio' },
    { value: 'cucchiaino', label: 'cucchiaino' }
  ];

  useEffect(() => {
    if (item?.foodId) {
      loadFoodDetails(item.foodId);
    }
  }, [item]);

  const loadFoodDetails = async (foodId) => {
    try {
      const food = await foodService.getFood(foodId);
      setSelectedFood(food);
    } catch (error) {
      console.error('Errore nel caricamento alimento:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.foodId) {
      newErrors.foodId = 'Alimento richiesto';
    }
    
    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'Quantità deve essere maggiore di 0';
    }
    
    if (!formData.unit) {
      newErrors.unit = 'Unità di misura richiesta';
    }
    
    if (!formData.mealType) {
      newErrors.mealType = 'Tipo pasto richiesto';
    }
    
    return newErrors;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    setFormData(prev => ({ ...prev, foodId: food.id }));
    setFoodSearchOpen(false);
    
    if (errors.foodId) {
      setErrors(prev => ({ ...prev, foodId: '' }));
    }
  };

  const calculateNutrition = () => {
    if (!selectedFood || !formData.quantity) return null;
    
    const ratio = formData.quantity / 100; // I valori nutrizionali sono per 100g
    
    return {
      calories: (selectedFood.calories || 0) * ratio,
      protein: (selectedFood.protein || 0) * ratio,
      carbs: (selectedFood.carbs || 0) * ratio,
      fat: (selectedFood.fat || 0) * ratio,
    };
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      await onSave({
        ...formData,
        id: item?.id
      });
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
    } finally {
      setLoading(false);
    }
  };

  const nutrition = calculateNutrition();

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        {item ? 'Modifica Item' : 'Nuovo Item Pasto'}
      </Typography>
      
      <Grid container spacing={2}>
        {/* Selezione alimento */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            <Box sx={{ flexGrow: 1 }}>
              {selectedFood ? (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Alimento selezionato:
                  </Typography>
                  <Chip 
                    label={selectedFood.name}
                    onDelete={() => {
                      setSelectedFood(null);
                      setFormData(prev => ({ ...prev, foodId: '' }));
                    }}
                    color="primary"
                  />
                </Box>
              ) : (
                <Alert severity="info">
                  Nessun alimento selezionato
                </Alert>
              )}
            </Box>
            <Button
              variant="outlined"
              onClick={() => setFoodSearchOpen(true)}
            >
              {selectedFood ? 'Cambia Alimento' : 'Seleziona Alimento'}
            </Button>
          </Box>
          {errors.foodId && (
            <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
              {errors.foodId}
            </Typography>
          )}
        </Grid>

        {/* Quantità */}
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantità"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange('quantity')}
            error={!!errors.quantity}
            helperText={errors.quantity}
            inputProps={{ min: 0, step: 0.1 }}
          />
        </Grid>

        {/* Unità di misura */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.unit}>
            <InputLabel>Unità di misura</InputLabel>
            <Select
              value={formData.unit}
              label="Unità di misura"
              onChange={handleChange('unit')}
            >
              {units.map(unit => (
                <MenuItem key={unit.value} value={unit.value}>
                  {unit.label}
                </MenuItem>
              ))}
            </Select>
            {errors.unit && (
              <Typography variant="caption" color="error">
                {errors.unit}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Tipo pasto */}
        <Grid item xs={12}>
          <FormControl fullWidth error={!!errors.mealType}>
            <InputLabel>Tipo Pasto</InputLabel>
            <Select
              value={formData.mealType}
              label="Tipo Pasto"
              onChange={handleChange('mealType')}
            >
              {mealTypes.map(type => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
            {errors.mealType && (
              <Typography variant="caption" color="error">
                {errors.mealType}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Anteprima valori nutrizionali */}
        {nutrition && (
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Valori Nutrizionali per {formData.quantity}{formData.unit}:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    <strong>{Math.round(nutrition.calories)} kcal</strong>
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    P: {nutrition.protein.toFixed(1)}g
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    C: {nutrition.carbs.toFixed(1)}g
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography variant="body2">
                    F: {nutrition.fat.toFixed(1)}g
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        )}

        {/* Pulsanti */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={onCancel} disabled={loading}>
              Annulla
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Salvando...' : 'Salva'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Food Search Dialog */}
      <FoodSearch
        open={foodSearchOpen}
        onClose={() => setFoodSearchOpen(false)}
        onSelect={handleFoodSelect}
        multiSelect={false}
      />
    </Paper>
  );
};

export default MealItemEditor;