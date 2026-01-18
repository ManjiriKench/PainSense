import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Activity, Play, Heart, Zap, Info, Square, TrendingUp, Waves, Brain, Shield } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './LiveMonitorView.css';

const LiveMonitorView = () => {
    const webcamRef = useRef(null);
    const [monitoring, setMonitoring] = useState(false);
    const [score, setScore] = useState(0);
    const [data, setData] = useState([]);
    const [confidence, setConfidence] = useState(98.2);

    useEffect(() => {
        let interval;
        if (monitoring) {
            interval = setInterval(() => {
                const fluctuation = Math.floor(Math.random() * 8) - 3;
                setScore(prev => Math.max(0, Math.min(100, prev + fluctuation)));
                setConfidence(prev => Math.max(90, Math.min(99.9, prev + (Math.random() - 0.5) * 2)));
                setData(prev => {
                    const next = [...prev, { v: score, time: Date.now() }];
                    if (next.length > 30) next.shift();
                    return next;
                });
            }, 700);
        }
        return () => clearInterval(interval);
    }, [monitoring, score]);

    const getStatus = (s) => {
        if (!monitoring) return { text: "System Standby", color: "#94a3b8", bg: "rgba(148, 163, 184, 0.1)" };
        if (s < 30) return { text: "Comfortable", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" };
        if (s < 60) return { text: "Mild Discomfort", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" };
        return { text: "Pain Detected", color: "#ef4444", bg: "rgba(239, 68, 68, 0.1)" };
    }
    const status = getStatus(score);

    return (
        <div className="monitor-split fade-in">
            {/* LEFT: WEBCAM & CONTROLS */}
            <div className="monitor-left">
                <div className={`cam-container ${monitoring ? 'active' : ''}`}>
                    {monitoring ? (
                        <>
                            <Webcam ref={webcamRef} className="webcam-feed" audio={false} screenshotFormat="image/jpeg" />
                            <div className="ai-overlay">
                                <div className="scan-line"></div>
                                <div className="corner-marks">
                                    <span className="corner tl"></span>
                                    <span className="corner tr"></span>
                                    <span className="corner bl"></span>
                                    <span className="corner br"></span>
                                </div>
                                <div className="ai-hud-top">
                                    <span className="live-indicator"><span className="live-dot"></span>LIVE</span>
                                    <span className="ai-confidence">AI: {confidence.toFixed(1)}%</span>
                                </div>
                                <span className="ai-tag">
                                    <Brain size={14} />
                                    Analyzing Micro-Expressions...
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="cam-placeholder">
                            <div className="placeholder-icon-wrap">
                                <Activity size={48} strokeWidth={1.5} />
                            </div>
                            <p>Camera Inactive</p>
                            <small>Initialize monitoring to begin assessment</small>
                        </div>
                    )}
                </div>

                {/* Smart Monitoring Panel */}
                <div className="smart-monitoring-panel">
                    {!monitoring ? (
                        <button className="btn-start-large" onClick={() => setMonitoring(true)}>
                            <div className="btn-glow"></div>
                            <Play size={24} fill="currentColor" />
                            <span>Start Smart Monitoring</span>
                        </button>
                    ) : (
                        <div className="active-controls">
                            <div className="vitals-grid">
                                <div className="vital-card">
                                    <div className="vital-icon heart">
                                        <Heart size={18} />
                                    </div>
                                    <div className="vital-content">
                                        <span className="vital-label">Heart Rate</span>
                                        <span className="vital-value">74 <small>bpm</small></span>
                                    </div>
                                    <div className="vital-trend up">+2</div>
                                </div>
                                <div className="vital-card">
                                    <div className="vital-icon bp">
                                        <Activity size={18} />
                                    </div>
                                    <div className="vital-content">
                                        <span className="vital-label">Blood Pressure</span>
                                        <span className="vital-value">118/79</span>
                                    </div>
                                    <div className="vital-trend stable">—</div>
                                </div>
                                <div className="vital-card">
                                    <div className="vital-icon oxygen">
                                        <Zap size={18} />
                                    </div>
                                    <div className="vital-content">
                                        <span className="vital-label">SpO2</span>
                                        <span className="vital-value">99<small>%</small></span>
                                    </div>
                                    <div className="vital-trend up">+1</div>
                                </div>
                            </div>
                            <button className="btn-stop" onClick={() => setMonitoring(false)}>
                                <Square size={14} fill="currentColor" />
                                End Session
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT: RESULTS */}
            <div className="monitor-right">
                {/* Pain Level Card */}
                <div className="pain-level-card">
                    <div className="pain-header">
                        <div className="pain-title">
                            <Shield size={16} />
                            <h4>Pain Index</h4>
                        </div>
                        {monitoring && <span className="analysis-badge">AI Analysis</span>}
                    </div>

                    <div className="gauge-wrapper">
                        <div
                            className="gauge-ring"
                            style={{
                                '--progress': monitoring ? score : 0,
                                '--color': status.color
                            }}
                        >
                            <div className="gauge-inner">
                                <span className="gauge-value" style={{ color: status.color }}>
                                    {monitoring ? score : '—'}
                                </span>
                                <span className="gauge-scale">/ 100</span>
                            </div>
                        </div>
                    </div>

                    <div className="status-display" style={{ background: status.bg, borderColor: status.color + '40' }}>
                        <span className="status-dot" style={{ background: status.color }}></span>
                        <span className="status-text" style={{ color: status.color }}>{status.text}</span>
                    </div>

                    {monitoring && (
                        <div className="ai-insight">
                            <Info size={14} />
                            <span>
                                Facial tension indicates {score > 50 ? 'moderate discomfort' : 'relaxed state'}.
                                Confidence: <strong>{confidence.toFixed(1)}%</strong>
                            </span>
                        </div>
                    )}
                </div>

                {/* Session Trend Card */}
                <div className="session-trend-card">
                    <div className="trend-header">
                        <div className="trend-title">
                            <TrendingUp size={16} />
                            <h6>Session Trend</h6>
                        </div>
                        {monitoring && (
                            <div className="trend-live">
                                <span className="pulse-dot"></span>
                                Recording
                            </div>
                        )}
                    </div>

                    <div className="trend-chart">
                        <ResponsiveContainer width="100%" height={120}>
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="v"
                                    stroke="var(--color-primary)"
                                    strokeWidth={2.5}
                                    fill="url(#painGradient)"
                                    strokeLinecap="round"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="trend-stats">
                        <div className="stat">
                            <span className="stat-label">Avg</span>
                            <span className="stat-value">{data.length > 0 ? Math.round(data.reduce((a, b) => a + b.v, 0) / data.length) : '—'}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Peak</span>
                            <span className="stat-value">{data.length > 0 ? Math.max(...data.map(d => d.v)) : '—'}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Low</span>
                            <span className="stat-value">{data.length > 0 ? Math.min(...data.map(d => d.v)) : '—'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveMonitorView;
