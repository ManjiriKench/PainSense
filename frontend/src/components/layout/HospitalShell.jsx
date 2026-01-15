import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, Activity, FileText, Settings, Bell, Menu, UserCircle, Pill, Calendar, LogOut, User } from 'lucide-react';
import './HospitalShell.css';

const SidebarItem = ({ to, icon: Icon, label, isAction }) => (
    <NavLink
        to={to}
        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''} ${isAction ? 'sidebar-action' : ''}`}
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

export default function HospitalShell() {
    const location = useLocation();

    // Mock "Current Context" based on route
    const getPageTitle = () => {
        if (location.pathname.includes('monitor')) return 'Patient Monitor > ICU-A-04';
        if (location.pathname.includes('medications')) return 'Ward Medications > Unit A';
        if (location.pathname.includes('appointments')) return 'Ward Appointments';
        if (location.pathname === '/app' || location.pathname === '/app/') return 'Ward Dashboard > ICU Block A';
        if (location.pathname.includes('profile')) return 'Staff Profile > Sarah J.';
        return 'System Overview';
    };

    return (
        <div className="app-shell">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="logo-icon"><Activity color="white" /></div>
                    <div className="logo-text">PainSense</div>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-group">
                        <label>WARD UNIT A</label>
                        <SidebarItem to="/app" icon={LayoutGrid} label="Ward Dashboard" />
                        <SidebarItem to="/app/medications" icon={Pill} label="Medications" />
                        <SidebarItem to="/app/appointments" icon={Calendar} label="Appointments" />
                    </div>

                    <div className="nav-group" style={{ marginTop: 'auto' }}>
                        <label>ACCOUNT</label>
                        <SidebarItem to="/app/profile" icon={User} label="Profile" />
                        <SidebarItem to="/login" icon={LogOut} label="Sign Out" isAction />
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div className="status-indicator online"></div>
                    <span>System Online: v0.1.0-alpha</span>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-wrapper">
                <header className="top-header">
                    <div className="header-left">
                        <button className="menu-btn"><Menu size={20} /></button>
                        <h2 className="page-title">{getPageTitle()}</h2>
                    </div>

                    <div className="header-right">
                        <div className="time-display">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <button className="icon-btn"><Bell size={20} /></button>
                        <div className="user-profile">
                            <UserCircle size={24} />
                            <span>Nurse Sarah J. (RN)</span>
                        </div>
                    </div>
                </header>

                <main className="content-area">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
