import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import './Dashboard.css';
import axios from "axios";

function Dashboard() {
    const { user, isAuthenticated, isLoading, logout } = useAuth0();
    const [deviceCount, setDeviceCount] = useState(0);
    const [activeAlerts, setActiveAlerts] = useState(0);
    const [mounted, setMounted] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (isAuthenticated && user) {
            const saveUser = async () => {
                try {
                    await axios.post('http://localhost:5000/api/users', {
                        auth0Id: user.sub,
                        name: user.name,
                        email: user.email,
                        picture: user.picture,
                        roles: user['https://my-app.example.com/roles'] || ['user']
                    });
                } catch (err) {
                    console.error('Error saving user:', err);
                }
            };

            saveUser();
        }
        setMounted(true);
        // Simulate counting animation
        const deviceTimer = setInterval(() => {
            setDeviceCount(prev => prev < 24 ? prev + 1 : 24);
        }, 100);

        const alertTimer = setInterval(() => {
            setActiveAlerts(prev => prev < 3 ? prev + 1 : 3);
        }, 150);

        return () => {
            clearInterval(deviceTimer);
            clearInterval(alertTimer);
        };
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <p className="loading-text">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Extract roles from namespaced claim
    const roles = user?.['https://my-app.example.com/roles'] || [];
    const isAdmin = roles.includes('admin');

    const deviceData = [
        { name: 'Temperature Sensors', count: 8, status: 'online', icon: '🌡️', color: '#ef4444' },
        { name: 'Smart Cameras', count: 6, status: 'online', icon: '📹', color: '#10b981' },
        { name: 'IoT Gateways', count: 4, status: 'online', icon: '📡', color: '#3b82f6' },
        { name: 'Motion Detectors', count: 6, status: 'maintenance', icon: '🎯', color: '#f59e0b' }
    ];

    const stats = [
        { label: 'Active Devices', value: deviceCount, max: 24, color: '#10b981' },
        { label: 'Data Processed', value: '2.4TB', subtext: 'This month', color: '#3b82f6' },
        { label: 'System Uptime', value: '99.8%', subtext: 'Last 30 days', color: '#10b981' },
        { label: 'Active Alerts', value: activeAlerts, max: 3, color: '#ef4444' }
    ];

    const adminStats = [
        { label: 'Total Users', value: '156', color: '#8b5cf6' },
        { label: 'System Load', value: '23%', color: '#ef4444' },
        { label: 'Server Status', value: 'Healthy', color: '#10b981' },
        { label: 'Backup Status', value: 'Complete', color: '#3b82f6' }
    ];

    return (
        <div className="dashboard-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-content">
                    <div className="brand">
                        <span className="brand-icon"></span>
                        WIoT Dashboard
                    </div>

                    {/* Desktop Navigation */}
                    <div className="nav-actions desktop-nav">
                        <button className="icon-button">🔔</button>
                        <button className="icon-button">⚙️</button>
                        <img
                            src={user?.picture}
                            alt="Profile"
                            className="profile-image"
                        />
                        <button
                            onClick={() => logout({logoutParams: { returnTo: window.location.origin }})}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile Hamburger Menu */}
                    <button
                        className="hamburger-menu mobile-only"
                        onClick={toggleSidebar}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${sidebarOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${sidebarOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${sidebarOpen ? 'open' : ''}`}></span>
                    </button>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-brand">
                        <span className="brand-icon"></span>
                        WIoT Dashboard
                    </div>
                    <button className="sidebar-close" onClick={closeSidebar}>✕</button>
                </div>

                <div className="sidebar-content">
                    <div className="sidebar-user-info">
                        <img
                            src={user?.picture}
                            alt="Profile"
                            className="sidebar-profile-image"
                        />
                        <div className="sidebar-user-details">
                            <p className="sidebar-user-name">{user?.name}</p>
                            <p className="sidebar-user-email">{user?.email}</p>
                            <p className="sidebar-user-role">
                                {isAdmin ? 'Admin' : 'User'}
                            </p>
                        </div>
                    </div>

                    <div className="sidebar-actions">
                        <button className="sidebar-action-button">
                            <span className="sidebar-action-icon">🔔</span>
                            Notifications
                        </button>
                        <button className="sidebar-action-button">
                            <span className="sidebar-action-icon">⚙️</span>
                            Settings
                        </button>
                        <button
                            onClick={() => {
                                logout({logoutParams: { returnTo: window.location.origin }});
                                closeSidebar();
                            }}
                            className="sidebar-logout-button"
                        >
                            <span className="sidebar-action-icon">🚪</span>
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="main-content">
                {/* Welcome Section */}
                <div className={`welcome-section ${mounted ? 'fade-in' : ''}`}>
                    <h1 className="welcome-title">
                        Welcome back, {user?.name}!
                    </h1>
                    <p className="welcome-subtitle">
                        {isAdmin ? 'Admin Dashboard - Full System Access' : 'Your Personal IoT Control Center'}
                    </p>
                    <div className="user-info">
                        <p className="user-detail">
                            <strong>Email:</strong> {user?.email}
                        </p>
                        <p className="user-detail">
                            <strong>Roles:</strong> {roles.length > 0 ? roles.join(', ') : 'user'}
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                {!isAdmin && (<div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className={`stat-card ${mounted ? 'slide-in' : ''}`}
                             style={{
                                 animationDelay: `${index * 0.1}s`,
                                 '--stat-color': stat.color
                             }}>
                            <div className="stat-value">
                                {stat.value}
                            </div>
                            <div className="stat-label">
                                {stat.label}
                            </div>
                            {stat.subtext && (
                                <div className="stat-subtext">
                                    {stat.subtext}
                                </div>
                            )}
                            {stat.max && (
                                <div className="progress-bar">
                                    <div className="progress-fill"
                                         style={{
                                             width: `${(stat.value / stat.max) * 100}%`,
                                             backgroundColor: stat.color
                                         }}>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                )}

                {/* Admin Panel */}
                {isAdmin && (
                    <div className="admin-panel">
                        <h2 className="admin-title">
                            Admin Control Panel
                        </h2>
                        <div className="admin-stats-grid">
                            {adminStats.map((stat, index) => (
                                <div key={index} className="admin-stat-card">
                                    <div className="admin-stat-value" style={{ color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div className="admin-stat-label">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="admin-actions">
                            <h3 className="admin-actions-title">
                                Admin Actions
                            </h3>
                            <p className="admin-actions-desc">
                                You have full access to system administration, user management, and global device control.
                            </p>
                            <div className="admin-buttons">
                                <button className="admin-button admin-button-red">
                                    👥 Manage Users
                                </button>
                                <button className="admin-button admin-button-blue">
                                    🔧 System Settings
                                </button>
                                <button className="admin-button admin-button-green">
                                    ✅ System Health Check
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Devices List */}
                {!isAdmin && (<div className="devices-section">
                    <h2 className="devices-title">
                        Your Devices
                    </h2>
                    <div className="devices-grid">
                        {deviceData.map((device, index) => (
                            <div key={index} className="device-card">
                                <div className="device-icon">
                                    {device.icon}
                                </div>
                                <div className="device-name">
                                    {device.name}
                                </div>
                                <div className={`device-status ${device.status}`}>
                                    {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                                </div>
                                <div className="device-count">
                                    Devices: {device.count}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;