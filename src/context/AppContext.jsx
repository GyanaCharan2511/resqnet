import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialIncidents } from '../data/incidents';
import { initialResources } from '../data/resources';
import { initialVolunteers } from '../data/volunteers';
import { initialShelters } from '../data/shelters';
import { initialAlerts } from '../data/alerts';
import { generateIncidentId, generateResourceId, generateVolunteerId, generateShelterId, generateAlertId } from '../utils/helpers';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Theme state ('dark' or 'light')
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('resqnet_theme');
    if (saved) return saved;
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('resqnet_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('resqnet_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default Authority user for instant rich exploration
    return {
      id: 'USR-AUTH-001',
      name: 'Director K. Rajeshwar',
      email: 'rajeshwar.k@sdma.gov.in',
      role: 'authority', // 'authority' | 'citizen' | 'volunteer'
      phone: '+91 891 250 9988',
      designation: 'Chief Incident Commander, APSDMA'
    };
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('resqnet_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('resqnet_user');
    }
  }, [currentUser]);

  // Incidents State
  const [incidents, setIncidents] = useState(() => {
    const saved = localStorage.getItem('resqnet_incidents');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialIncidents; }
    }
    return initialIncidents;
  });

  useEffect(() => {
    localStorage.setItem('resqnet_incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Resources State
  const [resources, setResources] = useState(() => {
    const saved = localStorage.getItem('resqnet_resources');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialResources; }
    }
    return initialResources;
  });

  useEffect(() => {
    localStorage.setItem('resqnet_resources', JSON.stringify(resources));
  }, [resources]);

  // Volunteers State
  const [volunteers, setVolunteers] = useState(() => {
    const saved = localStorage.getItem('resqnet_volunteers');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialVolunteers; }
    }
    return initialVolunteers;
  });

  useEffect(() => {
    localStorage.setItem('resqnet_volunteers', JSON.stringify(volunteers));
  }, [volunteers]);

  // Shelters State
  const [shelters, setShelters] = useState(() => {
    const saved = localStorage.getItem('resqnet_shelters');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialShelters; }
    }
    return initialShelters;
  });

  useEffect(() => {
    localStorage.setItem('resqnet_shelters', JSON.stringify(shelters));
  }, [shelters]);

  // Alerts State
  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('resqnet_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch { return initialAlerts; }
    }
    return initialAlerts;
  });

  useEffect(() => {
    localStorage.setItem('resqnet_alerts', JSON.stringify(alerts));
  }, [alerts]);

  // Toast Notifications State
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToast = ({ title, message, type = 'info', duration = 4000 }) => {
    const id = `toast-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  // Auth Operations
  const login = (userData) => {
    setCurrentUser(userData);
    addToast({
      title: 'Welcome back!',
      message: `Signed in as ${userData.name} (${userData.role.toUpperCase()})`,
      type: 'success'
    });
  };

  const logout = () => {
    setCurrentUser(null);
    addToast({
      title: 'Signed Out',
      message: 'You have been safely logged out of ResQNet.',
      type: 'info'
    });
  };

  // Incident Operations
  const addIncident = (incidentData) => {
    const newId = generateIncidentId(incidents);
    const newIncident = {
      ...incidentData,
      id: newId,
      reportedTime: new Date().toISOString(),
      status: incidentData.status || 'Reported',
      allocatedResources: incidentData.allocatedResources || [],
      assignedVolunteers: incidentData.assignedVolunteers || []
    };
    setIncidents(prev => [newIncident, ...prev]);
    addToast({
      title: 'Incident Reported Successfully',
      message: `Incident ${newId} has been registered and alerted to emergency responders.`,
      type: 'success'
    });
    return newIncident;
  };

  const updateIncident = (id, updatedFields) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, ...updatedFields } : inc));
    addToast({
      title: 'Incident Updated',
      message: `Incident ${id} record has been updated.`,
      type: 'info'
    });
  };

  const updateIncidentStatus = (id, newStatus) => {
    setIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: newStatus } : inc));
    addToast({
      title: 'Status Updated',
      message: `Incident ${id} status changed to ${newStatus}.`,
      type: 'info'
    });
  };

  const deleteIncident = (id) => {
    setIncidents(prev => prev.filter(inc => inc.id !== id));
    addToast({
      title: 'Incident Removed',
      message: `Incident ${id} was deleted.`,
      type: 'warning'
    });
  };

  // Resource Operations
  const addResource = (resourceData) => {
    const newId = generateResourceId(resources);
    const total = Number(resourceData.total) || 0;
    const allocated = Number(resourceData.allocated) || 0;
    const available = Math.max(0, total - allocated);
    const status = available === 0 ? 'Out of Stock' : (available < total * 0.3 ? 'Low Stock' : 'Available');

    const newResource = {
      ...resourceData,
      id: newId,
      total,
      allocated,
      available,
      status,
      lastUpdated: new Date().toISOString()
    };
    setResources(prev => [newResource, ...prev]);
    addToast({
      title: 'Resource Added',
      message: `${newResource.name} added to inventory.`,
      type: 'success'
    });
    return newResource;
  };

  const updateResource = (id, updatedFields) => {
    setResources(prev => prev.map(res => {
      if (res.id === id) {
        const merged = { ...res, ...updatedFields };
        const total = Number(merged.total) || 0;
        const allocated = Number(merged.allocated) || 0;
        const available = Math.max(0, total - allocated);
        const status = available === 0 ? 'Out of Stock' : (available < total * 0.3 ? 'Low Stock' : 'Available');
        return {
          ...merged,
          total,
          allocated,
          available,
          status,
          lastUpdated: new Date().toISOString()
        };
      }
      return res;
    }));
    addToast({
      title: 'Resource Updated',
      message: `Resource inventory updated.`,
      type: 'info'
    });
  };

  const deleteResource = (id) => {
    setResources(prev => prev.filter(res => res.id !== id));
    addToast({
      title: 'Resource Deleted',
      message: `Resource ${id} removed from stockpile.`,
      type: 'warning'
    });
  };

  const allocateResource = (resourceId, incidentId, quantity, destination) => {
    const numQty = Number(quantity);
    if (!numQty || numQty <= 0) return false;

    let resName = '';
    setResources(prev => prev.map(res => {
      if (res.id === resourceId) {
        resName = res.name;
        const newAllocated = (res.allocated || 0) + numQty;
        const newAvailable = Math.max(0, (res.total || 0) - newAllocated);
        const status = newAvailable === 0 ? 'Out of Stock' : (newAvailable < res.total * 0.3 ? 'Low Stock' : 'Available');
        return {
          ...res,
          allocated: newAllocated,
          available: newAvailable,
          status,
          lastUpdated: new Date().toISOString()
        };
      }
      return res;
    }));

    // Update incident allocated resources
    if (incidentId) {
      setIncidents(prev => prev.map(inc => {
        if (inc.id === incidentId) {
          const existingAlloc = inc.allocatedResources || [];
          const existingItem = existingAlloc.find(a => a.resourceName === resName);
          let newAllocList;
          if (existingItem) {
            newAllocList = existingAlloc.map(a => a.resourceName === resName ? { ...a, quantity: a.quantity + numQty } : a);
          } else {
            newAllocList = [...existingAlloc, { resourceName: resName, quantity: numQty, destination }];
          }
          return { ...inc, allocatedResources: newAllocList };
        }
        return inc;
      }));
    }

    addToast({
      title: 'Resource Allocated Successfully',
      message: `Dispatched ${numQty} units of ${resName} to ${destination || incidentId}.`,
      type: 'success'
    });
    return true;
  };

  // Volunteer Operations
  const addVolunteer = (volData) => {
    const newId = generateVolunteerId(volunteers);
    const newVolunteer = {
      ...volData,
      id: newId,
      availability: volData.availability || 'Available',
      status: 'Active',
      totalHours: Number(volData.totalHours) || 0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setVolunteers(prev => [newVolunteer, ...prev]);
    addToast({
      title: 'Volunteer Registered',
      message: `${newVolunteer.name} joined as emergency volunteer.`,
      type: 'success'
    });
    return newVolunteer;
  };

  const updateVolunteer = (id, updatedFields) => {
    setVolunteers(prev => prev.map(vol => vol.id === id ? { ...vol, ...updatedFields } : vol));
    addToast({
      title: 'Volunteer Updated',
      message: `Volunteer profile updated.`,
      type: 'info'
    });
  };

  const updateVolunteerStatus = (id, availability) => {
    setVolunteers(prev => prev.map(vol => vol.id === id ? { ...vol, availability } : vol));
    addToast({
      title: 'Availability Changed',
      message: `Volunteer status set to ${availability}.`,
      type: 'info'
    });
  };

  const deleteVolunteer = (id) => {
    setVolunteers(prev => prev.filter(vol => vol.id !== id));
    addToast({
      title: 'Volunteer Removed',
      message: `Volunteer ${id} record removed.`,
      type: 'warning'
    });
  };

  const assignVolunteerToIncident = (volunteerId, incidentId) => {
    setVolunteers(prev => prev.map(vol => {
      if (vol.id === volunteerId) {
        return {
          ...vol,
          assignedIncidentId: incidentId,
          availability: incidentId ? 'On Duty' : 'Available'
        };
      }
      return vol;
    }));

    if (incidentId) {
      setIncidents(prev => prev.map(inc => {
        if (inc.id === incidentId) {
          const assigned = inc.assignedVolunteers || [];
          if (!assigned.includes(volunteerId)) {
            return { ...inc, assignedVolunteers: [...assigned, volunteerId] };
          }
        }
        return inc;
      }));
    }

    addToast({
      title: 'Volunteer Assigned',
      message: `Volunteer ${volunteerId} assigned to ${incidentId || 'standby'}.`,
      type: 'success'
    });
  };

  // Shelter Operations
  const addShelter = (shelterData) => {
    const newId = generateShelterId(shelters);
    const capacity = Number(shelterData.capacity) || 0;
    const occupied = Number(shelterData.occupied) || 0;
    const availableSpaces = Math.max(0, capacity - occupied);
    const newShelter = {
      ...shelterData,
      id: newId,
      capacity,
      occupied,
      availableSpaces,
      status: availableSpaces === 0 ? 'Full' : (availableSpaces < capacity * 0.2 ? 'Nearly Full' : 'Operational')
    };
    setShelters(prev => [newShelter, ...prev]);
    addToast({
      title: 'Relief Shelter Registered',
      message: `${newShelter.name} added to relief network.`,
      type: 'success'
    });
    return newShelter;
  };

  const updateShelter = (id, updatedFields) => {
    setShelters(prev => prev.map(shl => {
      if (shl.id === id) {
        const merged = { ...shl, ...updatedFields };
        const capacity = Number(merged.capacity) || 0;
        const occupied = Number(merged.occupied) || 0;
        const availableSpaces = Math.max(0, capacity - occupied);
        const status = availableSpaces === 0 ? 'Full' : (availableSpaces < capacity * 0.2 ? 'Nearly Full' : 'Operational');
        return { ...merged, capacity, occupied, availableSpaces, status };
      }
      return shl;
    }));
    addToast({
      title: 'Shelter Updated',
      message: `Relief center details updated.`,
      type: 'info'
    });
  };

  const deleteShelter = (id) => {
    setShelters(prev => prev.filter(shl => shl.id !== id));
    addToast({
      title: 'Shelter Removed',
      message: `Shelter ${id} removed from active roster.`,
      type: 'warning'
    });
  };

  // Alert Operations
  const addAlert = (alertData) => {
    const newId = generateAlertId(alerts);
    const newAlert = {
      ...alertData,
      id: newId,
      issuedTime: new Date().toISOString(),
      status: 'Active'
    };
    setAlerts(prev => [newAlert, ...prev]);
    addToast({
      title: 'Emergency Alert Broadcasted!',
      message: `Alert ${newAlert.title} published across channels.`,
      type: 'warning'
    });
    return newAlert;
  };

  const updateAlert = (id, updatedFields) => {
    setAlerts(prev => prev.map(alt => alt.id === id ? { ...alt, ...updatedFields } : alt));
    addToast({
      title: 'Alert Updated',
      message: `Alert ${id} details updated.`,
      type: 'info'
    });
  };

  const toggleAlertStatus = (id) => {
    setAlerts(prev => prev.map(alt => {
      if (alt.id === id) {
        const newStatus = alt.status === 'Active' ? 'Resolved' : 'Active';
        addToast({
          title: `Alert ${newStatus}`,
          message: `Alert ${id} is now ${newStatus}.`,
          type: newStatus === 'Active' ? 'warning' : 'info'
        });
        return { ...alt, status: newStatus };
      }
      return alt;
    }));
  };

  const deleteAlert = (id) => {
    setAlerts(prev => prev.filter(alt => alt.id !== id));
    addToast({
      title: 'Alert Deleted',
      message: `Alert ${id} removed.`,
      type: 'info'
    });
  };

  // Reset to initial mock data
  const resetToDemoData = () => {
    setIncidents(initialIncidents);
    setResources(initialResources);
    setVolunteers(initialVolunteers);
    setShelters(initialShelters);
    setAlerts(initialAlerts);
    localStorage.removeItem('resqnet_incidents');
    localStorage.removeItem('resqnet_resources');
    localStorage.removeItem('resqnet_volunteers');
    localStorage.removeItem('resqnet_shelters');
    localStorage.removeItem('resqnet_alerts');
    addToast({
      title: 'Data Reset',
      message: 'All system entities restored to initial mock demo dataset.',
      type: 'info'
    });
  };

  // Calculated Stats
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');
  const criticalIncidents = incidents.filter(i => i.severity === 'Critical' && i.status !== 'Resolved');
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved');
  const totalPeopleAffected = incidents.reduce((sum, i) => sum + (Number(i.affectedPeople) || 0), 0);

  const availableVolunteers = volunteers.filter(v => v.availability === 'Available');
  const onDutyVolunteers = volunteers.filter(v => v.availability === 'On Duty' || v.availability === 'Assigned');

  const totalShelterCapacity = shelters.reduce((sum, s) => sum + (Number(s.capacity) || 0), 0);
  const totalShelterOccupied = shelters.reduce((sum, s) => sum + (Number(s.occupied) || 0), 0);
  const totalShelterAvailable = shelters.reduce((sum, s) => sum + (Number(s.availableSpaces) || 0), 0);

  const totalResourcesCount = resources.reduce((sum, r) => sum + (Number(r.total) || 0), 0);
  const lowStockResources = resources.filter(r => r.status === 'Low Stock' || r.status === 'Out of Stock');

  const activeAlerts = alerts.filter(a => a.status === 'Active');

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentUser,
        login,
        logout,
        incidents,
        addIncident,
        updateIncident,
        updateIncidentStatus,
        deleteIncident,
        resources,
        addResource,
        updateResource,
        deleteResource,
        allocateResource,
        volunteers,
        addVolunteer,
        updateVolunteer,
        updateVolunteerStatus,
        deleteVolunteer,
        assignVolunteerToIncident,
        shelters,
        addShelter,
        updateShelter,
        deleteShelter,
        alerts,
        addAlert,
        updateAlert,
        toggleAlertStatus,
        deleteAlert,
        toasts,
        addToast,
        removeToast,
        resetToDemoData,
        // Stats
        stats: {
          totalIncidents: incidents.length,
          activeIncidents: activeIncidents.length,
          criticalIncidents: criticalIncidents.length,
          resolvedIncidents: resolvedIncidents.length,
          totalPeopleAffected,
          totalVolunteers: volunteers.length,
          availableVolunteers: availableVolunteers.length,
          onDutyVolunteers: onDutyVolunteers.length,
          totalShelters: shelters.length,
          totalShelterCapacity,
          totalShelterOccupied,
          totalShelterAvailable,
          totalResources: resources.length,
          totalResourcesCount,
          lowStockResources: lowStockResources.length,
          activeAlerts: activeAlerts.length,
        }
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
