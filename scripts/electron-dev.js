
const { spawn } = require('child_process');
const { createServer } = require('vite');

async function startElectronDev() {
  // Start Vite dev server
  console.log('Starting Vite dev server...');
  
  // Start Electron after Vite is ready
  setTimeout(() => {
    console.log('Starting Electron...');
    const electronProcess = spawn('npx', ['electron', '.'], {
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'development' }
    });

    electronProcess.on('close', () => {
      process.exit(0);
    });
  }, 3000); // Give Vite time to start
}

startElectronDev().catch(console.error);
