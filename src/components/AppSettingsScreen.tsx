import { useState, useCallback, useRef, useEffect } from 'react';
import {
  PlayCircle, Gift, Mail, Shield, Sun, Moon, Globe, Info, HelpCircle, Lock,
} from 'lucide-react';
import type { Locale, Theme } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card, AutoSavedIndicator } from './ui';

interface AppSettingsScreenProps {
  locale: Locale;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onLocaleChange: (locale: Locale) => void;
  onReplayOnboarding: () => void;
  onWhatsNew: () => void;
  onFeedback: () => void;
  onPrivacy: () => void;
  onTips: () => void;
  onFaq: () => void;
  onSuperAdmin: () => void;
  onBack: () => void;
}

export function AppSettingsScreen({
  locale, theme, onThemeChange, onLocaleChange,
  onReplayOnboarding, onWhatsNew, onFeedback, onPrivacy, onTips, onFaq, onSuperAdmin, onBack,
}: AppSettingsScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [showSaved, setShowSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const flashSaved = useCallback(() => {
    if (savedTimer.current) clearTimeout(savedTimer.current);
    setShowSaved(true);
    savedTimer.current = setTimeout(() => setShowSaved(false), 2500);
  }, []);

  useEffect(() => {
    return () => { if (savedTimer.current) clearTimeout(savedTimer.current); };
  }, []);

  const helpItems = [
    { icon: Info, label: tr('tips'), onClick: onTips },
    { icon: PlayCircle, label: tr('replayOnboarding'), onClick: onReplayOnboarding },
    { icon: Gift, label: tr('whatsNew'), onClick: onWhatsNew },
    { icon: HelpCircle, label: tr('faq'), onClick: onFaq },
    { icon: Mail, label: tr('feedbackContact'), onClick: onFeedback },
    { icon: Shield, label: tr('privacyPolicy'), onClick: onPrivacy },
  ];

  const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: tr('themeLight'), icon: Sun },
    { value: 'dark', label: tr('themeDark'), icon: Moon },
  ];

  return (
    <div className="pt-6">
      <ScreenTitle title={tr('appSettings')} subtitle={tr('appSettingsDesc')} />

      {/* Display Language */}
      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">{tr('language')}</h3>
        </div>
        <div className="flex gap-2">
          {(['en', 'es'] as Locale[]).map((l) => (
            <button
              key={l}
              onClick={() => { onLocaleChange(l); flashSaved(); }}
              className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-colors ${
                locale === l
                  ? 'bg-amber-500/15 border-amber-500/60 text-amber-400'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {l === 'en' ? 'English' : 'Español'}
            </button>
          ))}
        </div>
      </Card>

      {/* Theme Selection */}
      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Sun className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">{tr('theme')}</h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">{tr('themeDesc')}</p>
        <div className="space-y-2">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => { onThemeChange(opt.value); flashSaved(); }}
                className={`w-full h-11 rounded-xl border flex items-center gap-3 px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/15 border-amber-500/60 text-amber-400'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Help & Support */}
      <Card className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">{tr('helpSupport')}</h3>
        </div>
        <div className="space-y-2">
          {helpItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center gap-3 py-2.5 text-left hover:bg-slate-800/60 rounded-lg px-2 -mx-2 transition-colors"
              >
                <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="text-sm text-slate-300 flex-1">{item.label}</span>
                <span className="text-slate-600 text-sm">›</span>
              </button>
            );
          })}
        </div>
      </Card>

      {showSaved && <AutoSavedIndicator locale={locale} />}

      {/* Super Admin — development/testing only */}
      <button
        onClick={onSuperAdmin}
        className="w-full flex items-center gap-3 py-2.5 px-4 text-left hover:bg-slate-800/60 rounded-lg transition-colors mb-4"
      >
        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-sm text-slate-500 flex-1">{tr('superAdmin')}</span>
        <span className="text-slate-600 text-sm">›</span>
      </button>
    </div>
  );
}
