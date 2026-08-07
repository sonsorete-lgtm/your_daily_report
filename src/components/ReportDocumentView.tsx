import { Hash, Calendar, User, MapPin, FileText, ImageIcon, Building2, X } from 'lucide-react';
import { useState } from 'react';
import type { ReportDocument } from '../lib/reportDocument';
import type { Locale } from '../types';
import { t } from '../lib/i18n';

interface ReportDocumentViewProps {
  doc: ReportDocument;
  locale: Locale;
  folio: string;
  dateStr: string;
  title: string;
}

export function ReportDocumentView({ doc, locale, folio, dateStr, title }: ReportDocumentViewProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [enlarged, setEnlarged] = useState<string | null>(null);

  const empSection = doc.sections.find((s) => s.title === tr('employeeInformation'));
  const siteSection = doc.sections.find((s) => s.title === tr('workSiteInformation'));
  const imagesTitle = tr('imagesOfWork');
  const contentSections = doc.sections.filter(
    (s) => s !== empSection && s !== siteSection && s.title !== imagesTitle
  );

  return (
    <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden fade-in shadow-sm">
      {/* Document header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-200">
        {doc.companyLogo && (
          <div className="flex justify-center mb-3">
            <img src={doc.companyLogo} alt="Company Logo" className="max-h-16 object-contain" />
          </div>
        )}
        <h2 className="text-lg font-bold text-slate-900 text-center tracking-tight">{doc.reportTitle}</h2>
        <div className="flex items-center justify-center gap-3 mt-2 text-xs">
          <span className="font-mono font-semibold text-amber-600 flex items-center gap-0.5">
            <Hash className="w-3 h-3" />
            {doc.reportIdLabel}: {folio}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-500 flex items-center gap-0.5">
            <Calendar className="w-3 h-3" />
            {dateStr}
          </span>
        </div>
      </div>

      {/* Document body */}
      <div className="px-5 py-4 space-y-5">
        {/* Employee Information */}
        <section>
          <div className="flex items-center gap-1.5 mb-2">
            <User className="w-3.5 h-3.5 text-amber-600" />
            <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">{tr('employeeInformation')}</h3>
          </div>
          {empSection && empSection.rows.length > 0 ? (
            <div className="space-y-1.5 pl-5">
              {empSection.rows.map((row, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-slate-500 font-medium w-[90px] sm:w-[110px] shrink-0 pt-0.5">{row.label}:</span>
                  <span className="text-slate-900 flex-1 break-words leading-relaxed">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic pl-5">—</p>
          )}
        </section>

        {/* Work Site Information */}
        <section>
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">{tr('workSiteInformation')}</h3>
          </div>
          {siteSection && siteSection.rows.length > 0 ? (
            <div className="space-y-1.5 pl-5">
              {siteSection.rows.map((row, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-slate-500 font-medium w-[90px] sm:w-[110px] shrink-0 pt-0.5">{row.label}:</span>
                  <span className="text-slate-900 flex-1 break-words leading-relaxed">{row.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic pl-5">—</p>
          )}
        </section>

        {/* Report content sections */}
        {contentSections.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">{title}</h3>
            </div>
            <div className="space-y-4 pl-5">
              {contentSections.map((section, i) => (
                <div key={i}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{section.title}</p>
                  {section.rows.length > 0 && (
                    <div className="space-y-1.5 mb-1">
                      {section.rows.map((row, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <span className="text-slate-500 font-medium w-[90px] sm:w-[110px] shrink-0 pt-0.5">{row.label}:</span>
                          <span className="text-slate-900 flex-1 break-words leading-relaxed">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.body && (
                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap break-words">{section.body}</p>
                  )}
                  {!section.body && section.rows.length === 0 && (
                    <p className="text-sm text-slate-400 italic">—</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Images section */}
        {doc.showImages && doc.images.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-2">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              <h3 className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">{doc.imagesTitle}</h3>
            </div>
            {doc.images.length > 0 ? (
              <div className="pl-5 space-y-2">
                <div className="grid grid-cols-2 gap-2.5">
                  {doc.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => img.dataUrl && setEnlarged(img.dataUrl)}
                      className="rounded-lg overflow-hidden border border-slate-200 hover:border-amber-400 transition-colors text-left"
                    >
                      {img.dataUrl && <img src={img.dataUrl} alt={img.name} className="w-full h-28 object-cover" />}
                      <p className="text-xs text-slate-500 px-2 py-1 break-words leading-snug bg-slate-50">{img.name}</p>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-400 italic">{doc.imagesSummaryText}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic pl-5">{doc.noImagesText}</p>
            )}
          </section>
        )}
      </div>

      {/* Document footer */}
      <div className="px-5 py-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Building2 className="w-3 h-3" />
            {tr('endOfReport')}
          </span>
          <span className="font-mono text-amber-600">{folio}</span>
        </div>
      </div>

      {/* Image lightbox */}
      {enlarged && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setEnlarged(null)}
        >
          <button
            onClick={() => setEnlarged(null)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label={tr('close')}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={enlarged}
            alt="Enlarged"
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
