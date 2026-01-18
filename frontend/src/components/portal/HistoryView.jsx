import React from 'react';
import {
    FileText, Calendar, Clock, AlertCircle, CheckCircle2,
    Activity, Stethoscope, Pill, HeartPulse, ChevronRight,
    Filter, Download
} from 'lucide-react';
import './HistoryView.css';

const historyEvents = [
    {
        id: 1,
        title: 'Admitted to ICU-A',
        date: 'Jan 08, 2026',
        time: '09:45 AM',
        type: 'admission',
        category: 'Inpatient',
        description: 'Post-operative recovery monitoring initiated. Vitals stable.',
        doctor: 'Dr. Emily Chen',
        status: 'current'
    },
    {
        id: 2,
        title: 'Emergency Admission',
        date: 'Jan 07, 2026',
        time: '11:23 PM',
        type: 'emergency',
        category: 'Emergency',
        description: 'Admitted via ER for acute chest pain and shortness of breath.',
        doctor: 'Dr. Michael Ross',
        status: 'completed'
    },
    {
        id: 3,
        title: 'Cardiac Surgery',
        date: 'Jan 07, 2026',
        time: '02:15 PM',
        type: 'procedure',
        category: 'Surgery',
        description: 'Coronary artery bypass grafting (CABG) procedure completed successfully.',
        doctor: 'Dr. Sarah Williams',
        status: 'completed'
    },
    // {
    //     id: 4,
    //     title: 'Pre-operative Assessment',
    //     date: 'Jan 06, 2026',
    //     time: '10:00 AM',
    //     type: 'consultation',
    //     category: 'Consultation',
    //     description: 'Full cardiac workup and surgical planning completed.',
    //     doctor: 'Dr. Emily Chen',
    //     status: 'completed'
    // },
    // {
    //     id: 5,
    //     title: 'Medication Adjustment',
    //     date: 'Jan 05, 2026',
    //     time: '03:30 PM',
    //     type: 'medication',
    //     category: 'Prescription',
    //     description: 'Blood thinner dosage optimized for upcoming procedure.',
    //     doctor: 'Dr. Michael Ross',
    //     status: 'completed'
    // }
];

const getTypeIcon = (type) => {
    switch (type) {
        case 'admission': return <Activity size={16} />;
        case 'emergency': return <AlertCircle size={16} />;
        case 'procedure': return <HeartPulse size={16} />;
        case 'consultation': return <Stethoscope size={16} />;
        case 'medication': return <Pill size={16} />;
        default: return <FileText size={16} />;
    }
};

const getTypeColor = (type) => {
    switch (type) {
        case 'admission': return '#0ea5e9';
        case 'emergency': return '#ef4444';
        case 'procedure': return '#8b5cf6';
        case 'consultation': return '#10b981';
        case 'medication': return '#f59e0b';
        default: return '#64748b';
    }
};

const HistoryView = () => (
    <div className="history-container fade-in">
        {/* Header */}
        <div className="history-header">
            <div className="history-title">
                <div className="title-icon">
                    <FileText size={20} />
                </div>
                <div>
                    <h3>Medical History</h3>
                    <p>{historyEvents.length} recorded events</p>
                </div>
            </div>
            <div className="history-actions">
                <button className="btn-filter">
                    <Filter size={14} />
                    Filter
                </button>
                <button className="btn-export">
                    <Download size={14} />
                    Export
                </button>
            </div>
        </div>

        {/* Timeline */}
        <div className="timeline">
            {historyEvents.map((event, index) => (
                <div
                    key={event.id}
                    className={`timeline-item slide-up ${event.status === 'current' ? 'current' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div
                        className="timeline-marker"
                        style={{ '--marker-color': getTypeColor(event.type) }}
                    >
                        <div className="marker-dot"></div>
                        <div className="marker-line"></div>
                    </div>

                    <div className="timeline-card">
                        <div className="card-header">
                            <div
                                className="event-icon"
                                style={{ background: `${getTypeColor(event.type)}15`, color: getTypeColor(event.type) }}
                            >
                                {getTypeIcon(event.type)}
                            </div>
                            <div className="event-meta">
                                <span className="event-category">{event.category}</span>
                                <div className="event-datetime">
                                    <Calendar size={12} />
                                    {event.date}
                                    <span className="separator">•</span>
                                    <Clock size={12} />
                                    {event.time}
                                </div>
                            </div>
                            {event.status === 'current' && (
                                <span className="current-badge">Current</span>
                            )}
                        </div>

                        <h4 className="event-title">{event.title}</h4>
                        <p className="event-description">{event.description}</p>

                        <div className="card-footer">
                            <span className="doctor-info">
                                <Stethoscope size={12} />
                                {event.doctor}
                            </span>
                            <button className="btn-details">
                                View Details <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Summary Stats */}
        <div className="history-stats">
            <div className="stat-card">
                <Activity size={18} />
                <div className="stat-info">
                    <span className="stat-value">2</span>
                    <span className="stat-label">Admissions</span>
                </div>
            </div>
            <div className="stat-card">
                <HeartPulse size={18} />
                <div className="stat-info">
                    <span className="stat-value">1</span>
                    <span className="stat-label">Procedures</span>
                </div>
            </div>
            <div className="stat-card">
                <Stethoscope size={18} />
                <div className="stat-info">
                    <span className="stat-value">1</span>
                    <span className="stat-label">Consultations</span>
                </div>
            </div>
            <div className="stat-card">
                <Pill size={18} />
                <div className="stat-info">
                    <span className="stat-value">1</span>
                    <span className="stat-label">Prescriptions</span>
                </div>
            </div>
        </div>
    </div>
);

export default HistoryView;
