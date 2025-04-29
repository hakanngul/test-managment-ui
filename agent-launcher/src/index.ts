import { AgentLauncher } from './agent-launcher/agent-launcher';
import dotenv from 'dotenv';

// Ortam değişkenlerini yükle
dotenv.config();

// Agent Launcher'ı başlat
const agentLauncher = new AgentLauncher();
const PORT = parseInt(process.env.PORT || '5000');

// Uygulama başlat
agentLauncher.start(PORT);

// Beklenmeyen hataları yakala
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
