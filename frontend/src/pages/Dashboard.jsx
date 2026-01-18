import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_PATIENTS } from '../utils/mockData';
import { Activity, AlertTriangle, Users, ArrowRight } from 'lucide-react';

// --- ANIMATION HELPER ---
const Reveal = ({ children, delay = 0 }) => {
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

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div style={{ padding: '0 1rem', paddingBottom: '4rem', maxWidth: '1400px', margin: '0 auto' }}>

            {/* Header & Metrics */}
            <Reveal>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Ward Dashboard: ICU Block A
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                            Real-time patient monitoring and status overview.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{
                            background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px',
                            border: '1px solid var(--color-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <div style={{ background: '#f1f5f9', padding: '8px', borderRadius: '8px' }}>
                                <Users size={20} color="#64748b" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Total Patients</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)', lineHeight: 1 }}>12</div>
                            </div>
                        </div>

                        <div style={{
                            background: '#fff1f2', padding: '0.8rem 1.2rem', borderRadius: '12px',
                            border: '1px solid #fecdd3', boxShadow: '0 2px 4px rgba(225, 29, 72, 0.05)',
                            display: 'flex', alignItems: 'center', gap: '10px'
                        }}>
                            <div style={{ background: '#ffe4e6', padding: '8px', borderRadius: '8px' }}>
                                <AlertTriangle size={20} color="#e11d48" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#9f1239', textTransform: 'uppercase', fontWeight: 600 }}>Critical Alerts</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#be123c', lineHeight: 1 }}>1</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Reveal>

            {/* Patient Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                {MOCK_PATIENTS.map((patient, index) => (
                    <Reveal key={patient.id} delay={index * 100}>
                        <div
                            style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                border: '1px solid var(--color-border)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.02)';
                            }}
                        >
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{
                                        width: '42px', height: '42px', borderRadius: '10px',
                                        background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1rem', fontWeight: 700, color: '#64748b'
                                    }}>
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
                                            {patient.name}
                                        </h3>
                                        <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
                                            {patient.age}y • Bed {patient.bed}
                                        </div>
                                    </div>
                                </div>
                                <span style={{
                                    background: '#f8fafc', border: '1px solid #e2e8f0',
                                    padding: '4px 10px', borderRadius: '6px',
                                    fontSize: '0.75rem', fontWeight: 600, color: '#64748b',
                                    textTransform: 'uppercase', letterSpacing: '0.02em'
                                }}>
                                    {patient.ward}
                                </span>
                            </div>

                            {/* Diagnosis Info */}
                            <div style={{
                                marginBottom: '1.5rem',
                                padding: '0.8rem',
                                background: '#f8fafc',
                                borderRadius: '8px',
                                fontSize: '0.9rem',
                                color: '#475569',
                                border: '1px solid #f1f5f9'
                            }}>
                                <span style={{ fontWeight: 600, color: '#334155', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Diagnosis</span>
                                {patient.diagnosis}
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => navigate(`/app/monitor/${patient.id}`)}
                                style={{
                                    width: '100%',
                                    background: 'var(--color-primary)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.9rem',
                                    borderRadius: '10px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.6rem',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s, transform 0.2s',
                                    boxShadow: '0 4px 6px rgba(15, 118, 110, 0.2)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)';
                                    e.currentTarget.style.transform = 'translateY(-1px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                <Activity size={18} /> Monitor Vitals <ArrowRight size={16} style={{ opacity: 0.8 }} />
                            </button>
                        </div>
                    </Reveal>
                ))}
            </div>
        </div>
    );
}