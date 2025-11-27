import { Reparation } from '../types';
import { generateInvoiceHTML, InvoiceData } from './invoiceTemplate';

// Default company information - SbCodage AUTO
const DEFAULT_COMPANY_INFO = {
  name: 'SbCodage AUTO',
  address: '25 boulvard lakhdar ghilane - oujda',
  phone: '+212-688103420',
  email: 'contact@sbcodage-auto.ma',
  patente: '10103398',
  instagram: '@sb_codageauto',
  logoUrl: '/image.png'
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
  const baseId = (reparation as any)._id || invoiceData.invoiceNumber;

  if (options.format === 'html') {
    downloadHTML(htmlContent, `Facture_${baseId}.html`);
  } else if (options.format === 'pdf') {
    await downloadPDF(htmlContent, `Facture_${baseId}.pdf`);
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

const ensureJsPdfLoaded = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof (window as any).jspdf !== 'undefined') {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-jspdf="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load jsPDF')));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.async = true;
    script.setAttribute('data-jspdf', 'true');
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load jsPDF'));
    document.body.appendChild(script);
  });
};

const downloadPDF = async (htmlContent: string, filename: string): Promise<void> => {
  try {
    await ensureJsPdfLoaded();

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '210mm';
    container.style.background = '#ffffff';
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    const element = container.querySelector('.invoice-container') || container;

    const { jsPDF } = (window as any).jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

    await doc.html(element as HTMLElement, {
      margin: [10, 10, 10, 10],
      autoPaging: 'text',
      html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
      callback: (pdf: any) => {
        pdf.save(filename);
        document.body.removeChild(container);
      }
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
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
