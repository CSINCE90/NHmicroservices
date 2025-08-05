import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { patientService } from '../services/patientService';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Chip,
} from '@mui/material';
import {
  People,
  PersonAdd,
  CalendarToday,
  TrendingUp,
  Assignment,
  Schedule,
  Person,
} from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPatients: 0,
    recentPatients: [],
    upcomingVisits: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Carica i pazienti
      const patients = await patientService.getAllPatients();
      
      // Calcola statistiche
      const totalPatients = patients.length;
      const recentPatients = patients
        .sort((a, b) => new Date(b.dataCreazione) - new Date(a.dataCreazione))
        .slice(0, 5);

      // Per ora simuliamo le visite prossime (da implementare quando avremo l'endpoint)
      const upcomingVisits = [];

      setStats({
        totalPatients,
        recentPatients,
        upcomingVisits,
      });
    } catch (err) {
      setError('Errore nel caricamento dei dati della dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Benvenuto, {user?.email || 'Nutrizionista'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Pazienti Totali
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalPatients}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Visite Oggi
                  </Typography>
                  <Typography variant="h4">
                    {stats.upcomingVisits.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Nuovi Pazienti
                  </Typography>
                  <Typography variant="h4">
                    {stats.recentPatients.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Piani Attivi
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalPatients}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Azioni Rapide
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/pazienti')}
              >
                Nuovo Paziente
              </Button>
              <Button
                variant="outlined"
                startIcon={<Schedule />}
                onClick={() => navigate('/pazienti')}
              >
                Programma Visita
              </Button>
              <Button
                variant="outlined"
                startIcon={<People />}
                onClick={() => navigate('/pazienti')}
              >
                Vedi Tutti i Pazienti
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Statistiche Rapide
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Pazienti Attivi:</Typography>
                <Chip label={stats.totalPatients} size="small" color="primary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Visite Questo Mese:</Typography>
                <Chip label="0" size="small" color="secondary" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Piani Nutrizionali:</Typography>
                <Chip label={stats.totalPatients} size="small" color="success" />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Patients */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Pazienti Recenti
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/pazienti')}
              >
                Vedi Tutti
              </Button>
            </Box>
            
            {stats.recentPatients.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                Nessun paziente registrato
              </Typography>
            ) : (
              <List>
                {stats.recentPatients.map((patient, index) => (
                  <div key={patient.id}>
                    <ListItem
                      sx={{ px: 0, cursor: 'pointer' }}
                      onClick={() => navigate(`/pazienti/${patient.id}`)}
                    >
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${patient.nome} ${patient.cognome}`}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {calculateAge(patient.dataNascita)} anni
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Registrato: {formatDate(patient.dataCreazione)}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < stats.recentPatients.length - 1 && <Divider />}
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Prossime Visite
              </Typography>
              <Button size="small">
                Vedi Calendario
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              Nessuna visita programmata
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;