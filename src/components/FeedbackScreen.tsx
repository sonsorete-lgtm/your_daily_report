import { Mail } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card } from './ui';

const CONTACT_EMAIL = 'technologies.nvz@gmail.com';
const DEVELOPER_NAME = 'NVZ Technologies';

interface FeedbackScreenProps {
  locale: Locale;
  onBack: () => void;
}

export function FeedbackScreen({ locale, onBack }: FeedbackScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  return (
    <div className="pt-6 pb-4">
      <ScreenTitle title={tr('feedbackContact')} subtitle={tr('feedbackDesc')} />

      <Card className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Mail className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-500">{tr('developerName')}</p>
            <p className="text-sm font-semibold text-slate-100">{DEVELOPER_NAME}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-1">{tr('contactEmail')}</p>
          <div className="flex items-center gap-2 px-3 h-11 rounded-xl bg-slate-800 border border-slate-700">
            <Mail className="w-4 h-4 text-slate-500 shrink-0" />
            <span className="text-sm text-slate-200 flex-1 truncate">{CONTACT_EMAIL}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
