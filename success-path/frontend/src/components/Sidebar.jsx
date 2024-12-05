import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SpaIcon from '@mui/icons-material/Spa';
import { useNavigate } from 'react-router-dom';

function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DirectionsRunIcon />, path: '/' },
    { text: 'Workout Music', icon: <MusicNoteIcon />, path: '/music' },
    { text: 'Finances', icon: <AccountBalanceWalletIcon />, path: '/finances' },
    { text: 'Learning', icon: <SchoolIcon />, path: '/learning' },
    { text: 'Diet Plans', icon: <RestaurantIcon />, path: '/diet' },
    { text: 'Wellness', icon: <SpaIcon />, path: '/wellness' },
  ];

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          mt: '64px',
        },
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Sidebar;
