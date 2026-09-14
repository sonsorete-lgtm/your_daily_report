import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { ReportDocument, FieldRow } from './reportDocument';

const MARGIN = 36;
const PAGE_WIDTH = 595.28; // A4 in pt
const PAGE_HEIGHT = 841.89;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const FONT_REGULAR = 'helvetica';
const FONT_BOLD = 'helvetica';
const FONT_SERIF = 'times';
const ACCENT: [number, number, number] = [217, 119, 6]; // amber-600
const DARK: [number, number, number] = [15, 23, 42]; // slate-900
const MUTED: [number, number, number] = [100, 116, 139]; // slate-500
const FOOTER_TEXT = 'Created with YOUR DAILY REPORT APP';
const QR_URL = 'https://www.yourdailyreport.com';
const LOGO_MAX_W = 160;
const LOGO_MAX_H = 70;
const QR_SIZE = 32;
const FOOTER_PADDING = 10; // bottom margin from page edge to footer content

interface PdfCtx {
  doc: jsPDF;
  y: number;
}

function ensureSpace(ctx: PdfCtx, needed: number) {
  // Reserve space for footer: separator line + QR code + text + bottom padding
  const footerReserve = QR_SIZE + FOOTER_PADDING + 16;
  if (ctx.y + needed > PAGE_HEIGHT - MARGIN - footerReserve) {
    ctx.doc.addPage();
    ctx.y = MARGIN;
  }
}

function writeSectionTitle(ctx: PdfCtx, title: string, x = MARGIN) {
  ensureSpace(ctx, 28);
  const { doc } = ctx;
  doc.setFont(FONT_BOLD, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text(title.toUpperCase(), x, ctx.y);
  ctx.y += 14;
}

/** Write a field row with comfortable spacing — label above value. */
function writeFieldRow(ctx: PdfCtx, label: string, value: string, x = MARGIN, maxWidth = CONTENT_WIDTH) {
  if (!value) return;
  ensureSpace(ctx, 28);
  const { doc } = ctx;
  doc.setFont(FONT_REGULAR, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(label.toUpperCase(), x, ctx.y);
  ctx.y += 9;
  doc.setFont(FONT_REGULAR, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...DARK);
  const wrapped = doc.splitTextToSize(value, maxWidth) as string[];
  for (const line of wrapped) {
    doc.text(line, x, ctx.y);
    ctx.y += 12;
  }
}

function writeBody(ctx: PdfCtx, body: string) {
  const { doc } = ctx;
  doc.setFont(FONT_SERIF, 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...DARK);
  const wrapped = doc.splitTextToSize(body, CONTENT_WIDTH) as string[];
  for (const w of wrapped) {
    ensureSpace(ctx, 18);
    doc.text(w, MARGIN, ctx.y);
    ctx.y += 15;
  }
}

function loadImageDims(dataUrl: string): Promise<{ width: number; height: number; format: 'PNG' | 'JPEG' | 'WEBP' }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let format: 'PNG' | 'JPEG' | 'WEBP' = 'JPEG';
      if (dataUrl.startsWith('data:image/png')) format = 'PNG';
      else if (dataUrl.startsWith('data:image/webp')) format = 'WEBP';
      else if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) format = 'JPEG';
      resolve({ width: img.naturalWidth, height: img.naturalHeight, format });
    };
    img.onerror = () => resolve({ width: 0, height: 0, format: 'JPEG' });
    img.src = dataUrl;
  });
}

async function writeLogo(ctx: PdfCtx, logoDataUrl: string): Promise<void> {
  const dims = await loadImageDims(logoDataUrl);
  if (dims.width === 0) return;
  const scale = Math.min(LOGO_MAX_W / dims.width, LOGO_MAX_H / dims.height, 1);
  const w = dims.width * scale;
  const h = dims.height * scale;
  ensureSpace(ctx, h + 16);
  const { doc } = ctx;
  try {
    doc.addImage(logoDataUrl, dims.format, MARGIN, ctx.y, w, h, undefined, 'FAST');
    ctx.y += h + 16;
  } catch {
    // skip if image can't be embedded
  }
}

const IMAGE_GAP = 12;
const IMG_COLS = 2;
const IMG_ROWS = 3;
const IMG_MAX_PER_PAGE = IMG_COLS * IMG_ROWS;
const IMG_CELL_H = 230;

interface ImagePlacement {
  dataUrl: string;
  w: number;
  h: number;
  format: 'PNG' | 'JPEG' | 'WEBP';
}

/** Load image dimensions and format from a data URL. */
async function resolveImage(dataUrl: string): Promise<ImagePlacement | null> {
  if (!dataUrl.startsWith('data:image/')) return null;
  const dims = await loadImageDims(dataUrl);
  if (dims.width === 0) return null;
  return { dataUrl, w: dims.width, h: dims.height, format: dims.format };
}

