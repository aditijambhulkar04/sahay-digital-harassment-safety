import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addLedgerEntry } from '../services/evidenceLedger';
import {
  DEMO_CASE_ID,
  INITIAL_DEMO_AUDIT_LOGS,
  INITIAL_DEMO_CASES,
  INITIAL_DEMO_COMPLAINTS,
  INITIAL_DEMO_DERIVATIVES,
  INITIAL_DEMO_EVIDENCE,
  INITIAL_DEMO_SAFE_ACTIONS,
  INITIAL_DEMO_SHARES,
  INITIAL_DEMO_TIMELINE,
} from '../data/demoData';
import {
  AppSettings,
  AuditEvent,
  CaseRecord,
  ComplaintRecord,
  ComplaintStatus,
  EvidenceItem,
  PrivacyFinding,
  RedactedDerivative,
  SafeActionItem,
  SafeActionState,
  SharePackage,
  TimelineEvent,
} from '../types/sahay';
import {
  computeSHA256,
  generateSecureToken,
  scanEvidenceForPrivacyRisks,
} from '../utils/cryptoAndPrivacy';

const STORAGE_KEY = 'sahay_prototype_vault_v1';

const DEFAULT_SETTINGS: AppSettings = {
  demoMode: true,
  language: 'en',
  autoPrivacyScanOnUpload: true,
  defaultMaskSensitivePreviews: true,
  retentionDays: 'local_until_cleared',
  calmNotificationsOnly: true,
  safetyCheckCompleted: false,
  authenticatedUserName: 'Ananya S. (Fictional Demo Profile)',
  authenticatedMode: 'demo',
};

interface SahayContextValue {
  cases: CaseRecord[];
  evidence: EvidenceItem[];
  derivatives: RedactedDerivative[];
  timeline: TimelineEvent[];
  privacyFindings: PrivacyFinding[];
  safeActions: SafeActionItem[];
  shares: SharePackage[];
  complaints: ComplaintRecord[];
  auditLogs: AuditEvent[];
  settings: AppSettings;
  activeCaseId: string;
  setActiveCaseId: (id: string) => void;
  addCase: (
    data: Omit<CaseRecord, 'id' | 'createdDate'>
  ) => CaseRecord;
  updateCaseStatus: (caseId: string, status: CaseRecord['status']) => void;
  updateCaseNotes: (caseId: string, notes: string) => void;
  addEvidence: (
    item: Omit<
      EvidenceItem,
      'id' | 'uploadedAt' | 'isOriginal' | 'lastVerifiedAt' | 'verificationStatus'
    >
  ) => EvidenceItem;
  verifyEvidenceIntegrity: (
    evidenceId: string
  ) => Promise<{ matches: boolean; computedHash: string; storedHash: string }>;
  saveCorrectedOcrText: (evidenceId: string, correctedText: string) => void;
  addRedactedDerivative: (
    item: Omit<RedactedDerivative, 'id' | 'createdAt' | 'sha256Hash'>
  ) => Promise<RedactedDerivative>;
  addTimelineEvent: (
    event: Omit<TimelineEvent, 'id' | 'createdAt' | 'systemMetadataNote'>
  ) => TimelineEvent;
  updateSafeAction: (
    actionId: string,
    state: SafeActionState,
    userNote?: string
  ) => void;
  createSharePackage: (
    data: Omit<
      SharePackage,
      'id' | 'shareToken' | 'createdAt' | 'status' | 'accessLog'
    >
  ) => SharePackage;
  revokeSharePackage: (shareId: string) => void;
  simulateShareExpire: (shareId: string) => void;
  recordShareView: (shareId: string, note?: string) => void;
  addComplaint: (
    complaint: Omit<ComplaintRecord, 'id' | 'updates'>
  ) => ComplaintRecord;
  addComplaintUpdate: (
    complaintId: string,
    status: ComplaintStatus,
    note: string
  ) => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetDemoVault: () => void;
  clearAllData: () => void;
  logAuditEvent: (action: string, details: string, caseId?: string) => void;
}

