import React from 'react';
import { Outlet, NavLink, useLocation, Link } from 'react-router-dom';
import {
    LayoutGrid,
    Activity,
    Bell,
    Menu,
    UserCircle,
    Pill,
    Calendar,
    LogOut,
    User
} from 'lucide-react';
import './HospitalShell.css';

const SidebarItem = ({ to, icon: Icon, label, isAction }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `sidebar-item ${isActive ? 'active' : ''} ${isAction ? 'sidebar-action' : ''}`
        }
    >
        <Icon size={20} />
        <span>{label}</span>
    </NavLink>
);

export default function HospitalShell() {
    const location = useLocation();
    const role = localStorage.getItem('role'); // 'nurse' | 'doctor'

    if (!role) {
        window.location.href = '/login';
        return null;
    }

    const getPageTitle = () => {
        if (location.pathname.startsWith('/app/doctor'))
            return 'Doctor Dashboard – PainSense';

        if (location.pathname.startsWith('/app/nurse'))
            return 'Ward Dashboard > ICU Block A';

        if (location.pathname.includes('medications'))
            return 'Ward Medications > Unit A';

        if (location.pathname.includes('appointments'))
            return 'Ward Appointments';

        if (location.pathname.includes('profile'))
            return role === 'doctor'
                ? 'Doctor Profile'
                : 'Staff Profile';

        return 'System Overview';
    };

    return (
        <div className="app-shell">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <Link to="/" className="sidebar-header">
                    <div className="logo-icon">
                        <Activity color="white" />
                    </div>
                    <div className="logo-text">PainSense</div>
                </Link>

                <nav className="sidebar-nav">
                    {/* NURSE NAV */}
                    {role === 'nurse' && (
                        <div className="nav-group fade-in-up delay-1">
                            <label>WARD UNIT A</label>
                            <SidebarItem to="/app/nurse" icon={LayoutGrid} label="Ward Dashboard" />
                            <SidebarItem to="/app/medications" icon={Pill} label="Medications" />
                            <SidebarItem to="/app/appointments" icon={Calendar} label="Appointments" />
                        </div>
                    )}

                    {/* DOCTOR NAV */}
                    {role === 'doctor' && (
                        <div className="nav-group fade-in-up delay-1">
                            <label>DOCTOR</label>
                            <SidebarItem to="/app/doctor" icon={Activity} label="Doctor Dashboard" />
                        </div>
                    )}

                    {/* ACCOUNT */}
                    <div className="nav-group fade-in-up delay-2" style={{ marginTop: 'auto' }}>
                        <label>ACCOUNT</label>
                        <SidebarItem to="/app/profile" icon={User} label="Profile" />
                        <NavLink
                            to="/login"
                            className="sidebar-item sidebar-action"
                            onClick={() => {
                                localStorage.removeItem('role');
                            }}
                        >
                            <LogOut size={20} />
                            <span>Sign Out</span>
                        </NavLink>
                    </div>
                </nav>

                <div className="sidebar-footer fade-in-up delay-3">
                    <div className="status-indicator online"></div>
                    <span>System Online: v0.1.0-alpha</span>
                </div>
            </aside>

            {/* MAIN */}
            <div className="main-wrapper">
                <header className="top-header">
                    <div className="header-left">
                        <button className="menu-btn">
                            <Menu size={20} />
                        </button>
                        <h2 className="page-title">{getPageTitle()}</h2>
                    </div>

                    <div className="header-right">
                        <div className="time-display">
                            {new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </div>
                        <button className="icon-btn">
                            <Bell size={20} />
                        </button>
                        <div className="user-profile">
                            <UserCircle size={24} />
                            <span>
                                {role === 'doctor'
                                    ? 'Dr. Amit Verma'
                                    : 'Nurse Sarah J. (RN)'}
                            </span>
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