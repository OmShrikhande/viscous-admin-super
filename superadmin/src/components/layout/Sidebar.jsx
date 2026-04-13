import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  AdminPanelSettings as AdminIcon,
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  History as LogsIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { SIDEBAR_WIDTH, SIDEBAR_COLLAPSED_WIDTH } from '../../utils/constants';
import { toggleSidebarCollapse, setSidebarOpen } from '../../store/slices/uiSlice';

const iconMap = {
  Dashboard: DashboardIcon,
  School: SchoolIcon,
  AdminPanelSettings: AdminIcon,
  People: PeopleIcon,
  Receipt: ReceiptIcon,
  Assessment: ReportsIcon,
  Settings: SettingsIcon,
  History: LogsIcon,
};

const navItems = [
  { label: 'Dashboard', path: '/', icon: 'Dashboard' },
  { label: 'Colleges', path: '/colleges', icon: 'School' },
  { label: 'Controllers', path: '/controllers', icon: 'AdminPanelSettings' },
  { label: 'Users', path: '/users', icon: 'People' },
  { label: 'Billing', path: '/billing', icon: 'Receipt' },
  { label: 'Reports', path: '/reports', icon: 'Assessment' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
  { label: 'Logs', path: '/logs', icon: 'History' },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, sidebarCollapsed } = useSelector((state) => state.ui);
  const location = useLocation();

  const collapsed = !isMobile && sidebarCollapsed;
  const width = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  const handleClose = () => {
    if (isMobile) dispatch(setSidebarOpen(false));
  };

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Logo area */}
      <Box
        sx={{
          p: collapsed ? 1.5 : 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(148,163,184,0.08)',
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.2 }}>
                VISCOUS
              </Typography>
              <Typography variant="caption" sx={{ color: '#6366f1', fontWeight: 600, fontSize: '0.65rem', letterSpacing: '0.1em' }}>
                SUPER ADMIN
              </Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
        )}
        {!isMobile && !collapsed && (
          <IconButton
            onClick={() => dispatch(toggleSidebarCollapse())}
            size="small"
            sx={{ color: '#94a3b8', '&:hover': { color: '#f1f5f9' } }}
          >
            <CollapseIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, py: 1.5, px: collapsed ? 0.5 : 1.5 }}>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);

          return (
            <Tooltip key={item.path} title={collapsed ? item.label : ''} placement="right" arrow>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={NavLink}
                  to={item.path}
                  onClick={handleClose}
                  sx={{
                    borderRadius: collapsed ? '12px' : '12px',
                    minHeight: 44,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    px: collapsed ? 1.5 : 2,
                    mx: collapsed ? 0.5 : 0,
                    transition: 'all 0.2s ease',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(139,92,246,0.15) 100%)'
                      : 'transparent',
                    borderLeft: isActive && !collapsed ? '3px solid #6366f1' : '3px solid transparent',
                    '&:hover': {
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.2) 100%)'
                        : 'rgba(148,163,184,0.08)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 0 : 40,
                      color: isActive ? '#818cf8' : '#94a3b8',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon sx={{ fontSize: 22 }} />
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? '#f1f5f9' : '#94a3b8',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* Collapse toggle at bottom (when collapsed) */}
      {!isMobile && collapsed && (
        <Box sx={{ p: 1, borderTop: '1px solid rgba(148,163,184,0.08)' }}>
          <IconButton
            onClick={() => dispatch(toggleSidebarCollapse())}
            sx={{ color: '#94a3b8', width: '100%', '&:hover': { color: '#f1f5f9' } }}
          >
            <ExpandIcon />
          </IconButton>
        </Box>
      )}

      {/* Version */}
      {!collapsed && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(148,163,184,0.08)' }}>
          <Typography variant="caption" sx={{ color: '#475569', fontSize: '0.7rem' }}>
            Viscous Admin v2.0.0
          </Typography>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={sidebarOpen}
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
          border: 'none',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
