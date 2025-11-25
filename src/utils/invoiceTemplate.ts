import { Reparation } from '../types';
import { formatCurrency } from './formatters';

export interface InvoiceData {
  reparation: Reparation;
  invoiceNumber: string;
  invoiceDate: string;
  companyInfo: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    patente?: string;
    instagram?: string;
    logoUrl?: string;
  };
}

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const { reparation, invoiceNumber, invoiceDate, companyInfo } = data;
  const car = typeof reparation.car === 'string' ? null : reparation.car;

  const subtotal = reparation.totalCost || 0;
  const rowCount = (reparation.items?.length || 0) + (reparation.services?.length || 0) + ((reparation.laborCost && reparation.laborCost > 0) ? 1 : 0);
  const densityClass =
    rowCount > 26 ? 'nano-compact' :
    rowCount > 20 ? 'micro-compact' :
    rowCount > 16 ? 'ultra-compact' :
    rowCount > 12 ? 'super-compact' :
    rowCount > 8 ? 'compact' : '';
  const logoUrl = companyInfo.logoUrl || '/Gemini_Generated_Image_9mjocl9mjocl9mjo-removebg-preview.png';

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoiceNumber} - ${companyInfo.name}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background: #f1f5f9;
            padding: 40px 20px;
        }

        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: #f8f7f4;
            padding: 60px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 60px;
        }

        .company-info {
            flex: 1;
        }

        .logo-circle {
            width: 60px;
            height: 60px;
            background: #667eea;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 12px;
            position: relative;
        }

        .logo-circle::before {
            content: '';
            width: 30px;
            height: 30px;
            border: 4px solid #f8f7f4;
            border-top-color: transparent;
            border-right-color: transparent;
            border-radius: 50%;
            transform: rotate(-45deg);
        }

        .company-name {
            font-size: 28px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 4px;
            line-height: 1.2;
        }

        .company-details {
            font-size: 13px;
            color: #4a5568;
            line-height: 1.8;
            margin-top: 12px;
        }

        .invoice-info {
            text-align: right;
        }

        .invoice-title {
            font-size: 42px;
            font-weight: 800;
            color: #6b7280; /* grey */
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }

        .invoice-date {
            font-size: 15px;
            color: #4a5568;
            font-weight: 500;
        }

        .billing-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 50px;
        }

        .billing-box {
            flex: 0 0 48%;
        }

        .section-label {
            font-size: 13px;
            font-weight: 700;
            color: #2d3748;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
        }

        .billing-info {
            font-size: 14px;
            color: #4a5568;
            line-height: 1.8;
        }

        .billing-info strong {
            color: #2d3748;
            font-weight: 600;
        }

        .items-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: separate;
            border-spacing: 0;
        }

        .items-table thead {
            background: #6b7280; /* grey */
            color: white;
        }

        .items-table th {
            padding: 16px 20px;
            text-align: left;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .items-table th:last-child,
        .items-table td:last-child {
            text-align: right;
        }

        .items-table tbody tr {
            background: white;
            border-bottom: 1px solid #e2e8f0;
        }

        .items-table td {
            padding: 20px;
            font-size: 14px;
            color: #2d3748;
            vertical-align: top;
        }

        .item-name {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 4px;
        }

        .item-description {
            font-size: 12px;
            color: #718096;
            line-height: 1.5;
        }

        .totals-section {
            background: white;
            padding: 30px;
            margin-top: 30px;
        }

        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            font-size: 15px;
            color: #4a5568;
        }

        .total-row.highlight {
            color: #2d3748;
            font-weight: 600;
        }

        .total-row.final {
            background: #6b7280; /* grey */
            color: white;
            padding: 20px 30px;
            margin: 20px -30px -30px -30px;
            font-size: 20px;
            font-weight: 700;
        }

        .notes-section {
            margin-top: 40px;
            padding: 20px;
            background: white;
        }

        .notes-title {
            font-size: 13px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .notes-content {
            font-size: 13px;
            color: #718096;
            line-height: 1.8;
        }

        .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 1px solid #cbd5e0;
            text-align: center;
        }

        .footer-title {
            font-size: 18px;
            font-weight: 700;
            color: #6b7280; /* grey */
            margin-bottom: 20px;
        }

        .footer-columns {
            display: flex;
            justify-content: space-between;
            text-align: left;
            margin-top: 20px;
        }

        .footer-column {
            flex: 1;
            font-size: 12px;
            color: #4a5568;
            line-height: 1.8;
        }

        .footer-column strong {
            display: block;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
        }
        /* Print page size */
        @page {
            size: A4;
            margin: 12mm;
        }

        .logo-img {
            width: 120px;
            height: 120px;
            object-fit: contain;
            margin-bottom: 16px;
        }

        /* Density adjustments for single-page fit */
        .compact .invoice-container { padding: 50px; }
        .super-compact .invoice-container { padding: 44px; }
        .ultra-compact .invoice-container { padding: 38px; }
        .micro-compact .invoice-container { padding: 32px; }
        .nano-compact .invoice-container { padding: 28px; }

        .compact .logo-img { width: 100px; height: 100px; }
        .super-compact .logo-img { width: 90px; height: 90px; }
        .ultra-compact .logo-img { width: 80px; height: 80px; }
        .micro-compact .logo-img { width: 70px; height: 70px; }
        .nano-compact .logo-img { width: 60px; height: 60px; }

        .compact .header { margin-bottom: 50px; }
        .super-compact .header { margin-bottom: 44px; }
        .ultra-compact .header { margin-bottom: 36px; }
        .micro-compact .header { margin-bottom: 30px; }
        .nano-compact .header { margin-bottom: 26px; }

        .compact .company-name { font-size: 24px; }
        .super-compact .company-name { font-size: 22px; }
        .ultra-compact .company-name { font-size: 20px; }
        .micro-compact .company-name { font-size: 18px; }
        .nano-compact .company-name { font-size: 16px; }

        .compact .items-table th,
        .compact .items-table td { padding: 12px 14px; font-size: 13px; }
        .super-compact .items-table th,
        .super-compact .items-table td { padding: 10px 12px; font-size: 12px; }
        .ultra-compact .items-table th,
        .ultra-compact .items-table td { padding: 8px 10px; font-size: 11px; }
        .micro-compact .items-table th,
        .micro-compact .items-table td { padding: 6px 8px; font-size: 10px; }
        .nano-compact .items-table th,
        .nano-compact .items-table td { padding: 5px 6px; font-size: 9px; }

        .compact .totals-section { padding: 24px; }
        .super-compact .totals-section { padding: 20px; }
        .ultra-compact .totals-section { padding: 16px; }
        .micro-compact .totals-section { padding: 12px; }
        .nano-compact .totals-section { padding: 10px; }

        @media print {
            body {
                background: white;
                padding: 0;
            }

            .invoice-container {
                max-width: none;
                box-shadow: none;
                padding: 40px;
            }
        }
    </style>
