import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Badge,
  Tooltip,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { useApp } from "../../context/AppContext";
import { PAGE_LABELS } from "../../config/navigation";

const AppHeader = () => {
  const { user, currentPage, toggleSidebar, logout, themeMode, toggleTheme } =
    useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const pageTitle = PAGE_LABELS[currentPage] || "Dashboard";

  return (
    <AppBar position="sticky" elevation={0} sx={{ zIndex: 99 }}>
      <Toolbar sx={{ gap: 2, minHeight: { xs: 60, sm: 64 } }}>
        {/* Sidebar toggle */}
        <IconButton
          id="sidebar-toggle-btn"
          onClick={toggleSidebar}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": { color: "primary.main", bgcolor: "action.hover" },
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Page title */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: { xs: "0.9rem", sm: "1.05rem" },
              lineHeight: 1.2,
            }}
          >
            {pageTitle}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: { xs: "none", sm: "block" },
            }}
          >
            Sistema de Gestión de Fábrica de Pastas
          </Typography>
        </Box>

        {/* Theme toggle */}
        <Tooltip
          title={themeMode === "dark" ? "Modo claro" : "Modo oscuro"}
          arrow
        >
          <IconButton
            id="theme-toggle-btn"
            onClick={toggleTheme}
            size="small"
            sx={{
              color: "text.secondary",
              "&:hover": {
                color: "primary.main",
                bgcolor: "action.hover",
                transform: "rotate(20deg)",
              },
              transition: "transform 0.3s",
            }}
          >
            {themeMode === "dark" ? (
              <LightModeRoundedIcon />
            ) : (
              <DarkModeRoundedIcon />
            )}
          </IconButton>
        </Tooltip>

        {/* Role chip */}
        <Chip
          icon={
            user?.role === "admin" ? (
              <AdminPanelSettingsIcon sx={{ fontSize: "14px !important" }} />
            ) : undefined
          }
          label={user?.role === "cliente" ? "Cliente" : "Admin"}
          size="small"
          color={user?.role === "admin" ? "error" : "primary"}
          variant="outlined"
          sx={{
            display: { xs: "none", sm: "flex" },
            fontWeight: 600,
            fontSize: "0.72rem",
          }}
        />

        {/* Avatar / User menu */}
        <Tooltip title={user?.name || "Usuario"} arrow>
          <IconButton
            id="user-menu-btn"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{ p: 0.3 }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                bgcolor: "primary.main",
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "primary.contrastText",
                boxShadow: 2,
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
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              mt: 1,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "14px",
              minWidth: 200,
              boxShadow: 4,
            },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                color: "text.primary",
                fontSize: "0.9rem",
              }}
            >
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            id="profile-menu-item"
            onClick={() => setAnchorEl(null)}
            sx={{
              gap: 1.5,
              color: "text.secondary",
              "&:hover": { color: "primary.main", bgcolor: "action.hover" },
            }}
          >
            <AccountCircleIcon fontSize="small" />
            Mi Perfil
          </MenuItem>
          <MenuItem
            id="logout-menu-item"
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
            sx={{
              gap: 1.5,
              color: "error.main",
              "&:hover": { bgcolor: "action.hover" },
            }}
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
