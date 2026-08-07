import { Check } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card } from './ui';

interface WhatsNewScreenProps {
  locale: Locale;
  onBack: () => void;
}

interface ReleaseVersion {
  version: string;
  titleKey: Parameters<typeof t>[1];
  features: Parameters<typeof t>[1][];
}

const VERSIONS: ReleaseVersion[] = [
  {
    version: '1.0',
    titleKey: 'v1Title',
    features: [
      'v1Feature1',
      'v1Feature2',
      'v1Feature3',
      'v1Feature4',
      'v1Feature5',
      'v1Feature6',
      'v1Feature7',
      'v1Feature8',
      'v1Feature9',
      'v1Feature10',
    ],
  },
];

export function WhatsNewScreen({ locale, onBack }: WhatsNewScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  return (
    <div className="pt-6 pb-4">
      <ScreenTitle title={tr('whatsNew')} subtitle={tr('whatsNewDesc')} />

      <div className="space-y-4">
        {VERSIONS.map((ver) => (
          <Card key={ver.version} className="fade-in">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold">
                v{ver.version}
              </span>
              <h3 className="text-sm font-semibold text-slate-100">{tr(ver.titleKey)}</h3>
            </div>
            <div className="space-y-2.5">
              {ver.features.map((fk) => (
                <div key={fk} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300">{tr(fk)}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
