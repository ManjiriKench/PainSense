import React from 'react';
import { Routes, Route } from 'react-router-dom';

import HospitalShell from './components/layout/HospitalShell';
import PublicLayout from './components/layout/PublicLayout';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import PatientPortal from './pages/PatientPortal';

import Dashboard from './pages/Dashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import WardMedications from './pages/WardMedications';
import WardAppointments from './pages/WardAppointments';
import PainMonitor from './pages/PainMonitor';

import ProfileRouter from './components/ProfileRouter';
import RoleRedirect from './components/RoleRedirect';

function App() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Route>

      {/* PATIENT */}
      <Route path="/portal" element={<PatientPortal />} />

      {/* HOSPITAL SYSTEM */}
      <Route path="/app" element={<HospitalShell />}>
        <Route index element={<RoleRedirect />} />

        {/* NURSE */}
        <Route path="nurse" element={<Dashboard />} />
        <Route path="medications" element={<WardMedications />} />
        <Route path="appointments" element={<WardAppointments />} />
        <Route path="monitor/:id" element={<PainMonitor />} />

        {/* DOCTOR */}
        <Route path="doctor" element={<DoctorDashboard />} />

        {/* PROFILE (ROLE AWARE) */}
        <Route path="profile" element={<ProfileRouter />} />
      </Route>
    </Routes>
  );
}

export default App;
