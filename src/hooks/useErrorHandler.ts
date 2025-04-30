import { useCallback } from 'react';
import { useErrorDialog } from '../context/ErrorDialogContext';

export const useErrorHandler = () => {
  const { showError } = useErrorDialog();

  const handleError = useCallback((error: unknown, title?: string) => {
    console.error('Error caught by useErrorHandler:', error);
    
    let errorMessage = 'Bilinmeyen bir hata oluştu.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      if (error.stack) {
        errorMessage += '\n\n' + error.stack;
      }
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      try {
        errorMessage = JSON.stringify(error, null, 2);
      } catch (e) {
        errorMessage = 'Hata nesnesi serileştirilemedi.';
      }
    }
    
    showError(errorMessage, title || 'Hata');
  }, [showError]);

  return { handleError };
};