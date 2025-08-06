import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { patientService } from '../services/patientService';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { ArrowBack, Delete } from '@mui/icons-material';

const DeletePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await patientService.getPatient(id);
        setPatient(data);
      } catch {
        enqueueSnackbar('Errore nel caricamento del paziente', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, enqueueSnackbar]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await patientService.deletePatient(id);
      enqueueSnackbar('Paziente eliminato con successo', { variant: 'success' });
      navigate('/pazienti');
    } catch {
      enqueueSnackbar('Errore nell\'eliminazione del paziente', { variant: 'error' });
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!patient) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" color="error">
            Paziente non trovato
          </Typography>
        </Paper>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/pazienti')}>
          Torna ai Pazienti
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Conferma Eliminazione
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Sei sicuro di voler eliminare il paziente:
        </Typography>

        <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 1, mb: 2 }}>
          <Typography variant="subtitle1">
            {patient.nome} {patient.cognome}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {patient.email || 'Email non specificata'}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Questa azione è irreversibile e rimuoverà definitivamente il paziente e le sue informazioni.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            component={RouterLink}
            to={`/pazienti/${id}`}
            disabled={deleting}
          >
            Annulla
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Eliminazione...' : 'Elimina Paziente'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default DeletePatient;