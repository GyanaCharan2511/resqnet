import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Flame,
  MapPin,
  Box,
  Bell,
  Home
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileNav = () => {
  const { stats } = useApp();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'HQ', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Incidents', path: '/incidents', icon: Flame, badge: stats.criticalIncidents > 0 ? stats.criticalIncidents : null },
    { name: 'Map', path: '/map', icon: MapPin },
    { name: 'Alerts', path: '/alerts', icon: Bell, badge: stats.activeAlerts > 0 ? stats.activeAlerts : null },
    { name: 'Resources', path: '/resources', icon: Box },
  ];

  return (
    <nav aria-label="Mobile Navigation" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-semibold transition-all relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {item.badge !== undefined && item.badge !== null && (
                  <span className="absolute -top-1 -right-2 px-1.2 py-0.2 min-w-[14px] h-[14px] rounded-full text-[9px] font-bold bg-red-500 text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="mt-0.5">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
