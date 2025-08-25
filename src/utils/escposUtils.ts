
// ESC/POS command utilities for thermal printers (RONGTA RP330 series)
export class ESCPOSFormatter {
  // ESC/POS control commands
  static readonly ESC = '\x1b';
  static readonly GS = '\x1d';
  static readonly LF = '\n';
  static readonly CR = '\r';
  
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
  
  // Paper cutting
  static cutPaper(): string {
    return this.GS + 'V1'; // Full cut
  }
  
  static partialCut(): string {
    return this.GS + 'V0'; // Partial cut
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
  
  private static async printDirectly(content: string): Promise<void> {
    // Method 1: Try Web Serial API for direct USB connection
    if ('serial' in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        await port.open({ baudRate: 9600 });
        
        const writer = port.writable.getWriter();
        const encoder = new TextEncoder();
        
        await writer.write(encoder.encode(content));
        await writer.close();
        await port.close();
        
        console.log('Ticket printed successfully via Serial API');
        return;
      } catch (error) {
        console.warn('Serial printing failed:', error);
      }
    }
    
    // Method 2: Try direct browser printing with cleaned content
    try {
      const printFrame = document.createElement('iframe');
      printFrame.style.display = 'none';
      document.body.appendChild(printFrame);
      
      const printDocument = printFrame.contentDocument;
      if (printDocument) {
        // Clean content for display
        const cleanContent = content
          .replace(/\x1b@/g, '') // Remove init
          .replace(/\x1bR0/g, '') // Remove character set
          .replace(/\x1b![0-9\x00-\x30]/g, '') // Remove text size commands
          .replace(/\x1bE[01]/g, '') // Remove bold commands
          .replace(/\x1ba[0-2]/g, '') // Remove alignment commands
          .replace(/\x1b3./g, '') // Remove line spacing
          .replace(/\x1d[hHwVk]./g, '') // Remove barcode and cut commands
          .replace(/\x1dV[01]/g, '') // Remove cut commands
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
          
        printDocument.write(`
          <html>
            <head><title>Print Ticket</title></head>
            <body style="font-family: 'Courier New', monospace; white-space: pre-line; text-align: center; font-size: 12px;">${cleanContent}</body>
          </html>
        `);
        printDocument.close();
        
        printFrame.contentWindow?.print();
        
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
        
        console.log('Ticket sent to printer via browser print');
        return;
      }
    } catch (error) {
      console.warn('Browser printing failed:', error);
    }
    
    // Method 3: Fallback - show print dialog with cleaned content
    this.showPrintDialog(content);
  }
  
  private static showPrintDialog(content: string): void {
    // Comprehensive cleaning of ESC/POS commands
    const cleanContent = content
      .replace(/\x1b@/g, '') // Remove init
      .replace(/\x1bR0/g, '') // Remove character set
      .replace(/\x1b![0-9\x00-\x30]/g, '') // Remove text size commands
      .replace(/\x1bE[01]/g, '') // Remove bold commands
      .replace(/\x1ba[0-2]/g, '') // Remove alignment commands
      .replace(/\x1b3./g, '') // Remove line spacing
      .replace(/\x1d[hHwVk]./g, '') // Remove barcode and cut commands
      .replace(/\x1dV[01]/g, '') // Remove cut commands
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

    // Create print window
    const printWindow = window.open('', '_blank', 'width=400,height=600');
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
      
      // Auto-focus and trigger print dialog
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 500);
    }
  }
}
