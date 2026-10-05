import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileSearch,
  EyeOff,
  FileText,
  Share2,
  Save,
  ArrowRight,
  History,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { CaseSubNav } from '../components/CaseSubNav';
import { useSahay } from '../context/SahayContext';
import { CaseStatus, SafeActionState } from '../types/sahay';

export const CaseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    cases,
    evidence,
    timeline,
    privacyFindings,
    derivatives,
    safeActions,
    auditLogs,
    setActiveCaseId,
    updateCaseStatus,
    updateCaseNotes,
    updateSafeAction,
  } = useSahay();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const caseId = currentCase?.id || '';

  const [notesDraft, setNotesDraft] = useState(currentCase?.notes || '');
  const [notesSavedFeedback, setNotesSavedFeedback] = useState(false);
  const [actionFilter, setActionFilter] = useState<'ALL' | SafeActionState>('ALL');

  useEffect(() => {
    if (caseId) {
      setActiveCaseId(caseId);
    }
  }, [caseId, setActiveCaseId]);

  useEffect(() => {
    if (currentCase) {
      setNotesDraft(currentCase.notes);
    }
  }, [currentCase]);

  if (!currentCase) {
    return (
      <WorkspaceLayout breadcrumbs={[{ label: 'Case Not Found' }]}>
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
          <h1 className="text-lg font-semibold text-slate-900">Case Not Found</h1>
          <p className="text-sm text-slate-600">
            The requested case ID does not exist in your local browser vault.
          </p>
          <Link
            to="/cases"
            className="inline-block px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg"
          >
            Back to Cases
          </Link>
        </div>
      </WorkspaceLayout>
    );
  }

  const caseEvidence = evidence.filter((e) => e.caseId === caseId);
  const caseTimeline = timeline.filter((t) => t.caseId === caseId);
  const casePrivacy = privacyFindings.filter((p) => p.caseId === caseId);
  const caseDerivatives = derivatives.filter((d) => d.caseId === caseId);
  const caseActions = safeActions.filter((a) => a.caseId === caseId);
  const caseAudits = auditLogs.filter((l) => !l.caseId || l.caseId === caseId);

  const filteredActions = caseActions.filter(
    (a) => actionFilter === 'ALL' || a.state === actionFilter
  );

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    updateCaseNotes(caseId, notesDraft);
    setNotesSavedFeedback(true);
    setTimeout(() => setNotesSavedFeedback(false), 2500);
  };

  return (
    <WorkspaceLayout
      breadcrumbs={[
        { label: 'Cases', to: '/cases' },
        { label: currentCase.title },
      ]}
    >
      <CaseSubNav caseId={caseId} />

      <div className="space-y-8">
        {/* Case Header & Metadata Card */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
              <span className="font-mono">{currentCase.id}</span>
              <span aria-hidden="true">·</span>
              <span>{currentCase.category}</span>
              <span aria-hidden="true">·</span>
              <span>
                Incident Date ({currentCase.incidentDateType}):{' '}
                <strong className="font-mono text-slate-800">{currentCase.incidentDate}</strong>
              </span>
              {currentCase.isDemo && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-amber-900 font-medium">
                    DEMO DATA — FICTIONAL
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="status-select" className="text-xs font-medium text-slate-600">
                Status:
              </label>
              <select
                id="status-select"
                value={currentCase.status}
                onChange={(e) =>
                  updateCaseStatus(caseId, e.target.value as CaseStatus)
                }
                className="px-2.5 py-1.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              >
                <option value="Active — Preserving Evidence">
                  Active — Preserving Evidence
                </option>
                <option value="Ready for Review">Ready for Review</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-slate-900 font-display">
              {currentCase.title}
            </h1>
            <p className="mt-1 text-xs text-slate-600">
              Platform: <strong>{currentCase.platform}</strong> · Reported Account:{' '}
              <span className="font-mono font-medium text-slate-900">{currentCase.account}</span>
            </p>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">{currentCase.description}</p>

          {/* Quick Workflow Cards Row */}
          <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <Link
              to={`/cases/${caseId}/evidence`}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Evidence Vault</span>
                <FileSearch className="w-4 h-4 text-teal-800" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs text-slate-600 tabular-nums">
                {caseEvidence.length} originals · SHA-256 &amp; OCR
              </p>
            </Link>

            <Link
              to={`/cases/${caseId}/timeline`}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Incident Timeline</span>
                <Clock className="w-4 h-4 text-teal-800" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs text-slate-600 tabular-nums">
                {caseTimeline.length} chronological entries
              </p>
            </Link>

            <Link
              to={`/cases/${caseId}/privacy`}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Privacy &amp; Redact</span>
                <EyeOff className="w-4 h-4 text-amber-800" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs text-slate-600 tabular-nums">
                {casePrivacy.length} risks · {caseDerivatives.length} redacted copies
              </p>
            </Link>

            <Link
              to={`/cases/${caseId}/reports`}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Report &amp; NCRP</span>
                <FileText className="w-4 h-4 text-teal-800" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Structured export &amp; prep checklist
              </p>
            </Link>

            <Link
              to={`/cases/${caseId}/sharing`}
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors flex flex-col justify-between"
            >
              <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                <span>Selective Share</span>
                <Share2 className="w-4 h-4 text-teal-800" aria-hidden="true" />
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Token links, expiry &amp; revoke
              </p>
            </Link>
          </div>
        </section>

        {/* Safe-Action Center */}
        <section
          aria-label="Safe-Action Center"
          className="bg-white border border-slate-200 rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-teal-800" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 font-display">
                    Safe-Action Center
                  </h2>
                  <p className="text-xs text-slate-600">
                    Calm, deterministic recommendations based on your case context. You choose what
                    to review, select, or mark completed.
                  </p>
                </div>
              </div>

              {/* Filter by state */}
              <div
                role="group"
                aria-label="Filter safe actions by state"
                className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start"
              >
                {(['ALL', 'Suggested', 'User selected', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setActionFilter(st)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      actionFilter === st
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st === 'ALL' ? 'All Steps' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600">
              <strong>Agency &amp; Privacy Guarantee:</strong> Selecting or completing a step here
              only updates your local checklist. Sahay <strong>never</strong> contacts any platform,
              account, police station, or government authority automatically.
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {filteredActions.map((action) => (
              <div key={action.id} className="p-6 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{action.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-900">
                      Current state: {action.state}
                    </span>
                    {action.updatedAt && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">
                          Updated {new Date(action.updatedAt).toLocaleDateString('en-IN')}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Interactive State Selector Buttons */}
                  <div
                    role="group"
                    aria-label={`Change state for ${action.title}`}
                    className="flex items-center gap-1.5"
                  >
                    {(['Suggested', 'User selected', 'Completed'] as SafeActionState[]).map(
                      (st) => {
                        const active = action.state === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => updateSafeAction(action.id, st)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                              active
                                ? st === 'Completed'
                                  ? 'bg-emerald-800 text-white border-emerald-800'
                                  : st === 'User selected'
                                  ? 'bg-teal-800 text-white border-teal-800'
                                  : 'bg-slate-900 text-white border-slate-900'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {st === 'Completed' && active && (
                              <CheckCircle2
                                className="w-3 h-3 inline mr-1 -mt-0.5"
                                aria-hidden="true"
                              />
                            )}
                            {st}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <h3 className="text-base font-semibold text-slate-900">{action.title}</h3>
                <p className="text-sm text-slate-700 leading-relaxed">{action.calmGuidance}</p>
                <p className="text-xs text-slate-500">
                  <strong>Why suggested:</strong> {action.whySuggested}
                </p>

                <div className="pt-1">
                  <label
                    htmlFor={`note-${action.id}`}
                    className="block text-xs font-medium text-slate-600 mb-1"
                  >
                    Your Personal Note for this Step (Optional):
                  </label>
                  <input
                    id={`note-${action.id}`}
                    type="text"
                    value={action.userNote || ''}
                    onChange={(e) =>
                      updateSafeAction(action.id, action.state, e.target.value)
                    }
                    placeholder="Add a personal note (e.g., Completed on 19 Sep; saved backup codes)..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom 2-Column: Case Notes + Case Audit Trail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Case Notes Editor */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Case Notes &amp; Context</h2>
              {notesSavedFeedback && (
                <span className="text-xs font-medium text-emerald-800">
                  Notes saved to local vault
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600">
              Record personal context, witness names (fictional in demo), or questions you want to
              ask a support counselor. You can optionally include these notes in your Report Builder.
            </p>
            <form onSubmit={handleSaveNotes} className="space-y-3">
              <label htmlFor="case-notes-editor" className="sr-only">
                Case notes
              </label>
              <textarea
                id="case-notes-editor"
                rows={5}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
              />
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save Notes</span>
                </button>

                <Link
                  to={`/cases/${caseId}/evidence`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:underline underline-offset-4"
                >
                  <span>Next: Evidence Vault &amp; SHA-256</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </form>
          </section>

          {/* Case Audit Log */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-700" aria-hidden="true" />
                <h2 className="text-base font-semibold text-slate-900">
                  Local Preservation Audit Trail
                </h2>
              </div>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {caseAudits.length} events
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Chronological log of evidence uploads, SHA-256 integrity checks, OCR transcript edits,
              and derivative redactions.
            </p>
            <div className="max-h-60 overflow-y-auto divide-y divide-slate-200 border border-slate-200 rounded-lg">
              {caseAudits.slice(0, 12).map((aud) => (
                <div key={aud.id} className="p-3 text-xs space-y-0.5 bg-slate-50/50">
                  <div className="flex items-center justify-between text-slate-500 font-mono tabular-nums">
                    <span className="font-semibold text-slate-800 font-sans">{aud.action}</span>
                    <span>{new Date(aud.timestamp).toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-slate-600">{aud.details}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
