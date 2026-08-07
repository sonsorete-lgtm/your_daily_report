import type { ReportImage, ShiftReport, WorkSite, EmployeeProfile, ReportTemplate, ReportSectionKey, CustomField, FieldConfig, Locale } from '../types';
import { t } from './i18n';
import { DEFAULT_TEMPLATE, FREE_SECTIONS } from '../types';
import { storage } from './storage';

export function isSectionEnabled(template: ReportTemplate | null | undefined, key: ReportSectionKey): boolean {
  const effective = template ?? DEFAULT_TEMPLATE;
  return effective[key] === true;
}

/** Content sections in the canonical order (Shift Summary first). */
export const CONTENT_SECTIONS: ReportSectionKey[] = [
  'shiftSummary',
  'scopeOfWork',
  'accomplishments',
  'observations',
  'actionsTaken',
  'materials',
  'delays',
  'incidents',
  'hours',
  'notes',
  'workOrders',
  'issues',
  'preventativeMaintenance',
];

/** Extract up to two initials from a name, e.g. "John Doe" → "JD". */
function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'XX';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/** Generate a unique Report ID: YDR_<EmpInitials>_<SiteInitials>_<YYYYMMDD>_<NN> */
export function generateReportId(employeeName: string, workSiteLabel: string, existingIds: string[]): string {
  const empInit = initialsFrom(employeeName);
  const siteInit = initialsFrom(workSiteLabel);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;

  const prefix = `YDR_${empInit}_${siteInit}_${dateStr}_`;
  const usedSeqs = new Set<number>();
  for (const id of existingIds) {
    if (id.startsWith(prefix)) {
      const seq = parseInt(id.slice(prefix.length), 10);
      if (!isNaN(seq)) usedSeqs.add(seq);
    }
  }

  let seq = 1;
  while (usedSeqs.has(seq)) seq++;
  if (seq > 99) seq = 1; // wrap at 99
  return `${prefix}${pad(seq)}`;
}

/** Generate a unique folio number: YDR-000001, YDR-000002, etc. */
export function generateFolio(): string {
  const counter = storage.getFolioCounter() + 1;
  storage.setFolioCounter(counter);
  return `YDR-${String(counter).padStart(6, '0')}`;
}

/** Get the ordered list of enabled content sections, respecting saved section order.
 *  When isPremium is false, premium-only sections are filtered out. */
export function getOrderedEnabledSections(template: ReportTemplate | null, isPremium: boolean = true): ReportSectionKey[] {
  const enabled = CONTENT_SECTIONS.filter((k) => isSectionEnabled(template, k) && (isPremium || FREE_SECTIONS.includes(k)));
  const savedOrder = storage.getSectionOrder();
  if (!savedOrder) return enabled;
  const orderMap = new Map(savedOrder.map((id, i) => [id, i]));
  return [...enabled].sort((a, b) => {
    const ai = orderMap.get(a) ?? 999;
    const bi = orderMap.get(b) ?? 999;
    return ai - bi;
  });
}

/** Get the ordered list of all content sections for template setup, respecting saved order. */
export function getOrderedAllSections(): ReportSectionKey[] {
  const savedOrder = storage.getSectionOrder();
  if (!savedOrder) return CONTENT_SECTIONS;
  const orderMap = new Map(savedOrder.map((id, i) => [id, i]));
  const ordered = [...CONTENT_SECTIONS].sort((a, b) => {
    const ai = orderMap.get(a) ?? 999;
    const bi = orderMap.get(b) ?? 999;
    return ai - bi;
  });
  const missing = CONTENT_SECTIONS.filter((s) => !ordered.includes(s));
  return [...ordered, ...missing];
}

