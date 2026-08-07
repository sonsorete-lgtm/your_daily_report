// Core data models for "Your Daily Report".
// Offline-first local-only Daily Report PDF builder.

export type Locale = 'en' | 'es';

export type Theme = 'light' | 'dark';

export type WorkSite = {
  id: string;
  label: string;
  pmName: string;
  pmEmail: string;
  pmPhone: string;
  siteAddress: string;
  jobNumber: string;
  companyClient: string;
  jobDescription: string;
  contractNumber: string;
  poNumber: string;
  costCode: string;
  costCenter: string;
  buildingArea: string;
  floorUnit: string;
  assetNumber: string;
  customerRep: string;
  customerPhone: string;
  customerEmail: string;
  crew: string;
  superintendent: string;
  safetyRequirements: string;
  siteAccessInstructions: string;
  gateCode: string;
  permitNumber: string;
  gpsCoordinates: string;
  customFields: CustomField[];
  customFieldValues: Record<string, string>;
  /** Ordered field configurations for built-in + custom fields (Premium). */
  fieldConfigs?: FieldConfig[];
};

/** Identifiers for the built-in sections of a Daily Report. */
export type ReportSectionKey =
  | 'shiftSummary'
  | 'scopeOfWork'
  | 'accomplishments'
  | 'observations'
  | 'actionsTaken'
  | 'materials'
  | 'delays'
  | 'incidents'
  | 'hours'
  | 'notes'
  | 'imagesOfWork'
  | 'otherInfo'
  | 'workOrders'
  | 'issues'
  | 'preventativeMaintenance';

/**
 * Customizable report template — which built-in sections appear in the
 * Daily Report. When null, DEFAULT_TEMPLATE is used.
 */
export type ReportTemplate = Partial<Record<ReportSectionKey, boolean>>;

/**
 * Sections that are free (included in the default template).
 * Only Shift Summary is free; all others require Premium.
 */
export const FREE_SECTIONS: ReportSectionKey[] = ['shiftSummary'];

/** The built-in default template: only free sections are enabled. */
export const DEFAULT_TEMPLATE: ReportTemplate = {
  shiftSummary: true,
  scopeOfWork: false,
  accomplishments: false,
  observations: false,
  actionsTaken: false,
  materials: false,
  delays: false,
  incidents: false,
  hours: false,
  notes: false,
  imagesOfWork: false,
  otherInfo: false,
  workOrders: false,
  issues: false,
  preventativeMaintenance: false,
};

/** A user-created custom field that appears in the report form, draft, and PDF. */
export interface CustomField {
  id: string;
  label: string;
  /** Optional description / hint shown in the form. */
  description?: string;
  /** Stable sort order — lower comes first. */
  order: number;
}

/** Identifies whether a field is built-in (system) or user-created (custom). */
export type FieldKind = 'system' | 'custom';

/**
 * Unified field descriptor used by the FieldBuilder to represent both
 * built-in and custom fields in a single reorderable list.
 */
export interface FieldConfig {
  id: string;
  kind: FieldKind;
  /** i18n key or raw label. For system fields, this is the i18n key. */
  labelKey?: string;
  /** Override label (when user renames a system field). */
  labelOverride?: string;
  description?: string;
  order: number;
  /** Whether the field is visible in the form. System fields that can't be deleted can be hidden. */
  visible: boolean;
  /** Whether this field can be deleted (false for required system fields). */
  deletable: boolean;
  /** Whether the label can be edited. */
  labelEditable: boolean;
  /** Whether this field requires Premium to edit. Free users see it disabled with a lock. */
  premium?: boolean;
}

/** Built-in employee field keys. */
export type EmployeeFieldKey =
  | 'name' | 'company' | 'employeeId' | 'phoneEmail'
  | 'phone' | 'email' | 'position' | 'role' | 'jobTitle'
  | 'department' | 'supervisorName' | 'supervisorEmail'
  | 'license' | 'crewName' | 'otherInfo';

