import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IncidentTable } from '../components/IncidentTable';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { StatusBadge } from '../components/StatusBadge';
import { formatNumber, formatDateTime } from '../utils/helpers';

export const Incidents = () => {
  const { incidents, updateIncident, deleteIncident } = useApp();

  const [viewModalIncident, setViewModalIncident] = useState(null);
  const [editModalIncident, setEditModalIncident] = useState(null);
  const [deleteModalIncident, setDeleteModalIncident] = useState(null);

  const [editForm, setEditForm] = useState({
    title: '',
    severity: 'Medium',
    status: 'Reported',
    affectedPeople: 0,
    description: '',
    requiredAssistance: ''
  });

  const handleOpenEdit = (incident) => {
    setEditModalIncident(incident);
    setEditForm({
      title: incident.title,
      severity: incident.severity,
      status: incident.status,
      affectedPeople: incident.affectedPeople || 0,
      description: incident.description || '',
      requiredAssistance: incident.requiredAssistance || ''
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editModalIncident) return;
    updateIncident(editModalIncident.id, {
      ...editForm,
      affectedPeople: Number(editForm.affectedPeople) || 0
    });
    setEditModalIncident(null);
  };

  const handleConfirmDelete = () => {
    if (deleteModalIncident) {
      deleteIncident(deleteModalIncident.id);
      setDeleteModalIncident(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Incident Response Directory
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-500/20">
              {incidents.length} Total Records
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, update statuses and triage reported emergencies across districts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/map">
            <Button variant="outline" size="sm" icon={MapPin}>
              View on GIS Map
            </Button>
          </Link>
          <Link to="/report">
            <Button variant="emergency" size="sm" icon={Plus}>
              Report Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Incident Table with Filter bar */}
      <IncidentTable
        showFilters={true}
        onViewIncident={(inc) => setViewModalIncident(inc)}
        onEditIncident={(inc) => handleOpenEdit(inc)}
        onDeleteIncident={(inc) => setDeleteModalIncident(inc)}
      />

      {/* View Incident Modal */}
      {viewModalIncident && (
        <Modal
          isOpen={!!viewModalIncident}
          onClose={() => setViewModalIncident(null)}
          title={`Incident Details: ${viewModalIncident.id}`}
          subtitle={viewModalIncident.title}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <StatusBadge type="severity" value={viewModalIncident.severity} size="md" />
              <StatusBadge type="status" value={viewModalIncident.status} size="md" />
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Disaster Type: {viewModalIncident.type}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Location:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  {viewModalIncident.location}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-slate-400 font-semibold">Citizens Affected:</span>
                <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" />
                  {formatNumber(viewModalIncident.affectedPeople)} People
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Situation Description
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                {viewModalIncident.description}
              </p>
            </div>

            {viewModalIncident.requiredAssistance && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">
                  Required Emergency Assistance
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-3.5 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30">
                  {viewModalIncident.requiredAssistance}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400">Reported By:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{viewModalIncident.reportedBy}</p>
                <p className="text-slate-500">{viewModalIncident.contact}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <span className="text-slate-400">Response Team:</span>
                <p className="font-semibold text-slate-900 dark:text-white">{viewModalIncident.responseTeam || 'Disaster Quick Response Unit'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Logged: {formatDateTime(viewModalIncident.reportedTime)}
              </span>
              <div className="flex gap-2">
                <Link to={`/map?lat=${viewModalIncident.coordinates?.[0]}&lng=${viewModalIncident.coordinates?.[1]}`}>
                  <Button variant="outline" size="sm" icon={MapPin}>
                    GIS Map View
                  </Button>
                </Link>
                <Button variant="primary" size="sm" onClick={() => setViewModalIncident(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Incident Modal */}
      {editModalIncident && (
        <Modal
          isOpen={!!editModalIncident}
          onClose={() => setEditModalIncident(null)}
          title={`Edit Incident: ${editModalIncident.id}`}
          subtitle="Update severity, status, or ground requirements"
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Incident Title
              </label>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(p => ({ ...p, title: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Severity
                </label>
                <select
                  value={editForm.severity}
                  onChange={(e) => setEditForm(p => ({ ...p, severity: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Reported">Reported</option>
                  <option value="Verified">Verified</option>
                  <option value="Responding">Responding</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Affected People Count
              </label>
              <input
                type="number"
                value={editForm.affectedPeople}
                onChange={(e) => setEditForm(p => ({ ...p, affectedPeople: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={editForm.description}
                onChange={(e) => setEditForm(p => ({ ...p, description: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditModalIncident(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteModalIncident}
        onClose={() => setDeleteModalIncident(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Incident Record"
        message={`Are you sure you want to permanently remove ${deleteModalIncident?.id} (${deleteModalIncident?.title})? This action cannot be reversed.`}
        confirmText="Delete Incident"
        confirmVariant="danger"
      />
    </div>
  );
};