export function generateFinalDraft(input: {
  employee: EmployeeProfile;
  workSite: WorkSite;
  fieldValues: Record<string, string>;
  images: ReportImage[];
  date: Date;
  folio: string;
  locale: Locale;
  reportTemplate?: ReportTemplate | null;
  customFields: CustomField[];
  employeeFieldConfigs?: FieldConfig[] | null;
  workSiteFieldConfigs?: FieldConfig[] | null;
  reportFieldConfigs?: FieldConfig[] | null;
}): string {
  const { employee, workSite, fieldValues, images, date, folio, locale, reportTemplate, customFields, employeeFieldConfigs, workSiteFieldConfigs, reportFieldConfigs } = input;
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateStr = `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;

  const lines: string[] = [];

  lines.push(tr('dailyReport').toUpperCase());
  lines.push(`${tr('folio')}: ${folio}`);
  lines.push(dateStr);
  lines.push('');

  // Employee Information
  lines.push(tr('employeeInformation').toUpperCase());
  const empRows: string[] = [];
  const empConfigs = employeeFieldConfigs ?? null;
  const empBuiltInKeys: string[] = ['name', 'company', 'employeeId', 'phone', 'email', 'position', 'role', 'jobTitle', 'department', 'supervisorName', 'supervisorEmail', 'license', 'crewName', 'otherInfo'];

  if (empConfigs && empConfigs.length > 0) {
    const sortedEmp = [...empConfigs].sort((a, b) => a.order - b.order).filter((f) => f.visible);
    for (const fc of sortedEmp) {
      if (fc.kind === 'system' && empBuiltInKeys.includes(fc.id)) {
        // Gate otherInfo by template visibility, matching the fallback logic
        if (fc.id === 'otherInfo' && !isSectionEnabled(reportTemplate, 'otherInfo')) continue;
        const val = (employee as Record<string, unknown>)[fc.id] as string | undefined;
        if (val?.trim()) {
          const label = fc.labelOverride ?? (fc.labelKey ? tr(fc.labelKey as Parameters<typeof t>[1]) : fc.id);
          empRows.push(`${label}: ${val}`);
        }
      } else if (fc.kind === 'custom') {
        const val = employee.customFieldValues?.[fc.id];
        if (val?.trim()) {
          const cf = employee.customFields?.find((c) => c.id === fc.id);
          empRows.push(`${fc.labelOverride ?? cf?.label ?? fc.id}: ${val}`);
        }
      }
    }
  } else {
    if (employee.name) empRows.push(`${tr('name')}: ${employee.name}`);
    if (employee.company) empRows.push(`${tr('company')}: ${employee.company}`);
    if (employee.employeeId) empRows.push(`${tr('idNumber')}: ${employee.employeeId}`);
    if (employee.phone) empRows.push(`${tr('phone')}: ${employee.phone}`);
    if (employee.email) empRows.push(`${tr('email')}: ${employee.email}`);
    if (employee.position) empRows.push(`${tr('positionRole')}: ${employee.position}`);
    if (employee.role) empRows.push(`${tr('role')}: ${employee.role}`);
    if (employee.jobTitle) empRows.push(`${tr('jobTitle')}: ${employee.jobTitle}`);
    if (employee.department) empRows.push(`${tr('department')}: ${employee.department}`);
    if (employee.supervisorName) empRows.push(`${tr('supervisorName')}: ${employee.supervisorName}`);
    if (employee.supervisorEmail) empRows.push(`${tr('supervisorEmail')}: ${employee.supervisorEmail}`);
    if (employee.license) empRows.push(`${tr('license')}: ${employee.license}`);
    if (employee.crewName) empRows.push(`${tr('crewName')}: ${employee.crewName}`);
    if (isSectionEnabled(reportTemplate, 'otherInfo') && employee.otherInfo) {
      empRows.push(`${tr('otherInfoOptional')}: ${employee.otherInfo}`);
    }
    const empCustomSorted = [...(employee.customFields ?? [])].sort((a, b) => a.order - b.order);
    for (const cf of empCustomSorted) {
      const val = employee.customFieldValues?.[cf.id];
      if (val?.trim()) empRows.push(`${cf.label}: ${val}`);
    }
  }
  lines.push(empRows.length ? empRows.join('\n') : '—');
  lines.push('');

  // Work Site Information
  lines.push(tr('workSiteInformation').toUpperCase());
  const siteRows: string[] = [];
  const siteConfigs = workSiteFieldConfigs ?? null;
  const siteBuiltInKeys: string[] = ['label', 'companyClient', 'jobNumber', 'siteAddress', 'pmName', 'pmPhone', 'pmEmail', 'jobDescription', 'contractNumber', 'poNumber', 'costCode', 'costCenter', 'buildingArea', 'floorUnit', 'assetNumber', 'customerRep', 'customerPhone', 'customerEmail', 'crew', 'superintendent', 'safetyRequirements', 'siteAccessInstructions', 'gateCode', 'permitNumber', 'gpsCoordinates'];

  if (siteConfigs && siteConfigs.length > 0) {
    const sortedSite = [...siteConfigs].sort((a, b) => a.order - b.order).filter((f) => f.visible);
    for (const fc of sortedSite) {
      if (fc.kind === 'system' && siteBuiltInKeys.includes(fc.id)) {
        const val = (workSite as Record<string, unknown>)[fc.id] as string | undefined;
        if (val?.trim()) {
          const label = fc.labelOverride ?? (fc.labelKey ? tr(fc.labelKey as Parameters<typeof t>[1]) : fc.id);
          siteRows.push(`${label}: ${val}`);
        }
      } else if (fc.kind === 'custom') {
        const val = workSite.customFieldValues?.[fc.id];
        if (val?.trim()) {
          const cf = workSite.customFields?.find((c) => c.id === fc.id);
          siteRows.push(`${fc.labelOverride ?? cf?.label ?? fc.id}: ${val}`);
        }
      }
    }
  } else {
    if (workSite.label) siteRows.push(`${tr('workSiteName')}: ${workSite.label}`);
    if (workSite.companyClient) siteRows.push(`${tr('companyClient')}: ${workSite.companyClient}`);
    if (workSite.jobNumber) siteRows.push(`${tr('jobNumber')}: ${workSite.jobNumber}`);
    if (workSite.siteAddress) siteRows.push(`${tr('siteAddress')}: ${workSite.siteAddress}`);
    if (workSite.pmName) siteRows.push(`${tr('pmName')}: ${workSite.pmName}`);
    if (workSite.pmPhone) siteRows.push(`${tr('pmPhone')}: ${workSite.pmPhone}`);
    if (workSite.pmEmail) siteRows.push(`${tr('pmEmail')}: ${workSite.pmEmail}`);
    if (workSite.jobDescription) siteRows.push(`${tr('jobDescription')}: ${workSite.jobDescription}`);
    if (workSite.contractNumber) siteRows.push(`${tr('contractNumber')}: ${workSite.contractNumber}`);
    if (workSite.poNumber) siteRows.push(`${tr('poNumber')}: ${workSite.poNumber}`);
    if (workSite.costCode) siteRows.push(`${tr('costCode')}: ${workSite.costCode}`);
    if (workSite.costCenter) siteRows.push(`${tr('costCenter')}: ${workSite.costCenter}`);
    if (workSite.buildingArea) siteRows.push(`${tr('buildingArea')}: ${workSite.buildingArea}`);
    if (workSite.floorUnit) siteRows.push(`${tr('floorUnit')}: ${workSite.floorUnit}`);
    if (workSite.assetNumber) siteRows.push(`${tr('assetNumber')}: ${workSite.assetNumber}`);
    if (workSite.customerRep) siteRows.push(`${tr('customerRep')}: ${workSite.customerRep}`);
    if (workSite.customerPhone) siteRows.push(`${tr('customerPhone')}: ${workSite.customerPhone}`);
    if (workSite.customerEmail) siteRows.push(`${tr('customerEmail')}: ${workSite.customerEmail}`);
    if (workSite.crew) siteRows.push(`${tr('crewAssigned')}: ${workSite.crew}`);
    if (workSite.superintendent) siteRows.push(`${tr('superintendent')}: ${workSite.superintendent}`);
    if (workSite.safetyRequirements) siteRows.push(`${tr('safetyRequirements')}: ${workSite.safetyRequirements}`);
    if (workSite.siteAccessInstructions) siteRows.push(`${tr('siteAccessInstructions')}: ${workSite.siteAccessInstructions}`);
    if (workSite.gateCode) siteRows.push(`${tr('gateCode')}: ${workSite.gateCode}`);
    if (workSite.permitNumber) siteRows.push(`${tr('permitNumber')}: ${workSite.permitNumber}`);
    if (workSite.gpsCoordinates) siteRows.push(`${tr('gpsCoordinates')}: ${workSite.gpsCoordinates}`);
    const siteCustomSorted = [...(workSite.customFields ?? [])].sort((a, b) => a.order - b.order);
    for (const cf of siteCustomSorted) {
      const val = workSite.customFieldValues?.[cf.id];
      if (val?.trim()) siteRows.push(`${cf.label}: ${val}`);
    }
  }
  lines.push(siteRows.length ? siteRows.join('\n') : '—');
  lines.push('');

  // Content sections + custom fields — interleaved in unified order
  const orderedContent = getOrderedEnabledSections(reportTemplate);
  const sortedCustom = [...customFields].sort((a, b) => a.order - b.order);

  // Build a merged ordered list: each entry is either a section key or a custom field
  type Item = { type: 'section'; key: ReportSectionKey } | { type: 'custom'; cf: CustomField };
  const reportFCs = reportFieldConfigs ?? [];
  const unifiedOrderMap = new Map(reportFCs.map((f, i) => [f.id, i] as [string, number]));

  const items: Item[] = [
    ...orderedContent.filter((k) => k !== 'otherInfo').map((k) => ({ type: 'section' as const, key: k })),
    ...sortedCustom.map((cf) => ({ type: 'custom' as const, cf })),
  ];

  // Sort items by their position in the unified field config list
  items.sort((a, b) => {
    const aId = a.type === 'section' ? a.key : a.cf.id;
    const bId = b.type === 'section' ? b.key : b.cf.id;
    const ai = unifiedOrderMap.get(aId) ?? 999;
    const bi = unifiedOrderMap.get(bId) ?? 999;
    return ai - bi;
  });

  for (const item of items) {
    if (item.type === 'section') {
      lines.push(tr(item.key as Parameters<typeof t>[1]).toUpperCase());
      lines.push(fieldValues[item.key]?.trim() || '—');
    } else {
      lines.push(item.cf.label.toUpperCase());
      lines.push(fieldValues[item.cf.id]?.trim() || '—');
    }
    lines.push('');
  }

  // Images of Work
  if (isSectionEnabled(reportTemplate, 'imagesOfWork') || images.length > 0) {
    lines.push(tr('imagesOfWork').toUpperCase());
    if (images.length > 0) {
      images.forEach((img, i) => {
        lines.push(`[Image ${i + 1}] ${img.name}`);
      });
      lines.push('');
      lines.push(tr('imagesAttached').replace('{count}', String(images.length)));
    } else {
      lines.push(tr('noImagesAttached'));
    }
    lines.push('');
  }

  lines.push(tr('endOfReport'));
  return lines.join('\n');
}

export function buildReport(input: {
  employee: EmployeeProfile;
  workSite: WorkSite;
  fieldValues: Record<string, string>;
  images: ReportImage[];
  folio: string;
  reportTemplate: ReportTemplate | null;
  customFields: CustomField[];
  employeeFieldConfigs?: FieldConfig[] | null;
  workSiteFieldConfigs?: FieldConfig[] | null;
  reportFieldConfigs?: FieldConfig[] | null;
}): ShiftReport {
  const now = new Date();
  const { employee, workSite, fieldValues, images, folio, reportTemplate, customFields, employeeFieldConfigs, workSiteFieldConfigs, reportFieldConfigs } = input;

  const sectionValues: Partial<Record<ReportSectionKey, string>> = {};
  for (const key of CONTENT_SECTIONS) {
    if (fieldValues[key] !== undefined) {
      sectionValues[key] = fieldValues[key];
    }
  }

  const customFieldValues: Record<string, string> = {};
  for (const cf of customFields) {
    if (fieldValues[cf.id] !== undefined) {
      customFieldValues[cf.id] = fieldValues[cf.id];
    }
  }

  return {
    id: Math.random().toString(36).slice(2, 10),
    folio,
    reportId: folio,
    workerName: employee.name || 'Unassigned',
    company: employee.company || '',
    employeeId: employee.employeeId || '',
    phoneEmail: employee.phoneEmail || '',
    phone: employee.phone || '',
    email: employee.email || '',
    position: employee.position || '',
    role: employee.role || '',
    jobTitle: employee.jobTitle || '',
    department: employee.department || '',
    supervisorName: employee.supervisorName || '',
    supervisorEmail: employee.supervisorEmail || '',
    license: employee.license || '',
    crewName: employee.crewName || '',
    otherInfo: employee.otherInfo || '',
    sectionValues,
    customFieldValues,
    employeeCustomFields: employee.customFields ?? [],
    employeeCustomFieldValues: employee.customFieldValues ?? {},
    employeeFieldConfigs: employeeFieldConfigs ?? employee.fieldConfigs ?? null,
    workSiteCustomFields: workSite.customFields ?? [],
    workSiteCustomFieldValues: workSite.customFieldValues ?? {},
    workSiteFieldConfigs: workSiteFieldConfigs ?? workSite.fieldConfigs ?? null,
    reportFieldConfigs: reportFieldConfigs ?? null,
    workSiteId: workSite.id,
    workSiteLabel: workSite.label,
    jobRef: workSite.jobNumber,
    companyClient: workSite.companyClient || '',
    jobDescription: workSite.jobDescription || '',
    siteAddress: workSite.siteAddress,
    pmName: workSite.pmName,
    pmEmail: workSite.pmEmail,
    pmPhone: workSite.pmPhone || '',
    crew: workSite.crew,
    contractNumber: workSite.contractNumber || '',
    poNumber: workSite.poNumber || '',
    costCode: workSite.costCode || '',
    costCenter: workSite.costCenter || '',
    buildingArea: workSite.buildingArea || '',
    floorUnit: workSite.floorUnit || '',
    assetNumber: workSite.assetNumber || '',
    customerRep: workSite.customerRep || '',
    customerPhone: workSite.customerPhone || '',
    customerEmail: workSite.customerEmail || '',
    superintendent: workSite.superintendent || '',
    safetyRequirements: workSite.safetyRequirements || '',
    siteAccessInstructions: workSite.siteAccessInstructions || '',
    gateCode: workSite.gateCode || '',
    permitNumber: workSite.permitNumber || '',
    gpsCoordinates: workSite.gpsCoordinates || '',
    images,
    submittedAt: now.toISOString(),
    reportTemplate,
    customFields,
    companyLogo: employee.companyLogo ?? null,
  };
}
