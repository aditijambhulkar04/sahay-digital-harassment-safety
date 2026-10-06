/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { SahayProvider } from './context/SahayContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SafetyCheckPage } from './pages/SafetyCheckPage';
import { DashboardPage } from './pages/DashboardPage';
import { CasesPage } from './pages/CasesPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { CaseEvidencePage } from './pages/CaseEvidencePage';
import { CaseTimelinePage } from './pages/CaseTimelinePage';
import { CasePrivacyPage } from './pages/CasePrivacyPage';
import { CaseReportsPage } from './pages/CaseReportsPage';
import { CaseSharingPage } from './pages/CaseSharingPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { SettingsPage } from './pages/SettingsPage';
import { SahayAssistant } from './components/SahayAssistant';

export default function App() {
  return (
    <SahayProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/safety" element={<SafetyCheckPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/cases" element={<CasesPage />} />
          <Route path="/cases/:id" element={<CaseDetailPage />} />
          <Route path="/cases/:id/evidence" element={<CaseEvidencePage />} />
          <Route path="/cases/:id/timeline" element={<CaseTimelinePage />} />
          <Route path="/cases/:id/privacy" element={<CasePrivacyPage />} />
          <Route path="/cases/:id/reports" element={<CaseReportsPage />} />
          <Route path="/cases/:id/sharing" element={<CaseSharingPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>


         <SahayAssistant />
      </BrowserRouter>
    </SahayProvider>
  );
}