/** Embed a single image at the given position, trying multiple formats. */
function placeImage(doc: jsPDF, img: ImagePlacement, x: number, y: number, w: number, h: number) {
  const formats: ('PNG' | 'JPEG' | 'WEBP')[] = [img.format, 'PNG', 'JPEG'];
  for (const fmt of formats) {
    try {
      doc.addImage(img.dataUrl, fmt, x, y, w, h, undefined, 'FAST');
      return;
    } catch {
      // try next format
    }
  }
}

/**
 * Write images in a responsive grid: images are arranged horizontally in rows,
 * wrapping to the next row when the row is full or the page runs out of space.
 * This keeps the PDF compact by minimizing wasted vertical space.
 */
/**
 * Render two sections side-by-side in two equal columns.
 * Both titles start at the same y; the longer column determines when the
 * next content begins.
 */
function writeTwoColumnHeader(
  ctx: PdfCtx,
  left: { title: string; rows: FieldRow[]; body?: string },
  right: { title: string; rows: FieldRow[]; body?: string },
) {
  const gap = 16;
  const colWidth = (CONTENT_WIDTH - gap) / 2;
  const leftX = MARGIN;
  const rightX = MARGIN + colWidth + gap;

  ensureSpace(ctx, 40);

  // Render both titles at the same baseline
  const { doc } = ctx;
  doc.setFont(FONT_BOLD, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...ACCENT);
  doc.text(left.title.toUpperCase(), leftX, ctx.y);
  doc.text(right.title.toUpperCase(), rightX, ctx.y);
  const titleY = ctx.y + 14;

  // Render each column independently, tracking the max y reached
  const renderColumn = (
    section: { rows: FieldRow[]; body?: string },
    x: number,
    width: number,
    startY: number,
  ): number => {
    let y = startY;
    for (const row of section.rows) {
      if (!row.value) continue;
      // Check page break
      if (y > ctx.pageBottom - 24) {
        ctx.doc.addPage();
        y = MARGIN;
      }
      ctx.doc.setFont(FONT_REGULAR, 'normal');
      ctx.doc.setFontSize(7);
      ctx.doc.setTextColor(...MUTED);
      ctx.doc.text(row.label.toUpperCase(), x, y);
      y += 9;
      ctx.doc.setFont(FONT_REGULAR, 'bold');
      ctx.doc.setFontSize(10);
      ctx.doc.setTextColor(...DARK);
      const wrapped = ctx.doc.splitTextToSize(row.value, width) as string[];
      for (const line of wrapped) {
        if (y > ctx.pageBottom - 24) {
          ctx.doc.addPage();
          y = MARGIN;
        }
        ctx.doc.text(line, x, y);
        y += 12;
      }
      y += 2; // small gap between field rows
    }
    if (section.body) {
      y += 4;
      ctx.doc.setFont(FONT_SERIF, 'normal');
      ctx.doc.setFontSize(10.5);
      ctx.doc.setTextColor(...DARK);
      const wrapped = ctx.doc.splitTextToSize(section.body, width) as string[];
      for (const line of wrapped) {
        if (y > ctx.pageBottom - 24) {
          ctx.doc.addPage();
          y = MARGIN;
        }
        ctx.doc.text(line, x, y);
        y += 15;
      }
    }
    return y;
  };

  const leftEndY = renderColumn(left, leftX, colWidth, titleY);
  const rightEndY = renderColumn(right, rightX, colWidth, titleY);
  ctx.y = Math.max(leftEndY, rightEndY) + 8;
}

async function writeImageGrid(ctx: PdfCtx, images: { dataUrl: string; name: string }[], title: string) {
  const resolved: ImagePlacement[] = [];
  for (const img of images) {
    const r = await resolveImage(img.dataUrl);
    if (r) resolved.push(r);
  }
  if (resolved.length === 0) return;

  const cellW = (CONTENT_WIDTH - IMAGE_GAP * (IMG_COLS - 1)) / IMG_COLS;
  const cellH = IMG_CELL_H;

  let idx = 0;

  while (idx < resolved.length) {
    // Always start a fresh page for images — page 1 is text only
    ctx.doc.addPage();
    ctx.y = MARGIN + 4;

    // Section title at top of each image page
    writeSectionTitle(ctx, title);
    const gridTop = ctx.y;

    const pageImages = resolved.slice(idx, idx + IMG_MAX_PER_PAGE);

    for (let i = 0; i < pageImages.length; i++) {
      const img = pageImages[i];
      const col = i % IMG_COLS;
      const row = Math.floor(i / IMG_COLS);

      const cellX = MARGIN + col * (cellW + IMAGE_GAP);
      const cellY = gridTop + row * (cellH + IMAGE_GAP);

      // Fit image within cell preserving original aspect ratio — no rotation
      const scale = Math.min(cellW / img.w, cellH / img.h, 1);
      const w = img.w * scale;
      const h = img.h * scale;

      // Center within cell
      const x = cellX + (cellW - w) / 2;
      const y = cellY + (cellH - h) / 2;

      placeImage(ctx.doc, img, x, y, w, h);
    }

    idx += pageImages.length;
  }
}

