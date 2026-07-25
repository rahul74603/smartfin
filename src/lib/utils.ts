import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// --- SmartFintool Helper Functions ---

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

/**
 * Thin wrapper kept so existing call sites keep working. The actual jsPDF /
 * html2canvas code lives in lib/pdf.ts and is only fetched on click — see the
 * note at the top of that file for why the separate module matters.
 */
export const downloadPDF = async (elementId: string, filename: string) => {
  try {
    const { exportElementToPDF } = await import('./pdf');
    await exportElementToPDF(elementId, filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};
