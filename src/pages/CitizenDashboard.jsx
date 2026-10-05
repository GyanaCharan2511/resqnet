import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  PhoneCall,
  Home,
  Radio,
  MapPin,
  Plus,
  HeartHandshake,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { AlertCard } from '../components/AlertCard';
import { Modal } from '../components/Modal';
import { formatRelativeTime } from '../utils/helpers';

export const CitizenDashboard = () => {
  const { currentUser, incidents, alerts, shelters, addIncident } = useApp();

  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [sosForm, setSosForm] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    location: 'Visakhapatnam',
    need: 'Immediate evacuation from flooded residential floor',
    people: 3
  });

  const activeAlerts = alerts.filter(a => a.status === 'Active');
  const nearbyShelters = shelters.slice(0, 3);
  const myReports = incidents.slice(0, 3);

  const handleSosSubmit = (e) => {
    e.preventDefault();
    addIncident({
      title: `Citizen Urgent SOS: ${sosForm.need.substring(0, 45)}...`,
      type: 'Flood',
      location: sosForm.location,
      coordinates: [17.6868 + (Math.random() - 0.5) * 0.05, 83.2185 + (Math.random() - 0.5) * 0.05],
      severity: 'Critical',
      affectedPeople: Number(sosForm.people) || 1,
      reportedBy: `${sosForm.name} (Citizen SOS)`,
      contact: sosForm.phone,
      description: `Emergency Request for Assistance: ${sosForm.need}. Location: ${sosForm.location}`,
      requiredAssistance: 'Immediate evacuation, ambulance or rescue boat dispatch.'
    });
    setSosModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-md">
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            Citizen Emergency Assistance Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
            Welcome, {currentUser?.name || 'Resident'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
            Stay safe during severe weather. Use this portal to report emergencies, locate nearest operational relief centers, or request instant assistance.
          </p>
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-3">
          <Button
            variant="emergency"
            size="md"
            icon={Flame}
            onClick={() => setSosModalOpen(true)}
            className="shadow-lg shadow-red-500/30 font-bold"
          >
            Request Instant SOS
          </Button>
          <Link to="/report">
            <Button variant="primary" size="md" icon={Plus}>
              Report Incident
            </Button>
          </Link>
          <Link to="/shelters">
            <Button variant="outline" size="md" icon={Home} className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              Find Shelter ({shelters.length})
            </Button>
          </Link>
          <Link to="/alerts">
            <Button variant="outline" size="md" icon={Radio} className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              View Alerts ({activeAlerts.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* Emergency Contacts SOS Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          { name: 'National Emergency', number: '112', tag: 'Police / Fire / Med' },
          { name: 'Disaster Control', number: '1070', tag: 'SDMA Operations' },
          { name: 'Ambulance & Trauma', number: '108', tag: 'Medical Triage' },
          { name: 'State Fire Service', number: '101', tag: 'Rescue Squad' }
        ].map(item => (
          <div
            key={item.number}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.name}</p>
              <p className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                {item.number}
              </p>
              <span className="text-[10px] text-slate-400">{item.tag}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <PhoneCall className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Active Disaster Alerts in Your Region */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Active Regional Emergency Advisories
            </h2>
          </div>
          <Link to="/alerts" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            View All ({alerts.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAlerts.slice(0, 2).map(alert => (
            <AlertCard key={alert.id} alert={alert} canManage={false} />
          ))}
        </div>
      </div>

      {/* Two Column Section: My Reported Incidents & Nearby Shelters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: My Reported Incidents */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                My Community Reports
              </h3>
              <p className="text-xs text-slate-500">Track response status on submitted emergency reports</p>
            </div>
            <Link to="/report">
              <Button variant="primary" size="sm" icon={Plus}>
                New Report
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {myReports.map(inc => (
              <div
                key={inc.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{inc.id}</span>
                  <StatusBadge type="status" value={inc.status} size="sm" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {inc.title}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    {inc.location}
                  </span>
                  <span>{formatRelativeTime(inc.reportedTime)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Nearby Relief Shelters */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Nearby Safe Relief Centers
              </h3>
              <p className="text-xs text-slate-500">Equipped with food, potable water, power & medics</p>
            </div>
            <Link to="/shelters">
              <Button variant="outline" size="sm">
                View All ({shelters.length})
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {nearbyShelters.map(shelter => (
              <div
                key={shelter.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {shelter.name}
                  </h4>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    {shelter.availableSpaces} spaces left
                  </span>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {shelter.location}
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Helpline: {shelter.contactPhone}</span>
                  <Link
                    to={`/map?lat=${shelter.coordinates?.[0]}&lng=${shelter.coordinates?.[1]}`}
                    className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                  >
                    Map Directions <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instant SOS Modal */}
      <Modal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        title="🚨 Instant SOS Emergency Request"
        subtitle="This priority notification alerts nearest NDRF / SDRF units and local marshals"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSosSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              value={sosForm.name}
              onChange={(e) => setSosForm(p => ({ ...p, name: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                value={sosForm.phone}
                onChange={(e) => setSosForm(p => ({ ...p, phone: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                People Trapped / Needing Aid
              </label>
              <input
                type="number"
                min="1"
                value={sosForm.people}
                onChange={(e) => setSosForm(p => ({ ...p, people: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Precise Location / Landmark
            </label>
            <input
              type="text"
              value={sosForm.location}
              onChange={(e) => setSosForm(p => ({ ...p, location: e.target.value }))}
              placeholder="e.g. Near Gajuwaka Bus Depot, Plot 42"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Emergency Details / Immediate Needs
            </label>
            <textarea
              rows="3"
              value={sosForm.need}
              onChange={(e) => setSosForm(p => ({ ...p, need: e.target.value }))}
              placeholder="Describe situation (e.g. water rising above 4ft, senior citizen needs oxygen)..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSosModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="emergency" size="md" type="submit" icon={Flame}>
              Broadcast Emergency SOS
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
