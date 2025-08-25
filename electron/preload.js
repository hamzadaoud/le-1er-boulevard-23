
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  requestSerialPort: () => ipcRenderer.invoke('request-serial-port'),
  showErrorDialog: (title, message) => ipcRenderer.invoke('show-error-dialog', title, message),
  showInfoDialog: (title, message) => ipcRenderer.invoke('show-info-dialog', title, message),
  
  // Platform detection
  platform: process.platform,
  
  // Version information
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});

// Enhanced security
window.addEventListener('DOMContentLoaded', () => {
  // Prevent navigation to external URLs
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.href.startsWith('http')) {
      e.preventDefault();
    }
  });
});
