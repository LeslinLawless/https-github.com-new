import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  LinearProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const mockModules = [
  {
    id: 1,
    title: 'Financial Freedom Basics',
    description: 'Learn the fundamentals of personal finance and wealth building.',
    category: 'Finance',
    duration: '2 hours',
    progress: 75,
    image: 'https://source.unsplash.com/random/400x200?finance',
    lessons: [
      { id: 1, title: 'Budgeting Basics', completed: true },
      { id: 2, title: 'Saving Strategies', completed: true },
      { id: 3, title: 'Investment Fundamentals', completed: false },
      { id: 4, title: 'Debt Management', completed: false },
    ],
  },
  {
    id: 2,
    title: 'Productivity Mastery',
    description: 'Master techniques to boost your productivity and achieve more.',
    category: 'Productivity',
    duration: '1.5 hours',
    progress: 30,
    image: 'https://source.unsplash.com/random/400x200?productivity',
    lessons: [
      { id: 1, title: 'Time Management', completed: true },
      { id: 2, title: 'Goal Setting', completed: false },
      { id: 3, title: 'Focus Techniques', completed: false },
    ],
  },
  // Add more modules as needed
];

function Learning() {
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call
      setModules(mockModules);
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
    setLoading(false);
  };

  const handleStartModule = (module) => {
    setSelectedModule(module);
    setOpenDialog(true);
  };

  const handleCompleteLesson = async (moduleId, lessonId) => {
    try {
      // TODO: Implement API call
      const updatedModules = modules.map(module => {
        if (module.id === moduleId) {
          const updatedLessons = module.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return { ...lesson, completed: true };
            }
            return lesson;
          });
          return {
            ...module,
            lessons: updatedLessons,
            progress: (updatedLessons.filter(l => l.completed).length / updatedLessons.length) * 100,
          };
        }
        return module;
      });
      setModules(updatedModules);
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Learning Modules</Typography>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          {modules.map((module) => (
            <Grid item xs={12} md={6} key={module.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={module.image}
                  alt={module.title}
                />
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>{module.title}</Typography>
                    <Chip
                      label={module.category}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={module.duration}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {module.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Progress: {module.progress}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={module.progress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    startIcon={<PlayCircleOutlineIcon />}
                    onClick={() => handleStartModule(module)}
                    fullWidth
                  >
                    Continue Learning
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Module Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedModule?.title}
          <Typography variant="subtitle1" color="text.secondary">
            {selectedModule?.description}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {selectedModule?.lessons.map((lesson) => (
              <Box
                key={lesson.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  borderBottom: '1px solid #eee',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {lesson.completed ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <PlayCircleOutlineIcon sx={{ mr: 1 }} />
                  )}
                  <Typography>{lesson.title}</Typography>
                </Box>
                {!lesson.completed && (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleCompleteLesson(selectedModule.id, lesson.id)}
                  >
                    Complete
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Learning;
