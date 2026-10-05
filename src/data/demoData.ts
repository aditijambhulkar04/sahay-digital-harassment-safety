import {
  AuditEvent,
  CaseRecord,
  ComplaintRecord,
  EvidenceItem,
  RedactedDerivative,
  SafeActionItem,
  SharePackage,
  TimelineEvent,
} from '../types/sahay';

export const DEMO_CASE_ID = 'case-demo-2026-01';

/**
 * Generates clean SVG data URLs representing fictional screenshot evidence
 * so that previews, canvas visual redaction, and local OCR work reliably offline.
 */
function createScreenshotSvgDataUrl(lines: {
  header: string;
  subHeader: string;
  bubbles: { sender: string; time: string; text: string; isHarasser?: boolean }[];
  footerNote: string;
}): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="680" height="440" viewBox="0 0 680 440">
    <rect width="680" height="440" fill="#F8FAFC" rx="8"/>
    <rect x="0" y="0" width="680" height="58" fill="#0F172A"/>
    <text x="24" y="28" fill="#F8FAFC" font-family="sans-serif" font-size="14" font-weight="bold">${lines.header}</text>
    <text x="24" y="46" fill="#94A3B8" font-family="monospace" font-size="11">${lines.subHeader}</text>
    <rect x="490" y="16" width="166" height="24" rx="4" fill="#1E293B"/>
    <text x="502" y="32" fill="#E2E8F0" font-family="monospace" font-size="10">DEMO DATA — FICTIONAL</text>
    ${lines.bubbles
      .map((b, idx) => {
        const y = 78 + idx * 82;
        const boxFill = b.isHarasser ? '#FFFFFF' : '#F1F5F9';
        const borderStroke = b.isHarasser ? '#CBD5E1' : '#94A3B8';
        return `
        <rect x="24" y="${y}" width="632" height="68" rx="6" fill="${boxFill}" stroke="${borderStroke}" stroke-width="1"/>
        <text x="38" y="${y + 22}" fill="#0F172A" font-family="sans-serif" font-size="12" font-weight="bold">${b.sender}</text>
        <text x="520" y="${y + 22}" fill="#64748B" font-family="monospace" font-size="11">${b.time}</text>
        <text x="38" y="${y + 46}" fill="#1E293B" font-family="sans-serif" font-size="13">${b.text}</text>
      `;
      })
      .join('')}
    <text x="24" y="422" fill="#475569" font-family="monospace" font-size="11">${lines.footerNote}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const INITIAL_DEMO_CASES: CaseRecord[] = [
  {
    id: DEMO_CASE_ID,
    title: 'Repeated Online Harassment — Demo Case',
    category: 'Repeated Unwanted Contact & Doxxing',
    description:
      'Fictional demonstration case: Unwanted direct messages on a social platform escalating to repeated contact from secondary accounts, explicit threats to publish private contact details, and a public post exposing fictional phone/address data.',
    incidentDateType: 'exact',
    incidentDate: '2026-09-12',
    platform: 'ChatterBox Social / DirectGram (Fictional Platform)',
    account: '@arjun_v_demo99 (Fictional Handle)',
    notes:
      'DEMO DATA — FICTIONAL. Original screenshots and chat export logs preserved before muting account. No real person or real personal data is depicted.',
    createdDate: '2026-09-12T18:30:00Z',
    status: 'Active — Preserving Evidence',
    isDemo: true,
  },
];

