import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSahay } from '../context/SahayContext';

export const CaseSubNav: React.FC<{ caseId: string }> = ({ caseId }) => {
  const location = useLocation();
  const { evidence, timeline, privacyFindings, derivatives, shares } = useSahay();

  const evCount = evidence.filter((e) => e.caseId === caseId).length;
  const tlCount = timeline.filter((t) => t.caseId === caseId).length;
  const pfCount = privacyFindings.filter((p) => p.caseId === caseId).length;
  const derivCount = derivatives.filter((d) => d.caseId === caseId).length;
  const shareCount = shares.filter((s) => s.caseId === caseId && s.status === 'Active').length;

  const tabs = [
    {
      label: '1. Overview & Safe Actions',
      to: `/cases/${caseId}`,
      exact: true,
    },
    {
      label: `2. Evidence Vault & OCR (${evCount})`,
      to: `/cases/${caseId}/evidence`,
    },
    {
      label: `3. Incident Timeline (${tlCount})`,
      to: `/cases/${caseId}/timeline`,
    },
    {
      label: `4. Privacy & Redaction (${pfCount} findings · ${derivCount} copies)`,
      to: `/cases/${caseId}/privacy`,
    },
    {
      label: '5. Report Builder & NCRP Prep',
      to: `/cases/${caseId}/reports`,
    },
    {
      label: `6. Selective Sharing (${shareCount} active)`,
      to: `/cases/${caseId}/sharing`,
    },
  ];

  return (
    <div className="no-print mb-6 border-b border-slate-200 overflow-x-auto">
      <nav
        aria-label="Case workflow steps"
        className="flex items-center gap-1 min-w-max pb-2"
      >
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? location.pathname === tab.to
            : location.pathname.startsWith(tab.to);
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap tabular-nums ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
