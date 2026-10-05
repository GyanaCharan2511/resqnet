import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/Toast';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { Incidents } from './pages/Incidents';
import { ReportIncident } from './pages/ReportIncident';
import { EmergencyMap } from './pages/EmergencyMap';
import { Resources } from './pages/Resources';
import { Volunteers } from './pages/Volunteers';
import { ReliefCenters } from './pages/ReliefCenters';
import { Alerts } from './pages/Alerts';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

// Dashboard Layout wrapper for pages with sidebar
const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />
      <main className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-8 transition-colors">
        {children}
      </main>
    </div>
  );
};

// Full width layout for landing, auth, report, map
const StandardLayout = ({ children }) => {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-50 dark:bg-slate-950 pb-16 md:pb-0 transition-colors">
      {children}
    </main>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isLandingOrAuth = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors selection:bg-blue-600 selection:text-white">
      <Navbar />

      <Routes>
        {/* Landing & Authentication */}
        <Route path="/" element={<StandardLayout><Home /></StandardLayout>} />
        <Route path="/login" element={<StandardLayout><Login /></StandardLayout>} />
        <Route path="/register" element={<StandardLayout><Register /></StandardLayout>} />

        {/* Public Action / GIS Map */}
        <Route path="/report" element={<StandardLayout><ReportIncident /></StandardLayout>} />
        <Route path="/map" element={<StandardLayout><EmergencyMap /></StandardLayout>} />

        {/* Dashboards */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/citizen" element={<DashboardLayout><CitizenDashboard /></DashboardLayout>} />
        <Route path="/volunteer" element={<DashboardLayout><VolunteerDashboard /></DashboardLayout>} />

        {/* Operations Modules */}
        <Route path="/incidents" element={<DashboardLayout><Incidents /></DashboardLayout>} />
        <Route path="/resources" element={<DashboardLayout><Resources /></DashboardLayout>} />
        <Route path="/volunteers" element={<DashboardLayout><Volunteers /></DashboardLayout>} />
        <Route path="/shelters" element={<DashboardLayout><ReliefCenters /></DashboardLayout>} />
        <Route path="/alerts" element={<DashboardLayout><Alerts /></DashboardLayout>} />
        <Route path="/analytics" element={<DashboardLayout><Analytics /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />

        {/* Fallback */}
        <Route path="*" element={<StandardLayout><Home /></StandardLayout>} />
      </Routes>

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Mobile Bottom Navigation Bar */}
      {!isLandingOrAuth && <MobileNav />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}