export const INITIAL_DEMO_EVIDENCE: EvidenceItem[] = [
  {
    id: 'ev-demo-01',
    caseId: DEMO_CASE_ID,
    originalFilename: 'dm_unwanted_message_12sep2026.png',
    mimeType: 'image/png',
    evidenceType: 'image',
    sizeBytes: 248320,
    uploadedAt: '2026-09-12T18:42:10Z',
    sha256Hash: '8f4b2e91c7d03a65e19f44c8a2d1b7e60934f5a1c8b2d4e6f7a90123b4c5d6e7',
    isOriginal: true,
    contentText:
      'DirectGram Chat Capture (12 Sep 2026, 18:15 IST)\nFrom: @arjun_v_demo99 (https://directgram.example.com/u/arjun_v_demo99)\nTo: @ananya_design_demo (ananya.sharma.demo@example.org)\nMessage 1 (18:12): Why did you ignore my messages? I know you check your inbox.\nMessage 2 (18:14): Please stop messaging me. I am not interested in collaborating.\nMessage 3 (18:15): You cannot just block me. I have your personal number +91 98765 00123.',
    previewDataUrl: createScreenshotSvgDataUrl({
      header: 'DirectGram Messenger — @arjun_v_demo99 (Fictional Profile)',
      subHeader: 'URL: https://directgram.example.com/dm/thread-99012 · Captured 12 Sep 2026',
      bubbles: [
        {
          sender: '@arjun_v_demo99',
          time: '12 Sep 2026 · 18:12 IST',
          text: 'Why did you ignore my messages? I know you check your inbox.',
          isHarasser: true,
        },
        {
          sender: '@ananya_design_demo (Victim — Fictional)',
          time: '12 Sep 2026 · 18:14 IST',
          text: 'Please stop messaging me. I do not wish to be contacted.',
          isHarasser: false,
        },
        {
          sender: '@arjun_v_demo99',
          time: '12 Sep 2026 · 18:15 IST',
          text: 'You cannot just ignore me. I already have your number +91 98765 00123.',
          isHarasser: true,
        },
      ],
      footerNote: 'Account Email Visible in Header: ananya.sharma.demo@example.org',
    }),
    exifMetadata: {
      DeviceModel: 'Fictional Capture Device X1',
      CaptureTimestamp: '2026-09-12 18:16:04 IST',
      GPSCoordinates: '12.9716° N, 77.5946° E (Fictional Bengaluru Center)',
    },
    ocrStatus: 'extracted',
    ocrRawText:
      '@arjun_v_demo99 (12 Sep 2026 18:12 IST): Why did you ignore my messages? I know you check your inbox.\n@ananya_design_demo (12 Sep 2026 18:14 IST): Please stop messaging me. I do not wish to be contacted.\n@arjun_v_demo99 (12 Sep 2026 18:15 IST): You cannot just ignore me. I already have your number +91 98765 00123.\nAccount header: ananya.sharma.demo@example.org',
    ocrCorrectedText:
      '@arjun_v_demo99 (12 Sep 2026 18:12 IST): Why did you ignore my messages? I know you check your inbox.\n@ananya_design_demo (12 Sep 2026 18:14 IST): Please stop messaging me. I do not wish to be contacted.\n@arjun_v_demo99 (12 Sep 2026 18:15 IST): You cannot just ignore me. I already have your number +91 98765 00123.\nAccount header: ananya.sharma.demo@example.org',
    ocrUpdatedAt: '2026-09-12T18:45:00Z',
    lastVerifiedAt: '2026-09-12T18:42:10Z',
    verificationStatus: 'verified',
  },
  {
    id: 'ev-demo-02',
    caseId: DEMO_CASE_ID,
    originalFilename: 'repeated_contact_log_15sep2026.txt',
    mimeType: 'text/plain',
    evidenceType: 'text',
    sizeBytes: 14280,
    uploadedAt: '2026-09-15T22:10:05Z',
    sha256Hash: '3a9d1c74e8b205f61239a8c4d7e1f09b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e01',
    isOriginal: true,
    contentText: `=== CHATTERBOX / DIRECTGRAM EXPORT LOG (DEMO DATA — FICTIONAL) ===
Exported by: ananya.sharma.demo@example.org
Date of Export: 15 Sep 2026, 22:05 IST
Thread Source URL: https://chatterbox.example.com/messages/arjun_backup_demo

[2026-09-15 21:12:04 IST] @arjun_backup_demo: Muting my main account @arjun_v_demo99 won't work.
[2026-09-15 21:15:19 IST] @arjun_backup_demo: Answer my call on +91 98765 00123 right now.
[2026-09-15 21:22:41 IST] @arjun_backup_demo: I also found your studio refund reference Acct 30918273645 (IFSC: SBIN0004821) from an old event form.
[2026-09-15 21:40:02 IST] @arjun_backup_demo: Keep ignoring me and see what happens this week.`,
    ocrStatus: 'not_applicable',
    lastVerifiedAt: '2026-09-15T22:10:05Z',
    verificationStatus: 'verified',
  },
  {
    id: 'ev-demo-03',
    caseId: DEMO_CASE_ID,
    originalFilename: 'threatening_message_18sep2026.png',
    mimeType: 'image/png',
    evidenceType: 'image',
    sizeBytes: 312900,
    uploadedAt: '2026-09-18T23:20:00Z',
    sha256Hash: 'c5e1a904f3b87d621094e8c7b6a5d4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7',
    isOriginal: true,
    contentText:
      'Threatening Direct Message Capture (18 Sep 2026, 23:05 IST)\nFrom: @arjun_backup_demo (https://chatterbox.example.com/u/arjun_backup_demo)\nMessage (23:05 IST): If you do not reply by tomorrow morning, I am posting your home address Flat 402, Lotus Enclave, Sector 14, Bengaluru 560001 and phone +91 98765 00123 on public forums.',
    previewDataUrl: createScreenshotSvgDataUrl({
      header: 'ChatterBox Direct Message — @arjun_backup_demo (Fictional)',
      subHeader: 'URL: https://chatterbox.example.com/u/arjun_backup_demo · 18 Sep 2026',
      bubbles: [
        {
          sender: '@arjun_backup_demo',
          time: '18 Sep 2026 · 23:01 IST',
          text: 'Last warning. Reply to my message before 9 AM tomorrow.',
          isHarasser: true,
        },
        {
          sender: '@arjun_backup_demo',
          time: '18 Sep 2026 · 23:05 IST',
          text: 'Otherwise I will post Flat 402, Lotus Enclave, Sector 14, Bengaluru 560001 online.',
          isHarasser: true,
        },
        {
          sender: '@arjun_backup_demo',
          time: '18 Sep 2026 · 23:06 IST',
          text: 'Everyone on the forum will have your number +91 98765 00123.',
          isHarasser: true,
        },
      ],
      footerNote: 'Preserved in Sahay Demo Vault · Original Unmodified',
    }),
    ocrStatus: 'extracted',
    ocrRawText:
      '@arjun_backup_demo (18 Sep 2026 23:01 IST): Last warning. Reply to my message before 9 AM tomorrow.\n@arjun_backup_demo (18 Sep 2026 23:05 IST): Otherwise I will post Flat 402, Lotus Enclave, Sector 14, Bengaluru 560001 online.\n@arjun_backup_demo (18 Sep 2026 23:06 IST): Everyone on the forum will have your number +91 98765 00123.',
    ocrCorrectedText:
      '@arjun_backup_demo (18 Sep 2026 23:01 IST): Last warning. Reply to my message before 9 AM tomorrow.\n@arjun_backup_demo (18 Sep 2026 23:05 IST): Otherwise I will post Flat 402, Lotus Enclave, Sector 14, Bengaluru 560001 online.\n@arjun_backup_demo (18 Sep 2026 23:06 IST): Everyone on the forum will have your number +91 98765 00123.',
    ocrUpdatedAt: '2026-09-18T23:24:00Z',
    lastVerifiedAt: '2026-09-18T23:20:00Z',
    verificationStatus: 'verified',
  },
  {
    id: 'ev-demo-04',
    caseId: DEMO_CASE_ID,
    originalFilename: 'public_doxx_post_capture_19sep2026.pdf',
    mimeType: 'application/pdf',
    evidenceType: 'pdf',
    sizeBytes: 486120,
    uploadedAt: '2026-09-19T10:05:12Z',
    sha256Hash: '7d2b9a41e6f08c35a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f6a7b8',
    isOriginal: true,
    contentText: `PUBLIC FORUM POST ARCHIVE (PDF TEXT LAYER — DEMO DATA — FICTIONAL)
Source URL: https://chatterbox.example.com/public-board/post-88412
Posted by: @arjun_v_demo99 on 19 Sep 2026 at 09:30 IST

Post Content:
"Contact Ananya directly at +91 98765 00123 or email ananya.sharma.demo@example.org.
Residential address: Flat 402, Lotus Enclave, Sector 14, Bengaluru 560001.
Fictional ID Ref on registration sheet: 4912 8834 0192."`,
    exifMetadata: {
      DocumentProducer: 'Browser Print to PDF (Fictional Demo)',
      SourceURL: 'https://chatterbox.example.com/public-board/post-88412',
    },
    ocrStatus: 'not_applicable',
    lastVerifiedAt: '2026-09-19T10:05:12Z',
    verificationStatus: 'verified',
  },
];

