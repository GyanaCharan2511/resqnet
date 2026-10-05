import React, { useState } from 'react';
import {
  Home,
  Plus,
  Users,
  CheckCircle2,
  BedDouble
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { ShelterCard } from '../components/ShelterCard';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatNumber } from '../utils/helpers';

export const ReliefCenters = () => {
  const { shelters, stats, addShelter, updateShelter, deleteShelter } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalShelter, setEditModalShelter] = useState(null);
  const [occupancyModalShelter, setOccupancyModalShelter] = useState(null);
  const [deleteModalShelter, setDeleteModalShelter] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 500,
    occupied: 150,
    facilities: ['Food', 'Water', 'Medical', 'Electricity', 'Restrooms'],
    contactPerson: '',
    contactPhone: '',
    notes: ''
  });

  const [newOccupancy, setNewOccupancy] = useState(0);

  const facilityOptions = ['Food', 'Water', 'Medical', 'Electricity', 'Restrooms', 'Internet'];

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      location: 'Visakhapatnam',
      capacity: 500,
      occupied: 100,
      facilities: ['Food', 'Water', 'Medical', 'Electricity', 'Restrooms'],
      contactPerson: 'Relief Coordinator',
      contactPhone: '+91 891 255 0000',
      notes: 'Equipped with backup power and first aid medical supplies.'
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (shl) => {
    setEditModalShelter(shl);
    setFormData({
      name: shl.name,
      location: shl.location,
      capacity: shl.capacity,
      occupied: shl.occupied,
      facilities: shl.facilities || ['Food', 'Water'],
      contactPerson: shl.contactPerson || '',
      contactPhone: shl.contactPhone || '',
      notes: shl.notes || ''
    });
  };

  const handleOpenOccupancy = (shl) => {
    setOccupancyModalShelter(shl);
    setNewOccupancy(shl.occupied);
  };

  const toggleFacility = (facility) => {
    setFormData(prev => {
      const exists = prev.facilities.includes(facility);
      if (exists) {
        return { ...prev, facilities: prev.facilities.filter(f => f !== facility) };
      } else {
        return { ...prev, facilities: [...prev.facilities, facility] };
      }
    });
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addShelter({
      ...formData,
      coordinates: [17.6868 + (Math.random() - 0.5) * 0.08, 83.2185 + (Math.random() - 0.5) * 0.08]
    });
    setAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editModalShelter) return;
    updateShelter(editModalShelter.id, formData);
    setEditModalShelter(null);
  };

  const handleSaveOccupancy = (e) => {
    e.preventDefault();
    if (!occupancyModalShelter) return;
    updateShelter(occupancyModalShelter.id, {
      occupied: Number(newOccupancy)
    });
    setOccupancyModalShelter(null);
  };

  const handleConfirmDelete = () => {
    if (deleteModalShelter) {
      deleteShelter(deleteModalShelter.id);
      setDeleteModalShelter(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Relief Shelters & Rehabilitation
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-500/20">
              {shelters.length} Facilities Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time occupancy tracking, bed availability, food supply hubs and medical support points.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Register Relief Center
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Shelter Capacity"
          value={formatNumber(stats.totalShelterCapacity)}
          subtitle="Across All 8 District Centers"
          icon={BedDouble}
          color="purple"
        />

        <StatCard
          title="Current Evacuees Sheltered"
          value={formatNumber(stats.totalShelterOccupied)}
          subtitle={`${Math.round((stats.totalShelterOccupied / (stats.totalShelterCapacity || 1)) * 100)}% Overall Occupancy`}
          icon={Users}
          color="indigo"
        />

        <StatCard
          title="Available Bed Spaces"
          value={formatNumber(stats.totalShelterAvailable)}
          subtitle="Ready for Incoming Convoys"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Operational Centers"
          value={shelters.length}
          subtitle="Supplied with Water & Power"
          icon={Home}
          color="blue"
        />
      </div>

      {/* Shelters Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shelters.map(shelter => (
          <ShelterCard
            key={shelter.id}
            shelter={shelter}
            onEdit={handleOpenEdit}
            onDelete={(s) => setDeleteModalShelter(s)}
            onUpdateOccupancy={handleOpenOccupancy}
            showActions={true}
          />
        ))}
      </div>

      {/* Add Shelter Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Register New Relief Center"
          subtitle="Add Cyclone Shelter, School or Transit Stadium to the relief roster"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shelter Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Municipal High School Flood Shelter"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Address / Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Gajuwaka Main Road, Visakhapatnam"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Capacity (People) *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData(p => ({ ...p, capacity: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Currently Occupied
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.occupied}
                  onChange={(e) => setFormData(p => ({ ...p, occupied: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Officer In-Charge
                </label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData(p => ({ ...p, contactPerson: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Helpline Phone
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData(p => ({ ...p, contactPhone: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Available Facilities
              </label>
              <div className="flex flex-wrap gap-2">
                {facilityOptions.map(fac => {
                  const active = formData.facilities.includes(fac);
                  return (
                    <button
                      key={fac}
                      type="button"
                      onClick={() => toggleFacility(fac)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all ${
                        active
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {fac}
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
                Register Center
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Shelter Modal */}
      {editModalShelter && (
        <Modal
          isOpen={!!editModalShelter}
          onClose={() => setEditModalShelter(null)}
          title={`Edit Shelter: ${editModalShelter.name}`}
          subtitle={`ID: ${editModalShelter.id}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Shelter Name
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
                  Total Capacity
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData(p => ({ ...p, capacity: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Occupied
                </label>
                <input
                  type="number"
                  value={formData.occupied}
                  onChange={(e) => setFormData(p => ({ ...p, occupied: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditModalShelter(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Updates
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Quick Occupancy Count Updater Modal */}
      {occupancyModalShelter && (
        <Modal
          isOpen={!!occupancyModalShelter}
          onClose={() => setOccupancyModalShelter(null)}
          title={`Update Occupancy: ${occupancyModalShelter.name}`}
          subtitle={`Max Capacity: ${occupancyModalShelter.capacity} people`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleSaveOccupancy} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Number of Sheltered Persons
              </label>
              <input
                type="number"
                min="0"
                max={occupancyModalShelter.capacity}
                value={newOccupancy}
                onChange={(e) => setNewOccupancy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-base font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs flex justify-between">
              <span className="text-slate-500">Resulting Spaces:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {Math.max(0, occupancyModalShelter.capacity - newOccupancy)} available
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setOccupancyModalShelter(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Update Count
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteModalShelter}
        onClose={() => setDeleteModalShelter(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Relief Shelter"
        message={`Are you sure you want to remove ${deleteModalShelter?.name} from the active shelter registry?`}
        confirmText="Remove Shelter"
        confirmVariant="danger"
      />
    </div>
  );
};
