import { Shield, CheckCircle2, ExternalLink } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card } from './ui';

interface PrivacyScreenProps {
  locale: Locale;
  onBack: () => void;
}

const PRIVACY_POINTS: Parameters<typeof t>[1][] = [
  'privacyPoint1',
  'privacyPoint2',
  'privacyPoint3',
  'privacyPoint4',
  'privacyPoint5',
  'privacyPoint6',
  'privacyPoint7',
];

const PLAY_STORE_PRIVACY_URL = 'https://mydailyreport.app/privacy';

export function PrivacyScreen({ locale, onBack }: PrivacyScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  return (
    <div className="pt-6 pb-4">
      <ScreenTitle title={tr('privacyPolicy')} subtitle={tr('privacyPolicyDesc')} />

      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      <Card className="mb-4">
        <p className="text-sm text-slate-300 leading-relaxed mb-4">{tr('privacyPolicyIntro')}</p>

        <div className="space-y-3">
          {PRIVACY_POINTS.map((pk) => (
            <div key={pk} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="text-sm text-slate-300 leading-relaxed">{tr(pk)}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <a
          href={PLAY_STORE_PRIVACY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          <span>{tr('privacyPlayStore')}</span>
          <ExternalLink className="w-4 h-4 shrink-0" />
        </a>
        <p className="text-xs text-slate-600 mt-2">
          {PLAY_STORE_PRIVACY_URL}
        </p>
      </Card>
    </div>
  );
}
