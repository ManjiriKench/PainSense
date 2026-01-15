
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ArrowRight, MessageSquareOff, ClipboardList, AlertCircle, Camera, Brain, BarChart2, Shield, Heart, Users, Globe, ExternalLink } from 'lucide-react';
import './LandingPage.css';

export default function LandingPage() {
    const { hash } = useLocation();

    // Scroll to section handling
    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                // Small timeout to ensure layout is ready
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    // Simulated Pain Indicator Logic
    const [simulatedPain, setSimulatedPain] = useState(0); // 0 (None) -> 1 (Mild) -> 2 (High)

    useEffect(() => {
        // Cycle through pain states every 4 seconds for the "Interactive Wow"
        const interval = setInterval(() => {
            setSimulatedPain(prev => (prev + 1) % 3);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const getSimulatedStatus = () => {
        if (simulatedPain === 0) return { label: "Monitoring facial indicators...", color: "var(--color-pain-none)", width: "30%" };
        if (simulatedPain === 1) return { label: "Potential discomfort detected", color: "var(--color-pain-mild)", width: "60%" };
        return { label: "Attention may be required", color: "var(--color-pain-high)", width: "90%" };
    };

    const status = getSimulatedStatus();

    return (
        <div className="landing-content">
            {/* 2. HERO SECTION */}
            <header className="hero-section">
                <div className="hero-content">
                    <h1>Objective Pain Assessment for Patients Who Cannot Speak</h1>
                    <p className="hero-sub">
                        PainSense helps clinicians monitor pain in non-communicative patients using real-time facial analysis — without requiring patient interaction.
                    </p>
                    <p className="hero-context">Designed for ICU care, neonatal units, and vulnerable patient populations.</p>

                    <div className="hero-actions">
                        <Link to="/login" className="btn-primary">View Live Pain Monitoring</Link>
                        <a href="#how-it-works" className="btn-outline">How PainSense Works</a>
                    </div>
                </div>

                {/* Interactive WOW Element */}
                <div className="hero-visual">
                    <div className="simulated-card">
                        <div className="sim-header">
                            <Activity size={18} /> PainSense System Preview
                        </div>
                        <div className="sim-body">
                            <div className="sim-bar-container">
                                <div
                                    className="sim-bar-fill"
                                    style={{
                                        width: status.width,
                                        backgroundColor: status.color
                                    }}
                                />
                            </div>
                            <div className="sim-status-text" key={simulatedPain}>
                                {status.label}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* 3. THE PROBLEM SNAPSHOT */}
            <section className="section-snapshot">
                <div className="container">
                    <div className="section-header-center">
                        <h2>Why Pain Assessment Fails Today</h2>
                    </div>
                    <div className="card-grid-3">
                        <div className="snapshot-card">
                            <div className="icon-circle"><MessageSquareOff size={24} /></div>
                            <h3>Communication Gap</h3>
                            <p>Pain relies on patient self-reporting, which fails for sedated, neonatal, and non-verbal patients.</p>
                        </div>
                        <div className="snapshot-card">
                            <div className="icon-circle"><ClipboardList size={24} /></div>
                            <h3>Subjective Tools</h3>
                            <p>Existing tools depend on observation and periodic checks, leading to inconsistent assessments.</p>
                        </div>
                        <div className="snapshot-card">
                            <div className="icon-circle"><AlertCircle size={24} /></div>
                            <h3>Consequences</h3>
                            <p>Missed pain leads to suffering; overestimation leads to overtreatment.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. WHAT PAINSENSE DOES (SYSTEM FLOW) */}
            <section id="how-it-works" className="section-flow">
                <div className="container">
                    <div className="section-header-center">
                        <h2>How PainSense Helps Clinicians</h2>
                    </div>

                    <div className="flow-container">
                        <div className="flow-step">
                            <div className="flow-icon"><Camera size={32} /></div>
                            <h4>1. Camera Input</h4>
                            <p>Facial micro-expressions captured passively</p>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-icon"><Brain size={32} /></div>
                            <h4>2. AI Analysis</h4>
                            <p>Patterns analyzed in real time on-device</p>
                        </div>
                        <div className="flow-arrow">→</div>
                        <div className="flow-step">
                            <div className="flow-icon"><BarChart2 size={32} /></div>
                            <h4>3. Pain Indicator</h4>
                            <p>Continuous pain status shown to clinicians</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. WHO IT IS FOR */}
            <section className="section-audience">
                <div className="container">
                    <div className="section-header-center">
                        <h2>Designed for Patients Who Are Often Overlooked</h2>
                    </div>
                    <div className="audience-grid">
                        <div className="audience-card">ICU & Critical Care Patients</div>
                        <div className="audience-card">Neonates & Pediatric Care</div>
                        <div className="audience-card">Non-Verbal or Cognitively Impaired</div>
                        <div className="audience-card">Resource-Limited Healthcare Settings</div>
                    </div>
                    <p className="audience-tagline">PainSense improves health access by removing the need for communication.</p>
                </div>
            </section>

            {/* 6. MINI LIVE MODULE PREVIEW */}
            <section className="section-preview">
                <div className="container">
                    <div className="preview-panel">
                        <div className="preview-left">
                            <h3>Live Pain Monitoring</h3>
                            <p>Experience the real-time feedback loop designed for the nursing station.</p>
                            <Link to="/login" className="btn-primary-lg">
                                Open Live Monitoring Module <ExternalLink size={18} />
                            </Link>
                        </div>
                        <div className="preview-mock">
                            <div className="mock-cam">
                                <span>Camera Feed Active</span>
                                <div className="mock-overlay">Status: Monitoring Active</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. ETHICS, PRIVACY & SCOPE */}
            <section id="ethics" className="section-ethics">
                <div className="container">
                    <div className="ethics-box">
                        <h3><Shield className="inline-icon" /> Responsible by Design</h3>
                        <ul>
                            <li>PainSense is a <strong>decision-support prototype</strong>, not a diagnostic tool</li>
                            <li>Designed for <strong>edge-first processing</strong> to protect patient privacy</li>
                            <li>No data stored without consent</li>
                            <li>Clinical validation is a future step</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* 8. IMPACT SUMMARY */}
            <section id="impact" className="section-impact">
                <div className="container">
                    <div className="section-header-center">
                        <h2>Impact at a Glance</h2>
                    </div>
                    <div className="impact-grid">
                        <div className="impact-item"><Activity className="impact-icon" /> Earlier pain detection</div>
                        <div className="impact-item"><Heart className="impact-icon" /> Reduced clinician burden</div>
                        <div className="impact-item"><Users className="impact-icon" /> Better care for non-communicative</div>
                        <div className="impact-item"><Globe className="impact-icon" /> Scalable to low-resource hospitals</div>
                    </div>
                    <p className="impact-footer">Aligned with the mission of improving health access for all.</p>
                </div>
            </section>
        </div>
    );
}
