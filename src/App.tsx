/**
 * AgriYield AI - Crop Yield Prediction & Agroclimatic Analytics
 * Based on Pareek et al. (2026) "An optimized hybrid CNN–Bi-LSTM framework using ACO–WOA for crop yield prediction"
 * Discover Applied Sciences 8:1203.
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { FlashProvider } from './context/FlashContext';
import { Header, NavTab } from './components/Header';
import { FlashNotificationBanner } from './components/FlashNotification';
import { Dashboard } from './components/Dashboard';
import { CsvPredictor } from './components/CsvPredictor';
import { DistrictSearch } from './components/DistrictSearch';
import { ModelDiagnostics } from './components/ModelDiagnostics';
import { RegisterPage } from './components/RegisterPage';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [prefilledDistrict, setPrefilledDistrict] = useState<string>('Jaipur');

  const handleSelectDistrictForPrediction = (districtName: string) => {
    setPrefilledDistrict(districtName);
    setActiveTab('predictor');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Basic Flash Notification Floating Banner */}
      <FlashNotificationBanner />

      {/* Main App Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onQuickUploadClick={() => setActiveTab('predictor')}
      />

      {/* Main Viewport Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            onNavigate={setActiveTab}
            onSelectDistrict={handleSelectDistrictForPrediction}
          />
        )}

        {activeTab === 'predictor' && (
          <CsvPredictor initialDistrict={prefilledDistrict} />
        )}

        {activeTab === 'districts' && (
          <DistrictSearch onSelectForPrediction={handleSelectDistrictForPrediction} />
        )}

        {activeTab === 'diagnostics' && (
          <ModelDiagnostics />
        )}

        {activeTab === 'register' && (
          <RegisterPage onSuccessRedirect={() => setActiveTab('dashboard')} />
        )}
      </main>

      {/* Academic Citation & System Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-semibold text-slate-800">AgriYield AI</span> — Optimized Hybrid CNN–Bi-LSTM Framework (ACO–WOA)
            <div className="mt-1 text-slate-400">
              Grounded in empirical wheat data from ICRISAT & NASA POWER (Rajasthan 1981–2017)
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('diagnostics')}
              className="hover:text-emerald-700 transition-colors"
            >
              Discover Applied Sci. 8:1203 (2026)
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setActiveTab('register')}
              className="hover:text-emerald-700 transition-colors"
            >
              Account Management
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FlashProvider>
        <AppContent />
      </FlashProvider>
    </AuthProvider>
  );
}
