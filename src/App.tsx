import { useState, useEffect, useCallback, useRef } from 'react';
import { Menu as MenuIcon, ChevronLeft, Shield } from 'lucide-react';
import type {
  EmployeeProfile,
  WorkSite,
  ShiftReport,
  Locale,
  Theme,
  ReportTemplate,
  CustomField,
  FieldConfig,
} from './types';
import { DEFAULT_TEMPLATE } from './types';
import { storage } from './lib/storage';
import { t } from './lib/i18n';
import { buildReport } from './lib/pipeline';
import { buildReportDocument } from './lib/reportDocument';
import { downloadReportPdf } from './lib/pdf';
import { isPremium, activatePremium, setLicenseTier } from './lib/license';
import { WelcomeScreen } from './components/WelcomeScreen';
import { EmployeeSettingsScreen } from './components/EmployeeSettingsScreen';
import { WorkSitesScreen } from './components/WorkSitesScreen';
import { AppSettingsScreen } from './components/AppSettingsScreen';
import { RecordScreen, type ReportEntry } from './components/RecordScreen';
import { PreviewScreen, type PreviewEdits } from './components/PreviewScreen';
import { ReportsView } from './components/ReportsView';
import { MenuSheet } from './components/MenuSheet';
import { ReportTemplateScreen } from './components/ReportTemplateScreen';
import { TipsScreen } from './components/TipsScreen';
import { FaqScreen } from './components/FaqScreen';
import { UpgradeScreen } from './components/UpgradeScreen';
import { WhatsNewScreen } from './components/WhatsNewScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { PrivacyScreen } from './components/PrivacyScreen';
import { SuperAdminScreen } from './components/SuperAdminScreen';
import { LogoWordmark } from './components/Logo';

