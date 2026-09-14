import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  Shield,
  ShieldAlert,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Sparkles,
  KeyRound,
  X,
} from 'lucide-react';

export const AuthView: React.FC = () => {
  const { login, setPasswordDirect } = useAuth();

  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Optional "Forgot Password" modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotId, setForgotId] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [showForgotPass, setShowForgotPass] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanId = identifier.trim();
    if (!cleanId) {
      setErrorMessage('Please enter your Student ID or UFAZ email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter a password.');
      return;
    }
    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      await login(cleanId, password);
      // Logged in! The AuthContext automatically updates the user state.
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid Student ID/Email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);

    const cleanId = forgotId.trim();
    if (!cleanId) {
      setForgotError('Please enter your Student ID or UFAZ email address.');
      return;
    }
    if (!forgotNewPass || forgotNewPass.length < 4) {
      setForgotError('Password must be at least 4 characters long.');
      return;
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setForgotError('Passwords do not match. Please re-enter your password to confirm.');
      return;
    }

    try {
      setIsResetting(true);
      await setPasswordDirect(cleanId, forgotNewPass);
      setShowForgotModal(false);
      // Auto logged in!
    } catch (err: any) {
      setForgotError(err.message || 'Failed to update password. Please check your Student ID/Email.');
    } finally {
      setIsResetting(false);
    }
  };

  const openForgotModal = () => {
    setForgotId(identifier.trim());
    setForgotNewPass('');
    setForgotConfirmPass('');
    setForgotError(null);
    setShowForgotModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1928] via-[#0f2438] to-[#17334d] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-body">
      {/* Top Academic Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-2 border-b border-[#234c70]/60 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-[#1e3a8a] border border-[#3b82f6]/40 flex items-center justify-center font-academic-crest text-lg font-bold tracking-wider text-white shadow-md">
            UF
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-academic-crest text-sm tracking-widest uppercase font-bold text-white">
                UFAZ
              </span>
              <span className="text-[11px] text-slate-300 border-l border-slate-600 pl-2">
                French-Azerbaijani University
              </span>
            </div>
            <p className="text-[11px] text-blue-200">
              Co-accredited with Université de Strasbourg & Université de Rennes 1
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-300 bg-[#17334d]/80 px-3 py-1.5 rounded-md border border-[#2b5880]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Confidential Academic Portal</span>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Institutional Badge Header */}
          <div className="bg-[#102a45] text-white p-6 border-b border-[#1b3d5d]">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-blue-900/60 border border-blue-500/40 text-blue-300">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-academic-title tracking-tight text-white">
                  Academic Evaluation Portal
                </h1>
                <p className="text-xs text-slate-300 mt-0.5">
                  UFAZ Student Portal • GPA Calculation & Cohort Ranking System
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {/* Institutional Privacy Notification Box */}
            <div className="p-3 bg-blue-50/90 rounded-lg border border-blue-200 text-xs text-blue-950 flex items-start space-x-2.5">
              <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold text-blue-900">Protected Academic Portal • Privacy Policy: </span>
                To protect student confidentiality, each student may only access their personal academic records. Accessing other students' accounts is strictly prohibited by UFAZ data regulations.
              </div>
            </div>

            {errorMessage && (
              <div className={`p-3.5 rounded-lg border text-xs flex items-start space-x-2 ${
                errorMessage.toLowerCase().includes('privacy') || errorMessage.toLowerCase().includes('denied')
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {errorMessage.toLowerCase().includes('privacy') || errorMessage.toLowerCase().includes('denied') ? (
                  <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span className="font-medium">{errorMessage}</span>
                  {errorMessage.toLowerCase().includes('incorrect') && (
                    <div className="mt-1.5 pt-1.5 border-t border-red-200/80">
                      <button
                        type="button"
                        onClick={openForgotModal}
                        className="font-bold text-blue-800 hover:text-blue-950 underline cursor-pointer"
                      >
                        Click here to reset your password directly
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Student ID / Email */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Student ID or UFAZ Email
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier('22422996');
                      setErrorMessage(null);
                    }}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-medium hover:underline cursor-pointer"
                  >
                    Use my ID (22422996)
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-id"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g., 22422996 or e.mutallimov@ufaz.az"
                    className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    autoFocus
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Mutallimov Eldar (ID: 22422996) • e.mutallimov@ufaz.az
                </p>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={openForgotModal}
                    className="text-xs text-blue-700 hover:text-blue-900 font-medium hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="input-login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  If this is your first time, the password entered here will be saved for your account.
                </p>
              </div>

              {/* Submit Button */}
              <button
                id="btn-login-submit"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-[#1e3a8a] hover:bg-[#193275] text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2 disabled:opacity-60 cursor-pointer"
              >
                {isLoading ? (
                  <span>Signing in...</span>
                ) : (
                  <>
                    <span>Sign In to Student Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Academic Data</span>
              </span>
              <button
                type="button"
                onClick={openForgotModal}
                className="text-blue-700 hover:underline cursor-pointer"
              >
                Need to change password?
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="bg-[#102a45] text-white p-5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <KeyRound className="w-5 h-5 text-blue-300" />
                <h3 className="font-bold text-sm text-white">Reset Password</h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-300 hover:text-white p-1 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleForgotReset} className="p-6 space-y-4">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-md text-[11px] text-blue-900 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>Password updates are strictly authorized for your verified student account (Mutallimov Eldar / ID: 22422996).</span>
              </div>

              {forgotError && (
                <div className={`p-3 rounded-lg border text-xs flex items-start space-x-2 ${
                  forgotError.toLowerCase().includes('privacy') || forgotError.toLowerCase().includes('denied')
                    ? 'bg-rose-50 border-rose-300 text-rose-950'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  {forgotError.toLowerCase().includes('privacy') || forgotError.toLowerCase().includes('denied') ? (
                    <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium">{forgotError}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Student ID or UFAZ Email
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotId('22422996')}
                    className="text-[11px] text-blue-700 hover:text-blue-900 font-medium hover:underline cursor-pointer"
                  >
                    Set to my ID (22422996)
                  </button>
                </div>
                <input
                  type="text"
                  value={forgotId}
                  onChange={(e) => setForgotId(e.target.value)}
                  placeholder="e.g., 22422996 or e.mutallimov@ufaz.az"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showForgotPass ? 'text' : 'password'}
                    value={forgotNewPass}
                    onChange={(e) => setForgotNewPass(e.target.value)}
                    placeholder="Enter new password (min 4 characters)"
                    className="w-full px-3 pr-10 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotPass(!showForgotPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showForgotPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type={showForgotPass ? 'text' : 'password'}
                  value={forgotConfirmPass}
                  onChange={(e) => setForgotConfirmPass(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 py-2 px-3 border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isResetting ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Save & Sign In</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Institutional Notice */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 py-4 border-t border-[#234c70]/40">
        <p>
          UFAZ Privacy Policy: Student academic results, module grades, and calculation dossiers are encrypted and strictly confidential.
        </p>
      </div>
    </div>
  );
};
