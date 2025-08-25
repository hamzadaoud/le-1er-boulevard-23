
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { getOrders } from '../services/cafeService';
import { Printer } from 'lucide-react';
import { Order } from '../types';

const InvoicesPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const loadedOrders = getOrders();
    setOrders(loadedOrders);
  }, []);
  
  const printInvoice = (order: Order) => {
    // Dans une vraie application, cette fonction générerait une facture
    // Pour cette démo, nous allons simplement afficher les détails de la commande
    const invoice = `
      <html>
      <head>
        <title>Facture - La Perle Rouge</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #e63946;
          }
          .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #eee;
            text-align: left;
          }
          th {
            background-color: #f8f8f8;
          }
          .total {
            margin-top: 20px;
            text-align: right;
            font-size: 18px;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            color: #777;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <div class="title">LA PERLE ROUGE</div>
            <div>Facture #${order.id}</div>
          </div>
          <div class="info">
            <div>
              <div><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</div>
              <div><strong>Agent:</strong> ${order.agentName}</div>
            </div>
            <div>
              <div><strong>La Perle Rouge</strong></div>
              <div>123 Avenue des Cafés</div>
              <div>75001 Paris, France</div>
              <div>Tel: 01 23 45 67 89</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.drinkName}</td>
                  <td>${item.quantity}</td>
                  <td>${item.unitPrice.toFixed(2)} MAD</td>
                  <td>${(item.quantity * item.unitPrice).toFixed(2)} MAD</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Total: ${order.total.toFixed(2)} MAD</div>
          <div class="footer">
            Merci de votre confiance. À bientôt chez La Perle Rouge !
          </div>
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(invoice);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    } else {
      alert("Veuillez autoriser les fenêtres popup pour imprimer la facture.");
    }
  };
  
  return (
    <DashboardLayout requireAdmin={true}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-cafeBlack">Factures</h1>
          <p className="text-gray-500">Toutes les commandes et factures</p>
        </div>
        
        <div className="rounded-lg bg-white p-4 md:p-6 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-center font-semibold text-cafeBlack">ID</th>
                  <th className="pb-3 text-center font-semibold text-cafeBlack">Date</th>
                  <th className="pb-3 text-center font-semibold text-cafeBlack">Agent</th>
                  <th className="pb-3 text-center font-semibold text-cafeBlack">Articles</th>
                  <th className="pb-3 text-center font-semibold text-cafeBlack">Total</th>
                  <th className="pb-3 text-center font-semibold text-cafeBlack">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <p className="text-2xl mb-2">📄</p>
                        <p>Aucune facture disponible</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 text-center text-sm">{order.id.substring(0, 8)}...</td>
                      <td className="py-3 text-center text-sm">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="py-3 text-center text-sm">{order.agentName}</td>
                      <td className="py-3 text-center text-sm">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} articles
                      </td>
                      <td className="py-3 text-center font-medium">{order.total.toFixed(2)} MAD</td>
                      <td className="py-3 text-center">
                        <button
                          onClick={() => printInvoice(order)}
                          className="inline-flex items-center rounded-md bg-cafeRed px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-red-700"
                        >
                          <Printer size={14} className="mr-1" />
                          <span className="hidden sm:inline">Imprimer</span>
                          <span className="sm:hidden">📄</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InvoicesPage;
