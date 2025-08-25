// ESC/POS command utilities for thermal printers (RONGTA RP330 series)
export class ESCPOSFormatter {
  // ESC/POS control commands
  static readonly ESC = '\x1b';
  static readonly GS = '\x1d';
  static readonly LF = '\n';
  static readonly CR = '\r';
  
  // Store the selected serial port to avoid repeated prompts
  private static selectedPort: any = null;
  
  // Initialize printer
  static init(): string {
    return this.ESC + '@'; // Initialize printer
  }
  
  // Text alignment
  static alignLeft(): string {
    return this.ESC + 'a0';
  }
  
  static alignCenter(): string {
    return this.ESC + 'a1';
  }
  
  static alignRight(): string {
    return this.ESC + 'a2';
  }
  
  // Text size and style
  static textNormal(): string {
    return this.ESC + '!' + '\x00'; // Normal text
  }
  
  static textBold(): string {
    return this.ESC + 'E1'; // Bold on
  }
  
  static textBoldOff(): string {
    return this.ESC + 'E0'; // Bold off
  }
  
  static textDoubleHeight(): string {
    return this.ESC + '!' + '\x10'; // Double height
  }
  
  static textDoubleWidth(): string {
    return this.ESC + '!' + '\x20'; // Double width
  }
  
  static textLarge(): string {
    return this.ESC + '!' + '\x30'; // Double height + width
  }
  
  // Line feeds and spacing
  static newLine(): string {
    return this.LF;
  }
  
  static multipleLines(count: number): string {
    return this.LF.repeat(count);
  }
  
  static setLineSpacing(dots: number): string {
    return this.ESC + '3' + String.fromCharCode(dots);
  }
  
  // Paper cutting - RONGTA RP330 compatible commands
  static cutPaper(): string {
    // Use GS V 1 for full cut - standard for RONGTA RP330 series
    return this.GS + 'V' + String.fromCharCode(1);
  }
  
  static partialCut(): string {
    // Use GS V 0 for partial cut
    return this.GS + 'V' + String.fromCharCode(0);
  }
  
  // Character encoding
  static setCharacterSet(): string {
    return this.ESC + 'R0'; // USA character set
  }
  
  // Barcode generation (Code 128)
  static generateBarcode(data: string): string {
    const barcodeType = 73; // Code 128
    const height = 50; // Height in dots
    const width = 2; // Width multiplier
    
    return this.GS + 'h' + String.fromCharCode(height) + // Set height
           this.GS + 'w' + String.fromCharCode(width) + // Set width
           this.GS + 'H2' + // Print HRI below barcode
           this.GS + 'k' + String.fromCharCode(barcodeType) + 
           String.fromCharCode(data.length) + data;
  }
  
  // Horizontal line
  static horizontalLine(char: string = '-', width: number = 32): string {
    return char.repeat(width);
  }
  
  // Format currency
  static formatCurrency(amount: number): string {
    return amount.toFixed(2) + ' MAD';
  }
  
  // Format date for thermal printer
  static formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  // Print directly to thermal printer
  static print(content: string): void {
    // Try direct printing methods in order of preference
    this.printDirectly(content);
  }

  // Print both tickets in the same window
  static printBothTickets(clientTicket: string, agentTicket: string): void {
    // Try thermal printing first for both tickets
    this.printDirectly(clientTicket).then(() => {
      // Print agent ticket after a delay for physical separation
      setTimeout(() => {
        this.printDirectly(agentTicket);
      }, 2000);
    }).catch(() => {
      // Fallback to showing both in same window
      this.showBothTicketsDialog(clientTicket, agentTicket);
    });
  }
  
  private static async printDirectly(content: string): Promise<void> {
    // Method 1: Try Web Serial API for direct USB connection to thermal printer
    if ('serial' in navigator) {
      try {
        // Use stored port if available, otherwise request new port
        if (!this.selectedPort) {
          this.selectedPort = await (navigator as any).serial.requestPort();
        }
        
        // Check if port is already open, if not open it
        if (!this.selectedPort.readable) {
          await this.selectedPort.open({ baudRate: 9600 });
        }
        
        const writer = this.selectedPort.writable.getWriter();
        const encoder = new TextEncoder();
        
        // Send raw ESC/POS content WITH cut commands for thermal printer
        await writer.write(encoder.encode(content));
        await writer.close();
        
        console.log('Ticket printed successfully via Serial API with automatic paper cut');
        return;
      } catch (error) {
        console.warn('Serial printing failed:', error);
        // Reset port on error so user can select a different one next time
        this.selectedPort = null;
        
        // Show error dialog in Electron
        if (typeof window !== 'undefined' && (window as any).electronAPI) {
          await (window as any).electronAPI.showErrorDialog(
            'Erreur d\'impression', 
            'Impossible de se connecter à l\'imprimante thermique. Vérifiez la connexion USB.'
          );
        }
        // fall through to browser printing fallback below
      }
    }
    
    // Method 2: Reliable browser printing with a dedicated window (ensures print dialog opens)
    try {
      this.showPrintDialog(content);
      console.log('Ticket sent to printer via dedicated print window');
      return;
    } catch (error) {
      console.warn('Browser print window failed:', error);
      throw error;
    }
  }
  
