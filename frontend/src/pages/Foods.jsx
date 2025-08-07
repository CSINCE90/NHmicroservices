import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { foodService } from '../services/foodService';
import FoodCard from '../components/foods/FoodCard';
import FoodForm from '../components/foods/FoodForm';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Collapse,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  ViewModule,
  ViewList,
  Refresh,
  ExpandMore,
  Tune,
} from '@mui/icons-material';

const Foods = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Advanced filters
  const [filters, setFilters] = useState({
    calorieRange: [0, 1000],
    proteinRange: [0, 100],
    carbsRange: [0, 100],
    fatRange: [0, 100],
  });
  
  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [foodToDelete, setFoodToDelete] = useState(null);

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterAndSortFoods();
  }, [foods, searchTerm, sortBy, filters]);

  const loadFoods = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await foodService.getAllFoods();
      setFoods(data);
      
      // Aggiorna i range dei filtri basandosi sui dati reali
      if (data.length > 0) {
        const maxCalories = Math.max(...data.map(f => f.calories || 0));
        const maxProtein = Math.max(...data.map(f => f.protein || 0));
        const maxCarbs = Math.max(...data.map(f => f.carbs || 0));
        const maxFat = Math.max(...data.map(f => f.fat || 0));
        
        setFilters({
          calorieRange: [0, Math.ceil(maxCalories / 50) * 50],
          proteinRange: [0, Math.ceil(maxProtein / 10) * 10],
          carbsRange: [0, Math.ceil(maxCarbs / 10) * 10],
          fatRange: [0, Math.ceil(maxFat / 10) * 10],
        });
      }
    } catch {
      setError('Errore nel caricamento degli alimenti');
      enqueueSnackbar('Errore nel caricamento degli alimenti', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortFoods = () => {
    let filtered = [...foods];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply advanced filters
    filtered = filtered.filter(food => {
      const calories = food.calories || 0;
      const protein = food.protein || 0;
      const carbs = food.carbs || 0;
      const fat = food.fat || 0;
      
      return (
        calories >= filters.calorieRange[0] && calories <= filters.calorieRange[1] &&
        protein >= filters.proteinRange[0] && protein <= filters.proteinRange[1] &&
        carbs >= filters.carbsRange[0] && carbs <= filters.carbsRange[1] &&
        fat >= filters.fatRange[0] && fat <= filters.fatRange[1]
      );
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'calories':
          return (b.calories || 0) - (a.calories || 0);
        case 'protein':
          return (b.protein || 0) - (a.protein || 0);
        case 'carbs':
          return (b.carbs || 0) - (a.carbs || 0);
        case 'fat':
          return (b.fat || 0) - (a.fat || 0);
        default:
          return 0;
      }
    });

    setFilteredFoods(filtered);
  };

  const handleCreateFood = () => {
    setSelectedFood(null);
    setFormOpen(true);
  };

  const handleEditFood = (food) => {
    setSelectedFood(food);
    setFormOpen(true);
  };

  const handleDeleteFood = (food) => {
    setFoodToDelete(food);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!foodToDelete) return;

    try {
      await foodService.deleteFood(foodToDelete.id);
      setFoods(prev => prev.filter(f => f.id !== foodToDelete.id));
      enqueueSnackbar('Alimento eliminato con successo', { variant: 'success' });
    } catch {
      enqueueSnackbar('Errore nell\'eliminazione dell\'alimento', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setFoodToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (selectedFood) {
        // Update existing food
        const updatedFood = await foodService.updateFood(selectedFood.id, formData);
        setFoods(prev => prev.map(f => f.id === selectedFood.id ? updatedFood : f));
        enqueueSnackbar('Alimento aggiornato con successo', { variant: 'success' });
      } else {
        // Create new food
        const newFood = await foodService.createFood(formData);
        setFoods(prev => [...prev, newFood]);
        enqueueSnackbar('Alimento creato con successo', { variant: 'success' });
      }
      
      setFormOpen(false);
      setSelectedFood(null);
    } catch {
      enqueueSnackbar(
        selectedFood ? 'Errore nell\'aggiornamento dell\'alimento' : 'Errore nella creazione dell\'alimento',
        { variant: 'error' }
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleFilterChange = (filterType, newValue) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: newValue
    }));
  };

  const resetFilters = () => {
    const maxCalories = Math.max(...foods.map(f => f.calories || 0), 1000);
    const maxProtein = Math.max(...foods.map(f => f.protein || 0), 100);
    const maxCarbs = Math.max(...foods.map(f => f.carbs || 0), 100);
    const maxFat = Math.max(...foods.map(f => f.fat || 0), 100);
    
    setFilters({
      calorieRange: [0, maxCalories],
      proteinRange: [0, maxProtein],
      carbsRange: [0, maxCarbs],
      fatRange: [0, maxFat],
    });
    setSearchTerm('');
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    
    const maxCalories = Math.max(...foods.map(f => f.calories || 0), 1000);
    const maxProtein = Math.max(...foods.map(f => f.protein || 0), 100);
    const maxCarbs = Math.max(...foods.map(f => f.carbs || 0), 100);
    const maxFat = Math.max(...foods.map(f => f.fat || 0), 100);
    
    if (filters.calorieRange[0] > 0 || filters.calorieRange[1] < maxCalories) count++;
    if (filters.proteinRange[0] > 0 || filters.proteinRange[1] < maxProtein) count++;
    if (filters.carbsRange[0] > 0 || filters.carbsRange[1] < maxCarbs) count++;
    if (filters.fatRange[0] > 0 || filters.fatRange[1] < maxFat) count++;
    
    return count;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Database Alimenti
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestisci il database degli alimenti ({filteredFoods.length} di {foods.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateFood}
          size="large"
        >
          Nuovo Alimento
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Cerca alimenti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Ordina per</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Ordina per"
              >
                <MenuItem value="name">Nome</MenuItem>
                <MenuItem value="calories">Calorie</MenuItem>
                <MenuItem value="protein">Proteine</MenuItem>
                <MenuItem value="carbs">Carboidrati</MenuItem>
                <MenuItem value="fat">Grassi</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                startIcon={<Tune />}
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                variant={getActiveFiltersCount() > 0 ? "contained" : "outlined"}
                size="small"
              >
                Filtri Avanzati {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Button>
              <Tooltip title="Aggiorna">
                <IconButton onClick={loadFoods}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vista griglia">
                <IconButton 
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                >
                  <ViewModule />
                </IconButton>
              </Tooltip>
              <Tooltip title="Vista lista">
                <IconButton 
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                >
                  <ViewList />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        <Collapse in={showAdvancedFilters}>
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography gutterBottom>Calorie (kcal/100g)</Typography>
                <Slider
                  value={filters.calorieRange}
                  onChange={(e, newValue) => handleFilterChange('calorieRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={Math.max(...foods.map(f => f.calories || 0), 1000)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography gutterBottom>Proteine (g/100g)</Typography>
                <Slider
                  value={filters.proteinRange}
                  onChange={(e, newValue) => handleFilterChange('proteinRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={Math.max(...foods.map(f => f.protein || 0), 100)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography gutterBottom>Carboidrati (g/100g)</Typography>
                <Slider
                  value={filters.carbsRange}
                  onChange={(e, newValue) => handleFilterChange('carbsRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={Math.max(...foods.map(f => f.carbs || 0), 100)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Typography gutterBottom>Grassi (g/100g)</Typography>
                <Slider
                  value={filters.fatRange}
                  onChange={(e, newValue) => handleFilterChange('fatRange', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={Math.max(...foods.map(f => f.fat || 0), 100)}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={resetFilters} size="small">
                Reset Filtri
              </Button>
            </Box>
          </Box>
        </Collapse>

        {/* Active filters display */}
        {(searchTerm || getActiveFiltersCount() > 1) && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchTerm && (
              <Chip
                label={`Ricerca: "${searchTerm}"`}
                onDelete={() => setSearchTerm('')}
                size="small"
              />
            )}
          </Box>
        )}
      </Paper>

      {/* Foods Grid/List */}
      {filteredFoods.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || getActiveFiltersCount() > 0 ? 'Nessun alimento trovato' : 'Nessun alimento nel database'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || getActiveFiltersCount() > 0 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia aggiungendo il primo alimento al database'
            }
          </Typography>
          {!searchTerm && getActiveFiltersCount() === 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateFood}
            >
              Aggiungi Alimento
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredFoods.map((food) => (
            <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} lg={viewMode === 'grid' ? 3 : 12} key={food.id}>
              <FoodCard
                food={food}
                onEdit={handleEditFood}
                onDelete={handleDeleteFood}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Food Form Dialog */}
      <FoodForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedFood(null);
        }}
        onSubmit={handleFormSubmit}
        food={selectedFood}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare l'alimento{' '}
            <strong>{foodToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione non può essere annullata.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annulla
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Foods;