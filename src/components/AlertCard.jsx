import React from 'react';
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  Info,
  Clock,
  MapPin,
  Trash2,
  Radio,
  Share2
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { formatRelativeTime } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export const AlertCard = ({
  alert,
  onDelete,
  canManage = true
}) => {
  const { toggleAlertStatus, addToast } = useApp();

  const isCritical = alert.severity === 'Critical' || alert.alertType === 'Critical';
  const isEmergency = alert.severity === 'Emergency' || alert.alertType === 'Emergency';
  const isWarning = alert.severity === 'Warning' || alert.alertType === 'Warning';
  const isActive = alert.status === 'Active';

  const getBorderColor = () => {
    if (!isActive) return 'border-slate-200 dark:border-slate-800 opacity-75';
    if (isCritical) return 'border-red-500/60 shadow-red-500/10 shadow-lg';
    if (isEmergency) return 'border-orange-500/60 shadow-orange-500/10 shadow-lg';
    if (isWarning) return 'border-amber-500/60 shadow-amber-500/10 shadow-lg';
    return 'border-blue-500/60 shadow-blue-500/10 shadow-lg';
  };

  const getIcon = () => {
    if (isCritical) return <AlertOctagon className="w-6 h-6 text-red-500" />;
    if (isEmergency) return <ShieldAlert className="w-6 h-6 text-orange-500" />;
    if (isWarning) return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    return <Info className="w-6 h-6 text-blue-500" />;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: alert.title,
        text: `${alert.title} - ${alert.message} | ResQNet Alert`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${alert.title}\n\n${alert.message}\nArea: ${alert.affectedArea}`);
      addToast({
        title: 'Alert Copied',
        message: 'Alert details copied to clipboard for sharing.',
        type: 'info'
      });
    }
  };

  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-900 border p-5 sm:p-6 transition-all duration-300 relative overflow-hidden ${getBorderColor()}`}
    >
      {/* Top Accent Strip for active emergencies */}
      {isActive && (
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isCritical
              ? 'bg-red-500'
              : isEmergency
              ? 'bg-orange-500'
              : isWarning
              ? 'bg-amber-500'
              : 'bg-blue-500'
          }`}
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 mt-0.5">
            {getIcon()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <StatusBadge type="severity" value={alert.severity || alert.alertType} size="sm" />
              <StatusBadge type="status" value={alert.status} size="sm" />
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {alert.disasterType}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-display leading-snug">
              {alert.title}
            </h3>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
          title="Share Alert"
          aria-label={`Share ${alert.title}`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Message Body */}
      <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {alert.message}
      </p>

      {/* Action / Safety Instructions if present */}
      {alert.instructions && (
        <div className="mt-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
            <Radio className="w-3.5 h-3.5 text-blue-500" />
            Public Directives:
          </span>
          <p className="text-slate-600 dark:text-slate-400 leading-normal">
            {alert.instructions}
          </p>
        </div>
      )}

      {/* Metadata footer */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <strong className="text-slate-700 dark:text-slate-300">{alert.affectedArea}</strong>
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            Issued: {formatRelativeTime(alert.issuedTime)}
          </span>
        </div>

        {canManage && (
          <div className="flex items-center gap-2">
            <Button
              variant={isActive ? 'warning' : 'outline'}
              size="sm"
              onClick={() => toggleAlertStatus(alert.id)}
            >
              {isActive ? 'Deactivate' : 'Re-activate'}
            </Button>
            {onDelete && (
              <button
                onClick={() => onDelete(alert)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                title="Delete Alert"
                aria-label={`Delete ${alert.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
