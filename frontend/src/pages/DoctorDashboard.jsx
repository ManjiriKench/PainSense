import React, { useState } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Activity, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import './DoctorDashboard.css';

const patients = [
    { id: 1, name: 'Robert Fox', bed: 'ICU-12', pain: 'high', score: 78, trend: 'up', status: 'Active', updated: '2m' },
    { id: 2, name: 'Alice Brown', bed: 'ICU-08', pain: 'mild', score: 42, trend: 'stable', status: 'Active', updated: '5m' },
    { id: 3, name: 'David Lin', bed: 'ICU-05', pain: 'none', score: 12, trend: 'down', status: 'Paused', updated: '1m' }
];

export default function DoctorDashboard() {
    const [selected, setSelected] = useState(patients[0]);

    return (
        <div className="doctor-dashboard">
            {/* Header */}
            <header className="doctor-header">
                <div>
                    <h3>Doctor Dashboard</h3>
                    <span className="doctor-info"><Link to="/" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold' }}>PainSense</Link> v2.1 • Connected</span>
                </div>
                <div className="doctor-meta">
                    <span className="doctor-name">Dr. Amit Verma</span>
                    <span className="doctor-info">ICU Block A • Morning Shift</span>
                </div>
            </header>

            {/* Metrics */}
            <div className="ward-overview">
                <div className="ward-card">
                    <div className="metric-value">12</div>
                    <div className="metric-label">Total Patients</div>
                </div>
                <div className="ward-card">
                    <div className="metric-value" style={{ color: '#ef4444' }}>3</div>
                    <div className="metric-label">High Pain Intensity</div>
                </div>
                <div className="ward-card">
                    <div className="metric-value">2</div>
                    <div className="metric-label">Monitoring Paused</div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="doctor-grid">

                {/* Patient List */}
                <div className="panel">
                    <div className="panel-header">
                        <h4>Priority Attention</h4>
                        <div className="badge none" style={{ background: '#f1f5f9', color: '#64748b' }}>Live Feed</div>
                    </div>

                    <div className="patient-list">
                        {patients.map(p => (
                            <div
                                key={p.id}
                                className={`patient-card ${p.pain} ${selected.id === p.id ? 'selected' : ''}`}
                                onClick={() => setSelected(p)}
                            >
                                <div className="p-info">
                                    <h5>{p.name}</h5>
                                    <span>{p.bed}</span>
                                </div>
                                <div>
                                    <span className={`badge ${p.pain}`}>{p.pain} risk</span>
                                </div>
                                <div className="p-actions">
                                    <button className="btn-xs btn-dark">View</button>
                                    <button className="btn-xs btn-light">Ack</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts Panel */}
                <div className="panel">
                    <div className="panel-header">
                        <h4>System Alerts</h4>
                        <Bell size={18} color="#64748b" />
                    </div>
                    <div>
                        <div className="alert-row">
                            <AlertTriangle size={18} />
                            <span>High Pain – Bed 12</span>
                        </div>
                        <div className="alert-row">
                            <AlertTriangle size={18} />
                            <span>Sensor Disconnected – Bed 8</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Snapshot */}
            <div className="snapshot">
                <div className="snap-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h4>Snapshot: {selected.name}</h4>
                        <span className={`badge ${selected.pain}`}>{selected.pain}</span>
                    </div>
                    <span className="doctor-info">Last updated: {selected.updated} ago</span>
                </div>
                <div className="snap-grid">
                    <div className="stat-box">
                        <label>Pain Score</label>
                        <div className="value">{selected.score} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 400 }}>/100</span></div>
                    </div>
                    <div className="stat-box">
                        <label>Trend</label>
                        <div className="value">
                            {selected.trend === 'up' && <TrendingUp size={20} color="#ef4444" />}
                            {selected.trend === 'down' && <TrendingDown size={20} color="#10b981" />}
                            {selected.trend === 'stable' && <Minus size={20} color="#f59e0b" />}
                            {selected.trend.charAt(0).toUpperCase() + selected.trend.slice(1)}
                        </div>
                    </div>
                    <div className="stat-box">
                        <label>Analysis</label>
                        <div className="value" style={{ fontSize: '1.1rem' }}>
                            {selected.pain === 'high' ? 'Consistently High' : 'Stable Condition'}
                        </div>
                    </div>
                    <div className="stat-box">
                        <label>Status</label>
                        <div className="value" style={{ fontSize: '1rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Activity size={18} color="#64748b" />
                            {selected.status}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}