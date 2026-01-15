import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS } from '../utils/mockData';
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>Ward Dashboard: ICU Block A</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <strong>Total Patients:</strong> 12
                    </div>
                    <div style={{ background: '#ffe4e6', color: '#881337', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #fecdd3' }}>
                        <strong>Critical Alerts:</strong> 1
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {MOCK_PATIENTS.map(patient => (
                    <div
                        key={patient.id}
                        style={{
                            background: 'white',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ padding: '0.5rem 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem', color: 'var(--color-primary-dark)' }}>{patient.name}</h3>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Bed {patient.bed} • {patient.age}y</div>
                                </div>
                                <div style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                                    {patient.ward}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem', color: '#475569', fontSize: '0.9rem' }}>
                                <strong>Diagnosis:</strong> {patient.diagnosis}
                            </div>

                            <button
                                onClick={() => navigate(`/app/monitor/${patient.id}`)}
                                style={{
                                    width: '100%',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.8rem',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                <Activity size={18} /> Monitor Patient
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