</head>
<body class="${densityClass}">
    <div class="invoice-container">
        <div class="header">
            <div class="company-info">
                <img src="${logoUrl}" class="logo-img" alt="Logo" />
                <div class="company-name">${companyInfo.name}</div>
                <div class="company-details">
                    <strong>Adresse</strong><br>
                    ${companyInfo.address.replace(/\n/g, '<br>')}<br><br>
                    Garage: ${companyInfo.phone}<br>
                    ${companyInfo.patente ? `N° Patente: ${companyInfo.patente}<br>` : ''}${companyInfo.instagram ? `Instagram: ${companyInfo.instagram}` : ''}
                </div>
            </div>
            <div class="invoice-info">
                <div class="invoice-title">FACTURE</div>
                <div class="invoice-date">${invoiceDate}</div>
            </div>
        </div>

        <div class="billing-section">
            <div class="billing-box">
                <div class="section-label">INFORMATIONS VÉHICULE :</div>
                <div class="billing-info">
                    <strong>${car?.make || 'N/A'} ${car?.model || 'N/A'}</strong><br>
                    Année: ${car?.year || 'N/A'}<br>
                    ${car?.licensePlate ? `Immatriculation: ${car.licensePlate}<br>` : ''}
                    ${car?.vin ? `VIN: ${car.vin}` : ''}
                </div>
            </div>
            <div class="billing-box">
                <div class="section-label">À :</div>
                <div class="billing-info">
                    <strong>${car?.owner?.name || 'N/A'}</strong><br>
                    ${car?.owner?.email ? `Email: ${car.owner.email}<br>` : ''}
                    ${car?.owner?.phone ? `Téléphone: ${car.owner.phone}` : ''}
                </div>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="width: 120px;">Prix unitaire</th>
                    <th style="width: 80px;">Qté</th>
                    <th style="width: 120px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${reparation.items?.map(item => {
                    const itemData = typeof item.item === 'string' ? { name: item.item } : item.item;
                    const unitPrice = item.sellPrice || 0;
                    const total = unitPrice * item.quantity;
                    return `
                    <tr>
                        <td>
                            <div class="item-name">${itemData.name}</div>
                            <div class="item-description">${'Pièce de rechange'}</div>
                        </td>
                        <td>${formatCurrency(unitPrice)}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(total)}</td>
                    </tr>
                `;
            }).join('') || ''}

                ${reparation.services?.map(service => {
                    const serviceData = typeof service.service === 'string' ? { name: service.service } : service.service;
                    return `
                    <tr>
                        <td>
                            <div class="item-name">${serviceData.name}</div>
                            <div class="item-description">${service.notes || 'Service'}</div>
                        </td>
                        <td>${formatCurrency(service.price || 0)}</td>
                        <td>1</td>
                        <td>${formatCurrency(service.price || 0)}</td>
                    </tr>
                `;
            }).join('') || ''}

                ${reparation.laborCost && reparation.laborCost > 0 ? `
                <tr>
                    <td>
                        <div class="item-name">Main-d'œuvre</div>
                        <div class="item-description">Main-d'œuvre et services de réparation</div>
                    </td>
                    <td>${formatCurrency(reparation.laborCost)}</td>
                    <td>1</td>
                    <td>${formatCurrency(reparation.laborCost)}</td>
                </tr>
                ` : ''}
            </tbody>
        </table>

        <div class="totals-section">
            ${reparation.partsCost && reparation.partsCost > 0 ? `
            <div class="total-row">
                <span>Pièces :</span>
                <span>${formatCurrency(reparation.partsCost)}</span>
            </div>
            ` : ''}
            ${reparation.servicesCost && reparation.servicesCost > 0 ? `
            <div class="total-row">
                <span>Services :</span>
                <span>${formatCurrency(reparation.servicesCost)}</span>
            </div>
            ` : ''}
            ${reparation.laborCost && reparation.laborCost > 0 ? `
            <div class="total-row">
                <span>Main-d’œuvre :</span>
                <span>${formatCurrency(reparation.laborCost)}</span>
            </div>
            ` : ''}
            <div class="total-row final">
                <span>TOTAL À PAYER :</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
        </div>

        ${reparation.notes ? `
        <div class="notes-section">
            <div class="notes-title">Remarque :</div>
            <div class="notes-content">
                ${reparation.notes}
            </div>
        </div>
        ` : ''}

        <div class="footer">
            <div class="footer-title">Merci pour votre confiance</div>
            <div class="footer-columns">
                <div class="footer-column">
                    <strong>Questions ?</strong>
                    Email : ${companyInfo.email}<br>
                    Téléphone : ${companyInfo.phone}
                </div>
                <div class="footer-column">
                    <strong>Conditions générales :</strong>
                    Paiement à la réception du véhicule.<br>
                    Garantie main-d'œuvre 30 jours; pièces selon fournisseur.<br>
                    Toute réclamation dans les 48h suivant la livraison.<br>
                    Véhicule non retiré sous 7 jours: frais de garde possibles.
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `;
};

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'pending': 'En Attente',
    'in_progress': 'En Cours',
    'completed': 'Terminé',
    'cancelled': 'Annulé'
  };
  return labels[status] || status;
}
