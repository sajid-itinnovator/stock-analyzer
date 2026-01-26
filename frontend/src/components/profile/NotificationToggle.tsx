import React from 'react';

interface NotificationToggleProps {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({ label, description, enabled, onChange }) => {
    return (
        <div className="notification-toggle-row">
            <div className="toggle-info">
                <label className="toggle-label">{label}</label>
                <p className="toggle-description">{description}</p>
            </div>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="slider-round"></span>
            </label>
        </div>
    );
};

export default NotificationToggle;
