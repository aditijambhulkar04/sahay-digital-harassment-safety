import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Plus,
  FileSearch,
  Clock,
  EyeOff,
  FileText,
  Share2,
  ClipboardList,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useSahay } from '../context/SahayContext';
import { DEMO_CASE_ID } from '../data/demoData';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cases,
    evidence,
    timeline,
    privacyFindings,
    derivatives,
    safeActions,
    complaints,
    shares,
    setActiveCaseId,
    resetDemoVault,
  } = useSahay();

  const primaryCase = cases[0];
  const highRiskCount = privacyFindings.filter((f) => f.riskLevel === 'High').length;
  const completedActions = safeActions.filter((a) => a.state === 'Completed').length;
  const selectedActions = safeActions.filter((a) => a.state === 'User selected').length;

  return (
    <WorkspaceLayout
      breadcrumbs={[{ label: 'Dashboard' }]}
      actions={
        <Link
          to="/cases?new=true"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Create Case</span>
        </Link>
      }
    >
      <div className="space-y-8">
        {/* Welcome & Guided Demo Journey Strip */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
                <span>SAHAY WORKSPACE OVERVIEW</span>
                <span aria-hidden="true">·</span>
                <span className="text-amber-900 font-medium">DEMO DATA — FICTIONAL</span>
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                Digital Harassment Safety &amp; Evidence Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Organize evidence with SHA-256 verification, review possible privacy exposures,
                prepare redacted copies, and choose safe next steps at your own pace.
              </p>
            </div>

            {primaryCase ? (
              <button
                type="button"
                onClick={() => {
                  setActiveCaseId(primaryCase.id);
                  navigate(`/cases/${primaryCase.id}`);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
              >
                <span>Open Active Case</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={resetDemoVault}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Restore Fictional Demo Case</span>
              </button>
            )}
          </div>

          {/* Complete Demo Journey Quick-Jump Bar */}
          {primaryCase && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500 mb-2.5">
                Interactive Demo Journey — Click any stage to inspect or act:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/cases/${primaryCase.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  1. Case &amp; Safe Actions
                </Link>
                <span className="text-slate-300" aria-hidden="true">
                  →
                </span>
                <Link
                  to={`/cases/${primaryCase.id}/timeline`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  2. Timeline (4 Events)
                </Link>
                <span className="text-slate-300" aria-hidden="true">
                  →
                </span>
                <Link
                  to={`/cases/${primaryCase.id}/evidence`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  3. Evidence, SHA-256 &amp; OCR
                </Link>
                <span className="text-slate-300" aria-hidden="true">
                  →
                </span>
                <Link
                  to={`/cases/${primaryCase.id}/privacy`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  4. Privacy Scan &amp; Redaction
                </Link>
                <span className="text-slate-300" aria-hidden="true">
                  →
                </span>
                <Link
                  to={`/cases/${primaryCase.id}/reports`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  5. Report &amp; Official NCRP Prep
                </Link>
                <span className="text-slate-300" aria-hidden="true">
                  →
                </span>
                <Link
                  to={`/cases/${primaryCase.id}/sharing`}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  6. Selective Share &amp; Revoke
                </Link>
                <span className="text-slate-300" aria-hidden="true">
                  →
                </span>
                <Link
                  to="/complaints"
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors whitespace-nowrap"
                >
                  7. Complaint Tracker
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Key Tabular Metrics Row (Single-Elevation) */}
        <section
          aria-label="Summary metrics"
          className="bg-white border border-slate-200 rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Active Cases</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {cases.length}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {timeline.length} chronological events logged
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Preserved Evidence Vault</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {evidence.length}
            </p>
            <p className="mt-1 text-xs text-emerald-800 font-medium">
              All originals locked with SHA-256
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Possible Privacy Findings</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {privacyFindings.length}
            </p>
            <p className="mt-1 text-xs text-amber-900">
              {highRiskCount} high-sensitivity · {derivatives.length} redacted copies
            </p>
          </div>

          <div className="p-5">
            <p className="text-xs font-medium text-slate-500">Safe Actions &amp; Complaints</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900 font-mono tabular-nums">
              {completedActions + selectedActions}/{safeActions.length}
            </p>
            <p className="mt-1 text-xs text-slate-600">
              {complaints.length} manual complaints · {shares.filter((s) => s.status === 'Active').length} active share
            </p>
          </div>
        </section>

        {/* Main 2-Column Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Active Cases + Recent Evidence + Timeline Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Cases */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">Active Cases</h2>
                <Link
                  to="/cases"
                  className="text-xs font-medium text-teal-800 hover:underline underline-offset-4"
                >
                  View all / Create new
                </Link>
              </div>

              {cases.length === 0 ? (
                <div className="p-8 text-center space-y-3">
                  <p className="text-sm text-slate-600">No cases currently in your local vault.</p>
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      to="/cases?new=true"
                      className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg"
                    >
                      Create Fictional Case
                    </Link>
                    <button
                      type="button"
                      onClick={resetDemoVault}
                      className="px-4 py-2 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg cursor-pointer"
                    >
                      Load Demo Case
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {cases.map((c) => {
                    const caseEvCount = evidence.filter((e) => e.caseId === c.id).length;
                    const caseTlCount = timeline.filter((t) => t.caseId === c.id).length;
                    const casePfCount = privacyFindings.filter((p) => p.caseId === c.id).length;

                    return (
                      <div key={c.id} className="p-6 space-y-3 hover:bg-slate-50/70 transition-colors">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                          <span>{c.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{c.status}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Incident ({c.incidentDateType}): {c.incidentDate}
                          </span>
                          {c.isDemo && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono text-amber-900 font-medium">
                                DEMO DATA — FICTIONAL
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <Link
                              to={`/cases/${c.id}`}
                              onClick={() => setActiveCaseId(c.id)}
                              className="text-lg font-semibold text-slate-900 hover:text-teal-800 transition-colors"
                            >
                              {c.title}
                            </Link>
                            <p className="mt-1 text-xs text-slate-600">
                              Platform: {c.platform} · Account: <span className="font-mono">{c.account}</span>
                            </p>
                          </div>

                          <Link
                            to={`/cases/${c.id}`}
                            onClick={() => setActiveCaseId(c.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap self-start"
                          >
                            <span>Open Case</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </Link>
                        </div>

                        <p className="text-sm text-slate-700 leading-relaxed">{c.description}</p>

                        <div className="pt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-600 tabular-nums">
                          <Link
                            to={`/cases/${c.id}/evidence`}
                            className="hover:text-slate-900 underline underline-offset-4"
                          >
                            {caseEvCount} Evidence Items
                          </Link>
                          <Link
                            to={`/cases/${c.id}/timeline`}
                            className="hover:text-slate-900 underline underline-offset-4"
                          >
                            {caseTlCount} Timeline Events
                          </Link>
                          <Link
                            to={`/cases/${c.id}/privacy`}
                            className="hover:text-slate-900 underline underline-offset-4"
                          >
                            {casePfCount} Possible Privacy Risks
                          </Link>
                          <Link
                            to={`/cases/${c.id}/reports`}
                            className="hover:text-slate-900 underline underline-offset-4"
                          >
                            Report Builder
                          </Link>
                          <Link
                            to={`/cases/${c.id}/sharing`}
                            className="hover:text-slate-900 underline underline-offset-4"
                          >
                            Selective Sharing
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Recent Evidence Vault Items */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-slate-700" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-900">
                    Recent Preserved Evidence
                  </h2>
                </div>
                {primaryCase && (
                  <Link
                    to={`/cases/${primaryCase.id}/evidence`}
                    className="text-xs font-medium text-teal-800 hover:underline underline-offset-4"
                  >
                    Open Evidence Vault
                  </Link>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                      <th className="py-3 px-4">Filename</th>
                      <th className="py-3 px-4">Type &amp; Size</th>
                      <th className="py-3 px-4">SHA-256 Fingerprint</th>
                      <th className="py-3 px-4">Integrity Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    {evidence.slice(0, 5).map((ev) => (
                      <tr key={ev.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <Link
                            to={`/cases/${ev.caseId}/evidence`}
                            className="hover:text-teal-800 hover:underline underline-offset-2"
                          >
                            {ev.originalFilename}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-slate-600 tabular-nums">
                          {ev.evidenceType.toUpperCase()} · {(ev.sizeBytes / 1024).toFixed(1)} KB
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 tabular-nums">
                          {ev.sha256Hash.slice(0, 18)}...
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Original Locked</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Recent Timeline Activity */}
            <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-700" aria-hidden="true" />
                  <h2 className="text-base font-semibold text-slate-900">
                    Chronological Timeline Activity
                  </h2>
                </div>
                {primaryCase && (
                  <Link
                    to={`/cases/${primaryCase.id}/timeline`}
                    className="text-xs font-medium text-teal-800 hover:underline underline-offset-4"
                  >
                    Manage Timeline
                  </Link>
                )}
              </div>

              <div className="divide-y divide-slate-200">
                {timeline.slice(0, 4).map((ev) => (
                  <div key={ev.id} className="px-6 py-4 space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                      <span className="font-mono font-medium text-slate-800">{ev.eventDate}</span>
                      {ev.eventTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{ev.eventTime}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>{ev.platform}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{ev.account}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">{ev.title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{ev.userEnteredFact}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Privacy Findings, Safe Actions, Reports & Complaints */}
          <div className="space-y-8">
            {/* Privacy Findings Summary */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-amber-800" aria-hidden="true" />
                  <h2 className="text-sm font-semibold text-slate-900">
                    Privacy Scanner Findings
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-600 tabular-nums">
                  {privacyFindings.length} total
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic local scan detects possible personal identifiers so you can create
                separate redacted copies before sharing.
              </p>

              <div className="space-y-2.5">
                {privacyFindings.slice(0, 4).map((pf) => (
                  <div
                    key={pf.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-slate-900">{pf.findingType}</span>
                      <span className="inline-flex items-center gap-1 text-amber-900 font-medium">
                        <AlertTriangle className="w-3 h-3" aria-hidden="true" />
                        <span>Possible risk ({pf.riskLevel})</span>
                      </span>
                    </div>
                    <p className="font-mono text-slate-700">{pf.maskedPreview}</p>
                    <p className="text-slate-500 truncate">{pf.evidenceFilename}</p>
                  </div>
                ))}
              </div>

              {primaryCase && (
                <Link
                  to={`/cases/${primaryCase.id}/privacy`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <span>Review Findings &amp; Redact</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              )}
            </section>

            {/* Safe Actions Summary */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-800" aria-hidden="true" />
                  <h2 className="text-sm font-semibold text-slate-900">Safe-Action Center</h2>
                </div>
                <span className="text-xs text-slate-500 tabular-nums">
                  {completedActions} completed
                </span>
              </div>

              <div className="space-y-2.5">
                {safeActions.slice(0, 4).map((sa) => (
                  <div
                    key={sa.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2 text-slate-500">
                      <span>{sa.category}</span>
                      <span className="font-semibold text-slate-800">{sa.state}</span>
                    </div>
                    <p className="font-medium text-slate-900">{sa.title}</p>
                  </div>
                ))}
              </div>

              {primaryCase && (
                <Link
                  to={`/cases/${primaryCase.id}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  <span>Manage Safe Actions</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              )}
            </section>

            {/* Reports, Sharing & Complaint Tracker */}
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Reports, Sharing &amp; Complaint Tracker
              </h2>

              <div className="space-y-2 text-xs">
                {primaryCase && (
                  <>
                    <Link
                      to={`/cases/${primaryCase.id}/reports`}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <span className="inline-flex items-center gap-2 font-medium text-slate-900">
                        <FileText className="w-4 h-4 text-teal-800" aria-hidden="true" />
                        <span>Structured Report &amp; NCRP Prep</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    </Link>

                    <Link
                      to={`/cases/${primaryCase.id}/sharing`}
                      className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <span className="inline-flex items-center gap-2 font-medium text-slate-900">
                        <Share2 className="w-4 h-4 text-teal-800" aria-hidden="true" />
                        <span>
                          Selective Sharing ({shares.filter((s) => s.status === 'Active').length} active)
                        </span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                    </Link>
                  </>
                )}

                <Link
                  to="/complaints"
                  className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <span className="inline-flex items-center gap-2 font-medium text-slate-900">
                    <ClipboardList className="w-4 h-4 text-teal-800" aria-hidden="true" />
                    <span>Manual Complaint Tracker ({complaints.length})</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
