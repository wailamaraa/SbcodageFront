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
  };
}

export const generateInvoiceHTML = (data: InvoiceData): string => {
  const { reparation, invoiceNumber, invoiceDate, companyInfo } = data;
  const car = typeof reparation.car === 'string' ? null : reparation.car;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoiceNumber} - SbCodage AUTO</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.5;
            color: #2c3e50;
            background: #fff;
            margin: 0;
            padding: 0;
        }
        
        .invoice-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 15mm;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30mm;
            border-bottom: 4px solid #e74c3c;
            padding-bottom: 15mm;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -5mm;
            left: 0;
            right: 0;
            height: 2mm;
            background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
        }
        
        .company-info {
            flex: 1;
        }
        
        .company-name {
            font-size: 32px;
            font-weight: 900;
            color: #e74c3c;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .company-tagline {
            font-size: 14px;
            color: #7f8c8d;
            font-style: italic;
            margin-bottom: 15px;
        }
        
        .company-details {
            font-size: 14px;
            color: #666;
            line-height: 1.4;
        }
        
        .invoice-info {
            text-align: right;
            flex: 1;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #e74c3c;
        }
        
        .invoice-title {
            font-size: 36px;
            font-weight: 900;
            color: #2c3e50;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        
        .invoice-details {
            font-size: 16px;
            color: #34495e;
            font-weight: 600;
        }
        
        .invoice-number {
            font-size: 18px;
            color: #e74c3c;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .client-section {
            margin-bottom: 30px;
        }
        
        .section-title {
            font-size: 18px;
            font-weight: bold;
            color: #e74c3c;
            margin-bottom: 15px;
            border-bottom: 2px solid #e74c3c;
            padding-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .client-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #e74c3c;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .vehicle-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .vehicle-details {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        
        .repair-details {
            background: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
        }
        
        .services-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-radius: 10px;
            overflow: hidden;
        }
        
        .services-table th {
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
            color: white;
            padding: 15px 12px;
            text-align: left;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .services-table td {
            padding: 15px 12px;
            border-bottom: 1px solid #ecf0f1;
            vertical-align: top;
        }
        
        .services-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .services-table tr:hover {
            background: #e8f4fd;
        }
        
        .service-name {
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 4px;
        }
        
        .service-description {
            font-size: 12px;
            color: #7f8c8d;
            font-style: italic;
        }
        
        .amount {
            text-align: right;
            font-weight: bold;
        }
        
        .totals {
            margin-top: 25px;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            border-top: 4px solid #e74c3c;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 16px;
            border-bottom: 1px solid #ecf0f1;
        }
        
        .total-row.final {
            font-size: 22px;
            font-weight: bold;
            color: #e74c3c;
            border-top: 3px solid #e74c3c;
            border-bottom: none;
            margin-top: 15px;
            padding-top: 20px;
            background: white;
            margin: 15px -20px -20px -20px;
            padding: 20px;
            border-radius: 0 0 10px 10px;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-completed {
            background: #dcfce7;
            color: #166534;
        }
        
        .status-pending {
            background: #fef3c7;
            color: #92400e;
        }
        
        .status-in-progress {
            background: #dbeafe;
            color: #1e40af;
        }
        
        .status-cancelled {
            background: #fee2e2;
            color: #dc2626;
        }
        
        @media print {
            body {
                margin: 0;
                padding: 0;
            }
            
            .invoice-container {
                max-width: none;
                margin: 0;
                padding: 15px;
            }
            
            .header {
                margin-bottom: 30px;
            }
            
            .services-table {
                font-size: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div class="company-info">
                <div class="company-name">${companyInfo.name}</div>
                <div class="company-tagline">Spécialiste Automobile & Réparations</div>
                <div class="company-details">
                    📍 ${companyInfo.address.replace(/\n/g, '<br>')}<br>
                    📞 Tél: ${companyInfo.phone}<br>
                    ✉️ Email: ${companyInfo.email}
                    ${companyInfo.website ? `<br>🌐 Site: ${companyInfo.website}` : ''}
                </div>
            </div>
            <div class="invoice-info">
                <div class="invoice-title">FACTURE</div>
                <div class="invoice-details">
                    <div class="invoice-number">N° ${invoiceNumber}</div>
                    <div>Date: ${invoiceDate}</div>
                </div>
            </div>
        </div>

        <!-- Client Information -->
        <div class="client-section">
            <div class="section-title">Informations Client</div>
            <div class="client-info">
                <strong>${car?.owner?.name || 'N/A'}</strong><br>
                ${car?.owner?.phone ? `Tél: ${car.owner.phone}<br>` : ''}
                ${car?.owner?.email ? `Email: ${car.owner.email}` : ''}
            </div>
        </div>

        <!-- Vehicle & Repair Information -->
        <div class="vehicle-info">
            <div class="vehicle-details">
                <div class="section-title">Véhicule</div>
                <strong>${car?.make || 'N/A'} ${car?.model || 'N/A'}</strong><br>
                Année: ${car?.year || 'N/A'}<br>
                ${car?.licensePlate ? `Plaque: ${car.licensePlate}<br>` : ''}
                ${car?.vin ? `VIN: ${car.vin}` : ''}
            </div>
            <div class="repair-details">
                <div class="section-title">Réparation</div>
                <strong>Réparation #${reparation._id?.slice(-6) || 'N/A'}</strong><br>
                Technicien: ${reparation.technician || 'N/A'}<br>
                Statut: <span class="status-badge status-${reparation.status || 'pending'}">${getStatusLabel(reparation.status || 'pending')}</span><br>
                ${reparation.startDate ? `Début: ${new Date(reparation.startDate).toLocaleDateString('fr-FR')}` : ''}
                ${reparation.endDate ? `<br>Fin: ${new Date(reparation.endDate).toLocaleDateString('fr-FR')}` : ''}
            </div>
        </div>

        <!-- Description -->
        ${reparation.description ? `
        <div class="client-section">
            <div class="section-title">Description des Travaux</div>
            <div class="client-info">
                ${reparation.description}
            </div>
        </div>
        ` : ''}

        <!-- Services & Items Table -->
        <table class="services-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th style="width: 80px;">Qté</th>
                    <th style="width: 120px;">Prix Unit.</th>
                    <th style="width: 120px;">Total</th>
                </tr>
            </thead>
            <tbody>
                ${reparation.items?.map(item => {
                    const itemData = typeof item.item === 'string' ? { name: item.item } : item.item;
                    const unitPrice = item.price || 0;
                    const total = unitPrice * item.quantity;
                    return `
                    <tr>
                        <td>
                            <div class="service-name">🔧 ${itemData.name}</div>
                            <div class="service-description">Pièce détachée</div>
                        </td>
                        <td class="amount">${item.quantity}</td>
                        <td class="amount">${formatCurrency(unitPrice)}</td>
                        <td class="amount">${formatCurrency(total)}</td>
                    </tr>
                    `;
                }).join('') || ''}
                
                ${reparation.services?.map(service => {
                    const serviceData = typeof service.service === 'string' ? { name: service.service } : service.service;
                    return `
                    <tr>
                        <td>
                            <div class="service-name">⚙️ ${serviceData.name}</div>
                            <div class="service-description">Service professionnel${service.notes ? ` - ${service.notes}` : ''}</div>
                        </td>
                        <td class="amount">1</td>
                        <td class="amount">${formatCurrency(service.price || 0)}</td>
                        <td class="amount">${formatCurrency(service.price || 0)}</td>
                    </tr>
                    `;
                }).join('') || ''}
                
                ${reparation.laborCost && reparation.laborCost > 0 ? `
                <tr>
                    <td>
                        <div class="service-name">👨‍🔧 Main d'œuvre</div>
                        <div class="service-description">Travaux de réparation spécialisés</div>
                    </td>
                    <td class="amount">1</td>
                    <td class="amount">${formatCurrency(reparation.laborCost)}</td>
                    <td class="amount">${formatCurrency(reparation.laborCost)}</td>
                </tr>
                ` : ''}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
            ${reparation.partsCost && reparation.partsCost > 0 ? `
            <div class="total-row">
                <span>Sous-total Pièces:</span>
                <span>${formatCurrency(reparation.partsCost)}</span>
            </div>
            ` : ''}
            
            ${reparation.servicesCost && reparation.servicesCost > 0 ? `
            <div class="total-row">
                <span>Sous-total Services:</span>
                <span>${formatCurrency(reparation.servicesCost)}</span>
            </div>
            ` : ''}
            
            ${reparation.laborCost && reparation.laborCost > 0 ? `
            <div class="total-row">
                <span>Main d'œuvre:</span>
                <span>${formatCurrency(reparation.laborCost)}</span>
            </div>
            ` : ''}
            
            <div class="total-row final">
                <span>TOTAL TTC:</span>
                <span>${formatCurrency(reparation.totalCost || 0)}</span>
            </div>
        </div>

        <!-- Notes -->
        ${reparation.notes ? `
        <div class="client-section">
            <div class="section-title">Notes</div>
            <div class="client-info">
                ${reparation.notes.replace(/\n/g, '<br>')}
            </div>
        </div>
        ` : ''}

        <!-- Footer -->
        <div class="footer">
            <p><strong>🚗 Merci de votre confiance pour l'entretien de votre véhicule ! 🚗</strong></p>
            <p>Garantie sur toutes nos réparations • Service après-vente assuré</p>
            <p style="margin-top: 10px; font-size: 11px; color: #7f8c8d;">
                Facture générée automatiquement par SbCodage AUTO le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
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