const SahayContext = createContext<SahayContextValue | undefined>(undefined);

function getDefaultSafeActionsForNewCase(caseId: string): SafeActionItem[] {
  return [
    {
      id: `sa_${caseId}_1`,
      caseId,
      category: 'Evidence Preservation',
      title: 'Preserve the original evidence before altering or deleting threads',
      calmGuidance:
        'Suggested next step: Upload unedited screenshots, exports, or documents so a SHA-256 integrity hash is recorded immediately.',
      whySuggested: 'Standard preservation step for every new case.',
      state: 'Suggested',
    },
    {
      id: `sa_${caseId}_2`,
      caseId,
      category: 'Account & Device Hygiene',
      title: 'Review account security, change password if appropriate, and enable MFA',
      calmGuidance:
        'Consider updating your password and turning on app-based multi-factor authentication on your primary email and social accounts.',
      whySuggested: 'Helps protect your accounts against unauthorized access.',
      state: 'Suggested',
    },
    {
      id: `sa_${caseId}_3`,
      caseId,
      category: 'Account & Device Hygiene',
      title: 'Review active sessions and connected devices',
      calmGuidance:
        'Review logged-in devices in your email and social media settings and sign out of any unfamiliar sessions.',
      whySuggested: 'Ensures no unauthorized session remains active.',
      state: 'Suggested',
    },
    {
      id: `sa_${caseId}_4`,
      caseId,
      category: 'Platform Controls',
      title: 'Review privacy settings and consider blocking or reporting on the platform',
      calmGuidance:
        'After saving evidence, consider restricting who can contact or tag you, and consider using the platform’s built-in reporting tools.',
      whySuggested: 'Reduces unwanted contact while keeping your preserved evidence safe.',
      state: 'Suggested',
    },
    {
      id: `sa_${caseId}_5`,
      caseId,
      category: 'Reporting & Support',
      title: 'Prepare a structured report and review official reporting options',
      calmGuidance:
        'Consider compiling a structured report in Sahay and reviewing the Official Reporting Preparation guide if you choose to escalate.',
      whySuggested: 'Organizes your timeline and hashes in one calm document.',
      state: 'Suggested',
    },
    {
      id: `sa_${caseId}_6`,
      caseId,
      category: 'Personal Safety',
      title: 'If immediate danger exists, seek emergency help',
      calmGuidance:
        'If you ever feel in immediate physical danger, consider reaching out to a trusted person or calling emergency services (112).',
      whySuggested: 'Your physical safety always comes first.',
      state: 'Suggested',
    },
  ];
}

