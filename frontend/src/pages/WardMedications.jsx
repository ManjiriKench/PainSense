import React from 'react';
import { Pill, Clock, CheckCircle2, AlertCircle, Info, TrendingUp } from 'lucide-react';
import { MOCK_PATIENTS } from '../utils/mockData';
import './WardMedications.css';

const medsList = [
    {
        id: 1,
        patient: 'Robert Fox',
        bed: 'A-01',
        name: 'Aspirin',
        dosage: '75mg',
        timing: '09:00 AM',
        status: 'Due',
        type: 'Blood Thinner',
        adherence: 98
    },
    {
        id: 2,
        patient: 'Robert Fox',
        bed: 'A-01',
        name: 'Atorvastatin',
        dosage: '20mg',
        timing: '09:00 PM',
        status: 'Pending',
        type: 'Cholesterol',
        adherence: 95
    },
    {
        id: 3,
        patient: 'Esther Howard',
        bed: 'A-02',
        name: 'Morphine',
        dosage: '5mg',
        timing: '10:00 AM',
        status: 'Overdue',
        type: 'Pain Relief',
        adherence: 87
    },
    {
        id: 4,
        patient: 'Esther Howard',
        bed: 'A-02',
        name: 'Metoprolol',
        dosage: '50mg',
        timing: '02:00 PM',
        status: 'Pending',
        type: 'Beta Blocker',
        adherence: 100
    },
    {
        id: 5,
        patient: 'Jenny Wilson',
        bed: 'A-03',
        name: 'Paracetamol',
        dosage: '500mg',
        timing: '08:00 AM',
        status: 'Administered',
        type: 'Pain Relief',
        adherence: 92
    }
];

const getStatusConfig = (status) => {
    switch (status) {
        case 'Due': return { class: 'due', icon: Clock };
        case 'Overdue': return { class: 'overdue', icon: AlertCircle };
        case 'Administered': return { class: 'administered', icon: CheckCircle2 };
        default: return { class: 'pending', icon: Clock };
    }
};

export default function WardMedications() {
    const activeCount = medsList.filter(m => m.status !== 'Administered').length;
    const overdueCount = medsList.filter(m => m.status === 'Overdue').length;

    return (
        <div className="ward-meds-container fade-in">
            <div className="meds-header">
                <div className="meds-title">
                    <div className="title-icon">
                        <Pill size={20} />
                    </div>
                    <div>
                        <h3>Daily Medication Schedule</h3>
                        <p>Ward A • {medsList.length} medications scheduled</p>
                    </div>
                </div>
                <div className="meds-stats">
                    <div className="stat-pill">
                        <CheckCircle2 size={14} />
                        <span>{activeCount} Active</span>
                    </div>
                    {overdueCount > 0 && (
                        <div className="stat-pill warning">
                            <AlertCircle size={14} />
                            <span>{overdueCount} Overdue</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="meds-grid">
                {medsList.map((med, index) => {
                    const statusConfig = getStatusConfig(med.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                        <div
                            key={med.id}
                            className="med-card slide-up"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <div className="med-card-header">
                                <div className="med-info">
                                    <span className="med-type">{med.type}</span>
                                    <h4 className="med-name">{med.name}</h4>
                                    <span className="med-dosage">{med.dosage}</span>
                                </div>
                                <div className={`status-badge ${statusConfig.class}`}>
                                    <StatusIcon size={12} />
                                    {med.status}
                                </div>
                            </div>

                            <div className="med-patient">
                                <div className="patient-avatar">
                                    {med.patient.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="patient-info">
                                    <strong>{med.patient}</strong>
                                    <span>Bed {med.bed}</span>
                                </div>
                            </div>

                            <div className="med-schedule">
                                <div className="schedule-item">
                                    <Clock size={14} />
                                    <span>Scheduled: {med.timing}</span>
                                </div>
                            </div>

                            <div className="med-adherence">
                                <div className="adherence-header">
                                    <TrendingUp size={12} />
                                    <span>Adherence</span>
                                    <span className="adherence-value">{med.adherence}%</span>
                                </div>
                                <div className="adherence-bar">
                                    <div
                                        className="adherence-fill"
                                        style={{ width: `${med.adherence}%` }}
                                    ></div>
                                </div>
                            </div>

                            {(med.status === 'Due' || med.status === 'Overdue') && (
                                <button className="btn-mark-done">
                                    <CheckCircle2 size={16} />
                                    Mark as Administered
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="meds-footer">
                <Info size={14} />
                <span>All medication schedules are synced with the hospital pharmacy system.</span>
            </div>
        </div>
    );
}