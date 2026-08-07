import type { Locale } from '../types';

export type TranslationKey =
  | 'appName'
  | 'tagline'
  | 'homeTitle'
  | 'createReport'
  | 'goodShift'
  | 'heyName'
  | 'back'
  | 'save'
  | 'cancel'
  | 'delete'
  | 'edit'
  | 'ok'
  | 'menu'
  | 'home'
  | 'workSites'
  | 'previousReports'
  | 'tips'
  | 'faq'
  | 'appSettings'
  | 'employeeSettings'
  | 'language'
  | 'english'
  | 'spanish'
  | 'welcome'
  | 'getStarted'
  // Employee
  | 'name'
  | 'company'
  | 'idNumber'
  | 'contactInfo'
  | 'phone'
  | 'email'
  | 'positionRole'
  | 'role'
  | 'jobTitle'
  | 'department'
  | 'supervisorName'
  | 'supervisorEmail'
  | 'license'
  | 'crewName'
  | 'otherInfo'
  | 'otherInfoHint'
  | 'otherInfoOptional'
  | 'employeeId'
  | 'position'
  | 'employeeInformation'
  | 'infoName'
  | 'infoCompany'
  | 'infoIdNumber'
  | 'infoPhoneEmail'
  | 'infoPositionRole'
  | 'infoOtherInfo'
  | 'completeEmployeeSettings'
  // Work Sites
  | 'newWorkSite'
  | 'editWorkSite'
  | 'workSiteName'
  | 'pmName'
  | 'pmPhone'
  | 'pmEmail'
  | 'siteAddress'
  | 'jobNumber'
  | 'companyClient'
  | 'jobDescription'
  | 'contractNumber'
  | 'poNumber'
  | 'costCode'
  | 'costCenter'
  | 'buildingArea'
  | 'floorUnit'
  | 'assetNumber'
  | 'customerRep'
  | 'customerPhone'
  | 'customerEmail'
  | 'crewAssigned'
  | 'superintendent'
  | 'safetyRequirements'
  | 'siteAccessInstructions'
  | 'gateCode'
  | 'permitNumber'
  | 'gpsCoordinates'
  | 'crew'
  | 'crewOptional'
  | 'companyClientLabel'
  | 'pmPhoneLabel'
  | 'contractNumberLabel'
  | 'poNumberLabel'
  | 'costCodeLabel'
  | 'costCenterLabel'
  | 'buildingAreaLabel'
  | 'floorUnitLabel'
  | 'assetNumberLabel'
  | 'customerRepLabel'
  | 'customerPhoneLabel'
  | 'customerEmailLabel'
  | 'superintendentLabel'
  | 'safetyRequirementsLabel'
  | 'siteAccessInstructionsLabel'
  | 'gateCodeLabel'
  | 'permitNumberLabel'
  | 'gpsCoordinatesLabel'
  | 'noWorkSitesYet'
  | 'createFirstWorkSite'
  | 'selectWorkSite'
  | 'selectOrCreateWorkSite'
  | 'deleteWorkSiteConfirm'
  | 'workSite'
  | 'workSiteInformation'
  | 'workSiteNotDetected'
  | 'infoWorkSiteName'
  | 'infoPmName'
  | 'infoPmEmail'
  | 'infoSiteAddress'
  | 'infoJobNumber'
  | 'infoJobDescription'
  | 'infoCrew'
  | 'pmLabel'
  | 'siteLabel'
  | 'crewLabel'
  | 'workSiteLabelShort'
  | 'jobNumberLabel'
  | 'descriptionLabel'
  // Report template
  | 'reportTemplateSetup'
  | 'reportTemplateDesc'
  | 'reportTemplateFields'
  | 'unifiedFieldListDesc'
  | 'scopeOfWork'
  | 'shiftSummary'
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
  | 'preventativeMaintenance'
  | 'restoreDefaultTemplate'
  | 'restoreDefaultTitle'
  | 'restoreDefaultMessage'
  | 'restoreDefaultConfirm'
  // Custom fields
  | 'customFields'
  | 'customFieldsDesc'
  | 'addCustomField'
  | 'customFieldName'
  | 'customFieldPlaceholder'
  | 'customFieldNameRequired'
  | 'customFieldDeleteConfirm'
  | 'noCustomFields'
  | 'customFieldsLocked'
  // Report entry
  | 'reportFields'
  | 'reportFieldsDesc'
  | 'textFormPlaceholder'
  | 'continueToPreview'
  | 'fillAtLeastOneField'
  | 'reportFormInfoTitle'
  | 'reportFormInfoBody'
  | 'reportFormInfoTemplates'
  | 'reportFormInfoReorder'
  | 'reportFormInfoSaved'
  // Preview / Final Draft
  | 'reportPreview'
  | 'finalDraft'
  | 'dailyReport'
  | 'date'
  | 'downloadPdf'
  | 'downloadComplete'
  | 'downloadFailed'
  | 'preparingReport'
  | 'saveReport'
  | 'reportSaved'
  | 'savingReport'
  | 'reportSavedPdf'
  | 'discardDraft'
  | 'discardDraftTitle'
  | 'discardDraftMessage'
  | 'draftDiscarded'
  | 'draftSaved'
  | 'draftRestored'
  | 'attachPhotos'
  | 'attachedPhotos'
  | 'photosPremiumOnly'
  | 'tapToUpgrade'
  | 'camera'
  | 'gallery'
  | 'remove'
  | 'noImagesAttached'
  | 'imagesAttached'
  | 'endOfReport'
  | 'attached'
  | 'images'
  | 'image'
  | 'photo'
  | 'photos'
  // Previous Reports
  | 'noReportsYet'
  | 'createFirstReport'
  | 'deleteReport'
  | 'deleteReportConfirm'
  | 'reportDeleted'
  | 'page'
  | 'of'
  // Premium / License
  | 'upgrade'
  | 'upgradeToPremium'
  | 'reportsLocked'
  | 'reportsLockedDesc'
  | 'upgradeTitle'
  | 'upgradeDesc'
  | 'upgradeFeature1'
  | 'upgradeFeature2'
  | 'upgradeFeature3'
  | 'upgradeFeature4'
  | 'upgradeButton'
  | 'upgradePrice'
  | 'upgradeLifetime'
  | 'upgradeSuccess'
  | 'premiumActive'
  | 'freeVersion'
  | 'premiumVersion'
  | 'premium'
  | 'workSiteLimitReached'
  | 'workSiteLimitDesc'
  | 'customFieldLimitReached'
  // Tips
  | 'tipsHowToUse'
  | 'tipsFaq'
  | 'tipsCreatingReport'
  | 'tipsSelectingSites'
  | 'tipsAddingImages'
  | 'tipsManagingSettings'
  | 'tipsEmployeeSettings'
  | 'tipsDownloadingPdf'
  | 'tipsReportTemplate'
  | 'tipsReorderFields'
  | 'tipsPreviousReports'
  | 'tipsCustomFields'
  | 'tipsCompanyLogo'
  | 'tipsLocalStorage'
  | 'tipsPremium'
  | 'tipsReportId'
  | 'tipsHowToUseDesc'
  | 'tipsFaqDesc'
  | 'tipsCreatingReportDesc'
  | 'tipsSelectingSitesDesc'
  | 'tipsAddingImagesDesc'
  | 'tipsManagingSettingsDesc'
  | 'tipsEmployeeSettingsDesc'
  | 'tipsDownloadingPdfDesc'
  | 'tipsReportTemplateDesc'
  | 'tipsReorderFieldsDesc'
  | 'tipsPreviousReportsDesc'
  | 'tipsCustomFieldsDesc'
  | 'tipsCompanyLogoDesc'
  | 'tipsLocalStorageDesc'
  | 'tipsPremiumDesc'
  | 'tipsReportIdDesc'
  | 'noEmployeeInfoYet'
  | 'completeEmployeeToContinue'
  | 'addWorkSiteToBegin'
  // FAQ
  | 'faqCreateFirstReport'
  | 'faqCreateFirstReportAns'
  | 'faqAddImages'
  | 'faqAddImagesAns'
  | 'faqChangeWorkSite'
  | 'faqChangeWorkSiteAns'
  | 'faqEditReport'
  | 'faqEditReportAns'
  | 'faqDeleteReport'
  | 'faqDeleteReportAns'
  | 'faqWhereStored'
  | 'faqWhereStoredAns'
  | 'faqCustomFields'
  | 'faqCustomFieldsAns'
  | 'faqOffline'
  | 'faqOfflineAns'
  | 'faqFreeVsPremium'
  | 'faqFreeVsPremiumAns'
  | 'faqRestoreDefaults'
  | 'faqRestoreDefaultsAns'
  | 'faqReportId'
  | 'faqReportIdAns'
  // About
  | 'aboutApp'
  | 'aboutAppDesc'
  | 'credits'
  | 'creditsDesc'
  | 'privacy'
  | 'privacyDesc'
  | 'version'
  | 'autoSaved'
  | 'autoSavedDesc'
  | 'tipLabel'
  | 'requiredField'
  | 'optional'
  // Onboarding
  | 'onboardingWelcome'
  | 'onboardingWelcomeDesc'
  | 'onboardingEmployee'
  | 'onboardingEmployeeDesc'
  | 'onboardingWorkSites'
  | 'onboardingWorkSitesDesc'
  | 'onboardingTemplates'
  | 'onboardingTemplatesDesc'
  | 'onboardingReports'
  | 'onboardingReportsDesc'
  | 'onboardingNext'
  | 'onboardingSkip'
  | 'replayOnboarding'
  // What's New
  | 'whatsNew'
  | 'whatsNewDesc'
  | 'v1Title'
  | 'v1Feature1'
  | 'v1Feature2'
  | 'v1Feature3'
  | 'v1Feature4'
  | 'v1Feature5'
  | 'v1Feature6'
  | 'v1Feature7'
  | 'v1Feature8'
  | 'v1Feature9'
  | 'v1Feature10'
  // Feedback & Contact
  | 'feedbackContact'
  | 'feedbackDesc'
  | 'contactEmail'
  | 'copyEmail'
  | 'emailCopied'
  | 'sendFeedback'
  | 'developerName'
  // Privacy Policy
  | 'privacyPolicy'
  | 'privacyPolicyIntro'
  | 'privacyPoint1'
  | 'privacyPoint2'
  | 'privacyPoint3'
  | 'privacyPoint4'
  | 'privacyPoint5'
  | 'privacyPoint6'
  | 'privacyPoint7'
  | 'privacyPlayStore'
  // Company Logo
  | 'companyLogo'
  | 'companyLogoDesc'
  | 'uploadLogo'
  | 'replaceLogo'
  | 'removeLogo'
  | 'logoPreview'
  | 'logoRemoved'
  | 'logoUploadError'
  // Report sections / template
  | 'reportSections'
  | 'employeeCustomFieldsDesc'
  | 'workSiteCustomFieldsDesc'
  // Theme
  | 'theme'
  | 'themeDesc'
  | 'themeLight'
  | 'themeDark'
  // Report ID
  | 'folio'
  | 'viewReport'
  | 'viewReportTitle'
  | 'close'
  | 'fieldBuilder'
  | 'fieldBuilderDesc'
  | 'fieldName'
  | 'fieldDescription'
  | 'fieldDescriptionHint'
  | 'fieldVisible'
  | 'fieldHidden'
  | 'showField'
  | 'hideField'
  | 'editField'
  | 'addField'
  | 'addFieldPremium'
  | 'systemField'
  | 'customField'
  | 'saveField'
  | 'fieldNameRequired'
  | 'defaultFields'
  | 'customFieldsList'
  | 'fieldManagement'
  | 'fieldManagementDesc'
  | 'fieldManagementPremiumOnly'
  | 'deleteField'
  | 'reportLoadError'
  | 'lockedFeatureDesc'
  | 'saveFailed'
  | 'helpSupport'
  | 'superAdmin'
  | 'superAdminDesc'
  | 'superAdminPasscode'
  | 'superAdminIncorrect'
  | 'superAdminAccountType'
  | 'superAdminAccountTypeDesc'
  | 'superAdminFree'
  | 'superAdminPremium'
  | 'superAdminDataPreserved'
  | 'superAdminDevOnly'
  | 'employeeProfile'
  | 'employeeProfiles'
  | 'profilesDesc'
  | 'newProfile'
  | 'newEmployeeProfile'
  | 'addProfile'
  | 'editProfile'
  | 'deleteProfile'
  | 'deleteProfileConfirm'
  | 'duplicateProfile'
  | 'duplicateProfileConfirm'
  | 'setDefaultProfile'
  | 'defaultProfile'
  | 'selectProfile'
  | 'selectProfileHint'
  | 'noProfilesYet'
  | 'createFirstProfile'
  | 'profileLimitFree'
  | 'profileNameRequired'
  | 'profilesLockedDesc'
  | 'profileDuplicated'
  | 'defaultProfileSet'
  | 'workSitesDesc'
  | 'deleteWorkSite'
  | 'duplicateWorkSite'
  | 'duplicateWorkSiteConfirm'
  | 'workSiteDuplicated'
  | 'workSiteLimitFree'
  | 'previousReportsDesc'
  | 'tipsDesc'
  | 'faqDesc'
  | 'appSettingsDesc'
  | 'privacyPolicyDesc';

