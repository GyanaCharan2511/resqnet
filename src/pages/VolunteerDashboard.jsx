import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Activity,
  Clock,
  MapPin,
  Award,
  CheckSquare,
  Square
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { StatCard } from '../components/StatCard';
import { formatNumber, formatRelativeTime } from '../utils/helpers';

export const VolunteerDashboard = () => {
  const { currentUser, incidents, updateVolunteerStatus, addToast } = useApp();

  const [availability, setAvailability] = useState('On Duty');
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Distribute 300 emergency drinking water packets at Sector 4 Gajuwaka', completed: true },
    { id: 2, text: 'Assist medical team with first aid triage at Simhachalam Camp', completed: false },
    { id: 3, text: 'Escort 45 senior citizens to GVMC Sports Complex Shelter', completed: false },
    { id: 4, text: 'Inspect backup diesel generators for KGH Medical Base', completed: true }
  ]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    addToast({
      title: 'Task Status Updated',
      message: 'Ground checklist item toggled.',
      type: 'info'
    });
  };

  const handleAvailabilityChange = (newStatus) => {
    setAvailability(newStatus);
    if (currentUser?.id) {
      updateVolunteerStatus(currentUser.id, newStatus);
    }
  };

  const assignedIncident = incidents[0]; // Active prime assignment demo
  const nearbyEmergencies = incidents.slice(1, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Top Welcome & Availability Status Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Field Responder Unit
            </span>
            <span className="text-xs text-slate-400">ID: {currentUser?.id || 'VOL-001'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Welcome back, {currentUser?.name || 'Dr. Sandeep'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Specialization: <strong>Medical Triage & First Aid</strong> • Sector Base: <strong>Visakhapatnam Command</strong>
          </p>
        </div>

        {/* Live Availability Switcher */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Your Current Response Status:
          </span>
          <div className="flex items-center gap-2">
            {['Available', 'On Duty', 'Assigned'].map(status => (
              <button
                key={status}
                type="button"
                onClick={() => handleAvailabilityChange(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  availability === status
                    ? status === 'On Duty'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : status === 'Available'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/30'
                      : 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Volunteer KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Service Hours"
          value="142 hrs"
          subtitle="Top 5% Responder in Zone"
          icon={Clock}
          color="blue"
          badge="Verified"
        />

        <StatCard
          title="Missions Completed"
          value="18"
          subtitle="Flood & Cyclone Relief"
          icon={Award}
          color="emerald"
          badge="Gold Tier"
        />

        <StatCard
          title="Active Field Tasks"
          value={tasks.filter(t => !t.completed).length}
          subtitle={`${tasks.filter(t => t.completed).length} Completed Today`}
          icon={Activity}
          color="amber"
          badge="In Progress"
        />

        <StatCard
          title="Lives Assisted"
          value="640+"
          subtitle="Medical & Shelter Relocation"
          icon={Users}
          color="indigo"
          badge="Direct Impact"
        />
      </div>

      {/* Active Incident Assignment */}
      {assignedIncident && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-red-500/10 via-slate-900/5 to-transparent dark:from-red-950/40 dark:via-slate-900 border border-red-500/30 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                Primary Mission Assignment: {assignedIncident.id}
              </span>
            </div>
            <StatusBadge type="severity" value={assignedIncident.severity} size="sm" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              {assignedIncident.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {assignedIncident.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 font-semibold">Location:</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{assignedIncident.location}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 font-semibold">People Trapped:</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formatNumber(assignedIncident.affectedPeople)} Citizens</p>
            </div>
            <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700">
              <span className="text-slate-400 font-semibold">Reporting Marshal:</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{assignedIncident.reportedBy} ({assignedIncident.contact})</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Reported {formatRelativeTime(assignedIncident.reportedTime)}
            </div>
            <div className="flex gap-2">
              <Link to={`/map?lat=${assignedIncident.coordinates?.[0]}&lng=${assignedIncident.coordinates?.[1]}`}>
                <Button variant="primary" size="sm" icon={MapPin}>
                  Open Live GPS Navigation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Grid: Field Task Checklist & Nearby Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Operational Task Checklist */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Mission Checklist & Protocol
              </h3>
              <p className="text-xs text-slate-500">Tap to mark tasks completed in real time</p>
            </div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
              {tasks.filter(t => t.completed).length}/{tasks.length} Done
            </span>
          </div>

          <div className="space-y-2.5">
            {tasks.map(task => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  task.completed
                    ? 'bg-emerald-500/5 border-emerald-500/30 text-slate-500 line-through'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-blue-500/50'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
                  {task.completed ? (
                    <CheckSquare className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-relaxed select-none">
                  {task.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Nearby Critical Incidents */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Nearby Emergency Hotspots
              </h3>
              <p className="text-xs text-slate-500">Incidents in your assigned district cluster</p>
            </div>
            <Link to="/map">
              <Button variant="outline" size="sm">
                Map View
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {nearbyEmergencies.map(inc => (
              <div
                key={inc.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{inc.id}</span>
                  <StatusBadge type="severity" value={inc.severity} size="sm" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {inc.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {inc.location}
                  </span>
                  <Link
                    to={`/map?lat=${inc.coordinates?.[0]}&lng=${inc.coordinates?.[1]}`}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                  >
                    View Map →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
