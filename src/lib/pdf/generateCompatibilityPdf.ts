import PDFDocument from 'pdfkit';
import { DateTime } from 'luxon';

/**
 * Generate a Compatibility PDF report.
 *
 * The `report` object is expected to contain fields related to the
 * compatibility analysis. We defensively access properties with optional
 * chaining so the function works even if some data is missing.
 *
 * Returned value is a Buffer that can be streamed directly in a Next.js
 * API route.
 */
export async function generateCompatibilityPdf(report: any): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks: Uint8Array[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('error', (err) => reject(err));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    // ----- Cover Page -----
    doc
      .fontSize(30)
      .fillColor('#d4af37')
      .text('Zygnal Astro', { align: 'center' })
      .moveDown(0.5);
    doc
      .fontSize(20)
      .fillColor('#c8c4d4')
      .text('Compatibility Report', { align: 'center' })
      .moveDown(1);
    const genDate = DateTime.now().toLocaleString(DateTime.DATE_MED);
    doc
      .fontSize(12)
      .fillColor('#888')
      .text(`Generated on: ${genDate}`, { align: 'center' })
      .moveDown(2);

    // ----- Partner Information -----
    const personA = report.personA || report.compatibility?.personA || {};
    const personB = report.personB || report.compatibility?.personB || {};
    doc
      .fontSize(14)
      .fillColor('#d4af37')
      .text('Partner A', { underline: true })
      .moveDown(0.2);
    doc.fontSize(12).fillColor('#c8c4d4').text(`Name: ${personA.name || 'N/A'}`).text(`Sun: ${personA.sun || 'N/A'}`).text(`Moon: ${personA.moon || 'N/A'}`).moveDown(0.5);
    doc
      .fontSize(14)
      .fillColor('#d4af37')
      .text('Partner B', { underline: true })
      .moveDown(0.2);
    doc.fontSize(12).fillColor('#c8c4d4').text(`Name: ${personB.name || 'N/A'}`).text(`Sun: ${personB.sun || 'N/A'}`).text(`Moon: ${personB.moon || 'N/A'}`).moveDown(1);

    // ----- Compatibility Score -----
    const score = report.compatibilityScore ?? report.compatibility?.score;
    if (score !== undefined) {
      doc
        .fontSize(16)
        .fillColor('#d4af37')
        .text(`Compatibility Score: ${score}%`, { align: 'center' })
        .moveDown(1);
    }

    // Helper to render a section
    const renderSection = (title: string, content: any) => {
      if (!content) return;
      doc
        .fontSize(14)
        .fillColor('#d4af37')
        .text(title, { underline: true })
        .moveDown(0.2);
      doc.fontSize(12).fillColor('#c8c4d4').text(content).moveDown(0.5);
    };

    // ----- Sections -----
    renderSection('Relationship Overview', report.relationshipOverview ?? report.compatibility?.relationshipOverview);
    renderSection('Strengths', report.strengths ?? report.compatibility?.strengths);
    renderSection('Challenges', report.challenges ?? report.compatibility?.challenges);
    renderSection('Synastry Insights', report.synastryInsights ?? report.compatibility?.synastryInsights);
    renderSection('Long‑Term Potential', report.longTermPotential ?? report.compatibility?.longTermPotential);
    renderSection('Cosmic Guidance', report.cosmicGuidance ?? report.compatibility?.cosmicGuidance);

    // Footer
    doc
      .fontSize(10)
      .fillColor('#888')
      .text('© Zygnal Astro – All rights reserved', 0, doc.page.height - 50, { align: 'center' });

    doc.end();
  });
}
