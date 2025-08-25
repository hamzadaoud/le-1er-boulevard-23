
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
  
  // Print and return to thermal printer
  static print(content: string): void {
    // Create a blob with the ESC/POS content
    const blob = new Blob([content], { type: 'application/octet-stream' });
    
    // Try to print using Web Serial API (for direct USB connection)
    if ('serial' in navigator) {
      this.printViaSerial(content);
    } else {
      // Fallback: create downloadable file for manual printing
      this.downloadForPrinting(blob, content);
    }
  }
  
  private static async printViaSerial(content: string): Promise<void> {
    try {
      // Request serial port access
      const port = await (navigator as any).serial.requestPort();
      await port.open({ baudRate: 9600 });
      
      const writer = port.writable.getWriter();
      const encoder = new TextEncoder();
      
      await writer.write(encoder.encode(content));
      await writer.close();
      await port.close();
    } catch (error) {
      console.error('Serial printing failed:', error);
      // Fallback to download method
      const blob = new Blob([content], { type: 'application/octet-stream' });
      this.downloadForPrinting(blob, content);
    }
  }
  
  private static downloadForPrinting(blob: Blob, content: string): void {
    // Create download link for ESC/POS file
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket_${Date.now()}.txt`;
    
    // Also show preview window
    const previewWindow = window.open('', '_blank', 'width=400,height=600');
    if (previewWindow) {
      previewWindow.document.write(`
        <html>
        <head>
          <title>Aperçu Ticket Thermique</title>
          <style>
            body { 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              line-height: 1.2;
              white-space: pre-wrap;
              margin: 10px;
              background: #f0f0f0;
            }
            .thermal-preview {
              background: white;
              padding: 10px;
              border: 1px solid #ccc;
              width: 300px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <h3>Aperçu du ticket thermique</h3>
          <p>Téléchargez le fichier et imprimez-le via votre logiciel d'impression thermique.</p>
          <button onclick="window.print()">Imprimer cette prévisualisation</button>
          <hr>
          <div class="thermal-preview">${content.replace(/\n/g, '<br>').replace(/\x1b/g, '[ESC]').replace(/\x1d/g, '[GS]')}</div>
        </body>
        </html>
      `);
    }
    
    // Auto-download the ESC/POS file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
