// frontend/src/pages/MealPlansPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { dietService } from '../services/dietService';
import { patientService } from '../services/patientService';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add,
  Search,
  Restaurant,
  Person,
  CalendarToday,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';

const MealPlansPage = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [mealPlans, setMealPlans] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('all');
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Carica pazienti per il filtro
      const patientsData = await patientService.getAllPatients();
      setPatients(patientsData);
      
      // Per ora carichiamo i piani per tutti i pazienti
      // In futuro potresti aggiungere un endpoint per tutti i piani
      let allPlans = [];
      for (const patient of patientsData) {
        try {
          const plans = await dietService.getMealPlansByPaziente(patient.id);
          allPlans = [...allPlans, ...plans];
        } catch {
          // Continua se non ci sono piani per questo paziente
        }
      }
      
      setMealPlans(allPlans);
    } catch {
      setError('Errore nel caricamento dei piani alimentari');
      enqueueSnackbar('Errore nel caricamento dei piani alimentari', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = () => {
    navigate('/piani-alimentari/nuovo');
  };

  const handleViewPlan = (plan) => {
    navigate(`/piani-alimentari/${plan.id}`);
  };

  const handleEditPlan = (plan) => {
    navigate(`/piani-alimentari/${plan.id}/modifica`);
  };

  const handleDeletePlan = (plan) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;
    
    try {
      await dietService.deleteMealPlan(planToDelete.id);
      setMealPlans(prev => prev.filter(p => p.id !== planToDelete.id));
      enqueueSnackbar('Piano alimentare eliminato con successo', { variant: 'success' });
    } catch {
      enqueueSnackbar('Errore nell\'eliminazione del piano alimentare', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleMenuOpen = (event, plan) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedPlan(plan);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPlan(null);
  };

  const getPatientName = (pazienteId) => {
    const patient = patients.find(p => p.id === pazienteId);
    return patient ? `${patient.nome} ${patient.cognome}` : 'Paziente sconosciuto';
  };

  const filteredPlans = mealPlans.filter(plan => {
    const matchesSearch = plan.titolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getPatientName(plan.pazienteId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPatient = selectedPatient === 'all' || plan.pazienteId.toString() === selectedPatient;
    
    return matchesSearch && matchesPatient;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
            Piani Alimentari
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestisci i piani nutrizionali dei tuoi pazienti ({filteredPlans.length} di {mealPlans.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreatePlan}
          size="large"
        >
          Nuovo Piano
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              placeholder="Cerca piani alimentari..."
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
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filtra per paziente</InputLabel>
              <Select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                label="Filtra per paziente"
              >
                <MenuItem value="all">Tutti i pazienti</MenuItem>
                {patients.map((patient) => (
                  <MenuItem key={patient.id} value={patient.id.toString()}>
                    {patient.nome} {patient.cognome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || selectedPatient !== 'all' ? 'Nessun piano trovato' : 'Nessun piano alimentare creato'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || selectedPatient !== 'all' 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia creando il primo piano alimentare'
            }
          </Typography>
          {!searchTerm && selectedPatient === 'all' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreatePlan}
            >
              Crea Piano Alimentare
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredPlans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4,
                  }
                }}
                onClick={() => handleViewPlan(plan)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {plan.titolo}
                    </Typography>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, plan)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Person sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      {getPatientName(plan.pazienteId)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      icon={<Restaurant />}
                      label={`${plan.giorni?.length || 0} giorni`} 
                      size="small" 
                      variant="outlined" 
                    />
                    <Chip 
                      icon={<CalendarToday />}
                      label="Attivo" 
                      size="small" 
                      color="success"
                      variant="outlined" 
                    />
                  </Box>

                  {plan.note && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {plan.note}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Creato il {formatDate(plan.dataCreazione || new Date())}
                  </Typography>
                  <Button 
                    size="small" 
                    startIcon={<Visibility />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewPlan(plan);
                    }}
                  >
                    Visualizza
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleViewPlan(selectedPlan); handleMenuClose(); }}>
          <Visibility sx={{ mr: 1 }} />
          Visualizza
        </MenuItem>
        <MenuItem onClick={() => { handleEditPlan(selectedPlan); handleMenuClose(); }}>
          <Edit sx={{ mr: 1 }} />
          Modifica
        </MenuItem>
        <MenuItem onClick={() => handleDeletePlan(selectedPlan)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Elimina
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare il piano alimentare{' '}
            <strong>{planToDelete?.titolo}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione eliminerà anche tutti i giorni e gli items associati.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annulla
          </Button>
          <Button onClick={confirmDeletePlan} color="error" variant="contained">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MealPlansPage;