export const INITIAL_DEMO_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl-demo-01',
    caseId: DEMO_CASE_ID,
    datePrecision: 'exact',
    eventDate: '2026-09-12',
    eventTime: '18:15 IST',
    title: '12 Sep 2026 — Unwanted message',
    platform: 'DirectGram (Fictional)',
    account: '@arjun_v_demo99',
    userEnteredFact:
      'Received unsolicited direct messages from @arjun_v_demo99. After replying once to ask that contact stop, the sender stated they had my phone number.',
    sourceUrl: 'https://directgram.example.com/dm/thread-99012',
    linkedEvidenceIds: ['ev-demo-01'],
    systemMetadataNote:
      'Linked to ev-demo-01 (SHA-256 prefix 8f4b2e91...). Event logged by user on 12 Sep 2026.',
    createdAt: '2026-09-12T18:46:00Z',
  },
  {
    id: 'tl-demo-02',
    caseId: DEMO_CASE_ID,
    datePrecision: 'exact',
    eventDate: '2026-09-15',
    eventTime: '21:40 IST',
    title: '15 Sep 2026 — Repeated unwanted contact',
    platform: 'ChatterBox Social (Fictional)',
    account: '@arjun_backup_demo',
    userEnteredFact:
      'After muting @arjun_v_demo99, received repeated messages from a secondary account (@arjun_backup_demo) demanding phone calls and referencing old registration details.',
    sourceUrl: 'https://chatterbox.example.com/messages/arjun_backup_demo',
    linkedEvidenceIds: ['ev-demo-02'],
    systemMetadataNote:
      'Linked to ev-demo-02 (SHA-256 prefix 3a9d1c74...). Event logged by user on 15 Sep 2026.',
    createdAt: '2026-09-15T22:15:00Z',
  },
  {
    id: 'tl-demo-03',
    caseId: DEMO_CASE_ID,
    datePrecision: 'exact',
    eventDate: '2026-09-18',
    eventTime: '23:05 IST',
    title: '18 Sep 2026 — Threatening message',
    platform: 'ChatterBox Social (Fictional)',
    account: '@arjun_backup_demo',
    userEnteredFact:
      'Sender issued an explicit deadline threatening to publish my residential address and phone number on public forums if I did not respond by 9 AM.',
    sourceUrl: 'https://chatterbox.example.com/u/arjun_backup_demo',
    linkedEvidenceIds: ['ev-demo-03'],
    systemMetadataNote:
      'Linked to ev-demo-03 (SHA-256 prefix c5e1a904...). Event logged by user on 18 Sep 2026.',
    createdAt: '2026-09-18T23:25:00Z',
  },
  {
    id: 'tl-demo-04',
    caseId: DEMO_CASE_ID,
    datePrecision: 'exact',
    eventDate: '2026-09-19',
    eventTime: '09:30 IST',
    title: '19 Sep 2026 — Personal information appears in a public post',
    platform: 'ChatterBox Public Board (Fictional)',
    account: '@arjun_v_demo99',
    userEnteredFact:
      'Discovered a public post on ChatterBox containing my fictional phone number, email address, residential address, and an ID reference number.',
    sourceUrl: 'https://chatterbox.example.com/public-board/post-88412',
    linkedEvidenceIds: ['ev-demo-04'],
    systemMetadataNote:
      'Linked to ev-demo-04 (SHA-256 prefix 7d2b9a41...). Event logged by user on 19 Sep 2026.',
    createdAt: '2026-09-19T10:10:00Z',
  },
];

