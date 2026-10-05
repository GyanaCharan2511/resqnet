import React from 'react';
import {
  MapPin,
  Users,
  Phone,
  CheckCircle2,
  ExternalLink,
  Edit2,
  Trash2,
  Utensils,
  Droplets,
  Stethoscope,
  Zap,
  Wifi,
  Bath
} from 'lucide-react';
import { Button } from './Button';
import { formatNumber } from '../utils/helpers';
import { Link } from 'react-router-dom';

export const ShelterCard = ({
  shelter,
  onEdit,
  onDelete,
  onUpdateOccupancy,
  showActions = true
}) => {
  const percentOccupied = Math.min(100, Math.round((shelter.occupied / shelter.capacity) * 100)) || 0;

  const getOccupancyColor = () => {
    if (percentOccupied >= 95) return 'bg-rose-500';
    if (percentOccupied >= 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getFacilityIcon = (facility) => {
    switch (facility.toLowerCase()) {
      case 'food': return <Utensils className="w-3 h-3 text-amber-500" />;
      case 'water': return <Droplets className="w-3 h-3 text-blue-500" />;
      case 'medical': return <Stethoscope className="w-3 h-3 text-red-500" />;
      case 'electricity': return <Zap className="w-3 h-3 text-yellow-500" />;
      case 'restrooms': return <Bath className="w-3 h-3 text-emerald-500" />;
      case 'internet': return <Wifi className="w-3 h-3 text-indigo-500" />;
      default: return <CheckCircle2 className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              {shelter.id}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 font-display mt-0.5">
              {shelter.name}
            </h3>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              shelter.status === 'Full'
                ? 'bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-500/20'
                : shelter.status === 'Nearly Full'
                ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20'
            }`}
          >
            {shelter.status || 'Operational'}
          </span>
        </div>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          {shelter.location}
        </p>

        {/* Occupancy Gauge */}
        <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Occupancy Status
            </span>
            <span className="text-slate-900 dark:text-white font-bold">
              {percentOccupied}% ({formatNumber(shelter.occupied)} / {formatNumber(shelter.capacity)})
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getOccupancyColor()} transition-all duration-500`}
              style={{ width: `${percentOccupied}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            <span>Occupied: <strong>{formatNumber(shelter.occupied)}</strong></span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Available: {formatNumber(shelter.availableSpaces)} spaces
            </span>
          </div>
        </div>

        {/* Facilities */}
        {shelter.facilities && shelter.facilities.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Available Facilities:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {shelter.facilities.map(facility => (
                <span
                  key={facility}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700"
                >
                  {getFacilityIcon(facility)}
                  {facility}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contact Info & Notes */}
        <div className="mt-3.5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
          {shelter.contactPerson && (
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{shelter.contactPerson} • {shelter.contactPhone}</span>
            </p>
          )}
          {shelter.notes && (
            <p className="italic text-[11px] text-slate-400 line-clamp-2">
              "{shelter.notes}"
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <Link
          to={`/map?lat=${shelter.coordinates?.[0] || 17.6868}&lng=${shelter.coordinates?.[1] || 83.2185}&title=${encodeURIComponent(shelter.name)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on Map
        </Link>

        {showActions && (
          <div className="flex items-center gap-1.5">
            {onUpdateOccupancy && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateOccupancy(shelter)}
              >
                Update Count
              </Button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(shelter)}
                className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors cursor-pointer"
                title="Edit Shelter"
                aria-label={`Edit ${shelter.name}`}
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(shelter)}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors cursor-pointer"
                title="Delete Shelter"
                aria-label={`Delete ${shelter.name}`}
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
