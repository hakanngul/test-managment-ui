import React, { createContext, useState, useContext, useEffect } from 'react';
import { Notification } from '../types';

interface AppContextProps {
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  isMobile: boolean;
}

const AppContext = createContext<AppContextProps>({
  notifications: [],
  markNotificationAsRead: () => {},
  clearAllNotifications: () => {},
  isDrawerOpen: false,
  toggleDrawer: () => {},
  isMobile: false,
});

interface AppProviderProps {
  children: React.ReactNode;
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'success',
    message: 'Test run "Regression Suite" completed successfully',
    read: false,
    createdAt: '2023-05-10T09:30:00Z',
  },
  {
    id: '2',
    type: 'error',
    message: 'Test case "User Authentication" failed in production environment',
    read: false,
    createdAt: '2023-05-09T15:45:00Z',
  },
  {
    id: '3',
    type: 'info',
    message: 'New test case added to project "E-commerce Website"',
    read: true,
    createdAt: '2023-05-08T11:20:00Z',
  },
];

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 960);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 960);
      if (window.innerWidth >= 960) {
        setIsDrawerOpen(true);
      } else {
        setIsDrawerOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Set initial state

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(prev => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        isDrawerOpen,
        toggleDrawer,
        isMobile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

export default AppProvider;