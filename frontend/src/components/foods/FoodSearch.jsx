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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  InputAdornment,
  CircularProgress,
  Alert,
  Divider,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Search,
  Add,
  Close,
  Whatshot,
  FitnessCenter,
  Grain,
  WaterDrop,
  FilterList,
} from '@mui/icons-material';
import { foodService } from '../../services/foodService';

const FoodSearch = ({ open, onClose, onSelect, selectedFoods = [], multiSelect = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Advanced search filters
  const [advancedFilters, setAdvancedFilters] = useState({
    minCalories: 0,
    maxCalories: 1000,
    minProtein: 0,
    maxProtein: 100,
    minCarbs: 0,
    maxCarbs: 100,
    minFat: 0,
    maxFat: 100,
  });

  // Selected foods for multi-select mode
  const [localSelectedFoods, setLocalSelectedFoods] = useState([]);

  useEffect(() => {
    if (open) {
      setLocalSelectedFoods(selectedFoods);
      loadAllFoods();
    }
  }, [open, selectedFoods]);

  useEffect(() => {
    if (searchTerm) {
      performSearch();
    } else {
      loadAllFoods();
    }
  }, [searchTerm]);

  const loadAllFoods = async () => {
    try {
      setLoading(true);
      setError('');
      const foods = await foodService.getAllFoods();
      setSearchResults(foods.slice(0, 20)); // Limit to first 20 for performance
    } catch {
      setError('Errore nel caricamento degli alimenti');
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      let results;
      if (tabValue === 0) {
        // Simple search by name
        results = await foodService.searchFoodsByName(searchTerm);
      } else {
        // Advanced search with filters
        results = await foodService.searchFoods({
          name: searchTerm,
          minCal: advancedFilters.minCalories,
          maxCal: advancedFilters.maxCalories,
          minProt: advancedFilters.minProtein,
          maxProt: advancedFilters.maxProtein,
          minCarb: advancedFilters.minCarbs,
          maxCarb: advancedFilters.maxCarbs,
          minFat: advancedFilters.minFat,
          maxFat: advancedFilters.maxFat,
        });
      }
      
      setSearchResults(results);
    } catch {
      setError('Errore nella ricerca degli alimenti');
    } finally {
      setLoading(false);
    }
  };

  const performAdvancedSearch = async () => {
    try {
      setLoading(true);
      setError('');
      
      const results = await foodService.searchFoods({
        name: searchTerm || undefined,
        minCal: advancedFilters.minCalories,
        maxCal: advancedFilters.maxCalories,
        minProt: advancedFilters.minProtein,
        maxProt: advancedFilters.maxProtein,
        minCarb: advancedFilters.minCarbs,
        maxCarb: advancedFilters.maxCarbs,
        minFat: advancedFilters.minFat,
        maxFat: advancedFilters.maxFat,
      });
      
      setSearchResults(results);
    } catch {
      setError('Errore nella ricerca avanzata');
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSelect = (food) => {
    if (multiSelect) {
      const isSelected = localSelectedFoods.some(f => f.id === food.id);
      if (isSelected) {
        setLocalSelectedFoods(prev => prev.filter(f => f.id !== food.id));
      } else {
        setLocalSelectedFoods(prev => [...prev, food]);
      }
    } else {
      onSelect(food);
      onClose();
    }
  };

  const handleConfirmSelection = () => {
    if (multiSelect) {
      onSelect(localSelectedFoods);
    }
    onClose();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (filterName, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const formatMacro = (value, unit = 'g') => {
    if (value === null || value === undefined) return '0';
    return `${Number(value).toFixed(1)}${unit}`;
  };

  const getMacroIcon = (type) => {
    switch (type) {
      case 'calories':
        return <Whatshot sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'protein':
        return <FitnessCenter sx={{ fontSize: 16, color: 'primary.main' }} />;
      case 'carbs':
        return <Grain sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 'fat':
        return <WaterDrop sx={{ fontSize: 16, color: 'info.main' }} />;
      default:
        return null;
    }
  };

  const isSelected = (food) => {
    return localSelectedFoods.some(f => f.id === food.id);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { height: '80vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {multiSelect ? 'Seleziona Alimenti' : 'Cerca Alimento'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Ricerca Semplice" />
            <Tab label="Ricerca Avanzata" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Search Input */}
          <TextField
            fullWidth
            placeholder="Cerca alimenti per nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Advanced Filters */}
          {tabValue === 1 && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Filtri Nutrizionali (per 100g)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Calorie (kcal): {advancedFilters.minCalories} - {advancedFilters.maxCalories}
                  </Typography>
                  <Slider
                    value={[advancedFilters.minCalories, advancedFilters.maxCalories]}
                    onChange={(e, newValue) => {
                      handleFilterChange('minCalories', newValue[0]);
                      handleFilterChange('maxCalories', newValue[1]);
                    }}
                    min={0}
                    max={1000}
                    step={10}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Proteine (g): {advancedFilters.minProtein} - {advancedFilters.maxProtein}
                  </Typography>
                  <Slider
                    value={[advancedFilters.minProtein, advancedFilters.maxProtein]}
                    onChange={(e, newValue) => {
                      handleFilterChange('minProtein', newValue[0]);
                      handleFilterChange('maxProtein', newValue[1]);
                    }}
                    min={0}
                    max={100}
                    step={1}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Carboidrati (g): {advancedFilters.minCarbs} - {advancedFilters.maxCarbs}
                  </Typography>
                  <Slider
                    value={[advancedFilters.minCarbs, advancedFilters.maxCarbs]}
                    onChange={(e, newValue) => {
                      handleFilterChange('minCarbs', newValue[0]);
                      handleFilterChange('maxCarbs', newValue[1]);
                    }}
                    min={0}
                    max={100}
                    step={1}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" gutterBottom>
                    Grassi (g): {advancedFilters.minFat} - {advancedFilters.maxFat}
                  </Typography>
                  <Slider
                    value={[advancedFilters.minFat, advancedFilters.maxFat]}
                    onChange={(e, newValue) => {
                      handleFilterChange('minFat', newValue[0]);
                      handleFilterChange('maxFat', newValue[1]);
                    }}
                    min={0}
                    max={100}
                    step={1}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  startIcon={<FilterList />}
                  onClick={performAdvancedSearch}
                  variant="outlined"
                  size="small"
                >
                  Applica Filtri
                </Button>
              </Box>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Selected Foods Summary */}
          {multiSelect && localSelectedFoods.length > 0 && (
            <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Alimenti Selezionati ({localSelectedFoods.length})
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {localSelectedFoods.map((food) => (
                  <Chip
                    key={food.id}
                    label={food.name}
                    onDelete={() => handleFoodSelect(food)}
                    size="small"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Results */}
          <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List>
                {searchResults.map((food, index) => (
                  <div key={food.id}>
                    <ListItem
                      button
                      onClick={() => handleFoodSelect(food)}
                      selected={multiSelect && isSelected(food)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1">{food.name}</Typography>
                            {multiSelect && isSelected(food) && (
                              <Chip label="Selezionato" size="small" color="primary" />
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMacroIcon('calories')}
                              <Typography variant="caption">
                                {formatMacro(food.calories, ' kcal')}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMacroIcon('protein')}
                              <Typography variant="caption">
                                P: {formatMacro(food.protein)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMacroIcon('carbs')}
                              <Typography variant="caption">
                                C: {formatMacro(food.carbs)}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getMacroIcon('fat')}
                              <Typography variant="caption">
                                F: {formatMacro(food.fat)}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFoodSelect(food);
                          }}
                          color={multiSelect && isSelected(food) ? "primary" : "default"}
                        >
                          <Add />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < searchResults.length - 1 && <Divider />}
                  </div>
                ))}
                
                {searchResults.length === 0 && !loading && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      {searchTerm ? 'Nessun alimento trovato' : 'Inizia a digitare per cercare alimenti'}
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>
          Annulla
        </Button>
        {multiSelect && (
          <Button 
            onClick={handleConfirmSelection}
            variant="contained"
            disabled={localSelectedFoods.length === 0}
          >
            Conferma Selezione ({localSelectedFoods.length})
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FoodSearch;