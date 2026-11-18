import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminLoginPage = () => {
  const { adminLogin, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!adminId.trim() || !password) {
      setErrorMessage('Please provide both Admin ID and Password.');
      return;
    }

    setSubmitting(true);
    const result = await adminLogin(adminId.trim(), password);
    setSubmitting(false);

    if (result.success) {
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } else {
      setErrorMessage(result.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const fillSuperAdminDemo = () => {
    setAdminId('CT-SUPER-0001');
    setPassword('Admin@CivicTrack2025');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-[#102544] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient gradient blurs */}
      <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-[#07845F]/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-96 h-96 bg-[#E95532]/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Logo */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-[#07845F] flex items-center justify-center shadow-lg shadow-[#07845F]/30">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          CivicTrack Administration
        </h2>
        <p className="mt-1.5 text-center text-xs sm:text-sm text-slate-300">
          Smart Civic Issue Reporting Platform — Central Authority Gateway
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-2xl rounded-3xl border border-slate-100">
          {/* Official Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 py-1.5 px-3 bg-slate-50 border border-slate-200/80 rounded-full w-fit mx-auto text-slate-700 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#07845F]" />
            <span>Authorized Personnel Only</span>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin ID / Official Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. CT-SUPER-0001"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[#102544] placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#07845F] focus:ring-2 focus:ring-[#07845F]/20 transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter your unique jurisdictional Administrator ID.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Secret Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-[#102544] placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-[#07845F] focus:ring-2 focus:ring-[#07845F]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                256-Bit TLS Session
              </span>
              <span className="text-slate-400 text-[11px]">
                5 failed attempts triggers lockout
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-white font-bold text-sm bg-[#07845F] hover:bg-[#066f50] focus:ring-4 focus:ring-[#07845F]/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#07845F]/25 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Authorization...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={fillSuperAdminDemo}
              className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Use Super Admin Credentials (CT-SUPER-0001)</span>
            </button>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-xs font-medium text-slate-500 hover:text-[#102544] transition-colors"
            >
              Are you a citizen? <span className="text-[#07845F] font-bold">Go to Citizen Login →</span>
            </Link>
          </div>
        </div>

        {/* Security disclaimer footer */}
        <p className="mt-6 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          Unauthorized access is strictly monitored under the Information Technology Act.
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
