export type IncidentDatePrecision = 'exact' | 'approximate' | 'unknown';

export type CaseStatus =
  | 'Active — Preserving Evidence'
  | 'Ready for Review'
  | 'Archived'
  | 'Draft';

export interface CaseRecord {
  id: string;
  title: string;
  category: string;
  description: string;
  incidentDateType: IncidentDatePrecision;
  incidentDate: string;
  platform: string;
  account: string;
  notes: string;
  createdDate: string;
  status: CaseStatus;
  isDemo?: boolean;
}

export type EvidenceType = 'image' | 'pdf' | 'text' | 'document';

export interface EvidenceItem {
  id: string;
  caseId: string;
  originalFilename: string;
  mimeType: string;
  evidenceType: EvidenceType;
  sizeBytes: number;
  uploadedAt: string;
  sha256Hash: string;
  isOriginal: true;
  contentText: string;
  previewDataUrl?: string;
  exifMetadata?: Record<string, string>;
  ocrStatus: 'not_applicable' | 'ready' | 'extracted' | 'unavailable';
  ocrRawText?: string;
  ocrCorrectedText?: string;
  ocrUpdatedAt?: string;
  lastVerifiedAt: string;
  verificationStatus: 'verified' | 'pending';
}

export interface RedactedDerivative {
  id: string;
  caseId: string;
  originalEvidenceId: string;
  originalFilename: string;
  derivativeFilename: string;
  createdAt: string;
  redactionType: 'text' | 'image';
  redactedContentText?: string;
  redactedPreviewDataUrl?: string;
  redactedFindingsCount: number;
  sha256Hash: string;
  notes: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  datePrecision: IncidentDatePrecision;
  eventDate: string;
  eventTime?: string;
  title: string;
  platform: string;
  account: string;
  userEnteredFact: string;
  sourceUrl?: string;
  linkedEvidenceIds: string[];
  systemMetadataNote: string;
  createdAt: string;
}

export type PrivacyFindingType =
  | 'Phone Number'
  | 'Email Address'
  | 'URL / Web Link'
  | 'Social Handle'
  | 'Address-like Information'
  | 'PIN / Postal Code'
  | 'Bank-Account-like Number'
  | 'Aadhaar-like Pattern'
  | 'Location / GPS Metadata';

export interface PrivacyFinding {
  id: string;
  caseId: string;
  evidenceId: string;
  evidenceFilename: string;
  findingType: PrivacyFindingType;
  maskedPreview: string;
  rawValue: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  locationDescription: string;
  recommendedAction: string;
}

export type SafeActionState = 'Suggested' | 'User selected' | 'Completed';

export interface SafeActionItem {
  id: string;
  caseId: string;
  category:
    | 'Evidence Preservation'
    | 'Account & Device Hygiene'
    | 'Platform Controls'
    | 'Reporting & Support'
    | 'Personal Safety';
  title: string;
  calmGuidance: string;
  whySuggested: string;
  state: SafeActionState;
  userNote?: string;
  updatedAt?: string;
}

export interface ShareAccessEvent {
  id: string;
  timestamp: string;
  event: string;
  actorNote: string;
}

export interface SharePackage {
  id: string;
  caseId: string;
  shareToken: string;
  recipientDescription: string;
  includedEvidenceIds: string[];
  includedDerivativeIds: string[];
  permissions: 'view_only' | 'view_and_download';
  createdAt: string;
  expiresAt: string;
  status: 'Active' | 'Expired' | 'Revoked';
  revokedAt?: string;
  privacyWarningAcknowledged: boolean;
  accessLog: ShareAccessEvent[];
}

export type ComplaintStatus =
  | 'Prepared'
  | 'Submitted'
  | 'Acknowledged'
  | 'Additional information requested'
  | 'Under review'
  | 'Resolved'
  | 'Closed'
  | 'Unknown';

export interface ComplaintUpdate {
  id: string;
  date: string;
  status: ComplaintStatus;
  note: string;
}

export interface ComplaintRecord {
  id: string;
  caseId: string;
  authority: string;
  referenceNumber: string;
  submissionDate: string;
  status: ComplaintStatus;
  notes: string;
  updates: ComplaintUpdate[];
}

export interface AuditEvent {
  id: string;
  caseId?: string;
  timestamp: string;
  action: string;
  details: string;
}

export interface AppSettings {
  demoMode: boolean;
  language: 'en' | 'hi';
  autoPrivacyScanOnUpload: boolean;
  defaultMaskSensitivePreviews: boolean;
  retentionDays: 'local_until_cleared' | '30_days' | '90_days';
  calmNotificationsOnly: boolean;
  safetyCheckCompleted: boolean;
  authenticatedUserName: string;
  authenticatedMode: 'demo' | 'local_private' | null;
}
