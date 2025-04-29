const { webkit } = require('playwright');

// Komut satırı argümanlarını parse et
const args = process.argv.slice(2);
let port = 9224;
let headless = true;

for (const arg of args) {
  if (arg.startsWith('--port=')) {
    port = parseInt(arg.split('=')[1]);
  } else if (arg === '--no-headless') {
    headless = false;
  }
}

async function startBrowser() {
  try {
    console.log(`Starting WebKit browser on port ${port}, headless: ${headless}`);
    
    const browser = await webkit.launch({
      headless,
      args: [
        `--remote-debugging-port=${port}`,
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
    
    console.log('WebKit browser started successfully');
    
    // Browser kapanana kadar bekle
    browser.on('disconnected', () => {
      console.log('WebKit browser disconnected');
      process.exit(0);
    });
    
    // Process sinyallerini dinle
    process.on('SIGINT', async () => {
      console.log('Received SIGINT signal, closing browser');
      await browser.close();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM signal, closing browser');
      await browser.close();
      process.exit(0);
    });
    
    // Sürekli çalışması için boş bir sayfa aç
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('about:blank');
    
    console.log('WebKit browser is ready');
  } catch (error) {
    console.error('Error starting WebKit browser:', error);
    process.exit(1);
  }
}

startBrowser();
