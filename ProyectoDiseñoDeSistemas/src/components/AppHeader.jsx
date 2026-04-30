import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, InputBase,
  Box, Avatar, Menu, MenuItem, Chip, Badge, Tooltip, Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useApp } from '../context/AppContext';
import { PAGE_LABELS } from '../config/navigation';

const AppHeader = () => {
  const { user, currentPage, toggleSidebar, logout } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const pageTitle = PAGE_LABELS[currentPage] || 'Dashboard';

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 99 }}>
      <Toolbar sx={{ gap: 2, minHeight: { xs: 60, sm: 64 } }}>
        {/* Sidebar toggle */}
        <IconButton
          id="sidebar-toggle-btn"
          onClick={toggleSidebar}
          size="small"
          sx={{ color: '#B8A882', '&:hover': { color: '#E8A020', background: 'rgba(232,160,32,0.1)' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page title */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#F5ECD7', fontSize: { xs: '0.9rem', sm: '1.05rem' }, lineHeight: 1.2 }}
          >
            {pageTitle}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6B5F44', display: { xs: 'none', sm: 'block' } }}>
            Sistema de Gestión de Fábrica de Pastas
          </Typography>
        </Box>

        {/* Search */}
        <Box sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          background: 'rgba(232,160,32,0.07)',
          border: '1px solid rgba(232,160,32,0.15)',
          borderRadius: '10px',
          px: 1.5,
          py: 0.6,
          gap: 1,
          width: 220,
          '&:focus-within': {
            border: '1px solid rgba(232,160,32,0.4)',
            background: 'rgba(232,160,32,0.1)',
          },
          transition: 'all 0.2s',
        }}>
          <SearchIcon sx={{ color: '#6B5F44', fontSize: 18 }} />
          <InputBase
            id="header-search-input"
            placeholder="Buscar..."
            sx={{ color: '#F5ECD7', fontSize: '0.875rem', flex: 1, '& input::placeholder': { color: '#6B5F44' } }}
          />
        </Box>

        {/* Notifications */}
        <Tooltip title="Notificaciones" arrow>
          <IconButton
            id="notifications-btn"
            size="small"
            sx={{ color: '#B8A882', '&:hover': { color: '#E8A020', background: 'rgba(232,160,32,0.1)' } }}
          >
            <Badge badgeContent={3} color="error" variant="dot">
              <NotificationsNoneIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Role chip */}
        <Chip
          icon={user?.role === 'admin' ? <AdminPanelSettingsIcon sx={{ fontSize: '14px !important' }} /> : undefined}
          label={user?.role === 'cliente' ? 'Cliente' : 'Admin'}
          size="small"
          sx={{
            display: { xs: 'none', sm: 'flex' },
            background: user?.role === 'admin'
              ? 'rgba(192,57,43,0.2)'
              : 'rgba(232,160,32,0.15)',
            color: user?.role === 'admin' ? '#E74C3C' : '#E8A020',
            border: `1px solid ${user?.role === 'admin' ? 'rgba(192,57,43,0.35)' : 'rgba(232,160,32,0.3)'}`,
            fontWeight: 600,
            fontSize: '0.72rem',
          }}
        />

        {/* Avatar / User menu */}
        <Tooltip title={user?.name || 'Usuario'} arrow>
          <IconButton
            id="user-menu-btn"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{ p: 0.3 }}
          >
            <Avatar
              sx={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, #E8A020, #B57A10)',
                fontSize: '0.8rem', fontWeight: 700,
                color: '#1A1200',
                boxShadow: '0 2px 8px rgba(232,160,32,0.4)',
              }}
            >
              {user?.avatar}
            </Avatar>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            sx: {
              mt: 1,
              background: 'rgba(28, 20, 8, 0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(232,160,32,0.2)',
              borderRadius: '14px',
              minWidth: 200,
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#F5ECD7', fontSize: '0.9rem' }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B5F44' }}>
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            id="profile-menu-item"
            onClick={() => setAnchorEl(null)}
            sx={{ gap: 1.5, color: '#B8A882', '&:hover': { color: '#F5ECD7', background: 'rgba(232,160,32,0.08)' } }}
          >
            <AccountCircleIcon fontSize="small" />
            Mi Perfil
          </MenuItem>
          <MenuItem
            id="logout-menu-item"
            onClick={() => { setAnchorEl(null); logout(); }}
            sx={{ gap: 1.5, color: '#E74C3C', '&:hover': { background: 'rgba(192,57,43,0.1)' } }}
          >
            <LogoutIcon fontSize="small" />
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
