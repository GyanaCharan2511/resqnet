import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Flame,
  Radio,
  MapPin,
  Users,
  Box,
  Home as HomeIcon,
  PhoneCall,
  Activity,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Button } from '../components/Button';
import { StatusBadge } from '../components/StatusBadge';
import { formatNumber } from '../utils/helpers';

export const Home = () => {
  const { stats, incidents, alerts } = useApp();

  const activeAlerts = alerts.filter(a => a.status === 'Active').slice(0, 2);
  const recentIncidents = incidents.slice(0, 4);

  const features = [
    {
      icon: Flame,
      title: 'Incident Reporting',
      description: 'Rapid citizen and field responder reporting with geo-tagging, severity assessment, and media uploads.',
      link: '/report'
    },
    {
      icon: MapPin,
      title: 'Emergency GIS Map',
      description: 'Live interactive spatial mapping with severity markers, hazard perimeters, and nearest shelter routing.',
      link: '/map'
    },
    {
      icon: Radio,
      title: 'Real-Time Alerts',
      description: 'Instant multi-channel disaster advisories, cyclone warnings, and flood level forecasts directly from authorities.',
      link: '/alerts'
    },
    {
      icon: Box,
      title: 'Resource Management',
      description: 'Centralized stockpile logistics for food, potable water, medical kits, rescue boats, and generators.',
      link: '/resources'
    },
    {
      icon: Users,
      title: 'Volunteer Coordination',
      description: 'Skill-based volunteer matching and deployment across medical, rescue, food distribution, and logistics teams.',
      link: '/volunteers'
    },
    {
      icon: HomeIcon,
      title: 'Relief Shelters',
      description: 'Live occupancy tracking, facility availability (food, water, medical, power), and capacity monitoring.',
      link: '/shelters'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Report Incident',
      description: 'Citizens or ground marshals log emergency alerts with exact GPS location, photos, and immediate needs.'
    },
    {
      step: '02',
      title: 'Verify & Triage',
      description: 'Emergency Operations Center verifies severity, filters duplicates, and activates localized response plans.'
    },
    {
      step: '03',
      title: 'Dispatch & Respond',
      description: 'Task forces, specialized volunteers, and critical resources are dispatched to the affected zones.'
    },
    {
      step: '04',
      title: 'Recover & Rebuild',
      description: 'Evacuees are supported in relief shelters while restoring critical utility lifelines and infrastructure.'
    }
  ];

  const emergencyContacts = [
    { name: 'National Emergency Helpline', number: '112', desc: 'All Emergencies (Police, Fire, Ambulance)' },
    { name: 'Disaster Helpline (NDMA / SDMA)', number: '1070', desc: 'State Disaster Management Control Room' },
    { name: 'Emergency Medical & Ambulance', number: '108', desc: 'Free 24/7 Advanced Life Support' },
    { name: 'Fire & Rescue Services', number: '101', desc: 'Urban & Industrial Fire Fighting' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Urgent Emergency Alert Ticker if active */}
      {activeAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white px-4 py-2.5 shadow-md">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 font-bold tracking-wide">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="uppercase text-[11px] bg-white/20 px-2 py-0.5 rounded font-black">
                Active Broadcast:
              </span>
              <span className="truncate max-w-xl font-semibold">{activeAlerts[0].title}</span>
            </div>
            <Link
              to="/alerts"
              className="inline-flex items-center gap-1 font-bold underline hover:text-red-100 whitespace-nowrap text-xs"
            >
              View Public Directive <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-950/50 border border-blue-500/30 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen Disaster Management System
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white font-display tracking-tight leading-[1.1]">
                Disaster Response. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-red-500">
                  Connected & Unified.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                One centralized platform to report emergencies, coordinate life-saving resources, dispatch trained volunteers, and support vulnerable communities in real time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/report" className="w-full sm:w-auto">
                  <Button variant="emergency" size="lg" icon={Flame} className="w-full sm:w-auto shadow-lg shadow-red-500/25">
                    Report an Incident
                  </Button>
                </Link>
                <Link to="/map" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" icon={MapPin} className="w-full sm:w-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
                    View Emergency Map
                  </Button>
                </Link>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" icon={Activity} className="w-full sm:w-auto">
                    Command Center
                  </Button>
                </Link>
              </div>

              {/* Verified Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Real-Time Leaflet GIS
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Role-Based Workflows
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Zero Backend Dependency
                </span>
              </div>
            </div>

            {/* Right Graphic / Interactive Operations Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-red-500 rounded-3xl blur-xl opacity-30 animate-pulse" />

                {/* Card Container */}
                <div className="relative rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xl space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                          Active EOC Dashboard
                        </h4>
                        <p className="text-[11px] text-slate-500">AP State Disaster Operations</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Live Feed
                    </span>
                  </div>

                  {/* Quick Realtime Snapshot */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Active Incidents</p>
                      <p className="text-2xl font-extrabold text-red-600 dark:text-red-400 font-display mt-0.5">
                        {stats.activeIncidents}
                      </p>
                      <span className="text-[10px] text-slate-500">{stats.criticalIncidents} Critical Status</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase text-slate-400">People Impacted</p>
                      <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-display mt-0.5">
                        {formatNumber(stats.totalPeopleAffected)}
                      </p>
                      <span className="text-[10px] text-slate-500">Evacuation in Progress</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Relief Shelters</p>
                      <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display mt-0.5">
                        {stats.totalShelters}
                      </p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{formatNumber(stats.totalShelterAvailable)} Free Spaces</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold uppercase text-slate-400">Volunteers Deployed</p>
                      <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-display mt-0.5">
                        {stats.onDutyVolunteers}
                      </p>
                      <span className="text-[10px] text-slate-500">{stats.availableVolunteers} Ready on Standby</span>
                    </div>
                  </div>

                  {/* Latest Incident Mini Item */}
                  {recentIncidents[0] && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/20 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-red-600 dark:text-red-400 font-mono">
                          {recentIncidents[0].id}
                        </span>
                        <StatusBadge type="severity" value={recentIncidents[0].severity} size="sm" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {recentIncidents[0].title}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {recentIncidents[0].location}
                      </p>
                    </div>
                  )}

                  <Link to="/dashboard" className="block">
                    <Button variant="primary" size="sm" className="w-full" icon={ArrowRight} iconPosition="right">
                      Open Emergency Operations Center
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-red-600 dark:text-red-400 font-display">
                {stats.activeIncidents}
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Incidents
              </p>
              <p className="text-[11px] text-slate-400">Real-time emergency reports</p>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400 font-display">
                {formatNumber(stats.totalPeopleAffected)}
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Citizens Assisted
              </p>
              <p className="text-[11px] text-slate-400">Across 7 disaster zones</p>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-display">
                {stats.totalVolunteers}
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Registered Responders
              </p>
              <p className="text-[11px] text-slate-400">Medical, Rescue & Logistics</p>
            </div>

            <div className="p-4 space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-purple-600 dark:text-purple-400 font-display">
                {stats.totalShelters}
              </div>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Relief Centers
              </p>
              <p className="text-[11px] text-slate-400">{formatNumber(stats.totalShelterCapacity)} Total Safe Capacity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              Integrated Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
              Engineered for Critical Emergency Situations
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              ResQNet delivers end-to-end disaster coordination for authorities, field marshals, and citizens during high-stakes disaster events.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={feature.title}
                  to={feature.link}
                  className="group relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-7 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-display group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Explore Module</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
              Operational Lifecycle
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display">
              How ResQNet Operates
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              From first hazard detection to complete community recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 p-6 space-y-4"
              >
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                  {item.step}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts Strip */}
      <section className="py-16 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Emergency 24/7 Helplines
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Direct toll-free lines for immediate life-saving rescue and medical triage.
              </p>
            </div>
            <Link to="/report">
              <Button variant="emergency" size="md" icon={Flame}>
                Instant Online Incident SOS
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map(contact => (
              <div
                key={contact.number}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">{contact.name}</span>
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {contact.number}
                </div>
                <p className="text-[11px] text-slate-400">{contact.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-lg font-black text-white font-display">
                  ResQ<span className="text-blue-400">Net</span>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                A modern frontend framework emergency response & disaster management platform built with React, Vite, Leaflet, and Tailwind CSS.
              </p>
              <p className="text-[11px] text-slate-500">
                Report. Respond. Rescue.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Command Dashboard</Link></li>
                <li><Link to="/incidents" className="hover:text-white transition-colors">Incidents Directory</Link></li>
                <li><Link to="/map" className="hover:text-white transition-colors">Emergency GIS Map</Link></li>
                <li><Link to="/alerts" className="hover:text-white transition-colors">Active Disaster Alerts</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">Operations</h4>
              <ul className="space-y-2">
                <li><Link to="/resources" className="hover:text-white transition-colors">Resource Stockpiles</Link></li>
                <li><Link to="/volunteers" className="hover:text-white transition-colors">Volunteer Roster</Link></li>
                <li><Link to="/shelters" className="hover:text-white transition-colors">Relief Shelters</Link></li>
                <li><Link to="/analytics" className="hover:text-white transition-colors">Analytics & Trends</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase text-white tracking-wider mb-3">Portals & Viva Demo</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition-colors">Auth / Role Login</Link></li>
                <li><Link to="/citizen" className="hover:text-white transition-colors">Citizen Portal</Link></li>
                <li><Link to="/volunteer" className="hover:text-white transition-colors">Volunteer Portal</Link></li>
                <li><Link to="/settings" className="hover:text-white transition-colors">Preferences & Reset</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© 2026 ResQNet Emergency Response System. Academic Frontend Framework Project.</p>
            <p className="text-slate-400 font-semibold">Demo Simulation Data • No Backend Required</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
