import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Button, 
  Grid 
} from '@mui/material';

const MealItemEditor = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    foodId: item?.foodId || '',
    foodName: item?.foodName || '',
    quantity: item?.quantity || 100,
    mealType: item?.mealType || 'BREAKFAST'
  });

  const mealTypes = [
    'BREAKFAST',
    'LUNCH',
    'DINNER',
    'SNACK'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      id: item?.id
    });
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #eee', borderRadius: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Food Name"
            name="foodName"
            value={formData.foodName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Quantity (g)"
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Meal Type</InputLabel>
            <Select
              name="mealType"
              value={formData.mealType}
              label="Meal Type"
              onChange={handleChange}
            >
              {mealTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleSubmit} sx={{ mr: 1 }}>
            Save
          </Button>
          <Button variant="outlined" onClick={onCancel}>
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MealItemEditor;