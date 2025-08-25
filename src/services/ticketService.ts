
import { Order } from "../types";

export const generateThankYouMessage = (): string => {
  const messages = [
    "Merci pour votre visite! Nous espérons vous revoir très bientôt chez La Perle Rouge.",
    "Votre sourire est notre plus belle récompense. À très vite chez La Perle Rouge!",
    "La Perle Rouge vous remercie de votre confiance. Au plaisir de vous servir à nouveau!",
    "Un café chez La Perle Rouge, c'est un moment de bonheur à partager. Revenez vite!",
    "Merci d'avoir choisi La Perle Rouge. Nous vous attendons pour votre prochaine pause café!"
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
};

export const printTicket = (order: Order): void => {
  // Generate barcode-like pattern
  const generateBarcode = (id: string) => {
    const chars = id.split('');
    return chars.map(char => {
      const code = char.charCodeAt(0);
      const pattern = (code % 4) + 1;
      return '|'.repeat(pattern) + ' ';
    }).join('');
  };

  const barcode = generateBarcode(order.id);
  const thankYouMessage = generateThankYouMessage();

  // Combined document with page break
  const combinedTicket = `
    <html>
    <head>
      <title>Tickets - La Perle Rouge</title>
      <style>
        @media print {
          body { margin: 0 !important; }
          .page-break { page-break-before: always; }
        }
        body {
          font-family: 'Arial', 'Helvetica', sans-serif;
          margin: 0;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background-color: #f8f9fa;
          font-size: 16px;
          line-height: 1.6;
        }
        
        /* Customer ticket styles */
        .ticket {
          background: white;
          width: 400px;
          padding: 30px;
          border: 3px solid #e63946;
          border-radius: 15px;
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
          text-align: center;
          margin-bottom: 50px;
        }
        .header {
          border-bottom: 3px solid #e63946;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .cafe-name {
          font-size: 2.5rem;
          font-weight: bold;
          color: #e63946;
          margin-bottom: 8px;
          letter-spacing: 2px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 15px;
          font-style: italic;
        }
        .ticket-info {
          font-size: 1rem;
          color: #888;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .server-info {
          font-size: 1.1rem;
          color: #333;
          margin-bottom: 20px;
          font-weight: bold;
          background-color: #f8f9fa;
          padding: 10px;
          border-radius: 8px;
        }
        .items-section {
          border-top: 2px dashed #ccc;
          border-bottom: 2px dashed #ccc;
          padding: 20px 0;
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
          font-size: 1rem;
          padding: 8px 0;
        }
        .item-details {
          flex: 1;
          text-align: left;
        }
        .item-name {
          font-weight: bold;
          color: #333;
          font-size: 1.1rem;
          margin-bottom: 4px;
        }
        .item-qty {
          color: #666;
          font-size: 0.95rem;
          font-weight: 500;
        }
        .item-price {
          font-weight: bold;
          color: #e63946;
          margin-left: 15px;
          font-size: 1.1rem;
        }
        .total-section {
          margin: 25px 0;
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 12px;
          border: 3px solid #e63946;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
        }
        .total {
          font-size: 1.8rem;
          font-weight: bold;
          color: #e63946;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        .barcode-section {
          margin: 25px 0;
          padding: 20px;
          background-color: #f0f0f0;
          border-radius: 10px;
          border: 2px solid #ddd;
        }
        .barcode {
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
          letter-spacing: 1px;
          word-break: break-all;
          color: #333;
          margin-bottom: 8px;
          font-weight: bold;
        }
        .barcode-id {
          font-size: 0.9rem;
          color: #666;
          font-weight: 600;
        }
        .message {
          margin: 25px 0;
          font-style: italic;
          font-size: 1rem;
          color: #555;
          line-height: 1.6;
          padding: 15px;
          background: linear-gradient(135deg, #fff8f0 0%, #ffeedd 100%);
          border-radius: 10px;
          border-left: 5px solid #e63946;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .footer {
          font-size: 1rem;
          color: #888;
          margin-top: 25px;
          padding-top: 20px;
          border-top: 2px solid #eee;
        }
        .address {
          font-size: 0.95rem;
          color: #999;
          margin-top: 15px;
          line-height: 1.5;
          font-weight: 500;
        }

        /* Agent ticket styles */
        .agent-ticket {
          background: #f8f9fa;
          width: 320px;
          padding: 25px;
          border: 2px solid #ddd;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .agent-header {
          font-size: 1.5rem;
          font-weight: bold;
          color: #e63946;
          margin-bottom: 15px;
          border-bottom: 2px solid #ddd;
          padding-bottom: 12px;
        }
        .agent-copy-label {
          font-size: 1rem;
          color: #666;
          margin-bottom: 20px;
          font-weight: bold;
          background-color: #e9ecef;
          padding: 8px;
          border-radius: 6px;
        }
        .agent-info {
          font-size: 1rem;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        .agent-items {
          font-size: 1rem;
          margin: 20px 0;
          text-align: left;
          background-color: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }
        .agent-item {
          margin-bottom: 8px;
          padding: 6px 0;
          border-bottom: 1px dotted #ddd;
          font-size: 1rem;
          font-weight: 500;
        }
        .agent-barcode {
          font-size: 0.8rem;
          color: #666;
          margin: 20px 0;
          word-break: break-all;
          font-family: 'Courier New', monospace;
          background-color: white;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <!-- Customer ticket -->
      <div class="ticket">
        <div class="header">
          <div class="cafe-name">LA PERLE ROUGE</div>
          <div class="subtitle">Café • Restaurant</div>
          <div class="ticket-info">${new Date(order.date).toLocaleString('fr-FR')}</div>
        </div>
        
        <div class="server-info">Serveur: ${order.agentName}</div>
        
        <div class="items-section">
          ${order.items.map((item, index) => `
            <div class="item">
              <div class="item-details">
                <div class="item-name">${index + 1}. ${item.drinkName}</div>
                <div class="item-qty">${item.quantity} × ${item.unitPrice.toFixed(2)} MAD</div>
              </div>
              <div class="item-price">${(item.unitPrice * item.quantity).toFixed(2)} MAD</div>
            </div>
          `).join('')}
        </div>
        
        <div class="total-section">
          <div class="total">TOTAL: ${order.total.toFixed(2)} MAD</div>
        </div>
        
        <div class="barcode-section">
          <div class="barcode">${barcode}</div>
          <div class="barcode-id">ID: ${order.id}</div>
        </div>
        
        <div class="message">${thankYouMessage}</div>
        
        <div class="footer">
          <div>Merci de votre visite!</div>
          <div class="address">
            DOHA ABOUAB MARRAKECH
          </div>
        </div>
      </div>

      <!-- Agent copy with page break - products only -->
      <div class="agent-ticket page-break">
        <div class="agent-header">LA PERLE ROUGE</div>
        <div class="agent-copy-label">COPIE AGENT</div>
        
        <div class="agent-info">
          <div>Date: ${new Date(order.date).toLocaleDateString('fr-FR')}</div>
          <div>Heure: ${new Date(order.date).toLocaleTimeString('fr-FR')}</div>
          <div>Agent: ${order.agentName}</div>
        </div>
        
        <div class="agent-items">
          <strong>Produits:</strong>
          ${order.items.map((item, index) => `
            <div class="agent-item">
              ${index + 1}. ${item.drinkName} x${item.quantity}
            </div>
          `).join('')}
        </div>
        
        <div class="agent-barcode">
          ${barcode}<br>
          ${order.id}
        </div>
      </div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank', 'width=900,height=1200');
  if (printWindow) {
    printWindow.document.write(combinedTicket);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  } else {
    alert("Veuillez autoriser les fenêtres popup pour imprimer le ticket.");
  }
};
