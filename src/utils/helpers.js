// Helper utility functions for ResQNet

// Generate unique incident ID like INC-2026-042
export const generateIncidentId = (existingList = []) => {
  const year = new Date().getFullYear();
  const count = (existingList.length + 1).toString().padStart(3, '0');
  return `INC-${year}-${count}`;
};

// Generate unique resource ID
export const generateResourceId = (existingList = []) => {
  const count = (existingList.length + 1).toString().padStart(3, '0');
  return `RES-${count}`;
};

// Generate unique volunteer ID
export const generateVolunteerId = (existingList = []) => {
  const count = (existingList.length + 1).toString().padStart(3, '0');
  return `VOL-${count}`;
};

// Generate unique shelter ID
export const generateShelterId = (existingList = []) => {
  const count = (existingList.length + 1).toString().padStart(3, '0');
  return `SHL-${count}`;
};

// Generate unique alert ID
export const generateAlertId = (existingList = []) => {
  const count = (existingList.length + 1).toString().padStart(3, '0');
  return `ALT-${count}`;
};

// Format Date & Time
export const formatDateTime = (dateString) => {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
};

// Format Relative Time (e.g. 10 mins ago)
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Recent';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  } catch {
    return dateString;
  }
};

// Format Numbers with commas
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return Number(num).toLocaleString();
};

// Color token helpers
export const getSeverityColor = (severity) => {
  switch (severity?.toLowerCase()) {
    case 'critical':
      return {
        bg: 'bg-red-500/10 dark:bg-red-950/40',
        text: 'text-red-600 dark:text-red-400',
        border: 'border-red-500/30',
        badge: 'bg-red-500 text-white',
        dot: 'bg-red-500',
        hex: '#ef4444'
      };
    case 'high':
      return {
        bg: 'bg-orange-500/10 dark:bg-orange-950/40',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-orange-500 text-white',
        dot: 'bg-orange-500',
        hex: '#f97316'
      };
    case 'medium':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-950/40',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500 text-white',
        dot: 'bg-amber-500',
        hex: '#eab308'
      };
    case 'low':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500 text-white',
        dot: 'bg-emerald-500',
        hex: '#10b981'
      };
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        badge: 'bg-slate-500 text-white',
        dot: 'bg-slate-400',
        hex: '#64748b'
      };
  }
};

export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'reported':
      return {
        bg: 'bg-blue-500/10 dark:bg-blue-950/40',
        text: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-500/30',
        badge: 'bg-blue-600 text-white'
      };
    case 'verified':
      return {
        bg: 'bg-indigo-500/10 dark:bg-indigo-950/40',
        text: 'text-indigo-600 dark:text-indigo-400',
        border: 'border-indigo-500/30',
        badge: 'bg-indigo-600 text-white'
      };
    case 'responding':
    case 'in progress':
    case 'on duty':
      return {
        bg: 'bg-amber-500/10 dark:bg-amber-950/40',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-600 text-white'
      };
    case 'resolved':
    case 'available':
    case 'operational':
      return {
        bg: 'bg-emerald-500/10 dark:bg-emerald-950/40',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-600 text-white'
      };
    case 'low stock':
    case 'assigned':
      return {
        bg: 'bg-orange-500/10 dark:bg-orange-950/40',
        text: 'text-orange-600 dark:text-orange-400',
        border: 'border-orange-500/30',
        badge: 'bg-orange-600 text-white'
      };
    case 'out of stock':
    case 'inactive':
    case 'expired':
      return {
        bg: 'bg-rose-500/10 dark:bg-rose-950/40',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-500/30',
        badge: 'bg-rose-600 text-white'
      };
    default:
      return {
        bg: 'bg-slate-500/10 dark:bg-slate-800',
        text: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-500/30',
        badge: 'bg-slate-500 text-white'
      };
  }
};
