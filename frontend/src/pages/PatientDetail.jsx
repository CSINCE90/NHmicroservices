import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { patientService } from '../services/patientService';
import VisitCard from '../components/visits/VisitCard';
import VisitForm from '../components/visits/VisitForm';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  Add,
  Person,
  Email,
  Phone,
  Cake,
  Scale,
  Height,
  FlagOutlined,
  Notes,
  CalendarToday,
  Timeline,
} from '@mui/icons-material';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const [patient, setPatient] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Visit form states
  const [visitFormOpen, setVisitFormOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [visitFormLoading, setVisitFormLoading] = useState(false);
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visitToDelete, setVisitToDelete] = useState(null);

  useEffect(() => {
    if (id) {
      loadPatientData();
    }
  }, [id]);

  const loadPatientData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const patientData = await patientService.getPatient(id);
      setPatient(patientData);
      
    // 🔧 AGGIUNGI: Carica le visite reali del paziente
    try {
      const visitData = await patientService.getVisiteByPaziente(id);
      setVisits(visitData);
    } catch (visitError) {
      console.warn('Errore nel caricamento visite:', visitError);
      setVisits([]); // Fallback a lista vuota
    }
      
    } catch {
      setError('Errore nel caricamento dei dati del paziente');
      enqueueSnackbar('Errore nel caricamento dei dati del paziente', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getInitials = (nome, cognome) => {
    return `${nome?.charAt(0) || ''}${cognome?.charAt(0) || ''}`.toUpperCase();
  };

  const handleCreateVisit = () => {
    setSelectedVisit(null);
    setVisitFormOpen(true);
  };

  const handleEditVisit = (visit) => {
    setSelectedVisit(visit);
    setVisitFormOpen(true);
  };

  const handleDeleteVisit = (visit) => {
    setVisitToDelete(visit);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteVisit = async () => {
    if (!visitToDelete) return;

    try {
      // await patientService.deleteVisit(visitToDelete.id);
      setVisits(prev => prev.filter(v => v.id !== visitToDelete.id));
      enqueueSnackbar('Visita eliminata con successo', { variant: 'success' });
    } catch {
      enqueueSnackbar('Errore nell\'eliminazione della visita', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setVisitToDelete(null);
    }
  };

  const handleVisitFormSubmit = async (formData) => {
    try {
      setVisitFormLoading(true);
      
      const visitData = {
        ...formData,
        pazienteId: patient.id,
      };
      
      if (selectedVisit) {
        // Update existing visit
        // const updatedVisit = await patientService.updateVisit(selectedVisit.id, visitData);
        // setVisits(prev => prev.map(v => v.id === selectedVisit.id ? updatedVisit : v));
        enqueueSnackbar('Visita aggiornata con successo', { variant: 'success' });
      } else {
        // Create new visit
        const newVisit = await patientService.createVisit(visitData);
        setVisits(prev => [...prev, newVisit]);
        enqueueSnackbar('Visita creata con successo', { variant: 'success' });
      }
      
      setVisitFormOpen(false);
      setSelectedVisit(null);
    } catch {
      enqueueSnackbar(
        selectedVisit ? 'Errore nell\'aggiornamento della visita' : 'Errore nella creazione della visita',
        { variant: 'error' }
      );
    } finally {
      setVisitFormLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !patient) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Paziente non trovato'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/pazienti')}
        >
          Torna ai Pazienti
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton
          onClick={() => navigate('/pazienti')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {patient.nome} {patient.cognome}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Dettagli paziente e storico visite
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Edit />}
          sx={{ mr: 1 }}
          onClick={() => navigate(`/pazienti/${id}/modifica`)}
        >
          Modifica
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => navigate(`/pazienti/${id}/elimina`)}
        >
          Elimina
        </Button>
      </Box>

      {/* Patient Info Card */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar 
                sx={{ 
                  bgcolor: 'primary.main', 
                  width: 120,
                  height: 120,
                  fontSize: '2rem',
                  mb: 2,
                }}
              >
                {getInitials(patient.nome, patient.cognome)}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {patient.nome} {patient.cognome}
              </Typography>
              <Chip 
                label={`${calculateAge(patient.dataNascita)} anni`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Email />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={patient.email || 'Non specificata'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Phone />
                    </ListItemIcon>
                    <ListItemText
                      primary="Telefono"
                      secondary={patient.telefono || 'Non specificato'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Cake />
                    </ListItemIcon>
                    <ListItemText
                      primary="Data di Nascita"
                      secondary={formatDate(patient.dataNascita)}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Scale />
                    </ListItemIcon>
                    <ListItemText
                      primary="Peso"
                      secondary={patient.peso ? `${patient.peso} kg` : 'Non specificato'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Height />
                    </ListItemIcon>
                    <ListItemText
                      primary="Altezza"
                      secondary={patient.altezza ? `${patient.altezza} cm` : 'Non specificata'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FlagOutlined />
                    </ListItemIcon>
                    <ListItemText
                      primary="Obiettivo"
                      secondary={patient.obiettivo || 'Non specificato'}
                    />
                  </ListItem>
                </List>
              </Grid>
              
              {patient.note && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Notes sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Note:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.note}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab 
            icon={<CalendarToday />} 
            label="Visite" 
            iconPosition="start"
          />
          <Tab 
            icon={<Timeline />} 
            label="Progressi" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {/* Visits Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Visite ({visits.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateVisit}
            >
              Nuova Visita
            </Button>
          </Box>

          {/* Visits Grid */}
          {visits.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Nessuna visita registrata
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Inizia programmando la prima visita per questo paziente
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleCreateVisit}
              >
                Programma Prima Visita
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {visits.map((visit) => (
                <Grid item xs={12} md={6} lg={4} key={visit.id}>
                  <VisitCard
                    visit={visit}
                    onEdit={handleEditVisit}
                    onDelete={handleDeleteVisit}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Grafici dei Progressi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Funzionalità in sviluppo - Qui verranno mostrati i grafici dell'evoluzione del peso, misurazioni e altri parametri nel tempo.
          </Typography>
        </Paper>
      )}

      {/* Visit Form Dialog */}
      <VisitForm
        open={visitFormOpen}
        onClose={() => {
          setVisitFormOpen(false);
          setSelectedVisit(null);
        }}
        onSubmit={handleVisitFormSubmit}
        visit={selectedVisit}
        loading={visitFormLoading}
        patients={[patient]}
        selectedPatientId={patient.id}
      />

      {/* Delete Visit Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare questa visita?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Questa azione non può essere annullata.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annulla
          </Button>
          <Button onClick={confirmDeleteVisit} color="error" variant="contained">
            Elimina
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientDetail;