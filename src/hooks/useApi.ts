import { useState, useEffect } from 'react';
import api from '../services/api';

interface UseApiOptions<T> {
  initialData?: T;
  dependencies?: any[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) {
  const { initialData, dependencies = [], onSuccess, onError } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await apiCall();
        if (isMounted) {
          setData(result);
          setError(null);
          if (onSuccess) onSuccess(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          if (onError) onError(err as Error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: () => {} };
}

// Predefined hooks for common API calls
export function useTestCases() {
  return useApi(() => api.getTestCases());
}

export function useTestSuites() {
  return useApi(() => api.getTestSuites());
}

export function useTestRuns() {
  return useApi(() => api.getTestRuns());
}

export function useServerAgentStatus() {
  return useApi(() => api.getServerAgentStatus());
}

export function useUsers() {
  return useApi(() => api.getUsers());
}

export function useDashboardData() {
  const { data: testCases, loading: testCasesLoading, error: testCasesError } = useApi(() => api.getTestCases());
  const { data: testCategories } = useApi(() => api.getCategories());
  const { data: testPriorities } = useApi(() => api.getPriorities());
  const { data: testStatuses } = useApi(() => api.getStatuses());
  const { data: testEnvironments } = useApi(() => api.getEnvironments());
  const { data: testFeatures } = useApi(() => api.getFeatures());
  const { data: executionTimeData } = useApi(() => api.getExecutionTimeData());
  const { data: testCountsByDay } = useApi(() => api.getTestCountsByDay());

  return {
    testCases,
    testCategories,
    testPriorities,
    testStatuses,
    testEnvironments,
    testFeatures,
    executionTimeData,
    testCountsByDay,
    loading: testCasesLoading,
    error: testCasesError
  };
}

export default useApi;
