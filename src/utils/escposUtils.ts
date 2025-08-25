
// ESC/POS command utilities for thermal printers - Web Serial API only
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
  
  // Print directly to thermal printer using Web Serial API
  static print(content: string): void {
    this.printDirectly(content);
  }

  // Print both tickets directly
  static printBothTickets(clientTicket: string, agentTicket: string): void {
    this.printDirectly(clientTicket).then(() => {
      // Print agent ticket after a delay for physical separation
      setTimeout(() => {
        this.printDirectly(agentTicket);
      }, 2000);
    }).catch((error) => {
      console.error('Direct printing failed:', error);
      this.fallbackPrint(clientTicket + '\n\n' + agentTicket);
    });
  }
  
  private static async printDirectly(content: string): Promise<void> {
    // Web Serial API printing
    if ('serial' in navigator) {
      try {
        // Auto-request port if none selected
        if (!this.selectedPort) {
          console.log('[ESCPOS] Requesting serial port for thermal printer...');
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
        // Reset port on error
        this.selectedPort = null;
        
        // Show error dialog
        alert('Erreur d\'impression: Impossible de se connecter à l\'imprimante thermique. Vérifiez la connexion USB.');
        throw error;
      }
    } else {
      console.warn('Web Serial API not supported in this browser');
      this.fallbackPrint(content);
    }
  }
  
  private static fallbackPrint(content: string): void {
    // Clean content for printing
    const cleanContent = this.cleanContentForBrowser(content);
    
    // Create a hidden iframe for browser printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-1000px';
    iframe.style.left = '-1000px';
    iframe.style.width = '1px';
    iframe.style.height = '1px';
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(`
        <html>
        <head>
          <title>Print</title>
          <style>
            @page { 
              margin: 0; 
              size: 80mm auto;
            }
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 10px; 
              line-height: 1.2;
              margin: 0;
              padding: 5mm;
              width: 70mm;
            }
            .ticket-content {
              white-space: pre-line;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="ticket-content">${cleanContent}</div>
        </body>
        </html>
      `);
      iframeDoc.close();
      
      // Print after content loads
      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.print();
        }
        // Remove iframe after printing
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 100);
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
}
