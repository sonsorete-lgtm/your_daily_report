import { useState } from 'react';
import {
  GripVertical, ArrowUp, ArrowDown, Trash2, Pencil, Plus, Lock,
  Eye, EyeOff,
} from 'lucide-react';
import type { FieldConfig, Locale, CustomField } from '../types';
import { t } from '../lib/i18n';
import { Card, Modal, ConfirmDialog } from './ui';

interface FieldBuilderProps {
  locale: Locale;
  fieldConfigs: FieldConfig[];
  customFields: CustomField[];
  onFieldConfigsChange: (configs: FieldConfig[]) => void;
  onCustomFieldsChange: (fields: CustomField[]) => void;
  isPremium: boolean;
  onUpgrade: () => void;
  /** Optional Restore Defaults handler — when provided, shows a Restore button. */
  onRestoreDefaults?: () => void;
}

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

export function FieldBuilder({
  locale, fieldConfigs, customFields, onFieldConfigsChange, onCustomFieldsChange, isPremium, onUpgrade, onRestoreDefaults,
}: FieldBuilderProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [addingField, setAddingField] = useState(false);
  const [deletingField, setDeletingField] = useState<FieldConfig | null>(null);

  const sorted = [...fieldConfigs].sort((a, b) => a.order - b.order);

  function commitConfigs(configs: FieldConfig[]) {
    const reordered = configs.map((f, i) => ({ ...f, order: i }));
    onFieldConfigsChange(reordered);
    const nextCustom = reordered
      .filter((c) => c.kind === 'custom')
      .map((c, i) => {
        const existing = customFields.find((cf) => cf.id === c.id);
        return {
          id: c.id,
          label: c.labelOverride ?? existing?.label ?? c.id,
          order: i,
        };
      });
    onCustomFieldsChange(nextCustom);
  }

  function moveField(id: string, dir: -1 | 1) {
    const idx = sorted.findIndex((f) => f.id === id);
    if (idx < 0) return;
    const swapWith = idx + dir;
    if (swapWith < 0 || swapWith >= sorted.length) return;
    const next = [...sorted];
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    commitConfigs(next);
  }

  function toggleVisible(id: string) {
    commitConfigs(fieldConfigs.map((f) => f.id === id ? { ...f, visible: !f.visible } : f));
  }

  function confirmDelete() {
    if (!deletingField) return;
    const remaining = fieldConfigs.filter((f) => f.id !== deletingField.id);
    commitConfigs(remaining);
    setDeletingField(null);
  }

  function saveFieldEdit(updated: FieldConfig) {
    const existing = fieldConfigs.find((f) => f.id === updated.id);
    if (existing) {
      const oldLabel = existing.labelOverride ?? (existing.labelKey ? t(locale, existing.labelKey as Parameters<typeof t>[1]) : existing.id);
      const newLabel = updated.labelOverride ?? oldLabel;
      // If the label became significantly longer, move the field to the bottom.
      if (newLabel.length > oldLabel.length + 5) {
        const withoutField = fieldConfigs.filter((f) => f.id !== updated.id);
        const sorted = [...withoutField].sort((a, b) => a.order - b.order);
        commitConfigs([...sorted, { ...updated, order: sorted.length }]);
      } else {
        commitConfigs(fieldConfigs.map((f) => f.id === updated.id ? updated : f));
      }
    } else {
      commitConfigs(fieldConfigs.map((f) => f.id === updated.id ? updated : f));
    }
    setEditingField(null);
  }

  function addCustomField(name: string) {
    const id = uid();
    // Place new custom field at the bottom of the list by default.
    const sortedConfigs = [...fieldConfigs].sort((a, b) => a.order - b.order);
    const insertAt = sortedConfigs.length;
    const newConfig: FieldConfig = {
      id,
      kind: 'custom',
      labelOverride: name.trim(),
      order: insertAt,
      visible: true,
      deletable: true,
      labelEditable: true,
    };
    const reordered = [...sortedConfigs, newConfig];
    commitConfigs(reordered);
    setAddingField(false);
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-slate-200">{tr('fieldManagement')}</h3>
        {!isPremium && <Lock className="w-4 h-4 text-amber-400" />}
      </div>
      <p className="text-xs text-slate-500 mb-4">{isPremium ? tr('fieldBuilderDesc') : tr('lockedFeatureDesc')}</p>

      <div className="space-y-1.5">
        {sorted.map((field) => {
          const globalIdx = sorted.findIndex((f) => f.id === field.id);
          const fieldLocked = !isPremium && !!field.premium;
          const customizationLocked = !isPremium;
          return (
            <FieldRow
              key={field.id}
              field={field}
              locale={locale}
              isFirst={globalIdx === 0}
              isLast={globalIdx === sorted.length - 1}
              isPremium={isPremium}
              fieldLocked={fieldLocked}
              customizationLocked={customizationLocked}
              onMove={(dir) => moveField(field.id, dir)}
              onToggleVisible={() => toggleVisible(field.id)}
              onEdit={() => setEditingField(field)}
              onDelete={() => setDeletingField(field)}
              onUpgrade={onUpgrade}
            />
          );
        })}
      </div>

      {isPremium ? (
        <button onClick={() => setAddingField(true)} className="w-full h-10 rounded-xl border border-dashed border-slate-700 text-sm text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center justify-center gap-1.5">
          <Plus className="w-4 h-4" /> {tr('addField')}
        </button>
      ) : (
        <button onClick={onUpgrade} className="w-full h-10 rounded-xl border border-dashed border-amber-500/30 text-sm text-amber-400/80 font-medium flex items-center justify-center gap-1.5 hover:border-amber-500/50 hover:text-amber-400 transition-colors">
          <Plus className="w-4 h-4" /> {tr('addFieldPremium')} <Lock className="w-3 h-3 ml-0.5" />
        </button>
      )}

      {isPremium && onRestoreDefaults && (
        <button onClick={onRestoreDefaults} className="w-full h-9 mt-3 rounded-xl text-xs text-slate-500 hover:text-amber-400 transition-colors">
          {tr('restoreDefaultTemplate')}
        </button>
      )}

      {!isPremium && (
        <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-slate-400">{tr('fieldManagementPremiumOnly')}</p>
        </div>
      )}

      {addingField && (
        <AddFieldModal
          locale={locale}
          onSave={addCustomField}
          onClose={() => setAddingField(false)}
        />
      )}

      {editingField && (
        <EditFieldModal
          field={editingField}
          locale={locale}
          onSave={saveFieldEdit}
          onClose={() => setEditingField(null)}
        />
      )}

      <ConfirmDialog
        open={!!deletingField}
        onClose={() => setDeletingField(null)}
        onConfirm={confirmDelete}
        title={tr('deleteField')}
        message={tr('customFieldDeleteConfirm')}
        confirmLabel={tr('delete')}
        cancelLabel={tr('cancel')}
        variant="danger"
      />
    </Card>
  );
}

