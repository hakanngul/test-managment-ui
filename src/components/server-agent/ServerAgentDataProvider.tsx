import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../../services/api';
import {
  Agent,
  QueuedRequest,
  ProcessedRequest,
  toAgent,
  toQueuedRequest,
  toProcessedRequest
} from '../../models';
import { ServerAgentSchema } from '../../models/database/schemas';

// Context için tip tanımlamaları
interface ServerAgentContextType {
  loading: boolean;
  error: string | null;
  lastUpdated: string;
  serverAgent: ServerAgentSchema | null;
  activeAgents: Agent[];
  queuedRequests: QueuedRequest[];
  processedRequests: ProcessedRequest[];
  refreshData: () => Promise<void>;
}

// Context oluştur
const ServerAgentContext = createContext<ServerAgentContextType | undefined>(undefined);

// Context hook'u
export const useServerAgentData = () => {
  const context = useContext(ServerAgentContext);
  if (!context) {
    throw new Error('useServerAgentData must be used within a ServerAgentDataProvider');
  }
  return context;
};

// Props tipi
interface ServerAgentDataProviderProps {
  children: ReactNode;
}

// Data Provider bileşeni
export const ServerAgentDataProvider: React.FC<ServerAgentDataProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState('');
  
  // Server agent state
  const [serverAgent, setServerAgent] = useState<ServerAgentSchema | null>(null);
  
  // Data lists state
  const [activeAgents, setActiveAgents] = useState<Agent[]>([]);
  const [queuedRequests, setQueuedRequests] = useState<QueuedRequest[]>([]);
  const [processedRequests, setProcessedRequests] = useState<ProcessedRequest[]>([]);

  /**
   * API'den verileri çeker
   */
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching server agent data from API...');

      // Fetch server agent data
      const serverAgentData = await api.getServerAgent();
      console.log('Server agent data:', serverAgentData);
      
      if (serverAgentData) {
        setServerAgent(serverAgentData);
        setLastUpdated(new Date(serverAgentData.lastUpdated).toLocaleString('tr-TR'));
        
        // Fetch active agents details
        if (serverAgentData.activeAgents && Array.isArray(serverAgentData.activeAgents)) {
          try {
            // Fetch full agent details for each active agent ID
            const agentPromises = (serverAgentData.activeAgents as string[]).map(agentId =>
              api.getAgentById(agentId)
            );

            const agentDetails = await Promise.all(agentPromises);
            
            // Convert and set active agents
            const activeAgentsList = agentDetails
              .filter(agent => agent) // Filter out null/undefined agents
              .map(agent => {
                // Convert string dates to Date objects for the model
                const agentWithDateObjects = {
                  ...agent,
                  created: agent.created || new Date().toISOString(),
                  lastActivity: agent.lastActivity || new Date().toISOString()
                };
                return toAgent(agentWithDateObjects);
              });
              
            setActiveAgents(activeAgentsList);
          } catch (error) {
            console.error('Error fetching agent details:', error);
            setActiveAgents([]);
          }
        }
        
        // Fetch queued requests
        try {
          console.log('Fetching queued requests...');
          const queuedRequestsData = await api.getQueuedRequests();
          console.log('Queued requests data:', queuedRequestsData);
          
          if (queuedRequestsData && Array.isArray(queuedRequestsData)) {
            // Convert and set queued requests
            const queuedRequestsList = queuedRequestsData
              .map(request => {
                // Convert string dates to Date objects for the model
                const requestWithDateObjects = {
                  ...request,
                  queuedAt: request.queuedAt || request.createdAt || new Date().toISOString(),
                  estimatedStartTime: request.estimatedStartTime || new Date(Date.now() + 60000).toISOString()
                };
                try {
                  return toQueuedRequest(requestWithDateObjects);
                } catch (error) {
                  console.error('Error converting queued request:', error);
                  // Fallback to a simpler conversion
                  return {
                    id: request.id || request._id,
                    testName: request.testName || request.name || `Test ${request.id}`,
                    status: request.status || 'queued',
                    priority: request.priority || 'low',
                    category: request.category || 'regression',
                    browser: request.browser || 'chromium',
                    queuedAt: new Date(request.queuedAt || request.createdAt || new Date()),
                    waitTime: request.waitTime || '1 dakika',
                    timing: {
                      queuedAt: new Date(request.queuedAt || request.createdAt || new Date()),
                      waitTime: request.waitTime || '1 dakika'
                    }
                  } as unknown as QueuedRequest;
                }
              });
              
            setQueuedRequests(queuedRequestsList);
          } else {
            setQueuedRequests([]);
          }
        } catch (error) {
          console.error('Error fetching queued requests:', error);
          setQueuedRequests([]);
        }
        
        // Fetch processed requests
        try {
          console.log('Fetching processed requests...');
          const processedRequestsData = await api.getProcessedRequests();
          console.log('Processed requests data:', processedRequestsData);
          
          if (processedRequestsData && Array.isArray(processedRequestsData)) {
            // Convert and set processed requests
            const processedRequestsList = processedRequestsData
              .map(request => {
                // Convert string dates to Date objects for the model
                const requestWithDateObjects = {
                  ...request,
                  startTime: request.startTime || request.startedAt || new Date(Date.now() - 300000).toISOString(),
                  endTime: request.endTime || request.completedAt || new Date(Date.now() - 240000).toISOString()
                };
                try {
                  return toProcessedRequest(requestWithDateObjects);
                } catch (error) {
                  console.error('Error converting processed request:', error);
                  // Fallback to a simpler conversion
                  return {
                    id: request.id || request._id,
                    testName: request.testName || request.name || `Test ${request.id}`,
                    status: request.status || 'completed',
                    result: request.result || 'success',
                    startTime: new Date(request.startTime || request.startedAt || new Date(Date.now() - 300000)),
                    endTime: new Date(request.endTime || request.completedAt || new Date(Date.now() - 240000)),
                    processingTime: request.processingTime || 60000,
                    duration: request.duration || '1 dakika',
                    browser: request.browser || 'chromium',
                    agentId: request.agentId || request.assignedTo || 'agent-001',
                    assignedTo: request.assignedTo || request.agentId || 'agent-001'
                  } as unknown as ProcessedRequest;
                }
              });
              
            setProcessedRequests(processedRequestsList);
          } else {
            setProcessedRequests([]);
          }
        } catch (error) {
          console.error('Error fetching processed requests:', error);
          setProcessedRequests([]);
        }
      } else {
        setError('Server agent data not found');
      }
    } catch (err) {
      console.error('Error fetching server agent data:', err);
      setError('Failed to load server agent data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Context değeri
  const value: ServerAgentContextType = {
    loading,
    error,
    lastUpdated,
    serverAgent,
    activeAgents,
    queuedRequests,
    processedRequests,
    refreshData: fetchData
  };

  return (
    <ServerAgentContext.Provider value={value}>
      {children}
    </ServerAgentContext.Provider>
  );
};

export default ServerAgentDataProvider;
