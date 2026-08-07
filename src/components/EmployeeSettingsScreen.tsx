import { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { User, BadgeCheck, Briefcase, Phone, Mail, Building2, Image as ImageIcon, Upload, Trash2, Plus, Pencil, Copy, Lock } from 'lucide-react';
import type { EmployeeProfile, CustomField, Locale, FieldConfig, EmployeeFieldKey } from '../types';
import { DEFAULT_EMPLOYEE_FIELDS } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, InfoField, Card, ConfirmDialog, PrimaryButton, AutoSavedIndicator } from './ui';
import { FieldBuilder } from './FieldBuilder';

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

interface EmployeeSettingsScreenProps {
  profiles: EmployeeProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onProfilesChange: (profiles: EmployeeProfile[]) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'info') => void;
  onUpgrade: () => void;
  fieldConfigs: FieldConfig[];
  onFieldConfigsChange: (configs: FieldConfig[]) => void;
  isPremium: boolean;
  locale: Locale;
}

export function EmployeeSettingsScreen({
  profiles, selectedProfileId, onSelectProfile, onProfilesChange, onBack, onNotify, onUpgrade, fieldConfigs, onFieldConfigsChange, isPremium, locale,
}: EmployeeSettingsScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  const selectedProfile = profiles.find((p) => p.id === editingId) ?? null;

  // Clean up empty profiles (created but never named) when leaving the screen
  const profilesRef = useRef(profiles);
  profilesRef.current = profiles;
  useEffect(() => {
    return () => {
      const hasEmpty = profilesRef.current.some((p) => !p.name.trim());
      if (hasEmpty) {
        const cleaned = profilesRef.current.filter((p) => p.name.trim());
        if (cleaned.length !== profilesRef.current.length) {
          onProfilesChange(cleaned);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Profile CRUD ---
  function startNewProfile() {
    if (!isPremium && profiles.length >= 1) {
      onUpgrade();
      return;
    }
    const newProfile: EmployeeProfile = {
      id: uid(),
      name: '',
      company: '',
      employeeId: '',
      phoneEmail: '',
      phone: '',
      email: '',
      position: '',
      role: '',
      jobTitle: '',
      department: '',
      supervisorName: '',
      supervisorEmail: '',
      license: '',
      crewName: '',
      otherInfo: '',
      locale,
      companyLogo: null,
      customFields: [],
      customFieldValues: {},
    };
    onProfilesChange([...profiles, newProfile]);
    onSelectProfile(newProfile.id);
    setEditingId(newProfile.id);
    setIsNewProfile(true);
  }

  function updateProfile(updated: EmployeeProfile) {
    onProfilesChange(profiles.map((p) => (p.id === updated.id ? updated : p)));
  }

  function deleteProfile(id: string) {
    const remaining = profiles.filter((p) => p.id !== id);
    onProfilesChange(remaining);
    if (selectedProfileId === id) {
      if (remaining.length > 0) {
        onSelectProfile(remaining[0].id);
      }
    }
    setDeletingId(null);
  }

  function duplicateProfile(id: string) {
    if (!isPremium && profiles.length >= 1) {
      onUpgrade();
      return;
    }
    const original = profiles.find((p) => p.id === id);
    if (!original) return;
    const copy: EmployeeProfile = {
      ...original,
      id: uid(),
      name: `${original.name} (Copy)`,
      customFields: [...original.customFields],
      customFieldValues: { ...original.customFieldValues },
    };
    onProfilesChange([...profiles, copy]);
    setDuplicatingId(null);
    onNotify(tr('profileDuplicated'), 'success');
  }

  // --- Render: Profile Editor ---
  if (editingId && selectedProfile) {
    return (
      <ProfileEditor
        profile={selectedProfile}
        locale={locale}
        isNew={isNewProfile}
        onChange={updateProfile}
        onDone={() => { setEditingId(null); setIsNewProfile(false); }}
        onNotify={onNotify}
        onUpgrade={onUpgrade}
        fieldConfigs={fieldConfigs}
        onFieldConfigsChange={onFieldConfigsChange}
        isPremium={isPremium}
      />
    );
  }

  // --- Render: Profile List ---
  return (
    <div className="pt-6">
      <ScreenTitle title={tr('employeeProfiles')} subtitle={tr('profilesDesc')} />

      {profiles.length === 0 ? (
        <div className="py-16 text-center">
          <User className="w-10 h-10 mx-auto mb-3 text-slate-600" />
          <p className="text-sm text-slate-500 mb-4">{tr('noProfilesYet')}</p>
          <PrimaryButton onClick={startNewProfile} className="!h-11">
            <span className="flex items-center gap-1.5"><Plus className="w-4 h-4" /> {tr('createFirstProfile')}</span>
          </PrimaryButton>
        </div>
      ) : (
        <>
          <div className="space-y-2.5 mb-4">
            {profiles.map((p, i) => {
              const locked = !isPremium && i > 0;
              return (
                <Card
                  key={p.id}
                  className={`transition-colors ${
                    locked ? 'opacity-60' : 'cursor-pointer'
                  } ${selectedProfileId === p.id ? 'border-amber-500/60 bg-amber-500/5' : ''}`}
                >
                  <button
                    onClick={() => locked ? onUpgrade() : onSelectProfile(p.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-sm font-semibold truncate ${locked ? 'text-slate-400' : 'text-slate-100'}`}>
                            {p.name || tr('newProfile')}
                          </p>
                          {locked && (
                            <span className="flex items-center gap-0.5 text-[10px] text-amber-400/80 font-semibold shrink-0">
                              <Lock className="w-3 h-3" /> {tr('premium')}
                            </span>
                          )}
                        </div>
                        {p.company && <p className="text-xs text-slate-400 mt-0.5 truncate">{p.company}</p>}
                        {p.position && <p className="text-xs text-slate-500 mt-0.5 truncate">{p.position}</p>}
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 mt-2 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={() => {
                        if (locked) { onUpgrade(); } else { setEditingId(p.id); setIsNewProfile(false); }
                      }}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${locked ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                      aria-label={tr('editProfile')}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => locked ? onUpgrade() : setDuplicatingId(p.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${locked ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-slate-800 text-slate-400 hover:text-amber-400'}`}
                      aria-label={tr('duplicateProfile')}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => locked ? onUpgrade() : setDeletingId(p.id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ml-auto ${locked ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-red-500/10 text-slate-400 hover:text-red-400'}`}
                      aria-label={tr('deleteProfile')}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>

          <button
            onClick={startNewProfile}
            className="w-full h-11 rounded-xl border border-dashed border-slate-700 text-sm text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center justify-center gap-1.5"
          >
            {!isPremium && profiles.length >= 1 ? (
              <><Lock className="w-4 h-4 text-amber-400" /> {tr('addProfile')} <Lock className="w-3 h-3 ml-0.5" /></>
            ) : (
              <><Plus className="w-4 h-4" /> {tr('addProfile')}</>
            )}
          </button>

          {!isPremium && (
            <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-400">{tr('profileLimitFree')}</p>
            </div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => deletingId && deleteProfile(deletingId)}
        title={tr('deleteProfile')}
        message={tr('deleteProfileConfirm')}
        confirmLabel={tr('delete')}
        cancelLabel={tr('cancel')}
        variant="danger"
      />

      {/* Duplicate confirmation (for free users hitting limit) */}
      <ConfirmDialog
        open={!!duplicatingId}
        onClose={() => setDuplicatingId(null)}
        onConfirm={() => duplicatingId && duplicateProfile(duplicatingId)}
        title={tr('duplicateProfile')}
        message={tr('duplicateProfileConfirm')}
        confirmLabel={tr('ok')}
        cancelLabel={tr('cancel')}
      />
    </div>
  );
}

// --- Profile Editor (renders the form for a single profile) ---
function ProfileEditor({
  profile, locale, isNew, onChange, onDone, onNotify, onUpgrade, fieldConfigs, onFieldConfigsChange, isPremium,
}: {
  profile: EmployeeProfile;
  locale: Locale;
  isNew: boolean;
  onChange: (p: EmployeeProfile) => void;
  onDone: () => void;
  onNotify: (msg: string, type: 'success' | 'info') => void;
  onUpgrade: () => void;
  fieldConfigs: FieldConfig[];
  onFieldConfigsChange: (configs: FieldConfig[]) => void;
  isPremium: boolean;
}) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const premium = isPremium;

  // Local state for responsive typing — synced to parent via debounced autosave
  const [local, setLocal] = useState<EmployeeProfile>(profile);
  const localRef = useRef(local);
  localRef.current = local;
  const [showSaved, setShowSaved] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashSaved = useCallback(() => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setShowSaved(true);
    savedTimer.current = setTimeout(() => setShowSaved(false), 2500);
  }, []);

  // Debounced save: updates parent state after typing pauses.
  const debouncedSave = useCallback((next: EmployeeProfile) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveTimer.current = null; // Mark as fired so unmount cleanup doesn't double-save
      onChange(next);
      flashSaved();
    }, 600);
  }, [onChange, flashSaved]);

  // Flush pending save on unmount so no edits are lost.
  // Only flush if the timer hasn't fired yet (saveTimer.current !== null means pending).
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
        onChange(localRef.current);
      }
      if (savedTimer.current) {
        clearTimeout(savedTimer.current);
        savedTimer.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update local state immediately, debounce the save to parent
  function update(patch: Partial<EmployeeProfile>) {
    setLocal((prev) => {
      const next = { ...prev, ...patch };
      debouncedSave(next);
      return next;
    });
  }

  const customFields = local.customFields ?? [];

  const effectiveConfigs = useMemo(() => {
    if (!fieldConfigs.length) return DEFAULT_EMPLOYEE_FIELDS;
    return [...fieldConfigs].sort((a, b) => a.order - b.order);
  }, [fieldConfigs]);

  const visibleFields = effectiveConfigs.filter((f) => f.visible && !(!!f.premium && !premium));

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
      onNotify(tr('logoUploadError'), 'info');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      update({ companyLogo: dataUrl });
    };
    reader.onerror = () => onNotify(tr('logoUploadError'), 'info');
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function removeLogo() {
    update({ companyLogo: null });
    onNotify(tr('logoRemoved'), 'success');
  }

  function updateCustomFieldValue(id: string, value: string) {
    const vals = { ...(local.customFieldValues ?? {}), [id]: value };
    update({ customFieldValues: vals });
  }

  function handleCustomFieldsChange(fields: CustomField[]) {
    update({ customFields: fields });
  }

  const [showRestore, setShowRestore] = useState(false);

  function restoreDefaults() {
    const restored = DEFAULT_EMPLOYEE_FIELDS.map((f, i) => ({ ...f, order: i }));
    onFieldConfigsChange(restored);
    setShowRestore(false);
  }

  function renderField(field: FieldConfig) {
    const locked = !!field.premium && !premium;
    if (field.kind === 'system') {
      const key = field.id as EmployeeFieldKey;
      const label = field.labelOverride ?? tr(field.labelKey as Parameters<typeof t>[1]);
      const lockProps = locked ? { locked: true, onLockClick: onUpgrade } : {};

      switch (key) {
        case 'name':
          return <InfoField key={field.id} label={label} value={local.name} onChange={(v) => update({ name: v })} icon={<User className="w-4 h-4" />} required info={field.description ?? tr('infoName')} />;
        case 'company':
          return <InfoField key={field.id} label={label} value={local.company} onChange={(v) => update({ company: v })} icon={<Building2 className="w-4 h-4" />} info={field.description ?? tr('infoCompany')} />;
        case 'employeeId':
          return <InfoField key={field.id} label={label} value={local.employeeId} onChange={(v) => update({ employeeId: v })} icon={<BadgeCheck className="w-4 h-4" />} info={field.description ?? tr('infoIdNumber')} />;
        case 'phone':
          return <InfoField key={field.id} label={label} value={local.phone ?? ''} onChange={(v) => update({ phone: v })} icon={<Phone className="w-4 h-4" />} info={field.description ?? tr('infoPhone')} {...lockProps} />;
        case 'email':
          return <InfoField key={field.id} label={label} value={local.email ?? ''} onChange={(v) => update({ email: v })} type="email" icon={<Mail className="w-4 h-4" />} info={field.description ?? tr('infoEmail')} {...lockProps} />;
        case 'position':
          return <InfoField key={field.id} label={label} value={local.position ?? ''} onChange={(v) => update({ position: v })} icon={<Briefcase className="w-4 h-4" />} info={field.description ?? tr('infoPositionRole')} {...lockProps} />;
        case 'role':
          return <InfoField key={field.id} label={label} value={local.role ?? ''} onChange={(v) => update({ role: v })} icon={<Briefcase className="w-4 h-4" />} info={field.description ?? tr('infoRole')} {...lockProps} />;
        case 'jobTitle':
          return <InfoField key={field.id} label={label} value={local.jobTitle ?? ''} onChange={(v) => update({ jobTitle: v })} icon={<Briefcase className="w-4 h-4" />} info={field.description ?? tr('infoJobTitle')} {...lockProps} />;
        case 'department':
          return <InfoField key={field.id} label={label} value={local.department ?? ''} onChange={(v) => update({ department: v })} icon={<Building2 className="w-4 h-4" />} info={field.description ?? tr('infoDepartment')} {...lockProps} />;
        case 'supervisorName':
          return <InfoField key={field.id} label={label} value={local.supervisorName ?? ''} onChange={(v) => update({ supervisorName: v })} icon={<User className="w-4 h-4" />} info={field.description ?? tr('infoSupervisorName')} {...lockProps} />;
        case 'supervisorEmail':
          return <InfoField key={field.id} label={label} value={local.supervisorEmail ?? ''} onChange={(v) => update({ supervisorEmail: v })} type="email" icon={<Mail className="w-4 h-4" />} info={field.description ?? tr('infoSupervisorEmail')} {...lockProps} />;
        case 'license':
          return <InfoField key={field.id} label={label} value={local.license ?? ''} onChange={(v) => update({ license: v })} icon={<BadgeCheck className="w-4 h-4" />} info={field.description ?? tr('infoLicense')} {...lockProps} />;
        case 'crewName':
          return <InfoField key={field.id} label={label} value={local.crewName ?? ''} onChange={(v) => update({ crewName: v })} icon={<User className="w-4 h-4" />} info={field.description ?? tr('infoCrewName')} {...lockProps} />;
        case 'otherInfo':
          return <InfoField key={field.id} label={label} value={local.otherInfo} onChange={(v) => update({ otherInfo: v })} icon={<Briefcase className="w-4 h-4" />} multiline info={field.description ?? tr('infoOtherInfo')} {...lockProps} />;
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
          value={local.customFieldValues?.[field.id] ?? ''}
          onChange={(v) => updateCustomFieldValue(field.id, v)}
          info={field.description}
        />
      </div>
    );
  }

  return (
    <div className="pt-6">
      <ScreenTitle title={isNew ? tr('newEmployeeProfile') : tr('editProfile')} subtitle={tr('autoSavedDesc')} />

      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">{tr('companyLogo')}</h3>
          {!premium && (
            <Lock className="w-3.5 h-3.5 text-amber-400" />
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">{tr('companyLogoDesc')}</p>

        {premium ? (
          <>
            {local.companyLogo ? (
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-white border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={local.companyLogo} alt={tr('logoPreview')} className="max-w-full max-h-full object-contain" />
                </div>
                <div className="flex-1 space-y-2">
                  <button onClick={() => fileInputRef.current?.click()} className="w-full h-9 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-slate-700 transition-colors">
                    <Upload className="w-3.5 h-3.5" /> {tr('replaceLogo')}
                  </button>
                  <button onClick={removeLogo} className="w-full h-9 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-red-500/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> {tr('removeLogo')}
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-full h-24 rounded-xl border-2 border-dashed border-slate-700 text-slate-600 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex flex-col items-center justify-center gap-1.5">
                <Upload className="w-5 h-5" />
                <span className="text-xs font-medium">{tr('uploadLogo')}</span>
                <span className="text-[10px] text-slate-700">PNG, JPG, JPEG</span>
              </button>
            )}

            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleFileSelect} className="hidden" />
          </>
        ) : (
          <div
            onClick={onUpgrade}
            className="w-full h-24 rounded-xl border-2 border-dashed border-amber-500/20 bg-amber-500/5 text-amber-400/70 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/10 transition-colors"
          >
            <Lock className="w-5 h-5" />
            <span className="text-xs font-medium">{tr('companyLogo')}</span>
            <span className="text-[10px] text-amber-400/50">{tr('premium')}</span>
          </div>
        )}
      </Card>

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

      {showSaved && <AutoSavedIndicator locale={locale} />}

      <div className="mt-6">
        <PrimaryButton onClick={onDone} className="w-full">
          {tr('done')}
        </PrimaryButton>
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
    </div>
  );
}