/** Built-in work site field keys. */
export type WorkSiteFieldKey =
  | 'label' | 'companyClient' | 'siteAddress' | 'jobNumber' | 'pmName'
  | 'pmPhone' | 'pmEmail' | 'jobDescription'
  | 'contractNumber' | 'poNumber' | 'costCode' | 'costCenter'
  | 'buildingArea' | 'floorUnit' | 'assetNumber'
  | 'customerRep' | 'customerPhone' | 'customerEmail'
  | 'crew' | 'superintendent' | 'safetyRequirements'
  | 'siteAccessInstructions' | 'gateCode' | 'permitNumber' | 'gpsCoordinates';

/** Default employee field configs in canonical order. */
export const DEFAULT_EMPLOYEE_FIELDS: FieldConfig[] = [
  { id: 'name', kind: 'system', labelKey: 'name', order: 0, visible: true, deletable: false, labelEditable: false },
  { id: 'company', kind: 'system', labelKey: 'company', order: 1, visible: true, deletable: false, labelEditable: false },
  { id: 'employeeId', kind: 'system', labelKey: 'idNumber', order: 2, visible: true, deletable: false, labelEditable: false },
  { id: 'phone', kind: 'system', labelKey: 'phone', order: 3, visible: true, deletable: false, labelEditable: false },
  { id: 'email', kind: 'system', labelKey: 'email', order: 4, visible: true, deletable: false, labelEditable: false },
  { id: 'position', kind: 'system', labelKey: 'position', order: 5, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'role', kind: 'system', labelKey: 'role', order: 6, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'jobTitle', kind: 'system', labelKey: 'jobTitle', order: 7, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'department', kind: 'system', labelKey: 'department', order: 8, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'supervisorName', kind: 'system', labelKey: 'supervisorName', order: 9, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'supervisorEmail', kind: 'system', labelKey: 'supervisorEmail', order: 10, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'license', kind: 'system', labelKey: 'license', order: 11, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'crewName', kind: 'system', labelKey: 'crewName', order: 12, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'otherInfo', kind: 'system', labelKey: 'otherInfoOptional', order: 13, visible: false, deletable: true, labelEditable: false, premium: true },
];

/** Default work site field configs in canonical order. */
export const DEFAULT_WORKSITE_FIELDS: FieldConfig[] = [
  { id: 'label', kind: 'system', labelKey: 'workSiteName', order: 0, visible: true, deletable: false, labelEditable: false },
  { id: 'companyClient', kind: 'system', labelKey: 'companyClient', order: 1, visible: true, deletable: false, labelEditable: false },
  { id: 'siteAddress', kind: 'system', labelKey: 'siteAddress', order: 2, visible: true, deletable: false, labelEditable: false },
  { id: 'jobNumber', kind: 'system', labelKey: 'jobNumber', order: 3, visible: true, deletable: false, labelEditable: false },
  { id: 'pmName', kind: 'system', labelKey: 'pmName', order: 4, visible: true, deletable: false, labelEditable: false },
  { id: 'pmPhone', kind: 'system', labelKey: 'pmPhone', order: 5, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'pmEmail', kind: 'system', labelKey: 'pmEmail', order: 6, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'jobDescription', kind: 'system', labelKey: 'jobDescription', order: 7, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'contractNumber', kind: 'system', labelKey: 'contractNumber', order: 8, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'poNumber', kind: 'system', labelKey: 'poNumber', order: 9, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'costCode', kind: 'system', labelKey: 'costCode', order: 10, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'costCenter', kind: 'system', labelKey: 'costCenter', order: 11, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'buildingArea', kind: 'system', labelKey: 'buildingArea', order: 12, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'floorUnit', kind: 'system', labelKey: 'floorUnit', order: 13, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'assetNumber', kind: 'system', labelKey: 'assetNumber', order: 14, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'customerRep', kind: 'system', labelKey: 'customerRep', order: 15, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'customerPhone', kind: 'system', labelKey: 'customerPhone', order: 16, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'customerEmail', kind: 'system', labelKey: 'customerEmail', order: 17, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'crew', kind: 'system', labelKey: 'crewAssigned', order: 18, visible: false, deletable: true, labelEditable: false, premium: true },
  { id: 'superintendent', kind: 'system', labelKey: 'superintendent', order: 19, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'safetyRequirements', kind: 'system', labelKey: 'safetyRequirements', order: 20, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'siteAccessInstructions', kind: 'system', labelKey: 'siteAccessInstructions', order: 21, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'gateCode', kind: 'system', labelKey: 'gateCode', order: 22, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'permitNumber', kind: 'system', labelKey: 'permitNumber', order: 23, visible: false, deletable: false, labelEditable: false, premium: true },
  { id: 'gpsCoordinates', kind: 'system', labelKey: 'gpsCoordinates', order: 24, visible: false, deletable: false, labelEditable: false, premium: true },
];

