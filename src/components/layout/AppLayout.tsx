import { useState } from 'react';
import { Outlet } from 'react-router';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const DRAWER_WIDTH = 240;

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header drawerWidth={DRAWER_WIDTH} onMenuClick={handleDrawerToggle} />
      <Sidebar
        drawerWidth={DRAWER_WIDTH}
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: { sm: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
