import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart as PieIcon,
  Activity,
  MapPin,
  Users,
  Box,
  Flame,
  CheckCircle2
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
import { formatNumber } from '../utils/helpers';

export const Analytics = () => {
  const { stats, incidents, resources, volunteers } = useApp();
  const [dateRange, setDateRange] = useState('Last 30 days');

  // Chart 1: Incidents by Disaster Type
  const disasterTypeData = useMemo(() => {
    const counts = {};
    incidents.forEach(i => {
      counts[i.type] = (counts[i.type] || 0) + 1;
    });
    return Object.keys(counts).map(key => ({
      name: key,
      count: counts[key]
    }));
  }, [incidents]);

  // Chart 2: Incidents by Month (Trend)
  const monthlyTrendData = [
    { month: 'Apr 2026', incidents: 8, resolved: 8, affected: 1200 },
    { month: 'May 2026', incidents: 12, resolved: 11, affected: 2100 },
    { month: 'Jun 2026', incidents: 15, resolved: 14, affected: 3500 },
    { month: 'Jul 2026', incidents: 22, resolved: 19, affected: 5200 },
    { month: 'Aug 2026', incidents: 28, resolved: 24, affected: 6800 },
    { month: 'Sep 2026', incidents: 24, resolved: 18, affected: 4820 }
  ];

  // Chart 3: Severity Distribution
  const severityData = useMemo(() => {
    const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
    incidents.forEach(i => {
      if (counts[i.severity] !== undefined) counts[i.severity]++;
      else counts.Medium++;
    });
    return [
      { name: 'Critical', value: counts.Critical, color: '#ef4444' },
      { name: 'High', value: counts.High, color: '#f97316' },
      { name: 'Medium', value: counts.Medium, color: '#eab308' },
      { name: 'Low', value: counts.Low, color: '#10b981' }
    ];
  }, [incidents]);

  // Chart 4: Resources Allocated vs Total
  const resourcesAllocData = useMemo(() => {
    return resources.slice(0, 7).map(r => ({
      name: r.name.length > 15 ? `${r.name.substring(0, 13)}...` : r.name,
      fullName: r.name,
      allocated: r.allocated,
      available: r.available
    }));
  }, [resources]);

  // Chart 5: Volunteers by Skill
  const volunteersBySkillData = useMemo(() => {
    const skills = {};
    volunteers.forEach(v => {
      v.skills?.forEach(s => {
        skills[s] = (skills[s] || 0) + 1;
      });
    });
    return Object.keys(skills).map(key => ({
      skill: key,
      count: skills[key]
    }));
  }, [volunteers]);

  // Chart 6: Incidents by Location
  const locationData = useMemo(() => {
    const locs = {};
    incidents.forEach(i => {
      const city = i.location.split(',')[1]?.trim() || i.location.split(',')[0]?.trim() || i.location;
      locs[city] = (locs[city] || 0) + 1;
    });
    return Object.keys(locs).map(key => ({
      location: key,
      incidents: locs[key]
    }));
  }, [incidents]);

  const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#06b6d4', '#ec4899'];

  const totalDistributedUnits = resources.reduce((sum, r) => sum + (r.allocated || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header with Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Disaster Analytics & Telemetry
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-500/20">
              Live Insights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Historical response rates, resource consumption, volunteer deployment and geographic incident density.
          </p>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          {['Last 7 days', 'Last 30 days', 'Last 6 months', 'This year'].map(range => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                dateRange === range
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Incidents"
          value={stats.totalIncidents}
          subtitle={`${stats.resolvedIncidents} Resolved Cases`}
          icon={Flame}
          color="red"
        />

        <StatCard
          title="Response Rate"
          value="96.4%"
          subtitle="Triage under 15 mins"
          icon={CheckCircle2}
          color="emerald"
          badge="+2.1%"
        />

        <StatCard
          title="Supplies Distributed"
          value={formatNumber(totalDistributedUnits)}
          subtitle="Food, Water & Kits"
          icon={Box}
          color="amber"
        />

        <StatCard
          title="Responders Active"
          value={stats.onDutyVolunteers}
          subtitle="On field ground deployment"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Citizens Sheltered"
          value={formatNumber(stats.totalShelterOccupied)}
          subtitle={`Across ${stats.totalShelters} Relief Centers`}
          icon={Activity}
          color="purple"
        />
      </div>

      {/* Charts Grid Row 1: Disaster Types & Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Incidents by Disaster Type */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Disaster Incidents by Category
              </h3>
              <p className="text-xs text-slate-500">Distribution of emergencies logged</p>
            </div>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={disasterTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" />
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
                  {disasterTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Incidents Trend Over Months */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Incidents & Resolution Trajectory (6 Months)
              </h3>
              <p className="text-xs text-slate-500">Emergency cases vs. successfully mitigated</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incMonthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="resMonthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
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
                <Area type="monotone" dataKey="incidents" name="Reported Incidents" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#incMonthGrad)" />
                <Area type="monotone" dataKey="resolved" name="Resolved Incidents" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#resMonthGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 2: Severity Distribution & Resource Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Severity Breakdown */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Emergency Severity Ratio
              </h3>
              <p className="text-xs text-slate-500">Critical / High / Medium / Low split</p>
            </div>
            <PieIcon className="w-5 h-5 text-red-500" />
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {severityData.map((entry, index) => (
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

        {/* Chart 4: Resource Allocation vs Available */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Resource Allocation vs Available Stock
              </h3>
              <p className="text-xs text-slate-500">Units deployed to operations vs in storage</p>
            </div>
            <Box className="w-5 h-5 text-amber-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resourcesAllocData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => [`${formatNumber(val)} units`, name]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="allocated" name="Allocated to Ground" fill="#ef4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="available" name="Available Stock" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Grid Row 3: Volunteers by Skill & Location Density */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 5: Volunteers by Skill */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Volunteer Skills Distribution
              </h3>
              <p className="text-xs text-slate-500">Specialized capabilities across force</p>
            </div>
            <Users className="w-5 h-5 text-blue-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volunteersBySkillData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="skill" tick={{ fontSize: 11 }} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 6: Incidents by Location */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Geographic Incident Density
              </h3>
              <p className="text-xs text-slate-500">Number of emergency events by district</p>
            </div>
            <MapPin className="w-5 h-5 text-red-500" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="location" tick={{ fontSize: 11 }} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="incidents" fill="#0ea5e9" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
