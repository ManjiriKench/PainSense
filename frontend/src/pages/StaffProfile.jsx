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
    Settings
} from 'lucide-react';
import './StaffProfile.css';

export default function StaffProfile() {
    return (
        <div className="portal-card staff-profile premium">

            {/* HEADER */}
            <div className="staff-hero">
                <div className="staff-avatar">
                    <User size={44} />
                </div>

                <div className="staff-hero-main">
                    <h3>Sarah Johnson</h3>
                    <span className="role">Registered Nurse (RN)</span>

                    <div className="hero-badges">
                        <span className="badge soft-blue">ICU Unit A</span>
                        <span className="badge soft-green">On Duty</span>
                        <span className="badge soft-gray">Staff ID #RN-4421</span>
                    </div>
                </div>
            </div>

            {/* GRID */}
            <div className="staff-grid">

                {/* LEFT COLUMN */}
                <div className="staff-column">

                    <div className="staff-box">
                        <h4><Briefcase size={16} /> Employment</h4>
                        <div className="info-list">
                            <div><label>Department</label><span>Intensive Care Unit</span></div>
                            <div><label>Shift</label><span>Morning (07:00 – 15:00)</span></div>
                            <div><label>Experience</label><span>8 Years</span></div>
                            <div><label>Supervisor</label><span>Dr. Emily Chen</span></div>
                        </div>
                    </div>

                    <div className="staff-box">
                        <h4><Phone size={16} /> Contact</h4>
                        <div className="info-list">
                            <div><label>Phone</label><span>+1 (555) 221-8890</span></div>
                            <div><label>Email</label><span>sarah.j@painsense.health</span></div>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN */}
                <div className="staff-column">

                    <div className="staff-box">
                        <h4><ShieldCheck size={16} /> Access & Permissions</h4>
                        <div className="permission-list">
                            <div className="permission-item"><ShieldCheck size={14} /> Patient Monitoring</div>
                            <div className="permission-item"><ShieldCheck size={14} /> Medication Administration</div>
                            <div className="permission-item"><ShieldCheck size={14} /> Emergency Response</div>
                        </div>
                    </div>

                    <div className="staff-box highlight">
                        <h4><Activity size={16} /> Active Responsibilities</h4>
                        <ul className="task-list">
                            <li>Monitoring ICU Bed #04</li>
                            <li>Medication Round (08:30 AM)</li>
                            <li>Vitals Review – Ward A</li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* ACTIONS */}
            <div className="staff-actions">
                <button className="action-btn">
                    <ClipboardList size={16} /> View Assigned Patients
                </button>
                <button className="action-btn">
                    <Clock size={16} /> Shift History
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
