import { useEffect } from 'react';
import { ESCPOSFormatter } from '../utils/escposUtils';

// Custom hook to initialize printer system on app startup
export const usePrinterInitialization = () => {
  useEffect(() => {
    let mounted = true;
    
    const initializePrinters = async () => {
      try {
        console.log('[Printer Init] Starting printer system initialization...');
        await ESCPOSFormatter.initialize();
        
        if (mounted) {
          console.log('[Printer Init] Printer system initialized successfully');
        }
      } catch (error) {
        if (mounted) {
          console.warn('[Printer Init] Failed to initialize printer system:', error);
        }
      }
    };

    // Initialize printers with a small delay to ensure app is fully loaded
    const timeoutId = setTimeout(initializePrinters, 1000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);
};