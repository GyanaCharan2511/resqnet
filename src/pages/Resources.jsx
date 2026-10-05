import React, { useState } from 'react';
import {
  Box,
  Plus,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatCard } from '../components/StatCard';
import { ResourceTable } from '../components/ResourceTable';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { formatNumber } from '../utils/helpers';

export const Resources = () => {
  const { resources, incidents, stats, addResource, updateResource, deleteResource, allocateResource } = useApp();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalResource, setEditModalResource] = useState(null);
  const [allocateModalResource, setAllocateModalResource] = useState(null);
  const [deleteModalResource, setDeleteModalResource] = useState(null);

  // Add / Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    total: 500,
    allocated: 0,
    unit: 'Kits',
    location: 'Central Warehouse, Gajuwaka Depot'
  });

  // Allocation Form State
  const [allocForm, setAllocForm] = useState({
    incidentId: incidents[0]?.id || '',
    quantity: 50,
    destination: 'Gajuwaka Flood Sector 2'
  });

  const categories = [
    'Food',
    'Drinking Water',
    'Medicines',
    'Blankets',
    'Emergency Kits',
    'Tents',
    'Rescue Equipment',
    'Vehicles'
  ];

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      category: 'Food',
      total: 500,
      allocated: 0,
      unit: 'Units',
      location: 'Central Warehouse, Visakhapatnam'
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (res) => {
    setEditModalResource(res);
    setFormData({
      name: res.name,
      category: res.category,
      total: res.total,
      allocated: res.allocated,
      unit: res.unit || 'Units',
      location: res.location
    });
  };

  const handleOpenAllocate = (res) => {
    setAllocateModalResource(res);
    setAllocForm({
      incidentId: incidents[0]?.id || '',
      quantity: Math.min(res.available, 20) || 1,
      destination: incidents[0]?.location || 'Disaster Zone HQ'
    });
  };

  const handleSaveAdd = (e) => {
    e.preventDefault();
    addResource(formData);
    setAddModalOpen(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editModalResource) return;
    updateResource(editModalResource.id, formData);
    setEditModalResource(null);
  };

  const handleSaveAllocate = (e) => {
    e.preventDefault();
    if (!allocateModalResource) return;
    allocateResource(
      allocateModalResource.id,
      allocForm.incidentId,
      allocForm.quantity,
      allocForm.destination
    );
    setAllocateModalResource(null);
  };

  const handleConfirmDelete = () => {
    if (deleteModalResource) {
      deleteResource(deleteModalResource.id);
      setDeleteModalResource(null);
    }
  };

  const totalUnits = resources.reduce((sum, r) => sum + (r.total || 0), 0);
  const totalAllocated = resources.reduce((sum, r) => sum + (r.allocated || 0), 0);
  const totalAvailable = resources.reduce((sum, r) => sum + (r.available || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
              Resource Stockpile & Inventory
            </h1>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-500/20">
              {resources.length} SKUs Managed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, replenish and dispatch life-saving supplies, boats, fuel, and medical kits to field operations.
          </p>
        </div>

        <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenAdd}>
          Add New Stock Item
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inventory Units"
          value={formatNumber(totalUnits)}
          subtitle={`${resources.length} Distinct Resource Items`}
          icon={Box}
          color="blue"
        />

        <StatCard
          title="Available Ready Stock"
          value={formatNumber(totalAvailable)}
          subtitle="Ready for Instant Dispatch"
          icon={CheckCircle2}
          color="emerald"
        />

        <StatCard
          title="Allocated to Field"
          value={formatNumber(totalAllocated)}
          subtitle="Deployed to Active Incidents"
          icon={ArrowRightLeft}
          color="indigo"
        />

        <StatCard
          title="Low Stock Warning"
          value={stats.lowStockResources}
          subtitle="Requires Immediate Reorder"
          icon={AlertTriangle}
          color="amber"
          badge="Replenish"
        />
      </div>

      {/* Resource Table */}
      <ResourceTable
        onAllocate={handleOpenAllocate}
        onEditResource={handleOpenEdit}
        onDeleteResource={(r) => setDeleteModalResource(r)}
        onAddResource={handleOpenAdd}
      />

      {/* Add Resource Modal */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title="Add New Stockpile Resource"
          subtitle="Register inventory items, medical supplies, rescue crafts or dry rations"
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resource Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Life Jackets (Adult 80kg)"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit Type
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData(p => ({ ...p, unit: e.target.value }))}
                  placeholder="Units, Boxes, Packets..."
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Initial Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.total}
                  onChange={(e) => setFormData(p => ({ ...p, total: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Already Allocated
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.allocated}
                  onChange={(e) => setFormData(p => ({ ...p, allocated: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Storage Depot / Warehouse Base *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Civil Supplies Godown, Kakinada"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Add to Stockpile
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Resource Modal */}
      {editModalResource && (
        <Modal
          isOpen={!!editModalResource}
          onClose={() => setEditModalResource(null)}
          title={`Edit Resource: ${editModalResource.id}`}
          subtitle={editModalResource.name}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resource Name
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
                  Total Stock Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.total}
                  onChange={(e) => setFormData(p => ({ ...p, total: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Allocated Units
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.allocated}
                  onChange={(e) => setFormData(p => ({ ...p, allocated: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Depot Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(p => ({ ...p, location: e.target.value }))}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditModalResource(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit">
                Save Updates
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Resource Allocation Modal */}
      {allocateModalResource && (
        <Modal
          isOpen={!!allocateModalResource}
          onClose={() => setAllocateModalResource(null)}
          title={`Allocate: ${allocateModalResource.name}`}
          subtitle={`Available Stock: ${allocateModalResource.available} ${allocateModalResource.unit || 'units'}`}
          maxWidth="max-w-lg"
        >
          <form onSubmit={handleSaveAllocate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Target Incident *
              </label>
              <select
                value={allocForm.incidentId}
                onChange={(e) => {
                  const id = e.target.value;
                  const inc = incidents.find(i => i.id === id);
                  setAllocForm(p => ({
                    ...p,
                    incidentId: id,
                    destination: inc?.location || p.destination
                  }));
                }}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              >
                {incidents.map(inc => (
                  <option key={inc.id} value={inc.id}>
                    [{inc.id}] {inc.title.substring(0, 45)}... ({inc.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quantity to Dispatch *
                </label>
                <input
                  type="number"
                  min="1"
                  max={allocateModalResource.available}
                  value={allocForm.quantity}
                  onChange={(e) => setAllocForm(p => ({ ...p, quantity: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Unit
                </label>
                <input
                  type="text"
                  disabled
                  value={allocateModalResource.unit || 'Units'}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Delivery Destination / Ground Sector *
              </label>
              <input
                type="text"
                value={allocForm.destination}
                onChange={(e) => setAllocForm(p => ({ ...p, destination: e.target.value }))}
                placeholder="e.g. Gajuwaka Relief Point A"
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setAllocateModalResource(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" icon={ArrowRightLeft}>
                Confirm Dispatch
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteModalResource}
        onClose={() => setDeleteModalResource(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Stock Item"
        message={`Are you sure you want to remove ${deleteModalResource?.name} from active inventory stockpile?`}
        confirmText="Remove Item"
        confirmVariant="danger"
      />
    </div>
  );
};
