import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  LayoutDashboard,
  ClipboardList,
  ShieldCheck,
  Settings,
  Menu,
  X,
  LogOut,
  FileSearch,
  Clock,
  EyeOff,
  FileText,
  Share2,
  HeartHandshake,
} from 'lucide-react';
import { useSahay } from '../context/SahayContext';
import { DEMO_CASE_ID } from '../data/demoData';

export const WorkspaceLayout: React.FC<{
  children: React.ReactNode;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: React.ReactNode;
}> = ({ children, breadcrumbs, actions }) => {
  const { cases, activeCaseId, settings, updateSettings } = useSahay();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentCaseId = activeCaseId || cases[0]?.id || DEMO_CASE_ID;
  const activeCase = cases.find((c) => c.id === currentCaseId);
  const isHindi = settings.language === 'hi';

  const primaryNav = [
    {
      label: isHindi ? 'डैशबोर्ड (Dashboard)' : 'Dashboard',
      to: '/dashboard',
      icon: LayoutDashboard,
      match: (path: string) => path === '/dashboard',
    },
    {
      label: isHindi ? 'मामले (Cases)' : 'Cases',
      to: '/cases',
      icon: FolderKanban,
      match: (path: string) => path === '/cases',
    },
    {
      label: isHindi ? 'शिकायत ट्रैकर (Complaints)' : 'Complaint Tracker',
      to: '/complaints',
      icon: ClipboardList,
      match: (path: string) => path.startsWith('/complaints'),
    },
    {
      label: isHindi ? 'सुरक्षा जांच (Safety Check)' : 'Safety Check',
      to: '/safety',
      icon: HeartHandshake,
      match: (path: string) => path.startsWith('/safety'),
    },
    {
      label: isHindi ? 'सेटिंग्स (Settings)' : 'Settings',
      to: '/settings',
      icon: Settings,
      match: (path: string) => path.startsWith('/settings'),
    },
  ];

  const caseQuickNav = currentCaseId
    ? [
        {
          label: 'Case Overview & Safe Actions',
          to: `/cases/${currentCaseId}`,
          icon: ShieldCheck,
        },
        {
          label: 'Evidence Vault & OCR',
          to: `/cases/${currentCaseId}/evidence`,
          icon: FileSearch,
        },
        {
          label: 'Incident Timeline',
          to: `/cases/${currentCaseId}/timeline`,
          icon: Clock,
        },
        {
          label: 'Privacy Scan & Redaction',
          to: `/cases/${currentCaseId}/privacy`,
          icon: EyeOff,
        },
        {
          label: 'Report Builder & NCRP Prep',
          to: `/cases/${currentCaseId}/reports`,
          icon: FileText,
        },
        {
          label: 'Selective Sharing',
          to: `/cases/${currentCaseId}/sharing`,
          icon: Share2,
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside
        aria-label="Workspace navigation"
        className="no-print hidden md:flex md:w-64 lg:w-70 shrink-0 flex-col bg-white border-r border-slate-200 select-none"
      >
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-semibold tracking-tight text-slate-900 font-display focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Sahay
          </Link>
          <span className="text-xs text-slate-500 font-mono">
            {isHindi ? 'संरक्षित करें' : 'Preserve · Protect · Act'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          <div>
            <p className="px-3 mb-2 text-xs font-medium text-slate-500">
              {isHindi ? 'मुख्य नेविगेशन' : 'Workspace'}
            </p>
            <nav className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const active = item.match(location.pathname);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {activeCase && (
            <div className="pt-4 border-t border-slate-200">
              <div className="px-3 mb-2">
                <p className="text-xs font-medium text-slate-500">
                  {isHindi ? 'सक्रिय मामला (Active Case)' : 'Active Case Tools'}
                </p>
                <p
                  className="text-xs font-semibold text-slate-900 truncate mt-0.5"
                  title={activeCase.title}
                >
                  {activeCase.title}
                </p>
              </div>
              <nav className="space-y-1">
                {caseQuickNav.map((sub) => {
                  const Icon = sub.icon;
                  const isExact = location.pathname === sub.to;
                  return (
                    <Link
                      key={sub.to}
                      to={sub.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                        isExact
                          ? 'bg-teal-50 text-teal-900 font-semibold border border-teal-200'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate">{sub.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Bottom Prototype Disclaimer & Demo Indicator */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 space-y-3">
          {settings.demoMode && (
            <div className="text-xs font-mono text-amber-900 bg-amber-50/80 border border-amber-200 px-3 py-2 rounded-md">
              DEMO DATA — FICTIONAL
            </div>
          )}
          <p className="text-xs text-slate-500 leading-relaxed">
            Independent privacy-first prototype. Not connected to police or government portals.
          </p>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() =>
                updateSettings({ language: settings.language === 'en' ? 'hi' : 'en' })
              }
              className="text-xs font-medium text-slate-700 hover:text-slate-900 underline underline-offset-4 cursor-pointer"
            >
              {settings.language === 'en' ? 'भाषा: हिन्दी / EN' : 'Language: EN / हिं'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              title="Return to Landing Page"
            >
              <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Contextual Header */}
        <header className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-700"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
              <Link
                to="/dashboard"
                className="text-slate-500 hover:text-slate-900 transition-colors hidden sm:inline whitespace-nowrap"
              >
                Sahay
              </Link>
              {breadcrumbs &&
                breadcrumbs.map((bc, index) => (
                  <React.Fragment key={index}>
                    <span className="text-slate-400 hidden sm:inline" aria-hidden="true">
                      /
                    </span>
                    {bc.to ? (
                      <Link
                        to={bc.to}
                        className="text-slate-600 hover:text-slate-900 transition-colors truncate max-w-[180px] sm:max-w-[260px]"
                      >
                        {bc.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-slate-900 truncate max-w-[220px] sm:max-w-[340px]">
                        {bc.label}
                      </span>
                    )}
                  </React.Fragment>
                ))}
            </nav>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {settings.demoMode && (
              <span className="hidden lg:inline-block text-xs font-mono text-amber-900">
                DEMO DATA — FICTIONAL
              </span>
            )}
            <Link
              to="/safety"
              className="px-3 py-1.5 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Safety Check
            </Link>
            {actions}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="no-print md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-4">
            {settings.demoMode && (
              <div className="text-xs font-mono text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded">
                DEMO DATA — FICTIONAL
              </div>
            )}
            <nav className="space-y-1">
              {primaryNav.map((item) => {
                const Icon = item.icon;
                const active = item.match(location.pathname);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      active
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            {caseQuickNav.length > 0 && (
              <div className="pt-3 border-t border-slate-200">
                <p className="px-3 mb-1.5 text-xs font-medium text-slate-500">
                  Active Case Workflow
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                  {caseQuickNav.map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{sub.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Main Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto">
          {children}
        </main>

        {/* Quiet Prototype Footer */}
        <footer className="no-print border-t border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-4 mt-12">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500">
            <p>
              Sahay — Digital Harassment Safety &amp; Evidence Assistant · Preserve. Protect. Act.
            </p>
            <p>
              Independent prototype — not legal advice, court certification, or an official police portal.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};
