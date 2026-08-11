import { Shield, CheckCircle2, ExternalLink, Mail, Globe } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card } from './ui';

interface PrivacyScreenProps {
  locale: Locale;
  onBack: () => void;
}

const PRIVACY_POLICY_URL = 'https://nvztechnologies.org/legal/your-daily-report-privacy';
const DEVELOPER_NAME = 'NVZ Technologies';
const DEVELOPER_WEBSITE = 'https://nvztechnologies.org/';
const CONTACT_EMAIL = 'technologies.nvz@gmail.com';
const DEVELOPER_LOCATION = 'Dallas, Texas, United States';

const PRIVACY_POINTS: Parameters<typeof t>[1][] = [
  'privacyPoint1',
  'privacyPoint2',
  'privacyPoint3',
  'privacyPoint4',
  'privacyPoint5',
  'privacyPoint6',
  'privacyPoint7',
];

export function PrivacyScreen({ locale, onBack }: PrivacyScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  function openPrivacyPolicy() {
    window.open(PRIVACY_POLICY_URL, '_blank', 'noopener,noreferrer');
  }

  function openWebsite() {
    window.open(DEVELOPER_WEBSITE, '_blank', 'noopener,noreferrer');
  }

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

      <Card className="mb-4">
        <button
          onClick={openPrivacyPolicy}
          className="flex items-center justify-between gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors w-full text-left"
        >
          <span>{tr('privacyPolicy')}</span>
          <ExternalLink className="w-4 h-4 shrink-0" />
        </button>
        <p className="text-xs text-slate-600 mt-2">
          {PRIVACY_POLICY_URL}
        </p>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500">{tr('developerName')}</p>
            <p className="text-sm font-semibold text-slate-100">{DEVELOPER_NAME}</p>
            <p className="text-xs text-slate-500 mt-0.5">{DEVELOPER_LOCATION}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-slate-500 mb-1">{tr('contactEmail')}</p>
            <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-slate-800 border border-slate-700">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-sm text-slate-200 flex-1 truncate">{CONTACT_EMAIL}</span>
            </div>
          </div>

          <button
            onClick={openWebsite}
            className="flex items-center justify-between gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors w-full text-left pt-1"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 shrink-0" />
              {DEVELOPER_WEBSITE}
            </span>
            <ExternalLink className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </Card>
    </div>
  );
}
