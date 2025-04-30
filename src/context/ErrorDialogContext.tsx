import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ErrorDialogContextType {
  showError: (message: string, title?: string) => void;
  hideError: () => void;
  isOpen: boolean;
  errorMessage: string;
  errorTitle: string;
}

const ErrorDialogContext = createContext<ErrorDialogContextType | undefined>(undefined);

interface ErrorDialogProviderProps {
  children: ReactNode;
}

export const ErrorDialogProvider: React.FC<ErrorDialogProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState('Hata');

  const showError = (message: string, title: string = 'Hata') => {
    setErrorMessage(message);
    setErrorTitle(title);
    setIsOpen(true);
  };

  const hideError = () => {
    setIsOpen(false);
  };

  return (
    <ErrorDialogContext.Provider
      value={{
        showError,
        hideError,
        isOpen,
        errorMessage,
        errorTitle
      }}
    >
      {children}
    </ErrorDialogContext.Provider>
  );
};

export const useErrorDialog = (): ErrorDialogContextType => {
  const context = useContext(ErrorDialogContext);
  if (context === undefined) {
    throw new Error('useErrorDialog must be used within an ErrorDialogProvider');
  }
  return context;
};