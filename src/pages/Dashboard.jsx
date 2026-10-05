import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Flame,
  AlertTriangle,
  Users,
  Box,
  Home,
  MapPin,
  Radio,
  BarChart3,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { IncidentTable } from '../components/IncidentTable';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { StatusBadge } from '../components/StatusBadge';
import { formatNumber, formatDateTime } from '../utils/helpers';

export const Dashboard = () => {
  const { stats, incidents, resources, volunteers } = useApp();
  const navigate = useNavigate();

  const [selectedIncident, setSelectedIncident] = useState(null);

  // Chart Data 1: Incidents by Disaster Type
  const incidentsByTypeData = useMemo(() => {
    const counts = {};
    incidents.forEach(inc => {
      counts[inc.type] = (counts[inc.type] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    }));
  }, [incidents]);

  // Chart Data 2: Incidents Over Time (Timeline trend)
  const timelineData = [
    { time: '04:00', incidents: 3, resolved: 1 },
    { time: '06:00', incidents: 6, resolved: 2 },
    { time: '08:00', incidents: 10, resolved: 3 },
    { time: '10:00', incidents: 14, resolved: 5 },
    { time: '12:00', incidents: 16, resolved: 8 }
  ];

  // Chart Data 3: Resource Distribution
  const resourceDistributionData = useMemo(() => {
    const cats = {};
    resources.forEach(r => {
      cats[r.category] = (cats[r.category] || 0) + (r.total || 0);
    });
    return Object.keys(cats).map(key => ({
      name: key.length > 12 ? `${key.substring(0, 10)}...` : key,
      fullName: key,
      units: cats[key]
    }));
  }, [resources]);

  // Chart Data 4: Volunteer Availability Breakdown
  const volunteerStatusData = useMemo(() => {
    return [
      { name: 'Available', value: stats.availableVolunteers, color: '#10b981' },
      { name: 'On Duty', value: stats.onDutyVolunteers, color: '#3b82f6' },
      { name: 'Assigned', value: volunteers.filter(v => v.availability === 'Assigned').length, color: '#f59e0b' }
    ];
  }, [volunteers, stats]);

  const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Dashboard Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Emergency Operations Center
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              System Operational
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time multi-hazard situational awareness, resource telemetry, and task force dispatch.
          </p>
        </div>

        {/* Quick Command Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to="/report">
            <Button variant="emergency" size="sm" icon={Flame}>
              Report Incident
            </Button>
          </Link>
          <Link to="/alerts">
            <Button variant="warning" size="sm" icon={Radio}>
              Broadcast Alert
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" size="sm" icon={MapPin}>
              GIS Map View
            </Button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Active Incidents"
          value={stats.activeIncidents}
          subtitle={`${stats.criticalIncidents} Critical Priority`}
          icon={Flame}
          color="red"
          badge="Live"
          trend={`${stats.resolvedIncidents} Resolved`}
          trendType="up"
          onClick={() => navigate('/incidents')}
        />

        <StatCard
          title="Critical Emergencies"
          value={stats.criticalIncidents}
          subtitle="Immediate Triage Needed"
          icon={AlertTriangle}
          color="red"
          badge="Urgent"
          trend="Level 4 Response"
          onClick={() => navigate('/incidents')}
        />

        <StatCard
          title="People Impacted"
          value={formatNumber(stats.totalPeopleAffected)}
          subtitle="Across 7 affected zones"
          icon={Users}
          color="blue"
          trend="Evacuating"
          trendType="up"
        />

        <StatCard
          title="Resource Stock"
          value={formatNumber(stats.totalResourcesCount)}
          subtitle={`${stats.lowStockResources} Items Low Stock`}
          icon={Box}
          color="amber"
          badge={`${stats.totalResources} SKUs`}
          onClick={() => navigate('/resources')}
        />

        <StatCard
          title="Active Volunteers"
          value={stats.onDutyVolunteers}
          subtitle={`${stats.availableVolunteers} on Standby`}
          icon={Activity}
          color="emerald"
          badge="Deployed"
          onClick={() => navigate('/volunteers')}
        />

        <StatCard
          title="Relief Centers"
          value={stats.totalShelters}
          subtitle={`${formatNumber(stats.totalShelterAvailable)} Free Spaces`}
          icon={Home}
          color="purple"
          badge="Active"
          onClick={() => navigate('/shelters')}
        />
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Incidents by Disaster Type */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                Incidents by Disaster Type
              </h3>
              <p className="text-xs text-slate-500">Breakdown across flood, cyclone, fire, landslides</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incidentsByTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                  {incidentsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incident Trajectory Over Time */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                Incident Response Trajectory (Today)
              </h3>
              <p className="text-xs text-slate-500">Cumulative reported vs. resolved cases</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="incidents" name="Active Incidents" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#incGrad)" />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#resGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Resource Inventory Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                Resource Category Stockpiles
              </h3>
              <p className="text-xs text-slate-500">Available physical units in state warehouses</p>
            </div>
            <Box className="w-5 h-5 text-amber-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourceDistributionData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(value, name, item) => [`${formatNumber(value)} units`, item.payload.fullName]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="units" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Volunteer Status Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-display">
                Volunteer Readiness Roster
              </h3>
              <p className="text-xs text-slate-500">Live deployment ratio across field units</p>
            </div>
            <Users className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={volunteerStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {volunteerStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Incidents Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              Live Incidents Management
            </h2>
            <p className="text-xs text-slate-500">Active alerts requiring response triage</p>
          </div>
          <Link to="/incidents">
            <Button variant="outline" size="sm" icon={ArrowUpRight} iconPosition="right">
              View All ({incidents.length})
            </Button>
          </Link>
        </div>

        <IncidentTable
          limit={6}
          showFilters={false}
          onViewIncident={(inc) => setSelectedIncident(inc)}
          onEditIncident={() => navigate('/incidents')}
        />
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <Modal
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          title={`Incident Details: ${selectedIncident.id}`}
          subtitle={selectedIncident.title}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <StatusBadge type="severity" value={selectedIncident.severity} size="md" />
              <StatusBadge type="status" value={selectedIncident.status} size="md" />
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Disaster Type: {selectedIncident.type}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Location:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  {selectedIncident.location}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Citizens Affected:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  {formatNumber(selectedIncident.affectedPeople)} People
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Description & Ground Situation
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                {selectedIncident.description}
              </p>
            </div>

            {selectedIncident.requiredAssistance && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                  Required Life-Saving Assistance
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30">
                  {selectedIncident.requiredAssistance}
                </p>
              </div>
            )}

            {/* Allocated Resources */}
            {selectedIncident.allocatedResources?.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Allocated Emergency Resources
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedIncident.allocatedResources.map((res, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                    >
                      <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-blue-500" />
                        {res.resourceName}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
                        {res.quantity} units
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Reported {formatDateTime(selectedIncident.reportedTime)}
              </span>
              <div className="flex gap-2">
                <Link to={`/map?lat=${selectedIncident.coordinates?.[0]}&lng=${selectedIncident.coordinates?.[1]}`}>
                  <Button variant="outline" size="sm" icon={MapPin}>
                    View on GIS Map
                  </Button>
                </Link>
                <Button variant="primary" size="sm" onClick={() => setSelectedIncident(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
