import React from 'react';
import { Box } from '@mui/material';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';

export const AppLayout = ({ children }) => (
  <Box sx={{ display: 'flex', minHeight: '100vh' }}>
    <AppSidebar />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <AppHeader />
      {children}
    </Box>
  </Box>
);

export default AppLayout;
