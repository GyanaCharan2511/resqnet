import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ArrowRightLeft,
  Edit2,
  Trash2,
  MapPin
} from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import { formatNumber } from '../utils/helpers';
import { useApp } from '../context/AppContext';

export const ResourceTable = ({
  onAllocate,
  onEditResource,
  onDeleteResource,
  onAddResource
}) => {
  const { resources } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const categories = [
    'All',
    'Food',
    'Drinking Water',
    'Medicines',
    'Blankets',
    'Emergency Kits',
    'Tents',
    'Rescue Equipment',
    'Vehicles'
  ];

  const filteredResources = useMemo(() => {
    let list = [...resources];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        r =>
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'All') {
      list = list.filter(r => r.category === selectedCategory);
    }

    if (selectedStatus !== 'All') {
      list = list.filter(r => r.status === selectedStatus);
    }

    return list;
  }, [resources, searchQuery, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full sm:w-auto flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resource stockpile..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              aria-label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            >
              {categories.map(c => (
                <option key={c} value={c}>Category: {c}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              aria-label="Filter by Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {onAddResource && (
          <Button variant="primary" size="sm" icon={Plus} onClick={onAddResource} className="shrink-0 w-full sm:w-auto">
            Add Resource
          </Button>
        )}
      </div>

      {/* Table / List */}
      {filteredResources.length === 0 ? (
        <EmptyState
          title="No resources found"
          description="Try changing category filter or search keywords."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('All');
            setSelectedStatus('All');
          }}
        />
      ) : (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-4">Resource Item</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-4">Allocated / Total</th>
                  <th className="py-3.5 px-4">Storage Depot</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredResources.map(resource => {
                  const percentAvailable = resource.total > 0
                    ? Math.round((resource.available / resource.total) * 100)
                    : 0;

                  return (
                    <tr
                      key={resource.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {resource.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {resource.id} • {resource.unit || 'Units'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700">
                          {resource.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 min-w-[160px]">
                        <div className="flex items-center justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-700 dark:text-slate-300">
                            {formatNumber(resource.available)} {resource.unit}
                          </span>
                          <span className="text-slate-500">{percentAvailable}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              percentAvailable < 20
                                ? 'bg-rose-500'
                                : percentAvailable < 40
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percentAvailable}%` }}
                          />
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {formatNumber(resource.allocated)}
                        </span>
                        <span className="text-slate-400"> / {formatNumber(resource.total)}</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300 max-w-[180px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{resource.location}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <StatusBadge type="status" value={resource.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onAllocate && (
                            <Button
                              variant="outline"
                              size="sm"
                              icon={ArrowRightLeft}
                              onClick={() => onAllocate(resource)}
                              disabled={resource.available <= 0}
                            >
                              Allocate
                            </Button>
                          )}
                          {onEditResource && (
                            <button
                              onClick={() => onEditResource(resource)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors cursor-pointer"
                              title="Edit Resource"
                              aria-label={`Edit ${resource.name}`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}
                          {onDeleteResource && (
                            <button
                              onClick={() => onDeleteResource(resource)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                              title="Delete Resource"
                              aria-label={`Delete ${resource.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
