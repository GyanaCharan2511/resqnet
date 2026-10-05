import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue', // 'blue', 'red', 'amber', 'emerald', 'indigo', 'purple'
  trend,
  trendType = 'up', // 'up', 'down', 'neutral'
  badge,
  onClick,
  className = ''
}) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10 dark:bg-blue-950/40',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'hover:border-blue-500/40',
      glow: 'from-blue-600/10 to-transparent'
    },
    red: {
      bg: 'bg-red-500/10 dark:bg-red-950/40',
      text: 'text-red-600 dark:text-red-400',
      border: 'hover:border-red-500/40',
      glow: 'from-red-600/10 to-transparent'
    },
    amber: {
      bg: 'bg-amber-500/10 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'hover:border-amber-500/40',
      glow: 'from-amber-600/10 to-transparent'
    },
    emerald: {
      bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'hover:border-emerald-500/40',
      glow: 'from-emerald-600/10 to-transparent'
    },
    indigo: {
      bg: 'bg-indigo-500/10 dark:bg-indigo-950/40',
      text: 'text-indigo-600 dark:text-indigo-400',
      border: 'hover:border-indigo-500/40',
      glow: 'from-indigo-600/10 to-transparent'
    },
    purple: {
      bg: 'bg-purple-500/10 dark:bg-purple-950/40',
      text: 'text-purple-600 dark:text-purple-400',
      border: 'hover:border-purple-500/40',
      glow: 'from-purple-600/10 to-transparent'
    }
  }[color] || {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600',
    border: 'hover:border-blue-500/40',
    glow: 'from-blue-600/10 to-transparent'
  };

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5.5 shadow-sm transition-all duration-300 hover:shadow-lg ${colorMap.border} ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorMap.glow} rounded-bl-full pointer-events-none`} />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-50 font-display">
              {value}
            </h3>
            {badge && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {badge}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${colorMap.bg} ${colorMap.text} shadow-sm shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {subtitle && (
            <span className="text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
              {subtitle}
            </span>
          )}
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                trendType === 'up'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : trendType === 'down'
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-slate-500'
              }`}
            >
              {trendType === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
              {trendType === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
