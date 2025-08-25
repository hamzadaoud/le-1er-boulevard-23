import { TableOrder } from '../types';

// Générer un code-barres simple
const generateBarcode = (orderId: string): string => {
  const barcodeData = `|||| || |||| | || |||| || | |||| | || |||| |||| | || ||||`;
  return `<div style="font-family: 'Courier New', monospace; font-size: 24px; letter-spacing: 1px; text-align: center; margin: 10px 0; transform: scaleX(0.5);">${barcodeData}</div>
          <div style="font-size: 12px; text-align: center; color: #666; margin-bottom: 15px;">${orderId}</div>`;
};

export const printTableTicket = (order: TableOrder): void => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Document combiné: ticket client + copie agent (avec saut de page)
  const combinedContent = `
    <html>
    <head>
      <title>Tickets - 1er Boulevard</title>
      <style>
        @media print {
          body { margin: 0 !important; }
          .page-break { page-break-before: always; }
        }
        body {
          font-family: 'Courier New', monospace;
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: white;
          color: black;
        }
        /* Ticket client */
        .ticket {
          width: 320px;
          border: 2px solid #000;
          padding: 20px;
          text-align: center;
          margin-bottom: 30px;
        }
        .header { border-bottom: 2px solid #000; padding-bottom: 12px; margin-bottom: 12px; }
        .cafe-name { font-size: 24px; font-weight: bold; color: #000; letter-spacing: 2px; }
        .address { font-size: 14px; color: #000; }
        .order-info { margin: 15px 0; padding: 10px; background: #f8f8f8; border: 1px solid #000; border-radius: 6px; }
        .items { width: 100%; text-align: left; margin: 10px 0; }
        .item { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dotted #000; font-size: 16px; }
        .total { border-top: 2px solid #000; padding-top: 10px; margin-top: 10px; font-size: 20px; font-weight: bold; color: #000; }
        .barcode { text-align: center; margin: 12px 0; }
        .barcode div:first-child { transform: scaleX(0.5); }
        .date { font-size: 14px; color: #666; }
        .footer { margin-top: 10px; padding-top: 10px; border-top: 1px solid #000; font-size: 14px; color: #000; }
        
        /* Copie agent */
        .agent-ticket { width: 280px; border: 1px solid #000; padding: 15px; text-align: center; }
        .agent-header { border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 10px; font-weight: bold; }
        .agent-items { text-align: left; margin: 10px 0; }
        .agent-item { padding: 5px 0; border-bottom: 1px dotted #999; font-size: 14px; }
      </style>
    </head>
    <body>
      <!-- Ticket client -->
      <div class="ticket">
        <div class="header">
          <div class="cafe-name">1ER BOULEVARD</div>
          <div class="address">GUELIZ</div>
        </div>
        <div class="order-info">
          <div style="font-weight:bold;">TABLE ${order.tableNumber}</div>
          <div class="date">${formatDate(order.date)}</div>
          <div style="font-size: 14px; color: #666; margin-top: 5px;">Serveur: ${order.agentName}</div>
        </div>
        <div class="items">
          ${order.items.map(item => `
            <div class="item">
              <div>
                <div style="font-weight:bold;">${item.drinkName}</div>
                <div class="date">${item.quantity} x ${item.unitPrice.toFixed(2)} MAD</div>
              </div>
              <div style="font-weight:bold; color:#000;">${(item.quantity * item.unitPrice).toFixed(2)} MAD</div>
            </div>
          `).join('')}
        </div>
        <div class="total">TOTAL: ${order.total.toFixed(2)} MAD</div>
        <div class="barcode">${generateBarcode(order.id)}</div>
        <div class="footer">Merci de votre visite !</div>
      </div>

      <!-- Saut de page -->
      <div class="page-break"></div>

      <!-- Copie Agent (articles uniquement) -->
      <div class="agent-ticket">
        <div class="agent-header">LE 1ER BOULEVARD — COPIE AGENT</div>
        <div style="font-weight:bold; margin: 10px 0;">TABLE ${order.tableNumber}</div>
        <div class="date">${formatDate(order.date)}</div>
        <div style="font-size: 14px; color: #666; margin-top: 5px;">Agent: ${order.agentName}</div>
        <div class="agent-items">
          ${order.items.map(item => `
            <div class="agent-item">${item.drinkName} — Qté: ${item.quantity}</div>
          `).join('')}
        </div>
        <div class="barcode">${generateBarcode(order.id)}</div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank', 'width=800,height=1000');
  if (printWindow) {
    printWindow.document.write(combinedContent);
    printWindow.document.close();
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        setTimeout(() => printWindow.close(), 600);
      }, 300);
    };
  } else {
    alert("Veuillez autoriser les fenêtres popup pour imprimer le ticket.");
  }
};