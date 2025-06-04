import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import './home.css';

function Home() {
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div className="loader-wrapper">
                <div className="spinner"></div>
                <p className="loading-text">Loading...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="home">
            <nav className="nav">
                <div className="nav-container">
                    <div className="logo">
                        <span className="logo-icon"></span>
                        WIoT Dashboard
                    </div>
                    <button className="sign-in" onClick={loginWithRedirect}>
                        Sign In
                    </button>
                </div>
            </nav>

            <section className="hero">
                <div className="hero-text">
                    <h1>Smart IoT Management <span>Made Simple</span></h1>
                    <p>
                        Monitor, control, and analyze your IoT devices from a single, powerful dashboard.
                        Get real-time insights and maintain complete control over your connected ecosystem.
                    </p>
                    <div className="hero-buttons">
                        <button className="primary" onClick={loginWithRedirect}>Get Started Now</button>
                        <button className="outline">Learn More</button>
                    </div>
                </div>
            </section>

            <section className="features">
                <h2>Powerful Features</h2>
                <p className="features-subtitle">
                    Everything you need to manage your IoT infrastructure efficiently
                </p>
                <div className="features-grid">
                    {/* Real-time Analytics */}
                    <div className="feature">
                        <img
                            src="https://raw.githubusercontent.com/padmanabh10/iot_dashboard/refs/heads/master/frontend/src/assets/data-analytics.png?token=GHSAT0AAAAAADCSQKLPA6BMMEQJTEIGXQFQ2B77WLA"
                            className="icon"
                         />
                        <h3>Real-time Analytics</h3>
                        <p>Monitor device performance and data patterns with live analytics and customizable
                            dashboards.</p>
                    </div>

                    {/* Secure Access Control */}
                    <div className="feature">
                        <img
                            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop&auto=format"
                            alt="Secure Access Control"
                            className="icon"
                        />
                        <h3>Secure Access Control</h3>
                        <p>Role-based authentication ensures only authorized users can access specific devices and
                            data.</p>
                    </div>

                    {/* Instant Alerts */}
                    <div className="feature">
                        <img
                            src="https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=400&h=300&fit=crop&auto=format"
                            alt="Instant Alerts"
                            className="icon"
                        />
                        <h3>Instant Alerts</h3>
                        <p>Get notified immediately when devices go offline or performance metrics exceed
                            thresholds.</p>
                    </div>

                    {/* Multi-Device Support */}
                    <div className="feature">
                        <img
                            src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format"
                            alt="Multi-Device Support"
                            className="icon"
                        />
                        <h3>Multi-Device Support</h3>
                        <p>Manage cameras, sensors, gateways, and more from a single unified interface.</p>
                    </div>

                    {/* Mobile Responsive */}
                    <div className="feature">
                        <img
                            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&auto=format"
                            alt="Mobile Responsive"
                            className="icon"
                        />
                        <h3>Mobile Responsive</h3>
                        <p>Access your dashboard from any device with our fully responsive design.</p>
                    </div>

                    {/* Easy Configuration */}
                    <div className="feature">
                        <img
                            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop&auto=format"
                            alt="Easy Configuration"
                            className="icon"
                        />
                        <h3>Easy Configuration</h3>
                        <p>Simple setup and configuration tools make device management effortless.</p>
                    </div>

                    {/* Extra features shown only on xl+ screens */}
                            <div className="feature feature-xl-only">
                                <img
                                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop&auto=format"
                                    alt="AI-Powered Insights"
                                    className="icon"
                                />
                                <h3>AI-Powered Insights</h3>
                                <p>Leverage machine learning to detect anomalies and optimize device behavior.</p>
                            </div>
                            <div className="feature feature-xl-only">
                                <img
                                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&auto=format"
                                    alt="Data Export & Reports"
                                    className="icon"
                                />
                                <h3>Data Export & Reports</h3>
                                <p>Export historical data and generate detailed reports for auditing or compliance.</p>
                            </div>
                </div>
            </section>

            <section className="cta">
                <h2>Ready to get started?</h2>
                <p>Join thousands of users who trust our platform for their IoT management needs.</p>
                <button className="primary" onClick={loginWithRedirect}>Start Free Trial</button>
            </section>

            <footer className="footer">
                <p>© 2025 WIoT Dashboard. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Home;
