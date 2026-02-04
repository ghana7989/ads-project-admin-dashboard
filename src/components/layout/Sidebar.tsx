import { useLocation, useNavigate } from 'react-router';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TvIcon from '@mui/icons-material/Tv';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';

interface SidebarProps {
  drawerWidth: number;
  mobileOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Clients', icon: <TvIcon />, path: '/clients' },
  { text: 'Videos', icon: <VideoLibraryIcon />, path: '/videos' },
  { text: 'Sequences', icon: <AccountTreeIcon />, path: '/sequences' },
  { text: 'Layouts', icon: <ViewQuiltIcon />, path: '/layouts' },
];

export default function Sidebar({ drawerWidth, mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const drawerContent = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
          Run-Ads
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                onClose();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
