import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Activity, Clock, Pill, Calendar, AlertTriangle, Heart, Zap, MoreHorizontal } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_HISTORY, MOCK_PATIENTS } from '../utils/mockData';
import './PainMonitor.css';

// --- ANIMATION HELPER ---
const Reveal = ({ children, delay = 0, className = "" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => ref.current && observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

// --- SUB-COMPONENTS (READ-ONLY) ---

const MedsListPartial = () => (
    <div className="monitor-sub-card">
        <div className="card-head">
            <div className="icon-box"><Pill size={16} /></div>
            <span>Active Medications</span>
        </div>
        <table className="mini-table">
            <tbody>
                <tr>
                    <td><strong>Aspirin</strong> <span className="dose-tag">75mg</span></td>
                    <td>Daily</td>
                </tr>
                <tr>
                    <td><strong>Atorvastatin</strong> <span className="dose-tag">20mg</span></td>
                    <td>Bedtime</td>
                </tr>
                <tr>
                    <td><strong>Metoprolol</strong> <span className="dose-tag">50mg</span></td>
                    <td>Twice Day</td>
                </tr>
            </tbody>
        </table>
    </div>
);

const HistoryPartial = () => (
    <div className="monitor-sub-card">
        <div className="card-head">
            <div className="icon-box"><FileText size={16} /></div>
            <span>Shift History</span>
        </div>
        <ul className="mini-list">
            <li>
                <span className="history-time">Jan 08, 14:20</span>
                <strong>Admitted to Ward A</strong>
                <span className="history-meta">Dr. V. Sharma</span>
            </li>
            <li>
                <span className="history-time">Jan 07, 23:10</span>
                <strong>ER Observation</strong>
                <span className="history-meta">Vital signs stable</span>
            </li>
        </ul>
    </div>
);

const ApptsPartial = () => (
    <div className="monitor-sub-card">
        <div className="card-head">
            <div className="icon-box"><Calendar size={16} /></div>
            <span>Daily Schedule</span>
        </div>
        <div className="mini-appt">
            <div className="date-box">
                12 <span>JAN</span>
            </div>
            <div className="appt-details">
                <strong>Neuro Follow-up</strong>
                <div className="sub-text">Dr. Emily Chen • 10:00 AM</div>
            </div>
        </div>
    </div>
);

export default function PainMonitor() {
    const { id } = useParams();
    const patientular = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];
    const [graphData] = useState(MOCK_HISTORY);

    return (
        <div className="monitor-page">

            {/* Header */}
            <Reveal>
                <header className="monitor-header">
                    <div className="header-left">
                        <div className="patient-avatar-large">
                            {patientular.name.charAt(0)}
                        </div>
                        <div>
                            <h1>{patientular.name}</h1>
                            <div className="sub-details">
                                <span className="detail-item">MRN: <strong>{patientular.id}</strong></span>
                                <span className="dot-divider">•</span>
                                <span className="detail-item">Bed <strong>{patientular.bed}</strong></span>
                                <span className="dot-divider">•</span>
                                <span className="detail-item">{patientular.age} Years</span>
                                <span className="dx-pill">{patientular.diagnosis}</span>
                            </div>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="btn-outline">Add Clinical Note</button>
                        <button className="btn-primary-sc">
                            <FileText size={18} /> Generate Report
                        </button>
                    </div>
                </header>
            </Reveal>

            {/* Main Grid */}
            <div className="monitor-grid">

                {/* LEFT COL: LIVE METRICS */}
                <div className="monitor-left-panel">
                    <Reveal delay={100} className="h-full">
                        <div className="glass-card live-card h-full">
                            <div className="live-header">
                                <div className="live-indicator">
                                    <span className="pulse-dot"></span> Live Analysis
                                </div>
                                <button className="icon-btn-ghost"><MoreHorizontal size={20} /></button>
                            </div>

                            {/* Vitals Strip */}
                            <div className="vitals-strip">
                                <div className="vital-item">
                                    <div className="vital-label"><Heart size={14} color="#f43f5e" /> HR</div>
                                    <div className="vital-value">72 <span className="vital-unit">bpm</span></div>
                                </div>
                                <div className="vital-divider"></div>
                                <div className="vital-item">
                                    <div className="vital-label"><Activity size={14} color="#0ea5e9" /> BP</div>
                                    <div className="vital-value">120/80</div>
                                </div>
                                <div className="vital-divider"></div>
                                <div className="vital-item">
                                    <div className="vital-label"><Zap size={14} color="#22c55e" /> SpO2</div>
                                    <div className="vital-value">98 <span className="vital-unit">%</span></div>
                                </div>
                                <div className="vital-divider"></div>
                                <div className="vital-item">
                                    <div className="vital-label"><Activity size={14} color="#f59e0b" /> RR</div>
                                    <div className="vital-value">16 <span className="vital-unit">/min</span></div>
                                </div>
                            </div>

                            <div className="pain-dashboard-view">
                                <div className="pain-meter-large">
                                    <div className="pain-ring">
                                        <span className="pain-score">
                                            {patientular.painLevel * 10}
                                        </span>
                                        <span className="scale-label">Pain Index</span>
                                    </div>
                                    <div className="pain-context">
                                        <div className="pain-status-badge moderate">Moderate Discomfort</div>
                                        <p>Facial grimacing detected. Vitals are stable.</p>
                                    </div>
                                </div>

                                <div className="trend-region">
                                    <div className="trend-header">
                                        <h3>Intensity Trend (12h)</h3>
                                        <div className="trend-legend">
                                            <span className="legend-dot"></span> Real-time
                                        </div>
                                    </div>
                                    <div style={{ width: '100%', height: 220 }}>
                                        <ResponsiveContainer>
                                            <LineChart data={graphData}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#0f766e" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#0f766e" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis dataKey="time" hide />
                                                <YAxis domain={[0, 10]} hide />
                                                <Tooltip
                                                    contentStyle={{
                                                        borderRadius: '12px', border: 'none',
                                                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                        fontSize: '0.85rem'
                                                    }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="var(--color-primary)"
                                                    strokeWidth={3}
                                                    dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            <div className="last-check-footer">
                                <div className="check-item success">
                                    <Clock size={14} /> Synced 2m ago
                                </div>
                                <div className="check-item">
                                    AI Model v2.1 Active
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

                {/* RIGHT COL: ALERTS & DOSSIER */}
                <div className="monitor-right-panel">
                    <Reveal delay={200}>
                        <div className="glass-card alert-box">
                            <div className="alert-header">
                                <div className="alert-icon-box"><AlertTriangle size={18} /></div>
                                <span>Active Alerts</span>
                            </div>
                            <div className="alert-item high">
                                <div className="alert-content">
                                    <strong>High Pain Threshold</strong>
                                    <span>10:25 AM • Sustained &gt; 7</span>
                                </div>
                                <button className="btn-ack">Ack</button>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal delay={300}>
                        <div className="glass-card dossier-container">
                            <MedsListPartial />
                            <div className="card-divider"></div>
                            <ApptsPartial />
                            <div className="card-divider"></div>
                            <HistoryPartial />
                        </div>
                    </Reveal>

                    <Reveal delay={400}>
                        <div className="action-panel">
                            <button className="btn-action primary">Log Intervention</button>
                            <button className="btn-action danger">Escalate Case</button>
                        </div>
                    </Reveal>
                </div>
            </div>
        </div>
    );
}