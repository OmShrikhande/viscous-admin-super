import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    sidebarCollapsed: false,
    notifications: [],
    globalLoading: false,
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleSidebarCollapse: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift({
        id: Date.now(),
        read: false,
        time: new Date().toISOString(),
        ...action.payload,
      });
    },
    markNotificationRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) notif.read = true;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  toggleSidebarCollapse,
  setSidebarOpen,
  addNotification,
  markNotificationRead,
  clearNotifications,
  setGlobalLoading,
} = uiSlice.actions;
export default uiSlice.reducer;
