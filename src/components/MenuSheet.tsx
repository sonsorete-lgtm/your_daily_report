import {
  FileText, History, Settings, UserCog, Crown, Sparkles, LayoutTemplate,
} from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle } from './ui';

interface MenuSheetProps {
  locale: Locale;
  onWorkSites: () => void;
  onPreviousReports: () => void;
  onEmployeeSettings: () => void;
  onSettings: () => void;
  onReportTemplate: () => void;
  onUpgrade: () => void;
  onBack: () => void;
  isPremium: boolean;
}

export function MenuSheet({
  locale,
  onWorkSites,
  onPreviousReports,
  onEmployeeSettings,
  onSettings,
  onReportTemplate,
  onUpgrade,
  onBack,
  isPremium,
}: MenuSheetProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const premium = isPremium;

  const items = [
    { icon: UserCog, label: tr('employeeSettings'), onClick: onEmployeeSettings },
    { icon: FileText, label: tr('workSites'), onClick: onWorkSites },
    { icon: LayoutTemplate, label: tr('reportTemplateSetup'), onClick: onReportTemplate },
    { icon: History, label: tr('previousReports'), onClick: onPreviousReports },
    { icon: Settings, label: tr('appSettings'), onClick: onSettings },
  ];

  return (
    <div className="pt-6 pb-4 flex flex-col min-h-[calc(100vh-12rem)]">
      <ScreenTitle title={tr('menu')} />

      <div className="space-y-2 flex-1">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.onClick}
              className="w-full p-3.5 rounded-2xl flex items-center gap-3 text-left bg-slate-900/60 border border-slate-800 hover:bg-slate-800/60 hover:border-slate-700 active:scale-[0.99] transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-200">{item.label}</span>
            </button>
          );
        })}

        {!premium && (
          <button
            onClick={onUpgrade}
            className="w-full p-3.5 rounded-2xl flex items-center gap-3 text-left bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 hover:from-amber-500/20 hover:to-orange-500/20 active:scale-[0.99] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Crown className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-sm font-semibold text-amber-400">{tr('upgradeToPremium')}</span>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {tr('upgradeLifetime')}
              </p>
            </div>
          </button>
        )}
      </div>

      <div className="pt-6 mt-6 border-t border-slate-800/60">
        <div className="text-center space-y-1">
          <p className="text-[11px] text-slate-500 font-medium">{tr('aboutApp')}</p>
          <p className="text-[11px] text-slate-600">{tr('creditsDesc')}</p>
          <p className="text-[11px] text-slate-600">{premium ? tr('premiumVersion') : tr('freeVersion')}</p>
        </div>
      </div>
    </div>
  );
}
