import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import '../../pages/LandingPage.css'; // Corrected path to styles

export default function PublicLayout() {
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    return (
        <div className="landing-page"> {/* This class provides font and reset contexts */}

            {/* 1. TOP HEADER / NAV BAR */}
            <nav className="landing-nav">
                <div className="nav-left">
                    {/* Placeholder Hospital Logo Icon */}
                    <div className="hospital-logo-placeholder">H</div>
                    <span className="brand-name">PainSense</span>
                </div>
                <div className="nav-right">
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
                    <Link to="/#how-it-works" className="nav-link">How It Works</Link>
                    <Link to="/#impact" className="nav-link">Impact</Link>
                    <Link to="/#ethics" className="nav-link">Ethics & Privacy</Link>
                </div>
            </nav>

            {/* Main Content (Outlet) */}
            <main style={{ minHeight: 'calc(100vh - 140px)' }}>
                <Outlet />
            </main>

            {/* 9. FOOTER */}
            <footer className="main-footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">PainSense – Health Hackathon 2026</div>
                        <div className="footer-credits">Prototype developed for VIT Bhopal x Johns Hopkins University</div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
