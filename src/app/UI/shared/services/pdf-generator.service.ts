import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PdfGeneratorService {
  public readonly bootstrapCssUrl =
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  public readonly cssText = `
    body { font-size: 13.5px; font-family: sans-serif; }
    td { font-size: 13.5px; font-family: sans-serif; }
    th { font-size: 13.5px; font-family: sans-serif; }
  `;

  async generatePDF(divRef: HTMLElement): Promise<jsPDF> {
    try {
      const canvas = await html2canvas(divRef);
      const doc = new jsPDF('p', 'mm', 'a4');
      const img = canvas.toDataURL('image/png');
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    } catch (err) {
      console.error('Error generando PDF:', err);
      throw err;
    }
  }
}
