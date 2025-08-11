// frontend/src/pages/MealPlanDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { dietService } from '../services/dietService';
import { patientService } from '../services/patientService';
import MealDayCard from '../components/diet/MealDayCard';
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
  IconButton,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Add,
  Person,
  CalendarToday,
  Restaurant,
  Notes,
  ExpandMore,
  Breakfast,
  LunchDining,
  DinnerDining,
  LocalCafe,
} from '@mui/icons-material';

const MealPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [mealPlan, setMealPlan] = useState(null);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      loadMealPlanData();
    }
  }, [id]);

  const loadMealPlanData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const planData = await dietService.getMealPlan(id);
      setMealPlan(planData);
      
      // Carica dati del paziente
      if (planData.pazienteId) {
        const patientData = await patientService.getPatient(planData.pazienteId);
        setPatient(patientData);
      }
      
    } catch {
      setError('Errore nel caricamento dei dati del piano alimentare');
      enqueueSnackbar('Errore nel caricamento dei dati del piano alimentare', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDay = async (dayIndex) => {
    try {
      await dietService.addOrGetMealDay(id, dayIndex);
      // Ricarica i dati per aggiornare la vista
      await loadMealPlanData();
      enqueueSnackbar(`Giorno ${dayIndex} aggiunto con successo`, { variant: 'success' });
    } catch {
      enqueueSnackbar(`Errore nell'aggiunta del giorno ${dayIndex}`, { variant: 'error' });
    }
  };

  const handleEditDay = (day) => {
    navigate(`/piani-alimentari/giorni/${day.id}/modifica`);
  };

  const handleDeletePlan = async () => {
    try {
      await dietService.deleteMealPlan(id);
      enqueueSnackbar('Piano alimentare eliminato con successo', { variant: 'success' });
      navigate('/piani-alimentari');
    } catch {
      enqueueSnackbar('Errore nell\'eliminazione del piano alimentare', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case 'COLAZIONE':
        return <Breakfast />;
      case 'PRANZO':
        return <LunchDining />;
      case 'CENA':
        return <DinnerDining />;
      case 'SNACK':
        return <LocalCafe />;
      default:
        return <Restaurant />;
    }
  };

  const getMealTypeLabel = (mealType) => {
    switch (mealType) {
      case 'COLAZIONE':
        return 'Colazione';
      case 'PRANZO':
        return 'Pranzo';
      case 'CENA':
        return 'Cena';
      case 'SNACK':
        return 'Spuntino';
      default:
        return mealType;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getAvailableDays = () => {
    const existingDays = mealPlan?.giorni?.map(day => day.dayIndex) || [];
    const availableDays = [];
    
    for (let i = 1; i <= 7; i++) {
      if (!existingDays.includes(i)) {
        availableDays.push(i);
      }
    }
    
    return availableDays;
  };

  const getDayName = (dayIndex) => {
    const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    return days[dayIndex - 1] || `Giorno ${dayIndex}`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !mealPlan) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Piano alimentare non trovato'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/piani-alimentari')}
        >
          Torna ai Piani Alimentari
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton
          onClick={() => navigate('/piani-alimentari')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {mealPlan.titolo}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Piano alimentare dettagliato
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          sx={{ mr: 1 }}
          onClick={() => navigate(`/piani-alimentari/${id}/modifica`)}
        >
          Modifica
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Elimina
        </Button>
      </Box>

      {/* Plan Info */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Informazioni Piano
            </Typography>
            
            {patient && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Person sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body1">
                  Paziente: <strong>{patient.nome} {patient.cognome}</strong>
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body1">
                Creato il: <strong>{formatDate(mealPlan.dataCreazione || new Date())}</strong>
              </Typography>
            </Box>

            {mealPlan.note && (
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Notes sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="subtitle1" fontWeight="medium">
                    Note del Piano:
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {mealPlan.note}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistiche Piano
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Restaurant />
                    </ListItemIcon>
                    <ListItemText
                      primary="Giorni pianificati"
                      secondary={`${mealPlan.giorni?.length || 0} / 7`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarToday />
                    </ListItemIcon>
                    <ListItemText
                      primary="Stato"
                      secondary={
                        <Chip 
                          label="Attivo" 
                          size="small" 
                          color="success" 
                        />
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Days Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            Giorni del Piano ({mealPlan.giorni?.length || 0})
          </Typography>
          {getAvailableDays().length > 0 && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                const availableDays = getAvailableDays();
                if (availableDays.length > 0) {
                  handleAddDay(availableDays[0]);
                }
              }}
            >
              Aggiungi Giorno
            </Button>
          )}
        </Box>

        {/* Days Grid */}
        {mealPlan.giorni && mealPlan.giorni.length > 0 ? (
          <Grid container spacing={3}>
            {mealPlan.giorni
              .sort((a, b) => a.dayIndex - b.dayIndex)
              .map((day) => (
                <Grid item xs={12} md={6} lg={4} key={day.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          {getDayName(day.dayIndex)}
                        </Typography>
                        <Chip 
                          label={`Giorno ${day.dayIndex}`} 
                          size="small" 
                          color="primary" 
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {day.items?.length || 0} items programmati
                      </Typography>

                      {/* Items grouped by meal type */}
                      {day.items && day.items.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          {['COLAZIONE', 'PRANZO', 'CENA', 'SNACK'].map(mealType => {
                            const itemsForMeal = day.items.filter(item => item.mealType === mealType);
                            if (itemsForMeal.length === 0) return null;
                            
                            return (
                              <Accordion key={mealType} sx={{ mb: 1 }}>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {getMealTypeIcon(mealType)}
                                    <Typography sx={{ ml: 1 }}>
                                      {getMealTypeLabel(mealType)} ({itemsForMeal.length})
                                    </Typography>
                                  </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <List dense>
                                    {itemsForMeal.map(item => (
                                      <ListItem key={item.id}>
                                        <ListItemText
                                          primary={`Alimento ID: ${item.foodId}`}
                                          secondary={`${item.quantity}${item.unit}`}
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </AccordionDetails>
                              </Accordion>
                            );
                          })}
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<Edit />}
                          onClick={() => handleEditDay(day)}
                        >
                          Modifica
                        </Button>
                        <Button
                          size="small"
                          startIcon={<Add />}
                          onClick={() => navigate(`/piani-alimentari/giorni/${day.id}/items/nuovo`)}
                        >
                          Aggiungi Item
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nessun giorno pianificato
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Inizia aggiungendo il primo giorno al piano alimentare
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleAddDay(1)}
            >
              Aggiungi Primo Giorno
            </Button>
          </Paper>
        )}
      </Box>

      {/* Available Days to Add */}
      {getAvailableDays().length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Giorni Disponibili
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {getAvailableDays().map(dayIndex => (
              <Button
                key={dayIndex}
                variant="outlined"
                onClick={() => handleAddDay(dayIndex)}
                startIcon={<Add />}
              >
                {getDayName(dayIndex)}
              </Button>
            ))}
          </Box>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare il piano alimentare{' '}
            <strong>{mealPlan.titolo}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione eliminerà anche tutti i giorni e gli items associati.
            L'operazione non può essere annullata.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annulla
          </Button>
          <Button onClick={handleDeletePlan} color="error" variant="contained">
            Elimina Piano
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MealPlanDetail;