import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Activity } from 'lucide-react';
import './PublicLayout.css'; // New dedicated premium CSS

export default function PublicLayout() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Effect to handle glassmorphism on scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="public-layout">
            {/* 1. TOP HEADER / NAV BAR 
               'scrolled' class triggers the blurred glass effect
            */}
            <nav className={`premium-nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-container-wide">

                    {/* LEFT: Logo & Brand (Larger & pushed left) */}
                    <Link to="/" className="nav-left">
                        <div className="logo-box">
                            <Activity size={26} color="white" strokeWidth={2.5} />
                        </div>
                        <span className="brand-text">PainSense</span>
                    </Link>

                    {/* RIGHT: Navigation & Login (Pushed right) */}
                    <div className="nav-right">
                        <div className="nav-links">
                            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                            <Link to="/#how-it-works" className="nav-link">How It Works</Link>
                            <Link to="/#impact" className="nav-link">Impact</Link>
                            <Link to="/#ethics" className="nav-link">Ethics</Link>
                        </div>

                        <div className="nav-divider"></div>

                        <Link to="/login" className="nav-btn-login">
                            Login Portal
                        </Link>
                    </div>
                </div>
            </nav>

            {/* MAIN CONTENT WRAPPER */}
            <main className="layout-content">
                <Outlet />
            </main>

            {/* 9. FOOTER */}
            <footer className="premium-footer">
                <div className="footer-container">
                    <div className="footer-top">
                        <div className="footer-brand-group">
                            <div className="footer-logo">
                                <Activity size={20} /> PainSense
                            </div>
                            <p className="footer-tagline">
                                Advancing objective pain assessment for the voiceless.
                            </p>
                        </div>
                        <div className="footer-links-group">
                            <Link to="/about">About Project</Link>
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        </div>
                    </div>

                    <div className="footer-divider"></div>

                    <div className="footer-bottom">
                        <span>© 2026 Health Hackathon Prototype</span>
                        <span className="footer-credits">Developed for VIT Bhopal x Johns Hopkins University</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}