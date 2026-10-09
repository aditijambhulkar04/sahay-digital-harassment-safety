import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';

import { useSahay } from '../context/SahayContext';
import { DEMO_CASE_ID } from '../data/demoData';
import { useI18n } from '../i18n';

import { en } from '../i18n/en';
import { hi } from '../i18n/hi';
import { mr } from '../i18n/mr';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const { settings, updateSettings, setActiveCaseId, resetDemoVault } =
    useSahay();

  const { lang } = useI18n();

  const t = lang === 'hi' ? hi : lang === 'mr' ? mr : en;

  const [alias, setAlias] = useState(
    'Ananya S. (Fictional Demo Profile)'
  );
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
      setError(t.login.aliasError);
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
            <span className="font-mono text-amber-900">
              {t.login.demoData}
            </span>
          )}

          <Link
            to="/safety"
            className="hover:text-slate-900 underline underline-offset-4"
          >
            {t.login.safetyCheck}
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-xl w-full space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <p className="text-xs font-mono text-teal-800">
                {t.login.localVaultAccess}
              </p>

              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                {t.login.enterWorkspace}
              </h1>

              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {t.login.workspaceDescription}
              </p>
            </div>

            {/* Option 1 */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-900">
                  {t.login.option1Title}
                </h2>

                <span className="text-xs font-mono text-amber-900">
                  {t.login.demoData}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t.login.demoDescription}
              </p>

              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer"
              >
                <span>{t.login.continueDemo}</span>
                <ArrowRight
                  className="w-4 h-4"
                  aria-hidden="true"
                />
              </button>
            </div>

            {/* Option 2 */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                {t.login.option2Title}
              </h2>

              <form
                onSubmit={handleLocalSessionSubmit}
                className="space-y-4"
                noValidate
              >
                <div>
                  <label
                    htmlFor="session-alias"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    {t.login.sessionAliasLabel}
                  </label>

                  <input
                    id="session-alias"
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder={t.login.sessionAliasPlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />

                  {error && (
                    <p
                      role="alert"
                      className="mt-1.5 text-xs text-rose-700 font-medium"
                    >
                      {error}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="local-pin"
                    className="block text-xs font-medium text-slate-700 mb-1.5"
                  >
                    {t.login.localNoteLabel}
                  </label>

                  <input
                    id="local-pin"
                    type="password"
                    value={passphraseNote}
                    onChange={(e) => setPassphraseNote(e.target.value)}
                    placeholder={t.login.localNotePlaceholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Lock
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                  />

                  <span>{t.login.proceedSafety}</span>
                </button>
              </form>
            </div>

            {/* Reminder */}
            <div className="pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
              <ShieldCheck
                className="w-4 h-4 text-teal-800 shrink-0 mt-0.5"
                aria-hidden="true"
              />

              <p>{t.login.reminder}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
