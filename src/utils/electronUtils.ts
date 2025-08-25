
import type { ElectronAPI } from '../types/electron';

// Utility functions for Electron environment detection and API access
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

export const getElectronAPI = (): ElectronAPI | null => {
  if (isElectron()) {
    return window.electronAPI!;
  }
  return null;
};

export const showErrorDialog = async (title: string, message: string): Promise<void> => {
  const electronAPI = getElectronAPI();
  if (electronAPI) {
    await electronAPI.showErrorDialog(title, message);
  } else {
    // Fallback for web version
    alert(`${title}: ${message}`);
  }
};

export const showInfoDialog = async (title: string, message: string): Promise<void> => {
  const electronAPI = getElectronAPI();
  if (electronAPI) {
    await electronAPI.showInfoDialog(title, message);
  } else {
    // Fallback for web version
    alert(`${title}: ${message}`);
  }
};

// Platform detection
export const getPlatform = (): string => {
  const electronAPI = getElectronAPI();
  if (electronAPI) {
    return electronAPI.platform;
  }
  return navigator.platform;
};

// Check if we're on Windows (useful for printer compatibility)
export const isWindows = (): boolean => {
  const platform = getPlatform();
  return platform.toLowerCase().includes('win');
};

// Check if we're on macOS
export const isMac = (): boolean => {
  const platform = getPlatform();
  return platform.toLowerCase().includes('darwin') || platform.toLowerCase().includes('mac');
};

// Check if we're on Linux
export const isLinux = (): boolean => {
  const platform = getPlatform();
  return platform.toLowerCase().includes('linux');
};
