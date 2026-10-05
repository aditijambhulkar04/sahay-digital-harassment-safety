import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Trash2,
  RotateCcw,
  Globe,
  Bell,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { WorkspaceLayout } from '../components/WorkspaceLayout';
import { useSahay } from '../context/SahayContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetDemoVault, clearAllData } = useSahay();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleResetDemo = () => {
    resetDemoVault();
    setConfirmClear(false);
    showToast('Restored default fictional demo case ("Repeated Online Harassment — Demo Case").');
  };

  const handleClearVault = () => {
    clearAllData();
    setConfirmClear(false);
    showToast('Cleared all local cases, evidence, shares, and complaint records from browser storage.');
  };

  return (
    <WorkspaceLayout breadcrumbs={[{ label: 'Settings & Privacy Controls' }]}>
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-teal-800">
            <Settings className="w-3.5 h-3.5" aria-hidden="true" />
            <span>PRIVACY, RETENTION &amp; PROTOTYPE CONTROLS</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 font-display">
            Settings &amp; Local Vault Preferences
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Manage how Sahay handles privacy scanning, local browser storage retention, language
            display, and fictional demo data.
          </p>
        </div>

        {feedback && (
          <div
            role="status"
            className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" aria-hidden="true" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Privacy & Demo Mode Preferences */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-4 h-4 text-teal-800" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-900">
                Privacy &amp; Demo Mode Controls
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <label className="flex items-start justify-between gap-4 cursor-pointer">
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Demo Mode Indicator (“DEMO DATA — FICTIONAL”)
                  </span>
                  <span className="text-slate-600 mt-0.5 block">
                    Displays a clear fictional data reminder across workspace headers and exports.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.demoMode}
                  onChange={(e) => {
                    updateSettings({ demoMode: e.target.checked });
                    showToast('Updated Demo Mode indicator preference.');
                  }}
                  className="mt-1 accent-teal-800 rounded"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer pt-3 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Automatic Local Privacy Risk Scan on Evidence Upload
                  </span>
                  <span className="text-slate-600 mt-0.5 block">
                    Immediately scans uploaded files locally in the browser for phone numbers,
                    emails, addresses, PIN codes, Aadhaar-like numbers, and GPS metadata.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoPrivacyScanOnUpload}
                  onChange={(e) => {
                    updateSettings({ autoPrivacyScanOnUpload: e.target.checked });
                    showToast('Updated automatic privacy scan preference.');
                  }}
                  className="mt-1 accent-teal-800 rounded"
                />
              </label>

              <label className="flex items-start justify-between gap-4 cursor-pointer pt-3 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-slate-900 block">
                    Mask Sensitive Values by Default in Scanner Tables
                  </span>
                  <span className="text-slate-600 mt-0.5 block">
                    Shows masked previews (e.g., <span className="font-mono">+91 98*****123</span>)
                    until you explicitly click “Show”.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.defaultMaskSensitivePreviews}
                  onChange={(e) => {
                    updateSettings({ defaultMaskSensitivePreviews: e.target.checked });
                    showToast('Updated default masking preference.');
                  }}
                  className="mt-1 accent-teal-800 rounded"
                />
              </label>
            </div>
          </section>

          {/* 2. Language-Ready Architecture & Calm Notifications */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Globe className="w-4 h-4 text-teal-800" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-900">
                Language &amp; Notification Preferences
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="lang-select"
                  className="block font-semibold text-slate-900 mb-1"
                >
                  Interface Language (Language-Ready Architecture)
                </label>
                <p className="text-slate-600 mb-2">
                  Switch navigation and workspace cues between English and bilingual Hindi/English.
                </p>
                <select
                  id="lang-select"
                  value={settings.language}
                  onChange={(e) => {
                    updateSettings({ language: e.target.value as 'en' | 'hi' });
                    showToast('Updated interface language preference.');
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="en">English (Default)</option>
                  <option value="hi">हिन्दी / Bilingual (Hindi + English Navigation)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 mb-1">
                  <Bell className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
                  <span>Trauma-Informed Notification Mode</span>
                </div>
                <label className="flex items-start justify-between gap-4 cursor-pointer mt-2">
                  <span className="text-slate-600">
                    Suppress intrusive popups, sound effects, and urgent countdown timers across
                    all screens.
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.calmNotificationsOnly}
                    onChange={(e) => {
                      updateSettings({ calmNotificationsOnly: e.target.checked });
                      showToast('Updated notification preference.');
                    }}
                    className="mt-0.5 accent-teal-800 rounded"
                  />
                </label>
              </div>
            </div>
          </section>

          {/* 3. Data Retention & Immediate Deletion Controls */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Trash2 className="w-4 h-4 text-rose-800" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-900">
                Retention &amp; Local Data Deletion Controls
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label
                  htmlFor="retention-select"
                  className="block font-semibold text-slate-900 mb-1"
                >
                  Local Browser Vault Retention Policy
                </label>
                <select
                  id="retention-select"
                  value={settings.retentionDays}
                  onChange={(e) => {
                    updateSettings({
                      retentionDays: e.target.value as
                        | 'local_until_cleared'
                        | '30_days'
                        | '90_days',
                    });
                    showToast('Updated local retention policy.');
                  }}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="local_until_cleared">
                    Keep locally in browser until manually cleared
                  </option>
                  <option value="30_days">Auto-expire local vault after 30 days</option>
                  <option value="90_days">Auto-expire local vault after 90 days</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" />
                  <span>Reset to Default Fictional Demo Case</span>
                </button>

                {!confirmClear ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Clear All Local Browser Data</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-rose-50 border border-rose-300 rounded-lg">
                    <span className="text-rose-900 font-semibold">Confirm full local wipe?</span>
                    <button
                      type="button"
                      onClick={handleClearVault}
                      className="px-2.5 py-1 text-xs font-semibold text-white bg-rose-800 rounded cursor-pointer"
                    >
                      Yes, Wipe Vault
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 4. About Sahay & Independent Prototype Disclaimer */}
          <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <Info className="w-4 h-4 text-slate-700" aria-hidden="true" />
              <h2 className="text-base font-semibold text-slate-900">
                About Sahay &amp; Prototype Disclaimer
              </h2>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Sahay — Digital Harassment Safety &amp; Evidence Assistant</strong>{' '}
                (“Preserve. Protect. Act.”) is a privacy-first hackathon prototype designed to
                assist victims of online harassment in India.
              </p>
              <p>
                <strong>Non-Legal &amp; Non-Official Status:</strong> Sahay does not claim legal
                admissibility, legal certification, court validity, automated crime detection, or
                determinations of guilt. Reports generated by Sahay are clearly labeled:{' '}
                <em>
                  “Independent prototype output — not a police report, legal certificate,
                  court-certified evidence, or legal advice.”
                </em>
              </p>
              <p>
                <strong>No External Authority Transmission:</strong> Sahay never automatically
                contacts police, the National Cyber Crime Reporting Portal (
                <span className="font-mono">https://www.cybercrime.gov.in/</span>), or social
                platforms.
              </p>
            </div>
          </section>
        </div>
      </div>
    </WorkspaceLayout>
  );
};
