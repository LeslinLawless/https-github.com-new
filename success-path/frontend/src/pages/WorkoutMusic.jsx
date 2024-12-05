import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  LinearProgress,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import { contentService } from '../services/api';

const genres = [
  'High Intensity',
  'Cardio',
  'Strength Training',
  'Yoga',
  'Cool Down',
];

function WorkoutMusic() {
  const [currentGenre, setCurrentGenre] = useState('High Intensity');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playlist, setPlaylist] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlaylist(currentGenre);
  }, [currentGenre]);

  const loadPlaylist = async (genre) => {
    setLoading(true);
    try {
      const response = await contentService.getWorkoutMusic(genre);
      setPlaylist(response.data);
      if (!currentTrack && response.data.length > 0) {
        setCurrentTrack(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to load playlist:', error);
    }
    setLoading(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Workout Music
      </Typography>

      <Box sx={{ mb: 3 }}>
        {genres.map((genre) => (
          <Chip
            key={genre}
            label={genre}
            onClick={() => setCurrentGenre(genre)}
            color={currentGenre === genre ? 'primary' : 'default'}
            sx={{ mr: 1, mb: 1 }}
          />
        ))}
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Now Playing: {currentTrack?.title || 'No track selected'}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {currentGenre}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <IconButton onClick={handlePrevious}>
                    <SkipPreviousIcon />
                  </IconButton>
                  <IconButton onClick={handlePlayPause} size="large">
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                  </IconButton>
                  <IconButton onClick={handleNext}>
                    <SkipNextIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {playlist.map((track) => (
            <Grid item xs={12} sm={6} md={4} key={track.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {track.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {track.artist}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {track.duration}
                  </Typography>
                  <IconButton
                    onClick={() => {
                      setCurrentTrack(track);
                      setIsPlaying(true);
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default WorkoutMusic;
