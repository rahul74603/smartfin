import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// --- SmartFintool Helper Functions ---
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const formatCurrency = (value: number): string => {
  const rupeeSymbol = '\u20B9';
  if (value >= 10000000) {
    return `${rupeeSymbol}${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `${rupeeSymbol}${(value / 100000).toFixed(2)} Lakh`;
  } else if (value >= 1000) {
    return `${rupeeSymbol}${(value / 1000).toFixed(2)} K`;
  }
  return `${rupeeSymbol}${value.toFixed(2)}`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
};

export const downloadPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 10;

    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