type Dict = Record<TranslationKey, string>;

const en: Dict = {
  appName: 'Your Daily Report',
  tagline: 'Fast, professional field reporting',
  homeTitle: 'Daily Report',
  createReport: 'Create Report',
  goodShift: 'Good shift.',
  heyName: 'Hey, {name}',
  back: 'Back',
  save: 'Save',
  cancel: 'Cancel',
  done: 'Done',
  delete: 'Delete',
  edit: 'Edit',
  ok: 'OK',
  menu: 'Menu',
  home: 'Home',
  workSites: 'Work Sites',
  previousReports: 'Previous Reports',
  previousReportsDesc: 'View, download, or delete your saved reports.',
  tips: 'Tips',
  tipsDesc: 'Learn how to get the most out of the app.',
  faq: 'FAQ',
  faqDesc: 'Find answers to common questions.',
  appSettings: 'App Settings',
  appSettingsDesc: 'Configure language, theme, and app preferences.',
  employeeSettings: 'Employee Profiles',
  employeeProfile: 'Employee Profile',
  employeeProfiles: 'Employee Profiles',
  profilesDesc: 'Create separate profiles for different companies or roles.',
  newProfile: 'New Profile',
  newEmployeeProfile: 'New Employee Profile',
  addProfile: 'Add Employee Profile',
  editProfile: 'Edit Profile',
  deleteProfile: 'Delete Profile',
  deleteProfileConfirm: 'Delete this employee profile? This cannot be undone.',
  duplicateProfile: 'Duplicate',
  setDefaultProfile: 'Set as Default',
  defaultProfile: 'Default',
  selectProfile: 'Select Employee Profile',
  selectProfileHint: 'Choose which profile to use for this report.',
  noProfilesYet: 'No employee profiles yet.',
  createFirstProfile: 'Create your first profile',
  profileLimitFree: 'Free version allows 1 profile. Upgrade for unlimited profiles.',
  profileNameRequired: 'Name is required',
  profilesLockedDesc: 'Multiple profiles are a Premium feature. You can use 1 profile on the Free version.',
  profileDuplicated: 'Profile duplicated successfully.',
  defaultProfileSet: 'Default profile updated.',
  duplicateProfileConfirm: 'Create a copy of this profile?',
  language: 'Display Language',
  english: 'English',
  spanish: 'Español',
  welcome: 'Welcome',
  getStarted: 'Get Started',
  // Employee
  name: 'Name',
  company: 'Company',
  idNumber: 'ID / Number',
  phoneEmail: 'Phone / Email',
  contactInfo: 'Contact Info',
  phone: 'Phone',
  email: 'Email',
  positionRole: 'Position / Role',
  role: 'Role',
  jobTitle: 'Job Title',
  department: 'Department',
  supervisorName: 'Supervisor Name',
  supervisorEmail: 'Supervisor Email',
  license: 'License',
  crewName: 'Crew Name',
  otherInfo: 'Other Info',
  otherInfoHint: 'Department, trade, certification, or other details.',
  otherInfoOptional: 'Other Info (Optional)',
  employeeId: 'Employee ID',
  position: 'Position',
  employeeInformation: 'Employee Information',
  infoName: 'Enter the employee\u2019s full name as it should appear on the report.',
  infoCompany: 'Enter the company or organization the employee works for.',
  infoIdNumber: 'Enter the employee\u2019s ID or employee number for record-keeping.',
  infoPhoneEmail: 'Enter a phone number or email where the employee can be reached.',
  infoPhone: 'Enter the employee\u2019s phone number.',
  infoEmail: 'Enter the employee\u2019s email address.',
  infoPositionRole: 'Enter the employee\u2019s job title or role (e.g. Foreman, Operator).',
  infoRole: 'Enter the employee\u2019s role on the team.',
  infoJobTitle: 'Enter the employee\u2019s official job title.',
  infoDepartment: 'Enter the department the employee belongs to.',
  infoSupervisorName: 'Enter the name of the employee\u2019s supervisor.',
  infoSupervisorEmail: 'Enter the email of the employee\u2019s supervisor.',
  infoLicense: 'Enter any professional license or certification number.',
  infoCrewName: 'Enter the name of the crew the employee is assigned to.',
  infoOtherInfo: 'Optional. Add department, trade, certification, or other details.',
  completeEmployeeSettings: 'Complete Employee Settings',
  // Work Sites
  newWorkSite: 'New Work Site',
  editWorkSite: 'Edit Work Site',
  workSiteName: 'Work Site Name',
  pmName: 'Project Manager\u2019s Name',
  pmPhone: 'Project Manager\u2019s Phone',
  pmEmail: 'Project Manager\u2019s Email',
  siteAddress: 'Job Site Address',
  jobNumber: 'Job Number',
  companyClient: 'Company / Client',
  jobDescription: 'Scope of Work / Project Description',
  contractNumber: 'Contract Number',
  poNumber: 'Purchase Order (PO) Number',
  costCode: 'Cost Code',
  costCenter: 'Cost Center',
  buildingArea: 'Building / Area / Zone',
  floorUnit: 'Floor / Unit',
  assetNumber: 'Asset / Equipment Number',
  customerRep: 'Customer Representative',
  customerPhone: 'Customer Phone',
  customerEmail: 'Customer Email',
  crew: 'Crew',
  crewOptional: 'Crew (optional)',
  crewAssigned: 'Crew Assigned',
  superintendent: 'Superintendent',
  safetyRequirements: 'Safety Requirements',
  siteAccessInstructions: 'Site Access Instructions',
  gateCode: 'Gate Code',
  permitNumber: 'Permit Number',
  gpsCoordinates: 'GPS Coordinates',
  noWorkSitesYet: 'No work sites yet.',
  createFirstWorkSite: 'Create your first work site',
  selectWorkSite: 'Select Work Site',
  selectOrCreateWorkSite: 'Select or create a work site',
  deleteWorkSite: 'Delete Work Site',
  deleteWorkSiteConfirm: 'Delete this work site? This cannot be undone.',
  duplicateWorkSite: 'Duplicate',
  duplicateWorkSiteConfirm: 'Create a copy of this work site?',
  workSiteDuplicated: 'Work site duplicated successfully.',
  workSiteLimitFree: 'Free version allows 1 work site. Upgrade for unlimited work sites.',
  workSitesDesc: 'Create separate work sites for different projects or locations.',
  workSite: 'Work Site',
  workSiteInformation: 'Work Site Information',
  workSiteNotDetected: 'Select a work site',
  infoWorkSiteName: 'Enter a name to identify this work site (e.g. Riverside Tower).',
  infoPmName: 'Enter the name of the project manager responsible for this work site.',
  infoPmPhone: 'Enter the phone number of the project manager for this site.',
  infoPmEmail: 'Enter the email address of the project manager for this site.',
  infoCompanyClient: 'Enter the company or client name for this work site.',
  infoContractNumber: 'Enter the contract number for this project.',
  infoPoNumber: 'Enter the purchase order (PO) number for this project.',
  infoCostCode: 'Enter the cost code for this project.',
  infoCostCenter: 'Enter the cost center for this project.',
  infoBuildingArea: 'Enter the building, area, or zone for this site.',
  infoFloorUnit: 'Enter the floor or unit for this site.',
  infoAssetNumber: 'Enter the asset or equipment number for this site.',
  infoCustomerRep: 'Enter the name of the customer representative.',
  infoCustomerPhone: 'Enter the phone number of the customer representative.',
  infoCustomerEmail: 'Enter the email of the customer representative.',
  infoSuperintendent: 'Enter the name of the superintendent for this site.',
  infoSafetyRequirements: 'Enter any safety requirements for this site.',
  infoSiteAccessInstructions: 'Enter site access instructions for workers.',
  infoGateCode: 'Enter the gate code for site access, if any.',
  infoPermitNumber: 'Enter the permit number for this site, if any.',
  infoGpsCoordinates: 'Enter the GPS coordinates for this site.',
  infoSiteAddress: 'Enter the physical address of the job site.',
  infoJobNumber: 'Enter the job or project reference number for this work site.',
  infoJobDescription: 'Enter a short description of the work being done at this site.',
  infoCrew: 'Optional. List the crew members or teams assigned to this site.',
  pmLabel: 'Project Manager',
  pmPhoneLabel: 'PM Phone',
  siteLabel: 'Site Address',
  crewLabel: 'Crew',
  companyClientLabel: 'Company / Client',
  contractNumberLabel: 'Contract Number',
  poNumberLabel: 'PO Number',
  costCodeLabel: 'Cost Code',
  costCenterLabel: 'Cost Center',
  buildingAreaLabel: 'Building / Area',
  floorUnitLabel: 'Floor / Unit',
  assetNumberLabel: 'Asset / Equipment',
  customerRepLabel: 'Customer Rep',
  customerPhoneLabel: 'Customer Phone',
  customerEmailLabel: 'Customer Email',
  superintendentLabel: 'Superintendent',
  safetyRequirementsLabel: 'Safety Requirements',
  siteAccessInstructionsLabel: 'Site Access',
  gateCodeLabel: 'Gate Code',
  permitNumberLabel: 'Permit Number',
  gpsCoordinatesLabel: 'GPS Coordinates',
  workSiteLabelShort: 'Work Site',
  jobNumberLabel: 'Job Number',
  descriptionLabel: 'Description',
  // Report template
  reportTemplateSetup: 'Report Template Setup',
  reportTemplateDesc: 'Choose which sections appear in your Daily Report.',
  reportTemplateFields: 'Report Template Fields',
  unifiedFieldListDesc: 'All fields in one list — toggle, reorder, add, or remove.',
  scopeOfWork: 'Scope of Work',
  shiftSummary: 'Shift Summary',
  accomplishments: 'Accomplishments',
  observations: 'Observations',
  actionsTaken: 'Actions Taken',
  materials: 'Materials',
  delays: 'Delays',
  incidents: 'Incidents',
  hours: 'Hours',
  notes: 'Notes',
  imagesOfWork: 'Images of Work',
  workOrders: 'Work Orders',
  issues: 'Issues',
  preventativeMaintenance: 'Preventative Maintenance',
  restoreDefaultTemplate: 'Restore Default Template',
  restoreDefaultTitle: 'Restore Default Template?',
  restoreDefaultMessage: 'Restore default settings? This will remove custom fields and return this section to the original configuration.',
  restoreDefaultConfirm: 'Restore Defaults',
  // Custom fields
  customFields: 'Custom Fields',
  customFieldsDesc: 'Add your own fields to every Daily Report. They appear in the form, final draft, and PDF.',
  addCustomField: 'Add Custom Field',
  customFieldName: 'Field Name',
  customFieldPlaceholder: 'e.g. Weather, Equipment Used, Visitors',
  customFieldNameRequired: 'Please enter a field name.',
  customFieldDeleteConfirm: 'Delete this custom field?',
  noCustomFields: 'No custom fields yet. Add one to include it in your reports.',
  customFieldsLocked: 'Custom Fields are a Premium feature.',
  // Report entry
  reportFields: 'Daily Report Fields',
  reportFieldsDesc: 'Fill in the fields for your Daily Report below.',
  textFormPlaceholder: 'Enter details for this section\u2026',
  continueToPreview: 'Continue to Preview',
  fillAtLeastOneField: 'Please fill in at least one field to continue.',
  reportFormInfoTitle: 'About Report Fields',
  reportFormInfoBody: 'Fields shown here are controlled by App Settings \u2192 Report Template Setup. You can also add custom fields. Drag to reorder.',
  reportFormInfoTemplates: 'Enable or disable report sections in Report Template Setup.',
  reportFormInfoReorder: 'Report fields can be reordered by dragging and dropping them.',
  reportFormInfoSaved: 'Your customized order is automatically saved for future reports.',
  // Preview / Final Draft
  reportPreview: 'Report Preview',
  finalDraft: 'Final Draft',
  dailyReport: 'Daily Report',
  date: 'Date',
  downloadPdf: 'Download PDF',
  downloadComplete: 'PDF downloaded successfully.',
  downloadFailed: 'Download failed. Please try again.',
  preparingReport: 'Preparing report\u2026',
  saveReport: 'Save Report',
  reportSaved: 'Report saved locally.',
  savingReport: 'Saving report\u2026',
  reportSavedPdf: 'Report saved successfully. PDF exported to your device.',
  discardDraft: 'Discard Draft',
  discardDraftTitle: 'Discard Draft?',
  discardDraftMessage: 'This will permanently delete the current draft. This action cannot be undone.',
  draftDiscarded: 'Draft discarded.',
  draftSaved: 'Draft saved',
  draftRestored: 'Draft restored',
  attachPhotos: 'Attach Photos',
  attachedPhotos: 'Attached Photos',
  photosPremiumOnly: 'Photo attachments are a Premium feature',
  tapToUpgrade: 'Tap to upgrade',
  camera: 'Camera',
  gallery: 'Gallery',
  remove: 'Remove',
  noImagesAttached: 'No images attached.',
  imagesAttached: '{count} image(s) attached.',
  endOfReport: 'End of Report',
  attached: 'attached',
  images: 'images',
  image: 'image',
  photo: 'photo',
  photos: 'photos',
  // Previous Reports
  noReportsYet: 'No reports yet.',
  createFirstReport: 'Create your first report',
  deleteReport: 'Delete',
  deleteReportConfirm: 'Delete this report?',
  reportDeleted: 'Report deleted successfully.',
  page: 'Page',
  of: 'of',
  viewReport: 'View Report',
  viewReportTitle: 'Report',
  close: 'Close',
  fieldBuilder: 'Field Management',
  fieldBuilderDesc: 'Add, edit, rearrange, hide, or delete fields for this section.',
  fieldName: 'Field Name',
  fieldDescription: 'Description',
  fieldDescriptionHint: 'Optional hint text shown in the form.',
  fieldVisible: 'Visible',
  fieldHidden: 'Hidden',
  showField: 'Show',
  hideField: 'Hide',
  editField: 'Edit Field',
  addField: 'Add Field',
  addFieldPremium: 'Add Field (Premium)',
  systemField: 'System',
  customField: 'Custom',
  saveField: 'Save',
  fieldNameRequired: 'Please enter a field name.',
  defaultFields: 'Default Fields',
  customFieldsList: 'Custom Fields',
  fieldManagement: 'Manage Fields',
  fieldManagementDesc: 'Premium — Customize fields, order, and visibility.',
  fieldManagementPremiumOnly: 'Field customization is a Premium feature. Upgrade to add, edit, reorder, or delete fields.',
  deleteField: 'Delete Field',
  reportLoadError: 'Could not load this report. It may be corrupted or incomplete.',
  lockedFeatureDesc: 'Upgrade to Premium to customize fields, order, and visibility.',
  saveFailed: 'Failed to save. Please try again.',
  helpSupport: 'Help & Support',
  superAdmin: 'Super Admin',
  superAdminDesc: 'Development testing only',
  superAdminPasscode: 'Enter Passcode',
  superAdminIncorrect: 'Incorrect passcode',
  superAdminAccountType: 'Account Type',
  superAdminAccountTypeDesc: 'Toggle between Free and Premium for testing. No data is deleted.',
  superAdminFree: 'Free',
  superAdminPremium: 'Premium',
  superAdminDataPreserved: 'Data is preserved when switching account types.',
  superAdminDevOnly: 'For development testing only.',
  // Premium / License
  upgrade: 'Upgrade',
  upgradeToPremium: 'Upgrade to Premium',
  reportsLocked: '{count} more reports locked',
  reportsLockedDesc: 'Free plan includes the last 5 reports. Upgrade for unlimited history.',
  upgradeTitle: 'Unlock the Full App',
  upgradeDesc: 'Unlock unlimited work sites, templates, and custom fields with a one-time purchase.',
  upgradeFeature1: 'Unlimited Work Sites',
  upgradeFeature2: 'Unlimited Report Templates',
  upgradeFeature3: 'Unlimited Custom Fields',
  upgradeFeature4: 'All future premium enhancements',
  upgradeButton: 'Upgrade Now',
  upgradePrice: '$4.99',
  upgradeLifetime: 'Lifetime purchase \u2014 not a subscription',
  upgradeSuccess: 'Premium unlocked! Thank you for your purchase.',
  premiumActive: 'Premium Active',
  freeVersion: 'Free Version',
  premiumVersion: 'Premium Version',
  premium: 'Premium',
  workSiteLimitReached: 'Free version allows 1 Work Site only.',
  workSiteLimitDesc: 'Upgrade to Premium to create unlimited work sites.',
  customFieldLimitReached: 'Custom fields are a Premium feature.',
  // Tips
  tipsHowToUse: 'How to Use the App',
  tipsFaq: 'Frequently Asked Questions',
  tipsCreatingReport: 'Creating a Report',
  tipsSelectingSites: 'Selecting a Work Site',
  tipsAddingImages: 'Adding Photos of Work',
  tipsManagingSettings: 'Managing Settings',
  tipsEmployeeSettings: 'Completing Employee Settings',
  tipsDownloadingPdf: 'Downloading the PDF',
  tipsReportTemplate: 'Using Report Template Setup',
  tipsReorderFields: 'Reordering Report Fields',
  tipsPreviousReports: 'Viewing Previous Reports',
  tipsCustomFields: 'Using Custom Fields (Premium)',
  tipsCompanyLogo: 'Adding Your Company Logo',
  tipsLocalStorage: 'Local Storage',
  tipsPremium: 'Premium Features',
  tipsReportId: 'Report IDs',
  tipsHowToUseDesc: 'Complete Employee Settings, add a Work Site, customize your Report Template, then fill in your report and export a professional PDF. No internet connection required.',
  tipsFaqDesc: 'Find answers to common questions about using the app.',
  tipsCreatingReportDesc: 'Select a work site, then fill in the fields shown on the report form. Fields are controlled by your Report Template and any custom fields you have added. Fill in at least one field to continue.',
  tipsSelectingSitesDesc: 'Pick a work site before creating your report. You can create a new site from the Work Sites menu.',
  tipsAddingImagesDesc: 'On the Preview screen, use the Images of Work section to attach photos from your camera or gallery. Images are included in the downloaded PDF. Images are a Premium feature.',
  tipsManagingSettingsDesc: 'Open App Settings to configure display language, theme, and access Tips, What\u2019s New, Feedback, and Privacy Policy. Employee Settings holds your personal profile used in every report.',
  tipsEmployeeSettingsDesc: 'Fill in your name, company, ID, phone, position, and other info in Employee Settings before creating reports. These details are automatically included in every report you create.',
  tipsDownloadingPdfDesc: 'On the Preview screen, tap Download PDF to save a professionally formatted PDF to your device. You can also re-download any past report from Previous Reports.',
  tipsReportTemplateDesc: 'Open Report Template Setup to choose which sections appear in your Daily Report. Toggle sections on or off, restore defaults, and add custom fields. Only Shift Summary is included by default; all other sections require Premium.',
  tipsReorderFieldsDesc: 'In Report Template Setup, use the up and down arrows next to each section to reorder them. Your custom order is saved automatically and used every time you create a report.',
  tipsPreviousReportsDesc: 'Open Previous Reports from the menu to view, download, or delete past reports. Each report shows its Report ID for easy identification. Reports are stored locally on your device.',
  tipsCustomFieldsDesc: 'Add custom fields in Employee Settings, Work Sites, or Report Template Setup (all Premium features). Custom fields appear in the report form, final draft, and PDF. Rename, reorder, or delete them anytime.',
  tipsCompanyLogoDesc: 'Upload your company logo in Employee Settings to display it at the top of every exported PDF. Use a PNG or JPG file for best results.',
  tipsLocalStorageDesc: 'All reports, employee info, and work sites are stored locally on your device. No cloud sync or internet connection is required. Data remains on your device unless you manually delete it.',
  tipsPremiumDesc: 'Premium unlocks unlimited Work Sites, all report template sections, custom fields, and image attachments. It is a one-time lifetime purchase \u2014 not a subscription.',
  tipsReportIdDesc: 'Each report is assigned a unique Report ID automatically when created. Use it to identify and search for specific reports in Previous Reports.',
  noEmployeeInfoYet: 'No Employee Information Yet',
  completeEmployeeToContinue: 'Complete Employee Settings to continue.',
  addWorkSiteToBegin: 'Add a Work Site to begin creating reports.',
  // FAQ
  faqCreateFirstReport: 'How do I create my first Daily Report?',
  faqCreateFirstReportAns: 'Complete Employee Settings and create a Work Site. Then tap Create Report on the home screen, fill in the fields, and save.',
  faqAddImages: 'Can I add images to my report?',
  faqAddImagesAns: 'Yes. Images can be attached on the Preview screen before saving. They are included in the downloaded PDF. Images are a Premium feature.',
  faqChangeWorkSite: 'How do I change my Work Site?',
  faqChangeWorkSiteAns: 'Select a different Work Site on the home screen before creating your report.',
  faqEditReport: 'Can I edit my report after saving?',
  faqEditReportAns: 'You can edit the draft on the Preview screen before saving. Once saved, the report is finalized but can be deleted and recreated.',
  faqDeleteReport: 'How do I delete a report?',
  faqDeleteReportAns: 'Open Previous Reports, tap a report to expand it, then tap Delete to remove it from your device. Deleting reports is a Premium feature.',
  faqWhereStored: 'Where are my reports stored?',
  faqWhereStoredAns: 'Reports are stored locally on your device. No cloud sync or backend service is used. Everything works offline. Data remains on your device unless you manually delete it.',
  faqCustomFields: 'How do I add custom fields?',
  faqCustomFieldsAns: 'Go to Employee Settings, Work Sites, or Report Template Setup and tap Add Custom Field. Enter a name like Weather or Equipment Used. The field will appear in every report going forward. Custom fields are a Premium feature.',
  faqOffline: 'Does the app work offline?',
  faqOfflineAns: 'Yes. The app works completely offline. All data is stored on your device. No internet connection is needed to create, save, or export reports.',
  faqFreeVsPremium: 'What is included in the free version?',
  faqFreeVsPremiumAns: 'The free version includes 1 employee profile, 1 work site, the Shift Summary section, and up to 5 saved reports. Premium unlocks unlimited profiles, work sites, all report sections, custom fields, image attachments, and unlimited report history.',
  faqRestoreDefaults: 'How do I restore default report sections?',
  faqRestoreDefaultsAns: 'Open Report Template Setup and tap Restore Defaults. This removes any custom fields and resets all sections to their original state.',
  faqReportId: 'What is a Report ID?',
  faqReportIdAns: 'Each report is assigned a unique Report ID automatically when created. Use it to identify and search for specific reports in Previous Reports.',
  // About
  aboutApp: 'About the App',
  aboutAppDesc: 'Your Daily Report \u2014 a fast, offline tool for creating professional Daily Report PDFs.',
  credits: 'Credits',
  creditsDesc: 'Created by NVZ Technologies',
  privacy: 'Privacy',
  privacyDesc: 'Reports and employee info are stored locally on your device. No cloud sync is used. Everything works offline.',
  version: 'Version',
  autoSaved: 'Auto Saved',
  autoSavedDesc: 'Changes are saved automatically as you edit.',
  tipLabel: 'TIP',
  requiredField: 'Required field',
  optional: 'optional',
  // Onboarding
  onboardingWelcome: 'Welcome to My Daily Report',
  onboardingWelcomeDesc: 'My Daily Report helps you quickly create professional Daily Report PDFs — all offline, right from your device.',
  onboardingEmployee: 'Set Up Your Profile',
  onboardingEmployeeDesc: 'Complete Employee Settings first. Your name, company, and role are automatically included in every report.',
  onboardingWorkSites: 'Add Work Sites',
  onboardingWorkSitesDesc: 'Create one or more work sites with job numbers, addresses, and project manager details for quick reuse.',
  onboardingTemplates: 'Customize Your Reports',
  onboardingTemplatesDesc: 'Choose which sections appear in your report, add custom fields, and rearrange them to fit your workflow.',
  onboardingReports: 'Create & Export',
  onboardingReportsDesc: 'Fill in your report, review the final draft, attach photos, and export a professional PDF. Everything is stored locally on your device.',
  onboardingNext: 'Next',
  onboardingSkip: 'Skip',
  replayOnboarding: 'View Onboarding Again',
  // What's New
  whatsNew: "What's New",
  whatsNewDesc: 'Release notes and recent updates',
  v1Title: 'Version 1.0',
  v1Feature1: 'Offline Daily Report creation with professional PDF export',
  v1Feature2: 'Employee profiles with company logo support',
  v1Feature3: 'Work Site management with job numbers and project details',
  v1Feature4: 'Customizable report templates with section toggles and reordering',
  v1Feature5: 'Custom fields for Employee Settings, Work Sites, and reports (Premium)',
  v1Feature6: 'Automatic Report ID generation for every report',
  v1Feature7: 'Image attachments on the Preview screen (Premium)',
  v1Feature8: 'Reliable autosave for Employee Settings and Work Sites',
  v1Feature9: 'Bilingual support (English / Spanish)',
  v1Feature10: 'Local storage \u2014 no internet or account required',
  // Feedback & Contact
  feedbackContact: 'Feedback & Contact',
  feedbackDesc: 'Have questions or suggestions? Reach out anytime.',
  contactEmail: 'Contact Email',
  copyEmail: 'Copy Email',
  emailCopied: 'Email copied to clipboard',
  sendFeedback: 'Send Feedback',
  developerName: 'Developer',
  // Privacy Policy
  privacyPolicy: 'Privacy Policy',
  privacyPolicyDesc: 'How your data is handled and protected.',
  privacyPolicyIntro: 'Your privacy is important to us. Here is how My Daily Report handles your data:',
  privacyPoint1: 'All data is stored locally on your device. No backend servers are used.',
  privacyPoint2: 'No report content is ever transmitted over the internet.',
  privacyPoint3: 'No account is required. The app works entirely offline.',
  privacyPoint4: 'No personal information is sold or shared with third parties.',
  privacyPoint5: 'Images remain on your device and are never uploaded to any server.',
  privacyPoint6: 'The app requests only the permissions necessary for its functionality — storage for PDF export and image/logo selection.',
  privacyPoint7: 'Premium purchases are handled through Google Play when applicable. No payment information is stored by the app.',
  privacyPlayStore: 'Full Privacy Policy (Play Store)',
  // Company Logo
  companyLogo: 'Company Logo',
  companyLogoDesc: 'Upload your company logo to display it at the top of every exported PDF.',
  uploadLogo: 'Upload Logo',
  replaceLogo: 'Replace Logo',
  removeLogo: 'Remove Logo',
  logoPreview: 'Logo Preview',
  logoRemoved: 'Logo removed.',
  logoUploadError: 'Could not load image. Please use a PNG or JPG file.',
  // Report sections / template
  reportSections: 'Report Sections',
  employeeCustomFieldsDesc: 'Add custom fields to your employee profile. They appear in the Final Draft and PDF.',
  workSiteCustomFieldsDesc: 'Add custom fields to this work site. They appear in the Final Draft and PDF.',
  // Theme
  theme: 'Theme',
  themeDesc: 'Choose how the app looks. Follow System is recommended.',
  themeLight: 'Light',
  themeDark: 'Dark',
  // Report ID
  folio: 'Report ID',
};