/**
 * Values for a single report instance — maps field IDs (built-in section
 * keys or custom field IDs) to the text the user entered.
 */
export type ReportFieldValues = Record<string, string>;

export interface ReportImage {
  id: string;
  name: string;
  dataUrl: string;
  mimeType: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  company: string;
  employeeId: string;
  phoneEmail: string;
  phone: string;
  email: string;
  position: string;
  role: string;
  jobTitle: string;
  department: string;
  supervisorName: string;
  supervisorEmail: string;
  license: string;
  crewName: string;
  otherInfo: string;
  locale: Locale;
  /** Base64 data URL of company logo, or null if not set. */
  companyLogo: string | null;
  customFields: CustomField[];
  customFieldValues: Record<string, string>;
  /** Ordered field configurations for built-in + custom fields (Premium). */
  fieldConfigs?: FieldConfig[];
};

export interface ShiftReport {
  id: string;
  folio: string;
  /** Legacy field — kept for backwards compat, same value as reportId. */
  reportId?: string;
  workerName: string;
  company: string;
  employeeId: string;
  phoneEmail: string;
  phone: string;
  email: string;
  position: string;
  role: string;
  jobTitle: string;
  department: string;
  supervisorName: string;
  supervisorEmail: string;
  license: string;
  crewName: string;
  otherInfo: string;
  /** Built-in section values keyed by ReportSectionKey. */
  sectionValues: Partial<Record<ReportSectionKey, string>>;
  /** Custom field values keyed by CustomField.id. */
  customFieldValues: Record<string, string>;
  /** Employee custom field definitions snapshot. */
  employeeCustomFields: CustomField[];
  employeeCustomFieldValues: Record<string, string>;
  /** Work site custom field definitions snapshot. */
  workSiteCustomFields: CustomField[];
  workSiteCustomFieldValues: Record<string, string>;
  workSiteId: string | null;
  workSiteLabel: string;
  jobRef: string;
  companyClient: string;
  jobDescription: string;
  siteAddress: string;
  pmName: string;
  pmEmail: string;
  pmPhone: string;
  crew: string;
  contractNumber: string;
  poNumber: string;
  costCode: string;
  costCenter: string;
  buildingArea: string;
  floorUnit: string;
  assetNumber: string;
  customerRep: string;
  customerPhone: string;
  customerEmail: string;
  superintendent: string;
  safetyRequirements: string;
  siteAccessInstructions: string;
  gateCode: string;
  permitNumber: string;
  gpsCoordinates: string;
  images: ReportImage[];
  submittedAt: string; // ISO timestamp
  reportTemplate: ReportTemplate | null;
  customFields: CustomField[];
  /** Employee field config snapshot at time of report creation. */
  employeeFieldConfigs?: FieldConfig[];
  /** Work site field config snapshot at time of report creation. */
  workSiteFieldConfigs?: FieldConfig[];
  /** Report field config snapshot at time of report creation. */
  reportFieldConfigs?: FieldConfig[];
  /** Company logo data URL snapshot at time of report creation. */
  companyLogo: string | null;
}

/** Cached report draft — preserved when navigating away from the preview. */
export interface ReportDraft {
  employee: EmployeeProfile;
  workSite: WorkSite;
  fieldValues: ReportFieldValues;
  images: ReportImage[];
  savedAt: string;
}

/** Licensing state. */
export type LicenseTier = 'free' | 'premium';

export interface LicenseState {
  tier: LicenseTier;
  /** ISO timestamp of purchase, or null for free tier. */
  purchasedAt: string | null;
}
