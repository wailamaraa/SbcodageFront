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
  const dueDate = (reparation as any).endDate
    ? new Date((reparation as any).endDate).toLocaleDateString('fr-FR')
    : invoiceDate;
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
            color: #111827;
            background: #f3f4f6;
            padding: 32px 16px;
        }

        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            padding: 24px 28px 24px 28px;
            box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
            border-radius: 16px;
            border: 1px solid #e5e7eb;
            position: relative;
            overflow: hidden;
        }

        .invoice-container::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            height: 0;
            background: transparent;
        }

        .invoice-inner {
            position: relative;
            margin-top: 0;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 4px;
            padding-bottom: 18px;
            border-bottom: 1px solid #e5e7eb;
            margin-bottom: 18px;
        }

        .company-info { flex: 1; }

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

        .company-name { font-size: 22px; font-weight: 700; color: #111827; margin-bottom: 6px; line-height: 1.2; }

        .company-details { font-size: 13px; color: #6b7280; line-height: 1.7; }

        .invoice-info { text-align: right; }

        .billing-section { display: flex; justify-content: space-between; margin-bottom: 18px; }

        .billing-box {
            flex: 0 0 48%;
        }

        .section-label { font-size: 12px; font-weight: 700; color: #374151; text-transform: none; letter-spacing: 0.2px; margin-bottom: 8px; }

        .billing-info { font-size: 13px; color: #4b5563; line-height: 1.7; }

        .billing-info strong { color: #111827; font-weight: 700; }

        .items-table {
            width: 100%;
            margin-bottom: 30px;
            border-collapse: separate;
            border-spacing: 0;
        }

        .items-table thead { background: #f3f4f6; color: #374151; }

        .items-table th { padding: 12px 16px; text-align: left; font-size: 12px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase; }

        .items-table th:last-child,
        .items-table td:last-child {
            text-align: right;
        }

        .items-table tbody tr { background: white; border-bottom: 1px solid #e5e7eb; }

        .items-table td { padding: 14px 16px; font-size: 13px; color: #111827; vertical-align: top; }

        .item-name { font-weight: 700; color: #111827; margin-bottom: 4px; }

        .item-description { font-size: 12px; color: #6b7280; line-height: 1.5; }

        .totals-section { background: white; padding: 12px 0 6px 0; margin-top: 8px; }

        .total-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; color: #374151; }

        .total-row.highlight {
            color: #2d3748;
            font-weight: 600;
        }

        .total-row.final { font-weight: 800; color: #111827; font-size: 16px; padding-top: 10px; border-top: 1px solid #e5e7eb; }

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

        .footer { margin-top: 18px; padding-top: 12px; }

        .footer-title { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 14px; }

        .footer-columns { margin-top: 8px; }

        .footer-column { font-size: 12px; color: #6b7280; line-height: 1.7; }

        .footer-column strong { display: block; font-weight: 700; color: #374151; margin-bottom: 6px; }
        /* Print page size */
        @page {
            size: A4;
            margin: 12mm;
        }

        .logo-img { width: 140px; height: 80px; object-fit: contain; }

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
        <div class="invoice-inner">
        <div class="header">
            <div class="company-info">
                <div class="company-name">${companyInfo.name}</div>
                <div class="company-details">
                    ${companyInfo.email}<br>
                    ${companyInfo.phone}<br>
                    ${companyInfo.address.replace(/\n/g, '<br>')}
                </div>
            </div>
            <div class="invoice-info">
                <img src="${logoUrl}" class="logo-img" alt="Logo" />
            </div>
        </div>

        <div class="billing-section">
            <div class="billing-box">
                <div class="section-label">Facturé à</div>
                <div class="billing-info">
                    <strong>${car?.owner?.name || 'N/A'}</strong><br>
                    ${car?.owner?.phone ? `${car.owner.phone}<br>` : ''}
                    ${car?.owner?.email ? `${car.owner.email}<br>` : ''}
                    ${car?.make || ''} ${car?.model || ''} ${car?.year ? `(${car.year})` : ''}<br>
                    ${car?.licensePlate ? `Immatriculation: ${car.licensePlate}` : ''}
                </div>
            </div>
            <div class="billing-box" style="text-align: right;">
                <div class="section-label">Montant (MAD)</div>
                <div style="font-size: 26px; font-weight: 800; color: #0f172a;">${formatCurrency(subtotal)}</div>
            </div>
        </div>

        <div class="billing-section" style="margin-top: 0;">
            <div class="billing-box">
                <div class="section-label">Objet</div>
                <div class="billing-info">
                    ${(() => {
                      const parts: string[] = [];
                      if (car?.make || car?.model) {
                        parts.push(`${car?.make || ''} ${car?.model || ''}`.trim());
                      }
                      const label = parts.length ? `Prestation de personnalisation et entretien pour ${parts.join(' ')}` : 'Prestation de réparation et entretien véhicule';
                      return label;
                    })()}
                </div>
            </div>
            <div class="billing-box">
                <div class="billing-info" style="display: grid; grid-template-columns: repeat(3, 1fr); column-gap: 16px; row-gap: 6px; font-size: 13px;">
                    <span class="section-label" style="margin-bottom: 0; text-transform: none; font-size: 13px;">Date de la facture</span>
                    <span>${invoiceDate}</span>
                    <span class="section-label" style="margin-bottom: 0; text-transform: none; font-size: 13px;">Date d'échéance</span>
                    <span>${dueDate}</span>
                    <span class="section-label" style="margin-bottom: 0; text-transform: none; font-size: 13px;">Référence</span>
                    <span>#${invoiceNumber}</span>
                </div>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>DÉTAIL DE L'ARTICLE</th>
                    <th style="width: 60px; text-align: center;">QTY</th>
                    <th style="width: 120px;">TAUX</th>
                    <th style="width: 120px;">MONTANT</th>
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
                        <td style="text-align: center;">${item.quantity}</td>
                        <td>${formatCurrency(unitPrice)}</td>
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
                        <td style="text-align: center;">1</td>
                        <td>${formatCurrency(service.price || 0)}</td>
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
                    <td style="text-align: center;">1</td>
                    <td>${formatCurrency(reparation.laborCost)}</td>
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
            <div class="total-row" style="border-top: 1px solid #e5e7eb; margin-top: 4px;">
                <span>Sous-total :</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="total-row final">
                <span>Total :</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
        </div>

        

        <div class="footer">
            <div class="footer-title">Merci pour votre confiance.</div>
            <div class="footer-columns">
                <div class="footer-column">
                    <strong>Conditions générales</strong>
                    Veuillez payer dès réception de cette facture.
                </div>
            </div>
        </div>
        </div>
    </div>
</body>
</html>
  `;
};
