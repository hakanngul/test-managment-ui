import { v4 as uuidv4 } from 'uuid';
import { spawn, ChildProcess } from 'child_process';
import { Agent, AgentStatus, BrowserType, AgentHealthStatus } from '../models/Agent';

interface BrowserProcess {
  process: ChildProcess;
  port: number;
}

export class AgentManager {
  private agents: Map<string, Agent>;
  private browserProcesses: Map<string, BrowserProcess>;
  
  constructor() {
    this.agents = new Map();
    this.browserProcesses = new Map();
  }
  
  public async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }
  
  public async getDetailedAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }
  
  public async getStatus(): Promise<any> {
    const agents = Array.from(this.agents.values());
    
    const totalAgents = agents.length;
    const availableAgents = agents.filter(agent => agent.status === AgentStatus.AVAILABLE).length;
    const busyAgents = agents.filter(agent => agent.status === AgentStatus.BUSY).length;
    const offlineAgents = agents.filter(agent => agent.status === AgentStatus.OFFLINE).length;
    const errorAgents = agents.filter(agent => agent.status === AgentStatus.ERROR).length;
    const maintenanceAgents = agents.filter(agent => agent.status === AgentStatus.MAINTENANCE).length;
    
    return {
      total: totalAgents,
      available: availableAgents,
      busy: busyAgents,
      offline: offlineAgents,
      error: errorAgents,
      maintenance: maintenanceAgents,
      usageRate: totalAgents > 0 ? (busyAgents / totalAgents) * 100 : 0,
      availabilityRate: totalAgents > 0 ? (availableAgents / totalAgents) * 100 : 0,
      limit: parseInt(process.env.MAX_AGENTS || '10')
    };
  }
  
  public async findAvailableAgent(browserType: BrowserType): Promise<Agent | null> {
    for (const agent of this.agents.values()) {
      if (agent.status === AgentStatus.AVAILABLE && agent.browser === browserType) {
        return agent;
      }
    }
    
    // Uygun agent yoksa yeni bir agent oluştur
    return this.createNewAgent(browserType);
  }
  
  public async assignRequest(agentId: string, requestId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent || agent.status !== AgentStatus.AVAILABLE) {
      return false;
    }
    
    // Agent'ı meşgul olarak işaretle
    agent.status = AgentStatus.BUSY;
    agent.currentRequest = requestId;
    agent.lastActivity = new Date();
    
    // Burada gerçek agent'a istek gönderme işlemi yapılabilir
    // Bu örnek için basitleştirilmiş
    
    return true;
  }
  
  private async createNewAgent(browserType: BrowserType): Promise<Agent | null> {
    try {
      const agentId = uuidv4();
      const port = this.findAvailablePort();
      
      // Browser process'i başlat
      const browserProcess = await this.startBrowserProcess(browserType, port);
      if (!browserProcess) {
        console.error(`Failed to start browser process for ${browserType}`);
        return null;
      }
      
      // Browser process'i kaydet
      this.browserProcesses.set(agentId, browserProcess);
      
      // Yeni agent oluştur
      const agent: Agent = {
        id: agentId,
        name: `${browserType}-Agent-${agentId.substring(0, 8)}`,
        type: 'BROWSER',
        status: AgentStatus.AVAILABLE,
        browser: browserType,
        networkInfo: {
          ipAddress: '127.0.0.1'
        },
        capabilities: [browserType.toLowerCase(), 'screenshot', 'video'],
        serverId: 'server-001',
        created: new Date(),
        lastActivity: new Date(),
        currentRequest: null,
        version: '1.0.0',
        systemInfo: {
          os: process.platform === 'win32' ? 'WINDOWS' : process.platform === 'darwin' ? 'MACOS' : 'LINUX',
          osVersion: process.version,
          cpuModel: 'Generic CPU',
          cpuCores: 4,
          totalMemory: 8192, // 8GB
          totalDisk: 102400, // 100GB
          hostname: 'agent-host',
          username: 'agent-user'
        },
        performanceMetrics: {
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0,
          networkUsage: 0,
          uptime: 0,
          lastUpdated: new Date()
        },
        healthCheck: {
          status: AgentHealthStatus.HEALTHY,
          lastCheck: new Date(),
          message: 'Agent initialized successfully'
        }
      };
      
      // Agent'ı kaydet
      this.agents.set(agentId, agent);
      
      console.log(`Created new agent: ${agent.name} with browser: ${browserType}`);
      
      return agent;
    } catch (error) {
      console.error('Error creating new agent:', error);
      return null;
    }
  }
  
  private findAvailablePort(): number {
    // Basitleştirilmiş port bulma - gerçek uygulamada port kullanılabilirliği kontrol edilmeli
    return 9000 + Math.floor(Math.random() * 1000);
  }
  
  private async startBrowserProcess(browserType: BrowserType, port: number): Promise<BrowserProcess | null> {
    try {
      let browserProcess: ChildProcess;
      
      switch (browserType) {
        case BrowserType.CHROME:
          // Chromium browser başlatma
          browserProcess = spawn('node', [
            'start-chromium.js', // Bu dosya browser'ı başlatacak script
            `--port=${port}`,
            '--headless'
          ]);
          break;
          
        case BrowserType.FIREFOX:
          // Firefox browser başlatma
          browserProcess = spawn('node', [
            'start-firefox.js', // Bu dosya browser'ı başlatacak script
            `--port=${port}`,
            '--headless'
          ]);
          break;
          
        case BrowserType.SAFARI:
          // WebKit browser başlatma
          browserProcess = spawn('node', [
            'start-webkit.js', // Bu dosya browser'ı başlatacak script
            `--port=${port}`,
            '--headless'
          ]);
          break;
          
        default:
          console.error(`Unsupported browser type: ${browserType}`);
          return null;
      }
      
      // Browser process event handlers
      browserProcess.stdout.on('data', (data) => {
        console.log(`Browser process stdout: ${data}`);
      });
      
      browserProcess.stderr.on('data', (data) => {
        console.error(`Browser process stderr: ${data}`);
      });
      
      browserProcess.on('close', (code) => {
        console.log(`Browser process exited with code ${code}`);
      });
      
      return { process: browserProcess, port };
    } catch (error) {
      console.error('Error starting browser process:', error);
      return null;
    }
  }
  
  public async stopAgent(agentId: string): Promise<boolean> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      return false;
    }
    
    // Browser process'i durdur
    const browserProcess = this.browserProcesses.get(agentId);
    if (browserProcess) {
      browserProcess.process.kill();
      this.browserProcesses.delete(agentId);
    }
    
    // Agent'ı kaldır
    this.agents.delete(agentId);
    
    return true;
  }
}
