import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

const MealDayCard = ({ day, onEdit }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Day {day.dayIndex}</Typography>
        <Typography variant="body2" color="textSecondary">
          {day.mealItems?.length || 0} meal items
        </Typography>
        <Button 
          variant="outlined" 
          sx={{ mt: 1 }}
          onClick={onEdit}
        >
          Edit Meals
        </Button>
      </CardContent>
    </Card>
  );
};

export default MealDayCard;