import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  FileText,
  Download,
  Printer,
  ExternalLink,
  CheckSquare,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { CaseSubNav } from '../components/CaseSubNav';
import { useSahay } from '../context/SahayContext';

export const CaseReportsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    cases,
    evidence,
    timeline,
    privacyFindings,
    derivatives,
    safeActions,
    setActiveCaseId,
    logAuditEvent,
  } = useSahay();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const caseId = currentCase?.id || '';

  const [includeCaseInfo, setIncludeCaseInfo] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeEvidenceList, setIncludeEvidenceList] = useState(true);
  const [includeSha256Hashes, setIncludeSha256Hashes] = useState(true);
  const [includePrivacyFindings, setIncludePrivacyFindings] = useState(true);
  const [includeRedactionInfo, setIncludeRedactionInfo] = useState(true);
  const [includeUserNotes, setIncludeUserNotes] = useState(true);
  const [includeSafeActions, setIncludeSafeActions] = useState(true);

  const [prepChecklist, setPrepChecklist] = useState<Record<string, boolean>>({
    c1: true,
    c2: true,
    c3: false,
    c4: false,
    c5: false,
  });

  useEffect(() => {
    if (caseId) setActiveCaseId(caseId);
  }, [caseId, setActiveCaseId]);

  if (!currentCase) {
    return (
      <WorkspaceLayout breadcrumbs={[{ label: 'Report Builder' }]}>
        <p className="text-sm text-slate-600">Case not found.</p>
      </WorkspaceLayout>
    );
  }

  const caseEvidence = evidence.filter((e) => e.caseId === caseId);
  const caseTimeline = timeline.filter((t) => t.caseId === caseId);
  const casePrivacy = privacyFindings.filter((p) => p.caseId === caseId);
  const caseDerivatives = derivatives.filter((d) => d.caseId === caseId);
  const caseActions = safeActions.filter(
    (a) =>
      a.caseId === caseId &&
      (a.state === 'Completed' || a.state === 'User selected')
  );

  const generatePlainTextReport = (): string => {
    const lines: string[] = [];
    lines.push('====================================================================');
    lines.push('SAHAY — STRUCTURED INCIDENT & EVIDENCE SUMMARY');
    lines.push(
      'DISCLAIMER: Independent prototype output — not a police report, legal certificate, court-certified evidence, or legal advice.'
    );
    lines.push('DEMO NOTICE: DEMO DATA — FICTIONAL');
    lines.push(`Generated Date: ${new Date().toISOString()}`);
    lines.push('====================================================================\n');

    if (includeCaseInfo) {
      lines.push('1. CASE INFORMATION');
      lines.push(`Case ID: ${currentCase.id}`);
      lines.push(`Title: ${currentCase.title}`);
      lines.push(`Category: ${currentCase.category}`);
      lines.push(`Status: ${currentCase.status}`);
      lines.push(
        `Incident Date (${currentCase.incidentDateType}): ${currentCase.incidentDate}`
      );
      lines.push(`Platform: ${currentCase.platform}`);
      lines.push(`Reported Account / Handle: ${currentCase.account}`);
      lines.push(`Summary: ${currentCase.description}\n`);
    }

    if (includeTimeline) {
      lines.push('2. CHRONOLOGICAL INCIDENT TIMELINE');
      caseTimeline.forEach((t, i) => {
        lines.push(
          `[${i + 1}] ${t.eventDate} ${t.eventTime || ''} (${t.datePrecision} date) — ${t.title}`
        );
        lines.push(`    Platform/Account: ${t.platform} / ${t.account}`);
        lines.push(`    User-Entered Fact: ${t.userEnteredFact}`);
        if (t.sourceUrl) lines.push(`    Source URL: ${t.sourceUrl}`);
        lines.push(
          `    Evidence Linked: ${t.linkedEvidenceIds.join(', ') || 'None'}`
        );
        lines.push(`    System Metadata: ${t.systemMetadataNote}`);
      });
      lines.push('');
    }

    if (includeEvidenceList) {
      lines.push('3. PRESERVED EVIDENCE VAULT ITEMS');
      caseEvidence.forEach((ev, i) => {
        lines.push(
          `[${i + 1}] ${ev.originalFilename} (ID: ${ev.id}, Type: ${ev.evidenceType}, Size: ${ev.sizeBytes} bytes)`
        );
        lines.push(`    Uploaded At: ${ev.uploadedAt}`);
        if (includeSha256Hashes) {
          lines.push(`    SHA-256 Fingerprint: ${ev.sha256Hash}`);
        }
      });
      lines.push('');
    }

    if (includePrivacyFindings) {
      lines.push('4. PRIVACY SCANNER FINDINGS (MASKED PREVIEWS)');
      casePrivacy.forEach((pf, i) => {
        lines.push(
          `[${i + 1}] ${pf.findingType} — Possible privacy risk (${pf.riskLevel}) in ${pf.evidenceFilename} (${pf.locationDescription}): ${pf.maskedPreview}`
        );
      });
      lines.push('');
    }

    if (includeRedactionInfo) {
      lines.push('5. REDACTED DERIVATIVE COPIES (ORIGINALS PRESERVED)');
      caseDerivatives.forEach((d, i) => {
        lines.push(
          `[${i + 1}] ${d.derivativeFilename} (Derived from ${d.originalFilename})`
        );
        lines.push(`    Note: ${d.notes}`);
        if (includeSha256Hashes) {
          lines.push(`    Derivative SHA-256: ${d.sha256Hash}`);
        }
      });
      lines.push('');
    }

    if (includeUserNotes && currentCase.notes) {
      lines.push('6. USER CASE NOTES');
      lines.push(currentCase.notes);
      lines.push('');
    }

    if (includeSafeActions) {
      lines.push('7. USER-SELECTED & COMPLETED SAFE ACTIONS');
      caseActions.forEach((a, i) => {
        lines.push(`[${i + 1}] [${a.state}] ${a.title}`);
        if (a.userNote) lines.push(`    User Note: ${a.userNote}`);
      });
      lines.push('');
    }

    lines.push('====================================================================');
    lines.push(
      'Independent prototype output — not a police report, legal certificate, court-certified evidence, or legal advice.'
    );
    return lines.join('\n');
  };

  const handleDownloadReport = () => {
    const text = generatePlainTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sahay_report_${currentCase.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    logAuditEvent(
      'Structured Report Exported',
      `Downloaded structured text report for case "${currentCase.title}".`,
      caseId
    );
  };

  const handlePrintReport = () => {
    logAuditEvent(
      'Report Print View Triggered',
      `Opened browser print/PDF dialog for case "${currentCase.title}".`,
      caseId
    );
    window.print();
  };

  return (
    <WorkspaceLayout
      breadcrumbs={[
        { label: 'Cases', to: '/cases' },
        { label: currentCase.title, to: `/cases/${caseId}` },
        { label: 'Report Builder & Official Reporting Prep' },
      ]}
    >
      <CaseSubNav caseId={caseId} />

      <div className="space-y-8">
        {/* Mandatory Prominent Prototype Output Disclaimer */}
        <div
          role="note"
          className="p-4 bg-amber-50/90 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950"
        >
          <AlertTriangle
            className="w-5 h-5 text-amber-900 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <p className="font-semibold text-sm">
              Independent prototype output — not a police report, legal certificate,
              court-certified evidence, or legal advice.
            </p>
            <p className="text-amber-900 leading-relaxed">
              This summary is generated locally to help you organize dates, files, and SHA-256
              hashes for your own records, a support counselor, or manual entry on an official
              reporting channel.
            </p>
          </div>
        </div>

        {/* Report Section Configuration & Export Controls */}
        <section className="no-print bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 font-display">
                Structured Report Builder
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Choose which sections to include in your structured summary below, then export or
                print.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadReport}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Download className="w-4 h-4" aria-hidden="true" />
                <span>Download Report (.TXT)</span>
              </button>

              <button
                type="button"
                onClick={handlePrintReport}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <Printer className="w-4 h-4" aria-hidden="true" />
                <span>Print / Save as PDF</span>
              </button>

              <Link
                to={`/cases/${caseId}/sharing`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <span>Next: Selective Sharing</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Section Checkboxes */}
          <fieldset className="pt-4 border-t border-slate-200">
            <legend className="text-xs font-semibold text-slate-700 mb-3">
              Select Report Sections to Include:
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeCaseInfo}
                  onChange={(e) => setIncludeCaseInfo(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">1. Case Information</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTimeline}
                  onChange={(e) => setIncludeTimeline(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">
                  2. Incident Timeline ({caseTimeline.length})
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeEvidenceList}
                  onChange={(e) => setIncludeEvidenceList(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">
                  3. Evidence List ({caseEvidence.length})
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSha256Hashes}
                  onChange={(e) => setIncludeSha256Hashes(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">4. SHA-256 Fingerprints</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includePrivacyFindings}
                  onChange={(e) => setIncludePrivacyFindings(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">
                  5. Privacy Findings ({casePrivacy.length})
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRedactionInfo}
                  onChange={(e) => setIncludeRedactionInfo(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">
                  6. Redaction Derivatives ({caseDerivatives.length})
                </span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeUserNotes}
                  onChange={(e) => setIncludeUserNotes(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">7. User Notes</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeSafeActions}
                  onChange={(e) => setIncludeSafeActions(e.target.checked)}
                  className="accent-teal-800 rounded"
                />
                <span className="font-medium text-slate-800">
                  8. Selected Safe Actions ({caseActions.length})
                </span>
              </label>
            </div>
          </fieldset>
        </section>

        {/* Live Structured Report Preview Document */}
        <section
          aria-label="Structured Report Preview"
          className="bg-white border border-slate-300 rounded-xl p-6 sm:p-8 space-y-6"
        >
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs font-mono text-slate-500">
                SAHAY INCIDENT DOCUMENTATION SUMMARY · DEMO DATA — FICTIONAL
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900 font-display">
                {currentCase.title}
              </h2>
            </div>
            <div className="text-xs font-mono text-slate-500 tabular-nums">
              Case ID: {currentCase.id}
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
            Independent prototype output — not a police report, legal certificate, court-certified
            evidence, or legal advice.
          </div>

          {includeCaseInfo && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-teal-900">
                SECTION 1 · CASE INFORMATION
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500">Category:</span>{' '}
                  <strong className="text-slate-900">{currentCase.category}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Incident Date ({currentCase.incidentDateType}):</span>{' '}
                  <strong className="font-mono text-slate-900">{currentCase.incidentDate}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Platform:</span>{' '}
                  <strong className="text-slate-900">{currentCase.platform}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Reported Account:</span>{' '}
                  <strong className="font-mono text-slate-900">{currentCase.account}</strong>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500">Summary:</span>{' '}
                  <span className="text-slate-800">{currentCase.description}</span>
                </div>
              </div>
            </div>
          )}

          {includeTimeline && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-teal-900">
                SECTION 2 · CHRONOLOGICAL INCIDENT TIMELINE ({caseTimeline.length})
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg text-xs">
                {caseTimeline.map((t, idx) => (
                  <div key={t.id} className="p-3.5 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-slate-600 tabular-nums">
                      <span className="font-semibold text-slate-900">
                        0{idx + 1}. {t.eventDate} {t.eventTime ? `· ${t.eventTime}` : ''} (
                        {t.datePrecision})
                      </span>
                      <span>
                        {t.platform} · {t.account}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-900">{t.title}</p>
                    <p className="text-slate-700">
                      <strong>User-entered fact:</strong> {t.userEnteredFact}
                    </p>
                    <p className="text-slate-500 font-mono">{t.systemMetadataNote}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {includeEvidenceList && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-teal-900">
                SECTION 3 · PRESERVED EVIDENCE INVENTORY ({caseEvidence.length})
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg text-xs">
                {caseEvidence.map((ev) => (
                  <div key={ev.id} className="p-3.5 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">
                        {ev.originalFilename} ({ev.id})
                      </span>
                      <span className="text-slate-500 font-mono tabular-nums">
                        {ev.evidenceType.toUpperCase()} · {(ev.sizeBytes / 1024).toFixed(1)} KB ·{' '}
                        {new Date(ev.uploadedAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {includeSha256Hashes && (
                      <p className="font-mono text-slate-600 break-all tabular-nums">
                        SHA-256: {ev.sha256Hash}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {includePrivacyFindings && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-teal-900">
                SECTION 4 · PRIVACY SCANNER SUMMARY ({casePrivacy.length} POSSIBLE RISKS)
              </h3>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                {casePrivacy.map((pf) => (
                  <div
                    key={pf.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/70 last:border-b-0 pb-1.5 last:pb-0"
                  >
                    <span>
                      <strong>{pf.findingType}</strong> in {pf.evidenceFilename} (
                      {pf.locationDescription})
                    </span>
                    <span className="font-mono text-slate-700">
                      {pf.maskedPreview} · Possible privacy risk ({pf.riskLevel})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {includeRedactionInfo && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-teal-900">
                SECTION 5 · REDACTED DERIVATIVE COPIES ({caseDerivatives.length})
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg text-xs">
                {caseDerivatives.map((d) => (
                  <div key={d.id} className="p-3.5 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono font-semibold text-slate-900">
                        {d.derivativeFilename}
                      </span>
                      <span className="font-mono text-emerald-800">
                        Redacted copy — original preserved.
                      </span>
                    </div>
                    <p className="text-slate-600">{d.notes}</p>
                    {includeSha256Hashes && (
                      <p className="font-mono text-slate-500 break-all tabular-nums">
                        Derivative SHA-256: {d.sha256Hash}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {includeUserNotes && currentCase.notes && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-teal-900">
                SECTION 6 · USER NOTES
              </h3>
              <p className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed">
                {currentCase.notes}
              </p>
            </div>
          )}

          {includeSafeActions && (
            <div className="space-y-2">
              <h3 className="text-xs font-mono font-semibold text-teal-900">
                SECTION 7 · SELECTED &amp; COMPLETED SAFE ACTIONS ({caseActions.length})
              </h3>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg text-xs">
                {caseActions.map((a) => (
                  <div key={a.id} className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="font-semibold text-slate-900">{a.title}</span>
                      {a.userNote && (
                        <p className="text-slate-600 mt-0.5">Note: {a.userNote}</p>
                      )}
                    </div>
                    <span className="font-mono text-teal-900 font-medium shrink-0">
                      {a.state}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Official Reporting Preparation Section (NCRP & Helplines) */}
        <section
          aria-label="Official Reporting Preparation"
          className="no-print bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <div className="border-b border-slate-200 pb-4">
            <p className="text-xs font-mono text-teal-800">
              OFFICIAL REPORTING PREPARATION GUIDE (INDIA)
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900 font-display">
              Preparing for Official Cyber Crime Reporting
            </h2>
            <p className="mt-1 text-sm text-slate-600 max-w-3xl">
              Sahay does <strong>not</strong> submit complaints automatically, does{' '}
              <strong>not</strong> scrape government portals, and is <strong>not</strong> connected
              to police systems. If you decide to file an official report, this checklist helps you
              gather what portals typically ask for.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Official Portal Info Card */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  National Cyber Crime Reporting Portal (NCRP)
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  Operated by the Ministry of Home Affairs, Government of India, to allow citizens
                  to report cybercrimes online, with a dedicated focus on crimes against women and
                  children.
                </p>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded-lg space-y-2 text-xs">
                <p className="font-medium text-slate-700">Official Portal Address:</p>
                <p className="font-mono font-semibold text-teal-900 text-sm select-all">
                  https://www.cybercrime.gov.in/
                </p>
                <a
                  href="https://www.cybercrime.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:underline underline-offset-4 pt-1"
                >
                  <span>Visit https://www.cybercrime.gov.in/ (External Official Site)</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <PhoneCall className="w-3 h-3 text-teal-800" aria-hidden="true" />
                    <span>Cyber Helpline</span>
                  </div>
                  <p className="font-mono font-semibold text-base text-slate-900 mt-0.5 tabular-nums">
                    1930
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <PhoneCall className="w-3 h-3 text-teal-800" aria-hidden="true" />
                    <span>Emergency</span>
                  </div>
                  <p className="font-mono font-semibold text-base text-slate-900 mt-0.5 tabular-nums">
                    112
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-1 font-semibold text-slate-900">
                    <PhoneCall className="w-3 h-3 text-teal-800" aria-hidden="true" />
                    <span>Women Helpline</span>
                  </div>
                  <p className="font-mono font-semibold text-base text-slate-900 mt-0.5 tabular-nums">
                    181
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Preparation Checklist */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-teal-800" aria-hidden="true" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Pre-Filing Preparation Checklist
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  {
                    key: 'c1',
                    label:
                      'Unedited original screenshots & chat logs preserved (keep originals for official authorities; use redacted copies for third-party advice).',
                  },
                  {
                    key: 'c2',
                    label:
                      'Exact or approximate dates, times (with timezone e.g. IST), and platform names organized in your chronological timeline.',
                  },
                  {
                    key: 'c3',
                    label:
                      'Full profile URLs and specific post/message links of the reported account copied clearly.',
                  },
                  {
                    key: 'c4',
                    label:
                      'Written incident summary (under 500–1000 words) prepared using your structured Sahay report.',
                  },
                  {
                    key: 'c5',
                    label:
                      'Ready to manually record your Acknowledgement Number in the Sahay Complaint Tracker after submitting.',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-2.5 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(prepChecklist[item.key])}
                      onChange={(e) =>
                        setPrepChecklist((prev) => ({
                          ...prev,
                          [item.key]: e.target.checked,
                        }))
                      }
                      className="mt-0.5 accent-teal-800 rounded"
                    />
                    <span className="text-slate-700 leading-relaxed">{item.label}</span>
                  </label>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <Link
                  to="/complaints"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:underline underline-offset-4"
                >
                  <span>Open Manual Complaint Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </WorkspaceLayout>
  );
};
