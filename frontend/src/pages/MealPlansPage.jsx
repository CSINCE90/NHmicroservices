import React, { useState, useEffect } from 'react';
import { dietService } from '../services/dietService';
import { Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from '@mui/material';
import PageHeader from '../components/layout/PageHeader';

const MealPlansPage = () => {
  const [mealPlans, setMealPlans] = useState([]);

  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        const data = await dietService.getAllMealPlans();
        setMealPlans(data);
      } catch (error) {
        console.error('Error fetching meal plans:', error);
      }
    };
    fetchMealPlans();
  }, []);

  return (
    <Box>
      <PageHeader title="Meal Plans" />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Patient</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mealPlans.map(plan => (
            <TableRow key={plan.id}>
              <TableCell>{plan.titolo}</TableCell>
              <TableCell>{plan.pazienteId}</TableCell>
              <TableCell>
                <Button variant="outlined">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button variant="contained" color="primary" sx={{ mt: 2 }}>
        Create New Meal Plan
      </Button>
    </Box>
  );
};

export default MealPlansPage;