function fieldLabel(field: FieldConfig, locale: Locale): string {
  if (field.labelOverride) return field.labelOverride;
  if (field.labelKey) return t(locale, field.labelKey as Parameters<typeof t>[1]);
  return field.id;
}

function FieldRow({
  field, locale, isFirst, isLast, isPremium, fieldLocked, customizationLocked, onMove, onToggleVisible, onEdit, onDelete, onUpgrade,
}: {
  field: FieldConfig;
  locale: Locale;
  isFirst: boolean;
  isLast: boolean;
  isPremium: boolean;
  fieldLocked: boolean;
  customizationLocked: boolean;
  onMove: (dir: -1 | 1) => void;
  onToggleVisible: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpgrade: () => void;
}) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const label = fieldLabel(field, locale);

  return (
    <div className={`flex items-start gap-2 py-2.5 px-3 rounded-lg border transition-colors ${
      fieldLocked
        ? 'bg-amber-500/5 border-amber-500/20 opacity-70'
        : field.visible
          ? 'bg-slate-800/60 border-slate-700/50'
          : 'bg-slate-800/30 border-slate-800 opacity-60'
    }`}>
      <GripVertical className={`w-4 h-4 shrink-0 mt-0.5 ${fieldLocked || customizationLocked ? 'text-slate-700' : 'text-slate-600'}`} />
      <div className="flex-1 min-w-0 py-0.5">
        <span className={`text-sm break-words leading-snug ${fieldLocked ? 'text-slate-500' : field.visible ? 'text-slate-200' : 'text-slate-500'}`}>
          {label}
        </span>
      </div>

      {fieldLocked && (
        <button
          onClick={onUpgrade}
          className="w-6 h-6 rounded flex items-center justify-center text-amber-400 hover:text-amber-300 shrink-0 mt-0.5"
          aria-label={tr('premium')}
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      )}

      {!fieldLocked && customizationLocked && (
        <button
          onClick={onUpgrade}
          className="w-6 h-6 rounded flex items-center justify-center text-amber-400/70 hover:text-amber-400 shrink-0 mt-0.5"
          aria-label={tr('premium')}
        >
          <Lock className="w-3.5 h-3.5" />
        </button>
      )}

      {!fieldLocked && !customizationLocked && (
        <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
          <button onClick={() => onMove(-1)} disabled={isFirst} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-200 disabled:opacity-30" aria-label="Move up">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onMove(1)} disabled={isLast} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-slate-200 disabled:opacity-30" aria-label="Move down">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button onClick={onToggleVisible} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-amber-400" aria-label={field.visible ? tr('hideField') : tr('showField')}>
            {field.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
          <button onClick={onEdit} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-amber-400" aria-label={tr('editField')}>
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="w-6 h-6 rounded flex items-center justify-center text-slate-500 hover:text-red-400" aria-label={tr('delete')}>
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function AddFieldModal({
  locale, onSave, onClose,
}: {
  locale: Locale;
  onSave: (name: string) => void;
  onClose: () => void;
}) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [name, setName] = useState('');

  function handleSave() {
    if (!name.trim()) return;
    onSave(name);
  }

  return (
    <Modal open onClose={onClose} title={tr('addCustomField')} icon={<Plus className="w-7 h-7" />} iconVariant="amber">
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 block mb-1.5">{tr('customFieldName')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            placeholder={tr('customFieldName')}
            className="w-full px-3 h-11 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full h-12 rounded-xl bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {tr('saveField')}
        </button>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          {tr('cancel')}
        </button>
      </div>
    </Modal>
  );
}

function EditFieldModal({
  field, locale, onSave, onClose,
}: {
  field: FieldConfig;
  locale: Locale;
  onSave: (field: FieldConfig) => void;
  onClose: () => void;
}) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const currentLabel = field.labelOverride ?? (field.labelKey ? t(locale, field.labelKey as Parameters<typeof t>[1]) : field.id);
  const [name, setName] = useState(currentLabel);

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      ...field,
      labelOverride: name.trim() === currentLabel ? field.labelOverride : name.trim(),
    });
  }

  return (
    <Modal open onClose={onClose} title={tr('editField')} icon={<Pencil className="w-7 h-7" />} iconVariant="amber">
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 block mb-1.5">{tr('fieldName')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            autoFocus
            className="w-full px-3 h-11 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>
      </div>

      <div className="space-y-2 mt-6">
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="w-full h-12 rounded-xl bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {tr('saveField')}
        </button>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          {tr('cancel')}
        </button>
      </div>
    </Modal>
  );
}
