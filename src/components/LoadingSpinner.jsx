import React from 'react';
import { Shield } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading disaster operations data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-blue-600/20 border-t-blue-600 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-red-500/20 border-b-red-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-pulse" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 animate-pulse">
        {text}
      </p>
    </div>
  );
};