export const INITIAL_DEMO_DERIVATIVES: RedactedDerivative[] = [
  {
    id: 'deriv-demo-01',
    caseId: DEMO_CASE_ID,
    originalEvidenceId: 'ev-demo-04',
    originalFilename: 'public_doxx_post_capture_19sep2026.pdf',
    derivativeFilename: 'redacted_public_doxx_post_capture_19sep2026.txt',
    createdAt: '2026-09-19T10:25:00Z',
    redactionType: 'text',
    redactedContentText: `PUBLIC FORUM POST ARCHIVE (PDF TEXT LAYER — DEMO DATA — FICTIONAL)
Source URL: https://chatterbox.example.com/public-board/post-88412
Posted by: @arjun_v_demo99 on 19 Sep 2026 at 09:30 IST

Post Content:
"Contact Ananya directly at [REDACTED] or email [REDACTED].
Residential address: [REDACTED], Bengaluru [REDACTED].
Fictional ID Ref on registration sheet: [REDACTED]."`,
    redactedFindingsCount: 5,
    sha256Hash: 'e4c910a8b7d6f5e4321098fedcba76543210abcdef1234567890abcdef123456',
    notes:
      'Redacted copy — original preserved. Masked victim phone, email, street address, PIN code, and Aadhaar-like pattern for safe third-party consultation.',
  },
];

