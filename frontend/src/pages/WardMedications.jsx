import React from 'react';
import { Pill, AlertCircle, CheckCircle } from 'lucide-react';
import { MOCK_PATIENTS } from '../utils/mockData';

export default function WardMedications() {
    // Simulated medication data - in a real app, this would come from an API based on ward patients
    const medsList = [
        { id: 101, patient: 'Robert Fox', med: 'Aspirin', dose: '75mg', time: '09:00 AM', status: 'Due' },
        { id: 101, patient: 'Robert Fox', med: 'Atorvastatin', dose: '20mg', time: '09:00 PM', status: 'Pending' },
        { id: 123, patient: 'Esther Howard', med: 'Morphine', dose: '5mg', time: '10:00 AM', status: 'Overdue' },
        { id: 123, patient: 'Esther Howard', med: 'Metoprolol', dose: '50mg', time: '02:00 PM', status: 'Pending' },
        { id: 105, patient: 'Jenny Wilson', med: 'Paracetamol', dose: '500mg', time: '08:00 AM', status: 'Administered' },
    ];

    return (
        <div style={{ padding: '0 1rem' }}>
            <div className="section-header" style={{ marginBottom: '2rem' }}>
                <h1>Daily Medication Schedule</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Overview of all medications due for Ward A today.</p>
            </div>

            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Time</th>
                            <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Patient</th>
                            <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Medication</th>
                            <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medsList.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '1rem', fontWeight: 600 }}>{item.time}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 500 }}>{item.patient}</div>
                                    <small style={{ color: '#94a3b8' }}>Bed {MOCK_PATIENTS.find(p => p.name === item.patient)?.bed || '??'}</small>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <Pill size={16} color="var(--color-primary)" />
                                        <span>{item.med}</span>
                                        <span style={{ fontSize: '0.85rem', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>{item.dose}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {item.status === 'Overdue' && <span style={{ color: '#ef4444', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14} /> Overdue</span>}
                                    {item.status === 'Due' && <span style={{ color: '#eab308', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><ClockIcon /> Due Now</span>}
                                    {item.status === 'Administered' && <span style={{ color: '#22c55e', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Done</span>}
                                    {item.status === 'Pending' && <span style={{ color: '#94a3b8' }}>Pending</span>}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {(item.status === 'Due' || item.status === 'Overdue') && (
                                        <button className="btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Mark Done</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const ClockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
