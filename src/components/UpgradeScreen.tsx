import { Check, Sparkles, Crown } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { PREMIUM_PRICE_USD } from '../lib/license';
import { ScreenTitle, Card, PrimaryButton, GhostButton } from './ui';

interface UpgradeScreenProps {
  locale: Locale;
  isPremium: boolean;
  onPurchase: () => void;
  onBack: () => void;
}

export function UpgradeScreen({ locale, isPremium: premium, onPurchase, onBack }: UpgradeScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const features = [
    tr('upgradeFeature1'),
    tr('upgradeFeature2'),
    tr('upgradeFeature3'),
    tr('upgradeFeature4'),
  ];

  return (
    <div className="pt-6 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
          <Crown className="w-10 h-10 text-slate-900" />
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">{tr('upgradeTitle')}</h1>
        <p className="text-sm text-slate-400 text-center mb-8 max-w-xs">{tr('upgradeDesc')}</p>

        <Card className="w-full mb-6">
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-4xl font-bold text-amber-400">${PREMIUM_PRICE_USD}</span>
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <p className="text-xs text-slate-500">{tr('upgradeLifetime')}</p>
          </div>

          <div className="space-y-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <span className="text-sm text-slate-200">{f}</span>
              </div>
            ))}
          </div>
        </Card>

        {premium ? (
          <div className="w-full text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium text-sm">
              <Check className="w-5 h-5" />
              {tr('premiumActive')}
            </div>
          </div>
        ) : (
          <div className="w-full space-y-3">
            <PrimaryButton onClick={onPurchase} className="!h-14 text-base">
              <span className="flex items-center justify-center gap-2">
                <Crown className="w-5 h-5" />
                {tr('upgradeButton')} · ${PREMIUM_PRICE_USD}
              </span>
            </PrimaryButton>
            <GhostButton onClick={onBack} className="!h-10 flex items-center justify-center w-full">
              {tr('cancel')}
            </GhostButton>
          </div>
        )}
      </div>
    </div>
  );
}
