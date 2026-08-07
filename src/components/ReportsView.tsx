import { useState } from 'react';
import { Download, Trash2, ChevronDown, FileText, Hash, Eye, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ShiftReport, Locale } from '../types';
import { t } from '../lib/i18n';
import { buildReportDocument } from '../lib/reportDocument';
import { downloadReportPdf } from '../lib/pdf';
import { Card, ConfirmDialog, formatDateMMDDYYYY, ScreenTitle } from './ui';
import { ReportViewScreen } from './ReportViewScreen';

const FREE_REPORT_LIMIT = 5;
const PAGE_SIZE = 5;

interface ReportsViewProps {
  locale: Locale;
  reports: ShiftReport[];
  isPremium: boolean;
  onUpgrade: () => void;
  onDelete: (id: string) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'info') => void;
}

export function ReportsView({ locale, reports, isPremium, onUpgrade, onDelete, onBack, onNotify }: ReportsViewProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<ShiftReport | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const sorted = [...reports].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const cappedReports = isPremium ? sorted : sorted.slice(0, FREE_REPORT_LIMIT);
  const hiddenCount = sorted.length - cappedReports.length;
  const totalPages = Math.max(1, Math.ceil(cappedReports.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageStart = safePage * PAGE_SIZE;
  const visibleReports = cappedReports.slice(pageStart, pageStart + PAGE_SIZE);
  const showPagination = totalPages > 1;

  async function handleDownload(report: ShiftReport) {
    setDownloadingId(report.id);
    try {
      const doc = buildReportDocument(report, locale);
      const filename = `${report.reportId ?? report.folio}.pdf`;
      await downloadReportPdf(doc, filename);
      onNotify(tr('downloadComplete'), 'success');
    } catch {
      onNotify(tr('downloadFailed'), 'info');
    } finally {
      setDownloadingId(null);
    }
  }

  function handleDelete(id: string) {
    if (!isPremium) {
      onUpgrade();
      return;
    }
    setDeletingId(id);
  }

  function confirmDelete() {
    if (!deletingId) return;
    onDelete(deletingId);
    onNotify(tr('reportDeleted'), 'success');
    setDeletingId(null);
    setPage(0);
  }

  if (viewingReport) {
    return (
      <ReportViewScreen
        locale={locale}
        report={viewingReport}
        onBack={() => setViewingReport(null)}
      />
    );
  }

  if (reports.length === 0) {
    return (
      <div className="pt-6">
        <Card className="text-center py-12">
          <FileText className="w-12 h-12 text-slate-700 mx-auto mb-3" />
          <p className="text-sm text-slate-400 mb-1">{tr('noReportsYet')}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <ScreenTitle title={tr('previousReports')} subtitle={tr('previousReportsDesc')} />

      <div className="space-y-3">
        {visibleReports.map((report) => {
          const isOpen = expanded === report.id;
          const date = formatDateMMDDYYYY(new Date(report.submittedAt));
          return (
            <Card key={report.id} className="fade-in">
              <button
                onClick={() => setExpanded(isOpen ? null : report.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{report.workSiteLabel || '—'}</p>
                  <div className="flex items-center gap-2 mt-0.5 min-w-0">
                    <span className="text-xs text-amber-400 font-mono flex items-center gap-0.5 shrink-0">
                      <Hash className="w-3 h-3" />
                      {report.reportId ?? report.folio}
                    </span>
                    <span className="text-xs text-slate-500 truncate">· {date} · {report.workerName}</span>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-slate-800 fade-in">
                  <div className="space-y-2 mb-4">
                    <DetailRow label={tr('name')} value={report.workerName} />
                    <DetailRow label={tr('company')} value={report.company} />
                    <DetailRow label={tr('jobNumber')} value={report.jobRef} />
                    <DetailRow label={tr('workSite')} value={report.workSiteLabel} />
                    {report.images.length > 0 && <DetailRow label={tr('photos')} value={`${report.images.length}`} />}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingReport(report)}
                      className="flex-1 min-w-0 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 text-sm font-semibold flex items-center justify-center gap-1.5 hover:from-amber-300 hover:to-orange-400 transition-all"
                    >
                      <Eye className="w-4 h-4 shrink-0" />
                      <span className="truncate">{tr('viewReport')}</span>
                    </button>
                    <button
                      onClick={() => handleDownload(report)}
                      disabled={downloadingId === report.id}
                      className="h-10 px-3 shrink-0 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 shrink-0" />
                      <span className="truncate">{downloadingId === report.id ? tr('preparingReport') : tr('downloadPdf')}</span>
                    </button>
                    {isPremium ? (
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="h-10 w-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-red-500/20 transition-colors"
                        aria-label={tr('deleteReport')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 flex items-center justify-center hover:bg-slate-700 transition-colors"
                        aria-label={tr('deleteReport')}
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {showPagination && (
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            onClick={() => { setPage(Math.max(0, safePage - 1)); setExpanded(null); }}
            disabled={safePage === 0}
            className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-slate-400 font-medium">
            {safePage + 1} / {totalPages}
          </span>
          <button
            onClick={() => { setPage(Math.min(totalPages - 1, safePage + 1)); setExpanded(null); }}
            disabled={safePage === totalPages - 1}
            className="h-10 w-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {!isPremium && hiddenCount > 0 && (
        <Card className="mt-4 text-center fade-in border-amber-500/20">
          <Lock className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <p className="text-sm text-slate-300 font-medium mb-1">
            {tr('reportsLocked').replace('{count}', String(hiddenCount))}
          </p>
          <p className="text-xs text-slate-400 mb-3">{tr('reportsLockedDesc')}</p>
          <button
            onClick={onUpgrade}
            className="text-sm text-amber-400 font-medium hover:text-amber-300 transition-colors"
          >
            {tr('upgradeToPremium')}
          </button>
        </Card>
      )}

      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title={tr('deleteReport')}
        message={tr('deleteReportConfirm')}
        confirmLabel={tr('delete')}
        cancelLabel={tr('cancel')}
        variant="danger"
      />
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-slate-500 w-24 shrink-0">{label}</span>
      <span className="text-sm text-slate-200 flex-1">{value}</span>
    </div>
  );
}
