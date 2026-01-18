import React from 'react';
import {
    Activity, Clock, FileText, Shield, Phone, Lock,
    Download, CheckCircle2, Users, AlertTriangle, Eye,
    ChevronRight, ExternalLink
} from 'lucide-react';
import './ConsentView.css';

const ConsentView = () => (
    <div className="consent-container fade-in">
        {/* Header */}
        <div className="consent-header">
            <div className="consent-title">
                <div className="title-icon">
                    <Shield size={20} />
                </div>
                <div>
                    <h3>Consent & Information</h3>
                    <p>Privacy settings and data usage policies</p>
                </div>
            </div>
            <div className="header-actions">
                <button className="btn-download">
                    <Download size={14} />
                    Export PDF
                </button>
                <div className="consent-badge active">
                    <CheckCircle2 size={12} />
                    Consent Active
                </div>
            </div>
        </div>

        {/* Main Grid */}
        <div className="consent-grid">
            {/* Left Column */}
            <div className="consent-main">
                {/* Consent Status Card */}
                <div className="consent-card slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="card-header">
                        <Activity size={18} />
                        <h4>Consent Status</h4>
                    </div>
                    <div className="status-grid">
                        <div className="status-item">
                            <span className="status-label">Consent Type</span>
                            <span className="status-value">Non-invasive pain monitoring</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Consent Date</span>
                            <span className="status-value">02 Feb 2026</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Monitoring Scope</span>
                            <span className="status-value">During active clinical sessions</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Authorized By</span>
                            <span className="status-value">Robert Fox (Self)</span>
                        </div>
                    </div>
                    <p className="card-note">
                        You have provided consent for facial-expression-based pain monitoring as part of your clinical care.
                    </p>
                </div>

                {/* Data Usage Card */}
                <div className="consent-card slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="card-header">
                        <Lock size={18} />
                        <h4>Data Usage & Privacy</h4>
                    </div>
                    <ul className="feature-list">
                        <li>
                            <CheckCircle2 size={14} />
                            <span>Camera input used only during active monitoring</span>
                        </li>
                        <li>
                            <CheckCircle2 size={14} />
                            <span>No continuous recording when stopped</span>
                        </li>
                        <li>
                            <CheckCircle2 size={14} />
                            <span>Data processed locally (Edge Computing)</span>
                        </li>
                        <li>
                            <CheckCircle2 size={14} />
                            <span>No sharing without explicit authorization</span>
                        </li>
                    </ul>
                    <div className="privacy-badge">
                        <Eye size={12} />
                        Privacy-first, edge-based design
                    </div>
                </div>

                {/* Warning Card */}
                <div className="consent-card warning slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="card-header warning">
                        <AlertTriangle size={18} />
                        <h4>Monitoring Limitations</h4>
                    </div>
                    <ul className="feature-list warning">
                        <li>
                            <span className="bullet">•</span>
                            <span>PainSense is a decision-support system, not diagnostic</span>
                        </li>
                        <li>
                            <span className="bullet">•</span>
                            <span>Does not diagnose conditions autonomously</span>
                        </li>
                        <li>
                            <span className="bullet">•</span>
                            <span>Final decisions made by healthcare professionals</span>
                        </li>
                    </ul>
                    <p className="warning-note">
                        PainSense supports clinicians with insights, not medical decisions.
                    </p>
                </div>
            </div>

            {/* Right Column */}
            <div className="consent-sidebar">
                {/* Emergency Contacts */}
                <div className="sidebar-card slide-up" style={{ animationDelay: '0.15s' }}>
                    <div className="sidebar-header">
                        <Phone size={16} />
                        <h5>Emergency Contacts</h5>
                    </div>
                    <div className="contact-list">
                        <div className="contact-card primary">
                            <div className="contact-avatar">MF</div>
                            <div className="contact-info">
                                <strong>Mathew Fox</strong>
                                <span>Father • Primary</span>
                                <span className="phone-number">+1 (555) 893-2214</span>
                            </div>
                            <ChevronRight size={16} className="contact-arrow" />
                        </div>
                        <div className="contact-card">
                            <div className="contact-avatar secondary">LF</div>
                            <div className="contact-info">
                                <strong>Lily Fox</strong>
                                <span>Mother • Secondary</span>
                                <span className="phone-number">+1 (555) 893-2214</span>
                            </div>
                            <ChevronRight size={16} className="contact-arrow" />
                        </div>
                    </div>
                </div>

                {/* Consent History */}
                <div className="sidebar-card slide-up" style={{ animationDelay: '0.25s' }}>
                    <div className="sidebar-header">
                        <Clock size={16} />
                        <h5>Consent History</h5>
                    </div>
                    <div className="history-item">
                        <div className="history-icon">
                            <CheckCircle2 size={14} />
                        </div>
                        <div className="history-content">
                            <span className="history-date">02 Feb 2026</span>
                            <span className="history-desc">Pain monitoring consent granted</span>
                        </div>
                        <span className="history-status">Active</span>
                    </div>
                </div>

                {/* Patient Rights */}
                <div className="sidebar-card slide-up" style={{ animationDelay: '0.35s' }}>
                    <div className="sidebar-header">
                        <FileText size={16} />
                        <h5>Your Rights</h5>
                    </div>
                    <ul className="rights-list">
                        <li>Pause or stop monitoring anytime</li>
                        <li>Request data usage information</li>
                        <li>Modify consent through staff</li>
                    </ul>
                    <button className="btn-learn-more">
                        Learn More <ExternalLink size={12} />
                    </button>
                </div>
            </div>
        </div>

        {/* Footer */}
        <p className="consent-footer">
            This section is part of a prototype for demonstration purposes only.
        </p>
    </div>
);

export default ConsentView;
