import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  Person,
  MoreVert,
  Edit,
  Delete,
  Visibility,
  Phone,
  Email,
  Cake,
} from '@mui/icons-material';

const PatientCard = ({ patient, onEdit, onDelete, onView }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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

  const handleCardClick = () => {
    navigate(`/pazienti/${patient.id}`);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(patient);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(patient);
  };

  const handleView = () => {
    handleMenuClose();
    onView ? onView(patient) : navigate(`/pazienti/${patient.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        }
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: 'primary.main', 
              mr: 2,
              width: 56,
              height: 56,
            }}
          >
            {getInitials(patient.nome, patient.cognome)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              {patient.nome} {patient.cognome}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Cake sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {calculateAge(patient.dataNascita)} anni
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e);
            }}
            size="small"
          >
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ mb: 2 }}>
          {patient.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {patient.email}
              </Typography>
            </Box>
          )}
          {patient.telefono && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" color="text.secondary">
                {patient.telefono}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <Chip 
            label={`${patient.altezza || 0} cm`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={`${patient.peso || 0} kg`} 
            size="small" 
            variant="outlined" 
          />
          {patient.obiettivo && (
            <Chip 
              label={patient.obiettivo} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          )}
        </Box>

        <Typography variant="caption" color="text.secondary">
          Registrato: {formatDate(patient.dataCreazione)}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button 
          size="small" 
          startIcon={<Visibility />}
          onClick={(e) => {
            e.stopPropagation();
            handleView();
          }}
        >
          Dettagli
        </Button>
        <Button 
          size="small" 
          startIcon={<Edit />}
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
        >
          Modifica
        </Button>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={handleView}>
          <Visibility sx={{ mr: 1 }} />
          Visualizza
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit sx={{ mr: 1 }} />
          Modifica
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Elimina
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default PatientCard;