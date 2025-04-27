import React, { useState, useEffect } from 'react';
import api from '../services_old/api';

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
  const { data: testRuns, loading: testRunsLoading } = useApi(() => api.getTestRuns());
  const { data: testResults, loading: testResultsLoading } = useApi(() => api.getTestResults());
  const { data: testCategories } = useApi(() => api.getCategories());
  const { data: testPriorities } = useApi(() => api.getPriorities());
  const { data: testStatuses } = useApi(() => api.getStatuses());
  const { data: testEnvironments } = useApi(() => api.getEnvironments());
  const { data: testFeatures } = useApi(() => api.getFeatures());

  // Generate execution time data based on test results
  const executionTimeData = React.useMemo(() => {
    if (!testResults || testResults.length === 0) {
      return Array(7).fill(0);
    }

    // Get the last 7 days of test durations
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    // Calculate average duration for each day
    return last7Days.map(day => {
      const dayResults = testResults.filter(result => {
        const resultDate = new Date(result.startTime || result.createdAt);
        resultDate.setHours(0, 0, 0, 0);
        return resultDate.getTime() === day;
      });

      if (dayResults.length === 0) return 0;

      const totalDuration = dayResults.reduce((sum, result) => sum + (result.duration || 0), 0);
      return Math.round((totalDuration / dayResults.length) / 1000); // Convert to seconds
    });
  }, [testResults]);

  // Generate test counts by day based on test runs
  const testCountsByDay = React.useMemo(() => {
    if (!testRuns || testRuns.length === 0) {
      return {
        passed: Array(7).fill(0),
        failed: Array(7).fill(0),
        pending: Array(7).fill(0),
        blocked: Array(7).fill(0)
      };
    }

    // Get the last 7 days
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

    // Initialize counts
    const counts = {
      passed: Array(7).fill(0),
      failed: Array(7).fill(0),
      pending: Array(7).fill(0),
      blocked: Array(7).fill(0)
    };

    // Count tests by status for each day
    testRuns.forEach(run => {
      const runDate = new Date(run.startTime || run.createdAt);
      runDate.setHours(0, 0, 0, 0);
      const dayIndex = last7Days.findIndex(day => day === runDate.getTime());

      if (dayIndex !== -1 && run.results) {
        // Count by status
        run.results.forEach((result: { status: string; }) => {
          const status = result.status.toLowerCase();
          if (status === 'passed' || status === 'pass') {
            counts.passed[dayIndex]++;
          } else if (status === 'failed' || status === 'fail') {
            counts.failed[dayIndex]++;
          } else if (status === 'pending') {
            counts.pending[dayIndex]++;
          } else if (status === 'blocked') {
            counts.blocked[dayIndex]++;
          }
        });
      }
    });

    return counts;
  }, [testRuns]);

  return {
    testCases,
    testRuns,
    testResults,
    testCategories,
    testPriorities,
    testStatuses,
    testEnvironments,
    testFeatures,
    executionTimeData,
    testCountsByDay,
    loading: testCasesLoading || testRunsLoading || testResultsLoading,
    error: testCasesError
  };
}

export default useApi;
