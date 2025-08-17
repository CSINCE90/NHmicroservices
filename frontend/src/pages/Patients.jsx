import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { patientService } from '../services/patientService';
import PatientCard from '../components/patients/PatientCard';
import PatientForm from '../components/patients/PatientForm';
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
  Stack,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  ViewModule,
  ViewList,
  Refresh,
} from '@mui/icons-material';

const Patients = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nome');
  const [filterBy, setFilterBy] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  
  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterAndSortPatients();
  }, [patients, searchTerm, sortBy, filterBy]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch {
      setError('Errore nel caricamento dei pazienti');
      enqueueSnackbar('Errore nel caricamento dei pazienti', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPatients = () => {
    let filtered = [...patients];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(patient =>
        `${patient.nome} ${patient.cognome}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.telefono?.includes(searchTerm)
      );
    }

    // Apply category filter
    if (filterBy !== 'all') {
      switch (filterBy) {
        case 'recent': {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          filtered = filtered.filter(patient =>
            new Date(patient.dataCreazione) > oneWeekAgo
          );
          break;
        }
        case 'male':
          filtered = filtered.filter(patient => patient.sesso === 'M');
          break;
        case 'female':
          filtered = filtered.filter(patient => patient.sesso === 'F');
          break;
        default:
          break;
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return `${a.nome} ${a.cognome}`.localeCompare(`${b.nome} ${b.cognome}`);
        case 'dataCreazione':
          return new Date(b.dataCreazione) - new Date(a.dataCreazione);
        case 'eta': {
          const ageA = calculateAge(a.dataNascita);
          const ageB = calculateAge(b.dataNascita);
          return ageA - ageB;
        }
        default:
          return 0;
      }
    });

    setFilteredPatients(filtered);
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

  const handleCreatePatient = () => {
    setSelectedPatient(null);
    setFormOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setFormOpen(true);
  };

  const handleDeletePatient = (patient) => {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!patientToDelete) return;

    try {
      await patientService.deletePatient(patientToDelete.id);
      setPatients(prev => prev.filter(p => p.id !== patientToDelete.id));
      enqueueSnackbar('Paziente eliminato con successo', { variant: 'success' });
    } catch {
      enqueueSnackbar('Errore nell\'eliminazione del paziente', { variant: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setPatientToDelete(null);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      if (selectedPatient) {
        // Update existing patient
        const updatedPatient = await patientService.updatePatient(selectedPatient.id, formData);
        setPatients(prev => prev.map(p => p.id === selectedPatient.id ? updatedPatient : p));
        enqueueSnackbar('Paziente aggiornato con successo', { variant: 'success' });
      } else {
        // Create new patient
        const newPatient = await patientService.createPatient(formData);
        setPatients(prev => [...prev, newPatient]);
        enqueueSnackbar('Paziente creato con successo', { variant: 'success' });
      }
      
      setFormOpen(false);
      setSelectedPatient(null);
    } catch {
      enqueueSnackbar(
        selectedPatient ? 'Errore nell\'aggiornamento del paziente' : 'Errore nella creazione del paziente',
        { variant: 'error' }
      );
    } finally {
      setFormLoading(false);
    }
  };

  const getFilterChipLabel = () => {
    switch (filterBy) {
      case 'recent': return 'Recenti';
      case 'male': return 'Maschi';
      case 'female': return 'Femmine';
      default: return null;
    }
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
            Pazienti
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gestisci i tuoi pazienti ({filteredPatients.length} di {patients.length})
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreatePatient}
          size="large"
        >
          Nuovo Paziente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField
            fullWidth
            placeholder="Cerca pazienti..."
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

          <FormControl fullWidth>
            <InputLabel>Ordina per</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Ordina per"
            >
              <MenuItem value="nome">Nome</MenuItem>
              <MenuItem value="dataCreazione">Data creazione</MenuItem>
              <MenuItem value="eta">Età</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Filtra</InputLabel>
            <Select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              label="Filtra"
            >
              <MenuItem value="all">Tutti</MenuItem>
              <MenuItem value="recent">Recenti</MenuItem>
              <MenuItem value="male">Maschi</MenuItem>
              <MenuItem value="female">Femmine</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Tooltip title="Aggiorna">
              <IconButton onClick={loadPatients}>
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

          {(searchTerm || filterBy !== 'all') && (
            <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {searchTerm && (
                <Chip
                  label={`Ricerca: "${searchTerm}"`}
                  onDelete={() => setSearchTerm('')}
                  size="small"
                />
              )}
              {filterBy !== 'all' && (
                <Chip
                  label={`Filtro: ${getFilterChipLabel()}`}
                  onDelete={() => setFilterBy('all')}
                  size="small"
                />
              )}
            </Box>
          )}
        </Stack>
      </Paper>

      {/* Patients Grid/List */}
      {filteredPatients.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm || filterBy !== 'all' ? 'Nessun paziente trovato' : 'Nessun paziente registrato'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {searchTerm || filterBy !== 'all' 
              ? 'Prova a modificare i filtri di ricerca'
              : 'Inizia aggiungendo il tuo primo paziente'
            }
          </Typography>
          {!searchTerm && filterBy === 'all' && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreatePatient}
            >
              Aggiungi Paziente
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredPatients.map((patient) => (
            <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={patient.id}>
              <PatientCard
                patient={patient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Patient Form Dialog */}
      <Dialog open={formOpen} onClose={() => {
        setFormOpen(false);
        setSelectedPatient(null);
      }} fullWidth maxWidth="sm">
        <DialogTitle>
          {selectedPatient ? "Modifica Paziente" : "Nuovo Paziente"}
        </DialogTitle>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const data = Object.fromEntries(formData.entries());
          handleFormSubmit(data);
        }}>
          <DialogContent>
            <Stack spacing={3}>
              {/* Informazioni Personali */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Informazioni Personali
                </Typography>
                <Stack spacing={2}>
                  <TextField name="nome" label="Nome *" defaultValue={selectedPatient?.nome} fullWidth />
                  <TextField name="cognome" label="Cognome *" defaultValue={selectedPatient?.cognome} fullWidth />
                  <TextField
                    name="dataNascita"
                    label="Data di Nascita *"
                    placeholder="gg/mm/aaaa"
                    defaultValue={
                      selectedPatient?.dataNascita
                        ? new Date(selectedPatient.dataNascita).toLocaleDateString('it-IT')
                        : ''
                    }
                    fullWidth
                    onBlur={(e) => {
                      const value = e.target.value;
                      const parts = value.split('/');
                      if (parts.length === 3) {
                        const [giorno, mese, anno] = parts;
                        if (giorno && mese && anno) {
                          e.target.value = `${anno}-${mese.padStart(2,'0')}-${giorno.padStart(2,'0')}`;
                        }
                      }
                    }}
                  />
                  <FormControl fullWidth>
                    <InputLabel>Sesso</InputLabel>
                    <Select name="sesso" defaultValue={selectedPatient?.sesso || ""}>
                      <MenuItem value="M">Maschio</MenuItem>
                      <MenuItem value="F">Femmina</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>

              {/* Contatti */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Contatti
                </Typography>
                <Stack spacing={2}>
                  <TextField name="email" label="Email" type="email" defaultValue={selectedPatient?.email} fullWidth />
                  <TextField name="telefono" label="Telefono *" defaultValue={selectedPatient?.telefono} fullWidth />
                </Stack>
              </Box>

              {/* Dati Fisici */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Dati Fisici
                </Typography>
                <Stack spacing={2} direction={{ xs: "column", sm: "row" }}>
                  <TextField
                    name="altezza"
                    label="Altezza (cm)"
                    type="number"
                    defaultValue={selectedPatient?.altezza}
                    fullWidth
                  />
                  <TextField
                    name="peso"
                    label="Peso (kg)"
                    type="number"
                    defaultValue={selectedPatient?.peso}
                    fullWidth
                  />
                </Stack>
              </Box>

              {/* Obiettivi e Note */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Obiettivi e Note
                </Typography>
                <Stack spacing={2}>
                  <TextField name="obiettivo" label="Obiettivo" defaultValue={selectedPatient?.obiettivo} fullWidth />
                  <TextField
                    name="note"
                    label="Note"
                    multiline
                    rows={3}
                    defaultValue={selectedPatient?.note}
                    fullWidth
                  />
                </Stack>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              setFormOpen(false);
              setSelectedPatient(null);
            }}>Annulla</Button>
            <Button type="submit" variant="contained" color="primary" disabled={formLoading}>
              {formLoading ? <CircularProgress size={24} /> : selectedPatient ? "Aggiorna" : "Crea"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Conferma Eliminazione</DialogTitle>
        <DialogContent>
          <Typography>
            Sei sicuro di voler eliminare il paziente{' '}
            <strong>
              {patientToDelete?.nome} {patientToDelete?.cognome}
            </strong>?
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

export default Patients;