import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Copy, MapPin, Hash, Mail, User, FileText, Users,
  Lock, Sparkles, Building2, Phone,
} from 'lucide-react';
import type { WorkSite, Locale, CustomField, FieldConfig, WorkSiteFieldKey } from '../types';
import { DEFAULT_WORKSITE_FIELDS } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, InfoField, Card, AutoSavedIndicator, ConfirmDialog, PrimaryButton } from './ui';
import { canAddWorkSite } from '../lib/license';
import { FieldBuilder } from './FieldBuilder';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

interface WorkSitesScreenProps {
  workSites: WorkSite[];
  onChange: React.Dispatch<React.SetStateAction<WorkSite[]>>;
  locale: Locale;
  onBack: () => void;
  onUpgrade: () => void;
  fieldConfigs: FieldConfig[];
  onFieldConfigsChange: (configs: FieldConfig[]) => void;
  isPremium: boolean;
}

export function WorkSitesScreen({
  workSites, onChange, locale, onBack, onUpgrade,
  fieldConfigs, onFieldConfigsChange, isPremium,
}: WorkSitesScreenProps) {
  const [editing, setEditing] = useState<WorkSite | null>(null);
  const [isNew, setIsNew] = useState(false);
  const isNewRef = useRef(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  function startNew() {
    if (!canAddWorkSite(workSites.length)) {
      onUpgrade();
      return;
    }
    setEditing({ id: uid(), label: '', pmName: '', pmEmail: '', pmPhone: '', siteAddress: '', jobNumber: '', companyClient: '', jobDescription: '', contractNumber: '', poNumber: '', costCode: '', costCenter: '', buildingArea: '', floorUnit: '', assetNumber: '', customerRep: '', customerPhone: '', customerEmail: '', crew: '', superintendent: '', safetyRequirements: '', siteAccessInstructions: '', gateCode: '', permitNumber: '', gpsCoordinates: '', customFields: [], customFieldValues: {} });
    setIsNew(true);
    isNewRef.current = true;
  }

  function persist(s: WorkSite) {
    if (!s.label.trim() && !s.jobNumber.trim()) return;
    if (isNewRef.current) {
      onChange((prev) => {
        if (prev.some((x) => x.id === s.id)) return prev.map((x) => (x.id === s.id ? s : x));
        return [s, ...prev];
      });
      isNewRef.current = false;
      setIsNew(false);
    } else {
      onChange((prev) => prev.map((x) => (x.id === s.id ? s : x)));
    }
  }

  function remove(id: string) {
    setDeletingId(id);
  }

  function confirmDelete() {
    if (!deletingId) return;
    onChange((prev) => prev.filter((p) => p.id !== deletingId));
    setDeletingId(null);
  }

  function duplicateWorkSite(id: string) {
    if (!canAddWorkSite(workSites.length)) {
      onUpgrade();
      return;
    }
    const original = workSites.find((w) => w.id === id);
    if (!original) return;
    const copy: WorkSite = {
      ...original,
      id: uid(),
      label: `${original.label} (Copy)`,
      customFields: [...original.customFields],
      customFieldValues: { ...original.customFieldValues },
    };
    onChange((prev) => [...prev, copy]);
    setDuplicatingId(null);
  }

  if (editing) {
    return (
      <WorkSiteEditor
        site={editing}
        locale={locale}
        isNew={isNew}
        onSave={persist}
        onBack={() => { setEditing(null); setIsNew(false); isNewRef.current = false; }}
        onUpgrade={onUpgrade}
        fieldConfigs={fieldConfigs}
        onFieldConfigsChange={onFieldConfigsChange}
        isPremium={isPremium}
      />
    );
  }

  return (
    <div className="pt-6">
      <ScreenTitle title={tr('workSites')} subtitle={tr('workSitesDesc')} />

      {workSites.length === 0 ? (
        <div className="py-16 text-center">
          <FileText className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm text-slate-500 mb-4">{tr('noWorkSitesYet')}</p>
          <PrimaryButton onClick={startNew} className="!h-11">
            <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> {tr('createFirstWorkSite')}</span>
          </PrimaryButton>
        </div>
      ) : (
        <>
          <div className="space-y-2.5 mb-4">
            {workSites.map((s, i) => {
              const locked = !isPremium && i > 0;
              return (
                <Card
                  key={s.id}
                  className={`transition-colors ${locked ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className={`text-sm font-semibold truncate ${locked ? 'text-slate-400' : 'text-slate-100'}`}>
                          {s.label || s.jobNumber}
                        </p>
                        {locked && (
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-400/80 font-semibold shrink-0">
                            <Lock className="w-3 h-3" /> {tr('premium')}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 space-y-0.5 text-xs text-slate-400">
                        {s.jobNumber && <p className="flex items-center gap-1.5"><Hash className="w-3 h-3" /> {s.jobNumber}</p>}
                        {s.siteAddress && <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {s.siteAddress}</p>}
                        {s.pmName && <p className="flex items-center gap-1.5"><User className="w-3 h-3" /> {s.pmName}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => locked ? onUpgrade() : (setEditing(s), setIsNew(false))}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${locked ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                      aria-label={tr('editWorkSite')}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => locked ? onUpgrade() : setDuplicatingId(s.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${locked ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                      aria-label={tr('duplicateWorkSite')}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => locked ? onUpgrade() : setDeletingId(s.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ml-auto ${locked ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-red-500/10 text-slate-400 hover:text-red-400'}`}
                      aria-label={tr('deleteWorkSite')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          <button
            onClick={startNew}
            className="w-full h-11 rounded-xl border border-dashed border-slate-700 text-sm text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center justify-center gap-1.5"
          >
            {!canAddWorkSite(workSites.length) ? (
              <><Lock className="w-4 h-4 text-amber-400" /> {tr('newWorkSite')} <Lock className="w-3 h-3 ml-0.5" /></>
            ) : (
              <><Plus className="w-4 h-4" /> {tr('newWorkSite')}</>
            )}
          </button>

          {!isPremium && (
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-400">{tr('workSiteLimitFree')}</p>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={confirmDelete}
        title={tr('deleteWorkSite')}
        message={tr('deleteWorkSiteConfirm')}
        confirmLabel={tr('delete')}
        cancelLabel={tr('cancel')}
        variant="danger"
      />

      <ConfirmDialog
        open={!!duplicatingId}
        onClose={() => setDuplicatingId(null)}
        onConfirm={() => duplicatingId && duplicateWorkSite(duplicatingId)}
        title={tr('duplicateWorkSite')}
        message={tr('duplicateWorkSiteConfirm')}
        confirmLabel={tr('ok')}
        cancelLabel={tr('cancel')}
      />
    </div>
  );
}

function WorkSiteEditor({
  site, locale, isNew, onSave, onBack, onUpgrade, fieldConfigs, onFieldConfigsChange, isPremium,
}: {
  site: WorkSite;
  locale: Locale;
  isNew: boolean;
  onSave: (s: WorkSite) => void;
  onBack: () => void;
  onUpgrade: () => void;
  fieldConfigs: FieldConfig[];
  onFieldConfigsChange: (configs: FieldConfig[]) => void;
  isPremium: boolean;
}) {
  const [s, setS] = useState<WorkSite>(site);
  const sRef = useRef(s);
  sRef.current = s;
  const [showSaved, setShowSaved] = useState(false);
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const premium = isPremium;
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashSaved = useCallback(() => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setShowSaved(true);
    savedTimer.current = setTimeout(() => setShowSaved(false), 2500);
  }, []);

  // Debounced save: updates parent state after typing pauses.
  // Local state updates immediately for responsive input.
  const debouncedSave = useCallback((next: WorkSite) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null; // Mark as fired so unmount cleanup doesn't double-save
      onSave(next);
      flashSaved();
    }, 600);
  }, [onSave, flashSaved]);

  // Flush pending save on unmount so no edits are lost.
  // Only flush if the timer hasn't fired yet (saveTimer.current !== null means pending).
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
        onSave(sRef.current);
      }
      if (savedTimer.current) {
        clearTimeout(savedTimer.current);
        savedTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const effectiveConfigs = useMemo(() => {
    if (!fieldConfigs.length) return DEFAULT_WORKSITE_FIELDS;
    return [...fieldConfigs].sort((a, b) => a.order - b.order);
  }, [fieldConfigs]);

  const visibleFields = effectiveConfigs.filter((f) => f.visible && !(!!f.premium && !premium));
  const customFields = s.customFields ?? [];

  function update(patch: Partial<WorkSite>) {
    const next = { ...s, ...patch };
    setS(next);
    if (next.label.trim() || next.jobNumber.trim()) {
      debouncedSave(next);
    }
  }

  function updateCustomFieldValue(id: string, value: string) {
    update({ customFieldValues: { ...(s.customFieldValues ?? {}), [id]: value } });
  }

  function handleCustomFieldsChange(fields: CustomField[]) {
    update({ customFields: fields });
  }

  const [showRestore, setShowRestore] = useState(false);

  function restoreDefaults() {
    const restored = DEFAULT_WORKSITE_FIELDS.map((f, i) => ({ ...f, order: i }));
    onFieldConfigsChange(restored);
    setShowRestore(false);
  }

  function renderField(field: FieldConfig) {
    const locked = !!field.premium && !premium;
    if (field.kind === 'system') {
      const key = field.id as WorkSiteFieldKey;
      const label = field.labelOverride ?? tr(field.labelKey as Parameters<typeof t>[1]);
      const lockProps = locked ? { locked: true, onLockClick: onUpgrade } : {};

      switch (key) {
        case 'label':
          return <InfoField key={field.id} label={label} value={s.label} onChange={(v) => update({ label: v })} icon={<FileText className="w-4 h-4" />} required info={field.description ?? tr('infoWorkSiteName')} />;
        case 'companyClient':
          return <InfoField key={field.id} label={label} value={s.companyClient ?? ''} onChange={(v) => update({ companyClient: v })} icon={<Building2 className="w-4 h-4" />} info={field.description ?? tr('infoCompanyClient')} />;
        case 'pmName':
          return <InfoField key={field.id} label={label} value={s.pmName} onChange={(v) => update({ pmName: v })} icon={<User className="w-4 h-4" />} info={field.description ?? tr('infoPmName')} />;
        case 'pmPhone':
          return <InfoField key={field.id} label={label} value={s.pmPhone ?? ''} onChange={(v) => update({ pmPhone: v })} icon={<Phone className="w-4 h-4" />} info={field.description ?? tr('infoPmPhone')} {...lockProps} />;
        case 'pmEmail':
          return <InfoField key={field.id} label={label} value={s.pmEmail} onChange={(v) => update({ pmEmail: v })} type="email" icon={<Mail className="w-4 h-4" />} info={field.description ?? tr('infoPmEmail')} {...lockProps} />;
        case 'siteAddress':
          return <InfoField key={field.id} label={label} value={s.siteAddress} onChange={(v) => update({ siteAddress: v })} icon={<MapPin className="w-4 h-4" />} info={field.description ?? tr('infoSiteAddress')} />;
        case 'jobNumber':
          return <InfoField key={field.id} label={label} value={s.jobNumber} onChange={(v) => update({ jobNumber: v })} icon={<Hash className="w-4 h-4" />} info={field.description ?? tr('infoJobNumber')} />;
        case 'jobDescription':
          return <InfoField key={field.id} label={label} value={s.jobDescription ?? ''} onChange={(v) => update({ jobDescription: v })} multiline info={field.description ?? tr('infoJobDescription')} {...lockProps} />;
        case 'contractNumber':
          return <InfoField key={field.id} label={label} value={s.contractNumber ?? ''} onChange={(v) => update({ contractNumber: v })} icon={<FileText className="w-4 h-4" />} info={field.description ?? tr('infoContractNumber')} {...lockProps} />;
        case 'poNumber':
          return <InfoField key={field.id} label={label} value={s.poNumber ?? ''} onChange={(v) => update({ poNumber: v })} icon={<Hash className="w-4 h-4" />} info={field.description ?? tr('infoPoNumber')} {...lockProps} />;
        case 'costCode':
          return <InfoField key={field.id} label={label} value={s.costCode ?? ''} onChange={(v) => update({ costCode: v })} icon={<Hash className="w-4 h-4" />} info={field.description ?? tr('infoCostCode')} {...lockProps} />;
        case 'costCenter':
          return <InfoField key={field.id} label={label} value={s.costCenter ?? ''} onChange={(v) => update({ costCenter: v })} icon={<Hash className="w-4 h-4" />} info={field.description ?? tr('infoCostCenter')} {...lockProps} />;
        case 'buildingArea':
          return <InfoField key={field.id} label={label} value={s.buildingArea ?? ''} onChange={(v) => update({ buildingArea: v })} icon={<MapPin className="w-4 h-4" />} info={field.description ?? tr('infoBuildingArea')} {...lockProps} />;
        case 'floorUnit':
          return <InfoField key={field.id} label={label} value={s.floorUnit ?? ''} onChange={(v) => update({ floorUnit: v })} icon={<Hash className="w-4 h-4" />} info={field.description ?? tr('infoFloorUnit')} {...lockProps} />;
        case 'assetNumber':
          return <InfoField key={field.id} label={label} value={s.assetNumber ?? ''} onChange={(v) => update({ assetNumber: v })} icon={<Hash className="w-4 h-4" />} info={field.description ?? tr('infoAssetNumber')} {...lockProps} />;
        case 'customerRep':
          return <InfoField key={field.id} label={label} value={s.customerRep ?? ''} onChange={(v) => update({ customerRep: v })} icon={<User className="w-4 h-4" />} info={field.description ?? tr('infoCustomerRep')} {...lockProps} />;
        case 'customerPhone':
          return <InfoField key={field.id} label={label} value={s.customerPhone ?? ''} onChange={(v) => update({ customerPhone: v })} icon={<Phone className="w-4 h-4" />} info={field.description ?? tr('infoCustomerPhone')} {...lockProps} />;
        case 'customerEmail':
          return <InfoField key={field.id} label={label} value={s.customerEmail ?? ''} onChange={(v) => update({ customerEmail: v })} type="email" icon={<Mail className="w-4 h-4" />} info={field.description ?? tr('infoCustomerEmail')} {...lockProps} />;
        case 'crew':
          return <InfoField key={field.id} label={label} value={s.crew} onChange={(v) => update({ crew: v })} icon={<Users className="w-4 h-4" />} info={field.description ?? tr('infoCrew')} {...lockProps} />;
        case 'superintendent':
          return <InfoField key={field.id} label={label} value={s.superintendent ?? ''} onChange={(v) => update({ superintendent: v })} icon={<User className="w-4 h-4" />} info={field.description ?? tr('infoSuperintendent')} {...lockProps} />;
        case 'safetyRequirements':
          return <InfoField key={field.id} label={label} value={s.safetyRequirements ?? ''} onChange={(v) => update({ safetyRequirements: v })} multiline info={field.description ?? tr('infoSafetyRequirements')} {...lockProps} />;
        case 'siteAccessInstructions':
          return <InfoField key={field.id} label={label} value={s.siteAccessInstructions ?? ''} onChange={(v) => update({ siteAccessInstructions: v })} multiline info={field.description ?? tr('infoSiteAccessInstructions')} {...lockProps} />;
        case 'gateCode':
          return <InfoField key={field.id} label={label} value={s.gateCode ?? ''} onChange={(v) => update({ gateCode: v })} icon={<Hash className="w-4 h-4" />} info={field.description ?? tr('infoGateCode')} {...lockProps} />;
        case 'permitNumber':
          return <InfoField key={field.id} label={label} value={s.permitNumber ?? ''} onChange={(v) => update({ permitNumber: v })} icon={<FileText className="w-4 h-4" />} info={field.description ?? tr('infoPermitNumber')} {...lockProps} />;
        case 'gpsCoordinates':
          return <InfoField key={field.id} label={label} value={s.gpsCoordinates ?? ''} onChange={(v) => update({ gpsCoordinates: v })} icon={<MapPin className="w-4 h-4" />} info={field.description ?? tr('infoGpsCoordinates')} {...lockProps} />;
        default:
          return null;
      }
    }

    const cf = customFields.find((c) => c.id === field.id);
    if (!cf) return null;
    const label = field.labelOverride ?? cf.label;
    return (
      <div key={field.id}>
        <InfoField
          label={label}
          value={s.customFieldValues?.[field.id] ?? ''}
          onChange={(v) => updateCustomFieldValue(field.id, v)}
          info={field.description}
        />
      </div>
    );
  }

  return (
    <div className="pt-6">
      <ScreenTitle title={isNew ? tr('newWorkSite') : tr('editWorkSite')} subtitle={tr('autoSavedDesc')} />

      <div className="space-y-3">
        {visibleFields.map((field) => renderField(field))}
      </div>

      <div className="mt-5">
        <FieldBuilder
          locale={locale}
          fieldConfigs={effectiveConfigs}
          customFields={customFields}
          onFieldConfigsChange={onFieldConfigsChange}
          onCustomFieldsChange={handleCustomFieldsChange}
          isPremium={premium}
          onUpgrade={onUpgrade}
          onRestoreDefaults={() => setShowRestore(true)}
        />
      </div>

      <ConfirmDialog
        open={showRestore}
        onClose={() => setShowRestore(false)}
        onConfirm={restoreDefaults}
        title={tr('restoreDefaultTitle')}
        message={tr('restoreDefaultMessage')}
        confirmLabel={tr('restoreDefaultConfirm')}
        cancelLabel={tr('cancel')}
        variant="danger"
      />

      {showSaved && <AutoSavedIndicator locale={locale} />}
    </div>
  );
}
