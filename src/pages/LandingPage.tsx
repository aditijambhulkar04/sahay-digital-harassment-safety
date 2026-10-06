import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  Lock,
  FileText,
  CheckCircle2,
} from 'lucide-react';

import { useSahay } from '../context/SahayContext';
import { DEMO_CASE_ID } from '../data/demoData';
import { useI18n } from '../i18n';

import { en } from '../i18n/en';
import { hi } from '../i18n/hi';
import { mr } from '../i18n/mr';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const { updateSettings, setActiveCaseId } = useSahay();
  const { lang, setLang } = useI18n();

  const t = lang === 'hi' ? hi : lang === 'mr' ? mr : en;

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
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-slate-900 font-display"
        >
          Sahay
        </Link>

        {/* Navigation */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <a
            href="#preserve"
            className="hover:text-slate-900 transition-colors"
          >
            {t.nav.preserve}
          </a>

          <a
            href="#protect"
            className="hover:text-slate-900 transition-colors"
          >
            {t.nav.protect}
          </a>

          <a
            href="#act"
            className="hover:text-slate-900 transition-colors"
          >
            {t.nav.act}
          </a>

          <Link
            to="/safety"
            className="hover:text-slate-900 transition-colors"
          >
            {t.nav.safetyCheck}
          </Link>

          <Link
            to="/complaints"
            className="hover:text-slate-900 transition-colors"
          >
            {t.nav.complaintTracker}
          </Link>
        </nav>

        {/* Actions + Language */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <label className="inline-flex items-center gap-1.5 text-xs text-slate-600">
            <span aria-hidden="true" className="text-base">
              🌐
            </span>

            <select
              value={lang}
              onChange={(e) =>
                setLang(e.target.value as 'en' | 'hi' | 'mr')
              }
              aria-label="Select language"
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>

          {/* Explore Demo */}
          <button
            type="button"
            onClick={handleExploreDemo}
            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {t.actions.exploreDemo}
          </button>

          {/* Get Started */}
          <button
            type="button"
            onClick={handleGetStarted}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            {t.actions.getStarted}
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-800 mb-6">
                <Shield size={16} />
                {t.hero.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-slate-900">
                {t.hero.title}
              </h1>

              <p className="mt-6 text-xl sm:text-2xl font-medium text-teal-800">
                {t.hero.tagline}
              </p>

              <p className="mt-5 max-w-2xl text-base sm:text-lg leading-8 text-slate-600">
                {t.hero.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleGetStarted}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  {t.actions.getStarted}
                  <ArrowRight size={17} />
                </button>

                <button
                  type="button"
                  onClick={handleExploreDemo}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  {t.actions.exploreDemo}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Three Feature Areas */}
        <section className="px-6 sm:px-10 lg:px-16 pb-20">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preserve */}
            <section
              id="preserve"
              className="rounded-2xl border border-slate-200 bg-white p-7"
            >
              <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center mb-5">
                <FileText size={22} />
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                {t.features.preserve.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.features.preserve.description}
              </p>
            </section>

            {/* Protect */}
            <section
              id="protect"
              className="rounded-2xl border border-slate-200 bg-white p-7"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
                <Lock size={22} />
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                {t.features.protect.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.features.protect.description}
              </p>
            </section>

            {/* Act */}
            <section
              id="act"
              className="rounded-2xl border border-slate-200 bg-white p-7"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-5">
                <CheckCircle2 size={22} />
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                {t.features.act.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.features.act.description}
              </p>
            </section>
          </div>
        </section>

        {/* Demo Case Preview */}
        <section className="px-6 sm:px-10 lg:px-16 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
              <div className="max-w-3xl">
                <p className="text-sm font-semibold text-teal-800">
                  {t.demo.label}
                </p>

                <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  {t.demo.title}
                </h2>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  {t.demo.description}
                </p>

                <button
                  type="button"
                  onClick={handleExploreDemo}
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900 transition-colors"
                >
                  {t.actions.exploreDemoCase}
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Ethical & Prototype Boundaries */}
        <section className="px-6 sm:px-10 lg:px-16 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="rounded-2xl border border-slate-200 bg-slate-100 p-7 sm:p-9">
              <h2 className="text-2xl font-semibold text-slate-900">
                {t.ethical.title}
              </h2>

              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
                <p>{t.ethical.paragraph1}</p>

                <p>{t.ethical.paragraph2}</p>

                <p>{t.ethical.paragraph3}</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-6 sm:px-10 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">Sahay</p>

            <p className="mt-1 text-sm text-slate-500">
              {t.footer.tagline}
            </p>
          </div>

          <div className="text-sm text-slate-500">
            {t.footer.motto}
          </div>
        </div>
      </footer>
    </div>
  );
};