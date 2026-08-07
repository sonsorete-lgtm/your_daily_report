import { Shield, Crown, User, Check } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card } from './ui';

interface SuperAdminScreenProps {
  locale: Locale;
  isPremium: boolean;
  onTierChange: (tier: 'free' | 'premium') => void;
  onBack: () => void;
}

export function SuperAdminScreen({ locale, isPremium, onTierChange, onBack }: SuperAdminScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  return (
    <div className="pt-6">
      <ScreenTitle title={tr('superAdmin')} subtitle={tr('superAdminDevOnly')} />

      <Card className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">{tr('superAdminAccountType')}</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">{tr('superAdminAccountTypeDesc')}</p>

        <div className="space-y-2">
          <button
            onClick={() => onTierChange('free')}
            className={`w-full h-12 rounded-xl border flex items-center gap-3 px-3 text-sm font-medium transition-colors ${
              !isPremium
                ? 'bg-amber-500/15 border-amber-500/60 text-amber-400'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span className="flex-1 text-left">{tr('superAdminFree')}</span>
            {!isPremium && <Check className="w-4 h-4" />}
          </button>

          <button
            onClick={() => onTierChange('premium')}
            className={`w-full h-12 rounded-xl border flex items-center gap-3 px-3 text-sm font-medium transition-colors ${
              isPremium
                ? 'bg-amber-500/15 border-amber-500/60 text-amber-400'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span className="flex-1 text-left">{tr('superAdminPremium')}</span>
            {isPremium && <Check className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-[11px] text-slate-500 mt-4 flex items-center gap-1.5">
          <Check className="w-3 h-3 text-emerald-400" />
          {tr('superAdminDataPreserved')}
        </p>
      </Card>
    </div>
  );
}
