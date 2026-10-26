import PDFDocument from 'pdfkit';
import { logger } from '../utils/logger.js';

/**
 * Enterprise Cyber Security PDF Report Generator for LinkShield
 * Generates an executive, publication-ready multi-page PDF report using PDFKit.
 */
export async function generatePdfReport(scanData, intelligenceData, recommendations) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        bufferPages: true,
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      doc.on('error', (err) => {
        logger.error('PDFKit generation error:', err);
        reject(err);
      });

      // Palette constants
      const PRIMARY_NAVY = '#0B152D';
      const CARD_BG = '#F8FAFC';
      const ACCENT_CYAN = '#00838F';
      const TEXT_MAIN = '#0F172A';
      const TEXT_MUTED = '#475569';
      const BORDER_COLOR = '#CBD5E1';

      // Verdict colors
      let verdictColor = '#10B981'; // safe green
      if (scanData.verdict === 'MALICIOUS') verdictColor = '#DC2626';
      else if (scanData.verdict === 'SUSPICIOUS') verdictColor = '#D97706';

      // ==========================================
      // PAGE 1: COVER & EXECUTIVE SUMMARY
      // ==========================================

      // Top banner
      doc.rect(0, 0, doc.page.width, 100).fill(PRIMARY_NAVY);

      // LinkShield Brand & Logo
      doc.fillColor('#FFFFFF').fontSize(22).font('Helvetica-Bold')
        .text('LINKSHIELD', 45, 28);
      doc.fillColor('#00E5FF').fontSize(10).font('Helvetica')
        .text('SCAN SMART. CLICK SAFE.', 45, 54);
      doc.fillColor('#94A3B8').fontSize(9).font('Helvetica')
        .text('ENTERPRISE CYBER SECURITY THREAT INTELLIGENCE', 45, 68);

      // Report Title Badge (right aligned)
      doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold')
        .text('SECURITY ANALYSIS REPORT', 320, 32, { align: 'right', width: 230 });
      doc.fillColor('#94A3B8').fontSize(9).font('Helvetica')
        .text(`Report ID: ${scanData.scanId.substring(0, 24)}`, 320, 52, { align: 'right', width: 230 });
      doc.text(`Generated: ${new Date(scanData.scanDate).toUTCString()}`, 320, 66, { align: 'right', width: 230 });

      doc.y = 120;

      // Target URL Box
      doc.roundedRect(40, doc.y, doc.page.width - 80, 55, 6).fillAndStroke('#F1F5F9', '#E2E8F0');
      doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold').text('TARGET DESTINATION (SUBMITTED URL):', 55, doc.y + 10);
      doc.fillColor('#0284C7').fontSize(11).font('Helvetica-Bold').text(scanData.url, 55, doc.y + 24, {
        width: doc.page.width - 110,
        ellipsis: true,
      });

      doc.y += 75;

      // Executive Verdict & Score Container (Side by side cards)
      const cardY = doc.y;
      const cardWidth = (doc.page.width - 95) / 2;

      // Card 1: Overall Verdict
      doc.roundedRect(40, cardY, cardWidth, 90, 6).fillAndStroke(CARD_BG, BORDER_COLOR);
      doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica-Bold').text('OVERALL THREAT VERDICT', 55, cardY + 12);

      // Verdict Pill
      doc.roundedRect(55, cardY + 30, 160, 32, 4).fill(verdictColor);
      doc.fillColor('#FFFFFF').fontSize(14).font('Helvetica-Bold')
        .text(scanData.verdict, 55, cardY + 39, { width: 160, align: 'center' });

      doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica')
        .text(`Risk Severity: ${scanData.riskLevel}`, 55, cardY + 70);

      // Card 2: Threat Score
      doc.roundedRect(40 + cardWidth + 15, cardY, cardWidth, 90, 6).fillAndStroke(CARD_BG, BORDER_COLOR);
      doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica-Bold').text('THREAT SCORE', 55 + cardWidth + 15, cardY + 12);

      doc.fillColor(verdictColor).fontSize(30).font('Helvetica-Bold')
        .text(`${scanData.threatScore}`, 55 + cardWidth + 15, cardY + 28);
      doc.fillColor(TEXT_MUTED).fontSize(12).font('Helvetica')
        .text('/ 100', 105 + cardWidth + 15, cardY + 44);

      // Progress bar representation of score
      const barX = 55 + cardWidth + 15;
      const barY = cardY + 66;
      const barWidth = cardWidth - 30;
      doc.roundedRect(barX, barY, barWidth, 10, 3).fill('#E2E8F0');
      const fillW = Math.max(4, (scanData.threatScore / 100) * barWidth);
      doc.roundedRect(barX, barY, fillW, 10, 3).fill(verdictColor);

      doc.y = cardY + 110;

      // Vendor Telemetry Summary Metrics (4 mini-cards)
      const metricY = doc.y;
      const metricW = (doc.page.width - 110) / 4;
      const statsItems = [
        { label: 'Harmless', val: scanData.stats.harmless, color: '#10B981' },
        { label: 'Suspicious', val: scanData.stats.suspicious, color: '#F59E0B' },
        { label: 'Malicious', val: scanData.stats.malicious, color: '#EF4444' },
        { label: 'Undetected', val: scanData.stats.undetected, color: '#64748B' },
      ];

      statsItems.forEach((item, idx) => {
        const itemX = 40 + idx * (metricW + 10);
        doc.roundedRect(itemX, metricY, metricW, 48, 5).fillAndStroke(CARD_BG, BORDER_COLOR);
        doc.fillColor(item.color).fontSize(16).font('Helvetica-Bold')
          .text(String(item.val), itemX + 10, metricY + 8);
        doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold')
          .text(item.label.toUpperCase(), itemX + 10, metricY + 30);
      });

      doc.y = metricY + 65;

      // Executive Summary
      doc.fillColor(PRIMARY_NAVY).fontSize(12).font('Helvetica-Bold').text('EXECUTIVE SUMMARY', 40, doc.y);
      doc.rect(40, doc.y + 4, doc.page.width - 80, 1.5).fill(ACCENT_CYAN);
      doc.y += 12;

      doc.fillColor(TEXT_MAIN).fontSize(9).font('Helvetica').lineGap(3)
        .text(intelligenceData.executiveSummary || 'No executive summary available.', 40, doc.y, {
          width: doc.page.width - 80,
          align: 'justify',
        });

      doc.y += 15;

      // Security Intelligence Breakdown
      doc.fillColor(PRIMARY_NAVY).fontSize(12).font('Helvetica-Bold').text('SECURITY INTELLIGENCE & THREAT ASSESSMENT', 40, doc.y);
      doc.rect(40, doc.y + 4, doc.page.width - 80, 1.5).fill(ACCENT_CYAN);
      doc.y += 12;

      doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold').text('THREAT ASSESSMENT:', 40, doc.y);
      doc.fillColor(TEXT_MAIN).fontSize(9).font('Helvetica').text(intelligenceData.threatAssessment || 'N/A', 40, doc.y + 10, { width: doc.page.width - 80 });

      doc.y += 32;
      doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold').text('RISK EXPLANATION:', 40, doc.y);
      doc.fillColor(TEXT_MAIN).fontSize(9).font('Helvetica').text(intelligenceData.riskExplanation || 'N/A', 40, doc.y + 10, { width: doc.page.width - 80 });

      doc.y += 32;
      doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold').text('BUSINESS IMPACT:', 40, doc.y);
      doc.fillColor(TEXT_MAIN).fontSize(9).font('Helvetica').text(intelligenceData.businessImpact || 'N/A', 40, doc.y + 10, { width: doc.page.width - 80 });

      doc.y += 32;
      doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold').text('USER IMPACT:', 40, doc.y);
      doc.fillColor(TEXT_MAIN).fontSize(9).font('Helvetica').text(intelligenceData.userImpact || 'N/A', 40, doc.y + 10, { width: doc.page.width - 80 });

      // ==========================================
      // PAGE 2: TECHNICAL DETAILS & THREAT INDICATORS
      // ==========================================
      doc.addPage();

      // Page Header
      drawPageHeader(doc, 'TECHNICAL SPECIFICATIONS & THREAT SIGNATURES');

      doc.y = 80;

      // Technical Details Grid
      doc.fillColor(PRIMARY_NAVY).fontSize(12).font('Helvetica-Bold').text('TECHNICAL SPECIFICATIONS', 40, doc.y);
      doc.rect(40, doc.y + 4, doc.page.width - 80, 1.5).fill(ACCENT_CYAN);
      doc.y += 15;

      const techFields = [
        ['Resolved Domain', scanData.domain || 'Not available'],
        ['Protocol / SSL', scanData.isHttps ? 'HTTPS (TLS Encrypted)' : 'Insecure HTTP'],
        ['HTTP Status Code', scanData.httpDetails?.responseCode || 'Not available'],
        ['Content Type', scanData.httpDetails?.contentType || 'Not provided by VirusTotal'],
        ['Page Title', scanData.httpDetails?.title || 'Not provided by VirusTotal'],
        ['Community Reputation', String(scanData.reputation ?? 0)],
        ['Redirection Hops', String(scanData.redirectionChain?.length || 0)],
        ['Last Analysis Date', scanData.lastAnalysisDate || 'Not available'],
      ];

      const techTableY = doc.y;
      techFields.forEach(([label, value], i) => {
        const rowY = techTableY + i * 22;
        doc.rect(40, rowY, doc.page.width - 80, 20).fill(i % 2 === 0 ? '#F8FAFC' : '#FFFFFF');
        doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Bold').text(label, 50, rowY + 5);
        doc.fillColor(TEXT_MAIN).fontSize(8).font('Helvetica').text(String(value), 220, rowY + 5, {
          width: doc.page.width - 270,
          ellipsis: true,
        });
      });

      doc.y = techTableY + techFields.length * 22 + 20;

      // Threat Indicators Section
      doc.fillColor(PRIMARY_NAVY).fontSize(12).font('Helvetica-Bold').text('DETECTED THREAT INDICATORS', 40, doc.y);
      doc.rect(40, doc.y + 4, doc.page.width - 80, 1.5).fill(ACCENT_CYAN);
      doc.y += 15;

      if (scanData.indicators && scanData.indicators.length > 0) {
        scanData.indicators.forEach((ind) => {
          let indColor = '#10B981';
          if (ind.severity === 'critical') indColor = '#DC2626';
          else if (ind.severity === 'high') indColor = '#EA580C';
          else if (ind.severity === 'medium') indColor = '#D97706';

          const indY = doc.y;
          doc.roundedRect(40, indY, doc.page.width - 80, 36, 4).fillAndStroke(CARD_BG, BORDER_COLOR);

          // Severity dot/badge
          doc.roundedRect(50, indY + 8, 55, 18, 3).fill(indColor);
          doc.fillColor('#FFFFFF').fontSize(7).font('Helvetica-Bold')
            .text(ind.severity.toUpperCase(), 50, indY + 13, { width: 55, align: 'center' });

          doc.fillColor(PRIMARY_NAVY).fontSize(9).font('Helvetica-Bold')
            .text(ind.name, 115, indY + 7);
          doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica')
            .text(ind.description, 115, indY + 20, { width: doc.page.width - 165 });

          doc.y += 44;
        });
      } else {
        doc.fillColor(TEXT_MUTED).fontSize(9).font('Helvetica').text('No anomalous threat indicators detected.', 45, doc.y);
        doc.y += 20;
      }

      // Security Recommendations
      doc.y += 10;
      doc.fillColor(PRIMARY_NAVY).fontSize(12).font('Helvetica-Bold').text('ACTIONABLE SECURITY RECOMMENDATIONS', 40, doc.y);
      doc.rect(40, doc.y + 4, doc.page.width - 80, 1.5).fill(ACCENT_CYAN);
      doc.y += 15;

      recommendations.forEach((rec, idx) => {
        const recY = doc.y;
        doc.fillColor(ACCENT_CYAN).fontSize(10).font('Helvetica-Bold').text(`[${idx + 1}]`, 40, recY);
        doc.fillColor(PRIMARY_NAVY).fontSize(9).font('Helvetica-Bold').text(rec.title, 65, recY);
        doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(rec.description, 65, recY + 12, { width: doc.page.width - 110 });
        doc.y += 32;
      });

      // ==========================================
      // PAGE 3: SECURITY VENDOR TELEMETRY & WHOIS
      // ==========================================
      doc.addPage();
      drawPageHeader(doc, 'VIRUSTOTAL SECURITY VENDOR TELEMETRY');

      doc.y = 80;

      // Vendor Table Header
      doc.fillColor(PRIMARY_NAVY).fontSize(12).font('Helvetica-Bold').text('SECURITY VENDOR ANALYSIS BREAKDOWN', 40, doc.y);
      doc.rect(40, doc.y + 4, doc.page.width - 80, 1.5).fill(ACCENT_CYAN);
      doc.y += 15;

      // Table Header Row
      const tblHeaderY = doc.y;
      doc.rect(40, tblHeaderY, doc.page.width - 80, 20).fill(PRIMARY_NAVY);
      doc.fillColor('#FFFFFF').fontSize(8).font('Helvetica-Bold');
      doc.text('SECURITY VENDOR', 50, tblHeaderY + 6);
      doc.text('CATEGORY', 220, tblHeaderY + 6);
      doc.text('DETECTION RESULT', 340, tblHeaderY + 6);
      doc.text('METHOD', 460, tblHeaderY + 6);

      doc.y += 20;

      // Render top vendors (first 25 to fit page cleanly)
      const vendorsList = scanData.vendors || [];
      const vendorsToShow = vendorsList.slice(0, 26);

      vendorsToShow.forEach((v, index) => {
        const rowY = doc.y;
        doc.rect(40, rowY, doc.page.width - 80, 18).fill(index % 2 === 0 ? '#F8FAFC' : '#FFFFFF');

        let catColor = '#10B981';
        if (v.category === 'malicious') catColor = '#DC2626';
        else if (v.category === 'suspicious') catColor = '#D97706';
        else if (v.category === 'undetected') catColor = '#64748B';

        doc.fillColor(TEXT_MAIN).fontSize(8).font('Helvetica-Bold').text(v.name, 50, rowY + 5, { width: 160, ellipsis: true });
        doc.fillColor(catColor).fontSize(8).font('Helvetica-Bold').text(v.category.toUpperCase(), 220, rowY + 5);
        doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(v.result || 'clean', 340, rowY + 5, { width: 110, ellipsis: true });
        doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica').text(v.method || 'blacklist', 460, rowY + 5);

        doc.y += 18;
      });

      if (vendorsList.length > 26) {
        doc.y += 5;
        doc.fillColor(TEXT_MUTED).fontSize(8).font('Helvetica-Oblique')
          .text(`... and ${vendorsList.length - 26} additional security engines queried. All vendor statuses verified in full dataset.`, 40, doc.y);
      }

      doc.y += 25;

      // Final Conclusion Box
      doc.roundedRect(40, doc.y, doc.page.width - 80, 50, 4).fillAndStroke('#F1F5F9', '#CBD5E1');
      doc.fillColor(PRIMARY_NAVY).fontSize(9).font('Helvetica-Bold').text('FINAL SOC CONCLUSION:', 50, doc.y + 10);
      doc.fillColor(TEXT_MAIN).fontSize(8).font('Helvetica').text(
        `This automated threat intelligence assessment was compiled in accordance with standard SOC link-verification protocols. Final verdict: ${scanData.verdict} (${scanData.threatScore}/100 threat score). Recommended action: ${intelligenceData.recommendedAction}`,
        50, doc.y + 24, { width: doc.page.width - 100 }
      );

      // ==========================================
      // ADD FOOTERS & PAGE NUMBERS TO ALL PAGES
      // ==========================================
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.rect(40, doc.page.height - 35, doc.page.width - 80, 0.8).fill('#E2E8F0');
        doc.fillColor(TEXT_MUTED).fontSize(7.5).font('Helvetica')
          .text('Generated by LinkShield | Scan Smart. Click Safe. | Confidential Security Telemetry', 40, doc.page.height - 26);
        doc.text(`Page ${i + 1} of ${range.count}`, 40, doc.page.height - 26, {
          align: 'right',
          width: doc.page.width - 80,
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Standard page header for pages 2+
 */
function drawPageHeader(doc, sectionTitle) {
  doc.rect(0, 0, doc.page.width, 50).fill('#0B152D');
  doc.fillColor('#FFFFFF').fontSize(12).font('Helvetica-Bold')
    .text('LINKSHIELD', 40, 18);
  doc.fillColor('#00E5FF').fontSize(8).font('Helvetica')
    .text('THREAT INTELLIGENCE REPORT', 125, 21);
  doc.fillColor('#94A3B8').fontSize(8).font('Helvetica')
    .text(sectionTitle, 40, 21, { align: 'right', width: doc.page.width - 80 });
}
