import React, { useState } from 'react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useFlash } from '../context/FlashContext';
import { RAJASTHAN_DISTRICTS } from '../data/rajasthanData';
import { UserPlus, LogIn, LogOut, CheckCircle2, ShieldCheck, Building2, MapPin, UserCheck } from 'lucide-react';

interface RegisterPageProps {
  onSuccessRedirect?: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccessRedirect }) => {
  const { currentUser, register, login, logout } = useAuth();
  const { flash } = useFlash();

  const [mode, setMode] = useState<'register' | 'login'>('register');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [organization, setOrganization] = useState('');
  const [district, setDistrict] = useState('Jaipur');
  const [role, setRole] = useState<UserProfile['role']>('Agronomist');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      flash('Please provide your name and email address.', 'warning');
      return;
    }

    if (password && confirmPassword && password !== confirmPassword) {
      flash('Passwords do not match. Please verify.', 'error');
      return;
    }

    const res = register({
      name,
      email,
      organization: organization.trim() || 'Agricultural Extension Center',
      district,
      role,
      password
    });

    if (res.success) {
      flash(`Welcome to AgriYield AI, ${name}! Your account has been registered successfully.`, 'success');
      if (onSuccessRedirect) onSuccessRedirect();
    } else {
      flash(res.error || 'Registration failed. Please check inputs.', 'error');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      flash('Please enter your registered email.', 'warning');
      return;
    }

    const res = login(loginEmail);
    if (res.success) {
      flash('Welcome back! Signed in successfully.', 'success');
      if (onSuccessRedirect) onSuccessRedirect();
    } else {
      flash(res.error || 'Invalid email credentials.', 'error');
    }
  };

  const handleDemoSignIn = (presetEmail: string, presetName: string) => {
    login(presetEmail);
    flash(`Signed in as demo researcher: ${presetName}.`, 'info');
    if (onSuccessRedirect) onSuccessRedirect();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 tracking-wide uppercase mb-1">
          <span>User Authentication & Access Management</span>
          <span aria-hidden="true">·</span>
          <span>Role-Based Agroclimatic Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {currentUser ? 'Agronomist Profile & Session' : mode === 'register' ? 'Register New Agronomist Account' : 'Portal Login'}
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Create an account to save prediction batches, track regional district yields, and export customized agroclimatic yield forecasts.
        </p>
      </div>

      {/* Active User Card if already signed in */}
      {currentUser && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                {currentUser.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Active Session
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{currentUser.email}</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                flash('You have been signed out.', 'info');
              }}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400">Assigned District:</span>
              <div className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.district} District</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400">Organization:</span>
              <div className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>{currentUser.organization}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400">Professional Role:</span>
              <div className="font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Card (Register / Login Tabs) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        
        {/* Mode Toggle */}
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setMode('register')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 mr-6 ${
              mode === 'register'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Create New Account
          </button>
          <button
            onClick={() => setMode('login')}
            className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-emerald-700 text-emerald-800'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Sign In with Existing Account
          </button>
        </div>

        {mode === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Meena"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@icar.gov.in"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary District
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  {RAJASTHAN_DISTRICTS.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Professional Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full text-sm px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                >
                  <option value="Agronomist">Agronomist</option>
                  <option value="Agricultural Officer">Agricultural Officer</option>
                  <option value="Research Scholar">Research Scholar</option>
                  <option value="Farmer">Farmer / Producer</option>
                  <option value="Policy Analyst">Policy Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Organization / Farm
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. KVK Jaipur / RARI Durgapura"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="vaibhav.pareek@agri-rajasthan.gov.in"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Dashboard</span>
            </button>
          </form>
        )}

        {/* 1-Click Demo Profiles */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-3">
            Quick 1-Click Demo Profiles (For Instant VS Code Review)
          </span>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleDemoSignIn('vaibhav.pareek@agri-rajasthan.gov.in', 'Dr. Vaibhav Pareek')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dr. Vaibhav Pareek (Lead Author / ICRISAT)</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSignIn('ramesh.farmer@rajasthan.krishi.in', 'Ramesh Patel')}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Ramesh Patel (Progressive Wheat Farmer, Sri Ganganagar)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
