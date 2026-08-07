import {
  BookOpen, FileText, MapPin, Camera,
  Settings, Download, History, UserCog, ListPlus,
  LayoutTemplate, Image as ImageIcon, Crown, Database, SlidersHorizontal, Hash,
} from 'lucide-react';
import type { Locale } from '../types';
import { t } from '../lib/i18n';
import { ScreenTitle, Card } from './ui';

interface TipsScreenProps {
  locale: Locale;
  onBack: () => void;
}

interface TipSection {
  icon: typeof FileText;
  titleKey: Parameters<typeof t>[1];
  descKey: Parameters<typeof t>[1];
}

const sections: TipSection[] = [
  { icon: BookOpen, titleKey: 'tipsHowToUse', descKey: 'tipsHowToUseDesc' },
  { icon: UserCog, titleKey: 'tipsEmployeeSettings', descKey: 'tipsEmployeeSettingsDesc' },
  { icon: MapPin, titleKey: 'tipsSelectingSites', descKey: 'tipsSelectingSitesDesc' },
  { icon: LayoutTemplate, titleKey: 'tipsReportTemplate', descKey: 'tipsReportTemplateDesc' },
  { icon: SlidersHorizontal, titleKey: 'tipsReorderFields', descKey: 'tipsReorderFieldsDesc' },
  { icon: FileText, titleKey: 'tipsCreatingReport', descKey: 'tipsCreatingReportDesc' },
  { icon: Camera, titleKey: 'tipsAddingImages', descKey: 'tipsAddingImagesDesc' },
  { icon: ImageIcon, titleKey: 'tipsCompanyLogo', descKey: 'tipsCompanyLogoDesc' },
  { icon: ListPlus, titleKey: 'tipsCustomFields', descKey: 'tipsCustomFieldsDesc' },
  { icon: Download, titleKey: 'tipsDownloadingPdf', descKey: 'tipsDownloadingPdfDesc' },
  { icon: History, titleKey: 'tipsPreviousReports', descKey: 'tipsPreviousReportsDesc' },
  { icon: Hash, titleKey: 'tipsReportId', descKey: 'tipsReportIdDesc' },
  { icon: Database, titleKey: 'tipsLocalStorage', descKey: 'tipsLocalStorageDesc' },
  { icon: Crown, titleKey: 'tipsPremium', descKey: 'tipsPremiumDesc' },
  { icon: Settings, titleKey: 'tipsManagingSettings', descKey: 'tipsManagingSettingsDesc' },
];

export function TipsScreen({ locale, onBack }: TipsScreenProps) {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  return (
    <div className="pt-6 pb-4">
      <ScreenTitle title={tr('tips')} subtitle={tr('tipsDesc')} />

      <div className="space-y-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.titleKey} className="fade-in">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100 mb-1">{tr(s.titleKey)}</h3>
                  <p className="text-xs leading-relaxed text-slate-400 whitespace-pre-line">{tr(s.descKey)}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
