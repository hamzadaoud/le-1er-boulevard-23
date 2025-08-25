
import { TableOrder } from '../types';
import { ESCPOSFormatter } from '../utils/escposUtils';

export const printTableTicket = (order: TableOrder): void => {
  // Generate customer ticket with ESC/POS commands
  let customerTicket = ESCPOSFormatter.init();
  customerTicket += ESCPOSFormatter.setCharacterSet();
  customerTicket += ESCPOSFormatter.textNormal();
  customerTicket += ESCPOSFormatter.alignCenter();
  
  // Header
  customerTicket += ESCPOSFormatter.textLarge();
  customerTicket += ESCPOSFormatter.textBold();
  customerTicket += "1ER BOULEVARD";
  customerTicket += ESCPOSFormatter.newLine();
  customerTicket += ESCPOSFormatter.textNormal();
  customerTicket += ESCPOSFormatter.textBoldOff();
  customerTicket += "GUELIZ";
  customerTicket += ESCPOSFormatter.multipleLines(2);
  
  // Table and date info
  customerTicket += ESCPOSFormatter.alignCenter();
  customerTicket += ESCPOSFormatter.textDoubleHeight();
  customerTicket += ESCPOSFormatter.textBold();
  customerTicket += `TABLE ${order.tableNumber}`;
  customerTicket += ESCPOSFormatter.textNormal();
  customerTicket += ESCPOSFormatter.textBoldOff();
  customerTicket += ESCPOSFormatter.newLine();
  
  customerTicket += ESCPOSFormatter.alignCenter();
  customerTicket += "Date: " + ESCPOSFormatter.formatDate(order.date);
  customerTicket += ESCPOSFormatter.newLine();
  customerTicket += "Serveur: " + order.agentName;
  customerTicket += ESCPOSFormatter.multipleLines(2);
  
  // Separator line
  customerTicket += ESCPOSFormatter.alignCenter();
  customerTicket += ESCPOSFormatter.horizontalLine('=', 32);
  customerTicket += ESCPOSFormatter.newLine();
  customerTicket += ESCPOSFormatter.textBold();
  customerTicket += "TICKET CLIENT";
  customerTicket += ESCPOSFormatter.textBoldOff();
  customerTicket += ESCPOSFormatter.newLine();
  customerTicket += ESCPOSFormatter.horizontalLine('=', 32);
  customerTicket += ESCPOSFormatter.newLine();
  
  // Items
  customerTicket += ESCPOSFormatter.alignCenter();
  order.items.forEach((item, index) => {
    customerTicket += `${index + 1}. ${item.drinkName}`;
    customerTicket += ESCPOSFormatter.newLine();
    customerTicket += `${item.quantity} x ${ESCPOSFormatter.formatCurrency(item.unitPrice)} = ${ESCPOSFormatter.formatCurrency(item.unitPrice * item.quantity)}`;
    customerTicket += ESCPOSFormatter.newLine();
    customerTicket += ESCPOSFormatter.horizontalLine('-', 32);
    customerTicket += ESCPOSFormatter.newLine();
  });
  
  // Total
  customerTicket += ESCPOSFormatter.alignCenter();
  customerTicket += ESCPOSFormatter.textDoubleHeight();
  customerTicket += ESCPOSFormatter.textBold();
  customerTicket += "TOTAL: " + ESCPOSFormatter.formatCurrency(order.total);
  customerTicket += ESCPOSFormatter.textNormal();
  customerTicket += ESCPOSFormatter.textBoldOff();
  customerTicket += ESCPOSFormatter.multipleLines(2);
  
  // Barcode
  customerTicket += ESCPOSFormatter.alignCenter();
  customerTicket += ESCPOSFormatter.generateBarcode(order.id);
  customerTicket += ESCPOSFormatter.multipleLines(2);
  
  // Footer
  customerTicket += ESCPOSFormatter.alignCenter();
  customerTicket += "Merci de votre visite !";
  customerTicket += ESCPOSFormatter.multipleLines(4);
  
  // Cut paper
  customerTicket += ESCPOSFormatter.cutPaper();
  
  // Generate agent copy
  let agentCopy = ESCPOSFormatter.init();
  agentCopy += ESCPOSFormatter.setCharacterSet();
  agentCopy += ESCPOSFormatter.alignCenter();
  agentCopy += ESCPOSFormatter.textBold();
  agentCopy += "LE 1ER BOULEVARD";
  agentCopy += ESCPOSFormatter.newLine();
  agentCopy += "COPIE AGENT";
  agentCopy += ESCPOSFormatter.textBoldOff();
  agentCopy += ESCPOSFormatter.multipleLines(2);
  
  // Table and agent info
  agentCopy += ESCPOSFormatter.alignCenter();
  agentCopy += ESCPOSFormatter.textDoubleHeight();
  agentCopy += ESCPOSFormatter.textBold();
  agentCopy += `TABLE ${order.tableNumber}`;
  agentCopy += ESCPOSFormatter.textNormal();
  agentCopy += ESCPOSFormatter.textBoldOff();
  agentCopy += ESCPOSFormatter.newLine();
  
  agentCopy += ESCPOSFormatter.alignCenter();
  agentCopy += "Date: " + ESCPOSFormatter.formatDate(order.date);
  agentCopy += ESCPOSFormatter.newLine();
  agentCopy += "Agent: " + order.agentName;
  agentCopy += ESCPOSFormatter.multipleLines(2);
  
  // Products only
  agentCopy += ESCPOSFormatter.alignCenter();
  agentCopy += ESCPOSFormatter.textBold();
  agentCopy += "ARTICLES:";
  agentCopy += ESCPOSFormatter.textBoldOff();
  agentCopy += ESCPOSFormatter.newLine();
  agentCopy += ESCPOSFormatter.horizontalLine('-', 32);
  agentCopy += ESCPOSFormatter.newLine();
  
  agentCopy += ESCPOSFormatter.alignCenter();
  order.items.forEach((item, index) => {
    agentCopy += `${index + 1}. ${item.drinkName} - Qte: ${item.quantity}`;
    agentCopy += ESCPOSFormatter.newLine();
  });
  
  agentCopy += ESCPOSFormatter.multipleLines(2);
  agentCopy += ESCPOSFormatter.alignCenter();
  agentCopy += ESCPOSFormatter.generateBarcode(order.id);
  agentCopy += ESCPOSFormatter.multipleLines(4);
  agentCopy += ESCPOSFormatter.cutPaper();
  
  // Print both tickets in the same window
  ESCPOSFormatter.printBothTickets(customerTicket, agentCopy);
};
