import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, Activity, Clock, ShieldCheck, Pill, Calendar, AlertTriangle, Heart, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_HISTORY, MOCK_PATIENTS } from '../utils/mockData';
import './PainMonitor.css';

// --- Sub-Components (ReadOnly Views of Patient Data) ---

const MedsListPartial = () => (
    <div className="glass-card monitor-sub-card">
        <div className="card-head">
            <Pill size={18} /> <span>Active Medications</span>
        </div>
        <table className="mini-table">
            <tbody>
                <tr><td>Aspirin (75mg)</td><td>Daily</td></tr>
                <tr><td>Atorvastatin (20mg)</td><td>Bedtime</td></tr>
                <tr><td>Metoprolol (50mg)</td><td>Twice Day</td></tr>
            </tbody>
        </table>
    </div>
);

const HistoryPartial = () => (
    <div className="glass-card monitor-sub-card">
        <div className="card-head">
            <FileText size={18} /> <span>Shift History</span>
        </div>
        <ul className="mini-list">
            <li>
                <strong>Jan 08, 14:20</strong>
                <span>Admitted to Ward A</span>
            </li>
            <li>
                <strong>Jan 07, 23:10</strong>
                <span>ER Observation</span>
            </li>
        </ul>
    </div>
);

const ApptsPartial = () => (
    <div className="glass-card monitor-sub-card">
        <div className="card-head">
            <Calendar size={18} /> <span>Daily Schedule</span>
        </div>
        <div className="mini-appt">
            <div className="date-box">12 <span>JAN</span></div>
            <div>
                <strong>Neuro Follow-up</strong>
                <div className="sub-text">Dr. Emily Chen</div>
            </div>
        </div>
    </div>
);

export default function PainMonitor() {
    const { id } = useParams();
    const patientular = MOCK_PATIENTS.find(p => p.id === id) || MOCK_PATIENTS[0];

    // Simulated Real-time Graph Data
    const [graphData, setGraphData] = useState(MOCK_HISTORY);

    return (
        <div className="monitor-page">
            <header className="monitor-header">
                <div className="header-left">
                    <h1>{patientular.name}</h1>
                    <div className="sub-details">
                        <span className="detail-chip">MRN: {patientular.id}</span>
                        <span className="detail-chip">Bed {patientular.bed}</span>
                        <span className="detail-chip">{patientular.age} Years</span>
                        <span className="detail-chip dx-tag">{patientular.diagnosis}</span>
                    </div>
                </div>
                <div className="header-actions">
                    <button className="btn-outline">Add Note</button>
                    <button className="btn-primary-sc">
                        <FileText size={16} /> Clinical Report
                    </button>
                </div>
            </header>

            {/* MAIN GRID LAYOUT: 2-COLUMN FOCUS */}
            <div className="monitor-grid">

                {/* LEFT COL: THE MONITOR (Primary Focus) */}
                <div className="monitor-left-panel">
                    <div className="glass-card live-card">
                        <div className="live-indicator">
                            <span className="pulse-dot"></span> Real-Time AI Analysis
                        </div>

                        {/* NEW: Vitals Strip */}
                        <div className="vitals-strip">
                            <div className="vital-item">
                                <div className="vital-label"><Heart size={14} color="#f43f5e" /> HR</div>
                                <div className="vital-value">72<span className="vital-unit">bpm</span></div>
                            </div>
                            <div className="vital-item">
                                <div className="vital-label"><Activity size={14} color="#0ea5e9" /> BP</div>
                                <div className="vital-value">120/80</div>
                            </div>
                            <div className="vital-item">
                                <div className="vital-label"><Zap size={14} color="#22c55e" /> SpO2</div>
                                <div className="vital-value">98<span className="vital-unit">%</span></div>
                            </div>
                            <div className="vital-item">
                                <div className="vital-label"><Activity size={14} color="#f59e0b" /> RR</div>
                                <div className="vital-value">16<span className="vital-unit">/min</span></div>
                            </div>
                        </div>

                        <div className="pain-dashboard-view">
                            <div className="pain-meter-large">
                                <span className="pain-score">
                                    {patientular.painLevel * 10}
                                    <span className="scale">/100</span>
                                </span>
                                <div className="pain-label">Continuous Monitoring: Moderate Discomfort</div>
                            </div>

                            <div className="trend-region">
                                <h3>Pain Intensity Trend (Last 12 Hours)</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={graphData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" hide />
                                        <YAxis domain={[0, 10]} hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="var(--color-primary)"
                                            strokeWidth={4}
                                            dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
                                            activeDot={{ r: 6, strokeWidth: 0 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="last-check-footer">
                            <Clock size={14} /> AI Analysis Sync Checklist: Facial tension (active), Micro-expressions (scanned).
                        </div>
                    </div>
                </div>

                {/* RIGHT COL: CONTEXT & ALERTS (Secondary Focus) */}
                <div className="monitor-right-panel">
                    <div className="glass-card alert-box">
                        <div className="alert-header">
                            <AlertTriangle size={18} /> Alert Priority
                        </div>
                        <div className="alert-item high">
                            <strong>High Pain Threshold</strong>
                            <span>10:25 AM - Confirmed</span>
                        </div>
                    </div>

                    <div className="dossier-section">
                        <div className="glass-card dossier-container">
                            <MedsListPartial />
                            <ApptsPartial />
                            <HistoryPartial />
                        </div>
                    </div>

                    <div className="action-panel">
                        <button className="btn-action">Log Intervention</button>
                        <button className="btn-action danger">Escalate Case</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
