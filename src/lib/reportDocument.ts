import type { ShiftReport, Locale, ReportTemplate, ReportSectionKey, CustomField } from '../types';
import { t } from './i18n';
import { isSectionEnabled, getOrderedEnabledSections } from './pipeline';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function formatDateMMDDYYYY(d: Date): string {
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`;
}

export interface FieldRow {
  label: string;
  value: string;
}

export interface ReportDocument {
  reportId: string;
  folio: string;
  dateStr: string;
  sections: { title: string; rows: FieldRow[]; body?: string }[];
  images: { name: string; dataUrl?: string }[];
  showImages: boolean;
  imagesTitle: string;
  imagesSummaryText: string;
  noImagesText: string;
  reportTitle: string;
  folioLabel: string;
  pageLabel: string;
  ofLabel: string;
  companyLogo: string | null;
}

export function buildReportDocument(
  report: ShiftReport,
  locale: Locale,
): ReportDocument {
  const tr = (k: Parameters<typeof t>[1]) => t(locale, k);
  const submitted = new Date(report.submittedAt);
  const dateStr = formatDateMMDDYYYY(submitted);
  const template: ReportTemplate | null = report.reportTemplate ?? null;

  // Determine employee field order/visibility from snapshot or defaults
  const empConfigs = report.employeeFieldConfigs ?? null;
  const empRows: FieldRow[] = [];
  const empValues: Record<string, string | undefined> = {
    name: report.workerName,
    employeeId: report.employeeId,
    company: report.company,
    phone: report.phone,
    email: report.email,
    position: report.position,
    role: report.role,
    jobTitle: report.jobTitle,
    department: report.department,
    supervisorName: report.supervisorName,
    supervisorEmail: report.supervisorEmail,
    license: report.license,
    crewName: report.crewName,
    otherInfo: report.otherInfo,
  };
  const empBuiltInKeys: string[] = ['name', 'company', 'employeeId', 'phone', 'email', 'position', 'role', 'jobTitle', 'department', 'supervisorName', 'supervisorEmail', 'license', 'crewName', 'otherInfo'];

  if (empConfigs && empConfigs.length > 0) {
    const sorted = [...empConfigs].sort((a, b) => a.order - b.order).filter((f) => f.visible);
    for (const fc of sorted) {
      if (fc.kind === 'system' && empBuiltInKeys.includes(fc.id)) {
        const val = empValues[fc.id];
        // Gate otherInfo by template visibility, matching the Final Draft logic
        if (fc.id === 'otherInfo' && !isSectionEnabled(template, 'otherInfo')) continue;
        if (val?.trim()) {
          const label = fc.labelOverride ?? tr(fc.labelKey as Parameters<typeof t>[1]);
          empRows.push({ label, value: val });
        }
      } else if (fc.kind === 'custom') {
        const val = report.employeeCustomFieldValues?.[fc.id];
        if (val?.trim()) {
          const cf = report.employeeCustomFields?.find((c) => c.id === fc.id);
          empRows.push({ label: fc.labelOverride ?? cf?.label ?? fc.id, value: val });
        }
      }
    }
  } else {
    // Fallback to original hardcoded order
    if (report.workerName) empRows.push({ label: tr('name'), value: report.workerName });
    if (report.company) empRows.push({ label: tr('company'), value: report.company });
    if (report.employeeId) empRows.push({ label: tr('idNumber'), value: report.employeeId });
    if (report.phone) empRows.push({ label: tr('phone'), value: report.phone });
    if (report.email) empRows.push({ label: tr('email'), value: report.email });
    if (report.position) empRows.push({ label: tr('positionRole'), value: report.position });
    if (report.role) empRows.push({ label: tr('role'), value: report.role });
    if (report.jobTitle) empRows.push({ label: tr('jobTitle'), value: report.jobTitle });
    if (report.department) empRows.push({ label: tr('department'), value: report.department });
    if (report.supervisorName) empRows.push({ label: tr('supervisorName'), value: report.supervisorName });
    if (report.supervisorEmail) empRows.push({ label: tr('supervisorEmail'), value: report.supervisorEmail });
    if (report.license) empRows.push({ label: tr('license'), value: report.license });
    if (report.crewName) empRows.push({ label: tr('crewName'), value: report.crewName });
    if (isSectionEnabled(template, 'otherInfo') && report.otherInfo) {
      empRows.push({ label: tr('otherInfoOptional'), value: report.otherInfo });
    }
    const empCustom = [...(report.employeeCustomFields ?? [])].sort((a, b) => a.order - b.order);
    for (const cf of empCustom) {
      const val = report.employeeCustomFieldValues?.[cf.id];
      if (val?.trim()) empRows.push({ label: cf.label, value: val });
    }
  }

  // Determine work site field order/visibility from snapshot or defaults
  const siteConfigs = report.workSiteFieldConfigs ?? null;
  const siteRows: FieldRow[] = [];
  const siteValues: Record<string, string | undefined> = {
    label: report.workSiteLabel,
    companyClient: report.companyClient,
    jobNumber: report.jobRef,
    jobDescription: report.jobDescription,
    siteAddress: report.siteAddress,
    pmName: report.pmName,
    pmPhone: report.pmPhone,
    pmEmail: report.pmEmail,
    contractNumber: report.contractNumber,
    poNumber: report.poNumber,
    costCode: report.costCode,
    costCenter: report.costCenter,
    buildingArea: report.buildingArea,
    floorUnit: report.floorUnit,
    assetNumber: report.assetNumber,
    customerRep: report.customerRep,
    customerPhone: report.customerPhone,
    customerEmail: report.customerEmail,
    crew: report.crew,
    superintendent: report.superintendent,
    safetyRequirements: report.safetyRequirements,
    siteAccessInstructions: report.siteAccessInstructions,
    gateCode: report.gateCode,
    permitNumber: report.permitNumber,
    gpsCoordinates: report.gpsCoordinates,
  };
  const siteBuiltInKeys: string[] = ['label', 'companyClient', 'jobNumber', 'siteAddress', 'pmName', 'pmPhone', 'pmEmail', 'jobDescription', 'contractNumber', 'poNumber', 'costCode', 'costCenter', 'buildingArea', 'floorUnit', 'assetNumber', 'customerRep', 'customerPhone', 'customerEmail', 'crew', 'superintendent', 'safetyRequirements', 'siteAccessInstructions', 'gateCode', 'permitNumber', 'gpsCoordinates'];

  if (siteConfigs && siteConfigs.length > 0) {
    const sorted = [...siteConfigs].sort((a, b) => a.order - b.order).filter((f) => f.visible);
    for (const fc of sorted) {
      if (fc.kind === 'system' && siteBuiltInKeys.includes(fc.id)) {
        const val = siteValues[fc.id];
        if (val?.trim()) {
          const label = fc.labelOverride ?? tr(fc.labelKey as Parameters<typeof t>[1]);
          siteRows.push({ label, value: val });
        }
      } else if (fc.kind === 'custom') {
        const val = report.workSiteCustomFieldValues?.[fc.id];
        if (val?.trim()) {
          const cf = report.workSiteCustomFields?.find((c) => c.id === fc.id);
          siteRows.push({ label: fc.labelOverride ?? cf?.label ?? fc.id, value: val });
        }
      }
    }
  } else {
    // Fallback to original hardcoded order
    if (report.workSiteLabel) siteRows.push({ label: tr('workSiteName'), value: report.workSiteLabel });
    if (report.companyClient) siteRows.push({ label: tr('companyClient'), value: report.companyClient });
    if (report.jobRef) siteRows.push({ label: tr('jobNumber'), value: report.jobRef });
    if (report.siteAddress) siteRows.push({ label: tr('siteAddress'), value: report.siteAddress });
    if (report.pmName) siteRows.push({ label: tr('pmName'), value: report.pmName });
    if (report.pmPhone) siteRows.push({ label: tr('pmPhone'), value: report.pmPhone });
    if (report.pmEmail) siteRows.push({ label: tr('pmEmail'), value: report.pmEmail });
    if (report.jobDescription) siteRows.push({ label: tr('jobDescription'), value: report.jobDescription });
    if (report.contractNumber) siteRows.push({ label: tr('contractNumber'), value: report.contractNumber });
    if (report.poNumber) siteRows.push({ label: tr('poNumber'), value: report.poNumber });
    if (report.costCode) siteRows.push({ label: tr('costCode'), value: report.costCode });
    if (report.costCenter) siteRows.push({ label: tr('costCenter'), value: report.costCenter });
    if (report.buildingArea) siteRows.push({ label: tr('buildingArea'), value: report.buildingArea });
    if (report.floorUnit) siteRows.push({ label: tr('floorUnit'), value: report.floorUnit });
    if (report.assetNumber) siteRows.push({ label: tr('assetNumber'), value: report.assetNumber });
    if (report.customerRep) siteRows.push({ label: tr('customerRep'), value: report.customerRep });
    if (report.customerPhone) siteRows.push({ label: tr('customerPhone'), value: report.customerPhone });
    if (report.customerEmail) siteRows.push({ label: tr('customerEmail'), value: report.customerEmail });
    if (report.crew) siteRows.push({ label: tr('crewAssigned'), value: report.crew });
    if (report.superintendent) siteRows.push({ label: tr('superintendent'), value: report.superintendent });
    if (report.safetyRequirements) siteRows.push({ label: tr('safetyRequirements'), value: report.safetyRequirements });
    if (report.siteAccessInstructions) siteRows.push({ label: tr('siteAccessInstructions'), value: report.siteAccessInstructions });
    if (report.gateCode) siteRows.push({ label: tr('gateCode'), value: report.gateCode });
    if (report.permitNumber) siteRows.push({ label: tr('permitNumber'), value: report.permitNumber });
    if (report.gpsCoordinates) siteRows.push({ label: tr('gpsCoordinates'), value: report.gpsCoordinates });
    const siteCustom = [...(report.workSiteCustomFields ?? [])].sort((a, b) => a.order - b.order);
    for (const cf of siteCustom) {
      const val = report.workSiteCustomFieldValues?.[cf.id];
      if (val?.trim()) siteRows.push({ label: cf.label, value: val });
    }
  }

  const sections: { title: string; rows: FieldRow[]; body?: string }[] = [
    { title: tr('employeeInformation'), rows: empRows },
    { title: tr('workSiteInformation'), rows: siteRows },
  ];

  // Built-in content sections + custom fields — interleaved in unified order
  const reportFCs = report.reportFieldConfigs ?? null;
  const orderedContent = getOrderedEnabledSections(template);
  const sortedCustom = [...(report.customFields ?? [])].sort((a, b) => a.order - b.order);

  type ContentItem = { type: 'section'; key: ReportSectionKey } | { type: 'custom'; cf: CustomField };
  const items: ContentItem[] = [
    ...orderedContent.filter((k) => k !== 'otherInfo').map((k) => ({ type: 'section' as const, key: k })),
    ...sortedCustom.map((cf) => ({ type: 'custom' as const, cf })),
  ];

  if (reportFCs) {
    const orderMap = new Map(reportFCs.map((f, i) => [f.id, i] as [string, number]));
    items.sort((a, b) => {
      const aId = a.type === 'section' ? a.key : a.cf.id;
      const bId = b.type === 'section' ? b.key : b.cf.id;
      return (orderMap.get(aId) ?? 999) - (orderMap.get(bId) ?? 999);
    });
  }

  for (const item of items) {
    if (item.type === 'section') {
      const val = report.sectionValues[item.key];
      sections.push({
        title: tr(item.key as TranslationKeyAlias),
        rows: [],
        body: val?.trim() || '—',
      });
    } else {
      const val = report.customFieldValues[item.cf.id];
      sections.push({
        title: item.cf.label,
        rows: [],
        body: val?.trim() || '—',
      });
    }
  }

  return {
    folio: report.folio,
    reportId: report.reportId ?? report.folio,
    dateStr,
    sections,
    images: report.images.map((img) => ({ name: img.name, dataUrl: img.dataUrl })),
    showImages: isSectionEnabled(template, 'imagesOfWork') || report.images.length > 0,
    imagesTitle: tr('imagesOfWork'),
    imagesSummaryText: tr('imagesAttached').replace('{count}', String(report.images.length)),
    noImagesText: tr('noImagesAttached'),
    reportTitle: tr('dailyReport'),
    folioLabel: tr('folio'),
    reportIdLabel: tr('folio'),
    pageLabel: tr('page'),
    ofLabel: tr('of'),
    companyLogo: report.companyLogo ?? null,
  };
}

type TranslationKeyAlias = Parameters<typeof t>[1];
