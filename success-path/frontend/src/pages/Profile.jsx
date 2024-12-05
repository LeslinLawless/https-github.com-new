import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Avatar,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    bio: '',
    notifications: {
      email: true,
      push: true,
      workout: true,
      diet: true,
    },
    goals: {
      dailySteps: 10000,
      weeklyWorkouts: 5,
      dailyCalories: 2000,
    },
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // TODO: Implement API call
      setProfile({
        ...profile,
        username: user?.username || '',
        email: user?.email || '',
      });
    } catch (error) {
      setError('Failed to load profile');
    }
  };

  const handleSave = async () => {
    try {
      // TODO: Implement API call
      setSuccess('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGoalChange = (goal, value) => {
    setProfile(prev => ({
      ...prev,
      goals: {
        ...prev.goals,
        [goal]: value,
      },
    }));
  };

  const handleNotificationChange = (type) => {
    setProfile(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type],
      },
    }));
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Profile Settings</Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{ width: 100, height: 100, mb: 2 }}
                  src={user?.avatar}
                />
                <Button variant="outlined" size="small">
                  Change Avatar
                </Button>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>Account Info</Typography>
                <TextField
                  fullWidth
                  label="Username"
                  value={profile.username}
                  disabled={!editing}
                  onChange={(e) => handleChange('username', e.target.value)}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={profile.email}
                  disabled={!editing}
                  onChange={(e) => handleChange('email', e.target.value)}
                  margin="normal"
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {editing ? (
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                  >
                    Save Changes
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Goals */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Fitness Goals</Typography>
              
              <TextField
                fullWidth
                label="Daily Steps"
                type="number"
                value={profile.goals.dailySteps}
                onChange={(e) => handleGoalChange('dailySteps', e.target.value)}
                disabled={!editing}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Weekly Workouts"
                type="number"
                value={profile.goals.weeklyWorkouts}
                onChange={(e) => handleGoalChange('weeklyWorkouts', e.target.value)}
                disabled={!editing}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Daily Calories"
                type="number"
                value={profile.goals.dailyCalories}
                onChange={(e) => handleGoalChange('dailyCalories', e.target.value)}
                disabled={!editing}
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Notifications</Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                    disabled={!editing}
                  />
                }
                label="Email Notifications"
              />
              
              <Divider sx={{ my: 1 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.push}
                    onChange={() => handleNotificationChange('push')}
                    disabled={!editing}
                  />
                }
                label="Push Notifications"
              />
              
              <Divider sx={{ my: 1 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.workout}
                    onChange={() => handleNotificationChange('workout')}
                    disabled={!editing}
                  />
                }
                label="Workout Reminders"
              />
              
              <Divider sx={{ my: 1 }} />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={profile.notifications.diet}
                    onChange={() => handleNotificationChange('diet')}
                    disabled={!editing}
                  />
                }
                label="Diet Tracking Reminders"
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;
