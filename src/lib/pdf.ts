/**
 * PDF export, isolated in its own module.
 *
 * WHY A SEPARATE FILE
 * -------------------
 * jsPDF + html2canvas are ~550 kB. They used to live in lib/utils.ts alongside
 * formatCurrency/formatNumber, which every page imports. Even after switching
 * to a dynamic import() inside the function, Vite still emitted a
 * <link rel="modulepreload"> for the chunk on every page, because the module
 * graph reached it from an eagerly-loaded file.
 *
 * Putting the heavy code behind its own module boundary — with nothing else
 * exported from here — makes it a clean async leaf. Nothing in the eager graph
 * references it, so Vite emits it as a true on-demand chunk and it is fetched
 * only when a user actually clicks "Download as PDF".
 *
 * Keep this file free of any helper that a page might want to import.
 */

export async function exportElementToPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) return;

  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
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
}
