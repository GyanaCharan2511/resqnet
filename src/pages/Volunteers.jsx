import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Activity,
  CheckCircle2,
  Clock,
  Award,
  Search,
  Shield,
  Phone,
  Mail,
  MapPin,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { VolunteerTable } from '../components/VolunteerTable';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatNumber } from '../utils/helpers';

export const Volunteers = () => {
  const { volunteers, incidents, stats, addVolunteer, updateVolunteer, deleteVolunteer, assignVolunteerToIncident } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalVol, setEditModalVol] = useState(null);
  const [assignModalVol, setAssignModalVol] = useState(null);
  const [deleteModalVol, setDeleteModalVol] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Visakhapatnam',
    skills: ['First Aid'],
    availability: 'Available',
    totalHours: 0
  });

  const [assignIncidentId, setAssignIncidentId] = useState(incidents[0]?.id || '');

  const availableSkills = ['First Aid', 'Medical', 'Rescue', 'Driving', 'Food Distribution', 'Communication'];

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: 'Visakhapatnam',
      skills: ['First Aid'],
      availability: 'Available',
      totalHours: 0
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (vol) => {
    setEditModalVol(vol);
    setFormData({
      name: vol.name,
      email: vol.email,
      phone: vol.phone,
      location: vol.location,
      skills: vol.skills || ['First Aid'],
      availability: vol.availability || 'Available',
      totalHours: vol.totalHours || 0
    });
  };

  const handleOpenAssign = (vol) => {
    setAssignModalVol(vol);
    setAssignIncidentId(vol.assignedIncidentId || incidents[0]?.id || '');
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      if (exists) {
        return { ...prev, skills: prev.skills.filter(s => s !== skill) };
      } else {
        return { ...prev, skills: [...prev.skills, skill] };
      }
    });
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addVolunteer(formData);
    setAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editModalVol) return;
    updateVolunteer(editModalVol.id, formData);
    setEditModalVol(null);
  };

  const handleSaveAssign = (e) => {
    e.preventDefault();
    if (!assignModalVol) return;
    assignVolunteerToIncident(assignModalVol.id, assignIncidentId);
    setAssignModalVol(null);
  };

  const handleConfirmDelete = () => {
    if (deleteModalVol) {
      deleteVolunteer(deleteModalVol.id);
      setDeleteModalVol(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Volunteer Force & Dispatch
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-500/20">
              {volunteers.length} Active Personnel
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Skill-based personnel registry, availability triaging, and field incident assignment.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={UserPlus} onClick={handleOpenAdd}>
          Register New Volunteer
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Registered Force"
          value={volunteers.length}
          subtitle="Trained in Life Support & Rescue"
          icon={Users}
          color="blue"
        />

        <StatCard
          title="Ready on Standby"
          value={stats.availableVolunteers}
          subtitle="Can be dispatched immediately"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Deployed on Duty"
          value={stats.onDutyVolunteers}
          subtitle="Operating in Affected Sectors"
          icon={Activity}
          color="indigo"
          badge="Active"
        />

        <StatCard
          title="Assigned to Teams"
          value={volunteers.filter(v => v.availability === 'Assigned').length}
          subtitle="Scheduled for transit & supply"
          icon={Award}
          color="amber"
        />
      </div>

      {/* Volunteer Table */}
      <VolunteerTable
        onAssign={handleOpenAssign}
        onEditVolunteer={handleOpenEdit}
        onDeleteVolunteer={(v) => setDeleteModalVol(v)}
        onAddVolunteer={handleOpenAdd}
      />

      {/* Add Volunteer Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Register Volunteer Responder"
          subtitle="Add skilled paramedics, rescue boat drivers, or relief dispatchers"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Volunteer Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Ramesh Varma"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  placeholder="name@email.com"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98480 00000"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Location / City *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On Duty">On Duty</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Skills & Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => {
                  const active = formData.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Register Volunteer
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Volunteer Modal */}
      {editModalVol && (
        <Modal
          isOpen={!!editModalVol}
          onClose={() => setEditModalVol(null)}
          title={`Edit Volunteer: ${editModalVol.name}`}
          subtitle={`ID: ${editModalVol.id}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData(p => ({ ...p, availability: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="On Duty">On Duty</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Service Hours Logged
                </label>
                <input
                  type="number"
                  value={formData.totalHours}
                  onChange={(e) => setFormData(p => ({ ...p, totalHours: Number(e.target.value) }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Skills & Certifications
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => {
                  const active = formData.skills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditModalVol(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Profile
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assign Volunteer to Incident Modal */}
      {assignModalVol && (
        <Modal
          isOpen={!!assignModalVol}
          onClose={() => setAssignModalVol(null)}
          title={`Assign Volunteer: ${assignModalVol.name}`}
          subtitle={`Skills: ${assignModalVol.skills?.join(', ')}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveAssign} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Incident Assignment
              </label>
              <select
                value={assignIncidentId}
                onChange={(e) => setAssignIncidentId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Standby / No Direct Assignment --</option>
                {incidents.map(inc => (
                  <option key={inc.id} value={inc.id}>
                    [{inc.id}] {inc.title.substring(0, 45)}... ({inc.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-300">
              Assigning will automatically update volunteer availability to <strong>On Duty</strong> and log their contact details in the incident response roster.
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAssignModalVol(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Confirm Assignment
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteModalVol}
        onClose={() => setDeleteModalVol(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Volunteer Record"
        message={`Are you sure you want to remove ${deleteModalVol?.name} from the active volunteer registry?`}
        confirmText="Remove Volunteer"
        confirmVariant="danger"
      />
    </div>
  );
};
