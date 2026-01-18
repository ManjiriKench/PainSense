import React from 'react';
import {
    User, Mail, Phone, MapPin, Calendar, Heart,
    AlertTriangle, Stethoscope, Shield, Edit3,
    ChevronRight, Camera, Clock, Activity, FileText,
    CreditCard, ExternalLink
} from 'lucide-react';
import './ProfileView.css';

const ProfileView = () => (
    <div className="profile-container fade-in">
        <div className="profile-hero">
            <div className="profile-hero-content">
                <div className="avatar-section">
                    <div className="avatar-ring">
                        <div className="avatar-inner">
                            <User size={42} />
                        </div>
                        <div className="avatar-status online"></div>
                    </div>
                    <button className="btn-camera">
                        <Camera size={14} />
                    </button>
                </div>

                <div className="hero-info">
                    <div className="name-row">
                        <h1>Robert Fox</h1>
                        <span className="verified-badge">✓ Verified</span>
                    </div>
                    <p className="patient-meta">Patient ID: MRN 8829-11 • Admitted Jan 7, 2026</p>
                    <div className="quick-badges">
                        <span className="qbadge male"><User size={10} /> Male, 67</span>
                        <span className="qbadge blood"><Heart size={10} /> O+</span>
                        <span className="qbadge risk"><Activity size={10} /> Moderate Risk</span>
                        <span className="qbadge room"><MapPin size={10} /> ICU-A 304</span>
                    </div>
                </div>

                <div className="hero-actions">
                    <button className="btn-edit">
                        <Edit3 size={16} />
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>

        {/* Stats Bar */}
        <div className="stats-bar slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-item">
                <span className="stat-number">3</span>
                <span className="stat-label">Active Meds</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <span className="stat-number">2</span>
                <span className="stat-label">Upcoming Appts</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
                <span className="stat-number">12</span>
                <span className="stat-label">Days Admitted</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item highlight">
                <span className="stat-number">Stable</span>
                <span className="stat-label">Current Status</span>
            </div>
        </div>

        {/* Content Grid */}
        <div className="profile-grid">
            {/* Left Column */}
            <div className="profile-column">
                {/* Contact Info */}
                <div className="profile-card slide-up" style={{ animationDelay: '0.15s' }}>
                    <div className="card-title">
                        <Phone size={18} />
                        <h3>Contact Information</h3>
                    </div>
                    <div className="contact-grid">
                        <div className="contact-item">
                            <div className="contact-icon"><Phone size={16} /></div>
                            <div className="contact-details">
                                <span className="contact-label">Primary Phone</span>
                                <span className="contact-value">+1 (555) 893-2214</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon"><Mail size={16} /></div>
                            <div className="contact-details">
                                <span className="contact-label">Email Address</span>
                                <span className="contact-value">robert.fox@email.com</span>
                            </div>
                        </div>
                        <div className="contact-item full-width">
                            <div className="contact-icon"><MapPin size={16} /></div>
                            <div className="contact-details">
                                <span className="contact-label">Home Address</span>
                                <span className="contact-value">4517 Washington Ave, Manchester, KY 40962</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Personal Details */}
                <div className="profile-card slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="card-title">
                        <User size={18} />
                        <h3>Personal Details</h3>
                    </div>
                    <div className="details-list">
                        <div className="detail-row">
                            <span className="detail-key">Date of Birth</span>
                            <span className="detail-val">December 12, 1958</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Age</span>
                            <span className="detail-val">67 years</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Gender</span>
                            <span className="detail-val">Male</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Language</span>
                            <span className="detail-val">English</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-key">Marital Status</span>
                            <span className="detail-val">Married</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column */}
            <div className="profile-column">
                {/* Medical Card */}
                <div className="profile-card slide-up" style={{ animationDelay: '0.18s' }}>
                    <div className="card-title">
                        <Stethoscope size={18} />
                        <h3>Medical Information</h3>
                    </div>
                    <div className="medical-grid">
                        <div className="med-box">
                            <span className="med-key">Primary Condition</span>
                            <span className="med-val">Post-operative Recovery</span>
                        </div>
                        <div className="med-box">
                            <span className="med-key">Attending Physician</span>
                            <span className="med-val">Dr. Emily Chen</span>
                        </div>
                        <div className="med-box">
                            <span className="med-key">Blood Type</span>
                            <span className="med-val badge-style">O Positive</span>
                        </div>
                        <div className="med-box">
                            <span className="med-key">Admission Date</span>
                            <span className="med-val">January 7, 2026</span>
                        </div>
                    </div>
                </div>

                {/* Allergy Alert */}
                <div className="profile-card alert-card slide-up" style={{ animationDelay: '0.25s' }}>
                    <div className="card-title alert">
                        <AlertTriangle size={18} />
                        <h3>Allergy Alert</h3>
                    </div>
                    <div className="allergy-banner">
                        <div className="allergy-main">
                            <span className="allergy-drug">Penicillin</span>
                            <span className="allergy-reaction">Anaphylaxis Risk</span>
                        </div>
                        <span className="severity-tag">SEVERE</span>
                    </div>
                    <p className="allergy-warning">
                        ⚠️ Verify all medications before administration
                    </p>
                </div>

                {/* Insurance */}
                <div className="profile-card slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="card-title">
                        <CreditCard size={18} />
                        <h3>Insurance Coverage</h3>
                    </div>
                    <div className="insurance-card">
                        <div className="ins-provider">
                            <Shield size={20} />
                            <div>
                                <span className="ins-name">BlueCross BlueShield</span>
                                <span className="ins-type">Premium PPO</span>
                            </div>
                        </div>
                        <div className="ins-details">
                            <div className="ins-row">
                                <span>Policy Number</span>
                                <span>BCB-2024-881122</span>
                            </div>
                            <div className="ins-row">
                                <span>Group Number</span>
                                <span>GRP-KY-4421</span>
                            </div>
                        </div>
                    </div>
                    <button className="btn-insurance">
                        View Full Coverage <ExternalLink size={12} />
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default ProfileView;
