import { Reparation } from '../types';
import { generateInvoiceHTML, InvoiceData } from './invoiceTemplate';

// Default company information - SbCodage AUTO
const DEFAULT_COMPANY_INFO = {
  name: 'SbCodage AUTO',
  address: 'Zone Industrielle Sidi Brahim\n20000 Casablanca, Maroc',
  phone: '+212 5 22 XX XX XX',
  email: 'contact@sbcodage-auto.ma',
  website: 'www.sbcodage-auto.ma'
};

export interface ExportOptions {
  format: 'pdf' | 'html';
  companyInfo?: Partial<typeof DEFAULT_COMPANY_INFO>;
  invoiceNumber?: string;
}

export const generateInvoiceNumber = (reparationId: string): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const shortId = reparationId.slice(-6).toUpperCase();
  return `INV-${year}${month}-${shortId}`;
};

export const exportInvoice = async (
  reparation: Reparation, 
  options: ExportOptions = { format: 'pdf' }
): Promise<void> => {
  const invoiceData: InvoiceData = {
    reparation,
    invoiceNumber: options.invoiceNumber || generateInvoiceNumber(reparation._id),
    invoiceDate: new Date().toLocaleDateString('fr-FR'),
    companyInfo: { ...DEFAULT_COMPANY_INFO, ...options.companyInfo }
  };

  const htmlContent = generateInvoiceHTML(invoiceData);

  if (options.format === 'html') {
    downloadHTML(htmlContent, `Facture_${invoiceData.invoiceNumber}.html`);
  } else if (options.format === 'pdf') {
    await downloadPDF(htmlContent, `Facture_${invoiceData.invoiceNumber}.pdf`);
  }
};

const downloadHTML = (htmlContent: string, filename: string): void => {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

const downloadPDF = async (htmlContent: string, filename: string): Promise<void> => {
  try {
    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      throw new Error('Unable to open print window. Please check popup blocker settings.');
    }

    // Write HTML content to the new window
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Wait for content to load
    await new Promise((resolve) => {
      printWindow.onload = resolve;
      // Fallback timeout
      setTimeout(resolve, 1000);
    });

    // Focus and print
    printWindow.focus();
    printWindow.print();

    // Close the window after a delay (to allow printing to complete)
    setTimeout(() => {
      printWindow.close();
    }, 1000);

  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to HTML download
    downloadHTML(htmlContent, filename.replace('.pdf', '.html'));
    throw new Error('PDF generation failed. HTML version downloaded instead.');
  }
};

export const previewInvoice = (reparation: Reparation, options: ExportOptions = { format: 'pdf' }): void => {
  const invoiceData: InvoiceData = {
    reparation,
    invoiceNumber: options.invoiceNumber || generateInvoiceNumber(reparation._id),
    invoiceDate: new Date().toLocaleDateString('fr-FR'),
    companyInfo: { ...DEFAULT_COMPANY_INFO, ...options.companyInfo }
  };

  const htmlContent = generateInvoiceHTML(invoiceData);
  
  const previewWindow = window.open('', '_blank');
  if (previewWindow) {
    previewWindow.document.write(htmlContent);
    previewWindow.document.close();
  } else {
    alert('Unable to open preview window. Please check popup blocker settings.');
  }
};
