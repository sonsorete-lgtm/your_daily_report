import type {
  WorkSite,
  ShiftReport,
  EmployeeProfile,
  Locale,
  ReportDraft,
  ReportTemplate,
  CustomField,
  FieldConfig,
  LicenseState,
  Theme,
} from '../types';
import { SEED_WORK_SITES } from '../data/sites';
import { idbGet, idbSet, idbDelete } from './idb';

const KEYS = {
  profile: 'ydr-employee',
  profiles: 'ydr-employee-profiles',
  selectedProfileId: 'ydr-selected-profile-id',
  workSites: 'ydr-worksites',
  reports: 'ydr-reports',
  locale: 'ydr-locale',
  onboarded: 'ydr-onboarded',
  draft: 'ydr-draft',
  reportTemplate: 'ydr-report-template',
  sectionOrder: 'ydr-section-order',
  customFields: 'ydr-custom-fields',
  license: 'ydr-license',
  theme: 'ydr-theme',
  folioCounter: 'ydr-folio-counter',
  employeeFieldConfigs: 'ydr-employee-field-configs',
  workSiteFieldConfigs: 'ydr-worksite-field-configs',
  reportFieldConfigs: 'ydr-report-field-configs',
  migrated: 'ydr-migrated',
  view: 'ydr-view',
  viewHistory: 'ydr-view-history',
  selectedSiteId: 'ydr-selected-site',
  reportFormValues: 'ydr-report-form-values',
} as const;

type StorageKey = keyof typeof KEYS;

/**
 * In-memory cache populated on load. Allows synchronous reads
 * while data is actually persisted in IndexedDB.
 */
const cache = new Map<string, unknown>();

/** Tracks whether init() has been called. */
let initialized = false;

/**
 * Critical "onboarded" flag backed by localStorage as a fallback.
 * If IndexedDB is evicted or unavailable, this prevents the app
 * from resetting to onboarding and losing the user's session.
 */
const LS_ONBOARDED_KEY = 'ydr-onboarded-fallback';
function readOnboardedFallback(): boolean {
  try { return localStorage.getItem(LS_ONBOARDED_KEY) === '1'; } catch { return false; }
}
function writeOnboardedFallback() {
  try { localStorage.setItem(LS_ONBOARDED_KEY, '1'); } catch { /* ignore */ }
}

function readCache<T>(key: string, fallback: T): T {
  const val = cache.get(key);
  return val !== undefined ? (val as T) : fallback;
}

/**
 * Migrate existing localStorage data to IndexedDB on first run.
 * Reads all known keys from localStorage and writes them to IDB.
 * Once migration is complete, sets a flag so we never migrate again.
 */
async function migrateFromLocalStorage(): Promise<void> {
  if (cache.get(KEYS.migrated)) return;

  let migratedAny = false;

  for (const key of Object.values(KEYS)) {
    if (key === KEYS.migrated) continue;
    let raw: string | null = null;
    try {
      raw = localStorage.getItem(key);
    } catch {
      // localStorage may be unavailable in some contexts
    }
    if (raw !== null) {
      try {
        const parsed = JSON.parse(raw);
        await idbSet(key, parsed);
        cache.set(key, parsed);
        migratedAny = true;
      } catch {
        // JSON parse failure — skip this key
      }
    }
  }

  // Also pick up non-JSON localStorage values (locale, theme, onboarded)
  const simpleKeys: { key: string; parse: (v: string) => unknown }[] = [
    { key: KEYS.locale, parse: (v) => v },
    { key: KEYS.theme, parse: (v) => v },
    { key: KEYS.onboarded, parse: (v) => v === '1' },
  ];
  for (const { key, parse } of simpleKeys) {
    if (cache.has(key)) continue; // already migrated via JSON
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const val = parse(raw);
        await idbSet(key, val);
        cache.set(key, val);
        migratedAny = true;
      }
    } catch {
      // skip
    }
  }

  await idbSet(KEYS.migrated, true);
  cache.set(KEYS.migrated, true);

  // Clean up localStorage after successful migration
  if (migratedAny) {
    try {
      for (const key of Object.values(KEYS)) {
        localStorage.removeItem(key);
      }
    } catch {
      // localStorage cleanup is best-effort
    }
  }
}

