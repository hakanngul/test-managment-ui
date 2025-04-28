import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../../services/api';
import { TestCase } from '../../types';

// Context için tip tanımlamaları
interface TestCasesContextType {
  loading: boolean;
  error: string | null;
  testCases: TestCase[];
  metrics: {
    totalCount: number;
    activeCount: number;
    draftCount: number;
    archivedCount: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    passRate: number;
    mostUsedTags: { tag: string; count: number }[];
  };
  refreshData: () => Promise<void>;
}

// Context oluştur
const TestCasesContext = createContext<TestCasesContextType | undefined>(undefined);

// Context hook'u
export const useTestCasesData = () => {
  const context = useContext(TestCasesContext);
  if (!context) {
    throw new Error('useTestCasesData must be used within a TestCasesDataProvider');
  }
  return context;
};

// Props tipi
interface TestCasesDataProviderProps {
  children: ReactNode;
}

// Data Provider bileşeni
export const TestCasesDataProvider: React.FC<TestCasesDataProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  
  // Metrics state
  const [metrics, setMetrics] = useState({
    totalCount: 0,
    activeCount: 0,
    draftCount: 0,
    archivedCount: 0,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
    passRate: 0,
    mostUsedTags: [] as { tag: string; count: number }[]
  });

  // Fetch test cases from API
  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch test cases from API
      const data = await api.getTestCases();
      
      if (Array.isArray(data)) {
        setTestCases(data);
        
        // Calculate metrics
        const totalCount = data.length;
        const activeCount = data.filter(tc => tc.status === 'active').length;
        const draftCount = data.filter(tc => tc.status === 'draft').length;
        const archivedCount = data.filter(tc => tc.status === 'archived').length;
        
        const criticalCount = data.filter(tc => tc.priority === 'critical').length;
        const highCount = data.filter(tc => tc.priority === 'high').length;
        const mediumCount = data.filter(tc => tc.priority === 'medium').length;
        const lowCount = data.filter(tc => tc.priority === 'low').length;
        
        // Calculate pass rate
        let passRate = 0;
        const testsWithStats = data.filter(tc => tc.executionStats && tc.executionStats.totalRuns > 0);
        if (testsWithStats.length > 0) {
          const totalPassRate = testsWithStats.reduce((sum, tc) => {
            return sum + (tc.executionStats?.passRate || 0);
          }, 0);
          passRate = Math.round((totalPassRate / testsWithStats.length) * 100) / 100;
        }
        
        // Calculate most used tags
        const tagCounts: Record<string, number> = {};
        data.forEach(tc => {
          if (tc.tags && Array.isArray(tc.tags)) {
            tc.tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          }
        });
        
        const mostUsedTags = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setMetrics({
          totalCount,
          activeCount,
          draftCount,
          archivedCount,
          criticalCount,
          highCount,
          mediumCount,
          lowCount,
          passRate,
          mostUsedTags
        });
      } else {
        setTestCases([]);
        setError('Invalid data format received from API');
      }
    } catch (err) {
      console.error('Error fetching test cases:', err);
      setError('Failed to load test cases. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Context değeri
  const value: TestCasesContextType = {
    loading,
    error,
    testCases,
    metrics,
    refreshData: fetchData
  };

  return (
    <TestCasesContext.Provider value={value}>
      {children}
    </TestCasesContext.Provider>
  );
};

export default TestCasesDataProvider;
