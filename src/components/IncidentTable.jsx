import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  MapPin
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { formatRelativeTime, formatNumber } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export const IncidentTable = ({
  onViewIncident,
  onEditIncident,
  onDeleteIncident,
  limit = null,
  showFilters = true
}) => {
  const { incidents, updateIncidentStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const filteredIncidents = useMemo(() => {
    let list = [...incidents];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        inc =>
          inc.id.toLowerCase().includes(q) ||
          inc.title.toLowerCase().includes(q) ||
          inc.location.toLowerCase().includes(q) ||
          inc.type.toLowerCase().includes(q)
      );
    }

    if (selectedType !== 'All') {
      list = list.filter(inc => inc.type === selectedType);
    }

    if (selectedSeverity !== 'All') {
      list = list.filter(inc => inc.severity === selectedSeverity);
    }

    if (selectedStatus !== 'All') {
      list = list.filter(inc => inc.status === selectedStatus);
    }

    list.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.reportedTime) - new Date(a.reportedTime);
      if (sortBy === 'date-asc') return new Date(a.reportedTime) - new Date(b.reportedTime);
      if (sortBy === 'affected-desc') return (b.affectedPeople || 0) - (a.affectedPeople || 0);
      if (sortBy === 'severity') {
        const order = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (order[b.severity] || 0) - (order[a.severity] || 0);
      }
      return 0;
    });

    if (limit) return list.slice(0, limit);
    return list;
  }, [incidents, searchQuery, selectedType, selectedSeverity, selectedStatus, sortBy, limit]);

  const disasterTypes = ['All', 'Flood', 'Cyclone', 'Fire', 'Landslide', 'Earthquake', 'Accident', 'Other'];
  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      {showFilters && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, location, disaster title..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            {/* Disaster Type Filter */}
            <div>
              <select
                aria-label="Filter by Disaster Type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                {disasterTypes.map(t => (
                  <option key={t} value={t}>Type: {t}</option>
                ))}
              </select>
            </div>

            {/* Severity Filter */}
            <div>
              <select
                aria-label="Filter by Severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                {severities.map(s => (
                  <option key={s} value={s}>Severity: {s}</option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <select
                aria-label="Sort Incidents"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="severity">Highest Severity</option>
                <option value="affected-desc">Most Affected People</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table Container */}
      {filteredIncidents.length === 0 ? (
        <EmptyState
          title="No incidents match your criteria"
          description="Try modifying search keywords or resetting filters."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedType('All');
            setSelectedSeverity('All');
            setSelectedStatus('All');
          }}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Incident & Type</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Severity</th>
                    <th className="py-3.5 px-4">Affected</th>
                    <th className="py-3.5 px-4">Reported</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredIncidents.map(incident => (
                    <tr
                      key={incident.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {incident.id}
                      </td>

                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {incident.title}
                        </div>
                        <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {incident.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                          <span className="truncate max-w-[140px]">{incident.location}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type="severity" value={incident.severity} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800 dark:text-slate-200">
                        {formatNumber(incident.affectedPeople)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400">
                        {formatRelativeTime(incident.reportedTime)}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          aria-label={`Status for ${incident.id}`}
                          value={incident.status}
                          onChange={(e) => updateIncidentStatus(incident.id, e.target.value)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500 focus:outline-none cursor-pointer"
                        >
                          <option value="Reported">Reported</option>
                          <option value="Verified">Verified</option>
                          <option value="Responding">Responding</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onViewIncident && (
                            <button
                              onClick={() => onViewIncident(incident)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                              title="View Full Details"
                              aria-label={`View details for ${incident.id}`}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {onEditIncident && (
                            <button
                              onClick={() => onEditIncident(incident)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                              title="Edit Incident"
                              aria-label={`Edit ${incident.id}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {onDeleteIncident && (
                            <button
                              onClick={() => onDeleteIncident(incident)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Delete Record"
                              aria-label={`Delete ${incident.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredIncidents.map(incident => (
              <div
                key={incident.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                      {incident.id}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                      {incident.title}
                    </h4>
                  </div>
                  <StatusBadge type="severity" value={incident.severity} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span className="truncate">{incident.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{formatNumber(incident.affectedPeople)} affected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>{formatRelativeTime(incident.reportedTime)}</span>
                  </div>
                  <div>
                    <StatusBadge type="status" value={incident.status} size="sm" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <select
                    aria-label={`Status for ${incident.id}`}
                    value={incident.status}
                    onChange={(e) => updateIncidentStatus(incident.id, e.target.value)}
                    className="text-xs font-semibold py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="Reported">Reported</option>
                    <option value="Verified">Verified</option>
                    <option value="Responding">Responding</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <div className="flex items-center gap-1">
                    {onViewIncident && (
                      <Button variant="ghost" size="sm" onClick={() => onViewIncident(incident)}>
                        View
                      </Button>
                    )}
                    {onEditIncident && (
                      <Button variant="ghost" size="sm" onClick={() => onEditIncident(incident)}>
                        Edit
                      </Button>
                    )}
                    {onDeleteIncident && (
                      <button
                        onClick={() => onDeleteIncident(incident)}
                        className="p-2 text-red-500 rounded-lg cursor-pointer"
                        aria-label={`Delete ${incident.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
