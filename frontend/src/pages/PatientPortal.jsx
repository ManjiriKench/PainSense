import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Link } from 'react-router-dom';
import {
    Activity, Pill, Calendar, Clock, FileText, ShieldCheck,
    AlertCircle, User, LogOut, Menu, X, Play, StopCircle,
    CheckCircle, ChevronRight, Info, Heart, Zap,
    // Added new icons for the premium Consent View
    Shield, Phone, Download, CheckCircle2, Users, AlertTriangle
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './PatientPortal.css';

// --- SUB-COMPONENTS FOR DUMMY PAGES ---

const MedicationsView = () => (
    <div className="portal-card">
        <h3>Current Medications</h3>
        <table className="med-table">
            <thead>
                <tr><th>Medicine</th><th>Dosage</th><th>Timing</th><th>Status</th></tr>
            </thead>
            <tbody>
                <tr><td>Aspirin</td><td>75mg</td><td>Once daily (Morning)</td><td><span className="badge-active">Active</span></td></tr>
                <tr><td>Atorvastatin</td><td>20mg</td><td>Bedtime</td><td><span className="badge-active">Active</span></td></tr>
                <tr><td>Metoprolol</td><td>50mg</td><td>Twice daily</td><td><span className="badge-active">Active</span></td></tr>
            </tbody>
        </table>
    </div>
);

const AppointmentsView = () => (
    <div className="portal-card">
        <h3>Upcoming Appointments</h3>
        <div className="appt-card">
            <div className="appt-date">
                <span className="day">12</span>
                <span className="month">JAN</span>
            </div>
            <div className="appt-info">
                <h4>Neurology Follow-up</h4>
                <p>Dr. Emily Chen • Dept of Neurology</p>
            </div>
            <span className="badge-blue">Confirmed</span>
        </div>
        <div className="appt-card">
            <div className="appt-date">
                <span className="day">15</span>
                <span className="month">JAN</span>
            </div>
            <div className="appt-info">
                <h4>Physical Therapy</h4>
                <p>Sarah Jones • Rehabilitation Center</p>
            </div>
            <span className="badge-blue">Confirmed</span>
        </div>

        <div className="request-appt-section" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <h3>Request Change of Appointment</h3>
            <form className="request-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-group">
                    <label>Reason for Request</label>
                    <select>
                        <option>Pain worsening</option>
                        <option>Side effects from medication</option>
                        <option>New symptoms</option>
                        <option>General inquiry</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Additional Details</label>
                    <textarea placeholder="Please describe your concern briefly..." rows={4}></textarea>
                </div>
                <button className="btn-primary">Submit Request</button>
            </form>
        </div>
    </div>
);

const HistoryView = () => (
    <div className="portal-card">
        <h3>Medical History</h3>
        <div className="timeline">
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <h4>Admitted to ICU-A</h4>
                    <span className="date">Jan 08, 2026</span>
                    <p>Post-operative recovery monitoring initiated.</p>
                </div>
            </div>
            <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                    <h4>Ergency Admission</h4>
                    <span className="date">Jan 07, 2026</span>
                    <p>Admitted via ER for acute chest pain and shortness of breath.</p>
                </div>
            </div>
        </div>
    </div>
);

// --- UPDATED PREMIUM CONSENT VIEW ---
const ConsentView = () => (
    <div className="portal-card consent-card premium">

        {/* HEADER */}
        <div className="consent-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield className="w-5 h-5" size={20} color="#166534" />
                <h3>Consent & Information</h3>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="btn-disabled" style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Download size={14} /> PDF
                </button>
                <span className="consent-status success">Consent Granted</span>
            </div>
        </div>

        {/* CONSENT STATUS */}
        <div className="consent-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Activity size={16} color="#64748b" />
                <h4 style={{ marginBottom: 0 }}>Consent Status</h4>
            </div>

            <div className="details-grid">
                <div>
                    <label>Consent Type</label>
                    <span>Non-invasive pain monitoring</span>
                </div>
                <div>
                    <label>Consent Date</label>
                    <span>02 Feb 2026</span>
                </div>
                <div>
                    <label>Monitoring Scope</label>
                    <span>During active clinical sessions only</span>
                </div>
                <div>
                    <label>Authorized By</label>
                    <span>Robert Fox (Self)</span>
                </div>
            </div>

            <p className="helper-text">
                You have provided consent for facial-expression–based pain monitoring as part of your clinical care.
            </p>
        </div>

        {/* DATA USAGE & PRIVACY */}
        <div className="consent-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Shield size={16} color="#64748b" />
                <h4 style={{ marginBottom: 0 }}>Data Usage & Privacy</h4>
            </div>

            <ul className="info-list">
                <li>Camera input is used only during active monitoring</li>
                <li>No continuous recording when monitoring is stopped</li>
                <li>Data is processed locally on the device (Edge Computing)</li>
                <li>No data is shared without explicit authorization</li>
                <li>No personal data is used for diagnosis without doctor review</li>
            </ul>

            <p className="helper-text subtle">
                This system follows a privacy-first, edge-based design compliant with hospital policy.
            </p>
        </div>

        {/* EMERGENCY CONTACT INFORMATION */}
        <div className="consent-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Phone size={16} color="#64748b" />
                <h4 style={{ marginBottom: 0 }}>Emergency Contact Information</h4>
            </div>

            <div className="emergency-card">
                <div className="emergency-avatar">RS</div>
                <div className="emergency-info">
                    <strong>Mathew Fox</strong>
                    <span className="relation">Father • Primary Contact</span>
                    <span className="phone">+1 (555) 893-2214</span>
                </div>
            </div>

            <div className="emergency-card secondary">
                <div className="emergency-avatar" style={{ background: 'linear-gradient(135deg, #cbd5e1, #94a3b8)' }}>AS</div>
                <div className="emergency-info">
                    <strong>Lily Fox</strong>
                    <span className="relation">Mother • Secondary Contact</span>
                    <span className="phone">+1 (555) 893-2214</span>
                </div>
            </div>

            <button className="btn-disabled" disabled>
                Request Update
            </button>
        </div>

        {/* AUTHORIZED CAREGIVER INFO */}
        <div className="consent-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Users size={16} color="#64748b" />
                <h4 style={{ marginBottom: 0 }}>Authorized Caregiver Information</h4>
            </div>

            <ul className="info-list">
                <li>Authorized caregivers may receive updates related to abnormal pain patterns</li>
                <li>Information shared is limited to care-related alerts</li>
                <li>Access is provided as per hospital policy</li>
            </ul>

            <p className="helper-text">
                Caregiver access is managed by the hospital and clinical staff.
            </p>
        </div>

        {/* MONITORING SCOPE & LIMITATIONS */}
        <div className="consent-section warning">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <AlertTriangle size={16} color="#b45309" />
                <h4 style={{ marginBottom: 0, color: '#92400e' }}>Monitoring Scope & Limitations</h4>
            </div>

            <ul className="info-list">
                <li>PainSense is a decision-support system, not a diagnostic tool</li>
                <li>It does not diagnose medical conditions autonomously</li>
                <li>Final clinical decisions are always made by healthcare professionals</li>
                <li>Monitoring is session-based, not continuous by default</li>
            </ul>

            <p className="important-note">
                PainSense supports clinicians by providing additional insights, not medical decisions.
            </p>
        </div>

        {/* CONSENT HISTORY */}
        <div className="consent-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <Clock size={16} color="#64748b" />
                <h4 style={{ marginBottom: 0 }}>Consent History</h4>
            </div>

            <ul className="history-list">
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={16} color="#16a34a" />
                    <span>
                        <strong>02 Feb 2026</strong> — Pain monitoring consent — <span className="status-active">Active</span>
                    </span>
                </li>
            </ul>

            <p className="helper-text subtle">
                Displayed for demonstration purposes only.
            </p>
        </div>

        {/* PATIENT RIGHTS */}
        <div className="consent-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <FileText size={16} color="#64748b" />
                <h4 style={{ marginBottom: 0 }}>Patient Rights & Choices</h4>
            </div>

            <ul className="info-list">
                <li>You may request to pause or stop monitoring at any time</li>
                <li>You can ask questions about how your data is used</li>
                <li>You may request changes to consent through hospital staff</li>
            </ul>

            <p className="helper-text">
                For any concerns, please contact the healthcare team.
            </p>
        </div>

        {/* DISCLAIMER */}
        <p className="ethics-note">
            This section is part of a prototype developed for demonstration purposes and does not represent a legally binding consent document.
        </p>
    </div>
);


const ProfileView = () => (
    <div className="portal-card profile-card premium">
        <div className="profile-top">
            <div className="profile-photo icon">
                <User size={42} />
            </div>

            <div className="profile-main">
                <h3>Robert Fox</h3>
                <span className="profile-id">Patient ID • MRN 8829-11</span>

                <div className="profile-badges">
                    <span className="badge soft-blue">Male</span>
                    <span className="badge soft-red">Blood O+</span>
                    <span className="badge soft-yellow">Moderate Risk</span>
                </div>
            </div>
        </div>

        <div className="profile-sections">
            <div className="profile-section">
                <h4>Personal Information</h4>
                <div className="details-grid">
                    <div>
                        <label>Date of Birth</label>
                        <span>Dec 12, 1958 (67 years)</span>
                    </div>
                    <div>
                        <label>Contact</label>
                        <span>+1 (555) 893-2214</span>
                    </div>
                </div>
            </div>

            <div className="profile-section">
                <h4>Address</h4>
                <p className="address-box">
                    4517 Washington Ave<br />
                    Manchester, KY, United States
                </p>
            </div>

            <div className="profile-section">
                <h4>Medical Summary</h4>
                <div className="details-grid">
                    <div>
                        <label>Primary Condition</label>
                        <span>Post-operative Recovery</span>
                    </div>
                    <div>
                        <label>Allergies</label>
                        <span className="danger-text">Penicillin</span>
                    </div>
                    <div>
                        <label>Physician</label>
                        <span>Dr. Emily Chen</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


const LiveMonitorView = () => {
    const webcamRef = useRef(null);
    const [monitoring, setMonitoring] = useState(false);
    const [score, setScore] = useState(0);
    const [data, setData] = useState([]);

    useEffect(() => {
        let interval;
        if (monitoring) {
            interval = setInterval(() => {
                const fluctuation = Math.floor(Math.random() * 8) - 3;
                setScore(prev => Math.max(0, Math.min(100, prev + fluctuation)));
                setData(prev => {
                    const next = [...prev, { v: score }];
                    if (next.length > 20) next.shift();
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [monitoring, score]);

    const getStatus = (s) => {
        if (!monitoring) return { text: "System Standby", color: "#94a3b8" };
        if (s < 30) return { text: "Comfortable", color: "var(--color-success)" };
        if (s < 60) return { text: "Mild Discomfort", color: "var(--color-warning)" };
        return { text: "Pain Detected", color: "var(--color-danger)" };
    }
    const status = getStatus(score);

    return (
        <div className="monitor-split">
            {/* LEFT: WEBCAM */}
            <div className="monitor-left">
                <div className="cam-container">
                    {monitoring ? (
                        <>
                            <Webcam ref={webcamRef} className="webcam-feed" audio={false} screenshotFormat="image/jpeg" />
                            <div className="ai-overlay">
                                <div className="scan-line"></div>
                                <span className="ai-tag">Analyzing Facial Micro-Expressions...</span>
                            </div>
                        </>
                    ) : (
                        <div className="cam-placeholder">
                            <Activity size={48} color="#cbd5e1" />
                            <p>Camera is currently inactive</p>
                            <small>Press Start to begin your assessment</small>
                        </div>
                    )}
                </div>
                <div className="monitor-controls">
                    {!monitoring ? (
                        <button className="btn-start-large" onClick={() => setMonitoring(true)}>
                            <Play size={20} fill="currentColor" /> Start Monitoring
                        </button>
                    ) : (
                        <div className="active-monitor-info">
                            <div className="vitals-panel-portal">
                                <div className="p-vital">
                                    <Heart size={16} color="#f43f5e" />
                                    <div className="v-data">
                                        <span className="v-label">Heart Rate</span>
                                        <span className="v-val">74 <small>bpm</small></span>
                                    </div>
                                </div>
                                <div className="p-vital">
                                    <Activity size={16} color="#0ea5e9" />
                                    <div className="v-data">
                                        <span className="v-label">Blood Pressure</span>
                                        <span className="v-val">118/79</span>
                                    </div>
                                </div>
                                <div className="p-vital">
                                    <Zap size={16} color="#22c55e" />
                                    <div className="v-data">
                                        <span className="v-label">Oxygen (SpO2)</span>
                                        <span className="v-val">99%</span>
                                    </div>
                                </div>
                            </div>
                            <button className="btn-stop-large-mini" onClick={() => setMonitoring(false)}>
                                Stop Monitoring
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: RESULTS */}
            <div className="monitor-right">
                <div className="result-card">
                    <h4>Current Pain Level</h4>
                    <div className="gauge-container" style={{ borderColor: status.color }}>
                        <div className="gauge-value" style={{ color: status.color }}>{monitoring ? score : '--'}</div>
                        <div className="gauge-label">scale 0-100</div>
                    </div>
                    <div className="status-pill" style={{ backgroundColor: status.color + '20', color: status.color }}>
                        {status.text}
                    </div>
                    {monitoring && <p className="ai-note"><Info size={14} /> Facial tension consistent with {score > 50 ? 'discomfort' : 'relaxation'}.</p>}
                </div>

                <div className="mini-graph">
                    <h6>Session Trend</h6>
                    <ResponsiveContainer width="100%" height={100}>
                        <LineChart data={data}>
                            <Line type="monotone" dataKey="v" stroke="var(--color-primary)" dot={false} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};


// --- MAIN LAYOUT COMPONENT ---

export default function PatientPortal() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activePage, setActivePage] = useState('monitor');
    const [showSOS, setShowSOS] = useState(false);

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
                <div className="sos-screen">
                    <AlertCircle size={64} color="var(--color-pain-high)" />
                    <h2>Emergency Alert Protocol</h2>
                    <p>Are you sure you want to alert the nursing station?</p>
                    <p className="sos-disclaimer">This is a prototype demo. No real ambulance will be called.</p>
                    <div className="sos-actions">
                        <button className="btn-cancel" onClick={() => setActivePage('monitor')}>Cancel</button>
                        <button className="btn-confirm-sos">Confirm Alert</button>
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
                    <div className="p-brand">
                        <Activity className="brand-icon" />
                        {sidebarOpen && <span>PainSense</span>}
                    </div>
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