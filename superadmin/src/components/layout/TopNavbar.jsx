import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Tooltip,
  InputBase,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotifIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { setSidebarOpen } from '../../store/slices/uiSlice';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH, TOPBAR_HEIGHT } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';

const TopNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const { sidebarCollapsed } = useSelector((state) => state.ui);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [quickAnchor, setQuickAnchor] = useState(null);

  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${sidebarWidth}px)`,
        ml: `${sidebarWidth}px`,
        height: TOPBAR_HEIGHT,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(148,163,184,0.08)',
        transition: 'width 0.3s ease, margin-left 0.3s ease',
      }}
    >
      <Toolbar sx={{ height: TOPBAR_HEIGHT, px: { xs: 1, md: 3 } }}>
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={() => dispatch(setSidebarOpen(true))}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search bar */}
        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            background: 'rgba(148,163,184,0.08)',
            borderRadius: '10px',
            px: 1.5,
            py: 0.5,
            flex: 1,
            maxWidth: 400,
          }}
        >
          <SearchIcon sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search anything..."
            sx={{
              color: '#f1f5f9',
              fontSize: '0.85rem',
              flex: 1,
              '& ::placeholder': { color: '#64748b', opacity: 1 },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: '#475569',
              border: '1px solid rgba(148,163,184,0.15)',
              borderRadius: '6px',
              px: 1,
              py: 0.2,
              fontSize: '0.65rem',
              fontWeight: 600,
            }}
          >
            ⌘K
          </Typography>
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Quick Actions */}
        <Tooltip title="Quick Actions">
          <IconButton
            onClick={(e) => setQuickAnchor(e.currentTarget)}
            sx={{
              mx: 0.5,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              width: 34,
              height: 34,
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
            }}
          >
            <AddIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={quickAnchor}
          open={Boolean(quickAnchor)}
          onClose={() => setQuickAnchor(null)}
          PaperProps={{
            sx: { mt: 1, minWidth: 200, background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)' },
          }}
        >
          <MenuItem onClick={() => { setQuickAnchor(null); navigate('/colleges?action=add'); }}>
            <ListItemText>Add College</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setQuickAnchor(null); navigate('/controllers?action=add'); }}>
            <ListItemText>Add Admin</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setQuickAnchor(null); navigate('/billing?action=add'); }}>
            <ListItemText>Create Plan</ListItemText>
          </MenuItem>
        </Menu>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton
            onClick={(e) => setNotifAnchor(e.currentTarget)}
            sx={{ mx: 0.5, color: '#94a3b8', '&:hover': { color: '#f1f5f9' } }}
          >
            <Badge badgeContent={3} color="error" sx={{ '& .MuiBadge-badge': { fontSize: '0.65rem', height: 18, minWidth: 18 } }}>
              <NotifIcon sx={{ fontSize: 22 }} />
            </Badge>
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={() => setNotifAnchor(null)}
          PaperProps={{
            sx: { mt: 1, width: 320, maxHeight: 400, background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)' },
          }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#f1f5f9' }}>
              Notifications
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'rgba(148,163,184,0.1)' }} />
          {['3 colleges have expired plans', 'Server CPU at 87%', '5 new registrations pending'].map((msg, i) => (
            <MenuItem key={i} sx={{ py: 1.5, whiteSpace: 'normal' }}>
              <Typography variant="body2" sx={{ color: '#cbd5e1', fontSize: '0.8rem' }}>
                {msg}
              </Typography>
            </MenuItem>
          ))}
        </Menu>

        {/* Profile */}
        <Box
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 1,
            cursor: 'pointer',
            py: 0.5,
            px: 1,
            borderRadius: '10px',
            '&:hover': { background: 'rgba(148,163,184,0.08)' },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              fontSize: '0.8rem',
              fontWeight: 700,
            }}
          >
            {getInitials(user?.name || 'SA')}
          </Avatar>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.8rem', lineHeight: 1.2 }}>
              {user?.name || 'Super Admin'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6366f1', fontSize: '0.65rem', fontWeight: 600 }}>
              Super Admin
            </Typography>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          PaperProps={{
            sx: { mt: 1, minWidth: 200, background: '#1e293b', border: '1px solid rgba(148,163,184,0.1)' },
          }}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            <ListItemIcon><PersonIcon sx={{ color: '#94a3b8' }} /></ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
            <ListItemIcon><SettingsIcon sx={{ color: '#94a3b8' }} /></ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <Divider sx={{ borderColor: 'rgba(148,163,184,0.1)' }} />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LogoutIcon sx={{ color: '#ef4444' }} /></ListItemIcon>
            <ListItemText sx={{ '& .MuiListItemText-primary': { color: '#ef4444' } }}>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
