import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dietService } from '../services/dietService';
import { Box, Typography, List, ListItem, Button, IconButton } from '@mui/material';
import PageHeader from '../components/layout/PageHeader';
import MealItemEditor from '../components/diet/MealItemEditor';
import AddIcon from '@mui/icons-material/Add';

const MealDayEditor = () => {
  const { dayId } = useParams();
  const [mealDay, setMealDay] = useState(null);
  const [mealItems, setMealItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dayData = await dietService.getMealDay(dayId);
        const itemsData = await dietService.listMealItemsByDay(dayId);
        setMealDay(dayData);
        setMealItems(itemsData);
      } catch (error) {
        console.error('Error fetching meal day details:', error);
      }
    };
    fetchData();
  }, [dayId]);

  const handleAddItem = () => {
    setEditingItem({
      id: null,
      foodId: '',
      quantity: 1,
      mealType: 'BREAKFAST'
    });
  };

  const handleSaveItem = async (itemData) => {
    try {
      if (itemData.id) {
        // Update existing item
        const updatedItem = await dietService.updateMealItem(itemData.id, itemData);
        setMealItems(mealItems.map(item => 
          item.id === itemData.id ? updatedItem : item
        ));
      } else {
        // Create new item
        const newItem = await dietService.createMealItem(dayId, itemData);
        setMealItems([...mealItems, newItem]);
      }
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving meal item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await dietService.deleteMealItem(itemId);
      setMealItems(mealItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting meal item:', error);
    }
  };

  return (
    <Box>
      <PageHeader title={`Editing Day ${mealDay?.dayIndex}`} />
      
      {editingItem ? (
        <MealItemEditor 
          item={editingItem} 
          onSave={handleSaveItem} 
          onCancel={() => setEditingItem(null)}
        />
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>Meal Items</Typography>
          <List>
            {mealItems.map(item => (
              <ListItem key={item.id} divider>
                <Typography sx={{ flexGrow: 1 }}>
                  {item.foodName} - {item.quantity}g
                </Typography>
                <IconButton onClick={() => setEditingItem(item)}>✏️</IconButton>
                <IconButton onClick={() => handleDeleteItem(item.id)}>🗑️</IconButton>
              </ListItem>
            ))}
          </List>
          
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleAddItem}
          >
            Add Meal Item
          </Button>
        </>
      )}
    </Box>
  );
};

export default MealDayEditor;