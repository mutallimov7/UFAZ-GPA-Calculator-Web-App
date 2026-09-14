import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { api } from '../../services/api.ts';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  Bell,
  ChevronDown,
  LogOut,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

interface HeaderProps {
  onOpenAnnouncements?: () => void;
  announcementCount?: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAnnouncements, announcementCount = 4 }) => {
  const { user, switchUser, logout, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);
  const [isChangingPass, setIsChangingPass] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    if (!oldPass || !newPass) {
      setPassError('Bütün xanaları doldurun.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('Yeni şifrə ən azı 6 simvol olmalıdır.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('Yeni şifrə və təsdiqi uyğun gəlmir.');
      return;
    }

    try {
      setIsChangingPass(true);
      await api.changePassword(oldPass, newPass);
      setPassSuccess('Şifrəniz uğurla dəyişdirildi!');
      setTimeout(() => {
        setPasswordModalOpen(false);
        setOldPass('');
        setNewPass('');
        setConfirmPass('');
        setPassSuccess(null);
      }, 1500);
    } catch (err: any) {
      setPassError(err.message || 'Şifrə dəyişdirilə bilmədi.');
    } finally {
      setIsChangingPass(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#0f2438] text-white border-b border-[#1b3d5d] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Institutional Branding */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#1e3a8a] border border-[#3b82f6]/40 flex items-center justify-center font-academic-crest text-lg font-bold tracking-wider text-white shadow-inner">
              UF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-academic-crest text-sm tracking-widest uppercase font-semibold text-slate-100">
                  UFAZ
                </span>
                <span className="text-[11px] text-slate-400 border-l border-slate-600 pl-2">
                  Université Franco-Azerbaïdjanaise
                </span>
              </div>
              <p className="text-[11px] text-slate-300 font-medium">
                Academic GPA, Deliberation & Cohort Ranking Portal
              </p>
            </div>
          </div>

          {/* Center: University Partnership Status */}
          <div className="hidden md:flex items-center space-x-3 text-xs bg-[#17334d] px-3 py-1.5 rounded border border-[#234c70]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-slate-300">Co-accredited with</span>
            <span className="font-medium text-white">Université de Strasbourg</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-200">Session S4 (2025–2026)</span>
          </div>

          {/* Right: Quick Persona & User Info */}
          <div className="flex items-center space-x-3">
            {/* Announcements quick alert */}
            <button
              onClick={onOpenAnnouncements}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-[#1a3854] rounded-lg transition-colors"
              title="University Notices"
              aria-label="Announcements"
            >
              <Bell className="w-4 h-4" />
              {announcementCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-400 rounded-full"></span>
              )}
            </button>

            {/* Authenticated User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-[#17334d] hover:bg-[#1f4366] text-left px-3 py-1.5 rounded-lg border border-[#2b5880] text-xs transition-colors"
                >
                  {user.role === 'admin' ? (
                    <div className="w-6 h-6 rounded bg-amber-900/60 text-amber-300 border border-amber-600/40 flex items-center justify-center">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded bg-blue-900/60 text-blue-300 border border-blue-500/40 flex items-center justify-center">
                      <UserCheck className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="hidden sm:block">
                    <div className="font-medium text-slate-100 leading-tight truncate max-w-[140px]">
                      {user.fullName}
                    </div>
                    <div className="text-[10px] text-slate-400 capitalize">
                      {user.role === 'admin' ? 'Administrator' : `ID: ${user.studentId}`}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 text-sm">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{user.email}</p>
                      <div className="mt-1.5 flex items-center space-x-1.5 text-[11px] text-blue-800 font-medium">
                        <span className="bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {user.programId.toUpperCase()} {user.academicLevel}
                        </span>
                        {user.group && (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                            Qrup: {user.group}
                          </span>
                        )}
                        <span className="bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                          Qorunur
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setPasswordModalOpen(true);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center space-x-2 text-slate-700"
                      >
                        <Key className="w-4 h-4 text-blue-600" />
                        <span>Şəxsi Şifrəni Dəyişdir (Change Password)</span>
                      </button>

                      {user.role === 'admin' && (
                        <div className="border-t border-slate-100 pt-1 mt-1">
                          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                            Admin Test Keçidi
                          </div>
                          <button
                            onClick={() => {
                              switchUser('student');
                              setMenuOpen(false);
                            }}
                            className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center space-x-2 text-slate-600 text-[11px]"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-blue-500" />
                            <span>Tələbə Görünüşü (Eldar Mutallimov)</span>
                          </button>
                        </div>
                      )}

                      <div className="border-t border-slate-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            logout();
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 font-semibold flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Çıxış Et (Log Out)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Change Password Modal */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-[#102a45] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-300" />
                <h3 className="font-semibold text-sm">Şəxsi Şifrənin Dəyişdirilməsi</h3>
              </div>
              <button
                onClick={() => setPasswordModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="p-5 space-y-4 text-xs">
              {passError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{passError}</span>
                </div>
              )}

              {passSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cari Şifrə</label>
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="İndiki şifrənizi daxil edin"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Yeni Şifrə</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Ən azı 6 simvol"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Yeni Şifrənin Təkrarı</label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Yeni şifrəni təkrar edin"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPasswordModalOpen(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Ləğv et
                </button>
                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold flex items-center space-x-1 disabled:opacity-50"
                >
                  {isChangingPass ? <span>Saxlanılır...</span> : <span>Şifrəni Yenilə</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
