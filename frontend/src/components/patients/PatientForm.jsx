import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/it';

const PatientForm = ({ open, onClose, onSubmit, patient, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    dataNascita: null,
    email: '',
    telefono: '',
    altezza: '',
    peso: '',
    sesso: '',
    obiettivo: '',
    note: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      setFormData({
        nome: patient.nome || '',
        cognome: patient.cognome || '',
        dataNascita: patient.dataNascita ? dayjs(patient.dataNascita) : null,
        email: patient.email || '',
        telefono: patient.telefono || '',
        altezza: patient.altezza || '',
        peso: patient.peso || '',
        sesso: patient.sesso || '',
        obiettivo: patient.obiettivo || '',
        note: patient.note || '',
      });
    } else {
      // Reset form for new patient
      setFormData({
        nome: '',
        cognome: '',
        dataNascita: null,
        email: '',
        telefono: '',
        altezza: '',
        peso: '',
        sesso: '',
        obiettivo: '',
        note: '',
      });
    }
    setErrors({});
  }, [patient, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome richiesto';
    }

    if (!formData.cognome.trim()) {
      newErrors.cognome = 'Cognome richiesto';
    }

    if (!formData.dataNascita) {
      newErrors.dataNascita = 'Data di nascita richiesta';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email richiesta';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email non valida';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'Telefono richiesto';
    }

    if (formData.altezza && (isNaN(formData.altezza) || formData.altezza <= 0)) {
      newErrors.altezza = 'Altezza deve essere un numero positivo';
    }

    if (formData.peso && (isNaN(formData.peso) || formData.peso <= 0)) {
      newErrors.peso = 'Peso deve essere un numero positivo';
    }

    return newErrors;
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dataNascita: date
    }));

    if (errors.dataNascita) {
      setErrors(prev => ({
        ...prev,
        dataNascita: ''
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      altezza: formData.altezza ? parseFloat(formData.altezza) : null,
      peso: formData.peso ? parseFloat(formData.peso) : null,
      dataNascita: formData.dataNascita ? formData.dataNascita.format('YYYY-MM-DD') : null,
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="it">
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>
          {patient ? 'Modifica Paziente' : 'Nuovo Paziente'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {/* Informazioni personali */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informazioni Personali
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Nome"
                  value={formData.nome}
                  onChange={handleChange('nome')}
                  error={!!errors.nome}
                  helperText={errors.nome}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Cognome"
                  value={formData.cognome}
                  onChange={handleChange('cognome')}
                  error={!!errors.cognome}
                  helperText={errors.cognome}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data di Nascita"
                  value={formData.dataNascita}
                  onChange={handleDateChange}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      error: !!errors.dataNascita,
                      helperText: errors.dataNascita,
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Sesso</InputLabel>
                  <Select
                    value={formData.sesso}
                    onChange={handleChange('sesso')}
                    label="Sesso"
                    disabled={loading}
                  >
                    <MenuItem value="M">Maschio</MenuItem>
                    <MenuItem value="F">Femmina</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Contatti */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Contatti
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Telefono"
                  value={formData.telefono}
                  onChange={handleChange('telefono')}
                  error={!!errors.telefono}
                  helperText={errors.telefono}
                  disabled={loading}
                />
              </Grid>

              {/* Dati fisici */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Dati Fisici
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Altezza (cm)"
                  type="number"
                  value={formData.altezza}
                  onChange={handleChange('altezza')}
                  error={!!errors.altezza}
                  helperText={errors.altezza}
                  disabled={loading}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Peso (kg)"
                  type="number"
                  value={formData.peso}
                  onChange={handleChange('peso')}
                  error={!!errors.peso}
                  helperText={errors.peso}
                  disabled={loading}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>

              {/* Obiettivi e note */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Obiettivi e Note
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Obiettivo"
                  value={formData.obiettivo}
                  onChange={handleChange('obiettivo')}
                  disabled={loading}
                  placeholder="es. Perdita di peso, Aumento massa muscolare..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Note"
                  multiline
                  rows={3}
                  value={formData.note}
                  onChange={handleChange('note')}
                  disabled={loading}
                  placeholder="Note aggiuntive, allergie, patologie..."
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose}
            disabled={loading}
          >
            Annulla
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Salvando...' : (patient ? 'Aggiorna' : 'Crea')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default PatientForm;