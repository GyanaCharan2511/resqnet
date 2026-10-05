import React, { useState } from 'react';
import {
  User,
  Moon,
  Sun,
  Bell,
  RefreshCw,
  Database,
  Info,
  Save
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { ConfirmDialog } from '../components/ConfirmDialog';

export const Settings = () => {
  const { currentUser, login, theme, toggleTheme, resetToDemoData, addToast } = useApp();

  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Director K. Rajeshwar',
    email: currentUser?.email || 'rajeshwar.k@sdma.gov.in',
    phone: currentUser?.phone || '+91 891 250 9988',
    designation: currentUser?.designation || 'Chief Incident Commander, APSDMA',
    role: currentUser?.role || 'authority'
  });

  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    incidentReports: true,
    volunteerAssignments: true,
    stockAlerts: false
  });

  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    login({
      ...currentUser,
      ...profile
    });
    addToast({
      title: 'Profile Updated',
      message: 'Your user profile details have been saved to local storage.',
      type: 'success'
    });
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    addToast({
      title: 'Preference Updated',
      message: 'Notification preference saved.',
      type: 'info'
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            System & Profile Settings
          </h1>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Preferences
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure user identity, theme styling, emergency broadcast notifications, and local data persistence.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* User Profile Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-base">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  User Account & Role Profile
                </h3>
                <p className="text-xs text-slate-500">Current active session identity in ResQNet</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Role Privilege
                  </label>
                  <select
                    value={profile.role}
                    onChange={(e) => setProfile(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white capitalize"
                  >
                    <option value="authority">Authority (Admin / EOC HQ)</option>
                    <option value="volunteer">Volunteer (Field Responder)</option>
                    <option value="citizen">Citizen (Public Access)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Designation / Agency Title
                </label>
                <input
                  type="text"
                  value={profile.designation}
                  onChange={(e) => setProfile(p => ({ ...p, designation: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button type="submit" variant="primary" size="md" icon={Save}>
                  Save Profile Settings
                </Button>
              </div>
            </form>
          </div>

          {/* Notification Preferences */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Telemetry & Alert Notifications
                </h3>
                <p className="text-xs text-slate-500">Configure real-time dispatch alerts and sounds</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: 'emergencyAlerts', title: 'High-Priority Disaster Sirens & Red Alerts', desc: 'Instant toast alerts when authorities broadcast Critical level advisories' },
                { key: 'incidentReports', title: 'Citizen Incident Intake Notifications', desc: 'Receive real-time alerts when new incidents are submitted via public SOS' },
                { key: 'volunteerAssignments', title: 'Task Force & Deployment Updates', desc: 'Notifications regarding volunteer assignments and shelter transfers' },
                { key: 'stockAlerts', title: 'Low Stock Level Alerts', desc: 'Alert when key relief items fall below 30% available capacity' }
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => handleToggleNotification(item.key)}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-blue-500/40 transition-colors cursor-pointer"
                >
                  <div className="pr-4">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <div className={`w-11 h-6 rounded-full transition-colors flex items-center p-0.5 ${notifications[item.key] ? 'bg-blue-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'}`}>
                    <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Theme, System Info & Demo Reset */}
        <div className="space-y-6">
          {/* Appearance & Dark Mode Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Appearance Theme
            </h3>
            <p className="text-xs text-slate-500">Choose between dark operations theme or daylight mode</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => theme === 'dark' && toggleTheme()}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'light'
                    ? 'border-blue-600 bg-blue-50/50 text-blue-600 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Sun className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-bold">Light Mode</span>
              </button>

              <button
                type="button"
                onClick={() => theme === 'light' && toggleTheme()}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Moon className="w-6 h-6 text-blue-400" />
                <span className="text-xs font-bold">Dark Mode</span>
              </button>
            </div>
          </div>

          {/* Reset Demo Data Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <Database className="w-5 h-5" />
              <h3 className="text-sm font-bold uppercase tracking-wider">
                Demo State Management
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reset all local mock state (incidents, resources, volunteers, shelters, alerts) back to the pristine initial project presentation dataset.
            </p>

            <Button
              variant="outline"
              size="sm"
              icon={RefreshCw}
              onClick={() => setResetModalOpen(true)}
              className="w-full text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900"
            >
              Reset to Mock Demo Dataset
            </Button>
          </div>

          {/* System Info / Project Metadata */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
              <Info className="w-4 h-4 text-blue-500" />
              <span>About ResQNet Framework</span>
            </div>
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Framework:</span>
                <strong>React.js 19 + Vite 8</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Styling Engine:</span>
                <strong>Tailwind CSS v4</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">GIS Mapping:</span>
                <strong>Leaflet + OpenStreetMap</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Visual Analytics:</span>
                <strong>Recharts Library</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Persistence:</span>
                <strong>HTML5 LocalStorage</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={resetToDemoData}
        title="Reset All Mock Data"
        message="Are you sure you want to restore all initial 16 incidents, 14 resources, 16 volunteers, 8 shelters, and 8 alerts? Any custom additions will be reverted."
        confirmText="Reset Everything"
        confirmVariant="danger"
      />
    </div>
  );
};
