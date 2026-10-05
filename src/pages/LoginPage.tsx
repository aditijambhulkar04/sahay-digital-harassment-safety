import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import { useSahay } from '../context/SahayContext';
import { DEMO_CASE_ID } from '../data/demoData';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, setActiveCaseId, resetDemoVault } = useSahay();
  const [alias, setAlias] = useState('Ananya S. (Fictional Demo Profile)');
  const [passphraseNote, setPassphraseNote] = useState('');
  const [error, setError] = useState('');

  const handleDemoAccess = () => {
    resetDemoVault();
    updateSettings({
      demoMode: true,
      authenticatedMode: 'demo',
      authenticatedUserName: 'Ananya S. (Fictional Demo Profile)',
    });
    setActiveCaseId(DEMO_CASE_ID);
    navigate('/safety');
  };

  const handleLocalSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim()) {
      setError('Please enter a display alias or fictional identifier to continue.');
      return;
    }
    setError('');
    updateSettings({
      authenticatedMode: 'local_private',
      authenticatedUserName: alias.trim(),
    });
    navigate('/safety');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-slate-900 font-display"
        >
          Sahay
        </Link>
        <div className="flex items-center gap-4 text-xs text-slate-600">
          {settings.demoMode && (
            <span className="font-mono text-amber-900">DEMO DATA — FICTIONAL</span>
          )}
          <Link to="/safety" className="hover:text-slate-900 underline underline-offset-4">
            Safety Check
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-xs font-mono text-teal-800">LOCAL PRIVACY VAULT ACCESS</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                Enter Sahay Workspace
              </h1>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                Sahay runs locally in your browser. You do not need to share real personal
                credentials or connect an external account to organize evidence or explore the
                prototype.
              </p>
            </div>

            {/* Option 1: Recommended Hackathon Demo Case */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  Option 1: Explore Pre-Loaded Fictional Demo Case
                </h2>
                <span className="text-xs font-mono text-amber-900">DEMO DATA — FICTIONAL</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Loads <strong>“Repeated Online Harassment — Demo Case”</strong> (12 Sep – 19 Sep
                2026) with sample screenshots, chat exports, SHA-256 verification, privacy scanner
                findings, redactions, report builder, and selective sharing.
              </p>
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer"
              >
                <span>Continue with Fictional Demo Case</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Option 2: Continue with Custom Fictional Alias
              </h2>
              <form onSubmit={handleLocalSessionSubmit} className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="session-alias"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Session Alias (Use a fictional name or initials)
                  </label>
                  <input
                    id="session-alias"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="e.g., Case Organizer A (Fictional)"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                  {error && (
                    <p role="alert" className="mt-1.5 text-xs text-rose-700 font-medium">
                      {error}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="local-pin"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    Optional Local Session Note / Lock Hint (Stays in browser only)
                  </label>
                  <input
                    id="local-pin"
                    type="password"
                    value={passphraseNote}
                    onChange={(e) => setPassphraseNote(e.target.value)}
                    placeholder="Optional local passphrase"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Proceed to Safety Check</span>
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-teal-800 shrink-0 mt-0.5" aria-hidden="true" />
              <p>
                Reminder: Use only fictional or demonstration data in this prototype. Never enter
                real victim credentials or sensitive government identifiers.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
