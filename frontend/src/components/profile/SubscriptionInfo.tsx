import React from 'react';

const SubscriptionInfo: React.FC = () => {
    return (
        <div className="settings-card subscription-card">
            <div className="card-header">Subscription Management</div>
            <div className="card-body">
                <div className="subscription-status">
                    <span className="status-label">Current Plan</span>
                    <span className="plan-badge premium">PRO PLAN</span>
                </div>
                <div className="subscription-details">
                    <p>Next billing date: <strong>Feb 24, 2026</strong></p>
                </div>
                <button className="manage-subscription-btn">Manage Subscription</button>
            </div>
        </div>
    );
};

export default SubscriptionInfo;