/**
 * Initialize storage: open IndexedDB, migrate from localStorage if needed,
 * and populate the in-memory cache with all stored values.
 *
 * Must be called once before any storage reads.
 */
export async function initStorage(): Promise<void> {
  if (initialized) return;
  initialized = true;

  try {
    await migrateFromLocalStorage();

    // Load all known keys into cache
    const loadKeys = Object.values(KEYS).filter((k) => k !== KEYS.migrated);
    await Promise.all(
      loadKeys.map(async (key) => {
        if (cache.has(key)) return; // already loaded during migration
        const val = await idbGet<unknown>(key);
        if (val !== undefined) cache.set(key, val);
      }),
    );
  } catch {
    // IndexedDB may be unavailable (browser eviction, private mode, etc.)
    // Fall back to localStorage onboarded flag so the app doesn't reset
    if (readOnboardedFallback()) {
      cache.set(KEYS.onboarded, true);
    }
  }
}

async function persist<T>(key: string, value: T | null): Promise<boolean> {
  try {
    if (value === null) {
      cache.delete(key);
      await idbDelete(key);
    } else {
      cache.set(key, value);
      await idbSet(key, value);
    }
    return true;
  } catch {
    return false;
  }
}

// Synchronous reads (from cache, populated by initStorage)
// Async writes (to IndexedDB, with cache updated immediately)

