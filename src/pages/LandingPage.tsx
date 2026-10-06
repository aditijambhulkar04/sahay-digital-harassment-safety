import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { useSahay } from '../context/SahayContext';
import { DEMO_CASE_ID } from '../data/demoData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, setActiveCaseId } = useSahay();
  const handleExploreDemo = () => {
    updateSettings({ demoMode: true });
    setActiveCaseId(DEMO_CASE_ID);
    navigate('/safety');
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-slate-900 font-display"
        >
          Sahay
        </Link>

        {/* Zone 2: 4-5 clean text navigation links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#preserve"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Preserve
          </a>
          <a
            href="#protect"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Protect
          </a>
          <a
            href="#act"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Act
          </a>
          <Link
            to="/safety"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Safety Check
          </Link>
          <Link
            to="/complaints"
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap"
          >
            Complaint Tracker
          </Link>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExploreDemo}
            className="px-3.5 py-2 text-xs font-medium text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap cursor-pointer"
          >
            Explore Demo
          </button>
          <button
            type="button"
            onClick={handleGetStarted}
            className="px-4 py-2 text-xs font-medium text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors whitespace-nowrap cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white border-b border-slate-200 py-16 sm:py-24 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 mb-6 font-mono">
              <span>PRIVACY-FIRST PROTOTYPE</span>
              <span aria-hidden="true">·</span>
              <span>LOCAL BROWSER PROCESSING</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-900 font-medium">DEMO DATA — FICTIONAL</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-tight max-w-3xl font-display"
              style={{ textWrap: 'balance' }}
            >
              Sahay — Digital Harassment Safety &amp; Evidence Assistant
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-medium text-teal-900 font-display">
              Preserve. Protect. Act.
            </p>

            <p className="mt-5 text-base sm:text-lg text-slate-700 leading-relaxed max-w-2xl">
              When online harassment happens, Sahay helps you preserve what happened, protect what
              should remain private, and take the next safe step.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-900 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={handleExploreDemo}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-slate-900 bg-slate-100 border border-slate-300 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Explore Demo Case</span>
              </button>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-600">
              <div>
                <p className="font-semibold text-slate-900">Originals Never Altered</p>
                <p className="mt-1 leading-relaxed">
                  Uploaded screenshots and logs stay untouched. Redactions and OCR edits are saved
                  as separate derivative copies.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">No Automatic Authority Contact</p>
                <p className="mt-1 leading-relaxed">
                  Sahay never contacts police, NCRP, or social platforms on your behalf. You stay in
                  complete control of every decision.
                </p>
              </div>
              <div>
                <p className="font-semibold text-slate-900">Deterministic Local Tools</p>
                <p className="mt-1 leading-relaxed">
                  SHA-256 hashing, privacy risk scanning, and redactions run locally in your browser
                  without paid API dependencies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Three Feature Areas: Preserve, Protect, Act */}
        <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 font-display">
              Three calm steps designed around your safety and agency
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Built for individuals experiencing online harassment in India to organize facts at
              their own pace before deciding how to proceed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Preserve */}
            <div
              id="preserve"
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-5">
                  <Shield className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-mono text-teal-800 font-medium">01. PRESERVE</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Organize evidence, timestamps, and SHA-256 fingerprints
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Store screenshots, chat exports, and PDFs in a structured Evidence Vault. Calculate
                  deterministic SHA-256 hashes immediately on upload, verify integrity anytime, and
                  extract editable OCR transcripts stored separately from the original file.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono">
                SHA-256 · Browser OCR · Audit Log
              </div>
            </div>

            {/* 2. Protect */}
            <div
              id="protect"
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-5">
                  <Lock className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-mono text-teal-800 font-medium">02. PROTECT</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Identify privacy risks and create safer redacted copies
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Run a deterministic local privacy scanner to spot phone numbers, email addresses,
                  street addresses, PIN codes, Aadhaar-like numbers, bank references, and GPS
                  metadata. Generate separate text or visual redacted copies while preserving the
                  original.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono">
                Privacy Scanner · Safe Derivative Redaction
              </div>
            </div>

            {/* 3. Act */}
            <div
              id="act"
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-800 mb-5">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-xs font-mono text-teal-800 font-medium">03. ACT</p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  Organize timelines, prepare reports, and choose safe next steps
                </h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Build a chronological timeline distinguishing user-entered facts from evidence
                  references, review calm Safe-Action recommendations, export structured reports,
                  prepare for official NCRP reporting, and manage selective revocable sharing.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono">
                Timeline · Report Builder · Selective Share
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Case Preview Section */}
        <section className="bg-white border-t border-b border-slate-200 py-14 px-4 sm:px-8">
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-900">
                <span>PRE-LOADED WALKTHROUGH</span>
                <span aria-hidden="true">·</span>
                <span>DEMO DATA — FICTIONAL</span>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 font-display">
                Explore “Repeated Online Harassment — Demo Case”
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Walk through a complete fictional scenario spanning 12 Sep 2026 to 19 Sep 2026:
                examine 4 preserved evidence items, verify SHA-256 hashes, inspect 12+ detected
                privacy risks, create redacted copies, generate a report, test selective sharing
                with token revocation, and track manual complaints.
              </p>
              <div className="pt-2 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-700">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
                  12 Sep — Unwanted message
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
                  15 Sep — Repeated contact
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
                  18 Sep — Threatening message
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" aria-hidden="true" />
                  19 Sep — Public doxxing post
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={handleExploreDemo}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Launch Demo Journey</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* Ethical & Prototype Boundaries Section */}
        <section className="py-12 px-4 sm:px-8 max-w-5xl mx-auto">
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Important Prototype Disclaimer &amp; Boundaries
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sahay is an independent hackathon prototype created for educational and demonstration
              purposes. It does <strong>not</strong> provide legal advice, legal certification,
              court admissibility guarantees, or automated crime detection. It does{' '}
              <strong>not</strong> automatically contact police, the National Cyber Crime Reporting
              Portal (<span className="font-mono">https://www.cybercrime.gov.in/</span>), or social
              media platforms. All sample records are strictly fictional (
              <span className="font-mono">DEMO DATA — FICTIONAL</span>).
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>Sahay — Digital Harassment Safety &amp; Evidence Assistant · Preserve. Protect. Act.</p>
          <div className="flex items-center gap-4">
            <Link to="/safety" className="hover:text-slate-900 underline underline-offset-4">
              Safety Check
            </Link>
            <Link to="/dashboard" className="hover:text-slate-900 underline underline-offset-4">
              Dashboard
            </Link>
            <Link to="/settings" className="hover:text-slate-900 underline underline-offset-4">
              Settings &amp; Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
