import React, { useState } from 'react';
import { Plus, X, ClipboardList, Info, ExternalLink } from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useSahay } from '../context/SahayContext';
import { ComplaintStatus } from '../types/sahay';

const COMPLAINT_STATUSES: ComplaintStatus[] = [
  'Prepared',
  'Submitted',
  'Acknowledged',
  'Additional information requested',
  'Under review',
  'Resolved',
  'Closed',
  'Unknown',
];

export const ComplaintsPage: React.FC = () => {
  const { cases, complaints, activeCaseId, addComplaint, addComplaintUpdate } = useSahay();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCaseId, setSelectedCaseId] = useState(activeCaseId || cases[0]?.id || '');
  const [authority, setAuthority] = useState(
    'National Cyber Crime Reporting Portal (cybercrime.gov.in)'
  );
  const [referenceNumber, setReferenceNumber] = useState('');
  const [submissionDate, setSubmissionDate] = useState('2026-09-20');
  const [status, setStatus] = useState<ComplaintStatus>('Prepared');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Inline update state per complaint
  const [updatingComplaintId, setUpdatingComplaintId] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<ComplaintStatus>('Acknowledged');
  const [updateNote, setUpdateNote] = useState('');

  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authority.trim()) {
      setFormError('Please specify the authority or platform where you filed or plan to file.');
      return;
    }
    setFormError('');

    addComplaint({
      caseId: selectedCaseId || cases[0]?.id || 'case-demo-2026-01',
      authority: authority.trim(),
      referenceNumber:
        referenceNumber.trim() || 'User-Entered Reference Not Yet Recorded',
      submissionDate,
      status,
      notes: notes.trim(),
    });

    setReferenceNumber('');
    setNotes('');
    setShowAddForm(false);
  };

  const handleSaveUpdate = (e: React.FormEvent, complaintId: string) => {
    e.preventDefault();
    if (!updateNote.trim()) return;
    addComplaintUpdate(complaintId, updateStatus, updateNote.trim());
    setUpdateNote('');
    setUpdatingComplaintId(null);
  };

  return (
    <WorkspaceLayout
      breadcrumbs={[{ label: 'Manual Complaint Tracker' }]}
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
              <span>Log Manual Entry</span>
            </>
          )}
        </button>
      }
    >
      <div className="space-y-6">
        {/* Mandatory Transparency Notice */}
        <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-teal-800">
                <span>USER-ENTERED TRACKING LOG</span>
                <span aria-hidden="true">·</span>
                <span>NO AUTOMATED PORTAL CONNECTION</span>
              </div>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                Manual Complaint &amp; Reference Tracker
              </h1>
              <p className="mt-1 text-sm text-slate-600 max-w-2xl">
                Keep a personal log of complaints you have prepared or submitted to platform safety
                teams, cyber cells, or the National Cyber Crime Reporting Portal.
              </p>
            </div>

            <a
              href="https://www.cybercrime.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap self-start"
            >
              <span>Official NCRP Portal (cybercrime.gov.in)</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-700">
            <Info className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" aria-hidden="true" />
            <p>
              <strong>Important Notice:</strong> All complaint reference numbers, dates, and
              statuses shown on this page are <strong>manually entered by the user</strong>. Sahay
              is an independent prototype and is not integrated with police, NCRP, or social
              platform databases.
            </p>
          </div>
        </section>

        {/* Add Manual Complaint Entry Form */}
        {showAddForm && (
          <section
            aria-label="Log manual complaint entry"
            className="bg-white border border-slate-300 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-base font-semibold text-slate-900">
                Add Manual Complaint Record (User-Entered)
              </h2>
              <span className="text-xs font-mono text-amber-900">DEMO DATA — FICTIONAL</span>
            </div>

            <form onSubmit={handleAddComplaint} className="space-y-4" noValidate>
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
                    htmlFor="comp-case"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Associated Case
                  </label>
                  <select
                    id="comp-case"
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="comp-authority"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Authority / Reporting Channel *
                  </label>
                  <input
                    id="comp-authority"
                    type="text"
                    value={authority}
                    onChange={(e) => setAuthority(e.target.value)}
                    placeholder="e.g., National Cyber Crime Reporting Portal / State Cyber Cell"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="comp-ref"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    User-Entered Reference / Ack Number
                  </label>
                  <input
                    id="comp-ref"
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g., USER-ENTERED-REF-001 (Fictional)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label
                    htmlFor="comp-date"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    Preparation / Submission Date
                  </label>
                  <input
                    id="comp-date"
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label
                    htmlFor="comp-status"
                    className="block text-xs font-medium text-slate-700 mb-1"
                  >
                    User-Entered Status
                  </label>
                  <select
                    id="comp-status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ComplaintStatus)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {COMPLAINT_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="comp-notes"
                  className="block text-xs font-medium text-slate-700 mb-1"
                >
                  Notes &amp; Follow-up Details
                </label>
                <textarea
                  id="comp-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Record what documents you attached or any follow-up instructions..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 cursor-pointer"
                >
                  Save Manual Entry
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Complaints List */}
        {complaints.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3">
            <ClipboardList className="w-8 h-8 text-slate-400 mx-auto" aria-hidden="true" />
            <p className="text-sm font-medium text-slate-800">
              No manual complaint entries logged yet.
            </p>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg cursor-pointer"
            >
              Add First Manual Entry
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((comp) => {
              const linkedCase = cases.find((c) => c.id === comp.caseId);
              const isUpdating = updatingComplaintId === comp.id;

              return (
                <article
                  key={comp.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 tabular-nums">
                        <span className="font-mono font-semibold text-teal-900">
                          Status (User-Entered): {comp.status}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>Date: {comp.submissionDate}</span>
                        {linkedCase && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>Case: {linkedCase.title}</span>
                          </>
                        )}
                      </div>
                      <h2 className="mt-1 text-base font-semibold text-slate-900">
                        {comp.authority}
                      </h2>
                      <p className="mt-0.5 text-xs font-mono text-slate-600">
                        Reference / Ack No. (User-Entered): {comp.referenceNumber}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isUpdating) {
                          setUpdatingComplaintId(null);
                        } else {
                          setUpdatingComplaintId(comp.id);
                          setUpdateStatus(comp.status);
                        }
                      }}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap self-start"
                    >
                      {isUpdating ? 'Cancel Update' : '+ Log Status Update'}
                    </button>
                  </div>

                  {comp.notes && (
                    <p className="text-xs text-slate-700 leading-relaxed">{comp.notes}</p>
                  )}

                  {/* Add Update Form */}
                  {isUpdating && (
                    <form
                      onSubmit={(e) => handleSaveUpdate(e, comp.id)}
                      className="p-4 bg-slate-50 border border-slate-300 rounded-lg space-y-3"
                    >
                      <p className="text-xs font-semibold text-slate-900">
                        Log Manual Status Update (User-Entered)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label
                            htmlFor={`up-status-${comp.id}`}
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            New Status
                          </label>
                          <select
                            id={`up-status-${comp.id}`}
                            value={updateStatus}
                            onChange={(e) =>
                              setUpdateStatus(e.target.value as ComplaintStatus)
                            }
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          >
                            {COMPLAINT_STATUSES.map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor={`up-note-${comp.id}`}
                            className="block text-xs font-medium text-slate-700 mb-1"
                          >
                            Update Note *
                          </label>
                          <input
                            id={`up-note-${comp.id}`}
                            type="text"
                            value={updateNote}
                            onChange={(e) => setUpdateNote(e.target.value)}
                            placeholder="e.g., Received acknowledgement SMS or provided screenshot hash..."
                            className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 cursor-pointer"
                        >
                          Save Update
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Chronological Updates History */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <p className="text-xs font-mono font-semibold text-slate-700">
                      USER-ENTERED UPDATE LOG ({comp.updates.length})
                    </p>
                    <div className="space-y-1.5 text-xs">
                      {comp.updates.map((u) => (
                        <div
                          key={u.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-600"
                        >
                          <span>
                            <strong className="text-slate-900">[{u.status}]</strong> {u.note}
                          </span>
                          <span className="font-mono text-slate-500 tabular-nums">{u.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </WorkspaceLayout>
  );
};
