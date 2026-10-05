import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  HeartHandshake,
  PhoneCall,
  ShieldAlert,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useSahay } from '../context/SahayContext';
import { DEMO_CASE_ID } from '../data/demoData';

export const SafetyCheckPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, cases } = useSahay();
  const [safetyResponse, setSafetyResponse] = useState<
    'safe_to_continue' | 'need_immediate_support' | null
  >('safe_to_continue');
  const [deviceCheck, setDeviceCheck] = useState(true);

  const handleProceed = (targetPath: string) => {
    updateSettings({ safetyCheckCompleted: true });
    navigate(targetPath);
  };

  const demoCaseExists = cases.some((c) => c.id === DEMO_CASE_ID);

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
          <Link to="/dashboard" className="hover:text-slate-900 underline underline-offset-4">
            Skip to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
              <HeartHandshake className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-mono text-teal-800">STEP 1 OF WORKFLOW · CALM CHECK-IN</p>
              <h1 className="mt-1 text-2xl font-semibold text-slate-900 font-display">
                A quiet moment to check your safety first
              </h1>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                Preserving digital evidence can wait if your physical safety or privacy in the room
                is at risk. Take a breath and choose what feels right for you right now.
              </p>
            </div>
          </div>

          {/* Selection Radio Cards */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-semibold text-slate-700 mb-2">
              How is your immediate situation right now?
            </legend>

            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                safetyResponse === 'safe_to_continue'
                  ? 'bg-teal-50/60 border-teal-700'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="safety-status"
                checked={safetyResponse === 'safe_to_continue'}
                onChange={() => setSafetyResponse('safe_to_continue')}
                className="mt-1 accent-teal-800"
              />
              <div>
                <span className="block text-sm font-semibold text-slate-900">
                  I am in a safe place and ready to organize or explore evidence
                </span>
                <span className="block text-xs text-slate-600 mt-0.5">
                  Proceed to the Dashboard or the pre-loaded fictional Demo Case at your own pace.
                </span>
              </div>
            </label>

            <label
              className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                safetyResponse === 'need_immediate_support'
                  ? 'bg-amber-50/70 border-amber-700'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="safety-status"
                checked={safetyResponse === 'need_immediate_support'}
                onChange={() => setSafetyResponse('need_immediate_support')}
                className="mt-1 accent-amber-800"
              />
              <div>
                <span className="block text-sm font-semibold text-slate-900">
                  I may be in immediate physical danger or feel unsafe right now
                </span>
                <span className="block text-xs text-slate-600 mt-0.5">
                  Show calm emergency guidance and official helpline numbers in India.
                </span>
              </div>
            </label>
          </fieldset>

          {/* Conditional Immediate Danger Guidance */}
          {safetyResponse === 'need_immediate_support' && (
            <div
              role="region"
              aria-label="Emergency safety guidance"
              className="p-5 bg-amber-50/80 border border-amber-300 rounded-lg space-y-4"
            >
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h2 className="text-sm font-semibold text-amber-950">
                    Your physical safety comes before any digital evidence
                  </h2>
                  <p className="mt-1 text-xs text-amber-900 leading-relaxed">
                    If you believe someone may harm you in person, know your current location, or is
                    monitoring your device right now, please consider moving to a safe place and
                    contacting a trusted family member, friend, or official emergency services.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <PhoneCall className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" />
                    <span>Emergency (ERSS)</span>
                  </div>
                  <p className="mt-1 text-lg font-mono font-semibold text-slate-900 tabular-nums">
                    112
                  </p>
                  <p className="text-xs text-slate-600">All-India 24×7 Emergency Response</p>
                </div>

                <div className="bg-white border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <PhoneCall className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" />
                    <span>Women Helpline</span>
                  </div>
                  <p className="mt-1 text-lg font-mono font-semibold text-slate-900 tabular-nums">
                    181 / 1091
                  </p>
                  <p className="text-xs text-slate-600">Support &amp; immediate assistance</p>
                </div>

                <div className="bg-white border border-amber-200 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                    <PhoneCall className="w-3.5 h-3.5 text-teal-800" aria-hidden="true" />
                    <span>Cyber Crime Helpline</span>
                  </div>
                  <p className="mt-1 text-lg font-mono font-semibold text-slate-900 tabular-nums">
                    1930
                  </p>
                  <p className="text-xs text-slate-600">National Cyber Crime Helpline</p>
                </div>
              </div>

              <p className="text-xs text-amber-900">
                <strong>Note:</strong> Sahay is an independent prototype and is not connected to
                emergency services or police dispatch. It never calls or alerts anyone
                automatically.
              </p>
            </div>
          )}

          {/* Device & Browser Privacy Check */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
              <Lock className="w-3.5 h-3.5 text-slate-700" aria-hidden="true" />
              <span>Gentle Device &amp; Browser Privacy Check</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Make sure you are using a device and browser profile that only you can access. You can
              clear local browser data at any time from the Settings page.
            </p>
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-800 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={deviceCheck}
                onChange={(e) => setDeviceCheck(e.target.checked)}
                className="accent-teal-800 rounded"
              />
              <span>I understand that Sahay provides organizational tools, not legal advice.</span>
            </label>
          </div>

          {/* Primary Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Return to Home
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              {demoCaseExists && (
                <button
                  type="button"
                  onClick={() => handleProceed(`/cases/${DEMO_CASE_ID}`)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-800" aria-hidden="true" />
                  <span>Open Demo Case Directly</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleProceed('/dashboard')}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
