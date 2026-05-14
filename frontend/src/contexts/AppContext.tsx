import { createContext, useContext, useState, ReactNode } from 'react';

interface Alert {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface AppContextType {
  alerts: Alert[];
  addAlert: (message: string, type?: Alert['type'], duration?: number) => void;
  removeAlert: (id: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);

  const addAlert = (
    message: string,
    type: Alert['type'] = 'info',
    duration: number = 4000
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const alert: Alert = { id, message, type, duration };
    setAlerts((prev) => [...prev, alert]);

    if (duration) {
      setTimeout(() => {
        removeAlert(id);
      }, duration);
    }
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  return (
    <AppContext.Provider value={{ alerts, addAlert, removeAlert, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
