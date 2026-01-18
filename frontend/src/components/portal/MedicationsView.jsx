import React from 'react';
import { Pill, Clock, CheckCircle2, AlertCircle, Info, Calendar, TrendingUp } from 'lucide-react';
import './MedicationsView.css';

const medications = [
    {
        id: 1,
        name: 'Aspirin',
        dosage: '75mg',
        timing: 'Once daily (Morning)',
        status: 'active',
        type: 'Blood Thinner',
        lastTaken: '2 hours ago',
        nextDose: '22 hours',
        adherence: 98
    },
    {
        id: 2,
        name: 'Atorvastatin',
        dosage: '20mg',
        timing: 'Bedtime',
        status: 'active',
        type: 'Cholesterol',
        lastTaken: '14 hours ago',
        nextDose: '10 hours',
        adherence: 95
    },
    {
        id: 3,
        name: 'Metoprolol',
        dosage: '50mg',
        timing: 'Twice daily',
        status: 'active',
        type: 'Beta Blocker',
        lastTaken: '4 hours ago',
        nextDose: '8 hours',
        adherence: 100
    }
];

const MedicationsView = () => (
    <div className="medications-container fade-in">
        {/* Header */}
        <div className="meds-header">
            <div className="meds-title">
                <div className="title-icon">
                    <Pill size={20} />
                </div>
                <div>
                    <h3>Current Medications</h3>
                    <p>Managing {medications.length} active prescriptions</p>
                </div>
            </div>
            <div className="meds-stats">
                <div className="stat-pill">
                    <CheckCircle2 size={14} />
                    <span>{medications.length} Active</span>
                </div>
                <div className="stat-pill warning">
                    <AlertCircle size={14} />
                    <span>0 Alerts</span>
                </div>
            </div>
        </div>

        {/* Medication Cards */}
        <div className="meds-grid">
            {medications.map((med, index) => (
                <div
                    key={med.id}
                    className="med-card slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="med-card-header">
                        <div className="med-info">
                            <span className="med-type">{med.type}</span>
                            <h4 className="med-name">{med.name}</h4>
                            <span className="med-dosage">{med.dosage}</span>
                        </div>
                        <div className={`status-badge ${med.status}`}>
                            <span className="status-dot"></span>
                            Active
                        </div>
                    </div>

                    <div className="med-schedule">
                        <div className="schedule-item">
                            <Clock size={14} />
                            <span>{med.timing}</span>
                        </div>
                    </div>

                    <div className="med-details">
                        <div className="detail-row">
                            <span className="detail-label">Last Taken</span>
                            <span className="detail-value">{med.lastTaken}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Next Dose</span>
                            <span className="detail-value highlight">{med.nextDose}</span>
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
                </div>
            ))}
        </div>

        {/* Info Footer */}
        <div className="meds-footer">
            <Info size={14} />
            <span>Medications are managed by your healthcare provider. Contact them for any changes.</span>
        </div>
    </div>
);

export default MedicationsView;