function writeHeader(ctx: PdfCtx, doc_: ReportDocument) {
  const { doc } = ctx;
  doc.setFont(FONT_BOLD, 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...DARK);
  doc.text(doc_.reportTitle, MARGIN, ctx.y + 4);
  ctx.y += 14;

  // Report ID + date line
  doc.setFont(FONT_REGULAR, 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...ACCENT);
  doc.text(`${doc_.reportIdLabel}: ${doc_.reportId}`, MARGIN, ctx.y + 6);
  doc.setTextColor(...MUTED);
  doc.text(doc_.dateStr, PAGE_WIDTH - MARGIN, ctx.y + 6, { align: 'right' });
  ctx.y += 14;

  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(2);
  doc.line(MARGIN, ctx.y, PAGE_WIDTH - MARGIN, ctx.y);
  ctx.y += 18;
}

async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 120,
    errorCorrectionLevel: 'M',
    color: { dark: '#64748b', light: '#ffffff' },
  });
}

async function writeFooter(ctx: PdfCtx, doc_: ReportDocument) {
  const pageCount = ctx.doc.getNumberOfPages();

  let qrDataUrl: string | null = null;
  try {
    qrDataUrl = await generateQrDataUrl(QR_URL);
  } catch {
    // QR generation failed — footer text only
  }

  for (let i = 1; i <= pageCount; i++) {
    const doc = ctx.doc;
    doc.setPage(i);

    // Layout: separator line sits above the QR code, with consistent bottom padding.
    // QR code bottom-left, footer text centered, page numbers bottom-right.
    const separatorY = PAGE_HEIGHT - MARGIN - QR_SIZE - 4;
    const qrY = separatorY + 6;
    const textY = qrY + QR_SIZE / 2 + 2;

    // Footer separator line
    doc.setDrawColor(...MUTED);
    doc.setLineWidth(0.5);
    doc.line(MARGIN, separatorY, PAGE_WIDTH - MARGIN, separatorY);

    // QR code — bottom-left, with bottom margin from page edge
    if (qrDataUrl) {
      try {
        doc.addImage(qrDataUrl, 'PNG', MARGIN, qrY, QR_SIZE, QR_SIZE, undefined, 'FAST');
      } catch {
        // skip QR if embedding fails
      }
    }

    // Footer text — centered vertically aligned with QR code
    doc.setFont(FONT_REGULAR, 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(FOOTER_TEXT, PAGE_WIDTH / 2, textY, { align: 'center' });

    // Page numbers — bottom-right
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`${doc_.pageLabel} ${i} ${doc_.ofLabel} ${pageCount}`, PAGE_WIDTH - MARGIN, textY, { align: 'right' });
  }
}

export async function buildReportPdfDoc(doc_: ReportDocument): Promise<jsPDF> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const ctx: PdfCtx = { doc, y: MARGIN + 4 };

  // Company logo at top
  if (doc_.companyLogo) {
    await writeLogo(ctx, doc_.companyLogo);
  }

  writeHeader(ctx, doc_);

  // Two-column header: Employee Information (left) + Work Site Information (right)
  if (doc_.sections.length >= 2) {
    const left = doc_.sections[0];
    const right = doc_.sections[1];
    const hasLeft = left.rows.length > 0 || left.body;
    const hasRight = right.rows.length > 0 || right.body;

    if (hasLeft && hasRight) {
      writeTwoColumnHeader(ctx, left, right);
    } else {
      for (const s of [left, right]) {
        if (s.rows.length === 0 && !s.body) continue;
        ctx.y += 12;
        writeSectionTitle(ctx, s.title);
        for (const row of s.rows) writeFieldRow(ctx, row.label, row.value);
        if (s.body) { ctx.y += 4; writeBody(ctx, s.body); }
        ctx.y += 6;
      }
    }
  }

  // Remaining content sections (Daily Report fields, custom sections)
  for (let i = 2; i < doc_.sections.length; i++) {
    const section = doc_.sections[i];

    ctx.y += 14;
    writeSectionTitle(ctx, section.title);

    if (section.rows.length > 0) {
      for (const row of section.rows) {
        writeFieldRow(ctx, row.label, row.value);
      }
    }
    if (section.body) {
      ctx.y += 4;
      writeBody(ctx, section.body);
    }
    ctx.y += 6;
  }

  if (doc_.showImages && doc_.images.length > 0) {
    // Images always go on a new page — page 1 is text only
    await writeImageGrid(ctx, doc_.images, doc_.imagesTitle);
  }

  await writeFooter(ctx, doc_);
  return doc;
}

export async function downloadReportPdf(doc_: ReportDocument, filename: string): Promise<void> {
  const doc = await buildReportPdfDoc(doc_);
  const safeName = filename.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');

  if (Capacitor.isNativePlatform()) {
    const blob = doc.output('blob') as Blob;
    const base64Data = await blobToBase64(blob);
    const savedFile = await Filesystem.writeFile({
      path: safeName,
      data: base64Data,
      directory: Directory.Cache,
    });
    await Share.share({
      title: safeName,
      url: savedFile.uri,
    });
    return;
  }

  doc.save(safeName);
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
