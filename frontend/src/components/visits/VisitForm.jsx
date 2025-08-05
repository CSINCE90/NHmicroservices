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
  CircularProgress,
  Autocomplete,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/it';

const VisitForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  visit, 
  loading, 
  patients = [],
  selectedPatientId = null 
}) => {
  const [formData, setFormData] = useState({
    pazienteId: '',
    dataVisita: new Date(),
    peso: '',
    altezza: '',
    note: '',
    obiettivi: '',
    stato: 'PROGRAMMATA',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visit) {
      setFormData({
        pazienteId: visit.pazienteId || '',
        dataVisita: visit.dataVisita ? dayjs(visit.dataVisita) : dayjs(),
        peso: visit.peso || '',
        altezza: visit.altezza || '',
        note: visit.note || '',
        obiettivi: visit.obiettivi || '',
        stato: visit.stato || 'PROGRAMMATA',
      });
    } else {
      // Reset form for new visit
      setFormData({
        pazienteId: selectedPatientId || '',
        dataVisita: dayjs(),
        peso: '',
        altezza: '',
        note: '',
        obiettivi: '',
        stato: 'PROGRAMMATA',
      });
    }
    setErrors({});
  }, [visit, open, selectedPatientId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pazienteId) {
      newErrors.pazienteId = 'Paziente richiesto';
    }

    if (!formData.dataVisita) {
      newErrors.dataVisita = 'Data e ora della visita richieste';
    }

    if (formData.peso && (isNaN(formData.peso) || formData.peso <= 0)) {
      newErrors.peso = 'Il peso deve essere un numero positivo';
    }

    if (formData.altezza && (isNaN(formData.altezza) || formData.altezza <= 0)) {
      newErrors.altezza = 'L\'altezza deve essere un numero positivo';
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

  const handlePatientChange = (event, newValue) => {
    const patientId = newValue ? newValue.id : '';
    setFormData(prev => ({
      ...prev,
      pazienteId: patientId
    }));

    if (errors.pazienteId) {
      setErrors(prev => ({
        ...prev,
        pazienteId: ''
      }));
    }
  };

  const handleDateTimeChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dataVisita: date
    }));

    if (errors.dataVisita) {
      setErrors(prev => ({
        ...prev,
        dataVisita: ''
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
      peso: formData.peso ? parseFloat(formData.peso) : null,
      altezza: formData.altezza ? parseFloat(formData.altezza) : null,
      dataVisita: formData.dataVisita ? formData.dataVisita.toISOString() : null,
    };

    onSubmit(submitData);
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const getPatientById = (id) => {
    return patients.find(p => p.id === id) || null;
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
          {visit ? 'Modifica Visita' : 'Nuova Visita'}
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              {/* Selezione paziente */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informazioni Visita
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={patients}
                  getOptionLabel={(option) => `${option.nome} ${option.cognome}`}
                  value={getPatientById(formData.pazienteId)}
                  onChange={handlePatientChange}
                  disabled={loading || !!selectedPatientId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      label="Paziente"
                      error={!!errors.pazienteId}
                      helperText={errors.pazienteId}
                    />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DateTimePicker
                  label="Data e Ora Visita"
                  value={formData.dataVisita}
                  onChange={handleDateTimeChange}
                  disabled={loading}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      error: !!errors.dataVisita,
                      helperText: errors.dataVisita,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Stato</InputLabel>
                  <Select
                    value={formData.stato}
                    onChange={handleChange('stato')}
                    label="Stato"
                    disabled={loading}
                  >
                    <MenuItem value="PROGRAMMATA">Programmata</MenuItem>
                    <MenuItem value="COMPLETATA">Completata</MenuItem>
                    <MenuItem value="ANNULLATA">Annullata</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Misurazioni */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Misurazioni
                </Typography>
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

              {/* Note e obiettivi */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Note e Obiettivi
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Obiettivi"
                  multiline
                  rows={3}
                  value={formData.obiettivi}
                  onChange={handleChange('obiettivi')}
                  disabled={loading}
                  placeholder="Obiettivi per questa visita..."
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Note"
                  multiline
                  rows={4}
                  value={formData.note}
                  onChange={handleChange('note')}
                  disabled={loading}
                  placeholder="Note della visita, osservazioni, raccomandazioni..."
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
            {loading ? 'Salvando...' : (visit ? 'Aggiorna' : 'Crea')}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default VisitForm;