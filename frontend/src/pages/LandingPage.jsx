import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Activity, ArrowRight, MessageSquareOff, ClipboardList, AlertCircle, Camera, Brain, BarChart2, Shield, Heart, Users, Globe, ExternalLink } from 'lucide-react';
import './LandingPage.css';

// Hook for Re-triggerable Scroll Animations
const RevealOnScroll = ({ children, className = "", delay = 0, direction = "up" }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Toggle state based on visibility (True = Animate In, False = Reset)
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.15, // Trigger when 15% of element is visible
                rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before leaving screen
            }
        );
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.disconnect(); };
    }, []);

    const getTransform = () => {
        if (!isVisible) {
            // When hidden, move it away so it can slide back in
            if (direction === "up") return "translateY(40px)";
            if (direction === "left") return "translateX(-40px)";
            if (direction === "right") return "translateX(40px)";
        }
        return "translate(0)";
    };

    return (
        <div
            ref={ref}
            className={`${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: getTransform(),
                // Only apply delay when appearing, remove delay when resetting (scrolling away)
                transition: `all 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) ${isVisible ? delay : 0}ms`
            }}
        >
            {children}
        </div>
    );
};

export default function LandingPage() {
    const { hash } = useLocation();

    // Scroll handling
    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [hash]);

    // Simulated Pain Indicator Logic
    const [simulatedPain, setSimulatedPain] = useState(0);

    useEffect(() => {
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

            {/* 1. HERO SECTION */}
            <header className="hero-section">
                <div className="hero-content">
                    <RevealOnScroll direction="up">
                        <h1>Objective Pain Assessment for Patients Who Cannot Speak</h1>
                    </RevealOnScroll>

                    <RevealOnScroll delay={100} direction="up">
                        <p className="hero-sub">
                            PainSense helps clinicians monitor pain in non-communicative patients using real-time facial analysis — without requiring patient interaction.
                        </p>
                    </RevealOnScroll>

                    <RevealOnScroll delay={200} direction="up">
                        <p className="hero-context">
                            <Activity size={16} style={{ marginRight: 8 }} />
                            Designed for ICU care, neonatal units, and vulnerable patient populations.
                        </p>
                    </RevealOnScroll>

                    <RevealOnScroll delay={300} direction="up">
                        <div className="hero-actions">
                            <Link to="/login" className="btn-primary">
                                View Live Pain Monitoring <ArrowRight size={18} />
                            </Link>
                            <a href="#how-it-works" className="btn-outline">How PainSense Works</a>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Interactive WOW Element */}
                <div className="hero-visual">
                    <RevealOnScroll delay={400} direction="left">
                        <div className="simulated-card float-anim">
                            <div className="sim-header">
                                <Activity size={18} className="pulse-icon" /> PainSense System Preview
                            </div>
                            <div className="sim-body">
                                <div className="sim-bar-container">
                                    <div
                                        className="sim-bar-fill"
                                        style={{
                                            width: status.width,
                                            backgroundColor: status.color,
                                            boxShadow: `0 0 15px ${status.color}50`
                                        }}
                                    />
                                </div>
                                <div className="sim-status-text fade-in-up" key={simulatedPain}>
                                    {status.label}
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </header>

            {/* 2. THE PROBLEM SNAPSHOT */}
            <section className="section-snapshot">
                <div className="container">
                    <RevealOnScroll>
                        <div className="section-header-center">
                            <h2>Why Pain Assessment Fails Today</h2>
                        </div>
                    </RevealOnScroll>
                    <div className="card-grid-3">
                        <RevealOnScroll delay={100} direction="up" className="h-full">
                            <div className="snapshot-card">
                                <div className="icon-circle"><MessageSquareOff size={24} /></div>
                                <h3>Communication Gap</h3>
                                <p>Pain relies on patient self-reporting, which fails for sedated, neonatal, and non-verbal patients.</p>
                            </div>
                        </RevealOnScroll>
                        <RevealOnScroll delay={200} direction="up" className="h-full">
                            <div className="snapshot-card">
                                <div className="icon-circle"><ClipboardList size={24} /></div>
                                <h3>Subjective Tools</h3>
                                <p>Existing tools depend on observation and periodic checks, leading to inconsistent assessments.</p>
                            </div>
                        </RevealOnScroll>
                        <RevealOnScroll delay={300} direction="up" className="h-full">
                            <div className="snapshot-card">
                                <div className="icon-circle"><AlertCircle size={24} /></div>
                                <h3>Consequences</h3>
                                <p>Missed pain leads to suffering; overestimation leads to overtreatment.</p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* 3. WHAT PAINSENSE DOES (SYSTEM FLOW) */}
            <section id="how-it-works" className="section-flow">
                <div className="container">
                    <RevealOnScroll>
                        <div className="section-header-center">
                            <h2>How PainSense Helps Clinicians</h2>
                        </div>
                    </RevealOnScroll>

                    <div className="flow-container">
                        <RevealOnScroll delay={100} direction="right" className="flex-1">
                            <div className="flow-step">
                                <div className="flow-icon"><Camera size={32} /></div>
                                <h4>1. Camera Input</h4>
                                <p>Facial micro-expressions captured passively</p>
                            </div>
                        </RevealOnScroll>

                        <div className="flow-arrow">→</div>

                        <RevealOnScroll delay={300} direction="right" className="flex-1">
                            <div className="flow-step">
                                <div className="flow-icon"><Brain size={32} /></div>
                                <h4>2. AI Analysis</h4>
                                <p>Patterns analyzed in real time on-device</p>
                            </div>
                        </RevealOnScroll>

                        <div className="flow-arrow">→</div>

                        <RevealOnScroll delay={500} direction="right" className="flex-1">
                            <div className="flow-step">
                                <div className="flow-icon"><BarChart2 size={32} /></div>
                                <h4>3. Pain Indicator</h4>
                                <p>Continuous pain status shown to clinicians</p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </section>

            {/* 4. WHO IT IS FOR */}
            <section className="section-audience">
                <div className="container">
                    <RevealOnScroll>
                        <div className="section-header-center">
                            <h2>Designed for Patients Who Are Often Overlooked</h2>
                        </div>
                    </RevealOnScroll>
                    <div className="audience-grid">
                        {[
                            "ICU & Critical Care Patients",
                            "Neonates & Pediatric Care",
                            "Non-Verbal or Cognitively Impaired",
                            "Resource-Limited Healthcare Settings"
                        ].map((item, index) => (
                            <RevealOnScroll key={index} delay={index * 100} direction="up">
                                <div className="audience-card">{item}</div>
                            </RevealOnScroll>
                        ))}
                    </div>
                    <RevealOnScroll delay={400}>
                        <p className="audience-tagline">PainSense improves health access by removing the need for communication.</p>
                    </RevealOnScroll>
                </div>
            </section>

            {/* 5. MINI LIVE MODULE PREVIEW */}
            <section className="section-preview">
                <div className="container">
                    <RevealOnScroll>
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
                                    <div className="rec-indicator">
                                        <div className="rec-dot"></div> REC
                                    </div>
                                    <span>Camera Feed Active</span>
                                    <div className="mock-overlay">Status: Monitoring Active</div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* 6. ETHICS, PRIVACY & SCOPE */}
            <section id="ethics" className="section-ethics">
                <div className="container">
                    <RevealOnScroll>
                        <div className="ethics-box">
                            <h3><Shield className="inline-icon" /> Responsible by Design</h3>
                            <ul>
                                <li>PainSense is a <strong>decision-support prototype</strong>, not a diagnostic tool</li>
                                <li>Designed for <strong>edge-first processing</strong> to protect patient privacy</li>
                                <li>No data stored without consent</li>
                                <li>Clinical validation is a future step</li>
                            </ul>
                        </div>
                    </RevealOnScroll>
                </div>
            </section>

            {/* 7. IMPACT SUMMARY */}
            <section id="impact" className="section-impact">
                <div className="container">
                    <div className="section-header-center">
                        <h2>Impact at a Glance</h2>
                    </div>
                    <div className="impact-grid">
                        <RevealOnScroll delay={100} direction="up"><div className="impact-item"><Activity className="impact-icon" /> Earlier pain detection</div></RevealOnScroll>
                        <RevealOnScroll delay={200} direction="up"><div className="impact-item"><Heart className="impact-icon" /> Reduced clinician burden</div></RevealOnScroll>
                        <RevealOnScroll delay={300} direction="up"><div className="impact-item"><Users className="impact-icon" /> Better care for non-communicative</div></RevealOnScroll>
                        <RevealOnScroll delay={400} direction="up"><div className="impact-item"><Globe className="impact-icon" /> Scalable to low-resource hospitals</div></RevealOnScroll>
                    </div>
                    <p className="impact-footer">Aligned with the mission of improving health access for all.</p>
                </div>
            </section>
        </div>
    );
}