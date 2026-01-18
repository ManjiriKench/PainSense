import React, { useState } from 'react';
import {
    Calendar, Clock, MapPin, User, Video,
    CheckCircle2, AlertCircle, ChevronRight,
    MessageSquare, Send, CalendarPlus
} from 'lucide-react';
import './AppointmentsView.css';

const appointments = [
    {
        id: 1,
        title: 'Neurology Follow-up',
        doctor: 'Dr. Emily Chen',
        department: 'Dept of Neurology',
        date: { day: 12, month: 'JAN', year: 2026 },
        time: '10:30 AM',
        location: 'Building A, Room 304',
        type: 'in-person',
        status: 'confirmed',
        isNext: true
    },
    {
        id: 2,
        title: 'Physical Therapy',
        doctor: 'Sarah Jones',
        department: 'Rehabilitation Center',
        date: { day: 15, month: 'JAN', year: 2026 },
        time: '2:00 PM',
        location: 'Rehab Wing, Room 102',
        type: 'in-person',
        status: 'confirmed',
        isNext: false
    },
    {
        id: 3,
        title: 'Pain Management Consult',
        doctor: 'Dr. Michael Ross',
        department: 'Pain Clinic',
        date: { day: 22, month: 'JAN', year: 2026 },
        time: '11:00 AM',
        location: 'Virtual',
        type: 'video',
        status: 'pending',
        isNext: false
    }
];

const AppointmentsView = () => {
    const [selectedReason, setSelectedReason] = useState('');

    return (
        <div className="appointments-container fade-in">
            {/* Header */}
            <div className="appts-header">
                <div className="appts-title">
                    <div className="title-icon">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h3>Upcoming Appointments</h3>
                        <p>{appointments.length} scheduled visits</p>
                    </div>
                </div>
                <div className="appts-actions">
                    <button className="btn-add-appt">
                        <CalendarPlus size={16} />
                        Request New
                    </button>
                </div>
            </div>

            {/* Appointments List */}
            <div className="appts-list">
                {appointments.map((appt, index) => (
                    <div
                        key={appt.id}
                        className={`appt-card slide-up ${appt.isNext ? 'next-appt' : ''}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {appt.isNext && <div className="next-badge">Next Up</div>}

                        <div className="appt-date-block">
                            <span className="appt-day">{appt.date.day}</span>
                            <span className="appt-month">{appt.date.month}</span>
                        </div>

                        <div className="appt-content">
                            <div className="appt-main">
                                <h4 className="appt-title">{appt.title}</h4>
                                <div className="appt-meta">
                                    <span className="meta-item">
                                        <User size={12} />
                                        {appt.doctor}
                                    </span>
                                    <span className="meta-item">
                                        <Clock size={12} />
                                        {appt.time}
                                    </span>
                                    <span className="meta-item">
                                        {appt.type === 'video' ? <Video size={12} /> : <MapPin size={12} />}
                                        {appt.location}
                                    </span>
                                </div>
                            </div>
                            <div className="appt-status-section">
                                <div className={`status-badge ${appt.status}`}>
                                    {appt.status === 'confirmed' ? (
                                        <><CheckCircle2 size={12} /> Confirmed</>
                                    ) : (
                                        <><AlertCircle size={12} /> Pending</>
                                    )}
                                </div>
                                <button className="btn-view-details">
                                    Details <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Request Change Section */}
            <div className="request-section slide-up" style={{ animationDelay: '0.4s' }}>
                <div className="request-header">
                    <MessageSquare size={18} />
                    <h4>Request Appointment Change</h4>
                </div>

                <form className="request-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Select Appointment</label>
                            <select className="form-select">
                                {appointments.map(appt => (
                                    <option key={appt.id} value={appt.id}>
                                        {appt.title} - {appt.date.month} {appt.date.day}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Reason for Request</label>
                            <select
                                className="form-select"
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                            >
                                <option value="">Select a reason...</option>
                                <option value="reschedule">Need to reschedule</option>
                                <option value="cancel">Need to cancel</option>
                                <option value="earlier">Request earlier time</option>
                                <option value="symptoms">Symptoms worsening</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Additional Details</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Please describe your request or any additional information..."
                            rows={3}
                        ></textarea>
                    </div>

                    <button className="btn-submit" type="submit">
                        <Send size={16} />
                        Submit Request
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentsView;
