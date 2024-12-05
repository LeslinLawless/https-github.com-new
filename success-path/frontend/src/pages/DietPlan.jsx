import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { PieChart } from 'react-chartjs-2';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

function DietPlan() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMealType, setSelectedMealType] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMeal, setNewMeal] = useState({
    food_item: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
  });

  useEffect(() => {
    loadMeals();
  }, [selectedDate]);

  const loadMeals = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call
      const mockMeals = [
        {
          id: 1,
          meal_type: 'Breakfast',
          food_item: 'Oatmeal with Berries',
          calories: 300,
          protein: 10,
          carbs: 45,
          fats: 8,
        },
        // Add more mock meals
      ];
      setMeals(mockMeals);
    } catch (error) {
      console.error('Failed to load meals:', error);
    }
    setLoading(false);
  };

  const handleAddMeal = async () => {
    try {
      const mealData = {
        ...newMeal,
        meal_type: mealTypes[selectedMealType],
        date: selectedDate,
      };
      // TODO: Implement API call
      setMeals([...meals, { ...mealData, id: Date.now() }]);
      setOpenDialog(false);
      setNewMeal({
        food_item: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
      });
    } catch (error) {
      console.error('Failed to add meal:', error);
    }
  };

  const calculateNutrition = () => {
    return meals.reduce(
      (acc, meal) => {
        acc.calories += parseFloat(meal.calories || 0);
        acc.protein += parseFloat(meal.protein || 0);
        acc.carbs += parseFloat(meal.carbs || 0);
        acc.fats += parseFloat(meal.fats || 0);
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  };

  const nutritionData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [
      {
        data: [
          calculateNutrition().protein * 4,
          calculateNutrition().carbs * 4,
          calculateNutrition().fats * 9,
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Diet Plan</Typography>
        <TextField
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          sx={{ width: 200 }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Nutrition Summary */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Daily Nutrition</Typography>
              <Box sx={{ height: 300 }}>
                <PieChart data={nutritionData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Nutrition Stats */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Nutrition Stats</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Calories</Typography>
                  <Typography variant="h4">{calculateNutrition().calories}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Protein (g)</Typography>
                  <Typography variant="h4">{calculateNutrition().protein}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Carbs (g)</Typography>
                  <Typography variant="h4">{calculateNutrition().carbs}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Fats (g)</Typography>
                  <Typography variant="h4">{calculateNutrition().fats}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Meal List */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  value={selectedMealType}
                  onChange={(e, newValue) => setSelectedMealType(newValue)}
                >
                  {mealTypes.map((type) => (
                    <Tab key={type} label={type} />
                  ))}
                </Tabs>
              </Box>

              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ mb: 2 }}
                  >
                    Add Food Item
                  </Button>

                  <List>
                    {meals
                      .filter((meal) => meal.meal_type === mealTypes[selectedMealType])
                      .map((meal) => (
                        <ListItem key={meal.id}>
                          <ListItemText
                            primary={meal.food_item}
                            secondary={`Calories: ${meal.calories} | Protein: ${meal.protein}g | Carbs: ${meal.carbs}g | Fats: ${meal.fats}g`}
                          />
                          <ListItemSecondaryAction>
                            <IconButton edge="end" onClick={() => handleDeleteMeal(meal.id)}>
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                  </List>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add Meal Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add Food Item</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Food Item"
            value={newMeal.food_item}
            onChange={(e) => setNewMeal({ ...newMeal, food_item: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Calories"
            type="number"
            value={newMeal.calories}
            onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Protein (g)"
            type="number"
            value={newMeal.protein}
            onChange={(e) => setNewMeal({ ...newMeal, protein: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Carbs (g)"
            type="number"
            value={newMeal.carbs}
            onChange={(e) => setNewMeal({ ...newMeal, carbs: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Fats (g)"
            type="number"
            value={newMeal.fats}
            onChange={(e) => setNewMeal({ ...newMeal, fats: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddMeal} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DietPlan;
