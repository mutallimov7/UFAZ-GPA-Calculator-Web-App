import React from 'react';
import {
  LayoutDashboard,
  Calculator,
  Sliders,
  Trophy,
  BarChart3,
  FileText,
  GraduationCap,
  History,
  GitCompare,
  Bell,
  Shield,
  FileCheck,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export type NavView =
  | 'overview'
  | 'calculator'
  | 'simulator'
  | 'ranking'
  | 'statistics'
  | 'transcript'
  | 'degree-progress'
  | 'history'
  | 'compare'
  | 'announcements'
  | 'legal'
  | 'admin';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { user } = useAuth();

  const handleNav = (v: NavView) => {
    onSelectView(v);
    if (onCloseMobile) onCloseMobile();
  };

  const navSectionClass = 'text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1 mt-4';
  const navItemClass = (isActive: boolean) =>
    `w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
      isActive
        ? 'bg-[#1e3a8a] text-white font-semibold shadow-sm'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-40 flex flex-col justify-between overflow-y-auto transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-3">
          {/* Quick Academic Context Pill */}
          <div className="bg-[#f0f4f9] border border-[#d9e2ec] rounded-lg p-2.5 mb-2">
            <div className="text-[11px] text-slate-500 font-medium">Active Student Record</div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {user ? user.fullName : 'Guest'}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 mt-1">
              <span>{user?.programId.toUpperCase()} • {user?.academicLevel}</span>
              <span className="font-mono-grades font-semibold text-blue-800">
                GPA {user?.gpa ? user.gpa.toFixed(2) : '15.86'}
              </span>
            </div>
          </div>

          {/* ACADEMIC */}
          <div className={navSectionClass}>Academic</div>
          <div className="space-y-0.5">
            <button
              onClick={() => handleNav('overview')}
              className={navItemClass(currentView === 'overview')}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => handleNav('calculator')}
              className={navItemClass(currentView === 'calculator')}
            >
              <Calculator className="w-4 h-4 shrink-0" />
              <span>GPA Calculator</span>
            </button>
            <button
              onClick={() => handleNav('simulator')}
              className={navItemClass(currentView === 'simulator')}
            >
              <Sliders className="w-4 h-4 shrink-0" />
              <span>Grade Simulator</span>
            </button>
            <button
              onClick={() => handleNav('ranking')}
              className={navItemClass(currentView === 'ranking')}
            >
              <Trophy className="w-4 h-4 shrink-0" />
              <div className="flex items-center justify-between w-full">
                <span>Cohort Ranking</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                  62 peers
                </span>
              </div>
            </button>
            <button
              onClick={() => handleNav('statistics')}
              className={navItemClass(currentView === 'statistics')}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Statistics</span>
            </button>
          </div>

          {/* ACADEMIC RECORD */}
          <div className={navSectionClass}>Academic Record</div>
          <div className="space-y-0.5">
            <button
              onClick={() => handleNav('transcript')}
              className={navItemClass(currentView === 'transcript')}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Official Transcript</span>
            </button>
            <button
              onClick={() => handleNav('degree-progress')}
              className={navItemClass(currentView === 'degree-progress')}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>Degree Progress (ECTS)</span>
            </button>
            <button
              onClick={() => handleNav('history')}
              className={navItemClass(currentView === 'history')}
            >
              <History className="w-4 h-4 shrink-0" />
              <span>GPA History</span>
            </button>
          </div>

          {/* TOOLS */}
          <div className={navSectionClass}>Tools</div>
          <div className="space-y-0.5">
            <button
              onClick={() => handleNav('compare')}
              className={navItemClass(currentView === 'compare')}
            >
              <GitCompare className="w-4 h-4 shrink-0" />
              <span>Peer Comparison</span>
            </button>
          </div>

          {/* SYSTEM */}
          <div className={navSectionClass}>System</div>
          <div className="space-y-0.5">
            <button
              onClick={() => handleNav('announcements')}
              className={navItemClass(currentView === 'announcements')}
            >
              <Bell className="w-4 h-4 shrink-0" />
              <span>Announcements</span>
            </button>
            <button
              onClick={() => handleNav('legal')}
              className={navItemClass(currentView === 'legal')}
            >
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>Privacy & Regulations</span>
            </button>
          </div>

          {/* ADMIN MANAGEMENT */}
          {user?.role === 'admin' && (
            <>
              <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider px-3 mb-1 mt-4">
                Administration
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleNav('admin')}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${
                    currentView === 'admin'
                      ? 'bg-amber-700 text-white font-semibold shadow-sm'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Admin Control Center</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 bg-slate-50/70">
          <div className="flex items-center justify-between">
            <span>UFAZ v2.4 Platform</span>
            <span className="font-mono-grades text-emerald-700 font-medium">Ready</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            French 20-pt grading scale & ECTS
          </p>
        </div>
      </aside>
    </>
  );
};
