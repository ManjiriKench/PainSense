import {
    User,
    ShieldCheck,
    Briefcase,
    Phone,
    Mail,
    Clock,
    ClipboardList,
    Activity,
    AlertCircle,
    Settings,
    Stethoscope,
    Users
} from 'lucide-react';
import './StaffProfile.css';

export default function DoctorProfile() {
    return (
        <div className="portal-card staff-profile premium">

            {/* HEADER */}
            <div className="staff-hero">
                <div className="staff-avatar">
                    <Stethoscope size={44} />
                </div>

                <div className="staff-hero-main">
                    <h3>Dr. Amit Verma</h3>
                    <span className="role">Consultant Physician</span>

                    <div className="hero-badges">
                        <span className="badge soft-blue">ICU Unit A</span>
                        <span className="badge soft-green">On Duty</span>
                        <span className="badge soft-gray">Doctor ID #DR-1092</span>
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="staff-grid">

                {/* LEFT COLUMN */}
                <div className="staff-column">

                    <div className="staff-box">
                        <h4><Briefcase size={16} /> Professional Details</h4>
                        <div className="info-list">
                            <div><label>Department</label><span>Critical Care Medicine</span></div>
                            <div><label>Specialization</label><span>Intensive Care & Pain Management</span></div>
                            <div><label>Experience</label><span>14 Years</span></div>
                            <div><label>Current Shift</label><span>Morning (07:00 – 15:00)</span></div>
                        </div>
                    </div>

                    <div className="staff-box">
                        <h4><Phone size={16} /> Contact</h4>
                        <div className="info-list">
                            <div><label>Phone</label><span>+91 9XXXXXXXXX</span></div>
                            <div><label>Email</label><span>amit.verma@painsense.health</span></div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="staff-column">

                    <div className="staff-box">
                        <h4><ShieldCheck size={16} /> Clinical Access</h4>
                        <div className="permission-list">
                            <div className="permission-item"><ShieldCheck size={14} /> Patient Pain Monitoring</div>
                            <div className="permission-item"><ShieldCheck size={14} /> Clinical Alert Review</div>
                            <div className="permission-item"><ShieldCheck size={14} /> Emergency Oversight</div>
                            <div className="permission-item"><ShieldCheck size={14} /> Care Team Coordination</div>
                        </div>
                    </div>

                    <div className="staff-box highlight">
                        <h4><Activity size={16} /> Current Responsibilities</h4>
                        <ul className="task-list">
                            <li>Review high-pain alerts (ICU-A)</li>
                            <li>Clinical oversight for monitored patients</li>
                            <li>Coordination with nursing staff</li>
                            <li>Emergency escalation decisions</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* ACTIONS */}
            <div className="staff-actions">
                <button className="action-btn">
                    <Users size={16} /> View Priority Patients
                </button>
                <button className="action-btn">
                    <ClipboardList size={16} /> Review Alerts
                </button>
                <button className="action-btn warn">
                    <AlertCircle size={16} /> Emergency Protocols
                </button>
                <button className="action-btn secondary">
                    <Settings size={16} /> Account Settings
                </button>
            </div>

        </div>
    );
}
