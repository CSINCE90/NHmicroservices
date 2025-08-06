import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { patientService } from '../services/patientService';
import PatientForm from '../components/patients/PatientForm';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Button,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

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

  const handleSubmit = async (formData) => {
    try {
      setFormLoading(true);
      await patientService.updatePatient(id, formData);
      enqueueSnackbar('Paziente aggiornato con successo', { variant: 'success' });
      navigate(`/pazienti/${id}`);
    } catch {
      enqueueSnackbar('Errore nell\'aggiornamento del paziente', { variant: 'error' });
    } finally {
      setFormLoading(false);
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
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
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
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          Indietro
        </Button>
        <Typography variant="h4" component="h1">
          Modifica Paziente
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <PatientForm
          open
          onClose={() => navigate(-1)}
          onSubmit={handleSubmit}
          patient={patient}
          loading={formLoading}
        />
      </Paper>
    </Container>
  );
};

export default EditPatient;