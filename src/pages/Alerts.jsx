import React, { useState } from 'react';
import {
  Radio,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { AlertCard } from '../components/AlertCard';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { EmptyState } from '../components/EmptyState';

export const Alerts = () => {
  const { alerts, stats, addAlert, deleteAlert } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalAlert, setDeleteModalAlert] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    disasterType: 'Flood',
    affectedArea: 'Visakhapatnam & Coastal Districts',
    severity: 'Critical',
    alertType: 'Critical',
    expirationTime: '2026-09-24T18:00:00.000Z',
    instructions: 'Evacuate low-lying riverside areas and boil drinking water.'
  });

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      message: '',
      disasterType: 'Flood',
      affectedArea: 'Visakhapatnam, Vizianagaram, Srikakulam',
      severity: 'Critical',
      alertType: 'Critical',
      expirationTime: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      instructions: 'Stay tuned to official emergency radio broadcasts.'
    });
    setAddModalOpen(true);
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addAlert(formData);
    setAddModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteModalAlert) {
      deleteAlert(deleteModalAlert.id);
      setDeleteModalAlert(null);
    }
  };

  const filteredAlerts = alerts.filter(a => {
    if (selectedSeverity !== 'All' && a.severity !== selectedSeverity && a.alertType !== selectedSeverity) {
      return false;
    }
    if (statusFilter !== 'All' && a.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Emergency Alerts & Warnings
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/10 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              {stats.activeAlerts} Live Broadcasts
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Publish public safety advisories, meteorological warnings, and regional evacuation mandates.
          </p>
        </div>

        <Button variant="emergency" size="sm" icon={Radio} onClick={handleOpenAdd}>
          Broadcast New Alert
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Directives"
          value={stats.activeAlerts}
          subtitle="Broadcasting across cell towers"
          icon={Radio}
          color="red"
          badge="Live"
        />

        <StatCard
          title="Critical Red Alerts"
          value={alerts.filter(a => a.status === 'Active' && (a.severity === 'Critical' || a.alertType === 'Critical')).length}
          subtitle="Immediate Life Safety Hazard"
          icon={AlertOctagon}
          color="red"
        />

        <StatCard
          title="Advisories & Warnings"
          value={alerts.filter(a => a.status === 'Active' && a.severity !== 'Critical').length}
          subtitle="Precautionary Measures"
          icon={AlertTriangle}
          color="amber"
        />

        <StatCard
          title="Resolved Alerts"
          value={alerts.filter(a => a.status === 'Resolved').length}
          subtitle="Threat Level Normalized"
          icon={CheckCircle2}
          color="emerald"
        />
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Severity:</span>
          {['All', 'Critical', 'Emergency', 'Warning', 'Advisory'].map(sev => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                selectedSeverity === sev
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Status:</span>
          {['All', 'Active', 'Resolved'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-bold rounded-xl transition-all ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed */}
      {filteredAlerts.length === 0 ? (
        <EmptyState
          title="No emergency alerts match current filter"
          description="Clear the severity or status filters to view historical advisories."
          actionText="Clear Filters"
          onAction={() => {
            setSelectedSeverity('All');
            setStatusFilter('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredAlerts.map(alert => (
            <AlertCard
              key={alert.id}
              alert={alert}
              canManage={true}
              onDelete={(a) => setDeleteModalAlert(a)}
            />
          ))}
        </div>
      )}

      {/* Broadcast Alert Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="🚨 Broadcast Emergency Public Alert"
          subtitle="Publish urgent safety directives, storm warnings, or flood evacuations"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alert Headline / Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. RED ALERT: Flash Flood Warning in Godavari Delta"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 font-bold"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Disaster Type
                </label>
                <select
                  value={formData.disasterType}
                  onChange={(e) => setFormData(p => ({ ...p, disasterType: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Flood">Flood</option>
                  <option value="Cyclone">Cyclone</option>
                  <option value="Fire">Fire</option>
                  <option value="Landslide">Landslide</option>
                  <option value="Earthquake">Earthquake</option>
                  <option value="Accident">Accident</option>
                  <option value="Other">Other Hazard</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alert Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData(p => ({ ...p, severity: e.target.value, alertType: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 font-bold text-red-600 dark:text-red-400"
                >
                  <option value="Critical">Critical (Red Alert)</option>
                  <option value="Emergency">Emergency (Orange Alert)</option>
                  <option value="Warning">Warning (Yellow Alert)</option>
                  <option value="Advisory">Advisory (Informational)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Affected Geographic Area *
              </label>
              <input
                type="text"
                value={formData.affectedArea}
                onChange={(e) => setFormData(p => ({ ...p, affectedArea: e.target.value }))}
                placeholder="e.g. Visakhapatnam, Kakinada Coastal Belt"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Public Advisory Message *
              </label>
              <textarea
                rows="3"
                value={formData.message}
                onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                placeholder="Detailed meteorological warning, anticipated impact and evacuation advice..."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Citizen Safety Directives / Actions
              </label>
              <input
                type="text"
                value={formData.instructions}
                onChange={(e) => setFormData(p => ({ ...p, instructions: e.target.value }))}
                placeholder="e.g. Fishermen do not venture into sea. Shift livestock to high ground."
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="emergency" size="md" type="submit" icon={Radio}>
                Broadcast Emergency Directive
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteModalAlert}
        onClose={() => setDeleteModalAlert(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Alert Broadcast"
        message={`Are you sure you want to permanently delete alert "${deleteModalAlert?.title}"?`}
        confirmText="Delete Alert"
        confirmVariant="danger"
      />
    </div>
  );
};
