import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, type UserRole } from '@/context/AuthContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  useMediaQuery,
  useTheme,
  Button,
  Badge,
  Popover,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessIcon from '@mui/icons-material/Business';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/Info';
import WarningAmberIcon from '@mui/icons-material/Warning';
import ErrorOutlineIcon from '@mui/icons-material/Error';
import { notificationService, type NotificationData } from '@/services/notification';

export const Layout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await notificationService.getNotifications();
      if (res.success) {
        setNotifications(res.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [user]);

  const handleNotifClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotifClose = () => {
    setAnchorEl(null);
  };

  const handleMarkRead = async (id: string) => {
    try {
      const res = await notificationService.markAsRead(id);
      if (res.success) {
        setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
      }
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await notificationService.markAllAsRead();
      if (res.success) {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const openNotif = Boolean(anchorEl);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRoleChange = (e: any) => {
    const role = e.target.value as UserRole;
    switchRole(role);
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define dynamic nav items based on role
  interface NavItem {
    text: string;
    path: string;
    icon: React.ReactNode;
  }

  const getNavItems = (role?: UserRole): NavItem[] => {
    switch (role) {
      case 'student':
        return [
          { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
          { text: 'My Log Sheets', path: '/logs', icon: <AssignmentIcon /> },
          { text: 'Find Internships', path: '/search', icon: <SearchIcon /> },
          { text: 'Profile Settings', path: '/profile', icon: <PersonIcon /> },
        ];
      case 'coordinator':
        return [
          { text: 'Overview', path: '/', icon: <DashboardIcon /> },
          { text: 'Approve Logs', path: '/approve-logs', icon: <AssignmentIcon /> },
          { text: 'Student Roster', path: '/roster', icon: <PeopleIcon /> },
          { text: 'Partner Listings', path: '/partners', icon: <BusinessIcon /> },
        ];
      case 'organization':
        return [
          { text: 'Dashboard', path: '/', icon: <DashboardIcon /> },
          { text: 'Active Interns', path: '/interns', icon: <PeopleIcon /> },
          { text: 'Manage Postings', path: '/postings', icon: <PostAddIcon /> },
          { text: 'Appraisals', path: '/evaluations', icon: <AssignmentIcon /> },
        ];
      case 'admin':
        return [
          { text: 'Control Panel', path: '/', icon: <DashboardIcon /> },
          { text: 'User Accounts', path: '/users', icon: <PeopleIcon /> },
          { text: 'System Health', path: '/system', icon: <SettingsIcon /> },
          { text: 'Security Audit', path: '/audit', icon: <AdminPanelSettingsIcon /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(user?.role);

  const getRoleIcon = (role?: UserRole) => {
    switch (role) {
      case 'student': return <SchoolIcon sx={{ color: 'var(--primary)' }} />;
      case 'coordinator': return <SupervisorAccountIcon sx={{ color: 'var(--secondary)' }} />;
      case 'organization': return <BusinessIcon sx={{ color: 'var(--accent)' }} />;
      case 'admin': return <AdminPanelSettingsIcon sx={{ color: 'var(--warning)' }} />;
      default: return <PersonIcon />;
    }
  };

  const getRoleColor = (role?: UserRole) => {
    switch (role) {
      case 'student': return 'var(--primary)';
      case 'coordinator': return 'var(--secondary)';
      case 'organization': return 'var(--accent)';
      case 'admin': return 'var(--warning)';
      default: return '#fff';
    }
  };

  const sidebarContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-secondary)' }}>
      {/* Brand logo */}
      <Box sx={{ height: 'var(--header-height)', display: 'flex', alignItems: 'center', px: 3, borderBottom: '1px solid var(--border-color)' }}>
        <Typography variant="h5" sx={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box component="span" sx={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', px: 1.5, py: 0.5, borderRadius: '6px', color: '#fff', fontSize: '1.1rem' }}>S</Box>
          SIMP
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: isActive ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  borderLeft: isActive ? `3px solid ${getRoleColor(user?.role)}` : '3px solid transparent',
                  paddingLeft: isActive ? '13px' : '16px',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    color: 'var(--text-primary)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: isActive ? getRoleColor(user?.role) : 'var(--text-muted)',
                    minWidth: 40,
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} slotProps={{ primary: { style: { fontWeight: isActive ? 600 : 500, fontFamily: 'var(--font-body)' } } }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* User Session Info */}
      <Box sx={{ p: 2, borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)', border: `1px solid ${getRoleColor(user?.role)}` }}>
            {getRoleIcon(user?.role)}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: 'var(--text-muted)', display: 'block', textTransform: 'capitalize' }}>
              {user?.role} Portal
            </Typography>
          </Box>
        </Box>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            py: 0.8,
            color: 'var(--text-secondary) !important',
            borderColor: 'var(--border-color) !important',
            '&:hover': {
              borderColor: 'var(--danger) !important',
              color: 'var(--danger) !important',
              background: 'rgba(239, 68, 68, 0.05)',
            },
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top Header Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - var(--sidebar-width))` },
          ml: { md: `var(--sidebar-width)` },
          background: 'var(--bg-primary)',
          backdropFilter: 'var(--glass-blur)',
          boxShadow: 'none',
          borderBottom: '1px solid var(--border-color)',
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ height: 'var(--header-height)', justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, color: 'var(--text-primary)' }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
              {navItems.find((item) => item.path === location.pathname)?.text || 'Dashboard'}
            </Typography>
          </Box>

          {/* Quick Environment Role Switcher & Notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <>
                <IconButton onClick={handleNotifClick} sx={{ color: 'var(--text-primary)' }}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                <Popover
                  open={openNotif}
                  anchorEl={anchorEl}
                  onClose={handleNotifClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        width: 320,
                        maxHeight: 400,
                        backgroundColor: 'var(--bg-secondary) !important',
                        backgroundImage: 'none !important',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--border-radius-md)',
                        color: 'var(--text-primary)',
                        p: 0,
                        mt: 1,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                      }
                    }
                  }}
                >
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Notifications</Typography>
                    {unreadCount > 0 && (
                      <Button size="small" onClick={handleMarkAllRead} sx={{ fontSize: '0.75rem', p: 0, minWidth: 0, textTransform: 'none', color: 'var(--primary)' }}>
                        Mark all read
                      </Button>
                    )}
                  </Box>
                  <Divider sx={{ borderColor: 'var(--border-color)' }} />
                  <List sx={{ p: 0, maxHeight: 320, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                      <ListItem sx={{ py: 3, justifyContent: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>No notifications</Typography>
                      </ListItem>
                    ) : (
                      notifications.map((n) => (
                        <ListItem
                          key={n._id}
                          onClick={() => handleMarkRead(n._id)}
                          sx={{
                            py: 1.5,
                            px: 2,
                            cursor: 'pointer',
                            backgroundColor: n.isRead ? 'transparent' : 'rgba(255,255,255,0.02)',
                            borderBottom: '1px solid var(--border-color)',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.04)' },
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5
                          }}
                        >
                          <Box sx={{ mt: 0.2, display: 'flex' }}>
                            {n.type === 'success' && <CheckCircleIcon sx={{ color: 'var(--success)', fontSize: 18 }} />}
                            {n.type === 'info' && <InfoOutlinedIcon sx={{ color: 'var(--primary)', fontSize: 18 }} />}
                            {n.type === 'warning' && <WarningAmberIcon sx={{ color: 'var(--warning)', fontSize: 18 }} />}
                            {n.type === 'error' && <ErrorOutlineIcon sx={{ color: 'var(--danger)', fontSize: 18 }} />}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: n.isRead ? 500 : 700, fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                              {n.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', display: 'block', mt: 0.5, lineHeight: 1.3 }}>
                              {n.message}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))
                    )}
                  </List>
                </Popover>
              </>
            )}

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <Select
                value={user?.role || 'student'}
                onChange={handleRoleChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  height: 36,
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '&:hover': { border: '1px solid var(--border-color-hover)' },
                  '&.Mui-focused': { border: '1px solid var(--primary)' },
                  '& .MuiSelect-icon': { color: 'var(--text-secondary)' },
                }}
              >
                <MenuItem value="student">Student Account</MenuItem>
                <MenuItem value="coordinator">Coordinator Account</MenuItem>
                <MenuItem value="organization">Organization Account</MenuItem>
                <MenuItem value="admin">System Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawers */}
      <Box component="nav" sx={{ width: { md: 'var(--sidebar-width)' }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }} // Better open performance on mobile
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 'var(--sidebar-width)',
                borderRight: '1px solid var(--border-color)',
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        ) : (
          /* Desktop drawer */
          <Drawer
            variant="permanent"
            open
            sx={{
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: 'var(--sidebar-width)',
                borderRight: '1px solid var(--border-color)',
              },
            }}
          >
            {sidebarContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content Pane */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - var(--sidebar-width))` },
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          pt: 'var(--header-height)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
export default Layout;
