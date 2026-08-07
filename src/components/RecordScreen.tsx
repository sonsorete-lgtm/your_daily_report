import { useState, useEffect } from 'react';
import {
  ChevronDown, ArrowRight, CheckCircle2, User,
} from 'lucide-react';
import type {
  WorkSite, EmployeeProfile, Locale, ReportTemplate,
  ReportSectionKey, CustomField, FieldConfig, ReportImage,
} from '../types';
import { DEFAULT_TEMPLATE } from '../types';
import { t } from '../lib/i18n';
import { getOrderedEnabledSections } from '../lib/pipeline';
import { storage } from '../lib/storage';
import { Card, PrimaryButton } from './ui';

export interface ReportEntry {
  fieldValues: Record<string, string>;
  images: ReportImage[];
}

interface RecordScreenProps {
  employee: EmployeeProfile;
  workSites: WorkSite[];
  locale: Locale;
  reportTemplate: ReportTemplate;
  customFields: CustomField[];
  reportFieldConfigs?: FieldConfig[] | null;
  selectedSiteId: string | null;
  onSelectSite: (id: string) => void;
  onSubmit: (entry: ReportEntry, site: WorkSite) => void;
  onOpenWorkSites: () => void;
  onOpenEmployeeSettings: () => void;
  onOpenReportTemplate: () => void;
  profiles: EmployeeProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  isPremium: boolean;
}

