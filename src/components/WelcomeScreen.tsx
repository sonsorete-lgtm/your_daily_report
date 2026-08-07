import { useState } from 'react';
import { FileText, UserCog, MapPin, Settings, Download, ChevronRight } from 'lucide-react';
import { Logo } from './Logo';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { PrimaryButton } from './ui';

interface OnboardingScreenProps {
  locale: Locale;
  onGetStarted: () => void;
  onSwitchLocale: (l: Locale) => void;
}

const STEPS = [
  { icon: FileText, titleKey: 'onboardingWelcome', descKey: 'onboardingWelcomeDesc' as const },
  { icon: UserCog, titleKey: 'onboardingEmployee', descKey: 'onboardingEmployeeDesc' as const },
  { icon: MapPin, titleKey: 'onboardingWorkSites', descKey: 'onboardingWorkSitesDesc' as const },
  { icon: Settings, titleKey: 'onboardingTemplates', descKey: 'onboardingTemplatesDesc' as const },
  { icon: Download, titleKey: 'onboardingReports', descKey: 'onboardingReportsDesc' as const },
] as const;

export function WelcomeScreen({ locale, onGetStarted, onSwitchLocale }: OnboardingScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];
  const Icon = current.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center fade-in">
      {step === 0 && (
        <div className="mb-8">
          <Logo size={88} />
        </div>
      )}

      {step > 0 && (
        <div className="mb-8 w-20 h-20 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
          <Icon className="w-10 h-10 text-amber-400" />
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight mb-3 max-w-xs">{tr(current.titleKey)}</h1>
      <p className="text-slate-400 text-sm mb-10 max-w-xs leading-relaxed">{tr(current.descKey)}</p>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === step ? 'w-6 bg-amber-400' : i < step ? 'w-1.5 bg-amber-400/50' : 'w-1.5 bg-slate-700'
            }`}
          />
        ))}
      </div>

      <div className="w-full max-w-xs space-y-3">
        {step === 0 && (
          <div className="flex gap-2 mb-2">
            {(['en', 'es'] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => onSwitchLocale(l)}
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
        )}

        <PrimaryButton
          onClick={() => (isLast ? onGetStarted() : setStep((s) => s + 1))}
          className="!h-12 flex items-center justify-center gap-1.5"
        >
          {isLast ? (
            tr('getStarted')
          ) : (
            <>
              {tr('onboardingNext')}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </PrimaryButton>

        {!isLast && (
          <button
            onClick={onGetStarted}
            className="w-full h-10 text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            {tr('onboardingSkip')}
          </button>
        )}
      </div>
    </div>
  );
}
