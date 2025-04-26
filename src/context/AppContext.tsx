import React, { createContext, useState, useContext, useEffect } from 'react';
import { Notification, Project } from '../types';

interface AppContextProps {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
  projects: Project[];
  notifications: Notification[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  isDrawerOpen: boolean;
  toggleDrawer: () => void;
  isMobile: boolean;
}

const AppContext = createContext<AppContextProps>({
  currentProject: null,
  setCurrentProject: () => {},
  projects: [],
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

// Mock project data
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'E-commerce Website',
    description: 'Testing suite for our main e-commerce platform',
    createdAt: '2023-01-15T08:00:00Z',
    updatedAt: '2023-04-20T15:30:00Z',
    members: ['1', '2', '3'],
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Test automation for our iOS and Android applications',
    createdAt: '2023-02-10T10:15:00Z',
    updatedAt: '2023-05-05T09:45:00Z',
    members: ['1', '4'],
  },
  {
    id: '3',
    name: 'Admin Dashboard',
    description: 'Testing for internal admin dashboard and management tools',
    createdAt: '2023-03-22T14:30:00Z',
    updatedAt: '2023-04-18T11:20:00Z',
    members: ['1', '2', '5'],
  },
];

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
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 960);

  // Set initial project
  useEffect(() => {
    if (projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject]);

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
        currentProject,
        setCurrentProject,
        projects,
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