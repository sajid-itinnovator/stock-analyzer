import React from 'react';

const ProfileCard: React.FC = () => {

    return (
        <div className="settings-card profile-card">
            <div className="card-header">Account Details</div>
            <div className="card-body">
                <div className="profile-details">
                    <div className="profile-avatar-large">👤</div>
                    <div className="profile-info">
                        <h3 className="profile-name">John Doe</h3>
                        <p className="profile-email">john.doe@example.com</p>
                    </div>
                </div>
                <button className="edit-profile-btn">Edit Profile</button>
            </div>
        </div>
    );
};

export default ProfileCard;
