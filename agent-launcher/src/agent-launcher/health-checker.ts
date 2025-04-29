import { AgentManager } from './agent-manager';
import { AgentStatus } from '../models/Agent';

export class HealthChecker {
  private agentManager: AgentManager;
  
  constructor(agentManager: AgentManager) {
    this.agentManager = agentManager;
  }
  
  public async getStatus(): Promise<any> {
    const agents = await this.agentManager.getAllAgents();
    
    const totalAgents = agents.length;
    const healthyAgents = agents.filter(agent => 
      agent.status === AgentStatus.AVAILABLE || agent.status === AgentStatus.BUSY
    ).length;
    
    const errorAgents = agents.filter(agent => 
      agent.status === AgentStatus.ERROR
    ).length;
    
    const offlineAgents = agents.filter(agent => 
      agent.status === AgentStatus.OFFLINE
    ).length;
    
    const healthRate = totalAgents > 0 ? (healthyAgents / totalAgents) * 100 : 100;
    
    const status = healthRate >= 80 ? 'HEALTHY' : 
                  healthRate >= 50 ? 'WARNING' : 
                  'CRITICAL';
    
    const checks = [
      {
        name: 'Agent Health',
        status: errorAgents === 0 ? 'pass' : errorAgents < 3 ? 'warn' : 'fail',
        message: errorAgents === 0 
          ? 'All agents are healthy' 
          : `${errorAgents} agents are in error state`,
        timestamp: new Date().toISOString()
      },
      {
        name: 'Agent Availability',
        status: offlineAgents === 0 ? 'pass' : offlineAgents < 3 ? 'warn' : 'fail',
        message: offlineAgents === 0 
          ? 'All agents are online' 
          : `${offlineAgents} agents are offline`,
        timestamp: new Date().toISOString()
      },
      {
        name: 'Agent Capacity',
        status: healthRate >= 80 ? 'pass' : healthRate >= 50 ? 'warn' : 'fail',
        message: `${healthRate.toFixed(1)}% of agents are healthy`,
        timestamp: new Date().toISOString()
      }
    ];
    
    return {
      status,
      lastCheck: new Date().toISOString(),
      uptime: process.uptime(),
      message: status === 'HEALTHY' 
        ? 'All systems operational' 
        : status === 'WARNING' 
          ? 'Some systems are experiencing issues' 
          : 'Critical issues detected',
      checks
    };
  }
}
