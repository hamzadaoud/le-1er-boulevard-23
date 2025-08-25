
import { ESCPOSFormatter } from '../utils/escposUtils';

export const printThermalRevenueReport = (
  filteredData: any[], 
  periodType: string, 
  startDate: string, 
  endDate: string, 
  totalRevenue: number
): void => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getPeriodLabel = () => {
    switch (periodType) {
      case 'day':
        return `Jour: ${formatDate(startDate)}`;
      case 'month':
        return `Mois: ${new Date(startDate).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
      case 'year':
        return `Année: ${new Date(startDate).getFullYear()}`;
      case 'custom':
        return `Période: ${formatDate(startDate)} - ${formatDate(endDate)}`;
      default:
        return 'Période inconnue';
    }
  };

  // Generate thermal receipt
  let report = ESCPOSFormatter.init();
  report += ESCPOSFormatter.setCharacterSet();
  report += ESCPOSFormatter.textNormal();
  report += ESCPOSFormatter.alignCenter();
  
  // Header
  report += ESCPOSFormatter.textLarge();
  report += ESCPOSFormatter.textBold();
  report += "LE 1ER BOULEVARD";
  report += ESCPOSFormatter.newLine();
  report += ESCPOSFormatter.textNormal();
  report += ESCPOSFormatter.textBoldOff();
  report += "GUELIZ";
  report += ESCPOSFormatter.multipleLines(2);
  
  // Report title
  report += ESCPOSFormatter.textDoubleHeight();
  report += ESCPOSFormatter.textBold();
  report += "RAPPORT DE REVENUS";
  report += ESCPOSFormatter.textNormal();
  report += ESCPOSFormatter.textBoldOff();
  report += ESCPOSFormatter.multipleLines(2);
  
  // Generation date
  report += ESCPOSFormatter.alignCenter();
  report += `Généré le: ${new Date().toLocaleDateString('fr-FR')}`;
  report += ESCPOSFormatter.newLine();
  report += `à ${new Date().toLocaleTimeString('fr-FR')}`;
  report += ESCPOSFormatter.multipleLines(2);
  
  // Separator
  report += ESCPOSFormatter.horizontalLine('=', 32);
  report += ESCPOSFormatter.newLine();
  
  // Period and summary
  report += ESCPOSFormatter.alignLeft();
  report += ESCPOSFormatter.textBold();
  report += "RÉSUMÉ";
  report += ESCPOSFormatter.textBoldOff();
  report += ESCPOSFormatter.newLine();
  report += ESCPOSFormatter.horizontalLine('-', 32);
  report += ESCPOSFormatter.newLine();
  
  report += `Période: ${getPeriodLabel()}`;
  report += ESCPOSFormatter.newLine();
  report += `Nombre de jours: ${filteredData.length}`;
  report += ESCPOSFormatter.newLine();
  report += `Moyenne/jour: ${filteredData.length ? (totalRevenue / filteredData.length).toFixed(2) : 0} MAD`;
  report += ESCPOSFormatter.multipleLines(2);
  
  // Total revenue
  report += ESCPOSFormatter.alignCenter();
  report += ESCPOSFormatter.textDoubleHeight();
  report += ESCPOSFormatter.textBold();
  report += `TOTAL: ${ESCPOSFormatter.formatCurrency(totalRevenue)}`;
  report += ESCPOSFormatter.textNormal();
  report += ESCPOSFormatter.textBoldOff();
  report += ESCPOSFormatter.multipleLines(2);
  
  // Details section
  if (filteredData.length > 0) {
    report += ESCPOSFormatter.alignCenter();
    report += ESCPOSFormatter.horizontalLine('=', 32);
    report += ESCPOSFormatter.newLine();
    report += ESCPOSFormatter.textBold();
    report += "DÉTAILS PAR JOUR";
    report += ESCPOSFormatter.textBoldOff();
    report += ESCPOSFormatter.newLine();
    report += ESCPOSFormatter.horizontalLine('=', 32);
    report += ESCPOSFormatter.newLine();
    
    report += ESCPOSFormatter.alignLeft();
    filteredData.forEach((revenue, index) => {
      report += `${index + 1}. ${formatDate(revenue.date)}`;
      report += ESCPOSFormatter.newLine();
      report += `   Revenu: ${ESCPOSFormatter.formatCurrency(revenue.amount)}`;
      report += ESCPOSFormatter.newLine();
      report += ESCPOSFormatter.horizontalLine('-', 32);
      report += ESCPOSFormatter.newLine();
    });
  }
  
  // Footer with additional line breaks
  report += ESCPOSFormatter.multipleLines(2);
  report += ESCPOSFormatter.alignCenter();
  report += "Rapport généré automatiquement";
  report += ESCPOSFormatter.newLine();
  report += "par le système de gestion";
  report += ESCPOSFormatter.multipleLines(6); // Added extra line breaks
  
  // Cut paper
  report += ESCPOSFormatter.cutPaper();
  
  // Print the report using thermal printer
  ESCPOSFormatter.print(report);
};
