
export interface ElectronAPI {
  requestSerialPort: () => Promise<{ success: boolean; error?: string }>;
  showErrorDialog: (title: string, message: string) => Promise<void>;
  showInfoDialog: (title: string, message: string) => Promise<void>;
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
