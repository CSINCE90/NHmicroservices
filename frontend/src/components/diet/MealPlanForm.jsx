// frontend/src/components/diet/MealPlanForm.jsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from '@mui/material';
import { patientService } from '../../services/patientService';

const MealPlanForm = ({ open, onClose, onSubmit, mealPlan, loading }) => {
  const [formData, setFormData] = useState({
    pazienteId: '',
    titolo: '',
    note: '',
  });
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      loadPatients();
    }
  }, [open]);

  useEffect(() => {
    if (mealPlan) {
      setFormData({
        pazienteId: mealPlan.pazienteId || '',
        titolo: mealPlan.titolo || '',
        note: mealPlan.note || '',
      });
    } else {
      // Reset form for new meal plan
      setFormData({
        pazienteId: '',
        titolo: '',
        note: '',
      });
    }
    setErrors({});
  }, [mealPlan, open]);

  const loadPatients = async () => {
    try {
      setPatientsLoading(true);
      const data = await patientService.getAllPatients();
      setPatients(data);
    } catch (error) {
      console.error('Errore nel caricamento pazienti:', error);
    } finally {
      setPatientsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.pazienteId) {
      newErrors.pazienteId = 'Paziente richiesto';
    }

    if (!formData.titolo.trim()) {
      newErrors.titolo = 'Titolo richiesto';
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
    const pazienteId = newValue ? newValue.id : '';
    setFormData(prev => ({
      ...prev,
      pazienteId: pazienteId
    }));

    if (errors.pazienteId) {
      setErrors(prev => ({
        ...prev,
        pazienteId: ''
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

    onSubmit(formData);
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
        {mealPlan ? 'Modifica Piano Alimentare' : 'Nuovo Piano Alimentare'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            {/* Selezione paziente */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informazioni Piano
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={patients}
                getOptionLabel={(option) => `${option.nome} ${option.cognome}`}
                value={getPatientById(formData.pazienteId)}
                onChange={handlePatientChange}
                disabled={loading || patientsLoading}
                loading={patientsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="Paziente"
                    error={!!errors.pazienteId}
                    helperText={errors.pazienteId}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {patientsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props}>
                    <Box>
                      <Typography variant="body1">
                        {option.nome} {option.cognome}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.email}
                      </Typography>
                    </Box>
                  </Box>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Titolo Piano"
                value={formData.titolo}
                onChange={handleChange('titolo')}
                error={!!errors.titolo}
                helperText={errors.titolo}
                disabled={loading}
                placeholder="es. Piano Dimagrimento, Dieta Mediterranea..."
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
                placeholder="Note aggiuntive, obiettivi, indicazioni speciali..."
              />
            </Grid>

            {/* Preview paziente selezionato */}
            {formData.pazienteId && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Piano per:
                  </Typography>
                  {(() => {
                    const patient = getPatientById(formData.pazienteId);
                    if (!patient) return null;
                    
                    return (
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                          label={`${patient.nome} ${patient.cognome}`}
                          color="primary"
                        />
                        {patient.obiettivo && (
                          <Chip 
                            label={patient.obiettivo}
                            variant="outlined"
                            size="small"
                          />
                        )}
                        {patient.peso && (
                          <Chip 
                            label={`${patient.peso} kg`}
                            variant="outlined"
                            size="small"
                          />
                        )}
                      </Box>
                    );
                  })()}
                </Box>
              </Grid>
            )}
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
          {loading ? 'Salvando...' : (mealPlan ? 'Aggiorna' : 'Crea Piano')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MealPlanForm;