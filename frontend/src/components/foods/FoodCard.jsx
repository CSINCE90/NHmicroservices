import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Divider,
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  LocalDining,
  Whatshot,
  FitnessCenter,
  Grain,
  WaterDrop,
} from '@mui/icons-material';

const FoodCard = ({ food, onEdit, onDelete, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(food);
  };

  const handleDelete = () => {
    handleMenuClose();
    onDelete(food);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(food);
    }
  };

  const getMacroIcon = (type) => {
    switch (type) {
      case 'calories':
        return <Whatshot sx={{ fontSize: 16, color: 'error.main' }} />;
      case 'protein':
        return <FitnessCenter sx={{ fontSize: 16, color: 'primary.main' }} />;
      case 'carbs':
        return <Grain sx={{ fontSize: 16, color: 'warning.main' }} />;
      case 'fat':
        return <WaterDrop sx={{ fontSize: 16, color: 'info.main' }} />;
      default:
        return null;
    }
  };

  const formatMacro = (value, unit = 'g') => {
    if (value === null || value === undefined) return '0';
    return `${Number(value).toFixed(1)}${unit}`;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: onSelect ? 'translateY(-2px)' : 'none',
          boxShadow: onSelect ? 4 : 1,
        }
      }}
      onClick={handleCardClick}
    >
      {/* Immagine o placeholder */}
      <CardMedia
        sx={{ 
          height: 140, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: food.photoUrl ? 'transparent' : 'grey.100'
        }}
        image={food.photoUrl}
        title={food.name}
      >
        {!food.photoUrl && (
          <LocalDining sx={{ fontSize: 60, color: 'grey.400' }} />
        )}
      </CardMedia>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" gutterBottom noWrap>
            {food.name}
          </Typography>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 1 }}
          >
            <MoreVert />
          </IconButton>
        </Box>

        {/* Valori nutrizionali per 100g */}
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Per 100g:
        </Typography>
        
        <Grid container spacing={1} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {getMacroIcon('calories')}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {formatMacro(food.calories, ' kcal')}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {getMacroIcon('protein')}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {formatMacro(food.protein)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {getMacroIcon('carbs')}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {formatMacro(food.carbs)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {getMacroIcon('fat')}
              <Typography variant="body2" sx={{ ml: 0.5 }}>
                {formatMacro(food.fat)}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Categoria calorica */}
        <Box sx={{ mt: 2 }}>
          {food.calories && (
            <Chip 
              label={
                food.calories < 100 ? 'Basso contenuto calorico' :
                food.calories < 300 ? 'Medio contenuto calorico' :
                'Alto contenuto calorico'
              }
              size="small"
              color={
                food.calories < 100 ? 'success' :
                food.calories < 300 ? 'warning' : 'error'
              }
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      <Divider />
      
      <CardActions sx={{ px: 2, py: 1 }}>
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
        {onSelect && (
          <Button 
            size="small" 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(food);
            }}
          >
            Seleziona
          </Button>
        )}
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
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

export default FoodCard;