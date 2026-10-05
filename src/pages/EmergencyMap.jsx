import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  Search,
  Flame,
  AlertTriangle,
  Users,
  Box,
  Layers,
  Home,
  Clock,
  Compass,
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { formatNumber, formatRelativeTime } from '../utils/helpers';

// Helper component to center map on state change or query param
const MapController = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 11, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
};

// Create custom colored markers with Leaflet DivIcon
const createCustomMarker = (severity, type) => {
  let bgColor = '#3b82f6';
  let pulseClass = '';

  switch (severity?.toLowerCase()) {
    case 'critical':
      bgColor = '#ef4444';
      pulseClass = 'pulse-marker-critical';
      break;
    case 'high':
      bgColor = '#f97316';
      break;
    case 'medium':
      bgColor = '#eab308';
      break;
    case 'low':
      bgColor = '#10b981';
      break;
    default:
      bgColor = '#64748b';
  }

  const html = `
    <div class="relative flex items-center justify-center">
      <div class="${pulseClass} absolute -inset-2 rounded-full" style="background-color: ${bgColor}; opacity: 0.35;"></div>
      <div style="background-color: ${bgColor}; width: 30px; height: 30px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 11px;">
        ${type === 'Flood' ? '🌊' : type === 'Cyclone' ? '🌪️' : type === 'Fire' ? '🔥' : type === 'Accident' ? '💥' : '⚠️'}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

export const EmergencyMap = () => {
  const { incidents, shelters, stats } = useApp();
  const [searchParams] = useSearchParams();

  // Initial Center: Visakhapatnam Coast
  const defaultCenter = [17.6868, 83.2185];
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoomLevel, setZoomLevel] = useState(10);

  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [showShelters, setShowShelters] = useState(true);

  // Check URL params for deep-link centering
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    if (lat && lng) {
      const parsedLat = parseFloat(lat);
      const parsedLng = parseFloat(lng);
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        setMapCenter([parsedLat, parsedLng]);
        setZoomLevel(13);
      }
    }
  }, [searchParams]);

  // Filter incidents for markers and side-panel
  const filteredIncidents = useMemo(() => {
    let list = incidents.filter(i => i.coordinates && i.coordinates.length === 2);

    if (activeFilter === 'Critical') {
      list = list.filter(i => i.severity === 'Critical');
    } else if (activeFilter !== 'All') {
      list = list.filter(i => i.type === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        i =>
          i.title.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.id.toLowerCase().includes(q)
      );
    }

    return list;
  }, [incidents, activeFilter, searchQuery]);

  const filterTabs = ['All', 'Flood', 'Cyclone', 'Fire', 'Accident', 'Critical'];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
      {/* Top Map Control Bar */}
      <div className="p-3 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 z-20">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
                Emergency GIS Map
              </h1>
              <p className="text-[11px] text-slate-500">Live Andhra Pradesh / East Coast Ops</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 dark:border-slate-800 text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical ({stats.criticalIncidents})
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Medium
            </span>
            <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300 ml-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {filterTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? tab === 'Critical'
                    ? 'bg-red-600 text-white shadow-md shadow-red-500/30'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {tab === 'Critical' ? '🚨 Critical' : tab}
            </button>
          ))}
          <button
            onClick={() => setShowShelters(s => !s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              showShelters
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            🏠 Shelters
          </button>
        </div>
      </div>

      {/* Main Container: Interactive Map + Active Side Panel */}
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        {/* Leaflet Map */}
        <div className="flex-1 h-full w-full relative z-10">
          <MapContainer
            center={defaultCenter}
            zoom={10}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <MapController center={mapCenter} zoom={zoomLevel} />

            {/* Standard OpenStreetMap Tile Layer */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Incident Markers */}
            {filteredIncidents.map(incident => (
              <Marker
                key={incident.id}
                position={incident.coordinates}
                icon={createCustomMarker(incident.severity, incident.type)}
                eventHandlers={{
                  click: () => {
                    setSelectedIncident(incident);
                  }
                }}
              >
                <Popup>
                  <div className="p-1 space-y-2 max-w-xs text-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
                      <span className="font-mono font-bold text-blue-400">{incident.id}</span>
                      <StatusBadge type="severity" value={incident.severity} size="sm" />
                    </div>

                    <h4 className="font-bold text-white text-sm leading-tight">
                      {incident.title}
                    </h4>

                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {incident.description}
                    </p>

                    <div className="space-y-1 text-[11px] text-slate-300 pt-1 border-t border-slate-700">
                      <p>📍 <strong>Location:</strong> {incident.location}</p>
                      <p>👥 <strong>Affected:</strong> {formatNumber(incident.affectedPeople)} citizens</p>
                      <p>⚡ <strong>Status:</strong> {incident.status}</p>
                      {incident.requiredAssistance && (
                        <p className="text-amber-300">🚨 <strong>Needed:</strong> {incident.requiredAssistance}</p>
                      )}
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <span className="text-[10px] text-slate-400">
                        {formatRelativeTime(incident.reportedTime)}
                      </span>
                      <Link
                        to="/incidents"
                        className="text-blue-400 font-bold hover:underline text-[11px]"
                      >
                        Manage Incident →
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Relief Shelter Markers */}
            {showShelters && shelters.map(shelter => (
              <Marker
                key={shelter.id}
                position={shelter.coordinates || [17.6885, 83.2120]}
                icon={L.divIcon({
                  html: `
                    <div style="background-color: #8b5cf6; width: 26px; height: 26px; border-radius: 8px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 13px;">
                      🏠
                    </div>
                  `,
                  className: 'custom-shelter-marker',
                  iconSize: [26, 26],
                  iconAnchor: [13, 13]
                })}
              >
                <Popup>
                  <div className="p-1 space-y-1.5 max-w-xs text-xs">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                      <span className="font-mono font-bold text-purple-400">{shelter.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {shelter.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{shelter.name}</h4>
                    <p className="text-slate-300 text-[11px]">📍 {shelter.location}</p>
                    <p className="text-slate-200 text-[11px]">
                      👥 Capacity: <strong>{shelter.occupied} / {shelter.capacity}</strong> ({shelter.availableSpaces} free)
                    </p>
                    <p className="text-[10px] text-slate-400">Helpline: {shelter.contactPhone}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Side Panel: Active Emergency Hotspots */}
        <div className="w-full md:w-80 lg:w-96 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 flex flex-col h-64 md:h-full z-20 shadow-xl">
          {/* Search Header */}
          <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Markers ({filteredIncidents.length})
              </span>
              <span className="text-[11px] text-slate-400">Click to Fly to Pin</span>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter map pins..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Incident List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredIncidents.map(inc => (
              <div
                key={inc.id}
                onClick={() => {
                  setMapCenter(inc.coordinates);
                  setZoomLevel(13);
                  setSelectedIncident(inc);
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  selectedIncident?.id === inc.id
                    ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-500 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                    {inc.id}
                  </span>
                  <StatusBadge type="severity" value={inc.severity} size="sm" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs line-clamp-1">
                  {inc.title}
                </h4>
                <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-red-500 shrink-0" />
                  <span className="truncate">{inc.location}</span>
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span>{formatNumber(inc.affectedPeople)} Affected</span>
                  <span>{formatRelativeTime(inc.reportedTime)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
