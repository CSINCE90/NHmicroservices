import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// Layout
import Layout from './components/layout/layout';
import PrivateRoute from './components/layout/PrivateRoute';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';

// Pages - Dashboard
import Dashboard from './pages/Dashboard';

// Pages - Patients
import Patients from './pages/Patients';
import PatientDetail from './pages/PatientDetail';
import EditPatient from './pages/EditPatient';
import DeletePatient from './pages/DeletePatient';

// Pages - Foods
import Foods from './pages/foods';
import FoodDetail from './pages/FoodDetails';
import EditFood from './pages/EditFood';
import DeleteFood from './pages/DeleteFood';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Rotte pubbliche */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Rotte protette con Layout */}
      <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rotte Pazienti */}
        <Route path="/pazienti" element={<Patients />} />
        <Route path="/pazienti/:id" element={<PatientDetail />} />
        <Route path="/pazienti/:id/modifica" element={<EditPatient />} />
        <Route path="/pazienti/:id/elimina" element={<DeletePatient />} />
        
        {/* Rotte Alimenti */}
        <Route path="/alimenti" element={<Foods />} />
        <Route path="/alimenti/:id" element={<FoodDetail />} />
        <Route path="/alimenti/:id/modifica" element={<EditFood />} />
        <Route path="/alimenti/:id/elimina" element={<DeleteFood />} />
      </Route>
      
      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;