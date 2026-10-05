import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, Search, ArrowRight, FolderPlus, X } from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useSahay } from '../context/SahayContext';
import { CaseStatus, IncidentDatePrecision } from '../types/sahay';

export const CasesPage: React.FC = () => {
  const { cases, evidence, timeline, addCase, setActiveCaseId, resetDemoVault } = useSahay();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [showCreateForm, setShowCreateForm] = useState(
    searchParams.get('new') === 'true'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Repeated Unwanted Contact & Doxxing');
  const [description, setDescription] = useState('');
  const [incidentDateType, setIncidentDateType] = useState<IncidentDatePrecision>('exact');
  const [incidentDate, setIncidentDate] = useState('2026-09-25');
  const [platform, setPlatform] = useState('');
  const [account, setAccount] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<CaseStatus>('Active — Preserving Evidence');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowCreateForm(true);
    }
  }, [searchParams]);

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please provide a fictional case title.');
      return;
    }
    if (!description.trim()) {
      setFormError('Please enter a brief description of what happened.');
      return;
    }
    setFormError('');

    const resolvedDate =
      incidentDateType === 'unknown'
        ? 'Unknown date'
        : incidentDate.trim() || 'Approximate date not specified';

    const created = addCase({
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      incidentDateType,
      incidentDate: resolvedDate,
      platform: platform.trim() || 'Unspecified Platform (Fictional)',
      account: account.trim() || '@unknown_handle_demo',
      notes: notes.trim(),
      status,
      isDemo: true,
    });

    setShowCreateForm(false);
    setSearchParams({});
    navigate(`/cases/${created.id}`);
  };

  const filteredCases = cases.filter((c) => {
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.platform.toLowerCase().includes(q) ||
      c.account.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <WorkspaceLayout
      breadcrumbs={[{ label: 'Cases' }]}
      actions={
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer whitespace-nowrap"
        >
          {showCreateForm ? (
            <>
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Create Case</span>
            </>
          )}
        </button>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 font-display">
              Case Management
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Create and organize fictional incident folders. Each case isolates its own evidence
              vault, chronological timeline, privacy scan, and reports.
            </p>
          </div>
        </div>

        {/* Create Fictional Case Form */}
        {showCreateForm && (
          <section
            aria-label="Create new fictional case"
            className="bg-white border border-slate-300 rounded-xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Create New Fictional Case
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Please use only fictional names, handles, and sample details in this prototype.
                </p>
              </div>
              <span className="text-xs font-mono text-amber-900">DEMO DATA — FICTIONAL</span>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4" noValidate>
              {formError && (
                <div
                  role="alert"
                  className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs font-medium text-rose-800"
                >
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="case-title"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Case Title *
                  </label>
                  <input
                    id="case-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Impersonation Account — Demo Case"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-category"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="case-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="Repeated Unwanted Contact & Doxxing">
                      Repeated Unwanted Contact &amp; Doxxing
                    </option>
                    <option value="Impersonation & Fake Profile">
                      Impersonation &amp; Fake Profile
                    </option>
                    <option value="Threats & Coercion">Threats &amp; Coercion</option>
                    <option value="Non-Consensual Content / Privacy Violation">
                      Non-Consensual Content / Privacy Violation
                    </option>
                    <option value="Coordinated Group Harassment">
                      Coordinated Group Harassment
                    </option>
                    <option value="Other Digital Harassment">Other Digital Harassment</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="case-desc"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Incident Summary / Description *
                </label>
                <textarea
                  id="case-desc"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what happened using fictional identifiers..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="date-precision"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Incident Date Precision
                  </label>
                  <select
                    id="date-precision"
                    value={incidentDateType}
                    onChange={(e) =>
                      setIncidentDateType(e.target.value as IncidentDatePrecision)
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
                  >
                    <option value="exact">Exact Date</option>
                    <option value="approximate">Approximate Date</option>
                    <option value="unknown">Unknown Date</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="incident-date"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    {incidentDateType === 'exact'
                      ? 'Exact Incident Date'
                      : incidentDateType === 'approximate'
                      ? 'Approximate Timeframe'
                      : 'Date Note (Optional)'}
                  </label>
                  {incidentDateType === 'exact' ? (
                    <input
                      id="incident-date"
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                    />
                  ) : (
                    <input
                      id="incident-date"
                      type="text"
                      disabled={incidentDateType === 'unknown'}
                      value={incidentDateType === 'unknown' ? 'Unknown' : incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      placeholder="e.g., Mid-September 2026"
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg disabled:bg-slate-100"
                    />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="case-status"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Case Status
                  </label>
                  <select
                    id="case-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CaseStatus)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-700"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="case-platform"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Platform / Service (Fictional or General)
                  </label>
                  <input
                    id="case-platform"
                    type="text"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    placeholder="e.g., DirectGram / ChatterBox Social"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="case-account"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Reported Account / Handle (Fictional)
                  </label>
                  <input
                    id="case-account"
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="e.g., @sample_harasser_demo"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="case-notes"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  User Notes
                </label>
                <textarea
                  id="case-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional personal reminders or context notes..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Create Case Folder</span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Search & Interactive Status Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4">
          <div className="relative flex-1">
            <Search
              className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases by title, platform, or fictional handle..."
              aria-label="Search cases"
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
            />
          </div>

          <div
            role="group"
            aria-label="Filter cases by status"
            className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg"
          >
            {(['ALL', 'Active — Preserving Evidence', 'Ready for Review', 'Draft'] as const).map(
              (st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    statusFilter === st
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st === 'ALL' ? 'All Cases' : st}
                </button>
              )
            )}
          </div>
        </div>

        {/* Cases List */}
        {filteredCases.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
            <p className="text-sm font-medium text-slate-800">
              No matching cases found in your local vault.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg cursor-pointer"
              >
                Create New Case
              </button>
              <button
                type="button"
                onClick={resetDemoVault}
                className="px-4 py-2 text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg cursor-pointer"
              >
                Restore Fictional Demo Case
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-200">
            {filteredCases.map((c) => {
              const evCount = evidence.filter((e) => e.caseId === c.id).length;
              const tlCount = timeline.filter((t) => t.caseId === c.id).length;
              return (
                <div key={c.id} className="p-6 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                    <span className="font-mono">{c.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>{c.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-slate-800">{c.status}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      Created {new Date(c.createdDate).toLocaleDateString('en-IN')}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <Link
                        to={`/cases/${c.id}`}
                        onClick={() => setActiveCaseId(c.id)}
                        className="text-lg font-semibold text-slate-900 hover:text-teal-800"
                      >
                        {c.title}
                      </Link>
                      <p className="mt-1 text-xs text-slate-600">
                        Platform: {c.platform} · Account:{' '}
                        <span className="font-mono">{c.account}</span> · Incident Date (
                        {c.incidentDateType}): <span className="font-mono">{c.incidentDate}</span>
                      </p>
                    </div>

                    <Link
                      to={`/cases/${c.id}`}
                      onClick={() => setActiveCaseId(c.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap self-start"
                    >
                      <span>Open Case Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                    </Link>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">{c.description}</p>

                  {c.notes && (
                    <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <strong>Notes:</strong> {c.notes}
                    </p>
                  )}

                  <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-600 tabular-nums">
                    <span>{evCount} preserved evidence files</span>
                    <span aria-hidden="true">·</span>
                    <span>{tlCount} timeline events</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};
