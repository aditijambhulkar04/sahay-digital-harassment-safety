import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Share2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Ban,
  Clock,
  Eye,
  Copy,
  Check,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { CaseSubNav } from '../components/CaseSubNav';
import { useSahay } from '../context/SahayContext';
import { SharePackage } from '../types/sahay';

export const CaseSharingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    cases,
    evidence,
    derivatives,
    privacyFindings,
    shares,
    setActiveCaseId,
    createSharePackage,
    revokeSharePackage,
    simulateShareExpire,
    recordShareView,
  } = useSahay();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const caseId = currentCase?.id || '';

  const caseEvidence = evidence.filter((e) => e.caseId === caseId);
  const caseDerivatives = derivatives.filter((d) => d.caseId === caseId);
  const caseShares = shares.filter((s) => s.caseId === caseId);
  const caseFindings = privacyFindings.filter((p) => p.caseId === caseId);

  const [recipientDescription, setRecipientDescription] = useState('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [selectedDerivativeIds, setSelectedDerivativeIds] = useState<string[]>(
    caseDerivatives[0] ? [caseDerivatives[0].id] : []
  );
  const [expiryDays, setExpiryDays] = useState<'1' | '7' | '30'>('7');
  const [permissions, setPermissions] = useState<'view_only' | 'view_and_download'>('view_only');
  const [privacyCheckConfirmed, setPrivacyCheckConfirmed] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null);
  const [previewingShare, setPreviewingShare] = useState<SharePackage | null>(null);

  useEffect(() => {
    if (caseId) setActiveCaseId(caseId);
  }, [caseId, setActiveCaseId]);

  // Check if any selected unredacted original evidence has detected privacy risks
  const selectedOriginalsPrivacyRisks = caseFindings.filter((pf) =>
    selectedEvidenceIds.includes(pf.evidenceId)
  );

  const toggleOriginalEvidence = (evId: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(evId) ? prev.filter((x) => x !== evId) : [...prev, evId]
    );
  };

  const toggleDerivative = (dId: string) => {
    setSelectedDerivativeIds((prev) =>
      prev.includes(dId) ? prev.filter((x) => x !== dId) : [...prev, dId]
    );
  };

  const handleCreateShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientDescription.trim()) {
      setFormError('Please enter a recipient description (e.g., Legal Aid Counselor or Support NGO).');
      return;
    }
    if (selectedEvidenceIds.length === 0 && selectedDerivativeIds.length === 0) {
      setFormError('Please select at least one redacted copy or evidence item to include.');
      return;
    }
    if (!privacyCheckConfirmed) {
      setFormError(
        'Please review and acknowledge the pre-share privacy & revocation check before generating a share token.'
      );
      return;
    }

    setFormError('');
    const daysNum = Number(expiryDays);
    const expiresDate = new Date(Date.now() + daysNum * 24 * 60 * 60 * 1000).toISOString();

    createSharePackage({
      caseId,
      recipientDescription: recipientDescription.trim(),
      includedEvidenceIds: selectedEvidenceIds,
      includedDerivativeIds: selectedDerivativeIds,
      permissions,
      expiresAt: expiresDate,
      privacyWarningAcknowledged: true,
    });

    setRecipientDescription('');
    setPrivacyCheckConfirmed(false);
  };

  const handleCopyShareReference = (share: SharePackage) => {
    // Never place evidence inside a URL — only a random token identifier
    const safeTokenUrl = `${window.location.origin}/cases/${caseId}/sharing?token=${share.shareToken}`;
    navigator.clipboard?.writeText(safeTokenUrl);
    setCopiedTokenId(share.id);
    setTimeout(() => setCopiedTokenId(null), 2000);
  };

  const handleOpenRecipientPreview = (share: SharePackage) => {
    if (share.status === 'Active') {
      recordShareView(share.id, 'Owner tested recipient token view in browser');
    }
    setPreviewingShare(share);
  };

  if (!currentCase) {
    return (
      <WorkspaceLayout breadcrumbs={[{ label: 'Selective Sharing' }]}>
        <p className="text-sm text-slate-600">Case not found.</p>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      breadcrumbs={[
        { label: 'Cases', to: '/cases' },
        { label: currentCase.title, to: `/cases/${caseId}` },
        { label: 'Selective Sharing' },
      ]}
    >
      <CaseSubNav caseId={caseId} />

      <div className="space-y-8">
        {/* Mandatory Revocation Limitation Banner */}
        <div
          role="alert"
          className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3 text-xs text-amber-950"
        >
          <ShieldAlert className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">
              Revoking access cannot undo files that someone has already downloaded, copied, or
              captured.
            </p>
            <p className="text-amber-900 leading-relaxed">
              Share only what is necessary, prefer <strong>Redacted Derivative Copies</strong> over
              unredacted originals when seeking third-party guidance, and use short expiry windows.
              Sahay never embeds evidence content inside URLs.
            </p>
          </div>
        </div>

        {/* Create Selective Share Form & Pre-Share Privacy Check */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 font-display">
                Create Selective Share Package
              </h1>
              <p className="text-xs text-slate-600 mt-0.5">
                Generate a cryptographically random share token with explicit permissions, expiry,
                and immediate revocation control.
              </p>
            </div>
            <Link
              to="/complaints"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap self-start"
            >
              <span>Next: Manual Complaint Tracker</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <form onSubmit={handleCreateShare} className="space-y-5" noValidate>
            {formError && (
              <div
                role="alert"
                className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-800"
              >
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label
                  htmlFor="share-recipient"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Recipient Description *
                </label>
                <input
                  id="share-recipient"
                  type="text"
                  value={recipientDescription}
                  onChange={(e) => setRecipientDescription(e.target.value)}
                  placeholder="e.g., Legal Aid Advocate / Cyber Support Helpline (Fictional)"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="share-expiry"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Token Expiry Window
                </label>
                <select
                  id="share-expiry"
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(e.target.value as '1' | '7' | '30')}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="1">Expires in 24 Hours</option>
                  <option value="7">Expires in 7 Days</option>
                  <option value="30">Expires in 30 Days</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="share-perms"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Access Permissions
                </label>
                <select
                  id="share-perms"
                  value={permissions}
                  onChange={(e) =>
                    setPermissions(e.target.value as 'view_only' | 'view_and_download')
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="view_only">View Only (Recommended)</option>
                  <option value="view_and_download">View &amp; Download</option>
                </select>
              </div>
            </div>

            {/* Item Selection: Redacted Derivatives vs Originals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Safer Redacted Derivatives */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-900">
                    Safer Option: Redacted Derivative Copies ({caseDerivatives.length})
                  </span>
                  <span className="text-xs font-mono text-emerald-800">Recommended</span>
                </div>
                {caseDerivatives.length === 0 ? (
                  <p className="text-xs text-slate-500">
                    No redacted copies yet.{' '}
                    <Link
                      to={`/cases/${caseId}/privacy`}
                      className="text-teal-800 underline"
                    >
                      Create one in Privacy &amp; Redaction
                    </Link>
                    .
                  </p>
                ) : (
                  <div className="space-y-2">
                    {caseDerivatives.map((d) => (
                      <label
                        key={d.id}
                        className="flex items-start gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDerivativeIds.includes(d.id)}
                          onChange={() => toggleDerivative(d.id)}
                          className="mt-0.5 accent-teal-800 rounded"
                        />
                        <div className="min-w-0">
                          <p className="font-mono font-semibold text-slate-900 truncate">
                            {d.derivativeFilename}
                          </p>
                          <p className="text-slate-500">
                            Redacted copy — original preserved ({d.redactedFindingsCount} items
                            masked)
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Unredacted Originals */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-900">
                    Unmodified Original Evidence ({caseEvidence.length})
                  </span>
                  <span className="text-xs text-amber-900 font-medium">
                    May contain personal info
                  </span>
                </div>
                <div className="space-y-2">
                  {caseEvidence.map((ev) => {
                    const riskCount = caseFindings.filter(
                      (pf) => pf.evidenceId === ev.id
                    ).length;
                    return (
                      <label
                        key={ev.id}
                        className="flex items-start gap-2.5 p-2.5 bg-white border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEvidenceIds.includes(ev.id)}
                          onChange={() => toggleOriginalEvidence(ev.id)}
                          className="mt-0.5 accent-teal-800 rounded"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {ev.originalFilename}
                          </p>
                          <p className="text-slate-500">
                            Original ({ev.evidenceType}) · {riskCount} possible privacy risk(s)
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Automatic Pre-Share Privacy Check Warning */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle
                  className="w-4 h-4 text-amber-800 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-900">
                    Pre-Share Privacy &amp; Revocation Check
                  </p>
                  {selectedOriginalsPrivacyRisks.length > 0 ? (
                    <p className="text-amber-900 font-medium leading-relaxed">
                      Caution: Your selection includes original evidence with{' '}
                      <strong>
                        {selectedOriginalsPrivacyRisks.length} detected possible privacy risk(s)
                      </strong>{' '}
                      ({selectedOriginalsPrivacyRisks.map((r) => r.findingType).slice(0, 4).join(', ')}
                      ). Consider sharing only Redacted Derivative copies unless the recipient
                      specifically requires unredacted originals.
                    </p>
                  ) : (
                    <p className="text-emerald-900">
                      Privacy check passed: Only redacted derivative copies (or originals without
                      detected findings) are currently selected.
                    </p>
                  )}
                </div>
              </div>

              <label className="flex items-start gap-2.5 text-xs font-medium text-slate-800 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={privacyCheckConfirmed}
                  onChange={(e) => setPrivacyCheckConfirmed(e.target.checked)}
                  className="mt-0.5 accent-teal-800 rounded"
                />
                <span>
                  I have reviewed the privacy check and understand that{' '}
                  <strong>
                    revoking access cannot undo files that someone has already downloaded, copied,
                    or captured.
                  </strong>
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Generate Secure Random Share Token</span>
              </button>
            </div>
          </form>
        </section>

        {/* Recipient Token View Simulator Modal/Panel */}
        {previewingShare && (
          <section
            aria-label="Recipient Share Token Preview"
            className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <p className="text-xs font-mono text-teal-300">
                  RECIPIENT TOKEN VIEW PREVIEW · TOKEN: {previewingShare.shareToken}
                </p>
                <h2 className="text-base font-semibold text-white mt-0.5">
                  Shared with: {previewingShare.recipientDescription}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingShare(null)}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                Close Preview
              </button>
            </div>

            {previewingShare.status !== 'Active' ? (
              <div className="p-6 bg-rose-950/70 border border-rose-700 rounded-xl text-center space-y-2">
                <Lock className="w-6 h-6 text-rose-300 mx-auto" aria-hidden="true" />
                <p className="text-sm font-semibold text-white">
                  Access Denied — Share Token is {previewingShare.status}
                </p>
                <p className="text-xs text-rose-200 max-w-md mx-auto">
                  This share token has been {previewingShare.status.toLowerCase()} by the case
                  owner or reached its expiration timestamp. Shared items are no longer accessible
                  via this token.
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-300">
                  Permissions:{' '}
                  <strong>
                    {previewingShare.permissions === 'view_only'
                      ? 'View Only (Download Disabled)'
                      : 'View & Download'}
                  </strong>{' '}
                  · Expires: {new Date(previewingShare.expiresAt).toLocaleString('en-IN')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {previewingShare.includedDerivativeIds.map((did) => {
                    const d = derivatives.find((x) => x.id === did);
                    if (!d) return null;
                    return (
                      <div
                        key={did}
                        className="p-3 bg-slate-800 border border-slate-700 rounded-lg space-y-1"
                      >
                        <p className="font-mono text-emerald-300">
                          Redacted copy — original preserved.
                        </p>
                        <p className="font-semibold text-white font-mono">
                          {d.derivativeFilename}
                        </p>
                        <p className="text-slate-400 font-mono">
                          SHA-256: {d.sha256Hash.slice(0, 20)}...
                        </p>
                      </div>
                    );
                  })}
                  {previewingShare.includedEvidenceIds.map((eid) => {
                    const ev = evidence.find((x) => x.id === eid);
                    if (!ev) return null;
                    return (
                      <div
                        key={eid}
                        className="p-3 bg-slate-800 border border-slate-700 rounded-lg space-y-1"
                      >
                        <p className="font-mono text-amber-300">Original Evidence Item</p>
                        <p className="font-semibold text-white font-mono">
                          {ev.originalFilename}
                        </p>
                        <p className="text-slate-400 font-mono">
                          SHA-256: {ev.sha256Hash.slice(0, 20)}...
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Active, Expired & Revoked Share Packages List + Access Log */}
        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Selective Share Tokens &amp; Access Logs ({caseShares.length})
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Inspect access logs, test recipient preview, or revoke any active share token
                immediately.
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {caseShares.map((sh) => {
              const currentShare = shares.find((x) => x.id === sh.id) || sh;
              return (
                <div key={currentShare.id} className="p-6 space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs tabular-nums">
                        {currentShare.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Active Token</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-semibold text-rose-800">
                            <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{currentShare.status}</span>
                          </span>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600">
                          Permissions:{' '}
                          <strong>
                            {currentShare.permissions === 'view_only'
                              ? 'View Only'
                              : 'View & Download'}
                          </strong>
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-600 font-mono">
                          Expires: {new Date(currentShare.expiresAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-slate-900">
                        Recipient: {currentShare.recipientDescription}
                      </h3>

                      <p className="text-xs font-mono text-slate-500 break-all">
                        Random Token ID (No Evidence in URL): {currentShare.shareToken}
                      </p>
                    </div>

                    {/* Controls: Preview, Copy Token, Simulate Expiry, Revoke */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenRecipientPreview(currentShare)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Preview Recipient View</span>
                      </button>

                      {currentShare.status === 'Active' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleCopyShareReference(currentShare)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                          >
                            {copiedTokenId === currentShare.id ? (
                              <>
                                <Check
                                  className="w-3.5 h-3.5 text-emerald-700"
                                  aria-hidden="true"
                                />
                                <span>Copied Token Link</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Copy Token Link</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => simulateShareExpire(currentShare.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-900 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 cursor-pointer"
                          >
                            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Test Expiry</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => revokeSharePackage(currentShare.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-800 rounded-lg hover:bg-rose-900 transition-colors cursor-pointer"
                          >
                            <Ban className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Revoke Access Now</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Included Items */}
                  <div className="text-xs text-slate-600">
                    <strong>Shared Items:</strong>{' '}
                    {currentShare.includedDerivativeIds.length} redacted derivative(s),{' '}
                    {currentShare.includedEvidenceIds.length} original evidence file(s).
                  </div>

                  {/* Access Log */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <p className="text-xs font-mono font-semibold text-slate-700">
                      TOKEN ACCESS LOG ({currentShare.accessLog.length} EVENTS)
                    </p>
                    <div className="space-y-1.5 text-xs">
                      {currentShare.accessLog.map((log) => (
                        <div
                          key={log.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-600 font-mono tabular-nums"
                        >
                          <span>
                            <strong className="text-slate-900 font-sans">{log.event}:</strong>{' '}
                            <span className="font-sans">{log.actorNote}</span>
                          </span>
                          <span className="text-slate-500">
                            {new Date(log.timestamp).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </WorkspaceLayout>
  );
};
