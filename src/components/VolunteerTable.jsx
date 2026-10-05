import React, { useState, useMemo } from 'react';
import {
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  Edit2,
  Trash2,
  UserPlus
} from 'lucide-react';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { useApp } from '../context/AppContext';

export const VolunteerTable = ({
  onAssign,
  onEditVolunteer,
  onDeleteVolunteer,
  onAddVolunteer
}) => {
  const { volunteers, updateVolunteerStatus } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  const skillsList = [
    'All',
    'First Aid',
    'Medical',
    'Rescue',
    'Driving',
    'Food Distribution',
    'Communication'
  ];

  const filteredVolunteers = useMemo(() => {
    let list = [...volunteers];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        v =>
          v.id.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.location.toLowerCase().includes(q) ||
          (v.skills && v.skills.some(s => s.toLowerCase().includes(q)))
      );
    }

    if (selectedSkill !== 'All') {
      list = list.filter(v => v.skills && v.skills.includes(selectedSkill));
    }

    if (selectedAvailability !== 'All') {
      list = list.filter(v => v.availability === selectedAvailability);
    }

    return list;
  }, [volunteers, searchQuery, selectedSkill, selectedAvailability]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search volunteer by name, skill..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Skill Filter */}
          <div>
            <select
              aria-label="Filter by Skill"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            >
              {skillsList.map(s => (
                <option key={s} value={s}>Skill: {s}</option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              aria-label="Filter by Availability"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            >
              <option value="All">All Availabilities</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="On Duty">On Duty</option>
            </select>
          </div>
        </div>

        {onAddVolunteer && (
          <Button variant="primary" size="sm" icon={UserPlus} onClick={onAddVolunteer} className="shrink-0 w-full sm:w-auto">
            Register Volunteer
          </Button>
        )}
      </div>

      {/* Table / List */}
      {filteredVolunteers.length === 0 ? (
        <EmptyState
          title="No volunteers found"
          description="Try changing skill criteria or search keywords."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedSkill('All');
            setSelectedAvailability('All');
          }}
        />
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Volunteer</th>
                  <th className="py-3.5 px-4">Skills & Certifications</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Availability</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Service Hours</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredVolunteers.map(volunteer => (
                  <tr
                    key={volunteer.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
                          {volunteer.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-slate-100">
                            {volunteer.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {volunteer.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {volunteer.skills?.map(skill => (
                          <span
                            key={skill}
                            className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{volunteer.location}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        aria-label={`Availability for ${volunteer.name}`}
                        value={volunteer.availability}
                        onChange={(e) => updateVolunteerStatus(volunteer.id, e.target.value)}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="Available">Available</option>
                        <option value="Assigned">Assigned</option>
                        <option value="On Duty">On Duty</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-blue-500" />
                        <span>{volunteer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail className="w-3 h-3" />
                        <span className="truncate max-w-[140px]">{volunteer.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-semibold text-slate-800 dark:text-slate-200">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {volunteer.totalHours} hrs
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onAssign && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onAssign(volunteer)}
                          >
                            {volunteer.assignedIncidentId ? 'Reassign' : 'Assign'}
                          </Button>
                        )}
                        {onEditVolunteer && (
                          <button
                            onClick={() => onEditVolunteer(volunteer)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                            title="Edit Volunteer"
                            aria-label={`Edit ${volunteer.name}`}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteVolunteer && (
                          <button
                            onClick={() => onDeleteVolunteer(volunteer)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Remove Volunteer"
                            aria-label={`Delete ${volunteer.name}`}
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
      )}
    </div>
  );
};
