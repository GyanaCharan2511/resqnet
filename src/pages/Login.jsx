import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';

export const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('authority'); // 'authority' | 'volunteer' | 'citizen'
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    // Mock Login
    const userData = {
      id: `USR-${role.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role,
      phone: '+91 98480 99210',
      designation: role === 'authority' ? 'Disaster Operations Officer' : role === 'volunteer' ? 'Field Rescue Specialist' : 'Verified Citizen'
    };

    login(userData);

    if (role === 'citizen') navigate('/citizen');
    else if (role === 'volunteer') navigate('/volunteer');
    else navigate('/dashboard');
  };

  const handleQuickDemoLogin = (selectedRole) => {
    const roleConfigs = {
      authority: {
        id: 'USR-AUTH-001',
        name: 'Director K. Rajeshwar',
        email: 'rajeshwar.k@sdma.gov.in',
        role: 'authority',
        phone: '+91 891 250 9988',
        designation: 'Chief Incident Commander, APSDMA'
      },
      volunteer: {
        id: 'VOL-001',
        name: 'Dr. Sandeep Kilaru',
        email: 'sandeep.k@resqnet.org',
        role: 'volunteer',
        phone: '+91 98480 11982',
        designation: 'Medical First Responder'
      },
      citizen: {
        id: 'USR-CIT-104',
        name: 'Ramesh Varma',
        email: 'ramesh.varma@gmail.com',
        role: 'citizen',
        phone: '+91 98480 22341',
        designation: 'Gajuwaka Resident'
      }
    };

    login(roleConfigs[selectedRole]);
    if (selectedRole === 'citizen') navigate('/citizen');
    else if (selectedRole === 'volunteer') navigate('/volunteer');
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Sign in to ResQNet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Emergency Operations & Response Coordination System
          </p>
        </div>

        {/* 1-Click Demo Login Shortcuts for Viva & Presentation */}
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 dark:text-blue-300 uppercase tracking-wider">
              ⚡ 1-Click Demo Logins:
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">For Viva/Demo</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('authority')}
              className="py-2 px-2 text-center rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer"
            >
              Authority
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('volunteer')}
              className="py-2 px-2 text-center rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer"
            >
              Volunteer
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('citizen')}
              className="py-2 px-2 text-center rounded-xl bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-blue-600 hover:text-white transition-all shadow-xs cursor-pointer"
            >
              Citizen
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Account Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'authority', label: 'Authority' },
                  { id: 'volunteer', label: 'Volunteer' },
                  { id: 'citizen', label: 'Citizen' }
                ].map(r => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      role === r.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember this device</span>
              </label>
              <button
                type="button"
                onClick={() => alert('Demo: Use 1-Click demo logins above or enter any password.')}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-0 p-0 text-xs"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to {role.toUpperCase()}
            </Button>
          </form>

          {/* Register Link */}
          <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
