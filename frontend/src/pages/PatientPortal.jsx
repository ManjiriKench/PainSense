import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Activity, Pill, Calendar, FileText, ShieldCheck,
    AlertCircle, User, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import './PatientPortal.css';

// Import sub-components
import MedicationsView from '../components/portal/MedicationsView';
import AppointmentsView from '../components/portal/AppointmentsView';
import HistoryView from '../components/portal/HistoryView';
import ConsentView from '../components/portal/ConsentView';
import ProfileView from '../components/portal/ProfileView';
import LiveMonitorView from '../components/portal/LiveMonitorView';

// --- MAIN LAYOUT COMPONENT ---
export default function PatientPortal() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('monitor');

    const MENU_ITEMS = [
        { id: 'monitor', label: 'Live Monitor', icon: Activity },
        { id: 'meds', label: 'Current Medication', icon: Pill },
        { id: 'appts', label: 'Appointments', icon: Calendar },
        { id: 'history', label: 'Medical History', icon: FileText },
        { id: 'consent', label: 'Consent & Info', icon: ShieldCheck },
        { id: 'sos', label: 'SOS / Emergency', icon: AlertCircle, isDanger: true },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const renderContent = () => {
        switch (activePage) {
            case 'monitor': return <LiveMonitorView />;
            case 'meds': return <MedicationsView />;
            case 'appts': return <AppointmentsView />;
            case 'history': return <HistoryView />;
            case 'consent': return <ConsentView />;
            case 'profile': return <ProfileView />;
            case 'sos': return (
                <div className="sos-container fade-in">
                    <div className="sos-card">
                        <div className="sos-icon-wrap">
                            <div className="sos-pulse-ring"></div>
                            <div className="sos-pulse-ring delay"></div>
                            <AlertCircle size={48} />
                        </div>
                        <h2>Emergency Alert</h2>
                        <p className="sos-subtitle">Immediate assistance will be dispatched to your location</p>

                        <div className="sos-info-grid">
                            <div className="sos-info-item">
                                <span className="info-label">Patient</span>
                                <span className="info-value">Robert Fox</span>
                            </div>
                            <div className="sos-info-item">
                                <span className="info-label">Room</span>
                                <span className="info-value">ICU-A 304</span>
                            </div>
                            <div className="sos-info-item">
                                <span className="info-label">Response Team</span>
                                <span className="info-value">Nursing Station 2</span>
                            </div>
                            <div className="sos-info-item">
                                <span className="info-label">Est. Response</span>
                                <span className="info-value highlight">&lt; 2 min</span>
                            </div>
                        </div>

                        <p className="sos-confirm-text">Are you sure you want to send an emergency alert?</p>

                        <div className="sos-actions">
                            <button className="btn-cancel" onClick={() => setActivePage('monitor')}>
                                Cancel
                            </button>
                            <button className="btn-confirm-sos">
                                <AlertCircle size={18} />
                                Send Alert Now
                            </button>
                        </div>

                        <p className="sos-disclaimer">
                            ⚠️ This is a prototype demonstration. No actual emergency services will be contacted.
                        </p>
                    </div>
                </div>
            );
            default: return <LiveMonitorView />;
        }
    };

    return (
        <div className="portal-layout">
            {/* Sidebar */}
            <aside className={`portal-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                <div className="sidebar-top">
                    <Link to="/" className="p-brand">
                        <Activity className="brand-icon" />
                        {sidebarOpen && <span>PainSense</span>}
                    </Link>
                    <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <div className="patient-snippet">
                    <div className="avatar">RF</div>
                    {sidebarOpen && <div className="p-details">
                        <strong>Robert Fox</strong>
                        <span>ID: 8829-11</span>
                    </div>}
                </div>

                <nav className="portal-menu">
                    {MENU_ITEMS.map(item => (
                        <button
                            key={item.id}
                            className={`menu-item ${activePage === item.id ? 'active' : ''} ${item.isDanger ? 'danger' : ''}`}
                            onClick={() => setActivePage(item.id)}
                        >
                            <item.icon size={20} />
                            {sidebarOpen && <span>{item.label}</span>}
                            {activePage === item.id && sidebarOpen && <ChevronRight className="arrow-indicator" size={16} />}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <Link to="/login" className="signout-btn">
                        <LogOut size={20} />
                        {sidebarOpen && <span>Sign Out</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="portal-main">
                <header className="portal-header">
                    <h2>{MENU_ITEMS.find(i => i.id === activePage)?.label}</h2>
                    <div className="header-status">
                        <span className="dot online"></span> System Online
                    </div>
                </header>
                <div className="content-scroll">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}