const es: Dict = {
  appName: 'Tu Reporte Diario',
  tagline: 'Reportes de campo rápidos y profesionales',
  homeTitle: 'Reporte Diario',
  createReport: 'Crear Reporte',
  goodShift: 'Buen turno.',
  heyName: 'Hola, {name}',
  back: 'Atrás',
  save: 'Guardar',
  cancel: 'Cancelar',
  done: 'Listo',
  delete: 'Eliminar',
  edit: 'Editar',
  ok: 'OK',
  menu: 'Menú',
  home: 'Inicio',
  workSites: 'Sitios de Trabajo',
  previousReports: 'Reportes Anteriores',
  previousReportsDesc: 'Ve, descarga o elimina tus reportes guardados.',
  tips: 'Consejos',
  tipsDesc: 'Aprende a sacar el máximo provecho de la app.',
  faq: 'FAQ',
  faqDesc: 'Encuentra respuestas a preguntas comunes.',
  appSettings: 'Ajustes de la App',
  appSettingsDesc: 'Configura idioma, tema y preferencias de la app.',
  employeeSettings: 'Perfiles de Empleado',
  employeeProfile: 'Perfil de Empleado',
  employeeProfiles: 'Perfiles de Empleado',
  profilesDesc: 'Crea perfiles separados para diferentes empresas o roles.',
  newProfile: 'Nuevo Perfil',
  newEmployeeProfile: 'Nuevo Perfil de Empleado',
  addProfile: 'Agregar Perfil de Empleado',
  editProfile: 'Editar Perfil',
  deleteProfile: 'Eliminar Perfil',
  deleteProfileConfirm: '¿Eliminar este perfil de empleado? Esta acción no se puede deshacer.',
  duplicateProfile: 'Duplicar',
  setDefaultProfile: 'Establecer como Predeterminado',
  defaultProfile: 'Predeterminado',
  selectProfile: 'Seleccionar Perfil de Empleado',
  selectProfileHint: 'Elige qué perfil usar para este reporte.',
  noProfilesYet: 'Aún no hay perfiles de empleado.',
  createFirstProfile: 'Crea tu primer perfil',
  profileLimitFree: 'La versión gratuita permite 1 perfil. Actualiza para perfiles ilimitados.',
  profileNameRequired: 'El nombre es obligatorio',
  profilesLockedDesc: 'Los perfiles múltiples son una función Premium. Puedes usar 1 perfil en la versión gratuita.',
  profileDuplicated: 'Perfil duplicado con éxito.',
  defaultProfileSet: 'Perfil predeterminado actualizado.',
  duplicateProfileConfirm: '¿Crear una copia de este perfil?',
  language: 'Idioma de la Pantalla',
  english: 'English',
  spanish: 'Español',
  welcome: 'Bienvenido',
  getStarted: 'Comenzar',
  // Employee
  name: 'Nombre',
  company: 'Empresa',
  idNumber: 'ID / Número',
  phoneEmail: 'Teléfono / Correo',
  contactInfo: 'Información de Contacto',
  phone: 'Teléfono',
  email: 'Correo',
  positionRole: 'Cargo / Rol',
  role: 'Rol',
  jobTitle: 'Título del Puesto',
  department: 'Departamento',
  supervisorName: 'Nombre del Supervisor',
  supervisorEmail: 'Correo del Supervisor',
  license: 'Licencia',
  crewName: 'Nombre de la Cuadrilla',
  otherInfo: 'Otra Información',
  otherInfoHint: 'Departamento, oficio, certificación u otros detalles.',
  otherInfoOptional: 'Otra Información (Opcional)',
  employeeId: 'ID de Empleado',
  position: 'Cargo',
  employeeInformation: 'Información del Empleado',
  infoName: 'Ingresa el nombre completo del empleado tal como debe aparecer en el reporte.',
  infoCompany: 'Ingresa la empresa u organización para la que trabaja el empleado.',
  infoIdNumber: 'Ingresa el ID o número de empleado para el registro.',
  infoPhoneEmail: 'Ingresa un teléfono o correo donde se pueda localizar al empleado.',
  infoPhone: 'Ingresa el número de teléfono del empleado.',
  infoEmail: 'Ingresa el correo electrónico del empleado.',
  infoPositionRole: 'Ingresa el cargo o rol del empleado (p. ej. Capataz, Operador).',
  infoRole: 'Ingresa el rol del empleado en el equipo.',
  infoJobTitle: 'Ingresa el título oficial del puesto del empleado.',
  infoDepartment: 'Ingresa el departamento al que pertenece el empleado.',
  infoSupervisorName: 'Ingresa el nombre del supervisor del empleado.',
  infoSupervisorEmail: 'Ingresa el correo del supervisor del empleado.',
  infoLicense: 'Ingresa cualquier número de licencia o certificación profesional.',
  infoCrewName: 'Ingresa el nombre de la cuadrilla asignada al empleado.',
  infoOtherInfo: 'Opcional. Agrega departamento, oficio, certificación u otros detalles.',
  completeEmployeeSettings: 'Completar Ajustes de Empleado',
  // Work Sites
  newWorkSite: 'Nuevo Sitio de Trabajo',
  editWorkSite: 'Editar Sitio de Trabajo',
  workSiteName: 'Nombre del Sitio de Trabajo',
  pmName: 'Nombre del Gerente de Proyecto',
  pmPhone: 'Teléfono del Gerente de Proyecto',
  pmEmail: 'Correo del Gerente de Proyecto',
  siteAddress: 'Dirección del Sitio de Trabajo',
  jobNumber: 'Número de Trabajo',
  companyClient: 'Empresa / Cliente',
  jobDescription: 'Alcance del Trabajo / Descripción del Proyecto',
  contractNumber: 'Número de Contrato',
  poNumber: 'Número de Orden de Compra (OC)',
  costCode: 'Código de Costo',
  costCenter: 'Centro de Costo',
  buildingArea: 'Edificio / Área / Zona',
  floorUnit: 'Piso / Unidad',
  assetNumber: 'Número de Activo / Equipo',
  customerRep: 'Representante del Cliente',
  customerPhone: 'Teléfono del Cliente',
  customerEmail: 'Correo del Cliente',
  crew: 'Cuadrilla',
  crewOptional: 'Cuadrilla (opcional)',
  crewAssigned: 'Cuadrilla Asignada',
  superintendent: 'Superintendente',
  safetyRequirements: 'Requisitos de Seguridad',
  siteAccessInstructions: 'Instrucciones de Acceso al Sitio',
  gateCode: 'Código de Acceso',
  permitNumber: 'Número de Permiso',
  gpsCoordinates: 'Coordenadas GPS',
  noWorkSitesYet: 'Aún no hay sitios de trabajo.',
  createFirstWorkSite: 'Crea tu primer sitio de trabajo',
  selectWorkSite: 'Seleccionar Sitio',
  selectOrCreateWorkSite: 'Selecciona o crea un sitio de trabajo',
  deleteWorkSite: 'Eliminar Sitio de Trabajo',
  deleteWorkSiteConfirm: '¿Eliminar este sitio de trabajo? Esta acción no se puede deshacer.',
  duplicateWorkSite: 'Duplicar',
  duplicateWorkSiteConfirm: '¿Crear una copia de este sitio de trabajo?',
  workSiteDuplicated: 'Sitio de trabajo duplicado con éxito.',
  workSiteLimitFree: 'La versión gratuita permite 1 sitio de trabajo. Actualiza para sitios ilimitados.',
  workSitesDesc: 'Crea sitios separados para diferentes proyectos o ubicaciones.',
  workSite: 'Sitio de Trabajo',
  workSiteInformation: 'Información del Sitio de Trabajo',
  workSiteNotDetected: 'Selecciona un sitio de trabajo',
  infoWorkSiteName: 'Ingresa un nombre para identificar este sitio (p. ej. Riverside Tower).',
  infoPmName: 'Ingresa el nombre del gerente de proyecto responsable de este sitio.',
  infoPmPhone: 'Ingresa el teléfono del gerente de proyecto para este sitio.',
  infoPmEmail: 'Ingresa el correo del gerente de proyecto para este sitio.',
  infoCompanyClient: 'Ingresa el nombre de la empresa o cliente para este sitio.',
  infoContractNumber: 'Ingresa el número de contrato para este proyecto.',
  infoPoNumber: 'Ingresa el número de orden de compra (OC) para este proyecto.',
  infoCostCode: 'Ingresa el código de costo para este proyecto.',
  infoCostCenter: 'Ingresa el centro de costo para este proyecto.',
  infoBuildingArea: 'Ingresa el edificio, área o zona para este sitio.',
  infoFloorUnit: 'Ingresa el piso o unidad para este sitio.',
  infoAssetNumber: 'Ingresa el número de activo o equipo para este sitio.',
  infoCustomerRep: 'Ingresa el nombre del representante del cliente.',
  infoCustomerPhone: 'Ingresa el teléfono del representante del cliente.',
  infoCustomerEmail: 'Ingresa el correo del representante del cliente.',
  infoSuperintendent: 'Ingresa el nombre del superintendente para este sitio.',
  infoSafetyRequirements: 'Ingresa los requisitos de seguridad para este sitio.',
  infoSiteAccessInstructions: 'Ingresa las instrucciones de acceso al sitio para los trabajadores.',
  infoGateCode: 'Ingresa el código de acceso al sitio, si hay.',
  infoPermitNumber: 'Ingresa el número de permiso para este sitio, si hay.',
  infoGpsCoordinates: 'Ingresa las coordenadas GPS para este sitio.',
  infoSiteAddress: 'Ingresa la dirección física del sitio.',
  infoJobNumber: 'Ingresa el número de referencia del trabajo o proyecto para este sitio.',
  infoJobDescription: 'Ingresa una breve descripción del trabajo que se realiza en este sitio.',
  infoCrew: 'Opcional. Lista los miembros de la cuadrilla o equipos asignados a este sitio.',
  pmLabel: 'Gerente de Proyecto',
  pmPhoneLabel: 'Teléfono del GP',
  siteLabel: 'Dirección del Sitio',
  crewLabel: 'Cuadrilla',
  companyClientLabel: 'Empresa / Cliente',
  contractNumberLabel: 'Número de Contrato',
  poNumberLabel: 'Orden de Compra',
  costCodeLabel: 'Código de Costo',
  costCenterLabel: 'Centro de Costo',
  buildingAreaLabel: 'Edificio / Área',
  floorUnitLabel: 'Piso / Unidad',
  assetNumberLabel: 'Activo / Equipo',
  customerRepLabel: 'Rep. del Cliente',
  customerPhoneLabel: 'Teléfono del Cliente',
  customerEmailLabel: 'Correo del Cliente',
  superintendentLabel: 'Superintendente',
  safetyRequirementsLabel: 'Requisitos de Seguridad',
  siteAccessInstructionsLabel: 'Acceso al Sitio',
  gateCodeLabel: 'Código de Acceso',
  permitNumberLabel: 'Número de Permiso',
  gpsCoordinatesLabel: 'Coordenadas GPS',
  workSiteLabelShort: 'Sitio de Trabajo',
  jobNumberLabel: 'Número de Trabajo',
  descriptionLabel: 'Descripción',
  // Report template
  reportTemplateSetup: 'Configurar Plantilla de Reporte',
  reportTemplateDesc: 'Elige qué secciones aparecen en tu Reporte Diario.',
  reportTemplateFields: 'Campos de Plantilla de Reporte',
  unifiedFieldListDesc: 'Todos los campos en una lista — activa, reordena, agrega o elimina.',
  scopeOfWork: 'Alcance del Trabajo',
  shiftSummary: 'Resumen del Turno',
  accomplishments: 'Logros',
  observations: 'Observaciones',
  actionsTaken: 'Acciones Tomadas',
  materials: 'Materiales',
  delays: 'Retrasos',
  incidents: 'Incidentes',
  hours: 'Horas',
  notes: 'Notas',
  imagesOfWork: 'Imágenes del Trabajo',
  workOrders: 'Órdenes de Trabajo',
  issues: 'Problemas',
  preventativeMaintenance: 'Mantenimiento Preventivo',
  restoreDefaultTemplate: 'Restaurar Plantilla Predeterminada',
  restoreDefaultTitle: '¿Restaurar Plantilla Predeterminada?',
  restoreDefaultMessage: 'Restaurar la configuración predeterminada? Esto eliminará los campos personalizados y devolverá esta sección a la configuración original.',
  restoreDefaultConfirm: 'Restaurar Predeterminados',
  // Custom fields
  customFields: 'Campos Personalizados',
  customFieldsDesc: 'Agrega tus propios campos a cada Reporte Diario. Aparecen en el formulario, borrador final y PDF.',
  addCustomField: 'Agregar Campo Personalizado',
  customFieldName: 'Nombre del Campo',
  customFieldPlaceholder: 'p. ej. Clima, Equipo Usado, Visitantes',
  customFieldNameRequired: 'Por favor ingresa un nombre de campo.',
  customFieldDeleteConfirm: '¿Eliminar este campo personalizado?',
  noCustomFields: 'No hay campos personalizados. Agrega uno para incluirlo en tus reportes.',
  customFieldsLocked: 'Los Campos Personalizados son una función Premium.',
  // Report entry
  reportFields: 'Campos del Reporte Diario',
  reportFieldsDesc: 'Completa los campos de tu Reporte Diario a continuación.',
  textFormPlaceholder: 'Ingresa los detalles para esta sección\u2026',
  continueToPreview: 'Continuar a Vista Previa',
  fillAtLeastOneField: 'Por favor completa al menos un campo para continuar.',
  reportFormInfoTitle: 'Acerca de los Campos de Reporte',
  reportFormInfoBody: 'Los campos mostrados se controlan desde Ajustes de la App \u2192 Configurar Plantilla de Reporte. También puedes agregar campos personalizados. Arrastra para reordenar.',
  reportFormInfoTemplates: 'Activa o desactiva secciones de reporte en Configurar Plantilla de Reporte.',
  reportFormInfoReorder: 'Los campos de reporte se pueden reordenar arrastrándolos.',
  reportFormInfoSaved: 'Tu orden personalizado se guarda automáticamente para reportes futuros.',
  // Preview / Final Draft
  reportPreview: 'Vista Previa del Reporte',
  finalDraft: 'Borrador Final',
  dailyReport: 'Reporte Diario',
  date: 'Fecha',
  downloadPdf: 'Descargar PDF',
  downloadComplete: 'PDF descargado exitosamente.',
  downloadFailed: 'Descarga fallida. Inténtalo de nuevo.',
  preparingReport: 'Preparando reporte\u2026',
  saveReport: 'Guardar Reporte',
  reportSaved: 'Reporte guardado localmente.',
  savingReport: 'Guardando reporte\u2026',
  reportSavedPdf: 'Reporte guardado exitosamente. PDF exportado a tu dispositivo.',
  discardDraft: 'Descartar Borrador',
  discardDraftTitle: '¿Descartar Borrador?',
  discardDraftMessage: 'Esto eliminará permanentemente el borrador actual. Esta acción no se puede deshacer.',
  draftDiscarded: 'Borrador descartado.',
  draftSaved: 'Borrador guardado',
  draftRestored: 'Borrador restaurado',
  attachPhotos: 'Adjuntar Fotos',
  attachedPhotos: 'Fotos Adjuntas',
  photosPremiumOnly: 'Adjuntar fotos es una función Premium',
  tapToUpgrade: 'Toca para actualizar',
  camera: 'Cámara',
  gallery: 'Galería',
  remove: 'Quitar',
  noImagesAttached: 'Sin imágenes adjuntas.',
  imagesAttached: '{count} imagen(es) adjunta(s).',
  endOfReport: 'Fin del Reporte',
  attached: 'adjuntas',
  images: 'imágenes',
  image: 'imagen',
  photo: 'foto',
  photos: 'fotos',
  // Previous Reports
  noReportsYet: 'Aún no hay reportes.',
  createFirstReport: 'Crea tu primer reporte',
  deleteReport: 'Eliminar',
  deleteReportConfirm: '¿Eliminar este reporte?',
  reportDeleted: 'Reporte eliminado exitosamente.',
  page: 'Página',
  of: 'de',
  viewReport: 'Ver Reporte',
  viewReportTitle: 'Reporte',
  close: 'Cerrar',
  fieldBuilder: 'Gestión de Campos',
  fieldBuilderDesc: 'Agrega, edita, reordena, oculta o elimina campos de esta sección.',
  fieldName: 'Nombre del Campo',
  fieldDescription: 'Descripción',
  fieldDescriptionHint: 'Texto de ayuda opcional mostrado en el formulario.',
  fieldVisible: 'Visible',
  fieldHidden: 'Oculto',
  showField: 'Mostrar',
  hideField: 'Ocultar',
  editField: 'Editar Campo',
  addField: 'Agregar Campo',
  addFieldPremium: 'Agregar Campo (Premium)',
  systemField: 'Sistema',
  customField: 'Personalizado',
  saveField: 'Guardar',
  fieldNameRequired: 'Por favor ingresa un nombre de campo.',
  defaultFields: 'Campos Predeterminados',
  customFieldsList: 'Campos Personalizados',
  fieldManagement: 'Gestionar Campos',
  fieldManagementDesc: 'Premium — Personaliza campos, orden y visibilidad.',
  fieldManagementPremiumOnly: 'La personalización de campos es una función Premium. Actualiza para agregar, editar, reordenar o eliminar campos.',
  deleteField: 'Eliminar Campo',
  reportLoadError: 'No se pudo cargar este reporte. Puede estar dañado o incompleto.',
  lockedFeatureDesc: 'Actualiza a Premium para personalizar campos, orden y visibilidad.',
  saveFailed: 'Error al guardar. Inténtalo de nuevo.',
  helpSupport: 'Ayuda y Soporte',
  superAdmin: 'Super Admin',
  superAdminDesc: 'Solo para pruebas de desarrollo',
  superAdminPasscode: 'Ingresa la Contraseña',
  superAdminIncorrect: 'Contraseña incorrecta',
  superAdminAccountType: 'Tipo de Cuenta',
  superAdminAccountTypeDesc: 'Cambia entre Gratis y Premium para pruebas. No se eliminan datos.',
  superAdminFree: 'Gratis',
  superAdminPremium: 'Premium',
  superAdminDataPreserved: 'Los datos se conservan al cambiar el tipo de cuenta.',
  superAdminDevOnly: 'Solo para pruebas de desarrollo.',
  // Premium / License
  upgrade: 'Actualizar',
  upgradeToPremium: 'Actualizar a Premium',
  reportsLocked: '{count} reportes más bloqueados',
  reportsLockedDesc: 'El plan gratuito incluye los últimos 5 reportes. Actualiza para historial ilimitado.',
  upgradeTitle: 'Desbloquea la App Completa',
  upgradeDesc: 'Desbloquea sitios de trabajo, plantillas y campos personalizados ilimitados con una sola compra.',
  upgradeFeature1: 'Sitios de Trabajo Ilimitados',
  upgradeFeature2: 'Plantillas de Reporte Ilimitadas',
  upgradeFeature3: 'Campos Personalizados Ilimitados',
  upgradeFeature4: 'Todas las futuras funciones premium',
  upgradeButton: 'Actualizar Ahora',
  upgradePrice: '$4.99',
  upgradeLifetime: 'Compra única \u2014 no es suscripción',
  upgradeSuccess: '¡Premium desbloqueado! Gracias por tu compra.',
  premiumActive: 'Premium Activo',
  freeVersion: 'Versión Gratuita',
  premiumVersion: 'Versión Premium',
  premium: 'Premium',
  workSiteLimitReached: 'La versión gratuita permite 1 Sitio de Trabajo solamente.',
  workSiteLimitDesc: 'Actualiza a Premium para crear sitios de trabajo ilimitados.',
  customFieldLimitReached: 'Los campos personalizados son una función Premium.',
  // Tips
  tipsHowToUse: 'Cómo Usar la App',
  tipsFaq: 'Preguntas Frecuentes',
  tipsCreatingReport: 'Crear un Reporte',
  tipsSelectingSites: 'Seleccionar un Sitio de Trabajo',
  tipsAddingImages: 'Agregar Fotos del Trabajo',
  tipsManagingSettings: 'Gestionar Ajustes',
  tipsEmployeeSettings: 'Completar Ajustes de Empleado',
  tipsDownloadingPdf: 'Descargar el PDF',
  tipsReportTemplate: 'Usar Configuración de Plantilla',
  tipsReorderFields: 'Reordenar Campos de Reporte',
  tipsPreviousReports: 'Ver Reportes Anteriores',
  tipsCustomFields: 'Usar Campos Personalizados (Premium)',
  tipsCompanyLogo: 'Agregar el Logo de tu Empresa',
  tipsLocalStorage: 'Almacenamiento Local',
  tipsPremium: 'Funciones Premium',
  tipsReportId: 'IDs de Reporte',
  tipsHowToUseDesc: 'Completa los Ajustes de Empleado, agrega un Sitio de Trabajo, personaliza tu Plantilla de Reporte, luego completa tu reporte y exporta un PDF profesional. No se necesita conexión a internet.',
  tipsFaqDesc: 'Encuentra respuestas a preguntas comunes sobre el uso de la app.',
  tipsCreatingReportDesc: 'Selecciona un sitio de trabajo, luego completa los campos mostrados en el formulario. Los campos se controlan con tu Plantilla de Reporte y los campos personalizados que hayas agregado. Completa al menos un campo para continuar.',
  tipsSelectingSitesDesc: 'Elige un sitio de trabajo antes de crear tu reporte. Puedes crear un sitio nuevo desde el menú Sitios de Trabajo.',
  tipsAddingImagesDesc: 'En la pantalla de Vista Previa, usa la sección Imágenes del Trabajo para adjuntar fotos de tu cámara o galería. Las imágenes se incluyen en el PDF descargado. Las imágenes son una función Premium.',
  tipsManagingSettingsDesc: 'Abre Ajustes de la App para configurar idioma, tema y acceder a Consejos, Novedades, Comentarios y Política de Privacidad. Ajustes de Empleado contiene tu perfil personal usado en cada reporte.',
  tipsEmployeeSettingsDesc: 'Completa tu nombre, empresa, ID, teléfono, posición y otra info en Ajustes de Empleado antes de crear reportes. Estos datos se incluyen automáticamente en cada reporte que creas.',
  tipsDownloadingPdfDesc: 'En la pantalla de Vista Previa, toca Descargar PDF para guardar un PDF con formato profesional en tu dispositivo. También puedes volver a descargar cualquier reporte anterior desde Reportes Anteriores.',
  tipsReportTemplateDesc: 'Abre Configurar Plantilla de Reporte para elegir qué secciones aparecen en tu Reporte Diario. Activa o desactiva secciones, restaura valores predeterminados y agrega campos personalizados. Solo Resumen del Turno está incluido por defecto; las demás secciones requieren Premium.',
  tipsReorderFieldsDesc: 'En Configurar Plantilla de Reporte, usa las flechas arriba y abajo junto a cada sección para reordenarlas. Tu orden personalizado se guarda automáticamente y se usa cada vez que creas un reporte.',
  tipsPreviousReportsDesc: 'Abre Reportes Anteriores desde el menú para ver, descargar o eliminar reportes pasados. Cada reporte muestra su ID de Reporte para fácil identificación. Los reportes se guardan localmente en tu dispositivo.',
  tipsCustomFieldsDesc: 'Agrega campos personalizados en Ajustes de Empleado, Sitios de Trabajo o Configurar Plantilla de Reporte (todas funciones Premium). Los campos personalizados aparecen en el formulario, borrador final y PDF. Renombra, reordena o elimínalos cuando quieras.',
  tipsCompanyLogoDesc: 'Sube el logo de tu empresa en Ajustes de Empleado para mostrarlo en la parte superior de cada PDF exportado. Usa un archivo PNG o JPG para mejores resultados.',
  tipsLocalStorageDesc: 'Todos los reportes, información de empleado y sitios de trabajo se guardan localmente en tu dispositivo. Sin sincronización en la nube ni conexión a internet. Los datos permanecen en tu dispositivo a menos que los elimines manualmente.',
  tipsPremiumDesc: 'Premium desbloquea Sitios de Trabajo ilimitados, todas las secciones de plantilla de reporte, campos personalizados y adjuntos de imágenes. Es una compra única de por vida \u2014 no es suscripción.',
  tipsReportIdDesc: 'Cada reporte recibe un ID de Reporte único automáticamente al crearse. Úsalo para identificar y buscar reportes específicos en Reportes Anteriores.',
  noEmployeeInfoYet: 'Sin Información de Empleado',
  completeEmployeeToContinue: 'Completa los Ajustes de Empleado para continuar.',
  addWorkSiteToBegin: 'Agrega un Sitio de Trabajo para empezar a crear reportes.',
  // FAQ
  faqCreateFirstReport: '¿Cómo creo mi primer Reporte Diario?',
  faqCreateFirstReportAns: 'Completa los Ajustes de Empleado y crea un Sitio de Trabajo. Luego toca Crear Reporte en la pantalla principal, completa los campos y guarda.',
  faqAddImages: '¿Puedo agregar imágenes a mi reporte?',
  faqAddImagesAns: 'Sí. Las imágenes se pueden adjuntar en la pantalla de Vista Previa antes de guardar. Se incluyen en el PDF descargado. Las imágenes son una función Premium.',
  faqChangeWorkSite: '¿Cómo cambio mi Sitio de Trabajo?',
  faqChangeWorkSiteAns: 'Selecciona un Sitio de Trabajo diferente en la pantalla principal antes de crear tu reporte.',
  faqEditReport: '¿Puedo editar mi reporte después de guardarlo?',
  faqEditReportAns: 'Puedes editar el borrador en la pantalla de Vista Previa antes de guardarlo. Una vez guardado, el reporte se finaliza pero se puede eliminar y recrear.',
  faqDeleteReport: '¿Cómo elimino un reporte?',
  faqDeleteReportAns: 'Abre Reportes Anteriores, toca un reporte para expandirlo, luego toca Eliminar para quitarlo de tu dispositivo. Eliminar reportes es una función Premium.',
  faqWhereStored: '¿Dónde se guardan mis reportes?',
  faqWhereStoredAns: 'Los reportes se guardan localmente en tu dispositivo. Sin sincronización en la nube ni servicio backend. Todo funciona sin conexión. Los datos permanecen en tu dispositivo a menos que los elimines manualmente.',
  faqCustomFields: '¿Cómo agrego campos personalizados?',
  faqCustomFieldsAns: 'Ve a Ajustes de Empleado, Sitios de Trabajo o Configurar Plantilla de Reporte y toca Agregar Campo Personalizado. Ingresa un nombre como Clima o Equipo Usado. El campo aparecerá en cada reporte. Los campos personalizados son una función Premium.',
  faqOffline: '¿La app funciona sin conexión?',
  faqOfflineAns: 'Sí. La app funciona completamente sin conexión. Todos los datos se guardan en tu dispositivo. No se necesita internet para crear, guardar o exportar reportes.',
  faqFreeVsPremium: '¿Qué incluye la versión gratuita?',
  faqFreeVsPremiumAns: 'La versión gratuita incluye 1 perfil de empleado, 1 sitio de trabajo, la sección Resumen del Turno y hasta 5 reportes guardados. Premium desbloquea perfiles ilimitados, sitios de trabajo, todas las secciones de reporte, campos personalizados, adjuntos de imágenes e historial ilimitado de reportes.',
  faqRestoreDefaults: '¿Cómo restauro las secciones predeterminadas?',
  faqRestoreDefaultsAns: 'Abre Configurar Plantilla de Reporte y toca Restaurar Predeterminados. Esto elimina los campos personalizados y reinicia todas las secciones a su estado original.',
  faqReportId: '¿Qué es un ID de Reporte?',
  faqReportIdAns: 'Cada reporte recibe un ID de Reporte único automáticamente al crearse. Úsalo para identificar y buscar reportes específicos en Reportes Anteriores.',
  // About
  aboutApp: 'Acerca de la App',
  aboutAppDesc: 'Tu Reporte Diario \u2014 una herramienta rápida y sin conexión para crear PDFs profesionales de Reportes Diarios.',
  credits: 'Créditos',
  creditsDesc: 'Creado por NVZ Technologies',
  privacy: 'Privacidad',
  privacyDesc: 'Los reportes y la información del empleado se guardan localmente en tu dispositivo. No se usa sincronización en la nube. Todo funciona sin conexión.',
  version: 'Versión',
  autoSaved: 'Guardado Automático',
  autoSavedDesc: 'Los cambios se guardan automáticamente al editar.',
  tipLabel: 'CONSEJO',
  requiredField: 'Campo requerido',
  optional: 'opcional',
  // Onboarding
  onboardingWelcome: 'Bienvenido a Mi Reporte Diario',
  onboardingWelcomeDesc: 'Mi Reporte Diario te ayuda a crear rápidamente PDFs profesionales de Reportes Diarios — todo sin conexión, desde tu dispositivo.',
  onboardingEmployee: 'Configura Tu Perfil',
  onboardingEmployeeDesc: 'Completa primero los Ajustes de Empleado. Tu nombre, empresa y cargo se incluyen automáticamente en cada reporte.',
  onboardingWorkSites: 'Agrega Sitios de Trabajo',
  onboardingWorkSitesDesc: 'Crea uno o más sitios de trabajo con números de trabajo, direcciones y datos del gerente de proyecto para reutilizarlos rápidamente.',
  onboardingTemplates: 'Personaliza Tus Reportes',
  onboardingTemplatesDesc: 'Elige qué secciones aparecen en tu reporte, agrega campos personalizados y reordénalos para tu flujo de trabajo.',
  onboardingReports: 'Crea y Exporta',
  onboardingReportsDesc: 'Completa tu reporte, revisa el borrador final, adjunta fotos y exporta un PDF profesional. Todo se guarda localmente en tu dispositivo.',
  onboardingNext: 'Siguiente',
  onboardingSkip: 'Omitir',
  replayOnboarding: 'Ver Onboarding de Nuevo',
  // What's New
  whatsNew: 'Novedades',
  whatsNewDesc: 'Notas de versión y actualizaciones recientes',
  v1Title: 'Versión 1.0',
  v1Feature1: 'Creación de Reportes Diarios sin conexión con exportación profesional de PDF',
  v1Feature2: 'Perfiles de empleado con soporte de logo de empresa',
  v1Feature3: 'Gestión de Sitios de Trabajo con números de trabajo y datos del proyecto',
  v1Feature4: 'Plantillas de reporte personalizables con activación de secciones y reordenamiento',
  v1Feature5: 'Campos personalizados para Ajustes de Empleado, Sitios y reportes (Premium)',
  v1Feature6: 'Generación automática de ID de Reporte para cada reporte',
  v1Feature7: 'Adjuntos de imágenes en la pantalla de Vista Previa (Premium)',
  v1Feature8: 'Guardado automático confiable para Ajustes de Empleado y Sitios de Trabajo',
  v1Feature9: 'Soporte bilingüe (Inglés / Español)',
  v1Feature10: 'Almacenamiento local \u2014 sin internet ni cuenta requerida',
  // Feedback & Contact
  feedbackContact: 'Comentarios y Contacto',
  feedbackDesc: '¿Tienes preguntas o sugerencias? Escríbenos cuando quieras.',
  contactEmail: 'Correo de Contacto',
  copyEmail: 'Copiar Correo',
  emailCopied: 'Correo copiado al portapapeles',
  sendFeedback: 'Enviar Comentarios',
  developerName: 'Desarrollador',
  // Privacy Policy
  privacyPolicy: 'Política de Privacidad',
  privacyPolicyDesc: 'Cómo se manejan y protegen tus datos.',
  privacyPolicyIntro: 'Tu privacidad es importante para nosotros. Así es como Mi Reporte Diario maneja tus datos:',
  privacyPoint1: 'Todos los datos se guardan localmente en tu dispositivo. No se usan servidores backend.',
  privacyPoint2: 'Ningún contenido de reporte se transmite por internet.',
  privacyPoint3: 'No se requiere cuenta. La app funciona completamente sin conexión.',
  privacyPoint4: 'No se vende ni comparte información personal con terceros.',
  privacyPoint5: 'Las imágenes permanecen en tu dispositivo y nunca se suben a ningún servidor.',
  privacyPoint6: 'La app solicita solo los permisos necesarios \u2014 almacenamiento para exportar PDF y seleccionar imágenes/logos.',
  privacyPoint7: 'Las compras Premium se gestionan a través de Google Play cuando aplica. La app no almacena información de pago.',
  privacyPlayStore: 'Política de Privacidad Completa (Play Store)',
  // Company Logo
  companyLogo: 'Logo de Empresa',
  companyLogoDesc: 'Sube el logo de tu empresa para mostrarlo en la parte superior de cada PDF exportado.',
  uploadLogo: 'Subir Logo',
  replaceLogo: 'Reemplazar Logo',
  removeLogo: 'Quitar Logo',
  logoPreview: 'Vista Previa del Logo',
  logoRemoved: 'Logo eliminado.',
  logoUploadError: 'No se pudo cargar la imagen. Usa un archivo PNG o JPG.',
  // Report sections / template
  reportSections: 'Secciones de Reporte',
  employeeCustomFieldsDesc: 'Agrega campos personalizados a tu perfil de empleado. Aparecen en el Borrador Final y PDF.',
  workSiteCustomFieldsDesc: 'Agrega campos personalizados a este sitio. Aparecen en el Borrador Final y PDF.',
  // Theme
  theme: 'Tema',
  themeDesc: 'Elige cómo se ve la app. Seguir Sistema es recomendado.',
  themeLight: 'Claro',
  themeDark: 'Oscuro',
  // Report ID
  folio: 'ID de Reporte',
};

const DICTS: Record<Locale, Dict> = { en, es };

export function detectLocale(): Locale {
  const stored = localStorage.getItem('ydr-locale');
  if (stored === 'en' || stored === 'es') return stored;
  const nav = (navigator.language || 'en').toLowerCase();
  return nav.startsWith('es') ? 'es' : 'en';
}

export function t(locale: Locale, key: TranslationKey, vars?: Record<string, string>): string {
  let s = DICTS[locale][key] ?? DICTS.en[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, v);
    }
  }
  return s;
}