export const INITIAL_DEMO_SAFE_ACTIONS: SafeActionItem[] = [
  {
    id: 'sa-demo-01',
    caseId: DEMO_CASE_ID,
    category: 'Evidence Preservation',
    title: 'Preserve the original evidence before blocking or deleting threads',
    calmGuidance:
      'Suggested next step: Keep unedited screenshots, full chat exports, URLs, and SHA-256 hashes stored safely. Avoid cropping or drawing directly over your only copy of a screenshot.',
    whySuggested: 'Case includes 4 evidence items across direct messages and a public post.',
    state: 'Completed',
    userNote: 'All 4 original files uploaded and SHA-256 fingerprints verified in Vault.',
    updatedAt: '2026-09-19T10:15:00Z',
  },
  {
    id: 'sa-demo-02',
    caseId: DEMO_CASE_ID,
    category: 'Account & Device Hygiene',
    title: 'Review account security, change passwords, and enable MFA',
    calmGuidance:
      'Consider reviewing login security on your primary email and social accounts. Enable app-based multi-factor authentication (MFA) and use unique passwords.',
    whySuggested: 'Personal email address and phone number appeared in captured messages.',
    state: 'Completed',
    userNote: 'Enabled authenticator 2FA on email and social accounts.',
    updatedAt: '2026-09-19T11:00:00Z',
  },
  {
    id: 'sa-demo-03',
    caseId: DEMO_CASE_ID,
    category: 'Account & Device Hygiene',
    title: 'Review active sessions and connected devices',
    calmGuidance:
      'Review the "Where You Are Logged In" or active sessions panel in your email and social apps, and sign out of any unrecognized browsers or devices.',
    whySuggested: 'Recommended precaution when personal contact identifiers are exposed.',
    state: 'User selected',
    userNote: 'Checking email login history this evening.',
    updatedAt: '2026-09-19T11:20:00Z',
  },
  {
    id: 'sa-demo-04',
    caseId: DEMO_CASE_ID,
    category: 'Platform Controls',
    title: 'Review privacy settings and consider blocking or reporting on the platform',
    calmGuidance:
      'Once evidence is preserved, consider restricting who can message or tag you, and consider using the platform’s harassment/doxxing takedown report form.',
    whySuggested: 'Repeated contact occurred across multiple accounts (@arjun_v_demo99, @arjun_backup_demo).',
    state: 'User selected',
    userNote: 'Prepared URLs for platform takedown request after saving PDF archive.',
    updatedAt: '2026-09-19T11:30:00Z',
  },
  {
    id: 'sa-demo-05',
    caseId: DEMO_CASE_ID,
    category: 'Reporting & Support',
    title: 'Prepare a structured incident report and timeline',
    calmGuidance:
      'Consider generating a structured summary combining your chronological timeline, evidence list, and SHA-256 hashes so you do not have to retell the incident repeatedly.',
    whySuggested: 'Helps organize facts clearly before speaking with support services or authorities.',
    state: 'Suggested',
  },
  {
    id: 'sa-demo-06',
    caseId: DEMO_CASE_ID,
    category: 'Reporting & Support',
    title: 'Consider an official reporting channel (e.g., National Cyber Crime Reporting Portal)',
    calmGuidance:
      'If and when you feel ready, review the Official Reporting Preparation checklist to see what documents are helpful for filing on https://www.cybercrime.gov.in/.',
    whySuggested: 'Threats and non-consensual publication of personal contact details recorded.',
    state: 'Suggested',
  },
  {
    id: 'sa-demo-07',
    caseId: DEMO_CASE_ID,
    category: 'Personal Safety',
    title: 'If immediate physical danger exists, seek emergency help',
    calmGuidance:
      'If a residential address has been shared and you feel unsafe in person, consider alerting a trusted person, building security, or calling Emergency Response Support System (112).',
    whySuggested: 'Address-like information was detected in Evidence #3 and #4.',
    state: 'Suggested',
  },
];