export const storage = {
  // --- Lifecycle ---
  init: initStorage,

  // --- Employee Profile ---
  getProfile(): EmployeeProfile {
    return readCache<EmployeeProfile>(KEYS.profile, {
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
      locale: 'en',
      companyLogo: null,
      customFields: [],
      customFieldValues: {},
    });
  },
  async setProfile(p: EmployeeProfile): Promise<boolean> {
    return persist(KEYS.profile, p);
  },

  // --- Employee Profiles (multiple, Premium) ---
  getProfiles(): EmployeeProfile[] {
    const stored = readCache<EmployeeProfile[] | null>(KEYS.profiles, null);
    if (stored && stored.length > 0) return stored;
    // Migrate from single profile
    const single = readCache<EmployeeProfile | null>(KEYS.profile, null);
    if (single && (single.name || single.company)) {
      const migrated: EmployeeProfile[] = [{ ...single }];
      persist(KEYS.profiles, migrated);
      return migrated;
    }
    return [];
  },
  async setProfiles(profiles: EmployeeProfile[]): Promise<boolean> {
    return persist(KEYS.profiles, profiles);
  },
  getSelectedProfileId(): string | null {
    return readCache<string | null>(KEYS.selectedProfileId, null);
  },
  async setSelectedProfileId(id: string | null): Promise<boolean> {
    return persist(KEYS.selectedProfileId, id);
  },

  // --- Work Sites ---
  getWorkSites(): WorkSite[] {
    const stored = readCache<WorkSite[] | null>(KEYS.workSites, null);
    return stored ?? SEED_WORK_SITES;
  },
  async setWorkSites(s: WorkSite[]): Promise<boolean> {
    return persist(KEYS.workSites, s);
  },

  // --- Reports ---
  getReports(): ShiftReport[] {
    return readCache<ShiftReport[]>(KEYS.reports, []);
  },
  async setReports(r: ShiftReport[]): Promise<boolean> {
    return persist(KEYS.reports, r);
  },

  // --- Locale ---
  getLocale(): Locale | null {
    const v = cache.get(KEYS.locale);
    return v === 'en' || v === 'es' ? (v as Locale) : null;
  },
  async setLocale(l: Locale): Promise<boolean> {
    return persist(KEYS.locale, l);
  },

  // --- Onboarding ---
  isOnboarded(): boolean {
    return cache.get(KEYS.onboarded) === true || readOnboardedFallback();
  },
  async setOnboarded(): Promise<boolean> {
    writeOnboardedFallback();
    return persist(KEYS.onboarded, true);
  },

  // --- Draft ---
  getDraft(): ReportDraft | null {
    return readCache<ReportDraft | null>(KEYS.draft, null);
  },
  async setDraft(d: ReportDraft | null): Promise<boolean> {
    return persist(KEYS.draft, d);
  },
  async clearDraft(): Promise<boolean> {
    return persist(KEYS.draft, null);
  },

  // --- Report Template ---
  getReportTemplate(): ReportTemplate | null {
    return readCache<ReportTemplate | null>(KEYS.reportTemplate, null);
  },
  async setReportTemplate(template: ReportTemplate | null): Promise<boolean> {
    return persist(KEYS.reportTemplate, template);
  },

  // --- Section Order ---
  getSectionOrder(): string[] | null {
    return readCache<string[] | null>(KEYS.sectionOrder, null);
  },
  async setSectionOrder(order: string[] | null): Promise<boolean> {
    return persist(KEYS.sectionOrder, order);
  },

  // --- Custom Fields ---
  getCustomFields(): CustomField[] {
    return readCache<CustomField[]>(KEYS.customFields, []);
  },
  async setCustomFields(fields: CustomField[]): Promise<boolean> {
    return persist(KEYS.customFields, fields);
  },

  // --- License ---
  getLicense(): LicenseState {
    return readCache<LicenseState>(KEYS.license, { tier: 'free', purchasedAt: null });
  },
  async setLicense(license: LicenseState): Promise<boolean> {
    return persist(KEYS.license, license);
  },

  // --- Theme ---
  getTheme(): Theme {
    const v = cache.get(KEYS.theme);
    return v === 'light' || v === 'dark' ? (v as Theme) : 'dark';
  },
  async setTheme(theme: Theme): Promise<boolean> {
    return persist(KEYS.theme, theme);
  },

  // --- Folio Counter ---
  getFolioCounter(): number {
    return readCache<number>(KEYS.folioCounter, 0);
  },
  async setFolioCounter(n: number): Promise<boolean> {
    return persist(KEYS.folioCounter, n);
  },

  // --- Field Configs ---
  getEmployeeFieldConfigs(): FieldConfig[] | null {
    return readCache<FieldConfig[] | null>(KEYS.employeeFieldConfigs, null);
  },
  async setEmployeeFieldConfigs(configs: FieldConfig[] | null): Promise<boolean> {
    return persist(KEYS.employeeFieldConfigs, configs);
  },
  getWorkSiteFieldConfigs(): FieldConfig[] | null {
    return readCache<FieldConfig[] | null>(KEYS.workSiteFieldConfigs, null);
  },
  async setWorkSiteFieldConfigs(configs: FieldConfig[] | null): Promise<boolean> {
    return persist(KEYS.workSiteFieldConfigs, configs);
  },
  getReportFieldConfigs(): FieldConfig[] | null {
    return readCache<FieldConfig[] | null>(KEYS.reportFieldConfigs, null);
  },
  async setReportFieldConfigs(configs: FieldConfig[] | null): Promise<boolean> {
    return persist(KEYS.reportFieldConfigs, configs);
  },

  // --- Navigation State ---
  getView(): string | null {
    return readCache<string | null>(KEYS.view, null);
  },
  async setView(v: string | null): Promise<boolean> {
    return persist(KEYS.view, v);
  },
  getViewHistory(): string[] {
    return readCache<string[]>(KEYS.viewHistory, []);
  },
  async setViewHistory(h: string[]): Promise<boolean> {
    return persist(KEYS.viewHistory, h);
  },
  getSelectedSiteId(): string | null {
    return readCache<string | null>(KEYS.selectedSiteId, null);
  },
  async setSelectedSiteId(id: string | null): Promise<boolean> {
    return persist(KEYS.selectedSiteId, id);
  },

  // --- Report Form Values (in-progress) ---
  getReportFormValues(): Record<string, string> | null {
    return readCache<Record<string, string> | null>(KEYS.reportFormValues, null);
  },
  async setReportFormValues(v: Record<string, string> | null): Promise<boolean> {
    return persist(KEYS.reportFormValues, v);
  },
};

// Re-export StorageKey for potential debugging
export type { StorageKey };
