import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, TOPBAR_HEIGHT } from '../../utils/constants';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0f172a' }}>
      <Sidebar />
      <TopNavbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${TOPBAR_HEIGHT}px`,
          p: { xs: 2, md: 3 },
          transition: 'margin-left 0.3s ease',
          minHeight: `calc(100vh - ${TOPBAR_HEIGHT}px)`,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth}px)`,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
