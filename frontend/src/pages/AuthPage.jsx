import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight } from 'lucide-react';
import './AuthPage.css';

export default function AuthPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('medical'); // 'medical' or 'patient'
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            if (role === 'medical') {
                navigate('/app');
            } else {
                navigate('/portal');
            }
        }, 1500);
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome to PainSense</h2>
                    <p>Please select your portal to continue</p>
                </div>

                <div className="role-switch">
                    <button
                        className={`role-btn ${role === 'medical' ? 'active' : ''}`}
                        onClick={() => setRole('medical')}
                    >
                        <Stethoscope size={24} />
                        <span>Medical Staff</span>
                    </button>
                    <button
                        className={`role-btn ${role === 'patient' ? 'active' : ''}`}
                        onClick={() => setRole('patient')}
                    >
                        <User size={24} />
                        <span>Patient / Family</span>
                    </button>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label>{role === 'medical' ? 'Hospital ID / Email' : 'Patient MRN or Phone'}</label>
                        <input type="text" placeholder={role === 'medical' ? 'nurse.sarah@hospital.org' : 'ex: 8829-11'} required />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" placeholder="••••••••" required />
                    </div>

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Secure Login'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Protected by 256-bit HIPAA Compliant Encryption</p>
                </div>
            </div>
        </div>
    );
}
