import React from 'react';
import { Calendar, User, Clock, AlertCircle } from 'lucide-react';

export default function WardAppointments() {
    // Mock Appointments
    const appointments = [
        { id: 1, patient: 'Robert Fox', time: '11:00 AM', type: 'Physical Therapy', with: 'Dr. Sarah Jones', status: 'Confirmed' },
        { id: 2, patient: 'Esther Howard', time: '02:00 PM', type: 'Neurology Follow-up', with: 'Dr. Emily Chen', status: 'Confirmed' },
        { id: 3, patient: 'Jenny Wilson', time: '04:30 PM', type: 'MRI Scan', with: 'Radiology Dept', status: 'Pending Transport' },
    ];

    // Mock Change Requests - The "Requests for Change" Section
    const changeRequests = [
        { id: 1, patient: 'Esther Howard', request: 'Move PT to morning', reason: 'Pain worsening in evenings', time: '10 mins ago' },
    ];

    return (
        <div style={{ padding: '0 1rem', paddingBottom: '4rem' }}>
            <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h1>Ward Schedule</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Upcoming appointments and procedures for today.</p>
            </div>

            {/* Main Appointments Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {appointments.map(appt => (
                    <div key={appt.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                                <Clock size={16} /> {appt.time}
                            </div>
                            <span className="badge-blue" style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{appt.status}</span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{appt.type}</h3>
                        <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>with {appt.with}</div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                            <div style={{ width: '32px', height: '32px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.9rem', color: '#475569' }}>
                                {appt.patient.charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontWeight: 500, fontSize: '0.95rem' }}>{appt.patient}</div>
                                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Patient</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Change Requests Section */}
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                    <AlertCircle color="#be123c" size={24} />
                    <h2 style={{ fontSize: '1.25rem', color: '#881337', margin: 0 }}>Requests for Change</h2>
                </div>
                <p style={{ color: '#9f1239', marginBottom: '1.5rem' }}>The following patients have requested changes to their scheduled appointments.</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {changeRequests.map(req => (
                        <div key={req.id} style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #fda4af', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontWeight: 600, color: '#881337' }}>{req.patient}</div>
                                <div style={{ color: '#4c0519' }}>"{req.request}" • <span style={{ fontStyle: 'italic', color: '#9f1239' }}>{req.reason}</span></div>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button className="btn-outline" style={{ background: 'white', borderColor: '#fda4af', color: '#be123c', padding: '0.5rem 1rem', borderRadius: '6px' }}>Dismiss</button>
                                <button className="btn-primary" style={{ background: '#be123c', border: 'none', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px' }}>Review</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
