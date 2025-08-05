import { useState } from 'react';
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
  Divider,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  CalendarToday,
  Person,
  Notes,
  Scale,
  Height,
} from '@mui/icons-material';

const VisitCard = ({ visit, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(visit);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(visit);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completata':
        return 'success';
      case 'programmata':
        return 'primary';
      case 'annullata':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              Visita del {formatDate(visit.dataVisita)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {formatTime(visit.dataVisita)}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
          >
            <MoreVert />
          </IconButton>
        </Box>

        {visit.paziente && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Person sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {visit.paziente.nome} {visit.paziente.cognome}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {visit.stato && (
            <Chip 
              label={visit.stato} 
              size="small" 
              color={getStatusColor(visit.stato)}
            />
          )}
          {visit.peso && (
            <Chip 
              icon={<Scale />}
              label={`${visit.peso} kg`} 
              size="small" 
              variant="outlined" 
            />
          )}
          {visit.altezza && (
            <Chip 
              icon={<Height />}
              label={`${visit.altezza} cm`} 
              size="small" 
              variant="outlined" 
            />
          )}
        </Box>

        {visit.note && (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Notes sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
              <Typography variant="body2" fontWeight="medium">
                Note:
              </Typography>
            </Box>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {visit.note}
            </Typography>
          </Box>
        )}

        {visit.obiettivi && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Obiettivi:
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {visit.obiettivi}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {visit.dataCreazione && `Creata: ${formatDate(visit.dataCreazione)}`}
        </Typography>
        <Box>
          <Button 
            size="small" 
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Modifica
          </Button>
        </Box>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
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

export default VisitCard;