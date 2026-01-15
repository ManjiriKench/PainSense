import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HospitalShell from './components/layout/HospitalShell';
import Dashboard from './pages/Dashboard';
import PainMonitor from './pages/PainMonitor';
import WardMedications from './pages/WardMedications';
import WardAppointments from './pages/WardAppointments';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PatientPortal from './pages/PatientPortal';

import PublicLayout from './components/layout/PublicLayout';

function App() {
  return (
    <Routes>
      {/* Public Routes (Wrapped in Layout) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Route>

      {/* Patient Portal (Converted to bedside mode) */}
      <Route path="/portal" element={<PatientPortal />} />

      {/* Hospital System (Protected) */}
      <Route path="/app" element={<HospitalShell />}>
        <Route index element={<Dashboard />} />
        <Route path="medications" element={<WardMedications />} />
        <Route path="appointments" element={<WardAppointments />} />
        <Route path="monitor/:id" element={<PainMonitor />} />
      </Route>
    </Routes>
  );
}

export default App;
