import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Agent, Alert, Event, Threat, DetectionRule } from '../types';

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: Date;
  }>;
  
  // Loading States
  loading: {
    dashboard: boolean;
    agents: boolean;
    events: boolean;
    alerts: boolean;
    threats: boolean;
    rules: boolean;
  };
  
  // Data Cache
  cache: {
    agents: Agent[];
    alerts: Alert[];
    events: Event[];
    threats: Threat[];
    rules: DetectionRule[];
    lastUpdated: Record<string, Date>;
  };
  
  // Filters
  filters: {
    events: any;
    alerts: any;
    agents: any;
  };
  
  // Real-time Data
  realtime: {
    events: Event[];
    alerts: Alert[];
    systemHealth: any;
  };
}

interface AppActions {
  // UI Actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  
  // Loading Actions
  setLoading: (key: keyof AppState['loading'], loading: boolean) => void;
  
  // Cache Actions
  setCache: <K extends keyof AppState['cache']>(key: K, data: AppState['cache'][K]) => void;
  clearCache: (key?: keyof AppState['cache']) => void;
  
  // Filter Actions
  setFilters: (type: keyof AppState['filters'], filters: any) => void;
  clearFilters: (type?: keyof AppState['filters']) => void;
  
  // Real-time Actions
  addRealtimeEvent: (event: Event) => void;
  addRealtimeAlert: (alert: Alert) => void;
  updateSystemHealth: (health: any) => void;
  clearRealtimeData: () => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()(
  immer((set, get) => ({
    // Initial State
    sidebarOpen: true,
    theme: 'light',
    notifications: [],
    loading: {
      dashboard: false,
      agents: false,
      events: false,
      alerts: false,
      threats: false,
      rules: false,
    },
    cache: {
      agents: [],
      alerts: [],
      events: [],
      threats: [],
      rules: [],
      lastUpdated: {},
    },
    filters: {
      events: {},
      alerts: {},
      agents: {},
    },
    realtime: {
      events: [],
      alerts: [],
      systemHealth: null,
    },

    // UI Actions
    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),

    setTheme: (theme) =>
      set((state) => {
        state.theme = theme;
        localStorage.setItem('theme', theme);
      }),

    addNotification: (notification) =>
      set((state) => {
        const id = Math.random().toString(36).substr(2, 9);
        state.notifications.push({
          ...notification,
          id,
          timestamp: new Date(),
        });
      }),

    removeNotification: (id) =>
      set((state) => {
        state.notifications = state.notifications.filter((n) => n.id !== id);
      }),

    clearNotifications: () =>
      set((state) => {
        state.notifications = [];
      }),

    // Loading Actions
    setLoading: (key, loading) =>
      set((state) => {
        state.loading[key] = loading;
      }),

    // Cache Actions
    setCache: (key, data) =>
      set((state) => {
        state.cache[key] = data;
        state.cache.lastUpdated[key] = new Date();
      }),

    clearCache: (key) =>
      set((state) => {
        if (key) {
          state.cache[key] = [] as any;
          delete state.cache.lastUpdated[key];
        } else {
          state.cache = {
            agents: [],
            alerts: [],
            events: [],
            threats: [],
            rules: [],
            lastUpdated: {},
          };
        }
      }),

    // Filter Actions
    setFilters: (type, filters) =>
      set((state) => {
        state.filters[type] = filters;
      }),

    clearFilters: (type) =>
      set((state) => {
        if (type) {
          state.filters[type] = {};
        } else {
          state.filters = {
            events: {},
            alerts: {},
            agents: {},
          };
        }
      }),

    // Real-time Actions
    addRealtimeEvent: (event) =>
      set((state) => {
        state.realtime.events.unshift(event);
        // Keep only last 100 events
        if (state.realtime.events.length > 100) {
          state.realtime.events = state.realtime.events.slice(0, 100);
        }
      }),

    addRealtimeAlert: (alert) =>
      set((state) => {
        state.realtime.alerts.unshift(alert);
        // Keep only last 50 alerts
        if (state.realtime.alerts.length > 50) {
          state.realtime.alerts = state.realtime.alerts.slice(0, 50);
        }
      }),

    updateSystemHealth: (health) =>
      set((state) => {
        state.realtime.systemHealth = health;
      }),

    clearRealtimeData: () =>
      set((state) => {
        state.realtime = {
          events: [],
          alerts: [],
          systemHealth: null,
        };
      }),
  }))
);

// Selectors for better performance
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useLoading = () => useAppStore((state) => state.loading);
export const useCache = () => useAppStore((state) => state.cache);
export const useFilters = () => useAppStore((state) => state.filters);
export const useRealtime = () => useAppStore((state) => state.realtime); 