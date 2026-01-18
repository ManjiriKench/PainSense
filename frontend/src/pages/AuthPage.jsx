import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Stethoscope, ArrowRight, Activity } from 'lucide-react';
import './AuthPage.css';

export default function AuthPage() {
    const navigate = useNavigate();
    const [role, setRole] = useState('nurse'); // nurse | doctor | patient
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (role === 'patient') {
                // Patient flow
                localStorage.removeItem('role');
                navigate('/portal');
            } else {
                // Medical flow: nurse OR doctor
                localStorage.setItem('role', role); // 'nurse' or 'doctor'
                navigate('/app');
            }
        }, 1500);
    };


    return (
        <div className="auth-container">
            {/* Animated Background */}
            <div className="auth-bg-pattern"></div>

            <div className="auth-card">
                <div className="auth-header">
                    <div className="brand-logo anim-pop">
                        <Activity size={32} className="text-primary" />
                    </div>
                    <h2 className="anim-fade-up">Welcome to PainSense</h2>
                    <p className="anim-fade-up delay-1">Secure Clinical Decision Support System</p>
                </div>

                {/* ROLE SELECTION */}
                <div className="role-switch anim-fade-up delay-2">
                    <button
                        type="button"
                        className={`role-btn ${role === 'nurse' ? 'active' : ''}`}
                        onClick={() => setRole('nurse')}
                    >
                        <Stethoscope size={20} />
                        <span>Nurse / Staff</span>
                    </button>

                    <button
                        type="button"
                        className={`role-btn ${role === 'doctor' ? 'active' : ''}`}
                        onClick={() => setRole('doctor')}
                    >
                        <Stethoscope size={20} />
                        <span>Doctor</span>
                    </button>

                    <button
                        type="button"
                        className={`role-btn ${role === 'patient' ? 'active' : ''}`}
                        onClick={() => setRole('patient')}
                    >
                        <User size={20} />
                        <span>Patient / Family</span>
                    </button>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleLogin} className="auth-form anim-fade-up delay-3">
                    <div className="form-group">
                        <label>
                            {role === 'patient'
                                ? 'Patient MRN or Phone'
                                : 'Hospital ID / Email'}
                        </label>
                        <input
                            type="text"
                            placeholder={
                                role === 'patient'
                                    ? 'e.g. 8829-11'
                                    : 'staff@hospital.org'
                            }
                            required
                        />
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

                <div className="auth-footer anim-fade-up delay-4">
                    <p>Protected by end-to-end encryption. <br />By logging in, you agree to our <u>Terms of Service</u>.</p>
                </div>
            </div>
        </div>
    );
}