  private static showBothTicketsDialog(clientTicket: string, agentTicket: string): void {
    // Clean both tickets for browser display only
    const cleanClientTicket = this.cleanContentForBrowser(clientTicket);
    const cleanAgentTicket = this.cleanContentForBrowser(agentTicket);

    const windowName = `tickets_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const printWindow = window.open('', windowName, 'width=500,height=800,scrollbars=yes,resizable=yes');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Imprimer Tickets</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              line-height: 1.4;
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .tickets-container {
              display: flex;
              flex-direction: column;
              gap: 30px;
              align-items: center;
            }
            .ticket-section {
              background: white;
              border: 2px solid #ddd;
              border-radius: 8px;
              padding: 20px;
              width: 100%;
              max-width: 350px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .ticket-header {
              background: #28a745;
              color: white;
              padding: 10px;
              margin: -20px -20px 20px -20px;
              border-radius: 6px 6px 0 0;
              text-align: center;
              font-weight: bold;
              font-size: 14px;
            }
            .ticket-content {
              white-space: pre-line;
              text-align: center;
              font-family: 'Courier New', monospace;
              font-size: 11px;
              line-height: 1.3;
            }
            .print-btn {
              background: #28a745;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 4px;
              cursor: pointer;
              margin: 20px 10px;
              font-size: 14px;
            }
            .print-btn:hover {
              background: #218838;
            }
            .print-controls {
              text-align: center;
              margin-bottom: 30px;
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            @media print {
              body { background: white; }
              .no-print { display: none; }
              .tickets-container { gap: 50px; }
              .ticket-section { 
                margin: 0; 
                padding: 20px; 
                box-shadow: none;
                border: 1px solid #000;
                page-break-inside: avoid;
              }
              .ticket-header {
                background: #000 !important;
                color: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="no-print print-controls">
            <h3>Tickets prêts à imprimer</h3>
            <button class="print-btn" onclick="window.print()">🖨️ Imprimer les deux tickets</button>
            <button class="print-btn" onclick="window.close()" style="background: #6c757d;">Fermer</button>
          </div>
          
          <div class="tickets-container">
            <div class="ticket-section">
              <div class="ticket-header">TICKET CLIENT</div>
              <div class="ticket-content">${cleanClientTicket}</div>
            </div>
            
            <div class="ticket-section">
              <div class="ticket-header">COPIE AGENT</div>
              <div class="ticket-content">${cleanAgentTicket}</div>
            </div>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }
  }

  // Clean content for browser display only (removes ESC/POS commands)
  private static cleanContentForBrowser(content: string): string {
    return content
      .replace(/\x1b@/g, '') // Remove init
      .replace(/\x1bR0/g, '') // Remove character set
      .replace(/\x1b![0-9\x00-\x30]/g, '') // Remove text size commands
      .replace(/\x1bE[01]/g, '') // Remove bold commands
      .replace(/\x1ba[0-2]/g, '') // Remove alignment commands
      .replace(/\x1b3./g, '') // Remove line spacing
      .replace(/\x1d[hHwVk]./g, '') // Remove barcode and cut commands
      .replace(/\x1dV[\x00-\x01]/g, '') // Remove cut commands (GS V 0 and GS V 1)
      .replace(/\x1dh[\x00-\xFF]*?\x1dk[\x00-\xFF]*?/g, '') // Remove complete barcode sequences
      .replace(/\x1dh.+/g, '') // Remove barcode height commands
      .replace(/\x1dw.+/g, '') // Remove barcode width commands  
      .replace(/\x1dH[0-9]/g, '') // Remove HRI position commands
      .replace(/\x1dk[\x00-\xFF]+/g, '') // Remove barcode data commands
      .replace(/[\x00-\x08\x0B-\x1F\x7F]/g, '') // Remove all control characters except \t and \n
      .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up excessive line breaks
      .replace(/^\s+|\s+$/g, '') // Trim whitespace
      .replace(/\r/g, '') // Remove carriage returns
      .trim();
  }

  // Keep old method for backward compatibility
  private static cleanContent(content: string): string {
    return this.cleanContentForBrowser(content);
  }

  private static showPrintDialog(content: string): void {
    const cleanContent = this.cleanContentForBrowser(content);

    const windowName = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const printWindow = window.open('', windowName, 'width=400,height=600,scrollbars=yes,resizable=yes');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <title>Imprimer Ticket</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              line-height: 1.4;
              margin: 0;
              padding: 20px;
            }
            .ticket-content {
              white-space: pre-line;
              text-align: center;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              width: 100%;
              max-width: 300px;
              margin: 0 auto;
            }
            .print-btn {
              background: #28a745;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 4px;
              cursor: pointer;
              margin: 20px 10px;
              font-size: 14px;
            }
            .print-btn:hover {
              background: #218838;
            }
            @media print {
              .no-print { display: none; }
              .ticket-content { margin: 0; padding: 0; }
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="text-align: center; margin-bottom: 20px;">
            <h3>Ticket prêt à imprimer</h3>
            <button class="print-btn" onclick="window.print()">🖨️ Imprimer</button>
            <button class="print-btn" onclick="window.close()" style="background: #6c757d;">Fermer</button>
          </div>
          <div class="ticket-content">${cleanContent}</div>
        </body>
        </html>
      `);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 300);
    }
  }
}
