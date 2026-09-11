import { useState } from 'react';
import {
  Box, List, ListItemButton, ListItemIcon, ListItemText,
  Collapse, Divider, Typography, Tooltip,
} from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useApp } from '../../context/AppContext';
import { CLIENT_NAV, ADMIN_NAV } from '../../config/navigation';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED = 72;

const NavItem = ({ item, level = 0, collapsed }) => {
  const { currentPage, navigate } = useApp();
  const [open, setOpen] = useState(true);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = currentPage === item.id;

  if (hasChildren) {
    return (
      <>
        <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
          <ListItemButton
            onClick={() => !collapsed && setOpen((p) => !p)}
            sx={{
              borderRadius: '10px',
              mx: 1,
              my: '2px',
              px: collapsed ? 1.5 : 1.5,
              py: 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{
              minWidth: collapsed ? 0 : 36,
              color: 'primary.main',
              justifyContent: 'center',
            }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    color: 'primary.main',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                  }}
                />
                {open ? <ExpandLessIcon sx={{ color: 'primary.main', fontSize: 18 }} /> : <ExpandMoreIcon sx={{ color: 'text.secondary', fontSize: 18 }} />}
              </>
            )}
          </ListItemButton>
        </Tooltip>
        {!collapsed && (
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <NavItem key={child.id} item={child} level={level + 1} collapsed={collapsed} />
              ))}
            </List>
          </Collapse>
        )}
      </>
    );
  }

  return (
    <Tooltip title={collapsed ? item.label : ''} placement="right" arrow>
      <ListItemButton
        selected={isSelected}
        onClick={() => navigate(item.id)}
        sx={{
          borderRadius: '10px',
          mx: 1,
          my: '2px',
          pl: collapsed ? 1.5 : level > 0 ? 3 : 1.5,
          pr: 1.5,
          py: 0.85,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <ListItemIcon sx={{
          minWidth: collapsed ? 0 : 34,
          color: isSelected ? 'primary.main' : 'text.secondary',
          justifyContent: 'center',
        }}>
          <Icon fontSize="small" />
        </ListItemIcon>
        {!collapsed && (
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              fontSize: '0.855rem',
              fontWeight: isSelected ? 600 : 400,
              color: isSelected ? 'text.primary' : 'text.secondary',
            }}
          />
        )}
      </ListItemButton>
    </Tooltip>
  );
};

const AppSidebar = () => {
  const { user, sidebarOpen } = useApp();
  const collapsed = !sidebarOpen;
  const navItems = user?.role === 'cliente' ? CLIENT_NAV : ADMIN_NAV;
  const roleLabel = user?.role === 'cliente' ? 'Portal Cliente' : 'Panel Administración';

  return (
    <Box
      component="nav"
      sx={{
        width: collapsed ? DRAWER_COLLAPSED : DRAWER_WIDTH,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        zIndex: 100,
      }}
    >
      {/* Brand header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: collapsed ? 1.5 : 2.5,
        py: 2.5,
        minHeight: 64,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: '10px',
          bgcolor: 'primary.main',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          boxShadow: 3,
        }}>
          <Typography sx={{ fontSize: 18 }}>🍝</Typography>
        </Box>
        {!collapsed && (
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: 'text.primary', lineHeight: 1.2 }}>
              PastaFab
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem' }}>
              {roleLabel}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, mb: 1 }} />

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        <List disablePadding>
          {navItems.map((item) => (
            <NavItem key={item.id} item={item} collapsed={collapsed} />
          ))}
        </List>
      </Box>

      {/* Footer */}
      {!collapsed && (
        <Box sx={{ px: 2, py: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center' }}>
            PastaFab v1.0 · DSI 2025
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default AppSidebar;