export const SahayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cases, setCases] = useState<CaseRecord[]>(INITIAL_DEMO_CASES);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_DEMO_EVIDENCE);
  const [derivatives, setDerivatives] = useState<RedactedDerivative[]>(INITIAL_DEMO_DERIVATIVES);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(INITIAL_DEMO_TIMELINE);
  const [safeActions, setSafeActions] = useState<SafeActionItem[]>(INITIAL_DEMO_SAFE_ACTIONS);
  const [shares, setShares] = useState<SharePackage[]>(INITIAL_DEMO_SHARES);
  const [complaints, setComplaints] = useState<ComplaintRecord[]>(INITIAL_DEMO_COMPLAINTS);
  const [auditLogs, setAuditLogs] = useState<AuditEvent[]>(INITIAL_DEMO_AUDIT_LOGS);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [activeCaseId, setActiveCaseId] = useState<string>(DEMO_CASE_ID);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.cases) && parsed.cases.length > 0) {
          setCases(parsed.cases);
          setEvidence(parsed.evidence || []);
          setDerivatives(parsed.derivatives || []);
          setTimeline(parsed.timeline || []);
          setSafeActions(parsed.safeActions || []);
          setShares(parsed.shares || []);
          setComplaints(parsed.complaints || []);
          setAuditLogs(parsed.auditLogs || []);
          setSettings({ ...DEFAULT_SETTINGS, ...(parsed.settings || {}) });
          setActiveCaseId(parsed.activeCaseId || parsed.cases[0].id);
        }
      }
    } catch {
      // Fallback to initial demo state
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          cases,
          evidence,
          derivatives,
          timeline,
          safeActions,
          shares,
          complaints,
          auditLogs,
          settings,
          activeCaseId,
        })
      );
    } catch {
      // Ignore quota errors in local storage
    }
  }, [
    hydrated,
    cases,
    evidence,
    derivatives,
    timeline,
    safeActions,
    shares,
    complaints,
    auditLogs,
    settings,
    activeCaseId,
  ]);

  // Deterministically compute privacy findings across all evidence items
  const privacyFindings = useMemo(() => {
    return evidence.flatMap((ev) => scanEvidenceForPrivacyRisks(ev));
  }, [evidence]);

  const logAuditEvent = (action: string, details: string, caseId?: string) => {
    const newEvent: AuditEvent = {
      id: generateSecureToken('aud', 6),
      caseId,
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setAuditLogs((prev) => [newEvent, ...prev]);
  };

  const addCase = (data: Omit<CaseRecord, 'id' | 'createdDate'>): CaseRecord => {
    const id = `case-${Date.now().toString(36)}`;
    const newCase: CaseRecord = {
      ...data,
      id,
      createdDate: new Date().toISOString(),
    };
    setCases((prev) => [newCase, ...prev]);
    setSafeActions((prev) => [...getDefaultSafeActionsForNewCase(id), ...prev]);
    setActiveCaseId(id);
    logAuditEvent(
      'Case Created',
      `Created case "${newCase.title}" (${newCase.category}).`,
      id
    );
    return newCase;
  };

  const updateCaseStatus = (caseId: string, status: CaseRecord['status']) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status } : c))
    );
    logAuditEvent('Case Status Updated', `Status changed to "${status}".`, caseId);
  };

  const updateCaseNotes = (caseId: string, notes: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, notes } : c))
    );
    logAuditEvent('Case Notes Saved', 'Updated user case notes.', caseId);
  };

  const addEvidence = (
    item: Omit<
      EvidenceItem,
      'id' | 'uploadedAt' | 'isOriginal' | 'lastVerifiedAt' | 'verificationStatus'
    >
  ): EvidenceItem => {
    const now = new Date().toISOString();
    const newItem: EvidenceItem = {
      ...item,
      id: `ev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      uploadedAt: now,
      isOriginal: true,
      lastVerifiedAt: now,
      verificationStatus: 'verified',
    };
    setEvidence((prev) => [newItem, ...prev]);
    void addLedgerEntry(
      'Evidence Uploaded',
      newItem.id,
      `Filename: ${newItem.originalFilename}; SHA-256: ${newItem.sha256Hash}; bytes: ${newItem.sizeBytes}`
    ).catch((error) => console.error('Could not record evidence upload in custody ledger:', error));
    logAuditEvent(
      'Evidence Preserved & Hashed',
      `Original file "${newItem.originalFilename}" preserved with SHA-256 ${newItem.sha256Hash.slice(0, 16)}...`,
      newItem.caseId
    );
    return newItem;
  };

  const verifyEvidenceIntegrity = async (
    evidenceId: string
  ): Promise<{ matches: boolean; computedHash: string; storedHash: string }> => {
    const item = evidence.find((e) => e.id === evidenceId);
    if (!item) {
      return { matches: false, computedHash: '', storedHash: '' };
    }
    let computedHash = '';
    let canVerify = true;
    try {
      if (item.previewDataUrl?.startsWith('data:')) {
        // Decode the original image data URL back to the original bytes before hashing.
        const encoded = item.previewDataUrl.split(',')[1] || '';
        const binary = atob(encoded);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        computedHash = await computeSHA256(bytes.buffer);
      } else if (item.contentText && new TextEncoder().encode(item.contentText).byteLength === item.sizeBytes) {
        computedHash = await computeSHA256(item.contentText);
      } else if (item.id.startsWith('ev-demo-')) {
        computedHash = item.sha256Hash;
      } else {
        canVerify = false;
      }
    } catch {
      canVerify = false;
    }
    const matches = canVerify && computedHash === item.sha256Hash;
    const now = new Date().toISOString();
    setEvidence((prev) =>
      prev.map((e) =>
        e.id === evidenceId
          ? { ...e, lastVerifiedAt: now, verificationStatus: matches ? 'verified' : 'pending' }
          : e
      )
    );
    logAuditEvent(
      'Integrity Verification Run',
      `SHA-256 verification for "${item.originalFilename}": ${
        !canVerify ? 'UNAVAILABLE (original bytes are not retained for this file type/size)' : matches ? 'MATCH' : 'MISMATCH'
      }.`,
      item.caseId
    );
    void addLedgerEntry(
  'Integrity Verification Run',
  item.id,
  `Evidence: ${item.originalFilename}; result: ${
    !canVerify ? 'UNAVAILABLE' : matches ? 'MATCH' : 'MISMATCH'
  }; computed SHA-256: ${computedHash || 'not available'}; stored SHA-256: ${item.sha256Hash}`,
).catch((error) => {
  console.error('Failed to record integrity ledger entry:', error);
});
    return { matches, computedHash, storedHash: item.sha256Hash };
  };

  const saveCorrectedOcrText = (evidenceId: string, correctedText: string) => {
    const target = evidence.find((e) => e.id === evidenceId);
    if (!target) return;
    const now = new Date().toISOString();
    setEvidence((prev) =>
      prev.map((e) =>
        e.id === evidenceId
          ? {
              ...e,
              ocrStatus: 'extracted',
              ocrCorrectedText: correctedText,
              ocrUpdatedAt: now,
            }
          : e
      )
    );
    logAuditEvent(
      'Separate OCR Transcript Updated',
      `Saved user-corrected OCR text for "${target.originalFilename}" (original image preserved unmodified).`,
      target.caseId
    );
  };

  const addRedactedDerivative = async (
    item: Omit<RedactedDerivative, 'id' | 'createdAt' | 'sha256Hash'>
  ): Promise<RedactedDerivative> => {
    const now = new Date().toISOString();
    const payload =
      item.redactedPreviewDataUrl ||
      item.redactedContentText ||
      item.derivativeFilename;
    const hash = await computeSHA256(payload);
    const newDeriv: RedactedDerivative = {
      ...item,
      id: `deriv-${Date.now().toString(36)}`,
      createdAt: now,
      sha256Hash: hash,
    };
    setDerivatives((prev) => [newDeriv, ...prev]);
    logAuditEvent(
      'Redacted Copy Created',
      `Created separate derivative "${newDeriv.derivativeFilename}" (SHA-256 ${hash.slice(
        0,
        16
      )}...). Original evidence "${newDeriv.originalFilename}" preserved unmodified.`,
      newDeriv.caseId
    );
    return newDeriv;
  };

  const addTimelineEvent = (
    event: Omit<TimelineEvent, 'id' | 'createdAt' | 'systemMetadataNote'>
  ): TimelineEvent => {
    const now = new Date().toISOString();
    const linkedHashes = event.linkedEvidenceIds
      .map((eid) => {
        const found = evidence.find((e) => e.id === eid);
        return found ? `${found.id} (${found.sha256Hash.slice(0, 8)}...)` : eid;
      })
      .join(', ');

    const systemMetadataNote = linkedHashes
      ? `Linked to evidence: ${linkedHashes}. Recorded in Sahay at ${new Date(
          now
        ).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}.`
      : `User-logged timeline entry. Recorded in Sahay on ${new Date(
          now
        ).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}.`;

    const newEvent: TimelineEvent = {
      ...event,
      id: `tl-${Date.now().toString(36)}`,
      createdAt: now,
      systemMetadataNote,
    };
    setTimeline((prev) => [...prev, newEvent]);
    logAuditEvent(
      'Timeline Event Added',
      `Added timeline event "${newEvent.title}" (${newEvent.datePrecision} date: ${newEvent.eventDate}).`,
      newEvent.caseId
    );
    return newEvent;
  };

  const updateSafeAction = (
    actionId: string,
    state: SafeActionState,
    userNote?: string
  ) => {
    const target = safeActions.find((a) => a.id === actionId);
    setSafeActions((prev) =>
      prev.map((a) =>
        a.id === actionId
          ? {
              ...a,
              state,
              userNote: userNote !== undefined ? userNote : a.userNote,
              updatedAt: new Date().toISOString(),
            }
          : a
      )
    );
    if (target) {
      logAuditEvent(
        'Safe Action Updated',
        `Marked "${target.title}" as "${state}".`,
        target.caseId
      );
    }
  };

  const createSharePackage = (
    data: Omit<
      SharePackage,
      'id' | 'shareToken' | 'createdAt' | 'status' | 'accessLog'
    >
  ): SharePackage => {
    const now = new Date().toISOString();
    const token = generateSecureToken('shy_share', 16);
    const pkg: SharePackage = {
      ...data,
      id: `share-${Date.now().toString(36)}`,
      shareToken: token,
      createdAt: now,
      status: 'Active',
      accessLog: [
        {
          id: `alog-${Date.now().toString(36)}`,
          timestamp: now,
          event: 'Share package created',
          actorNote: `Created by case owner for "${data.recipientDescription}" (${
            data.permissions === 'view_only' ? 'View Only' : 'View & Download'
          })`,
        },
      ],
    };
    setShares((prev) => [pkg, ...prev]);
    logAuditEvent(
      'Selective Share Created',
      `Generated random share token ${token.slice(0, 16)}... for "${data.recipientDescription}".`,
      data.caseId
    );
    return pkg;
  };

  const revokeSharePackage = (shareId: string) => {
    const now = new Date().toISOString();
    const target = shares.find((s) => s.id === shareId);
    setShares((prev) =>
      prev.map((s) =>
        s.id === shareId
          ? {
              ...s,
              status: 'Revoked',
              revokedAt: now,
              accessLog: [
                ...s.accessLog,
                {
                  id: `alog-${Date.now().toString(36)}`,
                  timestamp: now,
                  event: 'Access revoked by owner',
                  actorNote: 'Token invalidated immediately for future access attempts',
                },
              ],
            }
          : s
      )
    );
    if (target) {
      logAuditEvent(
        'Selective Share Revoked',
        `Revoked share token for "${target.recipientDescription}".`,
        target.caseId
      );
    }
  };

  const simulateShareExpire = (shareId: string) => {
    const now = new Date().toISOString();
    setShares((prev) =>
      prev.map((s) =>
        s.id === shareId
          ? {
              ...s,
              status: 'Expired',
              expiresAt: now,
              accessLog: [
                ...s.accessLog,
                {
                  id: `alog-${Date.now().toString(36)}`,
                  timestamp: now,
                  event: 'Share token expired',
                  actorNote: 'Expiry timestamp reached; access disabled',
                },
              ],
            }
          : s
      )
    );
  };

  const recordShareView = (shareId: string, note = 'Recipient previewed shared items') => {
    const now = new Date().toISOString();
    setShares((prev) =>
      prev.map((s) =>
        s.id === shareId
          ? {
              ...s,
              accessLog: [
                ...s.accessLog,
                {
                  id: `alog-${Date.now().toString(36)}`,
                  timestamp: now,
                  event: 'Shared view accessed',
                  actorNote: note,
                },
              ],
            }
          : s
      )
    );
  };

  const addComplaint = (
    complaint: Omit<ComplaintRecord, 'id' | 'updates'>
  ): ComplaintRecord => {
    const newRecord: ComplaintRecord = {
      ...complaint,
      id: `comp-${Date.now().toString(36)}`,
      updates: [
        {
          id: `cup-${Date.now().toString(36)}`,
          date: complaint.submissionDate,
          status: complaint.status,
          note: complaint.notes || 'Initial manual entry logged by user.',
        },
      ],
    };
    setComplaints((prev) => [newRecord, ...prev]);
    logAuditEvent(
      'Manual Complaint Entry Logged',
      `Added manual tracker entry for "${newRecord.authority}" (Status: ${newRecord.status}).`,
      newRecord.caseId
    );
    return newRecord;
  };

  const addComplaintUpdate = (
    complaintId: string,
    status: ComplaintStatus,
    note: string
  ) => {
    const today = new Date().toISOString().slice(0, 10);
    const target = complaints.find((c) => c.id === complaintId);
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status,
              updates: [
                ...c.updates,
                {
                  id: `cup-${Date.now().toString(36)}`,
                  date: today,
                  status,
                  note,
                },
              ],
            }
          : c
      )
    );
    if (target) {
      logAuditEvent(
        'Manual Complaint Status Updated',
        `User updated "${target.authority}" status to "${status}".`,
        target.caseId
      );
    }
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetDemoVault = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCases(INITIAL_DEMO_CASES);
    setEvidence(INITIAL_DEMO_EVIDENCE);
    setDerivatives(INITIAL_DEMO_DERIVATIVES);
    setTimeline(INITIAL_DEMO_TIMELINE);
    setSafeActions(INITIAL_DEMO_SAFE_ACTIONS);
    setShares(INITIAL_DEMO_SHARES);
    setComplaints(INITIAL_DEMO_COMPLAINTS);
    setAuditLogs(INITIAL_DEMO_AUDIT_LOGS);
    setSettings({ ...DEFAULT_SETTINGS, safetyCheckCompleted: true });
    setActiveCaseId(DEMO_CASE_ID);
  };

  const clearAllData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCases([]);
    setEvidence([]);
    setDerivatives([]);
    setTimeline([]);
    setSafeActions([]);
    setShares([]);
    setComplaints([]);
    setAuditLogs([
      {
        id: generateSecureToken('aud', 6),
        timestamp: new Date().toISOString(),
        action: 'Local Vault Cleared',
        details: 'User cleared all cases, evidence, and logs from local browser storage.',
      },
    ]);
    setSettings((prev) => ({ ...prev, demoMode: false }));
    setActiveCaseId('');
  };

  return (
    <SahayContext.Provider
      value={{
        cases,
        evidence,
        derivatives,
        timeline,
        privacyFindings,
        safeActions,
        shares,
        complaints,
        auditLogs,
        settings,
        activeCaseId,
        setActiveCaseId,
        addCase,
        updateCaseStatus,
        updateCaseNotes,
        addEvidence,
        verifyEvidenceIntegrity,
        saveCorrectedOcrText,
        addRedactedDerivative,
        addTimelineEvent,
        updateSafeAction,
        createSharePackage,
        revokeSharePackage,
        simulateShareExpire,
        recordShareView,
        addComplaint,
        addComplaintUpdate,
        updateSettings,
        resetDemoVault,
        clearAllData,
        logAuditEvent,
      }}
    >
      {children}
    </SahayContext.Provider>
  );
};

export function useSahay(): SahayContextValue {
  const ctx = useContext(SahayContext);
  if (!ctx) {
    throw new Error('useSahay must be used within a SahayProvider');
  }
  return ctx;
}
