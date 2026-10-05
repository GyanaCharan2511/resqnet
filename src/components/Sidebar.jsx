import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  MapPin,
  Box,
  Users,
  Home,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { currentUser, logout, stats, resetToDemoData } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { name: 'Dashboard HQ', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incidents', path: '/incidents', icon: Flame, badge: stats.criticalIncidents > 0 ? `${stats.criticalIncidents} Critical` : stats.activeIncidents },
    { name: 'Emergency Map', path: '/map', icon: MapPin },
    { name: 'Resource Stockpile', path: '/resources', icon: Box, badge: stats.lowStockResources > 0 ? `${stats.lowStockResources} Low` : null },
    { name: 'Volunteer Roster', path: '/volunteers', icon: Users, badge: stats.availableVolunteers },
    { name: 'Relief Shelters', path: '/shelters', icon: Home },
    { name: 'Emergency Alerts', path: '/alerts', icon: Bell, badge: stats.activeAlerts > 0 ? `${stats.activeAlerts} Live` : null },
    { name: 'Analytics & Trends', path: '/analytics', icon: BarChart3 },
    { name: 'System Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside aria-label="Operations Navigation" className="w-64 shrink-0 hidden lg:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 min-h-[calc(100vh-4rem)] transition-colors">
      {/* Operation Center Status Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              System Operational
            </span>
          </div>
          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-500/20">
            EOC Level 1
          </span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          Emergency Operations Center
        </p>
      </div>

      {/* Role Switcher Pills for Demonstration */}
      <div className="px-4 py-2.5 bg-slate-100/60 dark:bg-slate-800/50 border-b border-slate-200/60 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Role Views:
        </p>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => navigate('/dashboard')}
            className={`py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
              location.pathname === '/dashboard'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Authority
          </button>
          <button
            onClick={() => navigate('/volunteer')}
            className={`py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
              location.pathname === '/volunteer'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Volunteer
          </button>
          <button
            onClick={() => navigate('/citizen')}
            className={`py-1 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer ${
              location.pathname === '/citizen'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Citizen
          </button>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Management & Dispatch
        </p>

        {navigationItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge !== undefined && item.badge !== null && item.badge !== '' && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : String(item.badge).includes('Critical') || String(item.badge).includes('Live')
                          ? 'bg-red-500/10 text-red-600 dark:bg-red-950/50 dark:text-red-400 border border-red-500/20'
                          : String(item.badge).includes('Low')
                          ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-1.5">
        <button
          onClick={resetToDemoData}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          title="Reset incidents, volunteers, resources, shelters to initial mock dataset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>

        {currentUser && (
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        )}
      </div>
    </aside>
  );
};