export const INITIAL_DEMO_SHARES: SharePackage[] = [
  {
    id: 'share-demo-01',
    caseId: DEMO_CASE_ID,
    shareToken: 'shy_demo_7f8e9a1b2c3d4e5f6a7b8c9d0e1f2a3b',
    recipientDescription: 'Trusted Cyber Safety Counselor — Ms. Kavita Rao (Fictional NGO)',
    includedEvidenceIds: ['ev-demo-01', 'ev-demo-02'],
    includedDerivativeIds: ['deriv-demo-01'],
    permissions: 'view_only',
    createdAt: '2026-09-19T12:00:00Z',
    expiresAt: '2026-10-19T12:00:00Z',
    status: 'Active',
    privacyWarningAcknowledged: true,
    accessLog: [
      {
        id: 'alog-01',
        timestamp: '2026-09-19T12:00:00Z',
        event: 'Share package created',
        actorNote: 'Case owner generated token with View-Only permission',
      },
      {
        id: 'alog-02',
        timestamp: '2026-09-19T14:22:10Z',
        event: 'Package viewed (Fictional Demo Log)',
        actorNote: 'Recipient opened redacted summary view',
      },
    ],
  },
];

export const INITIAL_DEMO_COMPLAINTS: ComplaintRecord[] = [
  {
    id: 'comp-demo-01',
    caseId: DEMO_CASE_ID,
    authority: 'ChatterBox Platform Trust & Safety (Doxxing Takedown)',
    referenceNumber: 'USER-ENTERED-CB-2026-8841 (Fictional)',
    submissionDate: '2026-09-19',
    status: 'Submitted',
    notes:
      'Manually logged by user: Submitted request to remove public post exposing residential address and phone number.',
    updates: [
      {
        id: 'cup-01',
        date: '2026-09-19',
        status: 'Prepared',
        note: 'Compiled post URL and screenshot hash from Sahay vault.',
      },
      {
        id: 'cup-02',
        date: '2026-09-19',
        status: 'Submitted',
        note: 'Submitted via platform web form and recorded acknowledgement ticket manually.',
      },
    ],
  },
  {
    id: 'comp-demo-02',
    caseId: DEMO_CASE_ID,
    authority: 'National Cyber Crime Reporting Portal (cybercrime.gov.in)',
    referenceNumber: 'Not yet filed — Draft Packet Ready',
    submissionDate: '2026-09-20',
    status: 'Prepared',
    notes:
      'Manually logged by user: Preparing evidence bundle and chronological timeline before visiting official portal.',
    updates: [
      {
        id: 'cup-03',
        date: '2026-09-20',
        status: 'Prepared',
        note: 'Reviewed Official Reporting Preparation checklist in Sahay.',
      },
    ],
  },
];

export const INITIAL_DEMO_AUDIT_LOGS: AuditEvent[] = [
  {
    id: 'aud-01',
    caseId: DEMO_CASE_ID,
    timestamp: '2026-09-12T18:30:00Z',
    action: 'Case Created',
    details: 'Initialized "Repeated Online Harassment — Demo Case" in local vault.',
  },
  {
    id: 'aud-02',
    caseId: DEMO_CASE_ID,
    timestamp: '2026-09-12T18:42:10Z',
    action: 'Evidence Preserved & Hashed',
    details:
      'Original file dm_unwanted_message_12sep2026.png locked with SHA-256 8f4b2e91c7d03a65...',
  },
  {
    id: 'aud-03',
    caseId: DEMO_CASE_ID,
    timestamp: '2026-09-19T10:05:12Z',
    action: 'Evidence Preserved & Hashed',
    details:
      'Original file public_doxx_post_capture_19sep2026.pdf locked with SHA-256 7d2b9a41e6f08c35...',
  },
  {
    id: 'aud-04',
    caseId: DEMO_CASE_ID,
    timestamp: '2026-09-19T10:25:00Z',
    action: 'Redacted Derivative Created',
    details:
      'Created separate redacted copy redacted_public_doxx_post_capture_19sep2026.txt (5 items masked; original preserved).',
  },
];
