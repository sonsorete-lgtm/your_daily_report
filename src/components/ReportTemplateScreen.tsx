import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { Locale, ReportTemplate, ReportSectionKey, CustomField, FieldConfig } from '../types';
import { DEFAULT_TEMPLATE, FREE_SECTIONS } from '../types';
import { t } from '../lib/i18n';
import { storage } from '../lib/storage';
import { getOrderedAllSections, CONTENT_SECTIONS } from '../lib/pipeline';
import { ScreenTitle, GhostButton, AutoSavedIndicator, ConfirmDialog } from './ui';
import { FieldBuilder } from './FieldBuilder';

interface ReportTemplateScreenProps {
  locale: Locale;
  reportTemplate: ReportTemplate | null;
  onTemplateChange: (template: ReportTemplate) => void;
  customFields: CustomField[];
  onCustomFieldsChange: (fields: CustomField[]) => void;
  fieldConfigs: FieldConfig[];
  onFieldConfigsChange: (configs: FieldConfig[]) => void;
  onUpgrade: () => void;
  onBack: () => void;
  isPremium: boolean;
}

export function ReportTemplateScreen({
  locale, reportTemplate, onTemplateChange,
  customFields, onCustomFieldsChange,
  fieldConfigs, onFieldConfigsChange,
  onUpgrade, onBack, isPremium,
}: ReportTemplateScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [showSaved, setShowSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const premium = isPremium;

  const activeTemplate = reportTemplate ?? DEFAULT_TEMPLATE;
  const allSections = getOrderedAllSections();

  const flashSaved = useCallback(() => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setShowSaved(true);
    savedTimer.current = setTimeout(() => setShowSaved(false), 2500);
  }, []);

  useEffect(() => {
    return () => { if (savedTimer.current) clearTimeout(savedTimer.current); };
  }, []);

  // Full list of all fields (system sections + custom) — used as the source of truth for ordering.
  // Premium fields are included here so their positions are preserved across premium upgrades.
  const unifiedConfigs = useMemo(() => {
    if (fieldConfigs.length > 0) {
      const customConfigs = fieldConfigs
        .filter((f) => f.kind === 'custom')
        .map((f) => ({ ...f }));
      const systemConfigs = fieldConfigs
        .filter((f) => f.kind === 'system')
        .map((f) => ({
          ...f,
          visible: activeTemplate[f.id as ReportSectionKey] === true,
          premium: !FREE_SECTIONS.includes(f.id as ReportSectionKey),
        }));
      return [...systemConfigs, ...customConfigs].sort((a, b) => a.order - b.order);
    }

    const sectionConfigs: FieldConfig[] = allSections.map((key, i) => ({
      id: key,
      kind: 'system' as const,
      labelKey: key,
      order: i,
      visible: activeTemplate[key] === true,
      deletable: true,
      labelEditable: true,
      premium: !FREE_SECTIONS.includes(key),
    }));

    const customConfigs = fieldConfigs
      .filter((f) => f.kind === 'custom')
      .map((f, i) => ({ ...f, order: allSections.length + i }));

    return [...sectionConfigs, ...customConfigs].sort((a, b) => a.order - b.order);
  }, [allSections, activeTemplate, fieldConfigs]);

  // Show all fields to all users. Free users see premium fields as locked.
  const accessibleConfigs = unifiedConfigs;

  function handleFieldConfigsChange(configs: FieldConfig[]) {
    const configIds = new Set(configs.map((f) => f.id));
    const inaccessibleNotInConfigs = unifiedConfigs.filter(
      (f) => !configIds.has(f.id) && (!premium && !!f.premium)
    );
    const merged = [...configs, ...inaccessibleNotInConfigs];
    const reordered = merged.map((f, i) => ({ ...f, order: i }));

    // Preserve existing template state — only update sections present in the configs list
    const newTemplate: ReportTemplate = { ...activeTemplate };
    for (const f of reordered) {
      if (f.kind === 'system' && CONTENT_SECTIONS.includes(f.id as ReportSectionKey)) {
        if (!premium && !FREE_SECTIONS.includes(f.id as ReportSectionKey)) {
          continue;
        }
        newTemplate[f.id as ReportSectionKey] = f.visible;
      }
    }
    const configuredSectionIds = new Set(reordered.filter((f) => f.kind === 'system').map((f) => f.id));
    for (const key of CONTENT_SECTIONS) {
      if (!configuredSectionIds.has(key) && (premium || FREE_SECTIONS.includes(key))) {
        newTemplate[key] = false;
      }
    }
    onTemplateChange(newTemplate);

    // Save section order (all system sections, including premium ones not in the visible list)
    const remainingSections = allSections.filter((s) => !configuredSectionIds.has(s));
    const newSectionOrder = [
      ...reordered.filter((f) => f.kind === 'system').map((f) => f.id as ReportSectionKey),
      ...remainingSections,
    ];
    storage.setSectionOrder(newSectionOrder);

    // Save ALL field configs (system + custom) to reportFieldConfigs for ordering
    onFieldConfigsChange(reordered);

    // Sync custom field definitions
    const newCustomConfigs = reordered.filter((f) => f.kind === 'custom');
    const nextCustom = newCustomConfigs
      .map((c, i) => {
        const existing = customFields.find((cf) => cf.id === c.id);
        return {
          id: c.id,
          label: c.labelOverride ?? existing?.label ?? c.id,
          description: c.description,
          order: i,
        };
      });
    onCustomFieldsChange(nextCustom);

    flashSaved();
  }

  function restoreDefault() {
    onTemplateChange({ ...DEFAULT_TEMPLATE });
    storage.setSectionOrder(null);
    onFieldConfigsChange([]);
    onCustomFieldsChange([]);
    flashSaved();
    setShowRestoreConfirm(false);
  }

  return (
    <div className="pt-6 pb-4">
      <ScreenTitle title={tr('reportTemplateSetup')} subtitle={tr('reportTemplateDesc')} />

      <div className="mb-5">
        <FieldBuilder
          locale={locale}
          fieldConfigs={accessibleConfigs}
          customFields={customFields}
          onFieldConfigsChange={handleFieldConfigsChange}
          onCustomFieldsChange={() => {}}
          isPremium={premium}
          onUpgrade={onUpgrade}
        />

        {premium && (
          <div className="mt-4">
            <GhostButton onClick={() => setShowRestoreConfirm(true)}>{tr('restoreDefaultTemplate')}</GhostButton>
          </div>
        )}
      </div>

      {showSaved && <AutoSavedIndicator locale={locale} />}

      <ConfirmDialog
        open={showRestoreConfirm}
        onClose={() => setShowRestoreConfirm(false)}
        onConfirm={restoreDefault}
        title={tr('restoreDefaultTitle')}
        message={tr('restoreDefaultMessage')}
        confirmLabel={tr('restoreDefaultConfirm')}
        cancelLabel={tr('cancel')}
        variant="danger"
      />
    </div>
  );
}
