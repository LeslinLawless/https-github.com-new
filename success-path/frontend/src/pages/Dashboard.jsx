import { useState } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const [dailyStats] = useState({
    steps: 8432,
    calories: 2100,
    waterIntake: 2.5,
    activeMinutes: 45,
  });

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Steps',
        data: [7000, 8500, 6800, 9200, 8432, 7600, 8100],
        borderColor: '#4CAF50',
        tension: 0.4,
      },
    ],
  };

  return (
    <Grid container spacing={3}>
      {/* Daily Stats */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Progress
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Steps</Typography>
                <Typography variant="h4">{dailyStats.steps}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">Calories</Typography>
                <Typography variant="h4">{dailyStats.calories}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly Progress */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Weekly Progress
            </Typography>
            <Line data={chartData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Motivational Quote */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daily Inspiration
            </Typography>
            <Typography variant="body1" color="text.secondary">
              "Success is not final, failure is not fatal: it is the courage to continue that counts."
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Dashboard;