type View =
  | 'welcome'
  | 'record'
  | 'preview'
  | 'employeeSettings'
  | 'appSettings'
  | 'workSites'
  | 'previousReports'
  | 'menu'
  | 'reportTemplate'
  | 'tips'
  | 'faq'
  | 'upgrade'
  | 'whatsNew'
  | 'feedback'
  | 'privacy'
  | 'superAdmin';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info';
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<View>('welcome');
  const [viewHistory, setViewHistory] = useState<View[]>([]);
  const [locale, setLocale] = useState<Locale>('en');
  const [theme, setTheme] = useState<Theme>('dark');
  const [onboarded, setOnboarded] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [profiles, setProfiles] = useState<EmployeeProfile[]>([]);
  const [workSites, setWorkSites] = useState<WorkSite[]>([]);
  const [reports, setReports] = useState<ShiftReport[]>([]);
  const [reportTemplate, setReportTemplate] = useState<ReportTemplate | null>(null);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [employeeFieldConfigs, setEmployeeFieldConfigs] = useState<FieldConfig[]>([]);
  const [workSiteFieldConfigs, setWorkSiteFieldConfigs] = useState<FieldConfig[]>([]);
  const [reportFieldConfigs, setReportFieldConfigs] = useState<FieldConfig[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [draftEntry, setDraftEntry] = useState<ReportEntry | null>(null);
  const [draftSite, setDraftSite] = useState<WorkSite | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastIdRef = useRef(0);
  const toastTimerRef = useRef<number | null>(null);
  const skipNextSave = useRef(true);
  const [premium, setPremium] = useState(false);
  const [showAdminPasscode, setShowAdminPasscode] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Initialize IndexedDB and load all persisted state on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await storage.init();
      if (cancelled) return;
      setLocale(storage.getLocale() ?? 'en');
      setTheme(storage.getTheme());
      setEmployee(storage.getProfile());
      const savedProfiles = storage.getProfiles();
      setProfiles(savedProfiles);
      const savedProfileId = storage.getSelectedProfileId();
      if (savedProfileId && savedProfiles.some((p) => p.id === savedProfileId)) {
        setSelectedProfileId(savedProfileId);
        setEmployee(savedProfiles.find((p) => p.id === savedProfileId) ?? null);
      } else if (savedProfiles.length > 0) {
        const defaultP = savedProfiles[0];
        setSelectedProfileId(defaultP.id);
        setEmployee(defaultP);
      }
      setWorkSites(storage.getWorkSites());
      setReports(storage.getReports());
      setReportTemplate(storage.getReportTemplate());
      setCustomFields(storage.getCustomFields());
      setEmployeeFieldConfigs(storage.getEmployeeFieldConfigs() ?? []);
      setWorkSiteFieldConfigs(storage.getWorkSiteFieldConfigs() ?? []);
      setReportFieldConfigs(storage.getReportFieldConfigs() ?? []);
      setPremium(isPremium());
      const savedDraft = storage.getDraft();
      if (savedDraft) {
        setDraftEntry({ fieldValues: savedDraft.fieldValues, images: savedDraft.images });
        setDraftSite(savedDraft.workSite);
      }
      if (storage.isOnboarded()) {
        setOnboarded(true);
        const savedView = storage.getView();
        const validViews: View[] = ['record', 'preview', 'workSites', 'employeeSettings', 'appSettings', 'reportTemplate', 'previousReports', 'menu', 'tips', 'faq', 'whatsNew', 'feedback', 'privacy', 'superAdmin'];
        if (savedView && validViews.includes(savedView as View)) {
          // Don't restore to preview if draft is missing
          if (savedView === 'preview' && !savedDraft) {
            setView('record');
          } else {
            setView(savedView as View);
          }
        } else {
          setView('record');
        }
        const savedHistory = storage.getViewHistory();
        if (savedHistory.length > 0) setViewHistory(savedHistory as View[]);
      }
      const sites = storage.getWorkSites();
      if (sites.length > 0) {
        const savedSiteId = storage.getSelectedSiteId();
        setSelectedSiteId(savedSiteId && sites.some((s) => s.id === savedSiteId) ? savedSiteId : sites[0].id);
      }
      setReady(true);
    })();
    return () => { cancelled = true; };
  }, []);

  // Apply theme to <html> element
  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  // Persist state changes — surface failures via toast
  useEffect(() => {
    if (!ready || !employee) return;
    storage.setProfile(employee).then((ok) => {
      if (!ok) showToast(t(locale, 'saveFailed'), 'info');
    });
  }, [employee, ready]);
  useEffect(() => {
    if (!ready) return;
    storage.setProfiles(profiles).then((ok) => {
      if (!ok) showToast(t(locale, 'saveFailed'), 'info');
    });
  }, [profiles, ready]);
  useEffect(() => {
    if (!ready) return;
    storage.setSelectedProfileId(selectedProfileId);
  }, [selectedProfileId, ready]);
  useEffect(() => {
    if (!ready) return;
    storage.setWorkSites(workSites).then((ok) => {
      if (!ok) showToast(t(locale, 'saveFailed'), 'info');
    });
  }, [workSites, ready]);
  useEffect(() => {
    if (!ready) return;
    storage.setReports(reports).then((ok) => {
      if (!ok) showToast(t(locale, 'saveFailed'), 'info');
    });
  }, [reports, ready]);
  useEffect(() => { if (ready) storage.setLocale(locale); }, [locale, ready]);
  useEffect(() => { if (ready) storage.setTheme(theme); }, [theme, ready]);
  useEffect(() => { if (ready) storage.setReportTemplate(reportTemplate); }, [reportTemplate, ready]);
  useEffect(() => { if (ready) storage.setCustomFields(customFields); }, [customFields, ready]);
  useEffect(() => { if (ready) storage.setEmployeeFieldConfigs(employeeFieldConfigs); }, [employeeFieldConfigs, ready]);
  useEffect(() => { if (ready) storage.setWorkSiteFieldConfigs(workSiteFieldConfigs); }, [workSiteFieldConfigs, ready]);
  useEffect(() => { if (ready) storage.setReportFieldConfigs(reportFieldConfigs); }, [reportFieldConfigs, ready]);

  // Persist navigation state so user returns to where they left off
  useEffect(() => { if (ready && onboarded) storage.setView(view); }, [view, ready, onboarded]);
  useEffect(() => { if (ready) storage.setViewHistory(viewHistory); }, [viewHistory, ready]);
  useEffect(() => { if (ready) storage.setSelectedSiteId(selectedSiteId); }, [selectedSiteId, ready]);

  // Reset scroll to top on every view change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const navigateTo = useCallback((v: View) => {
    setViewHistory((h) => [...h, view]);
    setView(v);
  }, [view]);

  const navigateBack = useCallback(() => {
    setViewHistory((h) => {
      if (h.length === 0) { setView('record'); return h; }
      const prev = h[h.length - 1];
      setView(prev);
      return h.slice(0, -1);
    });
  }, []);

  const goHome = useCallback(() => {
    setView('record');
    setViewHistory([]);
  }, []);

  function showToast(message: string, type: 'success' | 'info' = 'success') {
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    const id = ++toastIdRef.current;
    setToast({ id, message, type });
    setToastVisible(true);
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
      toastTimerRef.current = window.setTimeout(() => {
        setToast((curr) => (curr?.id === id ? null : curr));
      }, 300);
    }, 4200);
  }

  function handleGetStarted() {
    storage.setOnboarded();
    setOnboarded(true);
    setShowOnboarding(false);
    setView('record');
    setViewHistory([]);
  }

  // Show loading screen until IndexedDB is ready
  if (!ready) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Fallback: if employee is null (e.g. all profiles deleted), use a default empty profile
  const activeEmployee: EmployeeProfile = employee ?? {
    id: 'default',
    name: '',
    company: '',
    employeeId: '',
    phoneEmail: '',
    phone: '',
    email: '',
    position: '',
    role: '',
    jobTitle: '',
    department: '',
    supervisorName: '',
    supervisorEmail: '',
    license: '',
    crewName: '',
    otherInfo: '',
    locale,
    companyLogo: null,
    customFields: [],
    customFieldValues: {},
  };

  function handleReplayOnboarding() {
    setShowOnboarding(true);
  }

  function handleRecordSubmit(entry: ReportEntry, site: WorkSite) {
    setDraftEntry(entry);
    setDraftSite(site);
    storage.setDraft({
      employee: activeEmployee,
      workSite: site,
      fieldValues: entry.fieldValues,
      images: entry.images,
      savedAt: new Date().toISOString(),
    });
    navigateTo('preview');
  }

  async function handlePreviewSave(edits: PreviewEdits, folio: string) {
    if (!draftSite) return;
    const report = buildReport({
      employee: activeEmployee,
      workSite: draftSite,
      fieldValues: edits.fieldValues,
      images: edits.images,
      folio,
      reportTemplate,
      customFields,
      employeeFieldConfigs,
      workSiteFieldConfigs,
      reportFieldConfigs,
    });
    setReports([report, ...reports]);
    setDraftEntry(null);
    setDraftSite(null);
    storage.clearDraft();
    try {
      const doc = buildReportDocument(report, locale);
      const filename = `${folio}.pdf`;
      await downloadReportPdf(doc, filename);
      showToast(t(locale, 'reportSavedPdf'), 'success');
    } catch {
      showToast(t(locale, 'reportSaved'), 'success');
    }
    goHome();
  }

  function handlePreviewDiscard() {
    setDraftEntry(null);
    setDraftSite(null);
    storage.clearDraft();
    showToast(t(locale, 'draftDiscarded'), 'info');
    goHome();
  }

  function handleDeleteReport(id: string) {
    setReports(reports.filter((r) => r.id !== id));
  }

  function handlePurchase() {
    activatePremium();
    setPremium(true);
    showToast(t(locale, 'upgradeSuccess'), 'success');
    navigateBack();
  }

  function handleAdminAccess() {
    if (passcodeInput === 'admin') {
      setShowAdminPasscode(false);
      setPasscodeInput('');
      setPasscodeError(false);
      navigateTo('superAdmin');
    } else {
      setPasscodeError(true);
    }
  }

  function handleTierChange(tier: 'free' | 'premium') {
    setLicenseTier(tier);
    setPremium(tier === 'premium');
  }

  // Onboarding screen (first launch or replay)
  if (!onboarded || showOnboarding) {
    return (
      <>
        {showOnboarding && onboarded && (
          <div className="min-h-screen bg-slate-950">
            <WelcomeScreen
              locale={locale}
              onGetStarted={handleGetStarted}
              onSwitchLocale={setLocale}
            />
          </div>
        )}
        {!showOnboarding && (
          <WelcomeScreen
            locale={locale}
            onGetStarted={handleGetStarted}
            onSwitchLocale={setLocale}
          />
        )}
      </>
    );
  }

  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);

  // Home screen has no back button; all other screens do
  const isHome = view === 'record';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-md mx-auto px-5 h-14 flex items-center justify-between">
          {isHome ? (
            <div className="w-20" />
          ) : (
            <button
              onClick={() => (viewHistory.length > 0 ? navigateBack() : setView('record'))}
              className="h-9 px-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium flex items-center gap-1.5 hover:bg-slate-700 hover:text-slate-100 transition-colors active:scale-[0.98]"
            >
              <ChevronLeft className="w-4 h-4" />
              {tr('back')}
            </button>
          )}
          <button onClick={goHome} className="flex items-center" aria-label={tr('home')}>
            <LogoWordmark />
          </button>
          <button
            onClick={() => navigateTo('menu')}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 active:bg-slate-700 transition-colors"
            aria-label={tr('menu')}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-5 pb-24">
        {view === 'record' && (
          <RecordScreen
            employee={activeEmployee}
            workSites={workSites}
            locale={locale}
            reportTemplate={reportTemplate ?? DEFAULT_TEMPLATE}
            customFields={customFields}
            reportFieldConfigs={reportFieldConfigs}
            selectedSiteId={selectedSiteId}
            onSelectSite={setSelectedSiteId}
            onSubmit={handleRecordSubmit}
            onOpenWorkSites={() => navigateTo('workSites')}
            onOpenEmployeeSettings={() => navigateTo('employeeSettings')}
            onOpenReportTemplate={() => navigateTo('reportTemplate')}
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelectProfile={(id) => {
              setSelectedProfileId(id);
              const p = profiles.find((pr) => pr.id === id);
              if (p) setEmployee(p);
            }}
            isPremium={premium}
          />
        )}

        {view === 'preview' && draftSite && draftEntry && (
          <PreviewScreen
            locale={locale}
            employee={activeEmployee}
            workSite={draftSite}
            initialFieldValues={draftEntry.fieldValues}
            initialImages={draftEntry.images}
            reportTemplate={reportTemplate}
            customFields={customFields}
            employeeFieldConfigs={employeeFieldConfigs}
            workSiteFieldConfigs={workSiteFieldConfigs}
            reportFieldConfigs={reportFieldConfigs}
            isPremium={premium}
            reports={reports}
            onUpgrade={() => navigateTo('upgrade')}
            onSave={handlePreviewSave}
            onDiscard={handlePreviewDiscard}
            onBack={() => navigateBack()}
            onNotify={showToast}
          />
        )}

        {view === 'employeeSettings' && (
          <EmployeeSettingsScreen
            profiles={profiles}
            selectedProfileId={selectedProfileId}
            onSelectProfile={(id) => {
              setSelectedProfileId(id);
              const p = profiles.find((pr) => pr.id === id);
              if (p) setEmployee(p);
            }}
            onProfilesChange={(updated) => {
              setProfiles(updated);
              if (updated.length === 0) {
                setEmployee(null);
                setSelectedProfileId(null);
              } else {
                const current = updated.find((p) => p.id === selectedProfileId);
                if (current) setEmployee(current);
                else {
                  const fallback = updated[0];
                  setSelectedProfileId(fallback.id);
                  setEmployee(fallback);
                }
              }
            }}
            onBack={() => navigateBack()}
            onNotify={showToast}
            onUpgrade={() => navigateTo('upgrade')}
            fieldConfigs={employeeFieldConfigs}
            onFieldConfigsChange={setEmployeeFieldConfigs}
            isPremium={premium}
            locale={locale}
          />
        )}

        {view === 'workSites' && (
          <WorkSitesScreen
            workSites={workSites}
            onChange={setWorkSites}
            locale={locale}
            onBack={() => navigateBack()}
            onUpgrade={() => navigateTo('upgrade')}
            fieldConfigs={workSiteFieldConfigs}
            onFieldConfigsChange={setWorkSiteFieldConfigs}
            isPremium={premium}
          />
        )}

        {view === 'reportTemplate' && (
          <ReportTemplateScreen
            locale={locale}
            reportTemplate={reportTemplate}
            onTemplateChange={setReportTemplate}
            customFields={customFields}
            onCustomFieldsChange={setCustomFields}
            fieldConfigs={reportFieldConfigs}
            onFieldConfigsChange={setReportFieldConfigs}
            onUpgrade={() => navigateTo('upgrade')}
            onBack={() => navigateBack()}
            isPremium={premium}
          />
        )}

        {view === 'appSettings' && (
          <AppSettingsScreen
            locale={locale}
            theme={theme}
            onThemeChange={setTheme}
            onLocaleChange={setLocale}
            onReplayOnboarding={handleReplayOnboarding}
            onWhatsNew={() => navigateTo('whatsNew')}
            onFeedback={() => navigateTo('feedback')}
            onPrivacy={() => navigateTo('privacy')}
            onTips={() => navigateTo('tips')}
            onFaq={() => navigateTo('faq')}
            onSuperAdmin={() => setShowAdminPasscode(true)}
            onBack={() => navigateBack()}
          />
        )}

        {view === 'previousReports' && (
          <ReportsView
            locale={locale}
            reports={reports}
            isPremium={premium}
            onUpgrade={() => navigateTo('upgrade')}
            onDelete={handleDeleteReport}
            onBack={() => navigateBack()}
            onNotify={showToast}
          />
        )}

        {view === 'menu' && (
          <MenuSheet
            locale={locale}
            onWorkSites={() => navigateTo('workSites')}
            onPreviousReports={() => navigateTo('previousReports')}
            onEmployeeSettings={() => navigateTo('employeeSettings')}
            onSettings={() => navigateTo('appSettings')}
            onReportTemplate={() => navigateTo('reportTemplate')}
            onUpgrade={() => navigateTo('upgrade')}
            onBack={() => navigateBack()}
            isPremium={premium}
          />
        )}

        {view === 'tips' && (
          <TipsScreen
            locale={locale}
            onBack={() => navigateBack()}
          />
        )}

        {view === 'faq' && (
          <FaqScreen
            locale={locale}
            onBack={() => navigateBack()}
          />
        )}

        {view === 'upgrade' && (
          <UpgradeScreen
            locale={locale}
            isPremium={premium}
            onPurchase={handlePurchase}
            onBack={() => navigateBack()}
          />
        )}

        {view === 'whatsNew' && (
          <WhatsNewScreen
            locale={locale}
            onBack={() => navigateBack()}
          />
        )}

        {view === 'feedback' && (
          <FeedbackScreen
            locale={locale}
            onBack={() => navigateBack()}
          />
        )}

        {view === 'privacy' && (
          <PrivacyScreen
            locale={locale}
            onBack={() => navigateBack()}
          />
        )}

        {view === 'superAdmin' && (
          <SuperAdminScreen
            locale={locale}
            isPremium={premium}
            onTierChange={handleTierChange}
            onBack={() => navigateBack()}
          />
        )}
      </main>

      {/* Super Admin Passcode Dialog */}
      {showAdminPasscode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowAdminPasscode(false); setPasscodeInput(''); setPasscodeError(false); }} />
          <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl px-6 py-7 fade-in">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/15 border border-amber-500/30 mx-auto mb-5">
              <Shield className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 text-center mb-4">{tr('superAdminPasscode')}</h3>
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => { setPasscodeInput(e.target.value); setPasscodeError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
              autoFocus
              className={`w-full px-3 h-11 rounded-xl bg-slate-800 border ${passcodeError ? 'border-red-500/60' : 'border-slate-700'} text-sm text-slate-100 focus:outline-none focus:border-amber-500/60 mb-2`}
            />
            {passcodeError && <p className="text-xs text-red-400 mb-2">{tr('superAdminIncorrect')}</p>}
            <div className="space-y-2 mt-4">
              <button
                onClick={handleAdminAccess}
                className="w-full h-12 rounded-xl bg-amber-500 text-slate-900 font-semibold text-sm hover:bg-amber-400 transition-colors"
              >
                {tr('ok')}
              </button>
              <button
                onClick={() => { setShowAdminPasscode(false); setPasscodeInput(''); setPasscodeError(false); }}
                className="w-full h-12 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium hover:bg-slate-700 transition-colors"
              >
                {tr('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 ease-out ${
            toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }}
        >
          <div
            className={`px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 text-sm font-medium text-center max-w-[calc(100vw-2.5rem)] ${
              toast.type === 'success'
                ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800 border border-slate-700 text-slate-200'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
