import { useState, useRef, useEffect } from 'react';
import { X, Info, ChevronLeft, Check, AlertTriangle, Lock } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h1 className="text-[1.625rem] font-bold tracking-tight leading-tight">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  );
}

/** Format a Date as MM/DD/YYYY. */
export function formatDateMMDDYYYY(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

/**
 * Field with an ⓘ info button. Selecting the button shows a short description
 * explaining the purpose of the field.
 */
export function InfoField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  error,
  icon,
  info,
  multiline,
  locked,
  onLockClick,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
  info?: string;
  multiline?: boolean;
  locked?: boolean;
  onLockClick?: () => void;
}) {
  const [showInfo, setShowInfo] = useState(false);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <label className={`text-xs ${locked ? 'text-slate-600' : 'text-slate-500'}`}>
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        {locked && (
          <button
            type="button"
            onClick={onLockClick}
            className="flex items-center gap-0.5 text-[10px] text-amber-400 font-semibold shrink-0 hover:text-amber-300 transition-colors"
            aria-label="Premium feature"
          >
            <Lock className="w-3 h-3" />
          </button>
        )}
        {info && !locked && (
          <button
            type="button"
            onClick={() => setShowInfo((s) => !s)}
            className="text-slate-500 hover:text-amber-400 transition-colors"
            aria-label="Field info"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {showInfo && info && !locked && (
        <p className="text-xs text-slate-400 mb-2 px-2.5 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 fade-in">
          {info}
        </p>
      )}
      <div className="relative">
        {icon && !multiline && (
          <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${locked ? 'text-slate-700' : 'text-slate-500'}`}>{icon}</span>
        )}
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={3}
            disabled={locked}
            onClick={locked ? onLockClick : undefined}
            className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 py-2.5 rounded-xl bg-slate-800 border ${
              locked ? 'border-amber-500/20 cursor-pointer' : error ? 'border-red-500/60' : 'border-slate-700'
            } text-sm ${locked ? 'text-slate-600 placeholder-slate-600' : 'text-slate-100 placeholder-slate-500'} focus:outline-none ${locked ? '' : 'focus:border-amber-500/60'} resize-none`}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={locked}
            onClick={locked ? onLockClick : undefined}
            className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 h-11 rounded-xl bg-slate-800 border ${
              locked ? 'border-amber-500/20 cursor-pointer' : error ? 'border-red-500/60' : 'border-slate-700'
            } text-sm ${locked ? 'text-slate-600 placeholder-slate-600' : 'text-slate-100 placeholder-slate-500'} focus:outline-none ${locked ? '' : 'focus:border-amber-500/60'}`}
          />
        )}
      </div>
      {error && !locked && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  error,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">
        {label} {required && <span className="text-amber-400">*</span>}
        {required === false && <span className="text-slate-600 ml-1">({label.includes('(') ? '' : 'optional'})</span>}
      </label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-9' : 'pl-3'} pr-3 h-11 rounded-xl bg-slate-800 border ${
            error ? 'border-red-500/60' : 'border-slate-700'
          } text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/60`}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}

export function Chip({
  label,
  onRemove,
}: {
  label: string;
  onRemove?: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="text-slate-500 hover:text-red-400">
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-900 font-semibold text-sm shadow-lg shadow-orange-500/20 hover:from-amber-300 hover:to-orange-400 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors active:scale-[0.98] disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm text-slate-400 hover:text-slate-200 transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-4 rounded-2xl bg-slate-900/60 border border-slate-800 ${className}`}>
      {children}
    </div>
  );
}

export function AutoSavedIndicator({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setVisible(true);
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setVisible(false);
      timeoutRef.current = window.setTimeout(() => setRendered(false), 300);
    }, 4000);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!rendered) return null;

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
      style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 shadow-lg text-sm text-emerald-300 font-medium max-w-[calc(100vw-2.5rem)]">
        <Check className="w-4 h-4 shrink-0" />
        {t(locale, 'autoSaved')}
      </div>
    </div>
  );
}

export function BackButton({ locale, onClick }: { locale: Locale; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-700 hover:text-slate-100 transition-colors active:scale-[0.98] mb-4"
    >
      <ChevronLeft className="w-4 h-4" />
      {t(locale, 'back')}
    </button>
  );
}

export function Modal({
  open, onClose, children, title, icon, iconVariant = 'amber',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  icon?: React.ReactNode;
  iconVariant?: 'amber' | 'red' | 'slate';
}) {
  if (!open) return null;

  const iconColors: Record<string, string> = {
    amber: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    red: 'bg-red-500/15 border-red-500/30 text-red-400',
    slate: 'bg-slate-700/40 border-slate-600 text-slate-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl px-6 py-7 fade-in">
        {icon && (
          <div className={`flex items-center justify-center w-14 h-14 rounded-full border mx-auto mb-5 ${iconColors[iconVariant]}`}>
            {icon}
          </div>
        )}
        {title && <h3 className="text-lg font-bold text-slate-100 text-center mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open, onClose, onConfirm, title, message, confirmLabel, cancelLabel, variant = 'danger',
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  variant?: 'danger' | 'default';
}) {
  if (!open) return null;

  const confirmClass = variant === 'danger'
    ? 'bg-red-500 text-white hover:bg-red-400'
    : 'bg-amber-500 text-slate-900 hover:bg-amber-400';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      icon={<AlertTriangle className="w-7 h-7" />}
      iconVariant={variant === 'danger' ? 'red' : 'amber'}
    >
      <p className="text-sm text-slate-400 text-center mb-6">{message}</p>
      <div className="space-y-2">
        <button
          onClick={onConfirm}
          className={`w-full h-12 rounded-xl font-semibold text-sm transition-colors ${confirmClass}`}
        >
          {confirmLabel}
        </button>
        <button
          onClick={onClose}
          className="w-full h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-amber-500' : 'bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export function PremiumButton({
  label,
  onClick,
  icon,
  className = '',
}: {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full h-11 rounded-xl border border-dashed border-amber-500/30 text-sm text-amber-400 font-medium flex items-center justify-center gap-1.5 hover:border-amber-500/50 hover:bg-amber-500/5 transition-colors ${className}`}
    >
      {icon ?? <Lock className="w-4 h-4" />}
      {label}
      <Lock className="w-3 h-3 ml-0.5" />
    </button>
  );
}


