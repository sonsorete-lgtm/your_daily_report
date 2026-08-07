import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card } from './ui';

interface FaqItem {
  qKey: Parameters<typeof t>[1];
  aKey: Parameters<typeof t>[1];
}

const FAQ_ITEMS: FaqItem[] = [
  { qKey: 'faqCreateFirstReport', aKey: 'faqCreateFirstReportAns' },
  { qKey: 'faqFreeVsPremium', aKey: 'faqFreeVsPremiumAns' },
  { qKey: 'faqWhereStored', aKey: 'faqWhereStoredAns' },
  { qKey: 'faqOffline', aKey: 'faqOfflineAns' },
  { qKey: 'faqAddImages', aKey: 'faqAddImagesAns' },
  { qKey: 'faqCustomFields', aKey: 'faqCustomFieldsAns' },
  { qKey: 'faqReportId', aKey: 'faqReportIdAns' },
  { qKey: 'faqChangeWorkSite', aKey: 'faqChangeWorkSiteAns' },
  { qKey: 'faqEditReport', aKey: 'faqEditReportAns' },
  { qKey: 'faqDeleteReport', aKey: 'faqDeleteReportAns' },
  { qKey: 'faqRestoreDefaults', aKey: 'faqRestoreDefaultsAns' },
];

interface FaqScreenProps {
  locale: Locale;
  onBack: () => void;
}

export function FaqScreen({ locale, onBack }: FaqScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pt-6 pb-4">
      <ScreenTitle title={tr('tipsFaq')} subtitle={tr('faqDesc')} />

      <div className="space-y-2.5">
        {FAQ_ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <Card key={item.qKey} className="p-0 overflow-hidden fade-in">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full p-4 flex items-center justify-between text-left gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-100">{tr(item.qKey)}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-4 fade-in">
                  <p className="text-sm leading-relaxed text-slate-400 pl-11">{tr(item.aKey)}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
