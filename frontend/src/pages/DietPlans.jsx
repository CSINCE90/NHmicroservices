// frontend/src/pages/DietPlans.jsx
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { dietService } from '../services/dietService';
import { patientService } from '../services/patientService';
import { foodService } from '../services/foodService';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Add,
  Search,
  Restaurant,
  Person,
  CalendarToday,
  Edit,
  Delete,
  ContentCopy,
  Refresh,
  Download,
  Print,
  Visibility,
} from '@mui/icons-material';

const DietPlans = () => {
  const { enqueueSnackbar } = useSnackbar();
  
  // Stati principali
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [planTitles, setPlanTitles] = useState([]);
  const [selectedPlanTitle, setSelectedPlanTitle] = useState('');
  const [planItems, setPlanItems] = useState([]);
  const [planSummary, setPlanSummary] = useState(null);
  const [foods, setFoods] = useState([]);
  
  // Stati UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  // eslint-disable-next-line no-empty-pattern
  const [] = useState('');
  
  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Form data
  const [formData, setFormData] = useState({
    patientId: '',
    title: '',
    notes: '',
    dayOfWeek: 1,
    mealType: 'PRANZO',
    foodId: '',
    foodName: '',
    quantity: 100,
    unit: 'g',
    calories: 0,
    proteins: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedPatient) {
      loadPlanTitles();
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (selectedPatient && selectedPlanTitle) {
      loadPlanData();
    }
  }, [selectedPatient, selectedPlanTitle]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Carica pazienti
      const patientsData = await patientService.getAllPatients();
      setPatients(patientsData);
      
      // Carica alimenti
      const foodsData = await foodService.getAllFoods();
      setFoods(foodsData);
      
    } catch{
      setError('Errore nel caricamento dei dati');
      enqueueSnackbar('Errore nel caricamento dei dati', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadPlanTitles = async () => {
    if (!selectedPatient) return;
    
    try {
      const titles = await dietService.getPlanTitles(selectedPatient.id);
      setPlanTitles(titles);
      
      if (titles.length > 0 && !selectedPlanTitle) {
        setSelectedPlanTitle(titles[0]);
      }
    } catch (err) {
      console.error('Errore nel caricamento dei piani:', err);
      setPlanTitles([]);
    }
  };

  const loadPlanData = async () => {
    if (!selectedPatient || !selectedPlanTitle) return;
    
    try {
      setLoading(true);
      
      // Carica elementi del piano
      const items = await dietService.getPlanByPatientAndTitle(
        selectedPatient.id,
        selectedPlanTitle
      );
      setPlanItems(items);
      
      // Carica riepilogo
      const summary = await dietService.getPlanSummary(
        selectedPatient.id,
        selectedPlanTitle
      );
      setPlanSummary(summary);
      
    } catch (err) {
      console.error('Errore nel caricamento del piano:', err);
      setPlanItems([]);
      setPlanSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = () => {
    setFormData({
      ...formData,
      patientId: selectedPatient?.id || '',
      title: selectedPlanTitle || '',
    });
    setSelectedItem(null);
    setCreateDialogOpen(true);
  };

  const handleEditItem = (item) => {
    setFormData({
      ...item,
      patientId: item.patientId || selectedPatient?.id,
      title: item.title || selectedPlanTitle,
    });
    setSelectedItem(item);
    setEditDialogOpen(true);
  };

  const handleDeleteItem = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSaveItem = async () => {
    try {
      if (selectedItem) {
        // Aggiorna elemento esistente
        await dietService.updateElement(selectedItem.id, formData);
        enqueueSnackbar('Elemento aggiornato con successo', { variant: 'success' });
      } else {
        // Crea nuovo elemento
        await dietService.createElement(formData);
        enqueueSnackbar('Elemento creato con successo', { variant: 'success' });
      }
      
      setCreateDialogOpen(false);
      setEditDialogOpen(false);
      loadPlanData(); // Ricarica i dati
    } catch{
      enqueueSnackbar('Errore nel salvataggio', { variant: 'error' });
    }
  };

  const confirmDelete = async () => {
    try {
      await dietService.deleteElement(selectedItem.id);
      enqueueSnackbar('Elemento eliminato con successo', { variant: 'success' });
      setDeleteDialogOpen(false);
      loadPlanData();
    } catch{
      enqueueSnackbar('Errore nell\'eliminazione', { variant: 'error' });
    }
  };

  const handleDuplicatePlan = async (newTitle) => {
    try {
      await dietService.duplicatePlan(
        selectedPatient.id,
        selectedPlanTitle,
        newTitle
      );
      enqueueSnackbar('Piano duplicato con successo', { variant: 'success' });
      setDuplicateDialogOpen(false);
      loadPlanTitles();
    } catch{
      enqueueSnackbar('Errore nella duplicazione', { variant: 'error' });
    }
  };

  const handleDeletePlan = async () => {
    try {
      await dietService.deletePlan(selectedPatient.id, selectedPlanTitle);
      enqueueSnackbar('Piano eliminato con successo', { variant: 'success' });
      setSelectedPlanTitle('');
      loadPlanTitles();
    } catch{
      enqueueSnackbar('Errore nell\'eliminazione del piano', { variant: 'error' });
    }
  };

  const handleFoodSelect = (food) => {
    if (food) {
      setFormData({
        ...formData,
        foodId: food.id,
        foodName: food.name,
        calories: food.calories * (formData.quantity / 100),
        proteins: food.protein * (formData.quantity / 100),
        carbs: food.carbs * (formData.quantity / 100),
        fats: food.fat * (formData.quantity / 100),
      });
    }
  };

  const getItemsByDay = (dayIndex) => {
    return planItems.filter(item => item.dayOfWeek === dayIndex);
  };

  const getItemsByMealType = (mealType) => {
    return planItems.filter(item => item.mealType === mealType);
  };


  if (loading && !planItems.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Piani Alimentari
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestione completa dei piani nutrizionali
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateItem}
            disabled={!selectedPatient || !selectedPlanTitle}
          >
            Aggiungi Elemento
          </Button>
          <Tooltip title="Aggiorna">
            <IconButton onClick={loadPlanData}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Selezione Paziente e Piano */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={patients}
              getOptionLabel={(option) => `${option.nome} ${option.cognome}`}
              value={selectedPatient}
              onChange={(e, newValue) => setSelectedPatient(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Seleziona Paziente"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth disabled={!selectedPatient}>
              <InputLabel>Piano Alimentare</InputLabel>
              <Select
                value={selectedPlanTitle}
                onChange={(e) => setSelectedPlanTitle(e.target.value)}
                label="Piano Alimentare"
              >
                {planTitles.map((title) => (
                  <MenuItem key={title} value={title}>
                    {title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                disabled={!selectedPlanTitle}
                onClick={() => setDuplicateDialogOpen(true)}
              >
                Duplica
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                disabled={!selectedPlanTitle}
                onClick={handleDeletePlan}
              >
                Elimina Piano
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs per visualizzazione */}
      {selectedPatient && selectedPlanTitle && (
        <>
          <Paper sx={{ mb: 3 }}>
            <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
              <Tab label="Vista Settimanale" />
              <Tab label="Vista per Pasto" />
              <Tab label="Tabella Completa" />
              <Tab label="Riepilogo Nutrizionale" />
            </Tabs>
          </Paper>

          {/* Contenuto Tabs */}
          <Box>
            {/* Vista Settimanale */}
            {tabValue === 0 && (
              <Grid container spacing={2}>
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <Grid item xs={12} md={6} lg={4} key={day}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {dietService.getDayName(day)}
                        </Typography>
                        {getItemsByDay(day).length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Nessun elemento per questo giorno
                          </Typography>
                        ) : (
                          getItemsByDay(day).map((item) => (
                            <Box key={item.id} sx={{ mb: 1 }}>
                              <Chip
                                label={`${dietService.getMealTypeName(item.mealType)}: ${item.foodName || 'Alimento ' + item.foodId}`}
                                size="small"
                                onDelete={() => handleDeleteItem(item)}
                                onClick={() => handleEditItem(item)}
                              />
                              <Typography variant="caption" display="block">
                                {item.quantity}{item.unit} - {item.calories?.toFixed(0)} kcal
                              </Typography>
                            </Box>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Vista per Pasto */}
            {tabValue === 1 && (
              <Grid container spacing={2}>
                {Object.keys(dietService.MEAL_TYPES).map((mealType) => (
                  <Grid item xs={12} md={6} key={mealType}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {dietService.getMealTypeName(mealType)}
                        </Typography>
                        {getItemsByMealType(mealType).length === 0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Nessun elemento per questo pasto
                          </Typography>
                        ) : (
                          getItemsByMealType(mealType).map((item) => (
                            <Box key={item.id} sx={{ mb: 1 }}>
                              <Chip
                                label={`${dietService.getDayName(item.dayOfWeek)}: ${item.foodName || 'Alimento ' + item.foodId}`}
                                size="small"
                                onDelete={() => handleDeleteItem(item)}
                                onClick={() => handleEditItem(item)}
                              />
                              <Typography variant="caption" display="block">
                                {item.quantity}{item.unit} - {item.calories?.toFixed(0)} kcal
                              </Typography>
                            </Box>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Tabella Completa */}
            {tabValue === 2 && (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Giorno</TableCell>
                      <TableCell>Pasto</TableCell>
                      <TableCell>Alimento</TableCell>
                      <TableCell>Quantità</TableCell>
                      <TableCell>Calorie</TableCell>
                      <TableCell>Proteine</TableCell>
                      <TableCell>Carboidrati</TableCell>
                      <TableCell>Grassi</TableCell>
                      <TableCell>Azioni</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {planItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{dietService.getDayName(item.dayOfWeek)}</TableCell>
                        <TableCell>{dietService.getMealTypeName(item.mealType)}</TableCell>
                        <TableCell>{item.foodName || `Alimento ${item.foodId}`}</TableCell>
                        <TableCell>{item.quantity}{item.unit}</TableCell>
                        <TableCell>{item.calories?.toFixed(0)} kcal</TableCell>
                        <TableCell>{item.proteins?.toFixed(1)}g</TableCell>
                        <TableCell>{item.carbs?.toFixed(1)}g</TableCell>
                        <TableCell>{item.fats?.toFixed(1)}g</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleEditItem(item)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteItem(item)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Riepilogo Nutrizionale */}
            {tabValue === 3 && planSummary && (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Totali Settimanali
                      </Typography>
                      <Typography variant="body2">
                        Calorie totali: <strong>{planSummary.totalNutrition?.totalCalories?.toFixed(0)} kcal</strong>
                      </Typography>
                      <Typography variant="body2">
                        Proteine totali: <strong>{planSummary.totalNutrition?.totalProteins?.toFixed(1)}g</strong>
                      </Typography>
                      <Typography variant="body2">
                        Carboidrati totali: <strong>{planSummary.totalNutrition?.totalCarbs?.toFixed(1)}g</strong>
                      </Typography>
                      <Typography variant="body2">
                        Grassi totali: <strong>{planSummary.totalNutrition?.totalFats?.toFixed(1)}g</strong>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Media Giornaliera
                      </Typography>
                      <Typography variant="body2">
                        Calorie medie: <strong>{(planSummary.totalNutrition?.totalCalories / 7)?.toFixed(0)} kcal</strong>
                      </Typography>
                      <Typography variant="body2">
                        Proteine medie: <strong>{(planSummary.totalNutrition?.totalProteins / 7)?.toFixed(1)}g</strong>
                      </Typography>
                      <Typography variant="body2">
                        Carboidrati medi: <strong>{(planSummary.totalNutrition?.totalCarbs / 7)?.toFixed(1)}g</strong>
                      </Typography>
                      <Typography variant="body2">
                        Grassi medi: <strong>{(planSummary.totalNutrition?.totalFats / 7)?.toFixed(1)}g</strong>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informazioni Piano
                      </Typography>
                      <Typography variant="body2">
                        Paziente: <strong>{selectedPatient?.nome} {selectedPatient?.cognome}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Titolo: <strong>{selectedPlanTitle}</strong>
                      </Typography>
                      <Typography variant="body2">
                        Elementi totali: <strong>{planSummary.totalItems}</strong>
                      </Typography>
                      {planSummary.notes && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Note: {planSummary.notes}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}
          </Box>
        </>
      )}

      {/* Dialog per creare/modificare elemento */}
      <Dialog
        open={createDialogOpen || editDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setEditDialogOpen(false);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedItem ? 'Modifica Elemento' : 'Nuovo Elemento'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Giorno</InputLabel>
                <Select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({...formData, dayOfWeek: e.target.value})}
                  label="Giorno"
                >
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <MenuItem key={day} value={day}>
                      {dietService.getDayName(day)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tipo Pasto</InputLabel>
                <Select
                  value={formData.mealType}
                  onChange={(e) => setFormData({...formData, mealType: e.target.value})}
                  label="Tipo Pasto"
                >
                  {Object.keys(dietService.MEAL_TYPES).map((type) => (
                    <MenuItem key={type} value={type}>
                      {dietService.getMealTypeName(type)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Autocomplete
                options={foods}
                getOptionLabel={(option) => option.name}
                value={foods.find(f => f.id === formData.foodId) || null}
                onChange={(e, newValue) => handleFoodSelect(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleziona Alimento"
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Quantità"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                InputProps={{
                  inputProps: { min: 0 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Unità</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
                  label="Unità"
                >
                  <MenuItem value="g">grammi (g)</MenuItem>
                  <MenuItem value="ml">millilitri (ml)</MenuItem>
                  <MenuItem value="pz">pezzi</MenuItem>
                  <MenuItem value="porzione">porzione</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Note"
                multiline
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
              />
            </Grid>
            
            {formData.foodId && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Valori Nutrizionali per {formData.quantity}{formData.unit}:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        Calorie: <strong>{formData.calories?.toFixed(0)} kcal</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        Proteine: <strong>{formData.proteins?.toFixed(1)}g</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        Carboidrati: <strong>{formData.carbs?.toFixed(1)}g</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="body2">
                        Grassi: <strong>{formData.fats?.toFixed(1)}g</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setCreateDialogOpen(false);
            setEditDialogOpen(false);
          }}>
            Annulla
          </Button>
          <Button onClick={handleSaveItem} variant="contained">
            {selectedItem ? 'Aggiorna' : 'Crea'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog conferma eliminazione */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare questo elemento dal piano alimentare?
          </Typography>
          {selectedItem && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>{dietService.getDayName(selectedItem.dayOfWeek)}</strong> - {dietService.getMealTypeName(selectedItem.mealType)}
              </Typography>
              <Typography variant="body2">
                {selectedItem.foodName || `Alimento ${selectedItem.foodId}`} ({selectedItem.quantity}{selectedItem.unit})
              </Typography>
            </Box>
          )}
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

      {/* Dialog duplica piano */}
      <Dialog
        open={duplicateDialogOpen}
        onClose={() => setDuplicateDialogOpen(false)}
      >
        <DialogTitle>Duplica Piano Alimentare</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Stai duplicando il piano: <strong>{selectedPlanTitle}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Nuovo Titolo"
            sx={{ mt: 2 }}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDuplicateDialogOpen(false)}>
            Annulla
          </Button>
          <Button 
            onClick={() => handleDuplicatePlan(formData.title)} 
            variant="contained"
            disabled={!formData.title}
          >
            Duplica
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DietPlans;