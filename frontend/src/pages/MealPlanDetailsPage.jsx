import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { dietService } from '../services/dietService';
import { Box, Typography, Button, Grid } from '@mui/material';
import PageHeader from '../components/layout/PageHeader';
import MealDayCard from '../components/diet/MealDayCard';

const MealPlanDetailsPage = () => {
  const { id } = useParams();
  const [mealPlan, setMealPlan] = useState(null);
  const [mealDays, setMealDays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const planData = await dietService.getMealPlan(id);
        const daysData = await dietService.listMealDaysByPlan(id);
        setMealPlan(planData);
        setMealDays(daysData);
      } catch (error) {
        console.error('Error fetching meal plan details:', error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <Box>
      <PageHeader title={mealPlan?.titolo || 'Meal Plan'} />
      <Typography variant="body1" sx={{ mb: 3 }}>{mealPlan?.note}</Typography>
      
      <Grid container spacing={3}>
        {mealDays.map(day => (
          <Grid item xs={12} md={6} key={day.id}>
            <MealDayCard 
              day={day} 
              onEdit={() => console.log('Edit day', day.id)} 
            />
          </Grid>
        ))}
      </Grid>
      
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => console.log('Add new day')}>
        Add New Day
      </Button>
    </Box>
  );
};

export default MealPlanDetailsPage;