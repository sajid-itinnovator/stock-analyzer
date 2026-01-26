import React from 'react';
import { useUser } from '../context/UserContext';
import { profileService } from '../services/api';

const ProfilePage: React.FC = () => {
    const { user, setUser, loading } = useUser();

    if (loading || !user) {
        return <div className="loading-container">Loading profile...</div>;
    }

    const handleNotificationChange = async (type: 'email' | 'push' | 'reports') => {
        const updatedNotifications = {
            ...user.notifications,
            [type]: !user.notifications[type]
        };

        try {
            const response = await profileService.updateProfile({ notifications: updatedNotifications });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to update notifications:', error);
        }
    };

    const handleRiskChange = async (level: number) => {
        try {
            const response = await profileService.updateProfile({
                riskProfile: { ...user.riskProfile, riskLevel: level }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Failed to update risk level:', error);
        }
    };

    const getRiskLabel = (level: number) => {
        const labels = ['Very Conservative', 'Conservative', 'Moderate', 'Aggressive', 'Very Aggressive'];
        return labels[level - 1] || 'Moderate';
    };

    return (
        <div className="profile-view-container">
            <div className="profile-settings-grid">
                {/* Left Column: Account Info */}
                <div className="settings-column">
                    <div className="settings-card">
                        <div className="card-header">Account Information</div>
                        <div className="card-body">
                            <div className="profile-details">
                                <div className="profile-avatar-large">
                                    {user.name.split(' ').map((n: string) => n[0]).join('')}
                                </div>
                                <div className="user-text-details">
                                    <h3 className="profile-name">{user.name}</h3>
                                    <p className="profile-email">{user.email}</p>
                                </div>
                            </div>
                            <button className="edit-profile-btn">Edit Profile</button>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="card-header">Subscription Plan</div>
                        <div className="card-body">
                            <div style={{ marginBottom: '20px' }}>
                                <span className="status-label">Current Plan</span>
                                <span className="plan-badge premium">{user.subscription?.plan?.toUpperCase()} PLAN</span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                                Your subscription is {user.subscription?.status}.
                            </p>
                            <button className="manage-subscription-btn">Manage Subscription</button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preferences */}
                <div className="settings-column">
                    <div className="settings-card">
                        <div className="card-header">Notification Preferences</div>
                        <div className="card-body">
                            <div className="notification-toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-label">Email Alerts</span>
                                    <p className="toggle-description">Receive daily market summaries and stock alerts.</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={user.notifications?.email}
                                        onChange={() => handleNotificationChange('email')}
                                    />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="notification-toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-label">Push Notifications</span>
                                    <p className="toggle-description">Get instant updates on your mobile device.</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={user.notifications?.push}
                                        onChange={() => handleNotificationChange('push')}
                                    />
                                    <span className="slider-round"></span>
                                </label>
                            </div>

                            <div className="notification-toggle-row">
                                <div className="toggle-info">
                                    <span className="toggle-label">Weekly Reports</span>
                                    <p className="toggle-description">Detailed PDF analysis of your watched tickers.</p>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={user.notifications?.reports}
                                        onChange={() => handleNotificationChange('reports')}
                                    />
                                    <span className="slider-round"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="settings-card">
                        <div className="card-header">Investment Profile</div>
                        <div className="card-body">
                            <div className="risk-slider-container">
                                <span className="toggle-label">Risk Tolerance</span>
                                <p className="toggle-description">This helps our AI advisor tailor recommendations to your style.</p>

                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={user.riskProfile?.riskLevel || 3}
                                    className="risk-range-slider"
                                    onChange={(e) => handleRiskChange(parseInt(e.target.value))}
                                />
                                <div className="risk-labels">
                                    <span>Conservative</span>
                                    <span>Aggressive</span>
                                </div>
                            </div>

                            <div className="current-risk-display">
                                <strong>Target Strategy:</strong> {getRiskLabel(user.riskProfile?.riskLevel || 3)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
