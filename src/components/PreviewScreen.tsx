import { useState, useMemo } from 'react';
import {
  Save, Trash2, FileText, Hash, Lock,
} from 'lucide-react';
import type { WorkSite, EmployeeProfile, Locale, ReportTemplate, CustomField, ReportImage, FieldConfig, ShiftReport } from '../types';
import { t } from '../lib/i18n';
import { generateReportId, buildReport } from '../lib/pipeline';
import { buildReportDocument } from '../lib/reportDocument';
import { Card, PrimaryButton, GhostButton } from './ui';
import { PhotoGrid } from './PhotoGrid';
import { ReportDocumentView } from './ReportDocumentView';

export interface PreviewEdits {
  fieldValues: Record<string, string>;
  images: ReportImage[];
}

interface PreviewScreenProps {
  locale: Locale;
  employee: EmployeeProfile;
  workSite: WorkSite;
  initialFieldValues: Record<string, string>;
  initialImages: ReportImage[];
  reportTemplate: ReportTemplate | null;
  customFields: CustomField[];
  employeeFieldConfigs?: FieldConfig[] | null;
  workSiteFieldConfigs?: FieldConfig[] | null;
  reportFieldConfigs?: FieldConfig[] | null;
  isPremium: boolean;
  reports: ShiftReport[];
  onUpgrade: () => void;
  onSave: (edits: PreviewEdits, folio: string) => void | Promise<void>;
  onDiscard: () => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'info') => void;
}

export function PreviewScreen({
  locale, employee, workSite, initialFieldValues, initialImages,
  reportTemplate, customFields, employeeFieldConfigs, workSiteFieldConfigs, reportFieldConfigs,
  isPremium, reports, onUpgrade, onSave, onDiscard, onBack, onNotify,
}: PreviewScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [edits, setEdits] = useState<PreviewEdits>({
    fieldValues: initialFieldValues,
    images: initialImages,
  });
  const [saving, setSaving] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);

  const reportId = useMemo(
    () => generateReportId(employee.name || 'XX', workSite.label || 'XX', reports.map((r) => r.reportId ?? r.folio).filter(Boolean)),
    [employee.name, workSite.label, reports],
  );

  const reportDoc = useMemo(() => {
    const report = buildReport({
      employee,
      workSite,
      fieldValues: edits.fieldValues,
      images: edits.images,
      folio: reportId,
      reportTemplate,
      customFields,
      employeeFieldConfigs,
      workSiteFieldConfigs,
      reportFieldConfigs,
    });
    return buildReportDocument(report, locale);
  }, [edits, employee, workSite, reportId, locale, reportTemplate, customFields, employeeFieldConfigs, workSiteFieldConfigs, reportFieldConfigs]);

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(edits, reportId);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="pt-6">
      <div className="mb-5 fade-in">
        <h1 className="text-2xl font-semibold tracking-tight">{tr('reportPreview')}</h1>
        <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono font-semibold text-amber-400">{reportId}</span>
        </p>
      </div>

      <div className="mb-5">
        <ReportDocumentView
          doc={reportDoc}
          locale={locale}
          folio={reportId}
          dateStr={reportDoc.dateStr}
          title={tr('finalDraft')}
        />
      </div>

      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          {isPremium ? (
            <FileText className="w-4 h-4 text-amber-400" />
          ) : (
            <Lock className="w-4 h-4 text-amber-400" />
          )}
          <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">{tr('attachedPhotos')}</p>
        </div>
        {isPremium ? (
          <PhotoGrid
            images={edits.images}
            onChange={(images) => setEdits((prev) => ({ ...prev, images }))}
            locale={locale}
          />
        ) : (
          <button
            onClick={onUpgrade}
            className="w-full rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-6 flex flex-col items-center gap-2 hover:bg-amber-500/10 transition-colors"
          >
            <Lock className="w-6 h-6 text-amber-400" />
            <p className="text-sm text-amber-400 font-medium">{tr('photosPremiumOnly')}</p>
            <p className="text-xs text-slate-400">{tr('tapToUpgrade')}</p>
          </button>
        )}
      </Card>

      <div className="space-y-3">
        <PrimaryButton onClick={handleSave} disabled={saving} className="!h-12">
          <span className="flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            {saving ? tr('savingReport') : tr('saveReport')}
          </span>
        </PrimaryButton>
        <GhostButton onClick={() => setShowDiscard(true)} className="!h-10 flex items-center justify-center gap-1.5 text-red-400 hover:text-red-300">
          <Trash2 className="w-4 h-4" />
          {tr('discardDraft')}
        </GhostButton>
      </div>

      {showDiscard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDiscard(false)} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl px-6 py-7 fade-in">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 mx-auto mb-5">
              <Trash2 className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 text-center mb-2">{tr('discardDraftTitle')}</h3>
            <p className="text-sm text-slate-400 text-center mb-6">{tr('discardDraftMessage')}</p>
            <div className="space-y-2">
              <button onClick={() => { setShowDiscard(false); onDiscard(); }} className="w-full h-12 rounded-xl bg-red-500/90 text-white font-medium text-sm hover:bg-red-500 transition-colors">
                {tr('discardDraft')}
              </button>
              <button onClick={() => setShowDiscard(false)} className="w-full h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">
                {tr('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