export function RecordScreen({
  employee, workSites, locale, reportTemplate, customFields, reportFieldConfigs,
  selectedSiteId, onSelectSite, onSubmit, onOpenWorkSites, onOpenEmployeeSettings, onOpenReportTemplate,
  profiles, selectedProfileId, onSelectProfile, isPremium,
}: RecordScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  const hasProfiles = profiles.length > 0;
  const hasWorkSites = workSites.length > 0;
  const prerequisitesMet = hasProfiles && hasWorkSites;

  const activeSite = workSites.find((s) => s.id === selectedSiteId && (isPremium || workSites.indexOf(s) === 0)) ?? workSites[0] ?? null;
  const enabledSections = getOrderedEnabledSections(reportTemplate ?? DEFAULT_TEMPLATE, isPremium);

  return (
    <div className="pt-6">
      <div className="mb-5 fade-in">
        <h1 className="text-2xl font-semibold tracking-tight">{tr('homeTitle')}</h1>
        <p className="text-sm font-medium text-amber-400 mt-1">{tr('createReport')}</p>
      </div>

      {!prerequisitesMet && (
        <div className="mb-5 fade-in rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-4">
          <div className="flex-1 space-y-3">
            {!hasProfiles && (
              <button onClick={onOpenEmployeeSettings} className="w-full text-left">
                <p className="text-sm font-semibold text-slate-200">{tr('noEmployeeInfoYet')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{tr('completeEmployeeToContinue')}</p>
                <span className="text-xs text-amber-400 font-medium mt-1 inline-flex items-center gap-1">
                  {tr('employeeSettings')} <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            )}
            {!hasWorkSites && (
              <button onClick={onOpenWorkSites} className="w-full text-left pt-3 border-t border-amber-500/20">
                <p className="text-sm font-semibold text-slate-200">{tr('noWorkSitesYet')}</p>
                <p className="text-xs text-slate-400 mt-0.5">{tr('addWorkSiteToBegin')}</p>
                <span className="text-xs text-amber-400 font-medium mt-1 inline-flex items-center gap-1">
                  {tr('workSites')} <ArrowRight className="w-3 h-3" />
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {hasProfiles && (
        <ProfileSelector
          locale={locale}
          profiles={profiles}
          selectedProfileId={selectedProfileId ?? ''}
          onSelect={onSelectProfile}
          onOpenEmployeeSettings={onOpenEmployeeSettings}
          isPremium={isPremium}
        />
      )}

      {hasWorkSites && (
        <WorkSiteSelector
          locale={locale}
          workSites={workSites}
          selectedSiteId={activeSite?.id ?? ''}
          onSelect={onSelectSite}
          onOpenWorkSites={onOpenWorkSites}
          isPremium={isPremium}
        />
      )}

      {prerequisitesMet && activeSite && selectedProfileId && (
        <ReportForm
          locale={locale}
          enabledSections={enabledSections}
          customFields={customFields}
          reportFieldConfigs={reportFieldConfigs}
          canSubmit={!!activeSite}
          onSubmit={(fieldValues) => {
            if (!activeSite) return;
            onSubmit({ fieldValues, images: [] }, activeSite);
          }}
          onOpenReportTemplate={onOpenReportTemplate}
        />
      )}
    </div>
  );
}

function WorkSiteSelector({
  locale, workSites, selectedSiteId, onSelect, onOpenWorkSites, isPremium,
}: {
  locale: EmployeeProfile['locale'];
  workSites: WorkSite[];
  selectedSiteId: string;
  onSelect: (id: string) => void;
  onOpenWorkSites: () => void;
  isPremium: boolean;
}) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  return (
    <Card className="mb-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{tr('workSite')}</p>
          {selectedSiteId ? (
            <p className="text-base font-semibold text-emerald-400 mt-0.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              {workSites.find((s) => s.id === selectedSiteId)?.label}
            </p>
          ) : (
            <p className="text-base font-semibold text-slate-400 mt-0.5">—</p>
          )}
        </div>
      </div>
      <div className="relative">
        <select
          value={selectedSiteId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none px-3 h-11 pr-9 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
        >
          {workSites.map((s, i) => (
            <option key={s.id} value={s.id} disabled={!isPremium && i > 0}>
              {s.label}{s.jobNumber ? ` · ${s.jobNumber}` : ''}
              {!isPremium && i > 0 ? ` (${tr('premium')})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      <button onClick={onOpenWorkSites} className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-medium">
        {tr('workSites')} ›
      </button>
    </Card>
  );
}

function ProfileSelector({
  locale, profiles, selectedProfileId, onSelect, onOpenEmployeeSettings, isPremium,
}: {
  locale: EmployeeProfile['locale'];
  profiles: EmployeeProfile[];
  selectedProfileId: string;
  onSelect: (id: string) => void;
  onOpenEmployeeSettings: () => void;
  isPremium: boolean;
}) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const selected = profiles.find((p) => p.id === selectedProfileId);

  return (
    <Card className="mb-5">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{tr('employeeProfile')}</p>
          {selected ? (
            <div className="mt-0.5">
              <p className="text-base font-semibold text-emerald-400 flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {selected.name || tr('newProfile')}
              </p>
              {selected.company && (
                <p className="text-xs text-slate-400 mt-0.5">{selected.company}</p>
              )}
            </div>
          ) : (
            <p className="text-base font-semibold text-slate-400 mt-0.5">—</p>
          )}
        </div>
      </div>
      <div className="relative">
        <select
          value={selectedProfileId}
          onChange={(e) => onSelect(e.target.value)}
          className="w-full appearance-none px-3 h-11 pr-9 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-amber-500/60"
        >
          {profiles.map((p, i) => (
            <option key={p.id} value={p.id} disabled={!isPremium && i > 0}>
              {p.name || tr('newProfile')}{p.company ? ` · ${p.company}` : ''}
              {!isPremium && i > 0 ? ` (${tr('premium')})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
      <button onClick={onOpenEmployeeSettings} className="mt-2 text-xs text-amber-400 hover:text-amber-300 font-medium">
        {tr('employeeProfiles')} ›
      </button>
    </Card>
  );
}

function ReportForm({
  locale, enabledSections, customFields, reportFieldConfigs, canSubmit, onSubmit, onOpenReportTemplate,
}: {
  locale: EmployeeProfile['locale'];
  enabledSections: ReportSectionKey[];
  customFields: CustomField[];
  reportFieldConfigs?: FieldConfig[] | null;
  canSubmit: boolean;
  onSubmit: (fieldValues: Record<string, string>) => void;
  onOpenReportTemplate: () => void;
}) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [values, setValues] = useState<Record<string, string>>(() => storage.getReportFormValues() ?? {});

  useEffect(() => {
    const id = setTimeout(() => storage.setReportFormValues(values), 500);
    return () => clearTimeout(id);
  }, [values]);

  const sortedCustomFields = [...customFields].sort((a, b) => a.order - b.order);
  const allFields = [
    ...enabledSections.map((k) => ({ id: k as string, label: tr(k) })),
    ...sortedCustomFields.map((f) => ({ id: f.id, label: f.label })),
  ];

  if (reportFieldConfigs && reportFieldConfigs.length > 0) {
    const orderMap = new Map(reportFieldConfigs.map((f, i) => [f.id, i] as [string, number]));
    allFields.sort((a, b) => (orderMap.get(a.id) ?? 999) - (orderMap.get(b.id) ?? 999));
  }

  function handleChange(id: string, value: string) {
    setValues((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit() {
    storage.setReportFormValues(null);
    onSubmit(values);
  }

  const hasContent = Object.values(values).some((v) => v?.trim());

  return (
    <Card className="fade-in">
      <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-4">{tr('reportFields')}</p>

      <div className="space-y-4">
        {allFields.map((field) => (
          <div key={field.id}>
            <label className="text-xs text-slate-500 block mb-1">{field.label}</label>
            <textarea
              value={values[field.id] ?? ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              placeholder={tr('textFormPlaceholder')}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 resize-none"
            />
          </div>
        ))}
      </div>

      <button onClick={onOpenReportTemplate} className="mt-4 text-xs text-amber-400 hover:text-amber-300 font-medium">
        {tr('reportFields')} ›
      </button>

      <div className="mt-5">
        {!hasContent && canSubmit && (
          <p className="text-xs text-slate-500 mb-2 text-center">{tr('fillAtLeastOneField')}</p>
        )}
        <PrimaryButton onClick={handleSubmit} disabled={!canSubmit || !hasContent} className="!h-12">
          {tr('continueToPreview')}
        </PrimaryButton>
      </div>
    </Card>
  );
}
