import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Header } from './components/common/Header.tsx';
import { Sidebar, NavView } from './components/common/Sidebar.tsx';
import { AuthView } from './components/auth/AuthView.tsx';
import { OverviewView } from './components/dashboard/OverviewView.tsx';
import { GpaCalculatorView } from './components/calculator/GpaCalculatorView.tsx';
import { GradeSimulatorView } from './components/simulator/GradeSimulatorView.tsx';
import { RankingView } from './components/ranking/RankingView.tsx';
import { StatisticsView } from './components/statistics/StatisticsView.tsx';
import { TranscriptView } from './components/record/TranscriptView.tsx';
import { DegreeProgressView } from './components/record/DegreeProgressView.tsx';
import { GpaHistoryView } from './components/history/GpaHistoryView.tsx';
import { CompareView } from './components/compare/CompareView.tsx';
import { AnnouncementsView } from './components/announcements/AnnouncementsView.tsx';
import { LegalView } from './components/legal/LegalView.tsx';
import { AdminPanelView } from './components/admin/AdminPanelView.tsx';
import { Menu, X } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<NavView>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f2438] flex flex-col items-center justify-center text-white font-body p-4">
        <div className="w-12 h-12 rounded-xl bg-[#1e3a8a] border border-[#3b82f6]/40 flex items-center justify-center font-academic-crest text-xl font-bold tracking-wider text-white shadow-lg animate-pulse">
          UF
        </div>
        <p className="mt-4 text-xs font-semibold tracking-widest text-slate-300 uppercase">
          UFAZ Portal Yüklənir...
        </p>
        <p className="text-[11px] text-slate-400 mt-1">Université Franco-Azerbaïdjanaise</p>
      </div>
    );
  }

  // Enforce authentication & privacy: never open directly to a student's personal page without credentials
  if (!user) {
    return <AuthView />;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col font-body text-slate-800">
      {/* Institutional Header */}
      <Header
        onOpenAnnouncements={() => setCurrentView('announcements')}
      />

      {/* Sub-header for Mobile Navigation trigger */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
        >
          <Menu className="w-4 h-4" />
          <span>Academic Menu</span>
        </button>

        <span className="text-xs font-semibold text-blue-900 capitalize">
          {currentView.replace('-', ' ')}
        </span>
      </div>

      {/* Body Layout: Sidebar + Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {currentView === 'overview' && <OverviewView onNavigate={setCurrentView} />}
          {currentView === 'calculator' && <GpaCalculatorView />}
          {currentView === 'simulator' && <GradeSimulatorView />}
          {currentView === 'ranking' && <RankingView />}
          {currentView === 'statistics' && <StatisticsView />}
          {currentView === 'transcript' && <TranscriptView />}
          {currentView === 'degree-progress' && <DegreeProgressView />}
          {currentView === 'history' && <GpaHistoryView />}
          {currentView === 'compare' && <CompareView onNavigate={setCurrentView} />}
          {currentView === 'announcements' && <AnnouncementsView />}
          {currentView === 'legal' && <LegalView />}
          {currentView === 'admin' && <AdminPanelView />}
        </main>
      </div>

      {/* Institutional Footer */}
      <footer className="bg-[#0f2438] text-slate-400 border-t border-[#1b3d5d] py-6 px-4 text-xs text-center mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-slate-300">
            <span className="font-academic-crest text-sm text-white font-bold tracking-wider">UFAZ</span>
            <span>•</span>
            <span>French-Azerbaijani University</span>
            <span>•</span>
            <span className="text-blue-200">Université de Strasbourg Partnership</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Grading Scale: French 0–20 • Bologna ECTS Accredited (180 ECTS Licence) • Confidential Deliberation Rules
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
