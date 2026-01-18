import React, { useState, useEffect, useRef } from 'react';
import { Clock, AlertCircle, Calendar, CheckCircle2, MoreHorizontal } from 'lucide-react';

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

export default function WardAppointments() {
    // Mock Appointments
    const appointments = [
        { id: 1, patient: 'Robert Fox', time: '11:00 AM', type: 'Physical Therapy', with: 'Dr. Sarah Jones', status: 'Confirmed', statusColor: '#dcfce7', statusText: '#166534' },
        { id: 2, patient: 'Esther Howard', time: '02:00 PM', type: 'Neurology Follow-up', with: 'Dr. Emily Chen', status: 'Confirmed', statusColor: '#dcfce7', statusText: '#166534' },
        { id: 3, patient: 'Jenny Wilson', time: '04:30 PM', type: 'MRI Scan', with: 'Radiology Dept', status: 'Pending Transport', statusColor: '#ffedd5', statusText: '#9a3412' },
        { id: 4, patient: 'Albert Flores', time: '05:15 PM', type: 'Cardiology Review', with: 'Dr. Arlene McCoy', status: 'Scheduled', statusColor: '#e0f2fe', statusText: '#0369a1' },
    ];

    // Mock Change Requests
    const changeRequests = [
        { id: 1, patient: 'Esther Howard', request: 'Move PT to morning', reason: 'Pain worsening in evenings', time: '10 mins ago' },
    ];

    return (
        <div style={{ padding: '0 1rem', paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header */}
            <Reveal>
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                    <div>
                        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                            Ward Schedule
                        </h1>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                            Upcoming appointments and procedures for today.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'white', border: '1px solid var(--color-border)',
                            padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, color: 'var(--color-text-main)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer'
                        }}>
                            <Calendar size={18} /> View Calendar
                        </button>
                    </div>
                </div>
            </Reveal>

            {/* Main Appointments Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {appointments.map((appt, index) => (
                    <Reveal key={appt.id} delay={index * 100}>
                        <div style={{
                            background: 'white',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid var(--color-border)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
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
                            {/* Top Row: Time & Status */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem', alignItems: 'center' }}>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    color: 'var(--color-primary-dark)', fontWeight: 700,
                                    background: 'var(--bg-hover)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.9rem'
                                }}>
                                    <Clock size={16} /> {appt.time}
                                </div>
                                <span style={{
                                    background: appt.statusColor,
                                    color: appt.statusText,
                                    padding: '4px 10px',
                                    borderRadius: '99px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.02em',
                                    textTransform: 'uppercase'
                                }}>
                                    {appt.status}
                                </span>
                            </div>

                            {/* Middle: Details */}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--color-text-main)' }}>
                                {appt.type}
                            </h3>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                with <span style={{ fontWeight: 500, color: 'var(--color-text-main)' }}>{appt.with}</span>
                            </div>

                            {/* Bottom: Patient */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                <div style={{
                                    width: '36px', height: '36px',
                                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    borderRadius: '10px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: '700', fontSize: '0.9rem', color: '#64748b'
                                }}>
                                    {appt.patient.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--color-text-main)' }}>{appt.patient}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Patient</div>
                                </div>
                                <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                    <MoreHorizontal size={20} />
                                </button>
                            </div>
                        </div>
                    </Reveal>
                ))}
            </div>

            {/* Change Requests Section */}
            <Reveal delay={300}>
                <div style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '16px',
                    padding: '2rem',
                    boxShadow: '0 4px 6px -1px rgba(253, 164, 175, 0.1)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                <AlertCircle color="#be123c" size={24} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.1rem', color: '#881337', margin: 0, fontWeight: 700 }}>Requests for Change</h2>
                                <p style={{ color: '#9f1239', fontSize: '0.9rem', margin: 0, marginTop: '2px' }}>
                                    Action required for patient schedule adjustments.
                                </p>
                            </div>
                        </div>
                        <span style={{ background: '#be123c', color: 'white', padding: '4px 10px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600 }}>1 New</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {changeRequests.map(req => (
                            <div key={req.id} style={{
                                background: 'white',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                border: '1px solid #fda4af',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                        <span style={{ fontWeight: 700, color: '#881337', fontSize: '1rem' }}>{req.patient}</span>
                                        <span style={{ fontSize: '0.8rem', color: '#be123c', background: '#fff1f2', padding: '2px 6px', borderRadius: '4px' }}>{req.time}</span>
                                    </div>
                                    <div style={{ color: '#4c0519', fontSize: '0.95rem' }}>
                                        Requested: <span style={{ fontWeight: 600 }}>"{req.request}"</span>
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#9f1239', marginTop: '0.2rem', fontStyle: 'italic' }}>
                                        Reason: {req.reason}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button style={{
                                        background: 'white',
                                        border: '1px solid #fda4af',
                                        color: '#be123c',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}>Dismiss</button>
                                    <button style={{
                                        background: '#be123c',
                                        border: 'none',
                                        color: 'white',
                                        padding: '0.6rem 1.2rem',
                                        borderRadius: '8px',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px rgba(190, 18, 60, 0.2)',
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}>
                                        <CheckCircle2 size={16} /> Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Reveal>
        </div>
    );
}