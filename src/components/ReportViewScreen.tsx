import { Hash, Calendar, X } from 'lucide-react';
import type { ShiftReport, Locale } from '../types';
import { t } from '../lib/i18n';
import { buildReportDocument } from '../lib/reportDocument';
import { isSectionEnabled } from '../lib/pipeline';
import { Card, formatDateMMDDYYYY } from './ui';
import { ReportDocumentView } from './ReportDocumentView';
import { useMemo } from 'react';

interface ReportViewScreenProps {
  locale: Locale;
  report: ShiftReport;
  onBack: () => void;
}

export function ReportViewScreen({ locale, report, onBack }: ReportViewScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  const doc = useMemo(() => {
    try {
      return { ok: true, doc: buildReportDocument(report, locale) } as const;
    } catch {
      return { ok: false, doc: null } as const;
    }
  }, [report, locale]);

  if (!doc.ok || !doc.doc) {
    return (
      <div className="pt-6 pb-4">
        <div className="flex items-center justify-between mb-5 fade-in">
          <h1 className="text-2xl font-semibold tracking-tight">{tr('viewReportTitle')}</h1>
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            aria-label={tr('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <Card className="text-center py-12">
          <p className="text-sm text-slate-400">{tr('reportLoadError')}</p>
          <button onClick={onBack} className="mt-4 text-sm text-amber-400 hover:text-amber-300 font-medium">
            {tr('back')}
          </button>
        </Card>
      </div>
    );
  }

  const reportDoc = doc.doc;
  const date = formatDateMMDDYYYY(new Date(report.submittedAt));

  return (
    <div className="pt-6 pb-4">
      <div className="flex items-center justify-between mb-5 fade-in">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{tr('viewReportTitle')}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-amber-400 font-mono flex items-center gap-0.5">
              <Hash className="w-3 h-3" />
              {report.reportId ?? report.folio}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-0.5">
              <Calendar className="w-3 h-3" />
              {date}
            </span>
          </div>
        </div>
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          aria-label={tr('close')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <ReportDocumentView
        doc={reportDoc}
        locale={locale}
        folio={report.reportId ?? report.folio}
        dateStr={date}
        title={tr('dailyReport')}
      />
    </div>
  );
}
