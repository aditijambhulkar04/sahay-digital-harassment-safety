import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Clock,
  Plus,
  X,
  FileSearch,
  ExternalLink,
  ArrowRight,
  UserCheck,
  Database,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { CaseSubNav } from '../components/CaseSubNav';
import { useSahay } from '../context/SahayContext';
import { IncidentDatePrecision } from '../types/sahay';
import { validateSafeUrl } from '../utils/cryptoAndPrivacy';

export const CaseTimelinePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { cases, evidence, timeline, setActiveCaseId, addTimelineEvent } = useSahay();

  const currentCase = cases.find((c) => c.id === id) || cases[0];
  const caseId = currentCase?.id || '';
  const caseEvidence = evidence.filter((e) => e.caseId === caseId);
  const caseTimeline = timeline.filter((t) => t.caseId === caseId);

  const [showAddForm, setShowAddForm] = useState(false);
  const [datePrecision, setDatePrecision] = useState<IncidentDatePrecision>('exact');
  const [eventDate, setEventDate] = useState('2026-09-20');
  const [eventTime, setEventTime] = useState('');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(currentCase?.platform || '');
  const [account, setAccount] = useState(currentCase?.account || '');
  const [userEnteredFact, setUserEnteredFact] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [selectedEvIds, setSelectedEvIds] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (caseId) setActiveCaseId(caseId);
  }, [caseId, setActiveCaseId]);

  const toggleEvidenceLink = (evId: string) => {
    setSelectedEvIds((prev) =>
      prev.includes(evId) ? prev.filter((item) => item !== evId) : [...prev, evId]
    );
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide a short event title.');
      return;
    }
    if (!userEnteredFact.trim()) {
      setFormError('Please enter your factual description of what happened.');
      return;
    }

    const urlCheck = validateSafeUrl(sourceUrl);
    if (!urlCheck.valid) {
      setFormError(urlCheck.reason || 'Invalid source URL.');
      return;
    }

    setFormError('');

    const resolvedDate =
      datePrecision === 'unknown'
        ? 'Unknown date'
        : eventDate.trim() || 'Approximate date not specified';

    addTimelineEvent({
      caseId,
      datePrecision,
      eventDate: resolvedDate,
      eventTime: eventTime.trim() || undefined,
      title: title.trim(),
      platform: platform.trim() || 'Unspecified Platform',
      account: account.trim() || 'Unspecified Account',
      userEnteredFact: userEnteredFact.trim(),
      sourceUrl: sourceUrl.trim() || undefined,
      linkedEvidenceIds: selectedEvIds,
    });

    setTitle('');
    setUserEnteredFact('');
    setSourceUrl('');
    setEventTime('');
    setSelectedEvIds([]);
    setShowAddForm(false);
  };

  if (!currentCase) {
    return (
      <WorkspaceLayout breadcrumbs={[{ label: 'Timeline' }]}>
        <p className="text-sm text-slate-600">Case not found.</p>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout
      breadcrumbs={[
        { label: 'Cases', to: '/cases' },
        { label: currentCase.title, to: `/cases/${caseId}` },
        { label: 'Chronological Timeline' },
      ]}
      actions={
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer whitespace-nowrap"
        >
          {showAddForm ? (
            <>
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Add Timeline Event</span>
            </>
          )}
        </button>
      }
    >
      <CaseSubNav caseId={caseId} />

      <div className="space-y-6">
        {/* Header & Legend */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-teal-800">
                <span>CHRONOLOGICAL INCIDENT LOG</span>
                <span aria-hidden="true">·</span>
                <span>NO INVENTED DATES OR FACTS</span>
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                Incident Timeline — {currentCase.title}
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Organize events in chronological order. Sahay explicitly separates your
                user-entered facts, linked evidence references, and system-generated preservation
                metadata.
              </p>
            </div>

            <Link
              to={`/cases/${caseId}/privacy`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap self-start"
            >
              <span>Next: Privacy Scanner &amp; Redaction</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          {/* Explicit Legend for the 3 Data Provenance Layers */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <UserCheck className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-900">1. User-Entered Facts</p>
                <p className="text-slate-600 mt-0.5">
                  Your direct description, date precision (exact/approximate/unknown), and source
                  links.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <FileSearch className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-900">2. Evidence References</p>
                <p className="text-slate-600 mt-0.5">
                  Links to preserved files in your Evidence Vault with SHA-256 verification.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <Database className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-semibold text-slate-900">3. System-Generated Metadata</p>
                <p className="text-slate-600 mt-0.5">
                  Sahay vault entry timestamp and cryptographic hash reference.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Add Timeline Event Form */}
        {showAddForm && (
          <section
            aria-label="Add timeline event"
            className="bg-white border border-slate-300 rounded-xl p-6 space-y-4"
          >
            <h2 className="text-base font-semibold text-slate-900">
              Log Chronological Timeline Event
            </h2>

            <form onSubmit={handleAddEvent} className="space-y-4" noValidate>
              {formError && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-800"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="tl-precision"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Date Precision
                  </label>
                  <select
                    id="tl-precision"
                    value={datePrecision}
                    onChange={(e) =>
                      setDatePrecision(e.target.value as IncidentDatePrecision)
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="exact">Exact Date</option>
                    <option value="approximate">Approximate Date</option>
                    <option value="unknown">Unknown Date</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="tl-date"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    {datePrecision === 'exact'
                      ? 'Exact Date'
                      : datePrecision === 'approximate'
                      ? 'Approximate Date / Range'
                      : 'Date Unknown'}
                  </label>
                  {datePrecision === 'exact' ? (
                    <input
                      id="tl-date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                    />
                  ) : (
                    <input
                      id="tl-date"
                      type="text"
                      disabled={datePrecision === 'unknown'}
                      value={datePrecision === 'unknown' ? 'Unknown' : eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      placeholder="e.g., Around 14 Sep 2026"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg disabled:bg-slate-100"
                    />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tl-time"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Time if Known (Optional)
                  </label>
                  <input
                    id="tl-time"
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g., 21:40 IST or Late evening"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="tl-title"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Event Heading *
                  </label>
                  <input
                    id="tl-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., 20 Sep 2026 — Follow-up message"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tl-platform"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Platform
                  </label>
                  <input
                    id="tl-platform"
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="e.g., DirectGram (Fictional)"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label
                    htmlFor="tl-account"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Account / Handle (Fictional)
                  </label>
                  <input
                    id="tl-account"
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="e.g., @arjun_v_demo99"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="tl-fact"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  User-Entered Fact Description *
                </label>
                <textarea
                  id="tl-fact"
                  rows={3}
                  value={userEnteredFact}
                  onChange={(e) => setUserEnteredFact(e.target.value)}
                  placeholder="Describe only what you observed or experienced..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label
                  htmlFor="tl-url"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Source URL (Optional, http:// or https://)
                </label>
                <input
                  id="tl-url"
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://chatterbox.example.com/..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-mono"
                />
              </div>

              {/* Link Evidence Checkboxes */}
              {caseEvidence.length > 0 && (
                <div>
                  <span className="block text-xs font-medium text-slate-700 mb-1.5">
                    Link Preserved Evidence Items (Optional):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {caseEvidence.map((ev) => (
                      <label
                        key={ev.id}
                        className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedEvIds.includes(ev.id)}
                          onChange={() => toggleEvidenceLink(ev.id)}
                          className="accent-teal-800 rounded"
                        />
                        <span className="truncate font-medium text-slate-800">
                          {ev.originalFilename}
                        </span>
                        <span className="font-mono text-slate-500 ml-auto shrink-0">
                          {ev.id}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 cursor-pointer"
                >
                  Save Timeline Entry
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Chronological Timeline List */}
        <section className="space-y-4">
          {caseTimeline.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
              <p className="text-sm font-medium text-slate-800">
                No timeline events recorded for this case yet.
              </p>
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg cursor-pointer"
              >
                Add First Event
              </button>
            </div>
          ) : (
            caseTimeline.map((item, idx) => {
              const linkedEvObjects = caseEvidence.filter((e) =>
                item.linkedEvidenceIds.includes(e.id)
              );

              return (
                <article
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
                >
                  {/* Top Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 tabular-nums">
                      <span className="font-mono font-semibold text-teal-900">
                        Event 0{idx + 1}
                      </span>
                      <span aria-hidden="true">·</span>
                      <Clock className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                      <span className="font-mono font-semibold text-slate-900">
                        {item.eventDate}
                      </span>
                      {item.eventTime && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-800">{item.eventTime}</span>
                        </>
                      )}
                      <span aria-hidden="true">·</span>
                      <span>Date precision: {item.datePrecision}</span>
                    </div>

                    <div className="text-xs text-slate-500">
                      Platform: <strong className="text-slate-800">{item.platform}</strong> ·
                      Account:{' '}
                      <span className="font-mono font-medium text-slate-900">{item.account}</span>
                    </div>
                  </div>

                  {/* 1. User-Entered Fact Block */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-mono text-teal-800 font-medium">
                      USER-ENTERED FACT
                    </p>
                    <h2 className="text-base font-semibold text-slate-900">{item.title}</h2>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {item.userEnteredFact}
                    </p>
                    {item.sourceUrl && (
                      <p className="pt-1 text-xs font-mono text-slate-600 flex items-center gap-1.5 break-all">
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Recorded Source URL: {item.sourceUrl}</span>
                      </p>
                    )}
                  </div>

                  {/* 2. Evidence References Block */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <p className="text-xs font-mono text-slate-700 font-medium">
                      EVIDENCE REFERENCES ({linkedEvObjects.length})
                    </p>
                    {linkedEvObjects.length === 0 ? (
                      <p className="text-xs text-slate-500">
                        No vault file linked to this event.
                      </p>
                    ) : (
                      <div className="space-y-1.5">
                        {linkedEvObjects.map((ev) => (
                          <div
                            key={ev.id}
                            className="flex flex-wrap items-center justify-between gap-2 text-xs"
                          >
                            <Link
                              to={`/cases/${caseId}/evidence`}
                              className="font-medium text-teal-900 hover:underline underline-offset-2 flex items-center gap-1.5"
                            >
                              <FileSearch className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{ev.originalFilename}</span>
                            </Link>
                            <span className="font-mono text-slate-500 tabular-nums">
                              ID: {ev.id} · SHA-256: {ev.sha256Hash.slice(0, 16)}...
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 3. System-Generated Metadata Block */}
                  <div className="pt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 font-mono tabular-nums">
                    <span>SYSTEM METADATA: {item.systemMetadataNote}</span>
                    <span>Entry ID: {item.id}</span>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </WorkspaceLayout>
  );
};
